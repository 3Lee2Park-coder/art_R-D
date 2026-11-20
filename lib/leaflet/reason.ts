/** 닮은 이유 문구 (LEAFLET_SPEC 4-1 분기 전부) */

import { emotionNameKo, type EmotionId } from "@/lib/leaflet/emotions";
import type { StyleId } from "@/lib/leaflet/style";

export type ReasonInput = {
  style: StyleId;
  top1EmotionId: EmotionId;
  top1Color: string | null;
  similarArtworkId: string;
  /** 기록한 작품인지 (camera 또는 map) */
  recorded: boolean;
  emotionOverlap: boolean;
  colorOverlap: boolean;
  /** 작품 내 Top1 색 비율 0~100 반올림 */
  colorPercentInArtwork: number;
  /** 유효 관람 시간 1위 작품인지 (기록한 작품·겹침 없음용) */
  longestDwell: boolean;
};

const RECORDED_LINES: Record<
  "immersive" | "explorer" | "collector",
  Record<"emotion" | "color" | "both", string>
> = {
  immersive: {
    emotion: "가장 오래 머문 작품 중 '{감성}'이 가장 진하게 담긴 작품이에요.",
    color: "오래 바라본 이 작품의 {n}%가 {색이름}이에요.",
    both: "'{감성}'과 {색이름}, 오래 머문 이유가 이 작품에 모두 있어요.",
  },
  explorer: {
    emotion: "전시를 돌며 가장 많이 고른 '{감성}'이 이 작품에서 가장 짙어요.",
    color: "곳곳에서 모은 {색이름}이 이 작품을 {n}% 채우고 있어요.",
    both: "이번 여정의 '{감성}'과 {색이름}이 이 작품 한 점에 모여 있어요.",
  },
  collector: {
    emotion: "모은 작품 중 '{감성}'을 가장 닮은 작품이에요.",
    color: "모은 색 가운데 {색이름}이 이 작품에 {n}% 담겨 있어요.",
    both: "'{감성}'과 {색이름}, 오늘의 수집을 한 점으로 보여 주는 작품이에요.",
  },
};

function fill(
  template: string,
  emotionKo: string,
  colorName: string,
  n: number,
): string {
  return template
    .replaceAll("{감성}", emotionKo)
    .replaceAll("{색이름}", colorName)
    .replaceAll("{n}", String(n));
}

export function similarReason(input: ReasonInput): string {
  const emotionKo = emotionNameKo(input.top1EmotionId);
  const colorName = input.top1Color ?? "";
  const n = input.colorPercentInArtwork;

  if (!input.recorded) {
    if (input.emotionOverlap) {
      return `이번엔 지나친 작품이지만, 오늘 고른 '${emotionKo}'을 가장 닮았어요.`;
    }
    return "오늘의 기록과 가장 닮은 작품이에요.";
  }

  if (input.style === "walker") {
    return "오늘 기록한 작품이에요.";
  }

  const hasE = input.emotionOverlap;
  const hasC = input.colorOverlap;
  if (!hasE && !hasC) {
    if (input.longestDwell) return "가장 오래 머문 작품이에요.";
    return "오늘의 기록과 가장 닮은 작품이에요.";
  }

  const key = hasE && hasC ? "both" : hasE ? "emotion" : "color";
  const template = RECORDED_LINES[input.style][key];
  return fill(template, emotionKo, colorName, n);
}

/** 감성 겹침 = Top1이 작품 15감성 상위 3위 안 */
export function hasEmotionOverlap(
  top1: EmotionId,
  emotions: Partial<Record<EmotionId, number>>,
): boolean {
  const ranked = (Object.entries(emotions) as [EmotionId, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([id]) => id);
  return ranked.includes(top1);
}

/** 색 겹침 = Top1 색이 작품 65색 비율 15% 이상 */
export function hasColorOverlap(
  top1Color: string | null,
  colors: Record<string, number>,
): boolean {
  if (!top1Color) return false;
  return (colors[top1Color] ?? 0) >= 0.15;
}
