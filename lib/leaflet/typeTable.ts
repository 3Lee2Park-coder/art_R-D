/** 18유형명 + 산책자 · 한 줄 설명 (LEAFLET_SPEC 3-4 문구 그대로) */

import type { MoodId } from "@/lib/leaflet/emotions";
import type { StyleId } from "@/lib/leaflet/style";

export type TypeName =
  | "밝은 몰입가"
  | "설렘 탐험가"
  | "행복 수집가"
  | "감각 몰입가"
  | "미감 탐험가"
  | "컬러 수집가"
  | "경이 몰입가"
  | "호기심 탐험가"
  | "영감 수집가"
  | "여운 몰입가"
  | "사유 탐험가"
  | "감정 수집가"
  | "강렬 몰입가"
  | "경계 탐험가"
  | "인상 수집가"
  | "공감 몰입가"
  | "이야기 탐험가"
  | "마음 수집가"
  | "오늘의 산책자";

const TYPE_BY_MOOD_STYLE: Record<
  MoodId,
  Record<"immersive" | "explorer" | "collector", TypeName>
> = {
  bright: {
    immersive: "밝은 몰입가",
    explorer: "설렘 탐험가",
    collector: "행복 수집가",
  },
  sensory: {
    immersive: "감각 몰입가",
    explorer: "미감 탐험가",
    collector: "컬러 수집가",
  },
  wonder: {
    immersive: "경이 몰입가",
    explorer: "호기심 탐험가",
    collector: "영감 수집가",
  },
  reflective: {
    immersive: "여운 몰입가",
    explorer: "사유 탐험가",
    collector: "감정 수집가",
  },
  intense: {
    immersive: "강렬 몰입가",
    explorer: "경계 탐험가",
    collector: "인상 수집가",
  },
  tender: {
    immersive: "공감 몰입가",
    explorer: "이야기 탐험가",
    collector: "마음 수집가",
  },
};

export const ONE_LINERS: Readonly<Record<TypeName, string>> = {
  "밝은 몰입가": "좋아하는 작품 앞에서 오래 머물며 그 따뜻함을 끝까지 느꼈어요.",
  "설렘 탐험가": "다음 작품이 궁금해 발걸음이 가벼웠어요.",
  "행복 수집가": "마음을 밝혀 준 순간들을 하나씩 담아 왔어요.",
  "감각 몰입가": "색과 질감, 작은 디테일까지 오래 들여다봤어요.",
  "미감 탐험가": "전시장 곳곳에서 나만의 아름다움을 찾아다녔어요.",
  "컬러 수집가": "눈에 들어온 색들을 빠짐없이 모아 왔어요.",
  "경이 몰입가": "압도되는 작품 앞에서 한참을 멈춰 섰어요.",
  "호기심 탐험가": "궁금한 것을 따라 전시 구석구석을 누볐어요.",
  "영감 수집가": "새로운 생각을 건네준 작품들을 차곡차곡 담았어요.",
  "여운 몰입가": "작품이 남긴 여운이 길게 이어졌어요.",
  "사유 탐험가": "작품 사이를 오가며 천천히 생각을 이어 갔어요.",
  "감정 수집가": "작품마다 다른 마음을 솔직하게 남겼어요.",
  "강렬 몰입가": "강한 인상을 준 작품을 피하지 않고 마주했어요.",
  "경계 탐험가": "낯선 작품에도 먼저 다가갔어요.",
  "인상 수집가": "마음을 흔든 장면들을 놓치지 않고 남겼어요.",
  "공감 몰입가": "작품 속 누군가의 마음에 오래 귀 기울였어요.",
  "이야기 탐험가": "작품마다 숨은 이야기를 찾아 전시를 걸었어요.",
  "마음 수집가": "작품이 건넨 다정한 마음들을 모아 왔어요.",
  "오늘의 산책자": "가볍게 둘러본 오늘, 다음엔 한 작품 더 남겨 보세요.",
};

export function resolveTypeName(moodId: MoodId, style: StyleId): TypeName {
  if (style === "walker") return "오늘의 산책자";
  return TYPE_BY_MOOD_STYLE[moodId][style];
}

export function oneLinerFor(typeName: TypeName): string {
  return ONE_LINERS[typeName];
}
