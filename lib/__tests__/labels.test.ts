import { describe, expect, it } from "vitest";
import {
  exhibitionPeriodState,
  exhibitionStateLabel,
} from "@/lib/labels";
import type { Exhibition } from "@/lib/types";

function show(partial: Partial<Exhibition>): Exhibition {
  return {
    id: "ex",
    title: "t",
    galleryId: "g",
    status: "contracted",
    venue: "v",
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

describe("exhibition labels", () => {
  it("게시됨을 쓰지 않고 기간 상태", () => {
    expect(exhibitionPeriodState(show({}), "2026-06-01")).toBe("진행 중");
    expect(exhibitionStateLabel(show({ published: true }), "2026-06-01")).toBe(
      "진행 중",
    );
    expect(exhibitionStateLabel(show({ published: true }), "2026-06-01")).not.toBe(
      "게시됨",
    );
  });

  it("pending은 확인 대기", () => {
    expect(
      exhibitionStateLabel(
        show({ approvalState: "pending", published: false }),
        "2026-06-01",
      ),
    ).toBe("확인 대기");
  });
});
