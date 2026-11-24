import { describe, expect, it } from "vitest";
import { mockRecognize } from "@/lib/leaflet/mockRecognition";

describe("mockRecognize", () => {
  it("color-collector 카메라 순서를 따른다", () => {
    expect(mockRecognize("color-collector", 0).artworkId).toBe("aw-plane");
    expect(mockRecognize("color-collector", 1).artworkId).toBe("aw-edge");
    expect(mockRecognize("color-collector", 2).artworkId).toBe("aw-edge");
    expect(mockRecognize("color-collector", 3).artworkId).toBe("aw-e06");
  });

  it("시나리오보다 긴 인덱스는 이동 0으로 이어진다", () => {
    const r = mockRecognize("walker", 10);
    expect(r.artworkId).toBeTruthy();
    expect(r.movingSec).toBe(0);
  });
});
