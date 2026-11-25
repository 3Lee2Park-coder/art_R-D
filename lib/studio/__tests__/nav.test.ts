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
    expect(ids).not.toContain("interests");
    expect(ids).not.toContain("insights");
    expect(ids).not.toContain("wizard");
    expect(ids).toContain("allCustomers");
    expect(ids).toContain("reports");
  });

  it("crumb 라벨", () => {
    expect(crumbLabel("/studio")).toBe("전시 관리");
    expect(crumbLabel("/studio/customers")).toBe("전체 고객");
    expect(crumbLabel("/studio/reports/ex-edge")).toBe("전시 리포트");
  });
});
