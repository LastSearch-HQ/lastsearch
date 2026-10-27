import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { analyticsAllowed, onConsentChange } from "@/lib/privacy/consent";

/** Vercel Analytics loads its script only after the visitor has opted in. */
export function ConsentedAnalytics() {
  const [allowed, setAllowed] = useState(() => analyticsAllowed());
  useEffect(() => onConsentChange(() => setAllowed(analyticsAllowed())), []);
  return allowed ? <Analytics /> : null;
}
