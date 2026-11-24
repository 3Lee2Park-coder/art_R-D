/** 관람객 이벤트 모의 저장 */

import { KEYS, readJSON } from "@/lib/storage";
import type { VisitorIdentityKind } from "@/lib/leaflet/visitorIdentity";

export type VisitorEventType =
  | "interest_add"
  | "interest_remove"
  | "inquiry_open"
  | "inquiry_submit"
  | "identity_merge"
  | "news_subscribe";

export type VisitorEvent = {
  id: string;
  at: string;
  type: VisitorEventType;
  leafletId: string;
  exhibitionId?: string;
  artworkId?: string;
  visitorKey: string;
  identityKind: VisitorIdentityKind;
  payload?: Record<string, unknown>;
};

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function listVisitorEvents(leafletId?: string): VisitorEvent[] {
  if (typeof localStorage === "undefined") return [];
  const all = readJSON<VisitorEvent[]>(localStorage, KEYS.visitorEvents, []);
  return leafletId ? all.filter((e) => e.leafletId === leafletId) : all;
}

export function appendVisitorEvent(
  input: Omit<VisitorEvent, "id" | "at"> & { at?: string; id?: string },
): VisitorEvent {
  const event: VisitorEvent = {
    id: input.id ?? newId("evt"),
    at: input.at ?? new Date().toISOString(),
    type: input.type,
    leafletId: input.leafletId,
    exhibitionId: input.exhibitionId,
    artworkId: input.artworkId,
    visitorKey: input.visitorKey,
    identityKind: input.identityKind,
    payload: input.payload,
  };
  if (typeof localStorage === "undefined") return event;
  const all = listVisitorEvents();
  localStorage.setItem(KEYS.visitorEvents, JSON.stringify([...all, event]));
  return event;
}

/** 같은 리플릿 ID 이벤트의 identityKind를 새 유형으로 갱신하고 merge 이벤트 기록 */
export function mergeIdentityForLeaflet(
  leafletId: string,
  from: VisitorIdentityKind,
  to: VisitorIdentityKind,
  visitorKey: string,
): VisitorEvent | null {
  if (from === to) return null;
  if (typeof localStorage === "undefined") return null;
  const all = listVisitorEvents();
  const next = all.map((e) =>
    e.leafletId === leafletId ? { ...e, identityKind: to, visitorKey } : e,
  );
  localStorage.setItem(KEYS.visitorEvents, JSON.stringify(next));
  return appendVisitorEvent({
    type: "identity_merge",
    leafletId,
    visitorKey,
    identityKind: to,
    payload: { mergedFrom: from, mergedTo: to },
  });
}
