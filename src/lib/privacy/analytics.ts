/**
 * Product analytics (PostHog) behind consent. The SDK is not initialised, and sets no cookie, until the
 * visitor has opted in; withdrawing consent stops capture and clears what the SDK stored.
 * Every call site goes through `track`/`identify`, which are no-ops without consent.
 */
import posthog from "posthog-js";
import { analyticsAllowed, onConsentChange } from "./consent";

let started = false;

function start(): void {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (started || !key) return;
  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    respect_dnt: true,
    disable_session_recording: true,
    // if recording is ever enabled, no keystroke or field value is captured
    session_recording: { maskAllInputs: true, maskTextSelector: "*" },
    mask_all_text: true,
    mask_all_element_attributes: true,
    disable_surveys: true,
    autocapture: false,
    capture_pageview: true,
    ip: false,
  });
  started = true;
}

function stop(): void {
  if (!started) return;
  posthog.opt_out_capturing();
  posthog.reset();
  started = false;
}

/** Call once at boot: starts analytics if consent is already on record and follows later changes. */
export function initAnalytics(): void {
  if (analyticsAllowed()) start();
  onConsentChange((c) => (c?.analytics ? (start(), posthog.opt_in_capturing()) : stop()));
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (started && analyticsAllowed()) posthog.capture(event, props);
}

/** Identify by stable account id only; no email or name is sent to the analytics provider. */
export function identify(userId: string): void {
  if (started && analyticsAllowed()) posthog.identify(userId);
}

export function resetIdentity(): void {
  if (started) posthog.reset();
}
