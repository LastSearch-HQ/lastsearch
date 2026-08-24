import warnings
from langchain_lastsearch import *  # noqa: F401,F403
warnings.warn(
    "langchain_browseaidev has been renamed to langchain_lastsearch (BrowseAI Dev is now LastSearch). "
    "Migrate: pip install langchain-lastsearch - https://lastsearch.ai/migrate. Bridge ends 2026-10-31.",
    DeprecationWarning, stacklevel=2,
)
