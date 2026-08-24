# langchain-lastsearch

LangChain integration for [LastSearch](https://lastsearch.ai) — verified web search with citations and confidence scores for AI agents.

**Unlike raw search APIs, LastSearch fact-checks results before returning them.** Every answer includes per-claim verification, cross-source consensus, contradiction detection, and evidence-based confidence scores.

## Installation

```bash
pip install langchain-lastsearch
```

## Quick Start

```python
from langchain_lastsearch import LastSearchAnswerTool

# Verified search with citations and confidence
tool = LastSearchAnswerTool(api_key="ls_xxx")
result = tool.invoke({"query": "What is quantum computing?"})
print(result)
```

## Available Tools

### `LastSearchAnswerTool` — Verified Research (recommended)

The primary tool. Searches the web, extracts claims, verifies them using multi-signal evidence matching, detects contradictions, and returns an answer with confidence scores.

```python
from langchain_lastsearch import LastSearchAnswerTool

tool = LastSearchAnswerTool(api_key="ls_xxx")

# Fast mode (default)
result = tool.invoke({"query": "Is nuclear energy safe?"})

# Thorough mode (retries if confidence < 60%)
result = tool.invoke({"query": "Health effects of intermittent fasting", "depth": "thorough"})

# Deep mode (multi-step agentic research with gap analysis)
result = tool.invoke({"query": "Compare CRISPR vs base editing approaches", "depth": "deep"})
```

### `LastSearchSearchTool` — Web Search

Basic web search returning ranked results with URLs, titles, and snippets.

```python
from langchain_lastsearch import LastSearchSearchTool

tool = LastSearchSearchTool(api_key="ls_xxx")
result = tool.invoke({"query": "AI safety regulations 2024", "limit": 5})
```

### `LastSearchExtractTool` — Page Extraction

Extract structured claims and knowledge from a specific URL.

```python
from langchain_lastsearch import LastSearchExtractTool

tool = LastSearchExtractTool(api_key="ls_xxx")
result = tool.invoke({"url": "https://arxiv.org/abs/2303.08774", "query": "What are GPT-4's capabilities?"})
```

### `LastSearchCompareTool` — Raw vs Verified

Compare a raw LLM answer against an evidence-backed verified answer. Shows where LLMs hallucinate.

```python
from langchain_lastsearch import LastSearchCompareTool

tool = LastSearchCompareTool(api_key="ls_xxx")
result = tool.invoke({"query": "Is remote work more productive?"})
```

## Use with LangChain Agents

```python
from langchain_lastsearch import LastSearchAnswerTool, LastSearchSearchTool
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o")
tools = [
    LastSearchAnswerTool(api_key="ls_xxx"),
    LastSearchSearchTool(api_key="ls_xxx"),
]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a research assistant. Use lastsearch_answer for fact-checked answers with citations."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)

result = executor.invoke({"input": "What are the latest findings on mRNA vaccine efficacy?"})
print(result["output"])
```

## Why LastSearch over Tavily/Exa?

| Feature | LastSearch | Tavily | Exa |
|---|---|---|---|
| Claim verification | Yes | No | No |
| Evidence-based confidence scores | Yes | No | No |
| Cross-source consensus | Yes | No | No |
| Contradiction detection | Yes | No | No |
| Deep research mode | Yes | No | Yes |
| Open source (Apache 2.0) | Yes | No | No |
| Free tier | 100 verified/day | 1K search/mo | Limited |

## Get an API Key

1. Go to [lastsearch.ai](https://lastsearch.ai)
2. Sign in with GitHub
3. Your `ls_xxx` key is on the dashboard

Your `ls_xxx` key is on the dashboard.

## Links

- [Website](https://lastsearch.ai)
- [Documentation](https://lastsearch.ai/docs)
- [GitHub](https://github.com/lastsearch-hq/lastsearch)
- [Discord](https://discord.gg/ubAuT4YQsT)
- [Python SDK](https://pypi.org/project/lastsearch/)
- [MCP Server](https://www.npmjs.com/package/lastsearch)

## License

Apache 2.0
