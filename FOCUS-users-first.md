# LastSearch — Users-First Focus Plan (red-teamed)

> Generated 2026-07-05 via multi-agent audit workflow (6 production-readiness tracks across both repos → synthesize → red-team → finalize). 9 agents, 125 tool calls, 7 gaps found (3 high-severity), all folded in. Status change driving this: **the product now has real, growing users.**

## What changed after red-teaming

The macro ranking survived — it resists the shiny (ONNX, eval harness, deep-mode v2, moat number) and centers reliability, leak-plugging, and blindness. But the **top was resequenced** because the draft's very first action could have hurt the users it protects:
1. `1fb9a87` raises deep-mode `max_tokens 1500→4000` with **no LLM deadline** — alone that pushes heavy queries toward the 120s Vercel wall, trading visible truncation for a silent 504. So the **LLM AbortSignal timeout ships IN THE SAME release**, and the smoke-test measures wall-clock latency.
2. The deploy is now an **observed release** — Sentry + catch-path failure logging land *before* the push, so you deploy watched, not blind.
3. The one-line cross-tenant PII trace-leak fix (`answer.ts:620`) rides along — no reason to leave a live leak open.
4. The **BYOK activation wall promoted into this week** — a broken, falsely-marketed front door is top-tier for a growing product.
5. Dropped false certainty on the 42% "phantom" — the benchmark re-run is now a **required post-deploy gate**, not optional.

---

## 1. THE ONE-LINER

**Cut ONE observed release TODAY — not a blind deploy of a max_tokens bump.** Bundle, in a single watched push to engine `main`: `@sentry/node` + catch-path failure logging (deploy visible), the `1fb9a87` truncation + false-contradiction fix, **the LLM AbortSignal(~25s) + `maxRetries→1` that contains the max_tokens risk**, the one-line PII trace-leak fix (`answer.ts:620`), and the two other undeployed commits (`904a0c9` clarity depth, `06d9def` deep traces). Then smoke-test **deep-query wall-clock p95 < 120s at 4000 tokens**, and run the 30-min benchmark as a release gate.

---

## 2. FOCUS STACK (ranked by user-impact × urgency / effort)

### 1. THE OBSERVED RELEASE — one watched deploy, TODAY
Ship together, in order, as one release to engine `main`:
1. **Instrument first (~1.5hr):** wire `@sentry/node` in `app.ts`; add failure persistence on catch paths at `browse.ts:469` and `:524`, recording `{query_hash, userId, depth, served_tier, error_category}` — `errorResponse()` already computes `error_category` and throws it away. Today `store.save` fires only on success (`browse.ts:399/513`), so **failures are structurally invisible**.
2. **User-facing bug fixes (`1fb9a87`):** `max_tokens 1500→4000` (deep answers cut mid-sentence) + false-contradiction fix (spurious contradictions poisoning confidence on misinformation-adjacent queries).
3. **Risk-container (non-optional):** wrap the gemini fetches — incl. streaming `gemini.ts:969` and the un-timed `reader.read()` loop — in `AbortSignal.timeout(~25s)`, drop LLM `maxRetries` 3→1.
4. **PII trace-leak one-liner:** drop `originalQuery` from the semantic-hit trace at `answer.ts:620` (`Similar to "${originalQuery.slice(0,60)}"`) — currently leaks another paying user's verbatim query.
5. **The other two commits:** `904a0c9` (clarity `depth` passthrough — closes a live SDK/MCP↔engine contract break) + `06d9def` (deep-mode progress traces).

**Effort: ~half a day.** **First step:** in engine repo, `git status` to confirm the tree is clean of `training/04_train_nli.py`, `migration_training_signals.sql`, untracked `eval/ supabase/ *.log`; then `git log origin/main..shreyas` to confirm only `904a0c9, 1fb9a87, 06d9def` are real. **Release gate — do NOT merge until:** (a) a `deep` query shows p95 wall-clock < 120s AND no cutoff at 4000 tokens; (b) "the myth that vaccines cause autism" returns no spurious contradiction; (c) a forced failure appears in Sentry; (d) the 30-min benchmark re-run passes.

### 2. Finish observability trifecta + `served_tier`/`degraded` field
Real `/health` that pings Supabase/Redis/one provider (today returns static `"ok"` and lies); free UptimeRobot on it; `@sentry/react` in frontend; add `served_tier: "nli" | "bm25"` + `degraded: true` to responses/traces. **Effort: ~1 day.**

### 3. Cap confidence on BM25 fallback
When HF rate-limits/times-out or quota strips premium keys → silent BM25 → returns keyword answer with **the same full confidence number**. Cap/annotate confidence when `served_tier === "bm25"`. Trust-killer on the hottest path. **Effort: hours** (rides on #2's field).

### 4. Structural semantic-cache tenant isolation
`embeddingIndex` (`semanticCache.ts:93`) is a process-global unscoped array → on a semantic hit, one user's query matches against another's. Namespace cache key + embedding index by `userId`. **Effort: hours.**

### 5. Kill the BYOK activation wall + fix false "free" copy — PROMOTED
`apiKeys.ts:26` hard-returns 400 without both `tavily_key` AND `openrouter_key`; `ApiKeyManager.tsx:207` disables the mint button — a new signup **cannot get a `ls_` key without a paid OpenRouter account.** "Free API key, no signup" is false and contradicts CLAUDE.md ("no BYOK mode"). Server keys already exist. **Copy fix TODAY (minutes); unblock: ~1 day.** Investigate `routes/waitlist.ts` (never examined — possible alternate mint path) before building.

### 6. Harden THEN ship the demo-fingerprint fix + global demo cap — DO NOT SHIP AS-IS
The uncommitted change trusts a client-supplied `X-Browse-Demo-Session` header as the rate-limit bucket → **rotate it per request = unlimited free queries on your paid keys.** Drop or HMAC-sign the `tabId` branch, keep the IP+UA+lang hash bucket, add a hard global per-hour demo cap. Then `git add browse.ts session.ts` ALONE. **Effort: hours.**

### 7. SDK/MCP timeout bumps — <1hr freebie
Python SDK `DEFAULT_TIMEOUT=60` (`client.py:34`) < engine's 120s → valid deep queries raise false client timeouts while the engine succeeds. MCP `apiCall` (`apps/mcp/src/index.ts:70`) has no timeout. Fix + bump SDK/MCP patch versions.

### 8. Quota TOCTOU — reserve-then-run
Quota read once at start, incremented fire-and-forget *after* the up-to-120s query → 50 concurrent `deep` all read `used=0` and run. Atomic INCR-to-reserve before premium work, refund on failure (`browse.ts:116/458`). **Effort: ~1 day.**

### 9. Full wall-clock budget — return best partial before the 120s kill
Beyond the per-call AbortSignal, return best *partial* answer before the Vercel wall. Needs a deadline threaded through the deep loop. **Effort: ~1 day.**

### 10. Dependabot security roll-ups + branch cleanup — <1hr
Merge `production-dependencies-b4cf797c46` (43 updates, likely security), `checkout-7`, `development-dependencies-d57308b`; delete dead branches.

### 11. (Soon, not now) SSRF hardening + public `shareId` opt-in
`readability.ts` allowlists by hostname but re-resolves DNS with no IP pinning (rebinding → metadata endpoint); every query auto-mints an unauth'd public `shareId`, ownerless sessions world-readable by UUID. **Effort: ~1 day.**

---

## 3. TODAY vs WEEK vs MONTH

**Honest scope: the full "protect the users you have" block is ~2 weeks for a solo founder also fundraising.**

**TODAY (one observed release — start now):** #1 in full + the #5 copy fix (minutes; active misrepresentation).

**PROTECTED FLOOR — cannot be what slips this week:** #2 observability + #3 cap BM25-fallback confidence. If fundraising eats the week, everything else moves before these two.

**REST OF WEEK:** #4 cache isolation → #5 BYOK wall → #6 demo-fix harden+ship → #7 SDK/MCP timeouts → #10 dependabot.

**THIS MONTH:** #8 quota TOCTOU → #9 wall-clock budget → #11 SSRF/shareId → Supabase scaling (the scale audit rates this "months out" — do NOT pull forward).

---

## 4. EXPLICITLY DEPRIORITIZE

None of these keeps a single current user from churning this month.
- **Eval system (`eval/PLAN.md`) — SHELVE.** You need production telemetry on real failures (#1/#2), not an offline harness. (Also gitignore `eval/` so it stops polluting the demo-fix commit.)
- **ONNX deployment — SHELVE, gate on data not fear.** HF only breaks at ~5–15 concurrent premium users. The `served_tier` flag (#2/#3) shows the actual fallback rate for near-zero cost; gate ONNX on that.
- **42% benchmark — DE-RISKED, not dismissed.** Code supports the reporting-artifact theory (`SKIP` env at line 22, `87 = QUERIES.slice(63)`) but the 2026-03-12 run using `SKIP=63` is NOT verifiable from the repo. Don't burn a day; the 30-min re-run is a required gate in #1.
- **Ecosystem expansion (`claude/app-expansion-strategy`) — SHELVE, don't delete.**
- **Deep-mode v2 — SHELVE.** Deep already flirts with the 120s wall; more fan-out makes reliability worse.
- **Fundraising / moat number (93.12% E2-Small, EB1A polish) — SHELVE as a project.** For EB1A, "runs in production for real users reliably, with observability and no data leaks" is a *stronger* original-contribution story than an undeployed model's benchmark.

---

## 5. "ARE WE LOSING USERS RIGHT NOW?" — verify TODAY

1. **Failure rate (invisible until #1).** `store.save` fires only on success. Stopgap: grep 24–48h of Vercel logs for `request.log.error` / 502 / 504. 504 → deep-mode hitting the 120s wall.
2. **Silent tier downgrade.** No `served_tier` field yet — run a known premium query, inspect whether the trace shows NLI reranking. If HF is rate-limiting, paying users get keyword answers at full confidence.
3. **Truncation / false-contradiction bugs live?** YES on deployed `main` until #1. Verify: long `deep` query (cutoff) + "the myth that vaccines cause autism" (spurious contradiction).
4. **Onboarding broken?** Incognito, brand-new user, no OpenRouter/Tavily account → try to get a `ls_` key. Confirm the wall. Check `waitlist.ts` for a second intended path.
5. **Engine up?** `/health` returns static `"ok"` and lies. Hit a real prod query, confirm Supabase/Redis/HF reachable.

---

## 6. KILL / MERGE / SHIP (git actions)

**Correction to earlier briefing:** public repo is NOT 15/10 diverged — effectively 1/1 (same OAuth fix, nothing stranded). Engine "6 ahead" is misleading: `caae3c7`'s tree == `origin/main`'s tree, so it + 2 training ancestors already deployed under different SHAs. **Only `904a0c9, 1fb9a87, 06d9def` are genuinely undeployed.**

- **SHIP (engine) TODAY:** merge `shreyas → main` carrying `904a0c9, 1fb9a87, 06d9def` + the pulled-forward AbortSignal/maxRetries + Sentry+catch-path + `answer.ts:620` one-liner committed on top. No version bump (unversioned). Gate on #1's latency + benchmark checks.
- **COMMIT the demo-fingerprint fix — HARDEN first, commit ALONE.** Drop/HMAC-sign the header branch, add global cap, `git add browse.ts session.ts` only; gitignore the training/eval noise.
- **DO NOT deploy the demo fix as-is** — four audits agree it's an unlimited-free-query bypass on your paid keys.
- **DELETE:** `anti-hallucination-skill` (superseded — bumps MCP to 0.2.2 vs current 0.4.0), `fix/deep-mode-lock` (already in main), older dev-deps dependabot `e3712fee`.
- **MERGE:** dependabot `production-dependencies-b4cf797c46` (security), `checkout-7`, `development-dependencies-d57308b`.
- **KEEP, defer:** `claude/app-expansion-strategy-lO7Sl`.
- **Public repo:** in sync — only #5 copy fix + #7 SDK/MCP timeout patch bumps this week.
