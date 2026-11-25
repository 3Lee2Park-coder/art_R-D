/** 전시 리포트 화면용 뷰 모델 (순수). 5a ExhibitionReport → 표시 전용. */

import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import {
  REPORT_STYLE_IDS,
  STYLE_LABELS,
  type ExhibitionReport,
  type ReportStyleId,
} from "@/lib/leaflet/exhibitionReport";
import type { InquiryStatus } from "@/lib/leaflet/inquiryStatus";

export const EMPTY_DATA = "데이터 없음";
export const EMPTY_VISIT_TREND = "아직 수집된 방문 데이터가 없습니다.";
export const EMPTY_RECOMMENDATIONS = "추천 결과가 없습니다.";
export const EMPTY_ARTWORK_ROWS = "해당 전시에 집계할 작품 기록이 없습니다.";
export const EMPTY_ZONES = "데이터 없음";
export const LABEL_UNSPECIFIED = "유형 미확인";

export type ReportKpi = {
  label: string;
  /** null = 값 없음(빈 상태). 0은 실제 0건 */
  value: number | null;
  unit: string;
};

export type ReportBarRow = {
  label: string;
  value: number;
  /** 0–100, 분모가 0이면 0 */
  pct: number;
};

export type ReportFunnelStep = {
  label: string;
  value: number | null;
};

export type ReportInterestRow = {
  artworkId: string;
  label: string;
  count: number;
};

export type ReportZoneRow = {
  zone: string;
  recordCount: number;
  dwellLabel: string | null;
};

export type ExhibitionReportViewModel = {
  exhibitionId: string;
  exhibitionTitle: string | null;
  themeColorName: string;
  leafletCount: number;
  kpis: ReportKpi[];
  visitTrendEmpty: string;
  hourlyTrendEmpty: string;
  funnel: ReportFunnelStep[];
  styles: ReportBarRow[];
  typeNames: ReportBarRow[];
  interests: ReportInterestRow[];
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
  /** 화면 문구에 immerser / 회원 단독 칸이 없어야 함 — 테스트용 */
  hasMemberOnlyBucket: false;
  styleKeys: ReportStyleId[];
};

export type ExhibitionReportViewExtras = {
  /** 작품 기록(VisitRecord) 총 건수. 없으면 KPI는 빈 상태 */
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

/**
 * 5a 집계 → 화면 모델. localStorage 없음.
 * QR/체크인/추천 등 5a에 없는 지표는 value null(빈 상태).
 */
export function toExhibitionReportView(
  report: ExhibitionReport,
  extras: ExhibitionReportViewExtras = {},
): ExhibitionReportViewModel {
  const leafletCount = report.leaflets.count;
  const interestTotal = report.interestByArtwork.reduce((s, r) => s + r.count, 0);
  const totalRecords =
    extras.totalRecords === undefined ? null : extras.totalRecords;

  const kpis: ReportKpi[] = [
    { label: "QR 접속", value: null, unit: "회" },
    { label: "고유 QR 체크인", value: null, unit: "건" },
    { label: "리플릿 생성", value: leafletCount, unit: "건" },
    {
      label: "작품 기록",
      value: totalRecords,
      unit: "회",
    },
    { label: "관심 등록", value: interestTotal, unit: "건" },
    { label: "작품 문의", value: report.inquiries.total, unit: "건" },
    {
      label: "연락처 확보 고객",
      value: report.visitors.report.identified,
      unit: "명",
    },
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

  const interests: ReportInterestRow[] = report.interestByArtwork.map((r) => ({
    artworkId: r.artworkId,
    label: r.title ?? r.artworkId,
    count: r.count,
  }));

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
    kpis,
    visitTrendEmpty: EMPTY_VISIT_TREND,
    hourlyTrendEmpty: EMPTY_VISIT_TREND,
    funnel,
    styles,
    typeNames,
    interests,
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
