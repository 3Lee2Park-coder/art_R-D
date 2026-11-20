import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildLeafletResult,
  LeafletBlockedError,
} from "@/lib/leaflet/buildLeafletResult";
import {
  artworkLabelsFromFixtures,
  exhibitionFromFixtures,
  memberHistoryFromFixtures,
  scenarioToVisit,
  type ScenarioId,
} from "@/lib/leaflet/fixtures";

const labels = artworkLabelsFromFixtures();
const exhibition = exhibitionFromFixtures();

const EXPECTED: Record<
  ScenarioId,
  {
    typeName: string;
    style: string;
    dwellSecs: number[];
    top1EmotionId: string;
    topColors?: { name: string; percent: number }[];
    similarId: string;
    reason: string;
    comparison: string;
  }
> = {
  "wonder-immersive": {
    typeName: "경이 몰입가",
    style: "immersive",
    dwellSecs: [40, 55, 180, 45, 50],
    top1EmotionId: "awe",
    topColors: [
      { name: "Persian Indigo", percent: 17 },
      { name: "Heather", percent: 12 },
      { name: "White Smoke", percent: 11 },
      { name: "Chetwode Blue", percent: 10 },
      { name: "Wheat", percent: 9 },
    ],
    similarId: "aw-window",
    reason:
      "'경외심'과 Persian Indigo, 오래 머문 이유가 이 작품에 모두 있어요.",
    comparison: "'경외심'을 고른 24번째 관람자예요",
  },
  "bright-explorer": {
    typeName: "설렘 탐험가",
    style: "explorer",
    dwellSecs: [35, 40, 42, 600, 36, 43],
    top1EmotionId: "happiness",
    similarId: "aw-e12",
    reason: "이번엔 지나친 작품이지만, 오늘 고른 '행복'을 가장 닮았어요.",
    comparison: "'행복'을 고른 32번째 관람자예요",
  },
  "color-collector": {
    typeName: "컬러 수집가",
    style: "collector",
    dwellSecs: [25, 36, 39, 37, 40, 120, 79, 45],
    top1EmotionId: "sensuous",
    topColors: [
      { name: "Persian Indigo", percent: 17 },
      { name: "Cobalt", percent: 14 },
      { name: "Wheat", percent: 13 },
      { name: "Mandy", percent: 11 },
      { name: "Kournikova", percent: 8 },
    ],
    similarId: "aw-e06",
    reason: "모은 작품 중 '감각적'을 가장 닮은 작품이에요.",
    comparison: "이 전시의 첫 번째 '감각적' 관람자예요",
  },
  walker: {
    typeName: "오늘의 산책자",
    style: "walker",
    dwellSecs: [45, 55, 50],
    top1EmotionId: "compassion",
    similarId: "aw-edge",
    reason: "오늘 기록한 작품이에요.",
    comparison: "'동정'을 고른 5번째 관람자예요",
  },
};

describe("시나리오 4개 (LEAFLET_FIXTURES 2장)", () => {
  for (const [id, exp] of Object.entries(EXPECTED) as [
    ScenarioId,
    (typeof EXPECTED)[ScenarioId],
  ][]) {
    it(`${id} → ${exp.typeName}`, () => {
      const result = buildLeafletResult(
        scenarioToVisit(id),
        exhibition,
        labels,
      );
      expect(result.typeName).toBe(exp.typeName);
      expect(result.style).toBe(exp.style);
      expect(result).not.toHaveProperty("secondary");
      expect(result.dwellSecs).toEqual(exp.dwellSecs);
      expect(result.top1EmotionId).toBe(exp.top1EmotionId);
      if (exp.topColors) {
        expect(
          result.topColors.map((c) => ({ name: c.name, percent: c.percent })),
        ).toEqual(exp.topColors);
      }
      expect(result.similar.artworkId).toBe(exp.similarId);
      expect(result.similar.reason).toBe(exp.reason);
      expect(result.comparison.line).toBe(exp.comparison);
    });
  }

  it("walker has walkerReason no_condition", () => {
    const result = buildLeafletResult(
      scenarioToVisit("walker"),
      exhibition,
      labels,
    );
    expect(result.walkerReason).toBe("no_condition");
    expect(result.representative.kind).toBe("similarArtwork");
  });
});

describe("기록 0건", () => {
  it("buildLeafletResult throws blocked (no insufficient_data leaflet)", () => {
    expect(() =>
      buildLeafletResult(
        {
          records: [],
          generateAtSec: 0,
          otherVisitorsTop1: {},
        },
        exhibition,
        labels,
      ),
    ).toThrow(LeafletBlockedError);
  });
});

describe("누적 memberHistory + A", () => {
  it("전시 2곳, 경외심 1 · 슬픔 1", () => {
    const result = buildLeafletResult(
      scenarioToVisit("wonder-immersive"),
      exhibition,
      labels,
      memberHistoryFromFixtures(),
    );
    expect(result.cumulative.exhibitionCount).toBe(2);
    expect(result.cumulative.topEmotions).toEqual([
      { key: "awe", count: 1 },
      { key: "sadness", count: 1 },
    ]);
    expect(result.cumulative.topColors.map((c) => c.key).sort()).toEqual(
      ["Chetwode Blue", "Persian Indigo"].sort(),
    );
  });
});

describe("fixtures 동기화", () => {
  it("data/leaflet-fixtures.json === docs/leaflet/leaflet-fixtures.json", () => {
    const a = readFileSync(
      resolve(__dirname, "../../../data/leaflet-fixtures.json"),
      "utf8",
    );
    const b = readFileSync(
      resolve(__dirname, "../../../docs/leaflet/leaflet-fixtures.json"),
      "utf8",
    );
    expect(a).toBe(b);
  });
});
