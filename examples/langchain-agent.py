"""
LangChain Research Agent — LastSearch Example

Drop LastSearch into a LangChain agent as a research tool.
The agent gets evidence-backed web research capabilities.

Usage:
    pip install langchain-lastsearch langchain langchain-openai
    python langchain-agent.py
"""

from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_lastsearch import (
    LastSearchSearchTool,
    LastSearchAnswerTool,
    LastSearchExtractTool,
)

# LastSearch tools — agent gets evidence-backed research
tools = [
    LastSearchSearchTool(api_key="ls_xxx"),     # Web search
    LastSearchAnswerTool(api_key="ls_xxx"),      # Full research pipeline (verified)
    LastSearchExtractTool(api_key="ls_xxx"),     # Page extraction
]

# Standard LangChain agent setup
llm = ChatOpenAI(model="gpt-4o")

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a research assistant. Use LastSearch tools to find
    evidence-backed answers. Always cite your sources and mention the
    confidence score. Never make claims without evidence."""),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run
result = executor.invoke({
    "input": "What are the top 3 JavaScript frameworks in 2025 and why?"
})

print("\n--- Result ---")
print(result["output"])
