import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_KEY, CONSENT_VERSION, analyticsAllowed, clearConsent, getConsent, hasOptOutSignal, setConsent } from "./consent";

describe("consent", () => {
  beforeEach(() => localStorage.clear());

  it("is unknown until the visitor decides: nothing optional may run", () => {
    expect(getConsent()).toBeNull();
    expect(analyticsAllowed()).toBe(false);
  });

  it("records the decision with a timestamp and the policy version", () => {
    const c = setConsent({ analytics: true });
    expect(c.version).toBe(CONSENT_VERSION);
    expect(Date.parse(c.at)).toBeGreaterThan(0);
    expect(analyticsAllowed()).toBe(true);
    expect(JSON.parse(localStorage.getItem(CONSENT_KEY)!).source).toBe("banner");
  });

  it("asks again after the policy version changes", () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: true, version: CONSENT_VERSION - 1, at: "2026-01-01T00:00:00Z", source: "banner" }));
    expect(getConsent()).toBeNull();
  });

  it("can be withdrawn as easily as it was given", () => {
    setConsent({ analytics: true });
    setConsent({ analytics: false });
    expect(analyticsAllowed()).toBe(false);
    clearConsent();
    expect(getConsent()).toBeNull();
  });

  it("treats Global Privacy Control and Do Not Track as a no", () => {
    expect(hasOptOutSignal({ globalPrivacyControl: true })).toBe(true);
    expect(hasOptOutSignal({ doNotTrack: "1" })).toBe(true);
    expect(hasOptOutSignal({ doNotTrack: null })).toBe(false);
  });
});
