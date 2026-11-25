/** Check-in session aggregates for gallery reports (5j). */

import { isOnOrBeforeContractEnd } from "@/lib/leaflet/contractCutoff";
import type { CheckInSession } from "@/lib/mock/studioFixtures";

export type CheckInMetrics = {
  qrOpens: number | null;
  uniqueCheckIns: number | null;
  recordStarts: number | null;
  /** null → 추이 「추정 불가」 */
  daily: { label: string; count: number }[] | null;
  hourly: { label: string; count: number }[] | null;
};

function keepAt(
  at: string | null | undefined,
  contractEndAt: string | null | undefined,
): boolean {
  if (!at) return false;
  if (!contractEndAt) return true;
  return isOnOrBeforeContractEnd(at, contractEndAt);
}

function hourBucketLabel(iso: string): string | null {
  const m = iso.match(/T(\d{2}):/);
  if (!m) return null;
  const h = Number(m[1]);
  if (!Number.isFinite(h)) return null;
  const start = Math.floor(h / 2) * 2;
  return `${String(start).padStart(2, "0")}:00`;
}

function dateLabel(iso: string): string | null {
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})/);
  return m?.[1] ?? null;
}

/**
 * sessions가 비면 모든 지표 null (추정 불가).
 * contractEndAt이 있으면 지표별 시각으로 컷오프.
 */
export function buildCheckInMetrics(
  sessions: CheckInSession[],
  exhibitionId: string,
  contractEndAt?: string | null,
): CheckInMetrics {
  const mine = sessions.filter((s) => s.exhibitionId === exhibitionId);
  if (mine.length === 0) {
    return {
      qrOpens: null,
      uniqueCheckIns: null,
      recordStarts: null,
      daily: null,
      hourly: null,
    };
  }

  const end = contractEndAt ?? null;
  const qrOpens = mine.filter((s) => keepAt(s.openedAt, end)).length;
  const checked = mine.filter((s) => keepAt(s.checkedInAt, end));
  const uniqueCheckIns = new Set(checked.map((s) => s.sessionId)).size;
  const recordStarts = mine.filter((s) => keepAt(s.recordStartedAt, end)).length;

  const dailyMap = new Map<string, number>();
  const hourlyMap = new Map<string, number>();
  for (const s of checked) {
    const d = dateLabel(s.checkedInAt!);
    const h = hourBucketLabel(s.checkedInAt!);
    if (d) dailyMap.set(d, (dailyMap.get(d) ?? 0) + 1);
    if (h) hourlyMap.set(h, (hourlyMap.get(h) ?? 0) + 1);
  }

  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));
  const hourly = [...hourlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));

  return {
    qrOpens,
    uniqueCheckIns,
    recordStarts,
    daily,
    hourly,
  };
}
