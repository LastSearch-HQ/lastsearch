import warnings
from lastsearch import *  # noqa: F401,F403
from lastsearch import LastSearch as BrowseAIDev, AsyncLastSearch as AsyncBrowseAIDev, LastSearchError as BrowseAIDevError  # noqa: F401
warnings.warn(
    "browseaidev has been renamed to lastsearch (BrowseAI Dev is now LastSearch). "
    "Migrate: pip install lastsearch — https://lastsearch.ai/migrate. "
    "This bridge stops working after 2026-10-31.",
    DeprecationWarning, stacklevel=2,
)
