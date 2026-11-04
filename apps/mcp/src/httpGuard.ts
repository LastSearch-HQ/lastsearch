// Request checks for the HTTP transport.
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage } from "node:http";

export const DEFAULT_HTTP_HOST = "127.0.0.1";
export const MAX_BODY_BYTES = 1024 * 1024; // 1 MB
export const MIN_TOKEN_LENGTH = 16;

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);

/** Strips brackets and port from a Host header value / URL host. */
export function bareHost(host: string): string {
  const h = host.trim().toLowerCase();
  if (h.startsWith("[")) {
    const end = h.indexOf("]");
    return end === -1 ? h : h.slice(1, end);
  }
  return h.replace(/:\d+$/, "");
}

export function isLoopbackName(host: string): boolean {
  return LOOPBACK.has(bareHost(host));
}

/** Reads `--host <value>` or `--host=<value>` from argv. Returns undefined when absent. */
export function parseHostArg(argv: string[]): string | undefined {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--host") {
      const v = argv[i + 1];
      return v && !v.startsWith("--") ? v : undefined;
    }
    if (a.startsWith("--host=")) return a.slice("--host=".length) || undefined;
  }
  return undefined;
}

export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

function digest(s: string): Buffer {
  return createHash("sha256").update(s).digest();
}

export function tokenMatches(authorization: string | undefined, token: string): boolean {
  if (!authorization) return false;
  const m = /^Bearer\s+(.+)$/i.exec(authorization.trim());
  if (!m) return false;
  return timingSafeEqual(digest(m[1].trim()), digest(token));
}

export interface GuardOptions {
  token: string;
  /** Bind host. When it is not a loopback name, the Host header check is skipped. */
  bindHost: string;
}

export type GuardResult = { ok: true } | { ok: false; status: number; error: string };

export function checkRequest(req: Pick<IncomingMessage, "headers">, opts: GuardOptions): GuardResult {
  const host = req.headers.host;
  const origin = req.headers.origin;

  if (isLoopbackName(opts.bindHost)) {
    if (!host || !isLoopbackName(host)) return { ok: false, status: 403, error: "Forbidden host" };
  } else if (!host) {
    return { ok: false, status: 400, error: "Missing Host header" };
  }

  if (origin !== undefined) {
    let originHost: string;
    try {
      const u = new URL(origin);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("scheme");
      originHost = u.host.toLowerCase();
    } catch {
      return { ok: false, status: 403, error: "Forbidden origin" };
    }
    const sameOrigin = !!host && originHost === host.trim().toLowerCase();
    if (!isLoopbackName(originHost) && !sameOrigin) {
      return { ok: false, status: 403, error: "Forbidden origin" };
    }
  }

  const auth = req.headers.authorization;
  if (!tokenMatches(Array.isArray(auth) ? auth[0] : auth, opts.token)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  return { ok: true };
}

export class BodyTooLargeError extends Error {}

/** Reads the request body up to `limit` bytes. */
export function readBody(req: IncomingMessage, limit = MAX_BODY_BYTES): Promise<string> {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers["content-length"]);
    if (Number.isFinite(declared) && declared > limit) {
      reject(new BodyTooLargeError());
      return;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    let done = false;
    req.on("data", (chunk: Buffer) => {
      if (done) return;
      size += chunk.length;
      if (size > limit) {
        done = true;
        reject(new BodyTooLargeError());
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!done) {
        done = true;
        resolve(Buffer.concat(chunks).toString("utf8"));
      }
    });
    req.on("error", (e) => {
      if (!done) {
        done = true;
        reject(e);
      }
    });
  });
}
