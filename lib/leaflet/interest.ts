/** 리플릿 관심 작품 — KEYS.artworkPicks(마이룸)와 분리 */

import { KEYS, readJSON } from "@/lib/storage";
import { appendVisitorEvent } from "@/lib/leaflet/events";
import {
  resolveIdentityKind,
  visitorKeyForLeaflet,
  type VisitorIdentityKind,
} from "@/lib/leaflet/visitorIdentity";
import type { Role } from "@/lib/types";

export type InterestWork = {
  artworkId: string;
  exhibitionId: string;
  leafletId: string;
  addedAt: string;
};

export function listInterestWorks(leafletId?: string): InterestWork[] {
  if (typeof localStorage === "undefined") return [];
  const all = readJSON<InterestWork[]>(localStorage, KEYS.interestWorks, []);
  return leafletId ? filterInterestByLeaflet(all, leafletId) : all;
}

/** 메모리 상태(providers)에서 리플릿별 관심 작품 ID — 새로고침 없이 UI 동기화용 */
export function filterInterestByLeaflet(
  works: InterestWork[],
  leafletId: string,
): InterestWork[] {
  return works.filter((w) => w.leafletId === leafletId);
}

export function interestIdsFromWorks(works: InterestWork[], leafletId: string): string[] {
  return filterInterestByLeaflet(works, leafletId).map((w) => w.artworkId);
}

export function hasInterestInWorks(
  works: InterestWork[],
  leafletId: string,
  artworkId: string,
): boolean {
  return works.some((w) => w.leafletId === leafletId && w.artworkId === artworkId);
}

export function hasInterest(leafletId: string, artworkId: string): boolean {
  return listInterestWorks(leafletId).some((w) => w.artworkId === artworkId);
}

export function toggleInterestWork(input: {
  artworkId: string;
  exhibitionId: string;
  leafletId: string;
  role: Role;
}): { added: boolean; list: InterestWork[]; identityKind: VisitorIdentityKind } {
  const { artworkId, exhibitionId, leafletId, role } = input;
  const identityKind = resolveIdentityKind(role, leafletId);
  const visitorKey = visitorKeyForLeaflet(leafletId);
  const all = listInterestWorks();
  const exists = all.some((w) => w.leafletId === leafletId && w.artworkId === artworkId);
  let next: InterestWork[];
  if (exists) {
    next = all.filter((w) => !(w.leafletId === leafletId && w.artworkId === artworkId));
    appendVisitorEvent({
      type: "interest_remove",
      leafletId,
      exhibitionId,
      artworkId,
      visitorKey,
      identityKind,
    });
  } else {
    next = [
      ...all,
      { artworkId, exhibitionId, leafletId, addedAt: new Date().toISOString() },
    ];
    appendVisitorEvent({
      type: "interest_add",
      leafletId,
      exhibitionId,
      artworkId,
      visitorKey,
      identityKind,
    });
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEYS.interestWorks, JSON.stringify(next));
  }
  return {
    added: !exists,
    list: next.filter((w) => w.leafletId === leafletId),
    identityKind,
  };
}

/** 로그인 등으로 유형이 바뀔 때 관심 항목은 leafletId로 유지(배열 구조 동일) */
export function interestArtworkIdsForLeaflet(leafletId: string): string[] {
  return listInterestWorks(leafletId).map((w) => w.artworkId);
}
