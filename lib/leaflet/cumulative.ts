/** 전시 수 기준 누적 Top 2 (LEAFLET_SPEC 6장) */

import type { EmotionId } from "@/lib/leaflet/emotions";

export type HistoryEntry = {
  leafletId: string;
  exhibitionId: string;
  visitDate: string;
  top1EmotionId: EmotionId;
  top1Color: string;
};

export type CumulativeItem = { key: string; count: number };

export type CumulativeResult = {
  exhibitionCount: number;
  topEmotions: CumulativeItem[];
  topColors: CumulativeItem[];
};

/**
 * 재방문은 최신 1회만 [가안].
 * 동점이면 최근 전시의 값을 앞에 [가안].
 */
export function computeCumulative(
  history: HistoryEntry[],
  current: {
    exhibitionId: string;
    visitDate: string;
    top1EmotionId: EmotionId;
    top1Color: string | null;
  },
): CumulativeResult {
  const byExhibition = new Map<string, HistoryEntry>();
  const ordered = [
    ...history,
    {
      leafletId: "current",
      exhibitionId: current.exhibitionId,
      visitDate: current.visitDate,
      top1EmotionId: current.top1EmotionId,
      top1Color: current.top1Color ?? "",
    },
  ].sort((a, b) => a.visitDate.localeCompare(b.visitDate));

  for (const h of ordered) {
    byExhibition.set(h.exhibitionId, h);
  }

  const latest = [...byExhibition.values()].sort((a, b) =>
    b.visitDate.localeCompare(a.visitDate),
  );

  const emotionCounts = new Map<string, { count: number; lastDate: string }>();
  const colorCounts = new Map<string, { count: number; lastDate: string }>();

  for (const h of latest) {
    const e = emotionCounts.get(h.top1EmotionId) ?? {
      count: 0,
      lastDate: h.visitDate,
    };
    e.count += 1;
    if (h.visitDate > e.lastDate) e.lastDate = h.visitDate;
    emotionCounts.set(h.top1EmotionId, e);

    if (h.top1Color) {
      const c = colorCounts.get(h.top1Color) ?? {
        count: 0,
        lastDate: h.visitDate,
      };
      c.count += 1;
      if (h.visitDate > c.lastDate) c.lastDate = h.visitDate;
      colorCounts.set(h.top1Color, c);
    }
  }

  const rank = (m: Map<string, { count: number; lastDate: string }>) =>
    [...m.entries()]
      .sort((a, b) => {
        if (b[1].count !== a[1].count) return b[1].count - a[1].count;
        return b[1].lastDate.localeCompare(a[1].lastDate);
      })
      .slice(0, 2)
      .map(([key, v]) => ({ key, count: v.count }));

  return {
    exhibitionCount: latest.length,
    topEmotions: rank(emotionCounts),
    topColors: rank(colorCounts),
  };
}
