"""
Research Agent — LastSearch Example

A simple agent that researches any topic and returns
evidence-backed answers with citations and confidence scores.

Usage:
    pip install lastsearch
    python research-agent.py "What are the latest breakthroughs in fusion energy?"
"""

import sys
from lastsearch import LastSearch


def research(query: str):
    client = LastSearch(api_key="ls_xxx")

    print(f"\nResearching: {query}\n")

    # Full pipeline: search → fetch → extract → cite
    result = client.ask(query)

    print(f"Answer:\n{result.answer}\n")
    print(f"Confidence: {result.confidence:.0%}\n")

    print("Sources:")
    for source in result.sources:
        print(f"  [{source.domain}] {source.title}")
        print(f"    {source.url}")
        if source.quote:
            print(f'    "{source.quote[:120]}..."')
        print()

    print(f"Claims ({len(result.claims)}):")
    for i, claim in enumerate(result.claims, 1):
        print(f"  {i}. {claim.claim}")
        print(f"     Backed by {len(claim.sources)} source(s)")
        print()


if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else "What are the latest breakthroughs in fusion energy?"
    research(query)
