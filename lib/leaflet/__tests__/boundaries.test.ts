import { describe, expect, it } from "vitest";
import {
  dwellSeconds,
  mergeConsecutiveCamera,
  uniqueCameraArtworkIds,
  uniqueCameraZones,
  type VisitRecord,
} from "@/lib/leaflet/dwell";
import { computeMood } from "@/lib/leaflet/mood";
import { collectorNeed, explorerNeed, judgeStyle } from "@/lib/leaflet/style";

describe("collectorNeed / explorerNeed 경계", () => {
  it("collectorNeed", () => {
    expect(collectorNeed(4)).toBeNull();
    expect(collectorNeed(5)).toBe(4);
    expect(collectorNeed(10)).toBe(7);
    expect(collectorNeed(11)).toBe(7);
    expect(collectorNeed(12)).toBe(8);
    expect(collectorNeed(20)).toBe(12);
    expect(collectorNeed(21)).toBe(12);
    expect(collectorNeed(40)).toBe(20);
    expect(collectorNeed(41)).toBe(20);
    expect(collectorNeed(60)).toBe(24);
    expect(collectorNeed(61)).toBe(24);
    expect(collectorNeed(80)).toBe(24);
    expect(collectorNeed(81)).toBe(25);
  });

  it("explorerNeed", () => {
    expect(explorerNeed(1)).toBeNull();
    expect(explorerNeed(2)).toBe(2);
    expect(explorerNeed(3)).toBe(2);
    expect(explorerNeed(4)).toBe(3);
    expect(explorerNeed(5)).toBe(3);
    expect(explorerNeed(6)).toBe(4);
    expect(explorerNeed(7)).toBe(4);
    expect(explorerNeed(8)).toBe(4);
    expect(explorerNeed(9)).toBe(5);
  });
});

describe("유효 시간 경계", () => {
  it("59초는 몰입 불충족, 60초는 충족", () => {
    expect(
      judgeStyle({
        uniqueCameraArtworks: 1,
        totalArtworks: 12,
        uniqueCameraZones: 1,
        totalZones: 4,
        dwellSecs: [59],
      }).met.immersive,
    ).toBe(false);
    expect(
      judgeStyle({
        uniqueCameraArtworks: 1,
        totalArtworks: 12,
        uniqueCameraZones: 1,
        totalZones: 4,
        dwellSecs: [60],
      }).met.immersive,
    ).toBe(true);
  });

  it("600초 상한", () => {
    const merged = mergeConsecutiveCamera([
      {
        artworkId: "a",
        atSec: 0,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "b",
        atSec: 900,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
    ]);
    expect(dwellSeconds(merged, 1000)).toEqual([600, 100]);
  });

  it("이동 시간이 간격보다 크면 0", () => {
    const merged = mergeConsecutiveCamera([
      {
        artworkId: "a",
        atSec: 0,
        movingSec: 80,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "b",
        atSec: 50,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
    ]);
    expect(dwellSeconds(merged, 100)[0]).toBe(0);
  });
});

describe("연속·재촬영 [가안]", () => {
  it("연속 같은 작품은 수집 1점, 시간은 합친 구간 1회", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "aw-edge",
        atSec: 0,
        movingSec: 4,
        emotionId: "sophistication",
        source: "camera",
      },
      {
        artworkId: "aw-edge",
        atSec: 15,
        movingSec: 0,
        emotionId: "sophistication",
        source: "camera",
      },
      {
        artworkId: "aw-plane",
        atSec: 40,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
    ];
    expect(uniqueCameraArtworkIds(records)).toEqual(["aw-edge", "aw-plane"]);
    const merged = mergeConsecutiveCamera(records);
    expect(merged).toHaveLength(2);
    expect(merged[0].atSec).toBe(0);
    expect(merged[0].movingSec).toBe(4);
    expect(dwellSeconds(merged, 100)).toEqual([36, 60]);
  });

  it("떨어진 같은 작품 재촬영은 고유 1점이지만 시간은 각각", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "aw-edge",
        atSec: 0,
        movingSec: 5,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "aw-plane",
        atSec: 30,
        movingSec: 5,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "aw-edge",
        atSec: 60,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
    ];
    expect(uniqueCameraArtworkIds(records)).toEqual(["aw-edge", "aw-plane"]);
    const merged = mergeConsecutiveCamera(records);
    expect(merged).toHaveLength(3);
    expect(dwellSeconds(merged, 100)).toEqual([25, 25, 40]);
  });
});

describe("map 기록 집계 [가안]", () => {
  it("수집·구역·시간에서 빠지고 감성에는 들어간다", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "aw-plane",
        atSec: 0,
        movingSec: 5,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "aw-e12",
        atSec: 50,
        movingSec: 0,
        emotionId: "curiosity",
        source: "map",
      },
      {
        artworkId: "aw-window",
        atSec: 100,
        movingSec: 0,
        emotionId: "happiness",
        source: "camera",
      },
    ];
    expect(uniqueCameraArtworkIds(records)).toEqual(["aw-plane", "aw-window"]);
    expect(
      uniqueCameraZones(records, {
        "aw-plane": "입구",
        "aw-e12": "복도",
        "aw-window": "창가",
      }),
    ).toEqual(["입구", "창가"]);
    const merged = mergeConsecutiveCamera(records);
    expect(merged.map((m) => m.artworkId)).toEqual(["aw-plane", "aw-window"]);
    // map 사이여도 카메라 다음 시각으로 계산
    expect(dwellSeconds(merged, 160)).toEqual([95, 60]);

    const mood = computeMood(records, {});
    expect(mood.emotionCounts.awe).toBe(1);
    expect(mood.emotionCounts.curiosity).toBe(1);
    expect(mood.emotionCounts.happiness).toBe(1);
  });
});

describe("무드·Top1 동점 [가안]", () => {
  it("감성 개수 동점이면 작품 라벨 합, 그래도 같으면 표 순서", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "a",
        atSec: 0,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "b",
        atSec: 10,
        movingSec: 0,
        emotionId: "happiness",
        source: "camera",
      },
    ];
    // 라벨: awe 쪽 무드(wonder)가 더 큼 → wonder
    const mood = computeMood(records, {
      a: { awe: 0.9, curiosity: 0.1 },
      b: { happiness: 0.2, joy: 0.1 },
    });
    expect(mood.moodId).toBe("wonder");
    expect(mood.top1EmotionId).toBe("awe");
  });

  it("라벨도 같으면 표 순서(밝은 > 경이로운)", () => {
    const records: VisitRecord[] = [
      {
        artworkId: "a",
        atSec: 0,
        movingSec: 0,
        emotionId: "awe",
        source: "camera",
      },
      {
        artworkId: "b",
        atSec: 10,
        movingSec: 0,
        emotionId: "happiness",
        source: "camera",
      },
    ];
    const mood = computeMood(records, {
      a: { awe: 0.5 },
      b: { happiness: 0.5 },
    });
    // 무드 개수 1:1, 라벨 합 0.5:0.5 → 표 순서 bright 먼저
    expect(mood.moodId).toBe("bright");
    // Top1 감성 개수 1:1, 라벨 0.5:0.5 → 표 순서 happiness 먼저
    expect(mood.top1EmotionId).toBe("happiness");
  });
});
