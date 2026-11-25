import { describe, expect, it } from "vitest";
import example from "@/lib/leaflet/__fixtures__/exhibition-report.example.json";
import { buildExhibitionReport, type ExhibitionReport } from "@/lib/leaflet/exhibitionReport";
import {
  EMPTY_INESTIMABLE,
  EMPTY_RECOMMENDATIONS,
  LABEL_UNSPECIFIED,
  toExhibitionReportView,
} from "@/lib/leaflet/exhibitionReportView";
import { readFileSync } from "fs";
import { join } from "path";

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
  it("빈 리포트: 데이터 부족·추정 불가, 데모 수치 없음", () => {
    const view = toExhibitionReportView(emptyReport(), { totalRecords: 0 });
    expect(view.leafletCount).toBe(0);
    expect(view.contactsSecuredCount).toBe(0);
    expect(view.artworkRows).toEqual([]);
    expect(view.visitTrendEmpty).toBe(EMPTY_INESTIMABLE);
    expect(view.recommendationsAllEmpty).toBe(true);
    expect(view.similarAllEmpty).toBe(true);
    expect(view.zonesAvailable).toBe(false);
    expect(view.hasMemberOnlyBucket).toBe(false);
    expect(view.kpis.find((k) => k.label === "연락처 확보 고객")?.value).toBe(0);

    const text = JSON.stringify(view);
    expect(text).not.toContain("18분");
    expect(text).not.toContain("immerser");
    expect(text).not.toContain("112");
    expect(EMPTY_INESTIMABLE).toBe("추정 불가");
    expect(EMPTY_RECOMMENDATIONS).toBe("추천 결과가 없습니다.");
  });

  it("예시 픽스처: similarCount 포함, 회원 칸 없음", () => {
    const report = example as ExhibitionReport;
    const view = toExhibitionReportView(report, { totalRecords: 1 });
    expect(view.leafletCount).toBe(2);
    expect(view.visitors.identified).toBe(1);
    expect(view.artworkRows).toEqual([
      {
        artworkId: "aw-e01",
        label: "aw-e01",
        recordCount: 1,
        interestCount: 2,
        inquiryCount: 0,
        recommendationCount: 0,
        similarCount: 0,
      },
    ]);
    expect(view.recommendationsAllEmpty).toBe(true);
    expect(view.similarAllEmpty).toBe(true);
    expect(view.styles.find((s) => s.label === "몰입가")?.value).toBe(1);
    expect(LABEL_UNSPECIFIED).toBe("유형 미확인");
  });

  it("뷰에 합친 추천 블록·지운 부연이 없다", () => {
    const src = readFileSync(
      join(process.cwd(), "components/leaflet/ExhibitionReportView.tsx"),
      "utf8",
    );
    expect(src).not.toContain("가장 닮은 작품 추천 성과");
    expect(src).toContain("가장 닮은 작품");
    expect(src).toContain("추천");
    expect(src).not.toContain("고유 QR 체크인 세션");
  });
});
