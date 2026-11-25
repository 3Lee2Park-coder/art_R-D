import { describe, expect, it } from "vitest";
import {
  createVisitLeaflet,
  recomputeLeafletNotes,
} from "@/lib/leaflet/createVisitLeaflet";
import { scenarioToVisit } from "@/lib/leaflet/fixtures";

describe("createVisitLeaflet", () => {
  it("시나리오 A 유형명이 경이 몰입가", () => {
    const visit = scenarioToVisit("wonder-immersive");
    const leaflet = createVisitLeaflet({
      visitId: "visit-test-a",
      exhibitionId: "ex-edge",
      records: visit.records,
      scenarioId: "wonder-immersive",
      visitDate: "2026-11-20",
    });
    expect(leaflet.result?.typeName).toBe("경이 몰입가");
    expect(leaflet.result?.ruleVersion).toBe("v1-2026-11-20");
    expect(leaflet.id).toBe("visit-test-a");
    expect(leaflet.themeColor).toBe("Persian Indigo");
  });

  it("시나리오 B·C·D 유형명", () => {
    expect(
      createVisitLeaflet({
        visitId: "b",
        exhibitionId: "ex-edge",
        records: scenarioToVisit("bright-explorer").records,
        scenarioId: "bright-explorer",
        visitDate: "2026-11-20",
      }).result?.typeName,
    ).toBe("설렘 탐험가");
    expect(
      createVisitLeaflet({
        visitId: "c",
        exhibitionId: "ex-edge",
        records: scenarioToVisit("color-collector").records,
        scenarioId: "color-collector",
        visitDate: "2026-11-20",
      }).result?.typeName,
    ).toBe("컬러 수집가");
    expect(
      createVisitLeaflet({
        visitId: "d",
        exhibitionId: "ex-edge",
        records: scenarioToVisit("walker").records,
        scenarioId: "walker",
        visitDate: "2026-11-20",
      }).result?.typeName,
    ).toBe("오늘의 산책자");
  });

  it("내 사진·한줄평 재계산 시 유형·themeColor는 유지하고 대표 이미지는 내 사진", () => {
    const base = createVisitLeaflet({
      visitId: "visit-notes",
      exhibitionId: "ex-edge",
      records: scenarioToVisit("wonder-immersive").records,
      scenarioId: "wonder-immersive",
      visitDate: "2026-11-20",
      themeColor: "Persian Indigo",
    });
    const typeName = base.result!.typeName;
    const next = recomputeLeafletNotes(base, {
      myPhotoUrl: "data:image/png;base64,abc",
      comment: "오늘 좋았다",
    });
    expect(next.result?.typeName).toBe(typeName);
    expect(next.result?.ruleVersion).toBe(base.result?.ruleVersion);
    expect(next.themeColor).toBe("Persian Indigo");
    expect(next.comment).toBe("오늘 좋았다");
    expect(next.result?.representative.url).toBe("data:image/png;base64,abc");
    expect(next.result?.representative.kind).toBe("userPhoto");
  });
});


