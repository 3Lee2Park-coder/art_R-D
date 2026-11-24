import { describe, expect, it } from "vitest";
import { EMOTIONS, type EmotionId } from "@/lib/leaflet/emotions";

/** RecordSheet 선택 표시 규칙 — 컴포넌트와 동일한 스타일 결정 */
export function emotionChipStyle(
  emotionId: EmotionId,
  selectedEmotionId: EmotionId | null,
): { borderWidth: number; pressed: boolean; fillAlpha: string } {
  const pressed = selectedEmotionId === emotionId;
  return {
    borderWidth: pressed ? 3 : 1,
    pressed,
    fillAlpha: pressed ? "cc" : "33",
  };
}

describe("emotionChipStyle", () => {
  it("선택되지 않은 칩은 얇은 테두리·연한 채움", () => {
    const style = emotionChipStyle("curiosity", null);
    expect(style.pressed).toBe(false);
    expect(style.borderWidth).toBe(1);
    expect(style.fillAlpha).toBe("33");
  });

  it("선택된 칩은 두꺼운 테두리·진한 채움", () => {
    const style = emotionChipStyle("curiosity", "curiosity");
    expect(style.pressed).toBe(true);
    expect(style.borderWidth).toBe(3);
    expect(style.fillAlpha).toBe("cc");
  });

  it("다른 감성이 선택되면 나머지는 비선택", () => {
    const other = EMOTIONS.find((e) => e.id !== "awe")!;
    expect(emotionChipStyle(other.id, "awe").pressed).toBe(false);
    expect(emotionChipStyle("awe", "awe").pressed).toBe(true);
  });
});
