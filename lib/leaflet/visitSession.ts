/** 방문 ID · 로그인 병합 (유형 스키마는 STEP3a visitorIdentity 재사용) */

import { KEYS, readJSON } from "@/lib/storage";
import { listVisitorEvents, mergeIdentityForLeaflet } from "@/lib/leaflet/events";
import { listInquiries } from "@/lib/leaflet/inquiry";
import { listInterestWorks } from "@/lib/leaflet/interest";
import {
  resolveIdentityKind,
  visitorKeyForLeaflet,
} from "@/lib/leaflet/visitorIdentity";
import type { Role } from "@/lib/types";

export function newVisitId(): string {
  return `visit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 문의로 식별된 고객이 같은 브라우저에 있는지 */
export function hasIdentifiedVisitor(): boolean {
  if (typeof localStorage === "undefined") return false;
  if (listInquiries().some((i) => i.identityKind === "identified" || i.identityKind === "member")) {
    return true;
  }
  return listVisitorEvents().some(
    (e) => e.identityKind === "identified" || e.type === "inquiry_submit",
  );
}

/**
 * 로그인 시 익명·식별 기록을 회원에 이어 붙인다.
 * visitId와 (있으면) leafletId를 같은 visitorKey로 묶는다.
 */
export function mergeVisitorOnLogin(input: {
  visitId: string;
  leafletId?: string | null;
  role: Role;
}): void {
  if (input.role !== "visitor-member") return;
  const keys = new Set<string>([input.visitId]);
  if (input.leafletId) keys.add(input.leafletId);
  for (const key of keys) {
    const from = resolveIdentityKind("visitor-guest", key);
    if (from === "member") continue;
    const had =
      listVisitorEvents(key).some((e) => e.identityKind === "anonymous" || e.identityKind === "identified") ||
      listInterestWorks(key).length > 0 ||
      listInquiries(key).length > 0;
    if (!had && from === "anonymous") {
      // visitId만 있고 이벤트 없으면 스킵 가능하지만, 관심·촬영은 capture에만 있을 수 있음
      if (listVisitorEvents(key).length === 0 && listInterestWorks(key).length === 0) continue;
    }
    mergeIdentityForLeaflet(key, from === "identified" ? "identified" : "anonymous", "member", visitorKeyForLeaflet(key));
  }
}

export function readStoredVisitId(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem("restart.visitId");
}

export function writeStoredVisitId(visitId: string) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem("restart.visitId", visitId);
}

/** artworkPicks와 무관한 키 확인용 */
export function artworkPicksUntouched(): string[] {
  return readJSON<string[]>(localStorage, KEYS.artworkPicks, []);
}
