// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer, request, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";

const MCP_DIR = path.resolve(__dirname, "../../apps/mcp");
const TSX = path.join(MCP_DIR, "node_modules/.bin/tsx");
const ENTRY = path.join(MCP_DIR, "src/index.ts");

// Stub of the LastSearch API: records request bodies, returns canned results.
const calls: Array<{ path: string; body: Record<string, unknown> }> = [];
let api: Server;
let apiUrl: string;

beforeAll(async () => {
  api = createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      calls.push({ path: req.url || "", body: raw ? JSON.parse(raw) : {} });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          result: { answer: "ok", sources: [{ url: "https://example.com", content: "a".repeat(25_000) }] },
        }),
      );
    });
  });
  await new Promise<void>((r) => api.listen(0, "127.0.0.1", () => r()));
  apiUrl = `http://127.0.0.1:${(api.address() as AddressInfo).port}/api`;
});

afterAll(() => {
  api?.close();
});

class StdioClient {
  child: ChildProcess;
  private buf = "";
  private waiters = new Map<number, (msg: any) => void>();
  private nextId = 1;

  constructor(env: Record<string, string>) {
    this.child = spawn(TSX, [ENTRY], { env: { ...process.env, MCP_HTTP_PORT: "", ...env }, stdio: ["pipe", "pipe", "pipe"] });
    this.child.stdout!.on("data", (d) => {
      this.buf += d.toString();
      let i;
      while ((i = this.buf.indexOf("\n")) >= 0) {
        const line = this.buf.slice(0, i);
        this.buf = this.buf.slice(i + 1);
        if (!line.trim()) continue;
        const msg = JSON.parse(line);
        if (msg.id !== undefined) this.waiters.get(msg.id)?.(msg);
      }
    });
  }

  rpc(method: string, params: unknown): Promise<any> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout: ${method}`)), 20_000);
      this.waiters.set(id, (m) => {
        clearTimeout(t);
        resolve(m);
      });
      this.child.stdin!.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    });
  }

  async init() {
    await this.rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "t", version: "0" } });
    this.child.stdin!.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  }
}

describe("MCP tools (stdio)", () => {
  let client: StdioClient;

  beforeAll(async () => {
    client = new StdioClient({ LASTSEARCH_API_KEY: "ls_test_placeholder", LASTSEARCH_API_URL: apiUrl });
    await client.init();
  }, 30_000);

  afterAll(() => client?.child.kill());

  it("forwards strict on answer", async () => {
    calls.length = 0;
    const r = await client.rpc("tools/call", { name: "answer", arguments: { query: "test", strict: true } });
    expect(r.result.isError).toBeFalsy();
    expect(calls[0].path).toBe("/api/browse/answer");
    expect(calls[0].body.strict).toBe(true);
  });

  it("omits strict when not requested", async () => {
    calls.length = 0;
    await client.rpc("tools/call", { name: "answer", arguments: { query: "test" } });
    expect(calls[0].body.strict).toBeUndefined();
  });

  it("labels web content and caps long page text", async () => {
    const r = await client.rpc("tools/call", { name: "search", arguments: { query: "test" } });
    const text: string = r.result.content[0].text;
    expect(text.startsWith("[LastSearch result]")).toBe(true);
    expect(text).toContain("untrusted data");
    expect(text).toContain("[truncated: 5000 more characters]");
  });

  it("rejects malformed ids before calling the API", async () => {
    calls.length = 0;
    const r = await client.rpc("tools/call", { name: "session_ask", arguments: { session_id: "../browse/x", query: "q" } });
    const failed = r.error !== undefined || r.result?.isError === true;
    expect(failed).toBe(true);
    expect(calls.length).toBe(0);
  });

  it("rejects non-http URLs", async () => {
    calls.length = 0;
    const r = await client.rpc("tools/call", { name: "open", arguments: { url: "file:///etc/passwd" } });
    const failed = r.error !== undefined || r.result?.isError === true;
    expect(failed).toBe(true);
    expect(calls.length).toBe(0);
  });
});

describe("MCP API URL", () => {
  it("refuses a plain-http API URL that isn't local", async () => {
    const child = spawn(TSX, [ENTRY], {
      env: { ...process.env, LASTSEARCH_API_KEY: "ls_test_placeholder", LASTSEARCH_API_URL: "http://api.example.com/api", MCP_HTTP_PORT: "" },
      stdio: ["pipe", "ignore", "pipe"],
    });
    const code = await new Promise<number | null>((r) => child.on("exit", r));
    expect(code).toBe(1);
  }, 30_000);
});

describe("hosted MCP function", () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    process.env.LASTSEARCH_API_URL = apiUrl;
    const mod = await import("../../api/mcp");
    server = createServer((req, res) => void mod.default(req, res));
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
    port = (server.address() as AddressInfo).port;
  });

  afterAll(() => server?.close());

  function post(body: unknown, headers: Record<string, string> = {}) {
    return new Promise<{ status: number; body: string; headers: Record<string, unknown> }>((resolve, reject) => {
      const req = request(
        {
          host: "127.0.0.1",
          port,
          method: "POST",
          path: "/api/mcp",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
            "X-API-Key": "ls_test_placeholder",
            ...headers,
          },
        },
        (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () => resolve({ status: res.statusCode ?? 0, body: d, headers: res.headers }));
        },
      );
      req.on("error", reject);
      req.end(JSON.stringify(body));
    });
  }

  it("does not reflect the request Origin", async () => {
    const r = await post({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }, { Origin: "https://evil.example" });
    expect(r.headers["access-control-allow-origin"]).toBe("*");
  });

  it("forwards strict and labels output", async () => {
    calls.length = 0;
    const r = await post({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "answer", arguments: { query: "q", strict: true } } });
    expect(r.status).toBe(200);
    expect(calls[0].body.strict).toBe(true);
    expect(r.body).toContain("[LastSearch result]");
  });
});
