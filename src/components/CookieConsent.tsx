import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { clearConsent, getConsent, onConsentChange, setConsent, type ConsentRecord } from "@/lib/privacy/consent";

const OPEN_EVENT = "ls:open-cookie-settings";

/** Reopen the banner from anywhere (footer "Cookie settings", the privacy page). */
export function openCookieSettings(): void {
  clearConsent();
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * Consent banner. Shown once per policy version to visitors with no decision on record and no browser
 * opt-out signal. "Accept all" and "Reject all" are equally prominent; the toggle is off by default.
 * Nothing optional runs before a choice is made.
 */
export function CookieConsent() {
  const [consent, setConsentState] = useState<ConsentRecord | null>(() => getConsent());
  const [open, setOpen] = useState(() => getConsent() === null);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const offChange = onConsentChange((c) => { setConsentState(c); if (c) setOpen(false); });
    const onOpen = () => { setAnalytics(false); setOpen(true); };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => { offChange(); window.removeEventListener(OPEN_EVENT, onOpen); };
  }, []);

  if (!open || consent) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Privacy choices" className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl liquid-glass-strong p-4 sm:p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Your privacy choices</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            LastSearch only uses strictly necessary storage to run (your sign-in session and UI preferences). With your permission we also
            use PostHog and Vercel Analytics to understand how the site is used. Nothing optional runs until you choose. You can change
            your mind any time from “Cookie settings” in the footer. See the{" "}
            <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
        <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2 text-xs">
          <span>
            <span className="font-medium text-foreground">Analytics</span>
            <span className="block text-muted-foreground">Page views and feature usage. Off until you turn it on.</span>
          </span>
          <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Allow analytics" />
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button size="sm" onClick={() => setConsent({ analytics: false })}>Reject all</Button>
          <Button variant="outline" size="sm" onClick={() => setConsent({ analytics })}>Save choices</Button>
          <Button size="sm" onClick={() => setConsent({ analytics: true })}>Accept all</Button>
        </div>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return <button type="button" onClick={openCookieSettings} className={className}>Cookie settings</button>;
}
