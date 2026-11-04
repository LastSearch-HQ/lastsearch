// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { request } from "node:http";
import { createServer } from "node:net";
import path from "node:path";
import { checkRequest, parseHostArg, tokenMatches } from "../../apps/mcp/src/httpGuard";

const MCP_DIR = path.resolve(__dirname, "../../apps/mcp");
const TSX = path.join(MCP_DIR, "node_modules/.bin/tsx");
const ENTRY = path.join(MCP_DIR, "src/index.ts");
const TOKEN = "test-token-0123456789abcdef";

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, "127.0.0.1", () => {
      const addr = srv.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

interface Started {
  child: ChildProcess;
  stderr: () => string;
}

function startHttp(port: number, extraEnv: Record<string, string> = {}): Promise<Started> {
  return new Promise((resolve, reject) => {
    const child = spawn(TSX, [ENTRY, "--http"], {
      env: {
        ...process.env,
        LASTSEARCH_API_KEY: "ls_test_placeholder",
        LASTSEARCH_API_URL: "http://127.0.0.1:9/api",
        MCP_HTTP_PORT: String(port),
        LASTSEARCH_HTTP_TOKEN: "",
        ...extraEnv,
      },
      stdio: ["ignore", "ignore", "pipe"],
    });
    let err = "";
    const timer = setTimeout(() => reject(new Error(`server did not start: ${err}`)), 20_000);
    child.stderr!.on("data", (d) => {
      err += d.toString();
      if (/requests need/.test(err) && /running on http/.test(err)) {
        clearTimeout(timer);
        // give the final log line a moment to flush
        setTimeout(() => resolve({ child, stderr: () => err }), 50);
      }
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`server exited ${code}: ${err}`));
    });
  });
}

function send(
  port: number,
  opts: { method?: string; path?: string; headers?: Record<string, string>; body?: string },
): Promise<{ status: number; body: string; headers: Record<string, string | string[] | undefined> }> {
  return new Promise((resolve, reject) => {
    const req = request(
      { host: "127.0.0.1", port, method: opts.method ?? "GET", path: opts.path ?? "/health", headers: opts.headers },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body: data, headers: res.headers }));
      },
    );
    req.on("error", reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

const INIT = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "0" } },
});

describe("httpGuard", () => {
  it("parses --host", () => {
    expect(parseHostArg(["--http"])).toBeUndefined();
    expect(parseHostArg(["--http", "--host", "0.0.0.0"])).toBe("0.0.0.0");
    expect(parseHostArg(["--host=::1"])).toBe("::1");
    expect(parseHostArg(["--host", "--http"])).toBeUndefined();
  });

  it("compares bearer tokens", () => {
    expect(tokenMatches(`Bearer ${TOKEN}`, TOKEN)).toBe(true);
    expect(tokenMatches(`bearer ${TOKEN}`, TOKEN)).toBe(true);
    expect(tokenMatches("Bearer nope", TOKEN)).toBe(false);
    expect(tokenMatches(TOKEN, TOKEN)).toBe(false);
    expect(tokenMatches(undefined, TOKEN)).toBe(false);
  });

  it("checks Host only on loopback binds, Origin always", () => {
    const auth = `Bearer ${TOKEN}`;
    const loop = { token: TOKEN, bindHost: "127.0.0.1" };
    const wide = { token: TOKEN, bindHost: "0.0.0.0" };
    expect(checkRequest({ headers: { host: "127.0.0.1:3100", authorization: auth } }, loop).ok).toBe(true);
    expect(checkRequest({ headers: { host: "[::1]:3100", authorization: auth } }, loop).ok).toBe(true);
    expect(checkRequest({ headers: { host: "evil.example", authorization: auth } }, loop)).toMatchObject({ status: 403 });
    expect(checkRequest({ headers: { host: "evil.example", authorization: auth } }, wide).ok).toBe(true);
    expect(checkRequest({ headers: { host: "10.0.0.5:3100" } }, wide)).toMatchObject({ status: 401 });
    expect(
      checkRequest({ headers: { host: "10.0.0.5:3100", origin: "https://evil.example", authorization: auth } }, wide),
    ).toMatchObject({ status: 403 });
    expect(
      checkRequest({ headers: { host: "10.0.0.5:3100", origin: "http://10.0.0.5:3100", authorization: auth } }, wide).ok,
    ).toBe(true);
  });
});

describe("MCP HTTP transport", () => {
  let port: number;
  let server: Started;

  beforeAll(async () => {
    port = await freePort();
    server = await startHttp(port, { LASTSEARCH_HTTP_TOKEN: TOKEN });
  }, 30_000);

  afterAll(() => {
    server?.child.kill();
  });

  it("does not print a token supplied via env", () => {
    expect(server.stderr()).not.toContain(TOKEN);
  });

  it("rejects a missing token", async () => {
    const r = await send(port, {});
    expect(r.status).toBe(401);
    expect(r.headers["www-authenticate"]).toBe("Bearer");
  });

  it("rejects a wrong token", async () => {
    const r = await send(port, { headers: { Authorization: "Bearer wrong-token-wrong-token" } });
    expect(r.status).toBe(401);
    const m = await send(port, {
      method: "POST",
      path: "/mcp",
      headers: { Authorization: "Bearer wrong", "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: INIT,
    });
    expect(m.status).toBe(401);
  });

  it("accepts the right token", async () => {
    const r = await send(port, { headers: { Authorization: `Bearer ${TOKEN}` } });
    expect(r.status).toBe(200);
    expect(JSON.parse(r.body).status).toBe("ok");
  });

  it("refuses a foreign Host", async () => {
    const r = await send(port, { headers: { Authorization: `Bearer ${TOKEN}`, Host: "evil.example" } });
    expect(r.status).toBe(403);
  });

  it("refuses a foreign Origin", async () => {
    const r = await send(port, { headers: { Authorization: `Bearer ${TOKEN}`, Origin: "https://evil.example" } });
    expect(r.status).toBe(403);
  });

  it("allows a loopback Origin", async () => {
    const r = await send(port, { headers: { Authorization: `Bearer ${TOKEN}`, Origin: `http://localhost:${port}` } });
    expect(r.status).toBe(200);
  });

  it("limits body size", async () => {
    const r = await send(port, {
      method: "POST",
      path: "/mcp",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: "x".repeat(1024 * 1024 + 10),
    });
    expect(r.status).toBe(413);
  });

  it("initializes an MCP session with the token", async () => {
    const r = await send(port, {
      method: "POST",
      path: "/mcp",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: INIT,
    });
    expect(r.status).toBe(200);
    expect(r.headers["mcp-session-id"]).toBeTruthy();
    expect(r.body).toContain("serverInfo");
  });
});

describe("MCP HTTP transport without a configured token", () => {
  it("generates one per launch and requires it", async () => {
    const port = await freePort();
    const s = await startHttp(port);
    try {
      const m = /Authorization: Bearer ([A-Za-z0-9_-]{20,})/.exec(s.stderr());
      expect(m).toBeTruthy();
      expect((await send(port, {})).status).toBe(401);
      expect((await send(port, { headers: { Authorization: `Bearer ${m![1]}` } })).status).toBe(200);
    } finally {
      s.child.kill();
    }
  }, 30_000);
});

describe("MCP stdio transport", () => {
  it("still answers initialize over stdio", async () => {
    const child = spawn(TSX, [ENTRY], {
      env: {
        ...process.env,
        LASTSEARCH_API_KEY: "ls_test_placeholder",
        LASTSEARCH_API_URL: "http://127.0.0.1:9/api",
        MCP_HTTP_PORT: "",
      },
      stdio: ["pipe", "pipe", "pipe"],
    });
    try {
      const out = await new Promise<string>((resolve, reject) => {
        let buf = "";
        const timer = setTimeout(() => reject(new Error("no stdio response")), 20_000);
        child.stdout!.on("data", (d) => {
          buf += d.toString();
          if (buf.includes("\n")) {
            clearTimeout(timer);
            resolve(buf);
          }
        });
        child.stdin!.write(INIT + "\n");
      });
      const msg = JSON.parse(out.split("\n")[0]);
      expect(msg.id).toBe(1);
      expect(msg.result.serverInfo.name).toBe("lastsearch");
    } finally {
      child.kill();
    }
  }, 30_000);
});
