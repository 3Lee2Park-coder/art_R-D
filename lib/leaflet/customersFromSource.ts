/**
 * 소스 스냅샷에서 고객을 묶는다 (저장소 읽기 없음).
 * exhibitionReport KPI와 galleryCustomers 목록이 같은 규칙을 쓴다.
 */

import { normalizeContactKey } from "@/lib/leaflet/contactKey";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import type { VisitorIdentityKind } from "@/lib/leaflet/visitorIdentity";

/** 화면 표시용. 저장 identityKind는 바꾸지 않으며, 회원도 식별로 보여 준다. */
export type CustomerDisplayKind = "identified";

export type GalleryCustomerListItem = {
  customerId: string;
  name: string | null;
  displayKind: CustomerDisplayKind;
  lastVisitAt: string | null;
  exhibitionIds: string[];
  hasInquiry: boolean;
};

export type GalleryCustomerDetail = {
  customerId: string;
  name: string | null;
  displayKind: CustomerDisplayKind;
  /** 저장값 그대로(추측·병합 없음). 표시는 displayKind만. */
  storedIdentityKinds: VisitorIdentityKind[];
  emails: string[];
  phones: string[];
  /** 값이 확인된 경우만 */
  consentContact: boolean | null;
  consentNews: boolean | null;
  visits: {
    exhibitionId: string;
    exhibitionTitle: string | null;
    leafletId: string;
    recordedAt: string | null;
  }[];
  interests: {
    artworkId: string;
    title?: string;
    exhibitionId: string;
    addedAt: string;
  }[];
  inquiries: {
    id: string;
    exhibitionId: string;
    createdAt: string | null;
    name: string | null;
  }[];
  recommendations: {
    artworkId: string;
    exhibitionId: string;
    leafletId: string;
  }[];
  similarArtworks: {
    artworkId: string;
    exhibitionId: string;
    leafletId: string;
  }[];
  exhibitionIds: string[];
};

type ContactSighting = {
  key: string;
  method: "email" | "phone";
  raw: string;
  leafletId: string;
  exhibitionId: string;
  exhibitionTitle: string | null;
  at: string | null;
  name: string | null;
  identityKind: VisitorIdentityKind | null;
  consentContact: boolean | null;
  consentNews: boolean | null;
  inquiryId: string | null;
};

type CustomerBucket = {
  keys: Set<string>;
  emails: Map<string, string>;
  phones: Map<string, string>;
  names: string[];
  identityKinds: Set<VisitorIdentityKind>;
  leafletIds: Set<string>;
  exhibitionIds: Set<string>;
  exhibitionTitles: Map<string, string | null>;
  inquiryIds: Set<string>;
  consentContact: boolean | null;
  consentNews: boolean | null;
  times: string[];
};

function find(parent: Map<string, string>, x: string): string {
  let p = parent.get(x) ?? x;
  if (!parent.has(x)) parent.set(x, x);
  while (parent.get(p) !== p) {
    const grand = parent.get(p) ?? p;
    parent.set(p, grand);
    p = grand;
  }
  return p;
}

function union(parent: Map<string, string>, a: string, b: string) {
  const ra = find(parent, a);
  const rb = find(parent, b);
  if (ra === rb) return;
  parent.set(rb, ra);
}

/** FNV-1a 32-bit ×2 → 16 hex. 연락처 원문을 URL에 넣지 않는다. */
export function customerIdFromKeys(keys: string[]): string {
  const input = [...keys].sort().join("\0");
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0x9e3779b9;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= c + i;
    h2 = Math.imul(h2, 0x01000193) >>> 0;
  }
  return `c-${h1.toString(16).padStart(8, "0")}${h2.toString(16).padStart(8, "0")}`;
}

/** 전시 리포트 「연락처 확보 고객」= 사람 수 (목록과 동일 묶기). */
export function countExhibitionCustomers(source: ExhibitionReportSource): number {
  return buildCustomersFromSources([source]).length;
}

function methodFromKey(key: string): "email" | "phone" {
  return key.startsWith("phone:") ? "phone" : "email";
}

function collectSightings(source: ExhibitionReportSource): ContactSighting[] {
  const leaflets = source.leaflets.filter((l) => l.exhibitionId === source.exhibitionId);
  const leafletIds = new Set(leaflets.map((l) => l.id));
  const out: ContactSighting[] = [];

  for (const inq of source.inquiries) {
    const forShow =
      inq.exhibitionId === source.exhibitionId || leafletIds.has(inq.leafletId);
    if (!forShow) continue;
    if (!inq.consentContact) continue;
    const key = normalizeContactKey(inq.contactValue ?? "", inq.contactMethod);
    if (!key) continue;
    const method = methodFromKey(key);
    out.push({
      key,
      method,
      raw: (inq.contactValue ?? "").trim(),
      leafletId: inq.leafletId,
      exhibitionId: source.exhibitionId,
      exhibitionTitle: source.exhibitionTitle,
      at: inq.createdAt ?? null,
      name: inq.name?.trim() ? inq.name.trim() : null,
      identityKind:
        inq.identityKind === "member" ||
        inq.identityKind === "identified" ||
        inq.identityKind === "anonymous"
          ? inq.identityKind
          : null,
      consentContact: true,
      consentNews: typeof inq.consentNews === "boolean" ? inq.consentNews : null,
      inquiryId: inq.id,
    });
  }

  for (const e of source.events) {
    if (e.type !== "news_subscribe") continue;
    if (e.exhibitionId !== source.exhibitionId && !leafletIds.has(e.leafletId)) continue;
    const value =
      typeof e.payload?.contactValue === "string" ? e.payload.contactValue : "";
    const method =
      e.payload?.contactMethod === "phone" || e.payload?.contactMethod === "email"
        ? e.payload.contactMethod
        : null;
    const key = normalizeContactKey(value, method);
    if (!key) continue;
    out.push({
      key,
      method: methodFromKey(key),
      raw: value.trim(),
      leafletId: e.leafletId,
      exhibitionId: source.exhibitionId,
      exhibitionTitle: source.exhibitionTitle,
      at: e.at,
      name: null,
      identityKind:
        e.identityKind === "member" ||
        e.identityKind === "identified" ||
        e.identityKind === "anonymous"
          ? e.identityKind
          : null,
      consentContact: null,
      consentNews: true,
      inquiryId: null,
    });
  }

  return out;
}

function mergeSightings(sightings: ContactSighting[]): CustomerBucket[] {
  if (sightings.length === 0) return [];

  const parent = new Map<string, string>();
  for (const s of sightings) find(parent, s.key);

  const byLeaflet = new Map<string, string[]>();
  for (const s of sightings) {
    const list = byLeaflet.get(s.leafletId) ?? [];
    list.push(s.key);
    byLeaflet.set(s.leafletId, list);
  }
  for (const keys of byLeaflet.values()) {
    for (let i = 1; i < keys.length; i++) union(parent, keys[0], keys[i]);
  }

  const buckets = new Map<string, CustomerBucket>();
  for (const s of sightings) {
    const root = find(parent, s.key);
    let bucket = buckets.get(root);
    if (!bucket) {
      bucket = {
        keys: new Set(),
        emails: new Map(),
        phones: new Map(),
        names: [],
        identityKinds: new Set(),
        leafletIds: new Set(),
        exhibitionIds: new Set(),
        exhibitionTitles: new Map(),
        inquiryIds: new Set(),
        consentContact: null,
        consentNews: null,
        times: [],
      };
      buckets.set(root, bucket);
    }
    bucket.keys.add(s.key);
    if (s.method === "email") bucket.emails.set(s.key, s.raw);
    else bucket.phones.set(s.key, s.raw);
    if (s.name) bucket.names.push(s.name);
    if (s.identityKind && s.identityKind !== "anonymous") {
      bucket.identityKinds.add(s.identityKind);
    }
    bucket.leafletIds.add(s.leafletId);
    bucket.exhibitionIds.add(s.exhibitionId);
    bucket.exhibitionTitles.set(s.exhibitionId, s.exhibitionTitle);
    if (s.inquiryId) bucket.inquiryIds.add(s.inquiryId);
    if (s.consentContact === true) bucket.consentContact = true;
    if (s.consentNews === true) bucket.consentNews = true;
    else if (s.consentNews === false && bucket.consentNews === null) {
      bucket.consentNews = false;
    }
    if (s.at) bucket.times.push(s.at);
  }

  return [...buckets.values()];
}

function enrichBucket(
  bucket: CustomerBucket,
  sources: ExhibitionReportSource[],
): GalleryCustomerDetail {
  const customerId = customerIdFromKeys([...bucket.keys]);
  const leafletIds = bucket.leafletIds;

  for (const source of sources) {
    for (const l of source.leaflets) {
      if (l.exhibitionId !== source.exhibitionId) continue;
      if (!leafletIds.has(l.id)) continue;
      if (l.recordedAt) bucket.times.push(l.recordedAt);
      bucket.exhibitionIds.add(source.exhibitionId);
      bucket.exhibitionTitles.set(source.exhibitionId, source.exhibitionTitle);
    }
    for (const w of source.interests) {
      if (!leafletIds.has(w.leafletId)) continue;
      bucket.times.push(w.addedAt);
    }
  }

  const visits: GalleryCustomerDetail["visits"] = [];
  const interests: GalleryCustomerDetail["interests"] = [];
  const inquiries: GalleryCustomerDetail["inquiries"] = [];
  const recommendations: GalleryCustomerDetail["recommendations"] = [];
  const similarArtworks: GalleryCustomerDetail["similarArtworks"] = [];
  const seenVisit = new Set<string>();
  const seenInq = new Set<string>();

  for (const source of sources) {
    for (const l of source.leaflets) {
      if (l.exhibitionId !== source.exhibitionId) continue;
      if (!leafletIds.has(l.id)) continue;
      const vk = `${source.exhibitionId}:${l.id}`;
      if (!seenVisit.has(vk)) {
        seenVisit.add(vk);
        visits.push({
          exhibitionId: source.exhibitionId,
          exhibitionTitle: source.exhibitionTitle,
          leafletId: l.id,
          recordedAt: l.recordedAt ?? null,
        });
      }
      for (const id of l.recommendationArtworkIds ?? []) {
        if (id) {
          recommendations.push({
            artworkId: id,
            exhibitionId: source.exhibitionId,
            leafletId: l.id,
          });
        }
      }
      const similarId = l.result?.similar?.artworkId;
      if (similarId) {
        similarArtworks.push({
          artworkId: similarId,
          exhibitionId: source.exhibitionId,
          leafletId: l.id,
        });
      }
    }
    for (const w of source.interests) {
      if (!leafletIds.has(w.leafletId)) continue;
      if (w.exhibitionId !== source.exhibitionId) continue;
      const title = source.artworkTitles?.[w.artworkId];
      interests.push({
        artworkId: w.artworkId,
        ...(title ? { title } : {}),
        exhibitionId: w.exhibitionId,
        addedAt: w.addedAt,
      });
    }
    for (const inq of source.inquiries) {
      if (!bucket.inquiryIds.has(inq.id)) continue;
      if (seenInq.has(inq.id)) continue;
      seenInq.add(inq.id);
      inquiries.push({
        id: inq.id,
        exhibitionId: inq.exhibitionId,
        createdAt: inq.createdAt ?? null,
        name: inq.name?.trim() ? inq.name.trim() : null,
      });
    }
  }

  visits.sort((a, b) => (b.recordedAt ?? "").localeCompare(a.recordedAt ?? ""));
  interests.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  inquiries.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

  return {
    customerId,
    name: bucket.names[0] ?? null,
    displayKind: "identified",
    storedIdentityKinds: [...bucket.identityKinds],
    emails: [...bucket.emails.values()],
    phones: [...bucket.phones.values()],
    consentContact: bucket.consentContact,
    consentNews: bucket.consentNews,
    visits,
    interests,
    inquiries,
    recommendations,
    similarArtworks,
    exhibitionIds: [...bucket.exhibitionIds].sort(),
  };
}

/** 동일 소스(들)에서 고객을 만든다. 익명·무연락처는 제외. */
export function buildCustomersFromSources(
  sources: ExhibitionReportSource[],
): GalleryCustomerDetail[] {
  const sightings = sources.flatMap(collectSightings);
  const buckets = mergeSightings(sightings);
  return buckets
    .map((b) => enrichBucket(b, sources))
    .sort((a, b) => {
      const at = a.visits[0]?.recordedAt ?? "";
      const bt = b.visits[0]?.recordedAt ?? "";
      return bt.localeCompare(at) || a.customerId.localeCompare(b.customerId);
    });
}

/** 리플릿 → 고객 ID (화면 고객 ID와 동일). 익명·연락처 없음은 맵에 없다. */
export function customerIdsByLeaflet(
  source: ExhibitionReportSource,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of buildCustomersFromSources([source])) {
    for (const v of c.visits) map.set(v.leafletId, c.customerId);
  }
  return map;
}

export function buildExhibitionCustomers(
  source: ExhibitionReportSource,
): GalleryCustomerListItem[] {
  return buildCustomersFromSources([source]).map(toListItem);
}

function toListItem(detail: GalleryCustomerDetail): GalleryCustomerListItem {
  const lastVisitAt =
    detail.visits.map((v) => v.recordedAt).filter(Boolean).sort().at(-1) ??
    detail.inquiries.map((i) => i.createdAt).filter(Boolean).sort().at(-1) ??
    null;
  return {
    customerId: detail.customerId,
    name: detail.name,
    displayKind: "identified",
    lastVisitAt,
    exhibitionIds: detail.exhibitionIds,
    hasInquiry: detail.inquiries.length > 0,
  };
}
