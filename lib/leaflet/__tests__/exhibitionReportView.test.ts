import { describe, expect, it } from "vitest";
import example from "@/lib/leaflet/__fixtures__/exhibition-report.example.json";
import { buildExhibitionReport, type ExhibitionReport } from "@/lib/leaflet/exhibitionReport";
import {
  EMPTY_DATA,
  EMPTY_RECOMMENDATIONS,
  EMPTY_VISIT_TREND,
  LABEL_UNSPECIFIED,
  toExhibitionReportView,
} from "@/lib/leaflet/exhibitionReportView";

function emptyReport(): ExhibitionReport {
  return buildExhibitionReport({
    exhibitionId: "ex-edge",
    exhibitionTitle: null,
    themeColorName: "Persian Indigo",
    leaflets: [],
    interests: [],
    inquiries: [],
    events: [],
    zonesByArtwork: {},
  });
}

describe("toExhibitionReportView", () => {
  it("빈 리포트: 예외 없음, 데모 수치·18분·체류 평균 없음", () => {
    const view = toExhibitionReportView(emptyReport(), { totalRecords: 0 });
    expect(view.leafletCount).toBe(0);
    expect(view.visitors).toEqual({ identified: 0, anonymous: 0, unspecified: 0 });
    expect(view.visitTrendEmpty).toBe(EMPTY_VISIT_TREND);
    expect(view.recommendationsEmpty).toBe(EMPTY_RECOMMENDATIONS);
    expect(view.zonesAvailable).toBe(false);
    expect(view.zones.every((z) => z.dwellLabel === null)).toBe(true);
    expect(view.hasMemberOnlyBucket).toBe(false);

    const text = JSON.stringify(view);
    expect(text).not.toContain("18분");
    expect(text).not.toContain("immerser");
    expect(text).not.toContain("112");
    expect(text).not.toContain("서림");
    expect(view.kpis.find((k) => k.label === "QR 접속")?.value).toBeNull();
    expect(view.kpis.find((k) => k.label === "리플릿 생성")?.value).toBe(0);
    expect(EMPTY_DATA).toBeTruthy();
  });

  it("5a 예시 픽스처: 리플릿·식별·익명·관심·문의·immersive", () => {
    const report = example as ExhibitionReport;
    const view = toExhibitionReportView(report, { totalRecords: 1 });
    expect(view.leafletCount).toBe(2);
    expect(view.visitors.identified).toBe(1);
    expect(view.visitors.anonymous).toBe(1);
    expect(view.visitors.unspecified).toBe(0);
    expect(view.hasMemberOnlyBucket).toBe(false);
    expect(view.interests).toEqual([{ artworkId: "aw-e01", label: "aw-e01", count: 2 }]);
    expect(view.inquiryTotal).toBe(1);
    expect(view.inquiryByStatus.find((s) => s.label === "신규")?.count).toBe(1);
    expect(view.saleSummary.find((s) => s.label === "미입력")?.count).toBe(1);
    expect(view.styles.find((s) => s.label === "몰입가")?.value).toBe(1);
    expect(view.styleKeys).toEqual(["collector", "explorer", "immersive", "walker"]);
    expect(JSON.stringify(view)).not.toContain("immerser");
    expect(LABEL_UNSPECIFIED).toBe("유형 미확인");
  });
});
