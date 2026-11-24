/** [가안] 게스트·회원 방문 단위 동의. visitId에만 유효. */

import { SESSION } from "@/lib/storage";

export type VisitConsent = {
  visitId: string;
  version: string;
};

export function readVisitConsent(
  storage: Pick<Storage, "getItem"> = sessionStorage,
): VisitConsent | null {
  try {
    const raw = storage.getItem(SESSION.visitConsent);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VisitConsent;
    if (!parsed?.visitId || !parsed?.version) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeVisitConsent(
  visitId: string,
  version: string,
  storage: Pick<Storage, "setItem"> = sessionStorage,
): void {
  storage.setItem(SESSION.visitConsent, JSON.stringify({ visitId, version }));
}

export function clearVisitConsent(storage: Pick<Storage, "removeItem"> = sessionStorage): void {
  storage.removeItem(SESSION.visitConsent);
}

/** 이번 방문 동의 또는 회원 consentVersion이 있으면 true */
export function hasVisitAccess(input: {
  visitId: string | null;
  memberConsentVersion: string | null;
  visitConsent?: VisitConsent | null;
}): boolean {
  if (input.memberConsentVersion) return true;
  const consent = input.visitConsent ?? null;
  if (!consent || !input.visitId) return false;
  return consent.visitId === input.visitId;
}
