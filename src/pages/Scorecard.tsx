import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LastSearchLogo } from "@/components/LastSearchLogo";
import { Check, Minus } from "lucide-react";

// Verification capability scorecard. These are FEATURE capabilities — what each
// provider offers on the verification axis — not head-to-head accuracy scores.
// Compiled from public docs and the Artificial Analysis Search Index (Aug 2026).
// "Yes/No" reflects whether the provider exposes the capability in its API as of
// September 2026; competitor entries are based on their published documentation.

type Cell = "yes" | "no" | "partial";

const providers = ["LastSearch", "Tavily", "Exa", "Perplexity", "Brave", "Firecrawl", "Parallel"];

const rows: Array<{ axis: string; note: string; cells: Cell[] }> = [
  {
    axis: "Evidence-based confidence score",
    note: "A per-answer score computed from evidence (not LLM self-rating)",
    cells: ["yes", "no", "no", "no", "no", "no", "no"],
  },
  {
    axis: "Claim-level entailment verification",
    note: "Each claim checked against source text with an NLI model",
    cells: ["yes", "no", "no", "no", "no", "no", "no"],
  },
  {
    axis: "Live citation health",
    note: "Every cited URL probed; fabricated / dead links flagged",
    cells: ["yes", "no", "no", "no", "no", "no", "no"],
  },
  {
    axis: "Cross-source consensus",
    note: "Claims corroborated across independent domains",
    cells: ["yes", "no", "no", "no", "no", "no", "no"],
  },
  {
    axis: "Contradiction detection",
    note: "Conflicting claims surfaced and penalized",
    cells: ["yes", "no", "no", "no", "no", "no", "no"],
  },
  {
    axis: "Inline citations",
    note: "Sources returned with the answer",
    cells: ["yes", "yes", "yes", "yes", "yes", "yes", "yes"],
  },
  {
    axis: "Owns a web index",
    note: "Crawls the web rather than reselling another engine",
    cells: ["no", "no", "yes", "partial", "yes", "no", "yes"],
  },
  {
    axis: "MCP server",
    note: "First-party Model Context Protocol server",
    cells: ["yes", "yes", "yes", "yes", "yes", "yes", "yes"],
  },
  {
    axis: "Open source",
    note: "Verification pipeline / SDKs are open",
    cells: ["yes", "no", "no", "no", "no", "partial", "no"],
  },
];

function Icon({ v }: { v: Cell }) {
  if (v === "yes") return <Check className="w-4 h-4 text-primary mx-auto" aria-label="yes" />;
  if (v === "partial") return <span className="text-muted-foreground text-xs">partial</span>;
  return <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" aria-label="no" />;
}

export default function Scorecard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Verification Scorecard — LastSearch vs agent-search APIs"
        description="How agent-search APIs compare on the verification axis: confidence scores, claim-level entailment, live citation health, consensus, and contradiction detection. LastSearch is the only one that verifies."
        canonical="/scorecard"
      />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-6">
          <LastSearchLogo className="w-8 h-8" />
          <h1 className="text-3xl font-bold">The verification scorecard</h1>
        </div>
        <p className="text-muted-foreground mb-4 max-w-2xl">
          Most agent-search APIs return links. The race between them is a search-index race —
          who crawls the most, who ranks best. LastSearch competes on a different axis: whether
          the answer is <strong>verified</strong>. This scorecard compares what each provider
          exposes on that axis, as of September 2026.
        </p>
        <p className="text-muted-foreground mb-10 max-w-2xl text-sm">
          These are capability comparisons drawn from each provider's public documentation — not
          head-to-head accuracy benchmarks. "Owns a web index" is included to be fair: LastSearch
          deliberately sits <em>on top of</em> indexes (multi-provider) and adds the verification
          layer, rather than competing to crawl the web.
        </p>

        <div className="rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold sticky left-0 bg-muted/50">Verification axis</th>
                {providers.map((p) => (
                  <th key={p} className={`px-3 py-3 font-semibold text-center whitespace-nowrap ${p === "LastSearch" ? "text-primary" : "text-muted-foreground"}`}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.axis} className="border-t border-border">
                  <td className="px-4 py-3 sticky left-0 bg-background">
                    <div className="font-medium">{row.axis}</div>
                    <div className="text-xs text-muted-foreground">{row.note}</div>
                  </td>
                  {row.cells.map((c, i) => (
                    <td key={i} className={`px-3 py-3 text-center ${i === 0 ? "bg-primary/5" : ""}`}>
                      <Icon v={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mt-14 mb-3">How LastSearch verifies</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl">
          A 14-step pipeline runs on every answer: BM25 + dense retrieval fused with Reciprocal
          Rank Fusion, DeBERTa NLI entailment scoring and reranking, cross-source consensus,
          counter-query adversarial checks, live citation-health probing, and an 8-factor
          confidence score auto-calibrated from real feedback with isotonic regression. Every
          claim carries its verification state; every source carries its liveness; every answer
          carries a confidence number you can act on.
        </p>
        <p className="text-muted-foreground max-w-2xl text-sm">
          We describe the process, not a promise. Confidence scores are algorithmic estimates,
          not accuracy guarantees — always verify critical information from primary sources.
        </p>

        <div className="mt-12 flex gap-3">
          <button onClick={() => navigate("/playground")} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Try it in the playground
          </button>
          <button onClick={() => navigate("/developers")} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium">
            See the pipeline
          </button>
        </div>
      </main>
    </div>
  );
}
