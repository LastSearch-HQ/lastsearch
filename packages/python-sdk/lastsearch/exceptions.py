"""Exception classes for LastSearch SDK."""


class LastSearchError(Exception):
    """Base exception for LastSearch SDK."""

    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code


class AuthenticationError(LastSearchError):
    """Raised on 401 responses."""


class RateLimitError(LastSearchError):
    """Raised on 429 responses."""


class InsufficientCreditsError(LastSearchError):
    """Raised on 402 responses."""


class ValidationError(LastSearchError):
    """Raised on 400 responses."""


class ServerError(LastSearchError):
    """Raised on 5xx responses."""
