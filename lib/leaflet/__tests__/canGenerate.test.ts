import { describe, expect, it } from "vitest";
import { canGenerateLeaflet } from "@/lib/leaflet/canGenerate";
import type { VisitRecord } from "@/lib/leaflet/dwell";

describe("canGenerateLeaflet", () => {
  it("기록 0점이면 false", () => {
    expect(canGenerateLeaflet([])).toBe(false);
  });

  it("촬영 1점이면 true", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "aw-plane",
        source: "camera",
        atSec: 0,
        movingSec: 0,
        emotionId: null,
      },
    ];
    expect(canGenerateLeaflet(records)).toBe(true);
  });

  it("배치도 감성 1개면 true", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "aw-e12",
        source: "map",
        atSec: 10,
        movingSec: 0,
        emotionId: "curiosity",
        descriptionOpened: true,
      },
    ];
    expect(canGenerateLeaflet(records)).toBe(true);
  });

  it("배치도만 있고 감성 없으면 false", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "aw-e12",
        source: "map",
        atSec: 10,
        movingSec: 0,
        emotionId: null,
        descriptionOpened: true,
      },
    ];
    expect(canGenerateLeaflet(records)).toBe(false);
  });
});
