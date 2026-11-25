import { describe, expect, it } from "vitest";
import {
  canViewExhibitionReport,
  REPORT_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";

describe("canViewExhibitionReport", () => {
  it("계약 한남 + ex-edge 허용", () => {
    expect(
      canViewExhibitionReport({
        role: "gallery-contracted",
        myGalleryId: "g-hannam",
        contractState: "contracted",
        exhibitionGalleryId: "g-hannam",
      }),
    ).toBe(true);
  });

  it("비계약 서촌은 ex-alley·ex-edge 모두 거절", () => {
    expect(
      canViewExhibitionReport({
        role: "gallery-uncontracted",
        myGalleryId: "g-seochon",
        contractState: "uncontracted",
        exhibitionGalleryId: "g-seochon",
      }),
    ).toBe(false);
    expect(
      canViewExhibitionReport({
        role: "gallery-uncontracted",
        myGalleryId: "g-seochon",
        contractState: "uncontracted",
        exhibitionGalleryId: "g-hannam",
      }),
    ).toBe(false);
  });

  it("관람객·로그아웃·운영자는 거절", () => {
    for (const role of ["visitor-guest", "visitor-member", "operator"] as const) {
      expect(
        canViewExhibitionReport({
          role,
          myGalleryId: role === "operator" ? null : "g-hannam",
          contractState: "contracted",
          exhibitionGalleryId: "g-hannam",
        }),
      ).toBe(false);
    }
  });

  it("계약 갤러리가 다른 갤러리 전시면 거절", () => {
    expect(
      canViewExhibitionReport({
        role: "gallery-contracted",
        myGalleryId: "g-hannam",
        contractState: "contracted",
        exhibitionGalleryId: "g-seochon",
      }),
    ).toBe(false);
  });

  it("거절 문구 상수", () => {
    expect(REPORT_ACCESS_DENIED).toBe("리포트를 볼 수 없습니다");
  });
});
