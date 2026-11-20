// [기술 확인] R&D 추천 기술의 모의 구현
/** RestArt DB 추천 → 전시 내 최근접 작품 (LEAFLET_SPEC 4) */

import { EMOTION_ORDER, type EmotionId } from "@/lib/leaflet/emotions";
import { COLOR_NAMES } from "@/lib/leaflet/colors";

export type VectorLabel = {
  emotions: Partial<Record<EmotionId, number>>;
  colors: Record<string, number>;
};

export interface Recommender {
  recommend(input: {
    visitVector: number[];
    mockDb: Record<string, VectorLabel>;
    scenarioDbIds?: string[];
  }): string[];
}

export function to80Vector(label: VectorLabel): number[] {
  const e = EMOTION_ORDER.map((id) => label.emotions[id] ?? 0);
  const c = COLOR_NAMES.map((name) => label.colors[name] ?? 0);
  return [...e, ...c];
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * 시나리오마다 정해 둔 RestArt DB 작품 ID.
 * 없으면 관람 벡터와 코사인 1위 mockDb [가안, 모의].
 */
export const mockRecommender: Recommender = {
  recommend({ visitVector, mockDb, scenarioDbIds }) {
    if (scenarioDbIds && scenarioDbIds.length > 0) {
      return scenarioDbIds.slice(0, 2);
    }
    let bestId = "";
    let best = -1;
    for (const [id, lab] of Object.entries(mockDb)) {
      const s = cosine(visitVector, to80Vector(lab));
      if (s > best || (s === best && id < bestId)) {
        best = s;
        bestId = id;
      }
    }
    return bestId ? [bestId] : [];
  },
};

/** 80차원 코사인 최근접. 동점이면 작품 ID 오름차순 */
export function nearestInExhibition(
  dbWork: VectorLabel,
  exhibitionWorks: Record<string, VectorLabel>,
): { artworkId: string; score: number } | null {
  const dbVec = to80Vector(dbWork);
  let bestId: string | null = null;
  let best = -1;
  for (const [id, lab] of Object.entries(exhibitionWorks)) {
    const s = cosine(dbVec, to80Vector(lab));
    if (bestId === null || s > best || (s === best && id < bestId)) {
      best = s;
      bestId = id;
    }
  }
  if (!bestId) return null;
  return { artworkId: bestId, score: best };
}

/** 관람 벡터: 고유 camera 작품 라벨 평균 (감성·색). map 제외 [가안] */
export function visitVectorFromRecords(
  uniqueCameraIds: string[],
  labels: Record<string, VectorLabel | undefined>,
): number[] {
  if (uniqueCameraIds.length === 0) {
    return new Array(80).fill(0);
  }
  const acc = new Array(80).fill(0);
  let n = 0;
  for (const id of uniqueCameraIds) {
    const lab = labels[id];
    if (!lab) continue;
    const v = to80Vector(lab);
    for (let i = 0; i < 80; i++) acc[i] += v[i];
    n += 1;
  }
  if (n === 0) return acc;
  return acc.map((x) => x / n);
}
