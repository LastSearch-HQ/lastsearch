"""LlamaIndex integration for LastSearch — verified web search with citations and confidence scores."""

from .tools import (
    LastSearchAnswerTool,
    LastSearchClarityTool,
    LastSearchCompareTool,
    LastSearchExtractTool,
    LastSearchSearchTool,
)

__all__ = [
    "LastSearchSearchTool",
    "LastSearchAnswerTool",
    "LastSearchExtractTool",
    "LastSearchCompareTool",
    "LastSearchClarityTool",
]

__version__ = "0.1.2"
