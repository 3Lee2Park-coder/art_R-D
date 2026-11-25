import { describe, expect, it } from "vitest";
import example from "@/lib/leaflet/__fixtures__/exhibition-report.example.json";
import {
  assertNoImmerserKey,
  buildExhibitionReport,
  STYLE_LABELS,
  type ExhibitionReportSource,
} from "@/lib/leaflet/exhibitionReport";
import type { VisitorEvent } from "@/lib/leaflet/events";

function emptySource(over: Partial<ExhibitionReportSource> = {}): ExhibitionReportSource {
  return {
    exhibitionId: "ex-edge",
    exhibitionTitle: "빛의 가장자리",
    themeColorName: "Persian Indigo",
    leaflets: [],
    interests: [],
    inquiries: [],
    events: [],
    zonesByArtwork: {},
    ...over,
  };
}

function evt(
  leafletId: string,
  identityKind: VisitorEvent["identityKind"],
  at: string,
): VisitorEvent {
  return {
    id: `e-${leafletId}-${at}`,
    at,
    type: "interest_add",
    leafletId,
    visitorKey: leafletId,
    identityKind,
  };
}

describe("buildExhibitionReport", () => {
  it("빈 입력: 건수 0, zones.available false, 예외 없음", () => {
    const report = buildExhibitionReport(emptySource());
    expect(report.leaflets.count).toBe(0);
    expect(report.visitors.stored).toEqual({
      member: 0,
      identified: 0,
      anonymous: 0,
      unspecified: 0,
    });
    expect(report.visitors.report).toEqual({
      identified: 0,
      anonymous: 0,
      unspecified: 0,
      total: 0,
    });
    expect(report.interestByArtwork).toEqual([]);
    expect(report.inquiries.total).toBe(0);
    expect(report.styles).toEqual({
      collector: 0,
      explorer: 0,
      immersive: 0,
      walker: 0,
    });
    expect(report.emotions).toEqual([]);
    expect(report.zones).toEqual({ available: false });
    expect(assertNoImmerserKey(report)).toBe(true);
  });

  it("member+identified+anonymous → report.identified=2, stored에 member 유지", () => {
    const report = buildExhibitionReport(
      emptySource({
        leaflets: [
          { id: "v-m", exhibitionId: "ex-edge", result: { style: "walker", typeName: "오늘의 산책자" } },
          { id: "v-i", exhibitionId: "ex-edge", result: { style: "explorer", typeName: "설렘 탐험가" } },
          { id: "v-a", exhibitionId: "ex-edge", result: { style: "collector", typeName: "컬러 수집가" } },
        ],
        events: [
          evt("v-m", "member", "2026-11-01T00:00:00.000Z"),
          evt("v-i", "identified", "2026-11-01T00:00:01.000Z"),
          evt("v-a", "anonymous", "2026-11-01T00:00:02.000Z"),
        ],
      }),
    );
    expect(report.leaflets.count).toBe(3);
    expect(report.visitors.stored).toEqual({
      member: 1,
      identified: 1,
      anonymous: 1,
      unspecified: 0,
    });
    expect(report.visitors.report.identified).toBe(2);
    expect(report.visitors.report.anonymous).toBe(1);
    expect(report.visitors.report.total).toBe(3);
    expect(report.visitors.report.total).toBe(report.leaflets.count);
  });

  it("관심 2점이 같은 작품이면 count 2", () => {
    const report = buildExhibitionReport(
      emptySource({
        leaflets: [{ id: "v1", exhibitionId: "ex-edge" }],
        events: [evt("v1", "anonymous", "2026-11-01T00:00:00.000Z")],
        interests: [
          {
            artworkId: "aw-e01",
            exhibitionId: "ex-edge",
            leafletId: "v1",
            addedAt: "2026-11-01T00:00:00.000Z",
          },
          {
            artworkId: "aw-e01",
            exhibitionId: "ex-edge",
            leafletId: "v1",
            addedAt: "2026-11-01T00:01:00.000Z",
          },
        ],
      }),
    );
    expect(report.interestByArtwork).toEqual([{ artworkId: "aw-e01", count: 2 }]);
  });

  it("문의 open → 신규, saleResult null → 미입력", () => {
    const report = buildExhibitionReport(
      emptySource({
        leaflets: [{ id: "v1", exhibitionId: "ex-edge" }],
        inquiries: [
          {
            id: "inq-1",
            leafletId: "v1",
            exhibitionId: "ex-edge",
            status: "open",
            saleResult: null,
          },
        ],
      }),
    );
    expect(report.inquiries.total).toBe(1);
    expect(report.inquiries.byStatus["신규"]).toBe(1);
    expect(report.inquiries.bySaleResult.미입력).toBe(1);
  });

  it("styles.immersive 집계, immerser 키 없음", () => {
    const report = buildExhibitionReport(
      emptySource({
        leaflets: [
          {
            id: "v1",
            exhibitionId: "ex-edge",
            result: { style: "immersive", typeName: "경이 몰입가" },
          },
        ],
        events: [evt("v1", "anonymous", "2026-11-01T00:00:00.000Z")],
      }),
    );
    expect(report.styles.immersive).toBe(1);
    expect(assertNoImmerserKey(report)).toBe(true);
    expect(report.styleLabels).toEqual(STYLE_LABELS);
  });

  it("구역 매핑+기록이 있으면 zones.available true, 없으면 false", () => {
    const withZone = buildExhibitionReport(
      emptySource({
        zonesByArtwork: { "aw-e01": "A" },
        leaflets: [
          {
            id: "v1",
            exhibitionId: "ex-edge",
            records: [
              {
                artworkId: "aw-e01",
                source: "camera",
                atSec: 0,
                movingSec: 0,
                emotionId: "awe",
              },
            ],
          },
        ],
      }),
    );
    expect(withZone.zones.available).toBe(true);
    if (withZone.zones.available) {
      expect(withZone.zones.items[0]?.zone).toBe("A");
      expect(withZone.zones.items[0]?.recordCount).toBe(1);
      expect(withZone.zones.items[0]?.dwell).toEqual({ available: false });
    }

    const noZone = buildExhibitionReport(
      emptySource({
        leaflets: [
          {
            id: "v1",
            exhibitionId: "ex-edge",
            records: [
              {
                artworkId: "aw-e01",
                source: "camera",
                atSec: 0,
                movingSec: 0,
                emotionId: null,
              },
            ],
          },
        ],
      }),
    );
    expect(noZone.zones).toEqual({ available: false });
  });

  it("generateAtSec이 있으면 구역 dwell 평균을 계산", () => {
    const report = buildExhibitionReport(
      emptySource({
        zonesByArtwork: { "aw-e01": "A", "aw-e02": "B" },
        leaflets: [
          {
            id: "v1",
            exhibitionId: "ex-edge",
            generateAtSec: 200,
            records: [
              {
                artworkId: "aw-e01",
                source: "camera",
                atSec: 0,
                movingSec: 10,
                emotionId: null,
              },
              {
                artworkId: "aw-e02",
                source: "camera",
                atSec: 100,
                movingSec: 0,
                emotionId: null,
              },
            ],
          },
        ],
      }),
    );
    expect(report.zones.available).toBe(true);
    if (report.zones.available) {
      const a = report.zones.items.find((z) => z.zone === "A");
      expect(a?.dwell).toEqual({ available: true, averageSec: 90 });
    }
  });

  it("예시 픽스처와 같은 입력 → 계약 필드 일치", () => {
    const built = buildExhibitionReport(
      emptySource({
        themeColorName: "Persian Indigo",
        zonesByArtwork: { "aw-e01": "A" },
        leaflets: [
          {
            id: "visit-a",
            exhibitionId: "ex-edge",
            themeColor: "Persian Indigo",
            result: { style: "immersive", typeName: "경이 몰입가" },
            records: [
              {
                artworkId: "aw-e01",
                source: "camera",
                atSec: 0,
                movingSec: 0,
                emotionId: "awe",
              },
            ],
          },
          {
            id: "visit-b",
            exhibitionId: "ex-edge",
            themeColor: "Wheat",
            result: { style: "walker", typeName: "오늘의 산책자" },
          },
        ],
        events: [
          evt("visit-a", "member", "2026-11-01T00:00:00.000Z"),
          evt("visit-b", "anonymous", "2026-11-01T00:00:01.000Z"),
        ],
        interests: [
          {
            artworkId: "aw-e01",
            exhibitionId: "ex-edge",
            leafletId: "visit-a",
            addedAt: "2026-11-01T00:00:00.000Z",
          },
          {
            artworkId: "aw-e01",
            exhibitionId: "ex-edge",
            leafletId: "visit-b",
            addedAt: "2026-11-01T00:00:01.000Z",
          },
        ],
        inquiries: [
          {
            id: "inq-1",
            leafletId: "visit-a",
            exhibitionId: "ex-edge",
            status: "open",
            saleResult: null,
          },
        ],
      }),
    );
    expect(built).toEqual(example);
  });

  it("유형을 알 수 없으면 unspecified (추정하지 않음)", () => {
    const report = buildExhibitionReport(
      emptySource({
        leaflets: [{ id: "v-u", exhibitionId: "ex-edge" }],
      }),
    );
    expect(report.visitors.stored.unspecified).toBe(1);
    expect(report.visitors.report.unspecified).toBe(1);
    expect(report.visitors.report.identified).toBe(0);
    expect(report.visitors.report.anonymous).toBe(0);
  });
});
