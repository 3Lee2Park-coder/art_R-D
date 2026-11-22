/** 15감성 · 6무드 (LEAFLET_SPEC 3-1, 7-1) */

export type EmotionId =
  | "happiness"
  | "joy"
  | "love"
  | "sophistication"
  | "sensuous"
  | "curiosity"
  | "awe"
  | "sadness"
  | "worry"
  | "confusion"
  | "fear"
  | "hatred"
  | "anger"
  | "greed"
  | "compassion";

export type MoodId =
  | "bright"
  | "sensory"
  | "wonder"
  | "reflective"
  | "intense"
  | "tender";

export type Emotion = {
  id: EmotionId;
  nameKo: string;
  displayColor: string;
  moodId: MoodId;
};

export type Mood = {
  id: MoodId;
  nameKo: string;
  /** 표 순서 (동점 시 사용) [가안] */
  order: number;
};

export const MOODS: readonly Mood[] = [
  { id: "bright", nameKo: "밝은", order: 0 },
  { id: "sensory", nameKo: "감각적인", order: 1 },
  { id: "wonder", nameKo: "경이로운", order: 2 },
  { id: "reflective", nameKo: "사색적인", order: 3 },
  { id: "intense", nameKo: "강렬한", order: 4 },
  { id: "tender", nameKo: "다정한", order: 5 },
] as const;

/** 표 순서 = Top1 감성 동점 시 우선순위 [가안] */
export const EMOTIONS: readonly Emotion[] = [
  { id: "happiness", nameKo: "행복", displayColor: "#F6CD52", moodId: "bright" },
  { id: "joy", nameKo: "기쁨", displayColor: "#F4A93B", moodId: "bright" },
  { id: "love", nameKo: "사랑", displayColor: "#E5737F", moodId: "bright" },
  { id: "sophistication", nameKo: "세련됨", displayColor: "#8C8FA6", moodId: "sensory" },
  { id: "sensuous", nameKo: "감각적", displayColor: "#B65FCF", moodId: "sensory" },
  { id: "curiosity", nameKo: "호기심", displayColor: "#3FB6A8", moodId: "wonder" },
  { id: "awe", nameKo: "경외심", displayColor: "#2E5AAC", moodId: "wonder" },
  { id: "sadness", nameKo: "슬픔", displayColor: "#4A6FA5", moodId: "reflective" },
  { id: "worry", nameKo: "걱정", displayColor: "#9AA07A", moodId: "reflective" },
  { id: "confusion", nameKo: "혼란", displayColor: "#A3A3A3", moodId: "reflective" },
  { id: "fear", nameKo: "공포", displayColor: "#3B2F4A", moodId: "reflective" },
  { id: "hatred", nameKo: "미움", displayColor: "#6B4E3D", moodId: "intense" },
  { id: "anger", nameKo: "노여움", displayColor: "#B8312B", moodId: "intense" },
  { id: "greed", nameKo: "욕심", displayColor: "#C98A2B", moodId: "intense" },
  { id: "compassion", nameKo: "동정", displayColor: "#9CC5D9", moodId: "tender" },
] as const;

export const EMOTION_BY_ID: Readonly<Record<EmotionId, Emotion>> = Object.fromEntries(
  EMOTIONS.map((e) => [e.id, e]),
) as Record<EmotionId, Emotion>;

export const EMOTION_ORDER: readonly EmotionId[] = EMOTIONS.map((e) => e.id);

export const MOOD_BY_ID: Readonly<Record<MoodId, Mood>> = Object.fromEntries(
  MOODS.map((m) => [m.id, m]),
) as Record<MoodId, Mood>;

export function emotionNameKo(id: EmotionId): string {
  return EMOTION_BY_ID[id].nameKo;
}
