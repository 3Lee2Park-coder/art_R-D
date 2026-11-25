import { describe, expect, it } from "vitest";
import {
  buildExhibitionOpsRows,
  filterExhibitionOpsRows,
} from "@/lib/studio/exhibitionOps";
import type { Artwork, Exhibition } from "@/lib/types";

function show(partial: Partial<Exhibition> & { id: string }): Exhibition {
  return {
    title: partial.id,
    galleryId: "g-hannam",
    status: "contracted",
    venue: "x",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
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

function art(partial: Partial<Artwork> & { id: string; artistId: string }): Artwork {
  return {
    title: partial.id,
    exhibitionId: "ex-a",
    zone: null,
    imageUrl: "/",
    description: null,
    priceKrw: null,
    forSale: false,
    likeCount: 0,
    widthCm: null,
    ...partial,
  };
}

describe("exhibitionOps", () => {
  it("기간 필터와 체크인 데이터 부족", () => {
    const rows = buildExhibitionOpsRows({
      exhibitions: [
        show({ id: "ex-prep", startDate: "2099-01-01", endDate: "2099-02-01" }),
        show({ id: "ex-live", startDate: "2020-01-01", endDate: "2099-01-01" }),
        show({ id: "ex-done", ended: true, endDate: "2020-01-01" }),
      ],
      artworks: [
        art({ id: "a1", artistId: "ar1", exhibitionId: "ex-live" }),
        art({ id: "a2", artistId: "ar2", exhibitionId: "ex-live" }),
        art({ id: "a3", artistId: "ar1", exhibitionId: "ex-live" }),
      ],
      leafletCounts: { "ex-live": 3 },
      today: "2026-06-01",
    });
    expect(filterExhibitionOpsRows(rows, "준비 중").map((r) => r.exhibition.id)).toEqual([
      "ex-prep",
    ]);
    expect(filterExhibitionOpsRows(rows, "진행 중").map((r) => r.exhibition.id)).toEqual([
      "ex-live",
    ]);
    expect(filterExhibitionOpsRows(rows, "종료").map((r) => r.exhibition.id)).toEqual([
      "ex-done",
    ]);
    const live = rows.find((r) => r.exhibition.id === "ex-live")!;
    expect(live.artistCount).toBe(2);
    expect(live.leafletCount).toBe(3);
    expect(live.uniqueCheckIns).toBeNull();
  });

  it("승인 대기가 기간 상태보다 우선", () => {
    const [row] = buildExhibitionOpsRows({
      exhibitions: [
        show({
          id: "ex-p",
          approvalState: "pending",
          published: false,
          startDate: "2020-01-01",
          endDate: "2099-01-01",
        }),
      ],
      artworks: [],
      leafletCounts: {},
      today: "2026-06-01",
    });
    expect(row.state).toBe("확인 대기");
    expect(row.periodState).toBe("진행 중");
  });
});
