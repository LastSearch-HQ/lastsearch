import { SEO } from "@/components/SEO";
import { LastSearchLogo } from "@/components/LastSearchLogo";

// The one stable migration URL — linked from every deprecation warning,
// bridge package, and the wind-down announcements.
const rows: Array<[string, string]> = [
  ["npm: npx browseai-dev", "npx lastsearch"],
  ["Python: pip install browseaidev", "pip install lastsearch"],
  ["import browseaidev / BrowseAIDev()", "import lastsearch / LastSearch()"],
  ["BROWSE_API_KEY / BROWSEAI_API_KEY", "LASTSEARCH_API_KEY (old names read until Oct 31)"],
  ["bai_ API keys", "keep working until Oct 31 — new keys are ls_"],
  ["MCP tools browse_search … browse_feedback", "search, answer, clarity, … (old names alias until Oct 31)"],
  ['MCP config: "args": ["-y", "browseai-dev"]', '"args": ["-y", "lastsearch"]'],
  ["API base: browseai.dev/api", "lastsearch.ai/api (old host served until Oct 31)"],
  ["LangChain/CrewAI/LlamaIndex packages", "langchain-lastsearch · crewai-lastsearch · llamaindex-lastsearch"],
];

export default function Migrate() {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Migrating from BrowseAI Dev — LastSearch" description="BrowseAI Dev is now LastSearch. One-line migration for every surface: packages, API keys, env vars, MCP tools. Nothing breaks before October 31, 2026." canonical="/migrate" />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <LastSearchLogo className="w-8 h-8" />
          <h1 className="text-3xl font-bold">BrowseAI Dev is now <span className="text-primary">LastSearch</span></h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Same product, same API, same keys — new name. Nothing breaks today: every old package,
          key, env var, and tool name keeps working through <strong>October 31, 2026</strong>.
          Update at your pace before then.
        </p>
        <p className="text-muted-foreground mb-10">
          LastSearch is verified search infrastructure for AI agents — every answer returned with
          the evidence we found: citations and confidence scores, so you can judge it yourself.
        </p>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold">Before (BrowseAI Dev)</th>
                <th className="px-4 py-3 font-semibold">After (LastSearch)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([oldV, newV]) => (
                <tr key={oldV} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{oldV}</td>
                  <td className="px-4 py-3 font-mono text-xs">{newV}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-8">
          Questions? Ask in <a href="https://discord.gg/ubAuT4YQsT" className="text-primary underline">Discord</a> or
          email <a href="mailto:hello@lastsearch.ai" className="text-primary underline">hello@lastsearch.ai</a>.
        </p>
      </main>
    </div>
  );
}
