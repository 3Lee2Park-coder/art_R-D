/** 스튜디오 접근 판정 (5e). 5f 고객 라우트에서 재사용. */

import type { Gallery, Role } from "@/lib/types";

export function isGalleryRole(role: Role): boolean {
  return (
    role === "gallery-contracted" ||
    role === "gallery-uncontracted" ||
    role === "gallery-ended"
  );
}

/** 로그아웃(비로그인)과 관람객 로그인을 구분한다. */
export function isLoggedOut(role: Role): boolean {
  return role === "visitor-guest";
}

export function pathNeedsContractLanding(path: string): boolean {
  return path.startsWith("/studio/reports") || path.startsWith("/studio/inquiries");
}

export function isUncontractedGallery(
  role: Role,
  contractState?: Gallery["contractState"] | null,
): boolean {
  if (role === "gallery-uncontracted") return true;
  return contractState === "uncontracted";
}

export function isEndedGallery(
  role: Role,
  contractState?: Gallery["contractState"] | null,
): boolean {
  if (role === "gallery-ended") return true;
  return contractState === "ended";
}

/** 문의 상태·판매 결과 등 쓰기. 종료 계약은 false. */
export function canMutateStudioInquiry(
  role: Role,
  contractState?: Gallery["contractState"] | null,
): boolean {
  if (role !== "gallery-contracted") return false;
  return contractState === "contracted";
}
