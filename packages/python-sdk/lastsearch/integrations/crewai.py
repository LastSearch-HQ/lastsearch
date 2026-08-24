"""CrewAI tool integration for LastSearch.

Usage::

    from lastsearch.integrations.crewai import LastSearchTool

    researcher = Agent(
        role="Researcher",
        tools=[LastSearchTool(api_key="ls_xxx")],
    )
"""

from __future__ import annotations

from typing import Any

from crewai.tools import BaseTool
from pydantic import Field

from ..client import LastSearch


class LastSearchTool(BaseTool):
    """Research any question with evidence-backed answers via LastSearch."""

    name: str = "LastSearch Research"
    description: str = (
        "Research a question using LastSearch. Searches the web, extracts claims, "
        "and returns a cited answer with confidence score and sources. "
        "Input should be a research question or topic."
    )
    client: Any = Field(exclude=True)

    def __init__(self, api_key: str | None = None, *, client: LastSearch | None = None, **kwargs: Any):
        cli = client or LastSearch(api_key=api_key)
        super().__init__(client=cli, **kwargs)

    def _run(self, query: str) -> str:
        result = self.client.ask(query)
        sources = "\n".join(f"  - [{s.title}]({s.url})" for s in result.sources)
        claims = "\n".join(f"  - {c.claim}" for c in result.claims)
        return (
            f"{result.answer}\n\n"
            f"Confidence: {result.confidence:.0%}\n"
            f"Claims:\n{claims}\n"
            f"Sources:\n{sources}"
        )
