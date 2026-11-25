/**
 * 종료 계약 아카이브 컷오프.
 * 규칙: recordedAt <= contractEndAt (ISO 문자열 비교, 등호 포함).
 * 날짜만 있는 값(YYYY-MM-DD)도 동일 규칙으로 비교한다.
 */

import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";

export function isOnOrBeforeContractEnd(
  recordedAt: string,
  contractEndAt: string,
): boolean {
  return recordedAt <= contractEndAt;
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
