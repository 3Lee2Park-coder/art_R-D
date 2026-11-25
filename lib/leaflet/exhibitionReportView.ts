/** 전시 리포트 화면용 뷰 모델 (순수). ExhibitionReport → 표시 전용. */

import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import {
  REPORT_STYLE_IDS,
  STYLE_LABELS,
  type ExhibitionReport,
  type ExhibitionReportArtworkStat,
  type ReportStyleId,
} from "@/lib/leaflet/exhibitionReport";
import type { InquiryStatus } from "@/lib/leaflet/inquiryStatus";

/** QR·추이 등 표본 없음 */
export const EMPTY_INSUFFICIENT = "데이터 부족";
/** 체류 등 근거 없는 추정 */
export const EMPTY_INESTIMABLE = "추정 불가";
export const EMPTY_RECOMMENDATIONS = "추천 결과가 없습니다.";
export const EMPTY_ARTWORK_ROWS = "해당 전시에 집계할 작품 기록이 없습니다.";
export const LABEL_UNSPECIFIED = "유형 미확인";

export type ReportKpi = {
  label: string;
  /** null = 빈 상태(데이터 부족). 0은 실제 0건 */
  value: number | null;
  unit: string;
};

export type ReportBarRow = {
  label: string;
  value: number;
  pct: number;
};

export type ReportFunnelStep = {
  label: string;
  value: number | null;
};

export type ReportArtworkRow = {
  artworkId: string;
  label: string;
  recordCount: number;
  interestCount: number;
  inquiryCount: number;
  recommendationCount: number;
};

export type ReportZoneRow = {
  zone: string;
  recordCount: number;
  /** null → 화면 「추정 불가」 */
  dwellLabel: string | null;
};

export type ExhibitionReportViewModel = {
  exhibitionId: string;
  exhibitionTitle: string | null;
  themeColorName: string;
  leafletCount: number;
  contactsSecuredCount: number;
  kpis: ReportKpi[];
  visitTrendEmpty: string;
  hourlyTrendEmpty: string;
  funnel: ReportFunnelStep[];
  styles: ReportBarRow[];
  typeNames: ReportBarRow[];
  artworkRows: ReportArtworkRow[];
  /** 추천 건수가 전부 0이면 true → 열에 빈 문구 */
  recommendationsAllEmpty: boolean;
  inquiryTotal: number;
  inquiryByStatus: { label: InquiryStatus; count: number }[];
  saleSummary: { label: string; count: number }[];
  visitors: {
    identified: number;
    anonymous: number;
    unspecified: number;
  };
  emotions: { emotionId: string; label: string; count: number }[];
  zonesAvailable: boolean;
  zones: ReportZoneRow[];
  recommendationsEmpty: string;
  hasMemberOnlyBucket: false;
  styleKeys: ReportStyleId[];
};

export type ExhibitionReportViewExtras = {
  totalRecords?: number | null;
};

function pctOf(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((value / total) * 1000) / 10);
}

function formatDwellSec(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}초`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s > 0 ? `${m}분 ${s}초` : `${m}분`;
}

function toArtworkRow(r: ExhibitionReportArtworkStat): ReportArtworkRow {
  return {
    artworkId: r.artworkId,
    label: r.title ?? r.artworkId,
    recordCount: r.recordCount,
    interestCount: r.interestCount,
    inquiryCount: r.inquiryCount,
    recommendationCount: r.recommendationCount,
  };
}

/**
 * 집계 → 화면 모델. localStorage 없음.
 * QR/체크인 등 없는 지표는 value null → 「데이터 부족」.
 */
export function toExhibitionReportView(
  report: ExhibitionReport,
  extras: ExhibitionReportViewExtras = {},
): ExhibitionReportViewModel {
  const leafletCount = report.leaflets.count;
  const interestTotal = report.interestByArtwork.reduce((s, r) => s + r.count, 0);
  const totalRecords =
    extras.totalRecords === undefined ? null : extras.totalRecords;
  const contactsSecuredCount = report.contactsSecured.count;

  const kpis: ReportKpi[] = [
    { label: "QR 접속", value: null, unit: "회" },
    { label: "고유 QR 체크인", value: null, unit: "건" },
    { label: "리플릿 생성", value: leafletCount, unit: "건" },
    { label: "작품 기록", value: totalRecords, unit: "회" },
    { label: "관심 등록", value: interestTotal, unit: "건" },
    { label: "작품 문의", value: report.inquiries.total, unit: "건" },
    { label: "연락처 확보 고객", value: contactsSecuredCount, unit: "명" },
    { label: "추천 후 관심 등록", value: null, unit: "회" },
  ];

  const styleTotal =
    REPORT_STYLE_IDS.reduce((s, id) => s + report.styles[id], 0) || 0;
  const styles: ReportBarRow[] = REPORT_STYLE_IDS.map((id) => ({
    label: STYLE_LABELS[id],
    value: report.styles[id],
    pct: pctOf(report.styles[id], styleTotal),
  }));

  const typeTotal = report.typeNames.reduce((s, t) => s + t.count, 0) || 0;
  const typeNames: ReportBarRow[] = report.typeNames.map((t) => ({
    label: t.typeName,
    value: t.count,
    pct: pctOf(t.count, typeTotal),
  }));

  const funnel: ReportFunnelStep[] = [
    { label: "QR 접속", value: null },
    { label: "고유 체크인", value: null },
    { label: "기록 시작", value: null },
    { label: "리플릿 생성", value: leafletCount },
    { label: "작품 관심 등록", value: interestTotal },
    { label: "작품 문의", value: report.inquiries.total },
  ];

  const artworkRows = report.artworkStats.map(toArtworkRow);
  const recommendationsAllEmpty =
    artworkRows.length === 0 ||
    artworkRows.every((r) => r.recommendationCount === 0);

  const inquiryByStatus = (
    ["신규", "연락 완료", "후속 예정", "종료"] as const
  ).map((label) => ({
    label,
    count: report.inquiries.byStatus[label],
  }));

  const sale = report.inquiries.bySaleResult;
  const saleSummary = [
    { label: "미입력", count: sale.미입력 },
    { label: "판매됨", count: sale.판매됨 },
    { label: "렌탈됨", count: sale.렌탈됨 },
    { label: "해당 없음", count: sale["해당 없음"] },
  ];

  const emotions = report.emotions.map((e) => ({
    emotionId: e.emotionId,
    label: EMOTION_BY_ID[e.emotionId as EmotionId]?.nameKo ?? e.emotionId,
    count: e.count,
  }));

  let zones: ReportZoneRow[] = [];
  let zonesAvailable = false;
  if (report.zones.available) {
    zonesAvailable = true;
    zones = report.zones.items.map((z) => ({
      zone: z.zone,
      recordCount: z.recordCount,
      dwellLabel:
        z.dwell.available === true ? formatDwellSec(z.dwell.averageSec) : null,
    }));
  }

  return {
    exhibitionId: report.exhibitionId,
    exhibitionTitle: report.exhibitionTitle,
    themeColorName: report.themeColorName,
    leafletCount,
    contactsSecuredCount,
    kpis,
    visitTrendEmpty: EMPTY_INSUFFICIENT,
    hourlyTrendEmpty: EMPTY_INSUFFICIENT,
    funnel,
    styles,
    typeNames,
    artworkRows,
    recommendationsAllEmpty,
    inquiryTotal: report.inquiries.total,
    inquiryByStatus,
    saleSummary,
    visitors: {
      identified: report.visitors.report.identified,
      anonymous: report.visitors.report.anonymous,
      unspecified: report.visitors.report.unspecified,
    },
    emotions,
    zonesAvailable,
    zones,
    recommendationsEmpty: EMPTY_RECOMMENDATIONS,
    hasMemberOnlyBucket: false,
    styleKeys: [...REPORT_STYLE_IDS],
  };
}

export function totalRecordsFromLeaflets(
  leaflets: { exhibitionId: string | null; records?: readonly unknown[] }[],
  exhibitionId: string,
): number {
  return leaflets
    .filter((l) => l.exhibitionId === exhibitionId)
    .reduce((s, l) => s + (l.records?.length ?? 0), 0);
}
