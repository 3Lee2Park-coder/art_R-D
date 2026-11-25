/** 전시 리포트 집계 (순수). STEP5a — UI/스텁 reports.json 미사용. */

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
  interestByArtwork: { artworkId: string; count: number; title?: string }[];
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
  result?: { style?: StyleId; typeName?: string } | null;
  /** 체류 평균용. 없으면 해당 구역 dwell.available=false */
  generateAtSec?: number;
};

export type ExhibitionReportSourceInquiry = {
  id: string;
  leafletId: string;
  exhibitionId: string;
  status?: unknown;
  saleResult?: unknown;
  identityKind?: VisitorIdentityKind;
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
  }

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
    interestByArtwork,
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
