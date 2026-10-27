# crewai-lastsearch

CrewAI integration for [LastSearch](https://lastsearch.ai) — verified web search with citations and confidence scores for AI agents.

## Installation

```bash
pip install crewai-lastsearch
```

## Quick Start

```python
from crewai import Agent, Task, Crew
from crewai_lastsearch import LastSearchAnswerTool, LastSearchSearchTool

# Create tools
answer_tool = LastSearchAnswerTool(api_key="ls_xxx")
search_tool = LastSearchSearchTool(api_key="ls_xxx")

# Create a research agent
researcher = Agent(
    role="Research Analyst",
    goal="Provide accurate, evidence-backed research",
    backstory="You are a meticulous researcher who verifies every claim.",
    tools=[answer_tool, search_tool],
)

# Create a task
task = Task(
    description="Research the current state of quantum computing",
    expected_output="A verified summary with citations and confidence scores",
    agent=researcher,
)

# Run
crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()
```

## Available Tools

- **`LastSearchAnswerTool`** — Verified research with citations, confidence scores, contradiction detection
- **`LastSearchSearchTool`** — Web search returning ranked results
- **`LastSearchExtractTool`** — Extract structured claims from a URL
- **`LastSearchCompareTool`** — Compare raw LLM vs verified answer

## Why LastSearch?

Unlike raw search APIs, LastSearch fact-checks results. Every answer includes per-claim verification, cross-source consensus, contradiction detection, and evidence-based confidence scores. Open source (Apache 2.0).

## Links

- [Website](https://lastsearch.ai) · [GitHub](https://github.com/lastsearch-hq/lastsearch) · [Discord](https://discord.gg/ubAuT4YQsT)
- [Python SDK](https://pypi.org/project/lastsearch/) · [LangChain](https://pypi.org/project/langchain-lastsearch/) · [MCP Server](https://www.npmjs.com/package/lastsearch)

## License

Apache 2.0

## Data, privacy and terms

This package sends your requests (queries, URLs and documents you ask it to verify) and your LastSearch API key to the hosted LastSearch API at lastsearch.ai. Queries and results are stored there and used, in aggregate and without identifiers, to improve verification, as described in the [Privacy Policy](https://lastsearch.ai/privacy). The package itself collects no telemetry. Use of the hosted API is subject to the [Terms](https://lastsearch.ai/terms).

LastSearch is a free, non-commercial passion project run by an individual developer. Answers, citations and confidence scores are AI-generated research, not professional advice; verify anything important against primary sources.
