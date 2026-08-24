"""
LlamaIndex Research Agent — LastSearch Example

A ReAct agent using LlamaIndex + LastSearch for evidence-backed research.

Usage:
    pip install llamaindex-lastsearch llama-index-llms-openai llama-index-core
    python llamaindex-agent.py
"""

from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
from llamaindex_lastsearch import (
    LastSearchSearchTool,
    LastSearchAnswerTool,
    LastSearchExtractTool,
    LastSearchCompareTool,
)

# LastSearch tools — agent gets evidence-backed research
tools = [
    LastSearchSearchTool(api_key="ls_xxx"),      # Web search
    LastSearchAnswerTool(api_key="ls_xxx"),       # Full research pipeline (verified)
    LastSearchExtractTool(api_key="ls_xxx"),      # Page extraction
    LastSearchCompareTool(api_key="ls_xxx"),      # Raw LLM vs verified comparison
]

# Standard LlamaIndex agent setup
llm = OpenAI(model="gpt-4o")
agent = ReActAgent.from_tools(tools, llm=llm, verbose=True)

# Run
response = agent.chat(
    "What are the top 3 AI agent frameworks in 2025 and how do they compare?"
)

print("\n--- Result ---")
print(response)
