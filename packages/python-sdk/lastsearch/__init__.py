"""LastSearch — Reliable research infrastructure for AI agents."""

from .client import DISCLAIMER, AsyncLastSearch, LastSearch
from .exceptions import (
    AuthenticationError,
    LastSearchError,
    InsufficientCreditsError,
    RateLimitError,
    ServerError,
    ValidationError,
)
from .models import (
    BrowseClaim,
    BrowseResult,
    BrowseSource,
    ClarityClaim,
    ClarityResult,
    CompareResult,
    Contradiction,
    KnowledgeEntry,
    NLIScore,
    PageResult,
    PremiumQuota,
    ReasoningStep,
    RecallResult,
    SearchProviderConfig,
    SearchResult,
    Session,
    SessionAskResult,
    TraceStep,
)

__all__ = [
    "LastSearch",
    "AsyncLastSearch",
    "LastSearchError",
    "AuthenticationError",
    "RateLimitError",
    "InsufficientCreditsError",
    "ValidationError",
    "ServerError",
    "BrowseResult",
    "BrowseSource",
    "BrowseClaim",
    "Contradiction",
    "ReasoningStep",
    "TraceStep",
    "SearchResult",
    "PageResult",
    "CompareResult",
    "Session",
    "KnowledgeEntry",
    "SessionAskResult",
    "RecallResult",
    "PremiumQuota",
    "SearchProviderConfig",
    "NLIScore",
    "ClarityClaim",
    "ClarityResult",
    "DISCLAIMER",
]

__version__ = "1.0.0"
