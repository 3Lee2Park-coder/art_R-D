/** 카드 4 문구 · 단어 블록 (LEAFLET_SPEC 5-1) */

import { emotionNameKo, type EmotionId } from "@/lib/leaflet/emotions";

export type ComparisonResult = {
  line: string;
  /** 이전 관람객 수 (나 제외) */
  previousCount: number;
  /** 나 포함 순번 (previous + 1), 첫 번째면 1 */
  ordinal: number;
  isFirst: boolean;
};

/**
 * 이전 0명: "이 전시의 첫 번째 '{감성}' 관람자예요" [결정]
 * 그 외: "'{감성}'을 고른 {n}번째 관람자예요" (n = 이전 + 1) [가안]
 */
export function comparisonLine(
  top1EmotionId: EmotionId,
  otherVisitorsTop1: Partial<Record<EmotionId, number>>,
): ComparisonResult {
  const previousCount = otherVisitorsTop1[top1EmotionId] ?? 0;
  const name = emotionNameKo(top1EmotionId);
  if (previousCount === 0) {
    return {
      line: `이 전시의 첫 번째 '${name}' 관람자예요`,
      previousCount: 0,
      ordinal: 1,
      isFirst: true,
    };
  }
  const ordinal = previousCount + 1;
  return {
    line: `'${name}'을 고른 ${ordinal}번째 관람자예요`,
    previousCount,
    ordinal,
    isFirst: false,
  };
}

export type WordBlock = {
  emotionId: EmotionId;
  count: number;
  /** 내 Top1 여부 */
  isMine: boolean;
};

/**
 * [가안] 감성별 개수 비례, 최대 30블록, 많은 순, 내 Top1 표시.
 * 나 포함 분포 = otherVisitors + 내 Top1 1회.
 */
export function wordBlocks(
  top1EmotionId: EmotionId,
  otherVisitorsTop1: Partial<Record<EmotionId, number>>,
  maxBlocks = 30,
): WordBlock[] {
  const totals = new Map<EmotionId, number>();
  for (const [id, n] of Object.entries(otherVisitorsTop1) as [
    EmotionId,
    number,
  ][]) {
    if (n > 0) totals.set(id, n);
  }
  totals.set(top1EmotionId, (totals.get(top1EmotionId) ?? 0) + 1);

  const sorted = [...totals.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  const sum = sorted.reduce((s, [, c]) => s + c, 0);
  if (sum === 0) return [];

  // 비례 할당 후 합이 maxBlocks가 되도록 반올림 보정
  const raw = sorted.map(([id, c]) => ({
    emotionId: id,
    exact: (c / sum) * maxBlocks,
    count: 0,
  }));
  let assigned = 0;
  for (const row of raw) {
    row.count = Math.floor(row.exact);
    assigned += row.count;
  }
  let remain = maxBlocks - assigned;
  const byFrac = [...raw].sort(
    (a, b) => b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)),
  );
  for (const row of byFrac) {
    if (remain <= 0) break;
    if (row.exact > 0) {
      row.count += 1;
      remain -= 1;
    }
  }

  return raw
    .filter((r) => r.count > 0)
    .map((r) => ({
      emotionId: r.emotionId,
      count: r.count,
      isMine: r.emotionId === top1EmotionId,
    }));
}

/** 관람객 수(나 포함) */
export function visitorCount(
  otherVisitorsTop1: Partial<Record<EmotionId, number>>,
): number {
  return (
    Object.values(otherVisitorsTop1).reduce((s, n) => s + (n ?? 0), 0) + 1
  );
}
