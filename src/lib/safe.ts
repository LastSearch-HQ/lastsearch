/**
 * Returns the URL if it is an absolute http(s) URL, otherwise "#".
 * Use for any href built from API, source or citation data.
 */
export function safeHref(u: unknown): string {
  if (typeof u !== "string") return "#";
  const trimmed = u.trim();
  if (!trimmed) return "#";
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : "#";
  } catch {
    return "#";
  }
}

const ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

/** True for ids in the formats the API issues (UUIDs, hex share ids, etc.). */
export function isValidId(id: unknown): id is string {
  return typeof id === "string" && ID_PATTERN.test(id);
}

/** Validates an id and encodes it for use as a single URL path segment. */
export function pathId(id: unknown): string {
  if (!isValidId(id)) throw new Error("Invalid id");
  return encodeURIComponent(id);
}
