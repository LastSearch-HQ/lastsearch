import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LastSearchLogo } from "@/components/LastSearchLogo";

// What's new — the public record of what shipped and when. Keep entries
// factual: measured numbers come from eval/ runs, and security items always
// carry their limits (sensor not enforcer; attests retrieval, not compliance).
const RELEASES: Array<{ version: string; date: string; title: string; items: string[]; tag?: string }> = [
  {
    version: "engine 2026-10-17",
    date: "2026-10-17",
    tag: "New",
    title: "verify-anything CLI + verification quality: your exact claim, judged against the exact span",
    items: [
      "New: npx verify-anything \"<text | url | file>\" — a one-command claim checker (paste a ChatGPT answer via stdin). Every claim comes back verified / contradicted / unverified with confidence, the source, the reason, and the exact evidence span judged; --verbose shows every source weighed; exit code 1 if anything is contradicted. verify setup registers it as an MCP tool in Claude Desktop, Claude Code, Cursor, Windsurf, Codex and Gemini CLI. Apache-2.0, github.com/LastSearch-HQ/verify.",
      "verify-document now runs the NLI verifier directly on your claim's exact wording against every source quote — previously it scored the pipeline's paraphrase of what the pages said. Each claim returns evidence (the exact span judged, with entailment/contradiction scores) and checks (every source weighed), so a verdict can be audited rather than trusted.",
      "Premises are claim-focused and title-anchored: 'The tower is 330 metres tall' on the Eiffel Tower page now entails 'The Eiffel Tower is 330 metres tall'; dates no longer get cut off by truncation. Contradictions are asserted only when a source carries a competing value of the claim's kind (a different number, a different entity) — a sentence about construction starting in 1887 cannot contradict completion in 1889 — and a ≥2:1 majority decides with the dissent disclosed.",
      "thorough and deep now actually use the larger DeBERTa verifier (the depth parameter was not reaching the model, and the larger model had never loaded). Measured on a 5-claim planted-error probe: thorough 5/5 (two entity/location errors contradicted, two date errors contradicted, two true claims verified); fast 4/5. A probe, not a benchmark.",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-10-11",
    title: "Signed evidence records, strict mode, surgical sanitization",
    items: [
      "Every answer now has a signed, replayable Evidence Record (GET /browse/evidence/{shareId}): claims bound to sources, sources bound to the SHA-256 of the exact page text they were verified against, Ed25519-signed — verify offline with the SDK (pip install lastsearch[verify]). Attests what LastSearch retrieved and verified, not a compliance guarantee.",
      "Instruction-directed sentences are redacted from what the extraction model sees (integrity.sanitizedSpans) — research shows removal beats blocking. Eval: 10/10 payloads removed, 10/10 surrounding content kept.",
      "strict: true drops any source carrying hidden instruction-shaped text before extraction (API, Python SDK, MCP).",
      "contentHash on every source; new MCP tool: evidence.",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-10-07",
    title: "Content Integrity — structural prompt-injection defense",
    items: [
      "Every fetched page is scanned on the raw DOM before extraction. Hidden / non-rendered content — HTML comments, display:none, off-screen, zero-font, aria-hidden, instruction-shaped meta/alt text, zero-width characters — where ~70% of in-the-wild prompt injections live — is stripped, and each source gets an integrity signal (risk: none | low | high) plus a result-level contentRisk.",
      "Measured on the open eval harness: 100% detection across 11 injection carriers; 0 high-risk false positives in 36 benign pages (12 synthetic hard-benign + 24 real, incl. OWASP, Wikipedia's prompt-injection article, Microsoft and Anthropic docs) — a count on a small set, not a guarantee (95% upper bound ~8% at n=36). A signal for your agent's policy layer, never a 'blocks injection' claim.",
      "Vercel runtime moved to Node 22.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-09-14",
    title: "Live citation health + evidence-aligned decomposition",
    items: [
      "On thorough and deep modes, every cited URL is probed server-side and classified live / stale (link rot) / dead (likely fabricated). Deep-research agents hallucinate 3–13% of citation URLs; this makes 'every citation resolves' checkable. urlHealth per source, citationHealth per result.",
      "Atomic claim decomposition now only runs when per-claim evidence retrieval follows — splitting without aligned evidence degrades verification (SAE vs SRE).",
      "New /scorecard: how agent-search APIs compare on the verification axis.",
      "Runnable eval harness (citation-resolution track, no labels needed).",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-08-24",
    title: "LastSearch",
    items: [
      "BrowseAI Dev is now LastSearch — new name, lastsearch.ai, same product, zero breakage: old packages, keys, env vars and tool names kept working through the transition (see /migrate).",
      "14-step verification pipeline, DeBERTa NLI entailment, cross-source consensus, contradiction detection, 8-factor calibrated confidence; MCP server, REST API, Python SDK, LangChain / CrewAI / LlamaIndex integrations.",
    ],
  },
];

export default function Changelog() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="What's new — LastSearch changelog"
        description="Every LastSearch release: signed evidence records, content-integrity scanning against prompt injection, live citation health, and the measured numbers behind each."
        canonical="/changelog"
      />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <LastSearchLogo className="w-8 h-8" />
          <h1 className="text-3xl font-bold">What's new</h1>
        </div>
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Everything we ship, with the numbers behind it. Verification claims on this page come
          from the open eval harness in the repo — we publish false-positive rates alongside
          detection rates, and we describe process, never guaranteed accuracy.
        </p>

        <ol className="space-y-12">
          {RELEASES.map((r) => (
            <li key={r.version} className="relative pl-6 border-l border-border">
              <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                <h2 className="text-xl font-semibold">{r.title}</h2>
                <span className="text-xs font-mono text-muted-foreground">{r.version.startsWith("engine") ? r.version : `v${r.version}`} · {r.date}</span>
                {r.tag && <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">{r.tag}</span>}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {r.items.map((it, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary shrink-0">—</span><span>{it}</span></li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex gap-3">
          <button onClick={() => navigate("/scorecard")} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">See the scorecard</button>
          <button onClick={() => navigate("/developers")} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium">Roadmap</button>
        </div>
      </main>
    </div>
  );
}
