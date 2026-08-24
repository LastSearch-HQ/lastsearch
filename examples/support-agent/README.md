# Customer Support Agent

A terminal-based customer support agent powered by [LastSearch](https://lastsearch.dev). This is what enterprise agents look like -- they don't guess, they verify. LastSearch gives your support agent a confidence score so it knows when to answer and when to escalate.

## How It Works

```
Customer asks a question
         |
         v
+-------------------+
| Check knowledge   |  <-- Previously verified answers (instant)
| base cache        |
+-------------------+
         |
    miss |
         v
+-------------------+
| LastSearch research |  depth="thorough"
|                   |
| 1. Search         |  Find relevant sources
| 2. Verify         |  Extract and verify claims against sources
| 3. Score          |  Evidence-based confidence with contradiction detection
| 4. Cite           |  Structured JSON with sources and scores
+-------------------+
         |
         v
+-------------------+
| Confidence check  |
|                   |
| >= 70%  RESPOND   |  Direct answer with citations
| 50-70%  FLAG      |  Answer + "I'm not fully certain..."
| < 50%   ESCALATE  |  Hand off to human with research summary
+-------------------+
         |
         v
  Cache high-confidence answers
  for future questions
```

The agent uses LastSearch's session API to accumulate knowledge over time. Repeated questions get instant, verified responses from the knowledge base instead of re-searching.

## Setup

### 1. Get a LastSearch API Key

Sign up at [lastsearch.dev](https://lastsearch.dev) and get your API key (starts with `ls_`).

### 2. Install and Run

```bash
cd examples/support-agent

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

export LASTSEARCH_API_KEY="ls_your_key_here"

python agent.py
```

Or create a `.env` file:

```env
LASTSEARCH_API_KEY=ls_your_key_here
```

### 3. Point at Your Company Docs (Optional)

Use the `--knowledge-base` flag to prioritize a specific domain in searches:

```bash
python agent.py --knowledge-base https://docs.yourcompany.com
```

This appends `site:docs.yourcompany.com` to queries so LastSearch prioritizes your documentation while still cross-referencing against the broader web.

## Usage

```
Customer > What's your refund policy?

  Checking knowledge base...
  Searching and verifying across multiple sources...
  Verified across 6 source(s) in 8.2s
    stripe.com - Stripe Refund Policy
    docs.example.com - Returns & Refunds
    support.example.com - FAQ
  Claims: 4/5 verified

  +-- Decision Flow ------------------------------------------+
  | Question --> Research --> Confidence: HIGH (84%) --> RESPOND DIRECTLY |
  +-----------------------------------------------------------+

  +-- Support Agent ------------------------------------------+
  | We offer a full refund within 30 days of purchase...      |
  |                                                           |
  | **Sources:**                                              |
  | - Stripe Refund Policy (stripe.com)                       |
  | - Returns & Refunds (docs.example.com)                    |
  +-- Confidence: 84% | 6 sources ---------------------------+
```

When the agent is unsure:

```
Customer > Is your API GDPR compliant?

  +-- Decision Flow ------------------------------------------+
  | Question --> Research --> Confidence: MEDIUM (58%) --> RESPOND WITH CAVEAT |
  +-----------------------------------------------------------+

  +-- Support Agent (flagged for review) ---------------------+
  | > Note: I'm not fully certain about this answer...        |
  |                                                           |
  | Based on available documentation, the API processes data  |
  | within EU regions and supports data deletion requests...  |
  +-- Confidence: 58% | Needs verification -------------------+
```

When confidence is too low:

```
Customer > Can I use your API for healthcare data under HIPAA?

  +-- Decision Flow ------------------------------------------+
  | Question --> Research --> Confidence: LOW (32%) --> ESCALATE TO HUMAN |
  +-----------------------------------------------------------+

  +-- ESCALATED TO HUMAN SUPPORT ----------------------------+
  | **Research Summary for Human Agent:**                     |
  |                                                           |
  | **Customer question:** Can I use your API for...          |
  | **Best answer found (confidence 32%):** ...               |
  | **Sources checked:** 4                                    |
  | **Contradictions found:** 1                               |
  +-- Confidence too low for automated response --------------+
```

## Commands

| Command | Description |
|---------|-------------|
| `/stats` | Show session statistics (auto-answered, flagged, escalated, avg confidence) |
| `/kb` | Show the knowledge base of cached verified answers |
| `/help` | Show help |
| `/quit` | Exit and display final stats |

## Architecture

The agent is a single `agent.py` file:

- **`SupportAgent`** wraps the LastSearch Python SDK. It manages a local answer cache and a LastSearch research session for cross-query knowledge accumulation.
- **`CachedAnswer`** stores previously verified answers. When a similar question comes in, the cache serves it instantly without re-searching.
- **`AgentStats`** tracks how many questions were auto-answered vs flagged vs escalated, giving you a dashboard of agent reliability.
- **`rich`** provides the terminal UI: colored confidence indicators, panels, spinners during research, and formatted tables for stats.

The confidence thresholds (70% / 50%) are deliberately conservative. In production, you might tune these based on your domain -- a medical support agent might require 90%+ to auto-answer, while a general FAQ bot might be fine at 65%.

## Why This Matters

Traditional support bots either:
1. **Always answer** -- and sometimes hallucinate, damaging trust
2. **Always escalate** -- and never learn, wasting human time

This agent takes a third path: it verifies before responding, escalates when uncertain, and builds a knowledge base over time. The result is a bot that gets more reliable with every interaction while keeping humans in the loop for edge cases.

The confidence score is not LLM self-assessment. It is an evidence-based algorithm that analyzes multiple quality signals from sources. When sources contradict each other, a penalty is applied. This is the difference between "the model thinks it knows" and "the evidence supports this answer."

## License

Apache 2.0 -- same as the parent LastSearch project.
