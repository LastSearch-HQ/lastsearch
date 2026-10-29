// Build-time snapshot of GitHub contributors, so visitors' browsers never contact GitHub.
// Writes public/contributors.json with avatars inlined as small data URIs. Never fails the build.
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = "public/contributors.json";
const write = (list) => { mkdirSync("public", { recursive: true }); writeFileSync(OUT, JSON.stringify(list)); };

try {
  const headers = { "user-agent": "lastsearch-build", accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetch("https://api.github.com/repos/lastsearch-hq/lastsearch/contributors?per_page=50", { headers, signal: AbortSignal.timeout(10_000) });
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const people = (await r.json()).filter((c) => c && typeof c.login === "string" && !c.login.includes("[bot]"));
  const list = [];
  for (const c of people) {
    let avatar = "";
    try {
      const a = await fetch(`${c.avatar_url}${c.avatar_url.includes("?") ? "&" : "?"}s=64`, { signal: AbortSignal.timeout(5_000) });
      const type = a.headers.get("content-type") || "";
      if (a.ok && /^image\/(png|jpeg|gif|webp)$/.test(type)) avatar = `data:${type};base64,${Buffer.from(await a.arrayBuffer()).toString("base64")}`;
    } catch { /* leave the avatar empty */ }
    list.push({ login: c.login, html_url: `https://github.com/${encodeURIComponent(c.login)}`, contributions: Number(c.contributions) || 0, avatar_url: avatar });
  }
  write(list);
  console.log(`contributors: ${list.length}`);
} catch (e) {
  console.warn(`contributors: skipped (${e.message})`);
  write([]);
}
