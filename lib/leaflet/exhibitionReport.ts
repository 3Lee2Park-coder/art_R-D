/** 전시 리포트 집계 (순수). UI/스텁 reports.json 미사용. */

import type { VisitRecord } from "@/lib/leaflet/dwell";
import { dwellSeconds, mergeConsecutiveCamera } from "@/lib/leaflet/dwell";
import type { InterestWork } from "@/lib/leaflet/interest";
import type { VisitorEvent } from "@/lib/leaflet/events";
import {
  normalizeInquiryStatus,
  normalizeSaleResult,
  type InquiryStatus,
} from "@/lib/leaflet/inquiryStatus";
import type { StyleId } from "@/lib/leaflet/style";
import type { VisitorIdentityKind } from "@/lib/leaflet/visitorIdentity";

export const REPORT_STYLE_IDS = ["collector", "explorer", "immersive", "walker"] as const;
export type ReportStyleId = (typeof REPORT_STYLE_IDS)[number];

/** 화면 라벨 (집계 키와 분리) */
export const STYLE_LABELS: Record<ReportStyleId, string> = {
  collector: "수집가",
  explorer: "탐험가",
  immersive: "몰입가",
  walker: "오늘의 산책자",
};

export type ReportIdentityKind = VisitorIdentityKind | "unspecified";

export type ExhibitionReportLeafletItem = {
  id: string;
  identityKind: ReportIdentityKind;
  style: StyleId | null;
  typeName: string | null;
  themeColor: string | null;
};

export type ExhibitionReportVisitorsStored = {
  member: number;
  identified: number;
  anonymous: number;
  unspecified: number;
};

export type ExhibitionReportVisitorsReport = {
  identified: number;
  anonymous: number;
  unspecified: number;
  total: number;
};

export type ZoneDwell =
  | { available: true; averageSec: number }
  | { available: false };

export type ExhibitionReportZones =
  | {
      available: true;
      items: { zone: string; recordCount: number; dwell: ZoneDwell }[];
    }
  | { available: false };

export type ExhibitionReportArtworkStat = {
  artworkId: string;
  title?: string;
  recordCount: number;
  interestCount: number;
  inquiryCount: number;
  /** RestArt 추천(recommendationArtworkIds)만 */
  recommendationCount: number;
  /** 전시 작품 가장 닮은 작품(result.similar.artworkId)만 */
  similarCount: number;
};

export type ExhibitionReport = {
  exhibitionId: string;
  exhibitionTitle: string | null;
  themeColorName: string;
  leaflets: {
    count: number;
    items: ExhibitionReportLeafletItem[];
  };
  visitors: {
    stored: ExhibitionReportVisitorsStored;
    report: ExhibitionReportVisitorsReport;
  };
  /** 유효 연락처 고유 수. visitors.report.identified 와 분리 */
  contactsSecured: { count: number };
  interestByArtwork: { artworkId: string; count: number; title?: string }[];
  artworkStats: ExhibitionReportArtworkStat[];
  inquiries: {
    total: number;
    byStatus: Record<InquiryStatus, number>;
    bySaleResult: {
      미입력: number;
      판매됨: number;
      렌탈됨: number;
      "해당 없음": number;
    };
  };
  styles: Record<ReportStyleId, number>;
  styleLabels: typeof STYLE_LABELS;
  typeNames: { typeName: string; count: number }[];
  emotions: { emotionId: string; count: number }[];
  zones: ExhibitionReportZones;
};

export type ExhibitionReportSourceLeaflet = {
  id: string;
  exhibitionId: string | null;
  themeColor?: string | null;
  records?: VisitRecord[];
  result?: {
    style?: StyleId;
    typeName?: string;
    similar?: { artworkId?: string };
  } | null;
  recommendationArtworkIds?: string[];
  /** 체류 평균용. 없으면 해당 구역 dwell.available=false */
  generateAtSec?: number;
  /** 기록 시각 (컷오프용). 리플릿 visitDate 등 */
  recordedAt?: string | null;
};

export type ExhibitionReportSourceInquiry = {
  id: string;
  leafletId: string;
  exhibitionId: string;
  status?: unknown;
  saleResult?: unknown;
  identityKind?: VisitorIdentityKind;
  contactMethod?: "email" | "phone" | null;
  contactValue?: string;
  consentContact?: boolean;
  inquiredArtworkIds?: string[];
  /** 문의 생성 시각 (컷오프용) */
  createdAt?: string | null;
};

export type ExhibitionReportSource = {
  exhibitionId: string;
  exhibitionTitle: string | null;
  /** 현재 전시 테마 색 이름 (리플릿별 themeColor와 별개) */
  themeColorName: string;
  leaflets: ExhibitionReportSourceLeaflet[];
  interests: InterestWork[];
  inquiries: ExhibitionReportSourceInquiry[];
  events: VisitorEvent[];
  /** artworkId → zone. 비어 있으면 zones.available=false */
  zonesByArtwork: Record<string, string | null | undefined>;
  /** optional artwork titles for interest rows */
  artworkTitles?: Record<string, string | undefined>;
};

/** 5f: 동일 ExhibitionReportSource로 고객 목록을 만든다. 별도 저장소 읽기 금지. */
export function buildExhibitionCustomers(_source: ExhibitionReportSource): null {
  return null;
}

function emptyStatusCounts(): Record<InquiryStatus, number> {
  return {
    신규: 0,
    "연락 완료": 0,
    "후속 예정": 0,
    종료: 0,
  };
}

function emptySaleCounts(): ExhibitionReport["inquiries"]["bySaleResult"] {
  return {
    미입력: 0,
    판매됨: 0,
    렌탈됨: 0,
    "해당 없음": 0,
  };
}

function emptyStyles(): Record<ReportStyleId, number> {
  return {
    collector: 0,
    explorer: 0,
    immersive: 0,
    walker: 0,
  };
}

/** 이메일 lower/trim, 전화 숫자만 [가안] */
export function normalizeContactKey(
  contactValue: string,
  contactMethod?: "email" | "phone" | null,
): string | null {
  const raw = contactValue.trim();
  if (!raw) return null;
  const looksPhone =
    contactMethod === "phone" || (!contactMethod && /^[\d\s+\-()]+$/.test(raw));
  if (looksPhone) {
    const digits = raw.replace(/\D/g, "");
    return digits.length > 0 ? `phone:${digits}` : null;
  }
  return `email:${raw.toLowerCase()}`;
}

/** 이벤트 최신 identity → 문의 identity → unspecified. 저장값 수정 없음. */
export function resolveReportIdentity(
  leafletId: string,
  events: VisitorEvent[],
  inquiries: ExhibitionReportSourceInquiry[],
): ReportIdentityKind {
  const related = events
    .filter((e) => e.leafletId === leafletId)
    .slice()
    .sort((a, b) => a.at.localeCompare(b.at));
  const last = related[related.length - 1];
  if (last?.identityKind === "member" || last?.identityKind === "identified" || last?.identityKind === "anonymous") {
    return last.identityKind;
  }
  const inq = inquiries.find((i) => i.leafletId === leafletId);
  if (
    inq?.identityKind === "member" ||
    inq?.identityKind === "identified" ||
    inq?.identityKind === "anonymous"
  ) {
    return inq.identityKind;
  }
  return "unspecified";
}

function bumpCount(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function countContactsSecured(
  exhibitionId: string,
  leafletIds: Set<string>,
  inquiries: ExhibitionReportSourceInquiry[],
  events: VisitorEvent[],
): number {
  const keys = new Set<string>();

  for (const inq of inquiries) {
    const forShow =
      inq.exhibitionId === exhibitionId || leafletIds.has(inq.leafletId);
    if (!forShow) continue;
    if (!inq.consentContact) continue;
    const key = normalizeContactKey(inq.contactValue ?? "", inq.contactMethod);
    if (key) keys.add(key);
  }

  for (const e of events) {
    if (e.type !== "news_subscribe") continue;
    if (e.exhibitionId !== exhibitionId && !leafletIds.has(e.leafletId)) continue;
    const value =
      typeof e.payload?.contactValue === "string" ? e.payload.contactValue : "";
    const method =
      e.payload?.contactMethod === "phone" || e.payload?.contactMethod === "email"
        ? e.payload.contactMethod
        : null;
    const key = normalizeContactKey(value, method);
    if (key) keys.add(key);
  }

  return keys.size;
}

/** 리플릿당 추천 ID (배열 내 중복은 1). similar와 합치지 않음. */
function recommendationIdsForLeaflet(l: ExhibitionReportSourceLeaflet): string[] {
  const set = new Set<string>();
  for (const id of l.recommendationArtworkIds ?? []) {
    if (id) set.add(id);
  }
  return [...set];
}

function similarArtworkIdForLeaflet(l: ExhibitionReportSourceLeaflet): string | null {
  const id = l.result?.similar?.artworkId;
  return id ? id : null;
}

/**
 * 전시 리포트 집계. localStorage/window를 읽지 않는다.
 */
export function buildExhibitionReport(input: ExhibitionReportSource): ExhibitionReport {
  const seen = new Set<string>();
  const leaflets = input.leaflets.filter((l) => {
    if (l.exhibitionId !== input.exhibitionId) return false;
    if (seen.has(l.id)) return false;
    seen.add(l.id);
    return true;
  });

  const leafletIds = new Set(leaflets.map((l) => l.id));

  const items: ExhibitionReportLeafletItem[] = leaflets.map((l) => {
    const identityKind = resolveReportIdentity(l.id, input.events, input.inquiries);
    const style = l.result?.style ?? null;
    const typeName = l.result?.typeName ?? null;
    return {
      id: l.id,
      identityKind,
      style,
      typeName,
      themeColor: l.themeColor ?? null,
    };
  });

  const stored: ExhibitionReportVisitorsStored = {
    member: 0,
    identified: 0,
    anonymous: 0,
    unspecified: 0,
  };
  for (const item of items) {
    stored[item.identityKind] += 1;
  }

  const reportIdentified = stored.member + stored.identified;
  const visitorsReport: ExhibitionReportVisitorsReport = {
    identified: reportIdentified,
    anonymous: stored.anonymous,
    unspecified: stored.unspecified,
    total: reportIdentified + stored.anonymous + stored.unspecified,
  };

  const contactsSecured = {
    count: countContactsSecured(
      input.exhibitionId,
      leafletIds,
      input.inquiries,
      input.events,
    ),
  };

  const interestMap = new Map<string, number>();
  for (const w of input.interests) {
    if (!leafletIds.has(w.leafletId)) continue;
    if (w.exhibitionId !== input.exhibitionId) continue;
    bumpCount(interestMap, w.artworkId);
  }
  const interestByArtwork = [...interestMap.entries()]
    .map(([artworkId, count]) => {
      const title = input.artworkTitles?.[artworkId];
      return title ? { artworkId, count, title } : { artworkId, count };
    })
    .sort((a, b) => b.count - a.count || a.artworkId.localeCompare(b.artworkId));

  const recordMap = new Map<string, number>();
  const recommendMap = new Map<string, number>();
  const similarMap = new Map<string, number>();
  for (const l of leaflets) {
    for (const r of l.records ?? []) {
      bumpCount(recordMap, r.artworkId);
    }
    for (const id of recommendationIdsForLeaflet(l)) {
      bumpCount(recommendMap, id);
    }
    const similarId = similarArtworkIdForLeaflet(l);
    if (similarId) bumpCount(similarMap, similarId);
  }

  const inquiryArtMap = new Map<string, number>();
  const byStatus = emptyStatusCounts();
  const bySaleResult = emptySaleCounts();
  let inquiryTotal = 0;
  for (const inq of input.inquiries) {
    const forShow =
      inq.exhibitionId === input.exhibitionId || leafletIds.has(inq.leafletId);
    if (!forShow) continue;
    inquiryTotal += 1;
    byStatus[normalizeInquiryStatus(inq.status)] += 1;
    const sale = normalizeSaleResult(inq.saleResult);
    if (sale === null) bySaleResult.미입력 += 1;
    else bySaleResult[sale] += 1;
    for (const artId of inq.inquiredArtworkIds ?? []) {
      bumpCount(inquiryArtMap, artId);
    }
  }

  const artIds = new Set<string>([
    ...recordMap.keys(),
    ...interestMap.keys(),
    ...inquiryArtMap.keys(),
    ...recommendMap.keys(),
    ...similarMap.keys(),
  ]);
  const artworkStats: ExhibitionReportArtworkStat[] = [...artIds]
    .map((artworkId) => {
      const recordCount = recordMap.get(artworkId) ?? 0;
      const interestCount = interestMap.get(artworkId) ?? 0;
      const inquiryCount = inquiryArtMap.get(artworkId) ?? 0;
      const recommendationCount = recommendMap.get(artworkId) ?? 0;
      const similarCount = similarMap.get(artworkId) ?? 0;
      const title = input.artworkTitles?.[artworkId];
      const row: ExhibitionReportArtworkStat = {
        artworkId,
        recordCount,
        interestCount,
        inquiryCount,
        recommendationCount,
        similarCount,
      };
      if (title) row.title = title;
      return row;
    })
    .filter(
      (r) =>
        r.recordCount > 0 ||
        r.interestCount > 0 ||
        r.inquiryCount > 0 ||
        r.recommendationCount > 0 ||
        r.similarCount > 0,
    )
    .sort(
      (a, b) =>
        b.recordCount +
          b.interestCount +
          b.inquiryCount +
          b.recommendationCount +
          b.similarCount -
          (a.recordCount +
            a.interestCount +
            a.inquiryCount +
            a.recommendationCount +
            a.similarCount) || a.artworkId.localeCompare(b.artworkId),
    );

  const styles = emptyStyles();
  const typeMap = new Map<string, number>();
  for (const item of items) {
    if (item.style && (REPORT_STYLE_IDS as readonly string[]).includes(item.style)) {
      styles[item.style as ReportStyleId] += 1;
    }
    if (item.typeName) bumpCount(typeMap, item.typeName);
  }
  const typeNames = [...typeMap.entries()]
    .map(([typeName, count]) => ({ typeName, count }))
    .sort((a, b) => b.count - a.count || a.typeName.localeCompare(b.typeName));

  const emotionMap = new Map<string, number>();
  for (const l of leaflets) {
    for (const r of l.records ?? []) {
      if (r.emotionId) bumpCount(emotionMap, r.emotionId);
    }
  }
  const emotions = [...emotionMap.entries()]
    .map(([emotionId, count]) => ({ emotionId, count }))
    .sort((a, b) => b.count - a.count || a.emotionId.localeCompare(b.emotionId));

  const zoneKeys = Object.values(input.zonesByArtwork).filter(
    (z): z is string => typeof z === "string" && z.length > 0,
  );
  const hasZoneMap = zoneKeys.length > 0;
  let zones: ExhibitionReportZones = { available: false };

  if (hasZoneMap) {
    type Acc = { recordCount: number; dwellSecs: number[] };
    const byZone = new Map<string, Acc>();

    for (const l of leaflets) {
      const records = l.records ?? [];
      for (const r of records) {
        const zone = input.zonesByArtwork[r.artworkId];
        if (!zone) continue;
        const acc = byZone.get(zone) ?? { recordCount: 0, dwellSecs: [] };
        acc.recordCount += 1;
        byZone.set(zone, acc);
      }

      if (typeof l.generateAtSec === "number" && records.length > 0) {
        const merged = mergeConsecutiveCamera(records);
        const dwells = dwellSeconds(merged, l.generateAtSec);
        merged.forEach((m, i) => {
          const zone = input.zonesByArtwork[m.artworkId];
          if (!zone) return;
          const acc = byZone.get(zone) ?? { recordCount: 0, dwellSecs: [] };
          acc.dwellSecs.push(dwells[i] ?? 0);
          byZone.set(zone, acc);
        });
      }
    }

    if (byZone.size === 0) {
      zones = { available: false };
    } else {
      zones = {
        available: true,
        items: [...byZone.entries()]
          .map(([zone, acc]) => {
            const dwell: ZoneDwell =
              acc.dwellSecs.length > 0
                ? {
                    available: true,
                    averageSec:
                      acc.dwellSecs.reduce((s, n) => s + n, 0) / acc.dwellSecs.length,
                  }
                : { available: false };
            return { zone, recordCount: acc.recordCount, dwell };
          })
          .sort((a, b) => a.zone.localeCompare(b.zone)),
      };
    }
  }

  return {
    exhibitionId: input.exhibitionId,
    exhibitionTitle: input.exhibitionTitle,
    themeColorName: input.themeColorName,
    leaflets: { count: items.length, items },
    visitors: { stored, report: visitorsReport },
    contactsSecured,
    interestByArtwork,
    artworkStats,
    inquiries: { total: inquiryTotal, byStatus, bySaleResult },
    styles,
    styleLabels: { ...STYLE_LABELS },
    typeNames,
    emotions,
    zones,
  };
}

/** 계약 키 점검용 (테스트) */
export function assertNoImmerserKey(report: ExhibitionReport): boolean {
  return !("immerser" in report.styles);
}
