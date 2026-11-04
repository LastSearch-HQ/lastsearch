import { describe, it, expect } from "vitest";
import { safeHref, isValidId, pathId } from "./safe";

describe("safeHref", () => {
  it("passes http and https URLs", () => {
    expect(safeHref("https://example.com/a?b=1")).toBe("https://example.com/a?b=1");
    expect(safeHref("http://example.com")).toBe("http://example.com/");
    expect(safeHref("  https://example.com/x  ")).toBe("https://example.com/x");
  });

  it("rejects other schemes", () => {
    expect(safeHref("javascript:alert(1)")).toBe("#");
    expect(safeHref("JaVaScRiPt:alert(1)")).toBe("#");
    expect(safeHref("data:text/html,<b>x</b>")).toBe("#");
    expect(safeHref("vbscript:msgbox")).toBe("#");
    expect(safeHref("file:///etc/passwd")).toBe("#");
    expect(safeHref("ftp://example.com")).toBe("#");
  });

  it("rejects relative, empty and non-string values", () => {
    expect(safeHref("/relative/path")).toBe("#");
    expect(safeHref("")).toBe("#");
    expect(safeHref(undefined)).toBe("#");
    expect(safeHref(null)).toBe("#");
    expect(safeHref(42)).toBe("#");
  });
});

describe("isValidId / pathId", () => {
  it("accepts UUIDs and short hex ids", () => {
    expect(isValidId("3f2b1c9e-8a7d-4e6f-9b0a-1c2d3e4f5a6b")).toBe(true);
    expect(isValidId("abc123def456")).toBe(true);
    expect(pathId("abc123def456")).toBe("abc123def456");
  });

  it("rejects path-like or oversized ids", () => {
    expect(isValidId("../admin")).toBe(false);
    expect(isValidId("a?b=c")).toBe(false);
    expect(isValidId("a/b")).toBe(false);
    expect(isValidId("")).toBe(false);
    expect(isValidId("a".repeat(65))).toBe(false);
    expect(() => pathId("../x")).toThrow();
  });
});
