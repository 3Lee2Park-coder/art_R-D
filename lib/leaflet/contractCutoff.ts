/**
 * 종료 계약 아카이브 컷오프 (Asia/Seoul).
 * - 종료값이 YYYY-MM-DD만이면 그날 끝 23:59:59.999+09:00
 * - 기록값이 YYYY-MM-DD만이면 그날 00:00:00+09:00
 * - 시각이 있으면 그대로 파싱해 ms 비교 (recordedAt ≤ contractEndAt)
 */

import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function toCutoffMillis(value: string, kind: "end" | "record"): number {
  if (DATE_ONLY.test(value)) {
    if (kind === "end") {
      return Date.parse(`${value}T23:59:59.999+09:00`);
    }
    return Date.parse(`${value}T00:00:00.000+09:00`);
  }
  return Date.parse(value);
}

export function isOnOrBeforeContractEnd(
  recordedAt: string,
  contractEndAt: string,
): boolean {
  const recordMs = toCutoffMillis(recordedAt, "record");
  const endMs = toCutoffMillis(contractEndAt, "end");
  if (Number.isNaN(recordMs) || Number.isNaN(endMs)) return false;
  return recordMs <= endMs;
}

function keepRecorded(recordedAt: string | null | undefined, contractEndAt: string): boolean {
  if (!recordedAt) return false;
  return isOnOrBeforeContractEnd(recordedAt, contractEndAt);
}

/** 동일 소스 스냅샷에서 기록 시각이 종료 이후인 항목을 제외한다. */
export function filterSourceByContractEnd(
  source: ExhibitionReportSource,
  contractEndAt: string,
): ExhibitionReportSource {
  return {
    ...source,
    leaflets: source.leaflets.filter((l) => keepRecorded(l.recordedAt, contractEndAt)),
    interests: source.interests.filter((i) => keepRecorded(i.addedAt, contractEndAt)),
    inquiries: source.inquiries.filter((q) => keepRecorded(q.createdAt, contractEndAt)),
    events: source.events.filter((e) => keepRecorded(e.at, contractEndAt)),
  };
}
