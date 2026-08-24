# llamaindex-lastsearch

LlamaIndex integration for [LastSearch](https://lastsearch.ai) — verified web search with citations and confidence scores for AI agents.

## Installation

```bash
pip install llamaindex-lastsearch
```

## Quick Start

```python
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
from llamaindex_lastsearch import LastSearchAnswerTool, LastSearchSearchTool

# Create tools
answer_tool = LastSearchAnswerTool(api_key="ls_xxx")
search_tool = LastSearchSearchTool(api_key="ls_xxx")

# Create agent
llm = OpenAI(model="gpt-4o")
agent = ReActAgent.from_tools([answer_tool, search_tool], llm=llm, verbose=True)

# Research with verified answers
response = agent.chat("What are the latest findings on mRNA vaccine efficacy?")
print(response)
```

## Available Tools

- **`LastSearchAnswerTool`** — Verified research with citations, confidence scores, contradiction detection
- **`LastSearchSearchTool`** — Web search returning ranked results
- **`LastSearchExtractTool`** — Extract structured claims from a URL
- **`LastSearchCompareTool`** — Compare raw LLM vs verified answer

All tools are returned as `FunctionTool` instances, compatible with any LlamaIndex agent.

## Why LastSearch?

Unlike raw search APIs, LastSearch fact-checks results. Every answer includes per-claim verification, cross-source consensus, contradiction detection, and evidence-based confidence scores. Open source (Apache 2.0).

## Links

- [Website](https://lastsearch.ai) · [GitHub](https://github.com/lastsearch-hq/lastsearch) · [Discord](https://discord.gg/ubAuT4YQsT)
- [Python SDK](https://pypi.org/project/lastsearch/) · [LangChain](https://pypi.org/project/langchain-lastsearch/) · [CrewAI](https://pypi.org/project/crewai-lastsearch/) · [MCP Server](https://www.npmjs.com/package/lastsearch)

## License

Apache 2.0
