import { useEffect, useState } from "react";

export interface Contributor {
  login: string;
  avatar_url: string; // a data: URI snapshotted at build time, or "" when unavailable
  html_url: string;
  contributions: number;
}

// Contributors are snapshotted at build time (scripts/fetch-contributors.mjs) and served from this
// site, so visitors' browsers never contact GitHub.
export function useContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/contributors.json")
      .then((r) => {
        if (!r.ok) throw new Error("contributors unavailable");
        return r.json();
      })
      .then((data: Contributor[]) => {
        if (!alive || !Array.isArray(data)) return;
        setContributors(data.filter((c) => c && typeof c.login === "string" && !c.login.includes("[bot]")));
      })
      .catch(() => {
        // Silently fail: the leaderboard just won't show
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return { contributors, loading };
}
