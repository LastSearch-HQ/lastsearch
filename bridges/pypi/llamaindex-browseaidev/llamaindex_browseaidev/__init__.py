import warnings
from llamaindex_lastsearch import *  # noqa: F401,F403
warnings.warn(
    "llamaindex_browseaidev has been renamed to llamaindex_lastsearch (BrowseAI Dev is now LastSearch). "
    "Migrate: pip install llamaindex-lastsearch - https://lastsearch.ai/migrate. Bridge ends 2026-10-31.",
    DeprecationWarning, stacklevel=2,
)
