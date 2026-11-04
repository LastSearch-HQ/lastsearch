"""Basic tests for LastSearch client."""

import pytest

from lastsearch import LastSearch, AsyncLastSearch, LastSearchError
from lastsearch.models import BrowseResult, SearchResult, PageResult, CompareResult


def test_client_requires_api_key():
    with pytest.raises(TypeError):
        LastSearch()


def test_async_client_requires_api_key():
    with pytest.raises(TypeError):
        AsyncLastSearch()


def test_client_accepts_api_key():
    client = LastSearch(api_key="ls_test")
    assert client._headers["X-API-Key"] == "ls_test"
    client.close()


def test_client_context_manager():
    with LastSearch(api_key="ls_test") as client:
        assert client is not None


def test_models_parse():
    data = {
        "answer": "Test answer",
        "claims": [{"claim": "Test claim", "sources": ["https://example.com"]}],
        "sources": [{"url": "https://example.com", "title": "Example", "domain": "example.com", "quote": "test"}],
        "confidence": 0.85,
        "trace": [{"step": "Search", "duration_ms": 100}],
    }
    result = BrowseResult(**data)
    assert result.answer == "Test answer"
    assert result.confidence == 0.85
    assert len(result.sources) == 1
    assert result.sources[0].domain == "example.com"


def test_search_result_model():
    data = {"url": "https://example.com", "title": "Example", "snippet": "A snippet", "score": 0.9}
    result = SearchResult(**data)
    assert result.score == 0.9


def test_page_result_model():
    data = {"title": "Example", "content": "Page content", "excerpt": "Short", "siteName": "Example Site"}
    result = PageResult(**data)
    assert result.site_name == "Example Site"


def test_path_segments_are_encoded():
    from lastsearch.client import _seg

    assert _seg("abc-123") == "abc-123"
    assert _seg("../admin?x=1") == "..%2Fadmin%3Fx%3D1"


def test_base_url_requires_https():
    with pytest.raises(ValueError):
        LastSearch(api_key="ls_test", base_url="http://api.example.com")
    LastSearch(api_key="ls_test", base_url="http://localhost:3000").close()
    LastSearch(api_key="ls_test", base_url="https://api.example.com").close()


def test_verify_evidence_rejects_malformed_bundle():
    import hashlib
    from lastsearch.models import EvidenceBundle

    canonical = "{not json"
    bundle = EvidenceBundle.model_construct(
        canonical=canonical,
        hash=hashlib.sha256(canonical.encode()).hexdigest(),
        record={},
        signed=True,
        signature="AAAA",
    )
    assert LastSearch.verify_evidence(bundle, "not a key") is False
