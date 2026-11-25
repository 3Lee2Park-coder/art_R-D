/**
 * 작품 관심 분석 (5i). readExhibitionReportSource 스냅샷만 입력으로 받는다.
 */

import {
  dwellSeconds,
  mergeConsecutiveCamera,
  type VisitRecord,
} from "@/lib/leaflet/dwell";
import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import { customerIdsByLeaflet } from "@/lib/leaflet/customersFromSource";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import type { InterestWork } from "@/lib/leaflet/interest";

export type InterestArtworkRow = {
  artworkId: string;
  title: string;
  recordCount: number;
  interestCount: number;
  /** null → 화면 「데이터 부족」 (기록 0) */
  recordToInterestRate: number | null;
  inquiryCount: number;
  /** null → 「추정 불가」 */
  averageDwellSec: number | null;
  dwellSampleCount: number;
  /** null → 감성 없음 */
  topEmotionLabel: string | null;
};

export type ExposureRow = {
  artworkId: string;
  title: string;
  exposureCount: number;
  interestAfter: number;
  inquiryAfter: number;
  /** exposure 0이면 null */
  interestRate: number | null;
};

export type InterestsAnalytics = {
  exhibitionId: string;
  exhibitionTitle: string | null;
  totalRecords: number;
  totalInterests: number;
  totalInquiries: number;
  /** 전체 비율. 기록 0이면 null */
  overallRecordToInterestRate: number | null;
  artworkRows: InterestArtworkRow[];
  similarRows: ExposureRow[];
  recommendationRows: ExposureRow[];
};

function leafletIdsForShow(source: ExhibitionReportSource): Set<string> {
  const seen = new Set<string>();
  for (const l of source.leaflets) {
    if (l.exhibitionId === source.exhibitionId) seen.add(l.id);
  }
  return seen;
}

function recommendationIds(l: ExhibitionReportSource["leaflets"][number]): string[] {
  return [...new Set((l.recommendationArtworkIds ?? []).filter(Boolean))];
}

function similarId(l: ExhibitionReportSource["leaflets"][number]): string | null {
  return l.result?.similar?.artworkId || null;
}

function interestIdsForLeaflet(
  interests: InterestWork[],
  leafletId: string,
  exhibitionId: string,
): Set<string> {
  const set = new Set<string>();
  for (const w of interests) {
    if (w.leafletId !== leafletId) continue;
    if (w.exhibitionId !== exhibitionId) continue;
    set.add(w.artworkId);
  }
  return set;
}

/** 같은 리플릿에서 해당 작품 관심 등록 여부 */
export function interestAfterExposure(
  interests: InterestWork[],
  leafletId: string,
  exhibitionId: string,
  artworkId: string,
): boolean {
  return interestIdsForLeaflet(interests, leafletId, exhibitionId).has(artworkId);
}

export function inquiryAfterExposure(
  inquiries: ExhibitionReportSource["inquiries"],
  leafletId: string,
  artworkId: string,
): boolean {
  return inquiries.some(
    (q) =>
      q.leafletId === leafletId &&
      (q.inquiredArtworkIds ?? []).includes(artworkId),
  );
}

function topEmotionLabel(counts: Map<string, number>): string | null {
  let best: string | null = null;
  let n = 0;
  for (const [id, c] of counts) {
    if (c > n || (c === n && best && id < best) || (c === n && !best)) {
      best = id;
      n = c;
    }
  }
  if (!best || n <= 0) return null;
  return EMOTION_BY_ID[best as EmotionId]?.nameKo ?? best;
}

function dwellForArtwork(
  leaflets: ExhibitionReportSource["leaflets"],
  exhibitionId: string,
  artworkId: string,
): { averageSec: number | null; sampleCount: number } {
  const samples: number[] = [];
  for (const l of leaflets) {
    if (l.exhibitionId !== exhibitionId) continue;
    const records = (l.records ?? []) as VisitRecord[];
    if (records.length === 0) continue;
    const merged = mergeConsecutiveCamera(records);
    if (merged.length === 0) continue;
    const generateAtSec =
      typeof l.generateAtSec === "number"
        ? l.generateAtSec
        : merged[merged.length - 1]!.atSec;
    const dwells = dwellSeconds(merged, generateAtSec);
    merged.forEach((m, i) => {
      if (m.artworkId !== artworkId) return;
      // generateAtSec이 없고 마지막 기록이면 근거 없음 → 샘플 제외
      if (
        typeof l.generateAtSec !== "number" &&
        i === merged.length - 1
      ) {
        return;
      }
      samples.push(dwells[i] ?? 0);
    });
  }
  if (samples.length === 0) return { averageSec: null, sampleCount: 0 };
  const averageSec = samples.reduce((s, n) => s + n, 0) / samples.length;
  return { averageSec, sampleCount: samples.length };
}

function bumpExposure(
  map: Map<string, { exposure: number; interest: number; inquiry: number }>,
  artworkId: string,
  interest: boolean,
  inquiry: boolean,
) {
  const cur = map.get(artworkId) ?? { exposure: 0, interest: 0, inquiry: 0 };
  cur.exposure += 1;
  if (interest) cur.interest += 1;
  if (inquiry) cur.inquiry += 1;
  map.set(artworkId, cur);
}

function toExposureRows(
  map: Map<string, { exposure: number; interest: number; inquiry: number }>,
  titles: Record<string, string | undefined>,
): ExposureRow[] {
  return [...map.entries()]
    .map(([artworkId, v]) => ({
      artworkId,
      title: titles[artworkId] ?? artworkId,
      exposureCount: v.exposure,
      interestAfter: v.interest,
      inquiryAfter: v.inquiry,
      interestRate:
        v.exposure > 0 ? Math.round((v.interest / v.exposure) * 100) : null,
    }))
    .sort(
      (a, b) =>
        b.exposureCount - a.exposureCount ||
        a.artworkId.localeCompare(b.artworkId),
    );
}

export function buildInterestsAnalytics(
  source: ExhibitionReportSource,
): InterestsAnalytics {
  const leafletIds = leafletIdsForShow(source);
  const leaflets = source.leaflets.filter((l) => leafletIds.has(l.id));

  const recordMap = new Map<string, number>();
  const emotionByArt = new Map<string, Map<string, number>>();
  for (const l of leaflets) {
    for (const r of l.records ?? []) {
      recordMap.set(r.artworkId, (recordMap.get(r.artworkId) ?? 0) + 1);
      if (r.emotionId) {
        const em = emotionByArt.get(r.artworkId) ?? new Map();
        em.set(r.emotionId, (em.get(r.emotionId) ?? 0) + 1);
        emotionByArt.set(r.artworkId, em);
      }
    }
  }

  const interestMap = new Map<string, number>();
  for (const w of source.interests) {
    if (!leafletIds.has(w.leafletId)) continue;
    if (w.exhibitionId !== source.exhibitionId) continue;
    interestMap.set(w.artworkId, (interestMap.get(w.artworkId) ?? 0) + 1);
  }

  const inquiryMap = new Map<string, number>();
  let totalInquiries = 0;
  for (const q of source.inquiries) {
    const forShow =
      q.exhibitionId === source.exhibitionId || leafletIds.has(q.leafletId);
    if (!forShow) continue;
    totalInquiries += 1;
    for (const id of q.inquiredArtworkIds ?? []) {
      inquiryMap.set(id, (inquiryMap.get(id) ?? 0) + 1);
    }
  }

  const artIds = new Set<string>([
    ...recordMap.keys(),
    ...interestMap.keys(),
    ...inquiryMap.keys(),
  ]);
  // 전시 작품(타이틀 맵)도 행에 포함하지 않음 — 기록이 있는 것만? HTML은 artworkAnalytics keys.
  // 리포트 artworkStats와 맞추려면 기록·관심·문의·노출이 있는 ID.
  // 관심 화면 작품 표는 전시 작품 기록이 중심. 시드 타이틀에 있는 전시 작품 중 집계된 것.
  for (const id of Object.keys(source.artworkTitles ?? {})) {
    if (
      (recordMap.get(id) ?? 0) > 0 ||
      (interestMap.get(id) ?? 0) > 0 ||
      (inquiryMap.get(id) ?? 0) > 0
    ) {
      artIds.add(id);
    }
  }

  const artworkRows: InterestArtworkRow[] = [...artIds]
    .map((artworkId) => {
      const recordCount = recordMap.get(artworkId) ?? 0;
      const interestCount = interestMap.get(artworkId) ?? 0;
      const inquiryCount = inquiryMap.get(artworkId) ?? 0;
      const dwell = dwellForArtwork(leaflets, source.exhibitionId, artworkId);
      return {
        artworkId,
        title: source.artworkTitles?.[artworkId] ?? artworkId,
        recordCount,
        interestCount,
        recordToInterestRate:
          recordCount > 0
            ? Math.round((interestCount / recordCount) * 100)
            : null,
        inquiryCount,
        averageDwellSec: dwell.averageSec,
        dwellSampleCount: dwell.sampleCount,
        topEmotionLabel: topEmotionLabel(emotionByArt.get(artworkId) ?? new Map()),
      };
    })
    .sort(
      (a, b) =>
        b.recordCount + b.interestCount - (a.recordCount + a.interestCount) ||
        a.artworkId.localeCompare(b.artworkId),
    );

  const similarMap = new Map<
    string,
    { exposure: number; interest: number; inquiry: number }
  >();
  const recommendMap = new Map<
    string,
    { exposure: number; interest: number; inquiry: number }
  >();

  for (const l of leaflets) {
    const sim = similarId(l);
    if (sim) {
      bumpExposure(
        similarMap,
        sim,
        interestAfterExposure(source.interests, l.id, source.exhibitionId, sim),
        inquiryAfterExposure(source.inquiries, l.id, sim),
      );
    }
    for (const id of recommendationIds(l)) {
      bumpExposure(
        recommendMap,
        id,
        interestAfterExposure(source.interests, l.id, source.exhibitionId, id),
        inquiryAfterExposure(source.inquiries, l.id, id),
      );
    }
  }

  const totalRecords = [...recordMap.values()].reduce((s, n) => s + n, 0);
  const totalInterests = [...interestMap.values()].reduce((s, n) => s + n, 0);

  return {
    exhibitionId: source.exhibitionId,
    exhibitionTitle: source.exhibitionTitle,
    totalRecords,
    totalInterests,
    totalInquiries,
    overallRecordToInterestRate:
      totalRecords > 0
        ? Math.round((totalInterests / totalRecords) * 100)
        : null,
    artworkRows,
    similarRows: toExposureRows(similarMap, source.artworkTitles ?? {}),
    recommendationRows: toExposureRows(recommendMap, source.artworkTitles ?? {}),
  };
}

/** CSV: 비율·체류 근거 없으면 빈 칸 */
export function interestsArtworkCsvRows(
  analytics: InterestsAnalytics,
): (string | number)[][] {
  const ex = analytics.exhibitionTitle ?? analytics.exhibitionId;
  return [
    [
      "exhibition",
      "artwork_id",
      "artwork",
      "card2_photo_record_count",
      "interest_add_count",
      "record_to_interest_rate",
      "inquiry_count",
      "average_dwell_estimate_seconds",
      "dwell_sample_count",
    ],
    ...analytics.artworkRows.map((r) => [
      ex,
      r.artworkId,
      r.title,
      r.recordCount,
      r.interestCount,
      r.recordToInterestRate == null ? "" : r.recordToInterestRate,
      r.inquiryCount,
      r.averageDwellSec == null ? "" : Math.round(r.averageDwellSec),
      r.dwellSampleCount,
    ]),
  ];
}

export type RecommendationHistoryRow = {
  exhibition: string;
  leafletId: string;
  customerId: string;
  recommendedArtworkId: string;
  recommendedArtwork: string;
  recommendationReason: string;
  algorithmVersion: string;
  interestAfterRecommendation: number;
  inquiryAfterRecommendation: number;
  recommendedAt: string;
  kind: "recommendation" | "similar";
};

export function buildRecommendationHistoryRows(
  source: ExhibitionReportSource,
): RecommendationHistoryRow[] {
  const ex = source.exhibitionTitle ?? source.exhibitionId;
  const leaflets = source.leaflets.filter(
    (l) => l.exhibitionId === source.exhibitionId,
  );
  const rows: RecommendationHistoryRow[] = [];
  const customerByLeaflet = customerIdsByLeaflet(source);

  for (const l of leaflets) {
    const customerId = customerByLeaflet.get(l.id) ?? "";
    const at = l.recordedAt ?? "";

    const sim = similarId(l);
    if (sim) {
      rows.push({
        exhibition: ex,
        leafletId: l.id,
        customerId,
        recommendedArtworkId: sim,
        recommendedArtwork: source.artworkTitles?.[sim] ?? sim,
        recommendationReason: "",
        algorithmVersion: "",
        interestAfterRecommendation: interestAfterExposure(
          source.interests,
          l.id,
          source.exhibitionId,
          sim,
        )
          ? 1
          : 0,
        inquiryAfterRecommendation: inquiryAfterExposure(
          source.inquiries,
          l.id,
          sim,
        )
          ? 1
          : 0,
        recommendedAt: at,
        kind: "similar",
      });
    }
    for (const id of recommendationIds(l)) {
      rows.push({
        exhibition: ex,
        leafletId: l.id,
        customerId,
        recommendedArtworkId: id,
        recommendedArtwork: source.artworkTitles?.[id] ?? id,
        recommendationReason: "",
        algorithmVersion: "",
        interestAfterRecommendation: interestAfterExposure(
          source.interests,
          l.id,
          source.exhibitionId,
          id,
        )
          ? 1
          : 0,
        inquiryAfterRecommendation: inquiryAfterExposure(
          source.inquiries,
          l.id,
          id,
        )
          ? 1
          : 0,
        recommendedAt: at,
        kind: "recommendation",
      });
    }
  }
  return rows;
}

export function recommendationHistoryCsvRows(
  rows: RecommendationHistoryRow[],
): (string | number)[][] {
  return [
    [
      "exhibition",
      "leaflet_id",
      "customer_id",
      "recommended_artwork_id",
      "recommended_artwork",
      "recommendation_reason",
      "algorithm_version",
      "interest_after_recommendation",
      "inquiry_after_recommendation",
      "recommended_at",
      "kind",
    ],
    ...rows.map((r) => [
      r.exhibition,
      r.leafletId,
      r.customerId,
      r.recommendedArtworkId,
      r.recommendedArtwork,
      r.recommendationReason,
      r.algorithmVersion,
      r.interestAfterRecommendation,
      r.inquiryAfterRecommendation,
      r.recommendedAt,
      r.kind,
    ]),
  ];
}
