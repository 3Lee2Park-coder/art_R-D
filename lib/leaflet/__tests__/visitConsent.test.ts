import { describe, expect, it } from "vitest";
import {
  clearVisitConsent,
  hasVisitAccess,
  readVisitConsent,
  writeVisitConsent,
} from "@/lib/leaflet/visitConsent";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  };
}

describe("visitConsent", () => {
  it("visitId에 동의를 기록하고 읽는다", () => {
    const storage = memoryStorage();
    writeVisitConsent("visit-a", "2026-11-16", storage);
    expect(readVisitConsent(storage)).toEqual({
      visitId: "visit-a",
      version: "2026-11-16",
    });
  });

  it("다른 visitId면 접근 불가 [가안]", () => {
    expect(
      hasVisitAccess({
        visitId: "visit-b",
        memberConsentVersion: null,
        visitConsent: { visitId: "visit-a", version: "2026-11-16" },
      }),
    ).toBe(false);
  });

  it("같은 visitId 동의하면 접근 가능", () => {
    expect(
      hasVisitAccess({
        visitId: "visit-a",
        memberConsentVersion: null,
        visitConsent: { visitId: "visit-a", version: "2026-11-16" },
      }),
    ).toBe(true);
  });

  it("회원 consentVersion이 있으면 visit 동의 없이도 접근", () => {
    expect(
      hasVisitAccess({
        visitId: null,
        memberConsentVersion: "2026-11-16",
        visitConsent: null,
      }),
    ).toBe(true);
  });

  it("clearVisitConsent가 키를 지운다", () => {
    const storage = memoryStorage();
    writeVisitConsent("visit-a", "2026-11-16", storage);
    clearVisitConsent(storage);
    expect(readVisitConsent(storage)).toBeNull();
  });
});
