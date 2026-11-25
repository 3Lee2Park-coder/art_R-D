import { describe, expect, it } from "vitest";
import example from "@/lib/leaflet/__fixtures__/exhibition-report.example.json";
import { buildExhibitionReport, type ExhibitionReport } from "@/lib/leaflet/exhibitionReport";
import {
  EMPTY_INESTIMABLE,
  EMPTY_INSUFFICIENT,
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
  it("빈 리포트: 데이터 부족·추정 불가·추천 빈 상태, 데모 수치 없음", () => {
    const view = toExhibitionReportView(emptyReport(), { totalRecords: 0 });
    expect(view.leafletCount).toBe(0);
    expect(view.contactsSecuredCount).toBe(0);
    expect(view.artworkRows).toEqual([]);
    expect(view.visitTrendEmpty).toBe(EMPTY_INSUFFICIENT);
    expect(view.recommendationsEmpty).toBe(EMPTY_RECOMMENDATIONS);
    expect(view.recommendationsAllEmpty).toBe(true);
    expect(view.zonesAvailable).toBe(false);
    expect(view.hasMemberOnlyBucket).toBe(false);
    expect(view.kpis.find((k) => k.label === "연락처 확보 고객")?.value).toBe(0);
    expect(view.kpis.find((k) => k.label === "QR 접속")?.value).toBeNull();

    const text = JSON.stringify(view);
    expect(text).not.toContain("18분");
    expect(text).not.toContain("immerser");
    expect(text).not.toContain("112");
    expect(text).not.toContain("서림");
    expect(text).not.toContain("고유 QR 체크인 세션");
    expect(text).not.toContain("리플릿 기준 v1");
    expect(EMPTY_INESTIMABLE).toBe("추정 불가");
  });

  it("예시 픽스처: 리플릿·식별·artworkRows·immersive, 회원 칸 없음", () => {
    const report = example as ExhibitionReport;
    const view = toExhibitionReportView(report, { totalRecords: 1 });
    expect(view.leafletCount).toBe(2);
    expect(view.visitors.identified).toBe(1);
    expect(view.visitors.anonymous).toBe(1);
    expect(view.contactsSecuredCount).toBe(0);
    expect(view.hasMemberOnlyBucket).toBe(false);
    expect(view.artworkRows).toEqual([
      {
        artworkId: "aw-e01",
        label: "aw-e01",
        recordCount: 1,
        interestCount: 2,
        inquiryCount: 0,
        recommendationCount: 0,
      },
    ]);
    expect(view.recommendationsAllEmpty).toBe(true);
    expect(view.styles.find((s) => s.label === "몰입가")?.value).toBe(1);
    expect(JSON.stringify(view)).not.toContain("immerser");
    expect(LABEL_UNSPECIFIED).toBe("유형 미확인");
  });

  it("뷰 컴포넌트 소스에 지운 부연 설명이 없다", () => {
    const src = readFileSync(
      join(process.cwd(), "components/leaflet/ExhibitionReportView.tsx"),
      "utf8",
    );
    expect(src).not.toContain("고유 QR 체크인 세션 · 날짜별");
    expect(src).not.toContain("고유 QR 체크인 세션 · 2시간 단위");
    expect(src).not.toContain("동일한 전시·기간 기준");
    expect(src).not.toContain("리플릿 기준 v1 · 실험 지표");
    expect(src).not.toContain("촬영 기록 · 관심 등록 · 문의 · 체류 시간");
    expect(src).not.toContain("리플릿에 실제 노출된 추천 작품 기준");
    expect(src).not.toContain("연락처 확인 고객과 익명 방문을 분리해 표시");
    expect(src).toContain("작품별 관람·관심 데이터");
    expect(src).toContain("촬영 기록");
  });
});

