/** 리포트용 저장소 파사드. HTTP/MSW 없음 (STEP5a). 5j: gallery fixtures merge. */

import { artworkSeed, exhibitionSeed } from "@/lib/data";
import { filterSourceByContractEnd } from "@/lib/leaflet/contractCutoff";
import type { VisitorEvent } from "@/lib/leaflet/events";
import {
  buildExhibitionReport,
  type ExhibitionReport,
  type ExhibitionReportSource,
  type ExhibitionReportSourceInquiry,
  type ExhibitionReportSourceLeaflet,
} from "@/lib/leaflet/exhibitionReport";
import { themeColorNameForExhibition } from "@/lib/leaflet/exhibitionTheme";
import type { InterestWork } from "@/lib/leaflet/interest";
import { getStudioFixtures } from "@/lib/mock/studioFixtures";
import { KEYS, readJSON, readSavedLeaflets } from "@/lib/storage";
import type { Artwork, Leaflet } from "@/lib/types";

export type ReportStorage = Pick<Storage, "getItem">;

export type ReadExhibitionReportSourceOptions = {
  /** 종료 계약 아카이브: recordedAt ≤ contractEndAt */
  contractEndAt?: string | null;
  /** true면 fixture 합치지 않음 (관람객 격리 테스트용) */
  skipFixtures?: boolean;
};

function readList<T>(storage: ReportStorage, key: string): T[] {
  return readJSON<T[]>(storage as Storage, key, []);
}

function leafletToSource(l: Leaflet): ExhibitionReportSourceLeaflet {
  return {
    id: l.id,
    exhibitionId: l.exhibitionId,
    themeColor: l.themeColor ?? null,
    records: l.records,
    recommendationArtworkIds: l.recommendationArtworkIds,
    recordedAt: l.visitDate ?? null,
    result: l.result
      ? {
          style: l.result.style,
          typeName: l.result.typeName,
          similar: l.result.similar
            ? { artworkId: l.result.similar.artworkId }
            : undefined,
        }
      : null,
  };
}

function mergeById<T extends { id: string }>(fixtures: T[], stored: T[]): T[] {
  const map = new Map<string, T>();
  for (const f of fixtures) map.set(f.id, f);
  for (const s of stored) map.set(s.id, s);
  return [...map.values()];
}

function mergeInterests(
  fixtures: InterestWork[],
  stored: InterestWork[],
): InterestWork[] {
  const key = (w: InterestWork) =>
    `${w.leafletId}|${w.artworkId}|${w.exhibitionId}|${w.addedAt}`;
  const map = new Map<string, InterestWork>();
  for (const f of fixtures) map.set(key(f), f);
  for (const s of stored) map.set(key(s), s);
  return [...map.values()];
}

function mergeCheckIns(
  fixtures: import("@/lib/mock/studioFixtures").CheckInSession[],
  // no localStorage check-ins yet
): import("@/lib/mock/studioFixtures").CheckInSession[] {
  return fixtures;
}

/**
 * 전시 리포트 입력 스냅샷. 갤러리 화면용 — fixture + localStorage(동일 id는 저장 우선).
 */
export function readExhibitionReportSource(
  exhibitionId: string,
  storage?: ReportStorage,
  options?: ReadExhibitionReportSourceOptions,
): ExhibitionReportSource {
  const store =
    storage ??
    (typeof localStorage !== "undefined" ? localStorage : undefined);

  const exhibition = exhibitionSeed.find((e) => e.id === exhibitionId) ?? null;

  const leaflets: Leaflet[] = store
    ? typeof localStorage !== "undefined" && store === localStorage
      ? readSavedLeaflets()
      : readList<Leaflet>(store, KEYS.savedLeaflets)
    : [];

  const interests = store ? readList<InterestWork>(store, KEYS.interestWorks) : [];
  const inquiriesRaw = store
    ? readList<ExhibitionReportSourceInquiry>(store, KEYS.inquiries)
    : [];
  const events = store ? readList<VisitorEvent>(store, KEYS.visitorEvents) : [];

  const studioArts = store
    ? readList<Artwork>(store, KEYS.studioArtworks)
    : [];

  const fixtures = options?.skipFixtures ? null : getStudioFixtures();
  const fxArts = fixtures?.artworks ?? [];
  const fxLeaflets = (fixtures?.leaflets ?? []).filter(
    (l) => l.exhibitionId === exhibitionId,
  );
  const fxInterests = (fixtures?.interests ?? []).filter(
    (i) => i.exhibitionId === exhibitionId,
  );
  const fxInquiries = (fixtures?.inquiries ?? [])
    .filter((q) => q.exhibitionId === exhibitionId)
    .map(
      (q): ExhibitionReportSourceInquiry => ({
        id: q.id,
        leafletId: q.leafletId,
        exhibitionId: q.exhibitionId,
        status: q.status,
        saleResult: q.saleResult,
        identityKind: q.identityKind,
        contactMethod: q.contactMethod,
        contactValue: q.contactValue,
        consentContact: q.consentContact,
        consentNews: q.consentNews,
        name: q.name,
        inquiredArtworkIds: q.inquiredArtworkIds,
        createdAt: q.createdAt,
      }),
    );
  const fxEvents = (fixtures?.events ?? []).filter(
    (e) => e.exhibitionId === exhibitionId,
  );
  const fxSessions = (fixtures?.checkInSessions ?? []).filter(
    (s) => s.exhibitionId === exhibitionId,
  );

  const zonesByArtwork: Record<string, string | null | undefined> = {};
  const artworkTitles: Record<string, string | undefined> = {};
  for (const a of [...artworkSeed, ...fxArts, ...studioArts]) {
    zonesByArtwork[a.id] = a.zone;
    artworkTitles[a.id] = a.title;
  }

  const themeColorName = themeColorNameForExhibition(
    exhibitionId,
    exhibition?.themeColorName,
    store,
  );

  const storedLeaflets = leaflets
    .map(leafletToSource)
    .filter((l) => l.exhibitionId === exhibitionId);

  const source: ExhibitionReportSource = {
    exhibitionId,
    exhibitionTitle: exhibition?.title ?? null,
    themeColorName,
    leaflets: mergeById(fxLeaflets, storedLeaflets),
    interests: mergeInterests(fxInterests, interests),
    inquiries: mergeById(fxInquiries, inquiriesRaw),
    events: mergeById(fxEvents, events),
    zonesByArtwork,
    artworkTitles,
    checkInSessions: mergeCheckIns(fxSessions),
  };

  const endAt = options?.contractEndAt;
  if (endAt) return filterSourceByContractEnd(source, endAt);
  return source;
}

export function loadExhibitionReport(
  exhibitionId: string,
  storage?: ReportStorage,
  options?: ReadExhibitionReportSourceOptions,
): ExhibitionReport {
  return buildExhibitionReport(
    readExhibitionReportSource(exhibitionId, storage, options),
  );
}
