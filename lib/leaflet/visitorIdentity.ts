/** 관람객 유형 · 리플릿 ID로 관심·문의·이벤트를 묶음 */

import { KEYS, readJSON } from "@/lib/storage";
import type { Role } from "@/lib/types";

export type VisitorIdentityKind = "member" | "identified" | "anonymous";

export function identityKindFromRole(role: Role): VisitorIdentityKind {
  return role === "visitor-member" ? "member" : "anonymous";
}

/** role + 해당 리플릿 문의 여부로 현재 유형 */
export function resolveIdentityKind(role: Role, leafletId: string): VisitorIdentityKind {
  if (role === "visitor-member") return "member";
  if (typeof localStorage === "undefined") return "anonymous";
  const inquiries = readJSON<Array<{ leafletId: string }>>(localStorage, KEYS.inquiries, []);
  if (inquiries.some((item) => item.leafletId === leafletId)) return "identified";
  return "anonymous";
}

/** 리플릿 ID가 곧 visitorKey (익명·식별·회원 공통 묶음) */
export function visitorKeyForLeaflet(leafletId: string): string {
  return leafletId;
}
