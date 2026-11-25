import { describe, expect, it } from "vitest";
import {
  pickDefaultExhibitionId,
  resolveSelectedExhibitionId,
  crumbLabel,
  STUDIO_NAV_GROUPS,
} from "@/lib/studio/nav";
import type { Exhibition } from "@/lib/types";

function show(partial: Partial<Exhibition> & { id: string }): Exhibition {
  return {
    title: partial.id,
    galleryId: "g-hannam",
    status: "contracted",
    venue: "x",
    startDate: "2026-01-01",
    endDate: "2026-02-01",
    posterUrl: "/",
    description: null,
    leafletEnabled: true,
    published: true,
    approvalState: "approved",
    ended: false,
    floorPlanUrl: null,
    themeColorName: null,
    ...partial,
  };
}

describe("studio nav helpers", () => {
  it("한남은 ex-edge를 기본 전시로", () => {
    const shows = [show({ id: "ex-winter", ended: true }), show({ id: "ex-edge" })];
    expect(pickDefaultExhibitionId(shows)).toBe("ex-edge");
  });

  it("경로의 전시 ID가 선택보다 우선", () => {
    const shows = [show({ id: "ex-edge" }), show({ id: "ex-winter", ended: true })];
    expect(
      resolveSelectedExhibitionId(shows, "ex-edge", "/studio/reports/ex-winter"),
    ).toBe("ex-winter");
    expect(
      resolveSelectedExhibitionId(
        shows,
        "ex-winter",
        "/studio/exhibitions/ex-edge/customers",
      ),
    ).toBe("ex-edge");
  });

  it("네비에 미구현 화면 id가 없다", () => {
    const ids = STUDIO_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));
    expect(ids).not.toContain("home");
    expect(ids).not.toContain("wizard");
    expect(ids).not.toContain("visitors");
    expect(ids).toContain("allCustomers");
    expect(ids).toContain("reports");
    expect(ids).toContain("interests");
    expect(ids).toContain("spaces");
    expect(ids).toContain("insights");
    expect(ids).toContain("connections");
    expect(ids).toContain("settings");
  });

  it("crumb 라벨", () => {
    expect(crumbLabel("/studio")).toBe("전시 관리");
    expect(crumbLabel("/studio/customers")).toBe("전체 고객");
    expect(crumbLabel("/studio/reports/ex-edge")).toBe("전시 리포트");
    expect(crumbLabel("/studio/interests/ex-edge")).toBe("작품 관심 분석");
    expect(crumbLabel("/studio/spaces/ex-edge")).toBe("구역별 반응");
    expect(crumbLabel("/studio/insights/ex-edge")).toBe("전시 개선 인사이트");
    expect(crumbLabel("/studio/settings")).toBe("갤러리 설정");
    expect(crumbLabel("/studio/connections")).toBe("외부 서비스 연동");
    expect(crumbLabel("/studio/exhibitions/new")).toBe("새 전시 등록");
  });
});
