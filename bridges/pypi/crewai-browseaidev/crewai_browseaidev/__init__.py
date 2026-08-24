import warnings
from crewai_lastsearch import *  # noqa: F401,F403
warnings.warn(
    "crewai_browseaidev has been renamed to crewai_lastsearch (BrowseAI Dev is now LastSearch). "
    "Migrate: pip install crewai-lastsearch - https://lastsearch.ai/migrate. Bridge ends 2026-10-31.",
    DeprecationWarning, stacklevel=2,
)
