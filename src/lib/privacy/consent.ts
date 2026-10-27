/**
 * Consent store for non-essential processing on lastsearch.ai.
 *
 * Nothing optional runs until the visitor has said yes: no analytics script, no cookies beyond the
 * strictly necessary ones (auth session, UI state). Browser-level opt-out signals (Global Privacy
 * Control, Do Not Track) are honoured as a "no" without asking. The decision is stored locally with
 * a timestamp and the policy version it was given under, and can be withdrawn from the footer at any time.
 */

export const CONSENT_KEY = "ls_consent";
/** Bump when the privacy policy changes in a way that needs fresh consent. */
export const CONSENT_VERSION = 2;

export type ConsentCategories = { analytics: boolean };
export type ConsentRecord = ConsentCategories & {
  version: number;
  at: string;
  /** "banner" = chosen by the visitor; "signal" = derived from GPC/DNT, never shown a banner. */
  source: "banner" | "signal";
};

type Listener = (c: ConsentRecord | null) => void;
const listeners = new Set<Listener>();

function read(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as ConsentRecord;
    if (typeof c !== "object" || c === null || c.version !== CONSENT_VERSION) return null;
    return c;
  } catch {
    return null;
  }
}

/** True when the browser carries a universal opt-out signal (GPC, or the older DNT). */
export function hasOptOutSignal(nav: Partial<Navigator> & { globalPrivacyControl?: boolean } = navigator): boolean {
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1";
}

/** The current decision, or null when the visitor has not been asked yet (and no signal applies). */
export function getConsent(): ConsentRecord | null {
  const stored = read();
  if (stored) return stored;
  if (typeof navigator !== "undefined" && hasOptOutSignal()) {
    return { analytics: false, version: CONSENT_VERSION, at: new Date().toISOString(), source: "signal" };
  }
  return null;
}

export function setConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = { ...categories, version: CONSENT_VERSION, at: new Date().toISOString(), source: "banner" };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); } catch { /* storage unavailable: decision holds for this page only */ }
  listeners.forEach((l) => l(record));
  return record;
}

/** Forget the decision so the banner asks again (used by "Cookie settings"). */
export function clearConsent(): void {
  try { localStorage.removeItem(CONSENT_KEY); } catch { /* ignore */ }
  listeners.forEach((l) => l(null));
}

export function onConsentChange(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function analyticsAllowed(): boolean {
  return getConsent()?.analytics === true;
}
