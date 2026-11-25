/** 리포트용 저장소 파사드. HTTP/MSW 없음 (STEP5a). */

import { artworkSeed, exhibitionSeed } from "@/lib/data";
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
import { KEYS, readJSON, readSavedLeaflets } from "@/lib/storage";
import type { Leaflet } from "@/lib/types";

export type ReportStorage = Pick<Storage, "getItem">;

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

/**
 * 전시 리포트 입력 스냅샷. 관람·문의 UI의 직접 읽기는 이 단계에서 옮기지 않는다.
 */
export function readExhibitionReportSource(
  exhibitionId: string,
  storage?: ReportStorage,
): ExhibitionReportSource {
  const store =
    storage ??
    (typeof localStorage !== "undefined" ? localStorage : undefined);

  const exhibition = exhibitionSeed.find((e) => e.id === exhibitionId) ?? null;

  const leaflets: Leaflet[] = store
    ? store === localStorage
      ? readSavedLeaflets()
      : readList<Leaflet>(store, KEYS.savedLeaflets)
    : [];

  const interests = store ? readList<InterestWork>(store, KEYS.interestWorks) : [];
  const inquiriesRaw = store
    ? readList<ExhibitionReportSourceInquiry>(store, KEYS.inquiries)
    : [];
  const events = store ? readList<VisitorEvent>(store, KEYS.visitorEvents) : [];

  const zonesByArtwork: Record<string, string | null | undefined> = {};
  const artworkTitles: Record<string, string | undefined> = {};
  for (const a of artworkSeed) {
    if (a.exhibitionId !== exhibitionId) continue;
    zonesByArtwork[a.id] = a.zone;
    artworkTitles[a.id] = a.title;
  }

  const themeColorName = themeColorNameForExhibition(
    exhibitionId,
    exhibition?.themeColorName,
    store,
  );

  return {
    exhibitionId,
    exhibitionTitle: exhibition?.title ?? null,
    themeColorName,
    leaflets: leaflets.map(leafletToSource),
    interests,
    inquiries: inquiriesRaw,
    events,
    zonesByArtwork,
    artworkTitles,
  };
}

export function loadExhibitionReport(
  exhibitionId: string,
  storage?: ReportStorage,
): ExhibitionReport {
  return buildExhibitionReport(readExhibitionReportSource(exhibitionId, storage));
}
