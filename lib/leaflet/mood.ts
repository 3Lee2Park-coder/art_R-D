/** 무드 · Top1 감성 (LEAFLET_SPEC 3-1). map 감성 포함 [가안]. */

import {
  EMOTION_BY_ID,
  EMOTION_ORDER,
  MOODS,
  type EmotionId,
  type MoodId,
} from "@/lib/leaflet/emotions";
import type { VisitRecord } from "@/lib/leaflet/dwell";

export type ArtworkEmotionLabel = Partial<Record<EmotionId, number>>;

export type MoodResult = {
  moodId: MoodId;
  top1EmotionId: EmotionId;
  emotionCounts: Record<EmotionId, number>;
};

function emptyCounts(): Record<EmotionId, number> {
  return Object.fromEntries(EMOTION_ORDER.map((id) => [id, 0])) as Record<
    EmotionId,
    number
  >;
}

function moodCountsFromEmotions(
  emotionCounts: Record<EmotionId, number>,
): Record<MoodId, number> {
  const out = Object.fromEntries(MOODS.map((m) => [m.id, 0])) as Record<
    MoodId,
    number
  >;
  for (const id of EMOTION_ORDER) {
    const e = EMOTION_BY_ID[id];
    out[e.moodId] += emotionCounts[id] ?? 0;
  }
  return out;
}

/** 기록한 작품들의 15감성 라벨을 계열별로 합산 [가안] */
function moodLabelSums(
  artworkIds: string[],
  labels: Record<string, ArtworkEmotionLabel | undefined>,
): Record<MoodId, number> {
  const out = Object.fromEntries(MOODS.map((m) => [m.id, 0])) as Record<
    MoodId,
    number
  >;
  for (const aid of artworkIds) {
    const lab = labels[aid];
    if (!lab) continue;
    for (const id of EMOTION_ORDER) {
      const v = lab[id] ?? 0;
      out[EMOTION_BY_ID[id].moodId] += v;
    }
  }
  return out;
}

function emotionLabelSums(
  artworkIds: string[],
  labels: Record<string, ArtworkEmotionLabel | undefined>,
): Record<EmotionId, number> {
  const out = emptyCounts();
  for (const aid of artworkIds) {
    const lab = labels[aid];
    if (!lab) continue;
    for (const id of EMOTION_ORDER) {
      out[id] += lab[id] ?? 0;
    }
  }
  return out;
}

function pickMood(
  counts: Record<MoodId, number>,
  labelSums: Record<MoodId, number>,
): MoodId {
  let best = MOODS[0].id;
  let bestCount = -1;
  let bestLabel = -1;
  let bestOrder = Infinity;
  for (const m of MOODS) {
    const c = counts[m.id] ?? 0;
    const l = labelSums[m.id] ?? 0;
    if (
      c > bestCount ||
      (c === bestCount && l > bestLabel) ||
      (c === bestCount && l === bestLabel && m.order < bestOrder)
    ) {
      best = m.id;
      bestCount = c;
      bestLabel = l;
      bestOrder = m.order;
    }
  }
  return best;
}

function pickTop1Emotion(
  emotionCounts: Record<EmotionId, number>,
  labelSums: Record<EmotionId, number>,
): EmotionId {
  let best: EmotionId = EMOTION_ORDER[0];
  let bestCount = -1;
  let bestLabel = -1;
  let bestOrder = Infinity;
  EMOTION_ORDER.forEach((id, order) => {
    const c = emotionCounts[id] ?? 0;
    const l = labelSums[id] ?? 0;
    if (
      c > bestCount ||
      (c === bestCount && l > bestLabel) ||
      (c === bestCount && l === bestLabel && order < bestOrder)
    ) {
      best = id;
      bestCount = c;
      bestLabel = l;
      bestOrder = order;
    }
  });
  return best;
}

/**
 * camera + map 기록의 감성을 모두 센다 [가안].
 * emotionId가 null인 기록은 제외.
 */
export function computeMood(
  records: VisitRecord[],
  labels: Record<string, ArtworkEmotionLabel | undefined>,
): MoodResult {
  const emotionCounts = emptyCounts();
  const artworkIdsForLabels: string[] = [];
  for (const r of records) {
    if (!r.emotionId) continue;
    const id = r.emotionId as EmotionId;
    if (!(id in emotionCounts)) continue;
    emotionCounts[id] += 1;
    artworkIdsForLabels.push(r.artworkId);
  }

  const uniqueArtworks = [...new Set(artworkIdsForLabels)];
  const moodCounts = moodCountsFromEmotions(emotionCounts);
  const moodLabels = moodLabelSums(uniqueArtworks, labels);
  const emotionLabels = emotionLabelSums(uniqueArtworks, labels);

  return {
    moodId: pickMood(moodCounts, moodLabels),
    top1EmotionId: pickTop1Emotion(emotionCounts, emotionLabels),
    emotionCounts,
  };
}
