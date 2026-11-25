import { describe, expect, it } from "vitest";
import {
  canUseLeafletService,
  isContractEnded,
} from "@/lib/leaflet/galleryContract";
import type { Exhibition, Gallery } from "@/lib/types";

const busan: Gallery = {
  id: "g-busan",
  name: "해변 갤러리",
  region: "부산",
  initial: "ㅎ",
  contractState: "ended",
  contractStartAt: "2025-06-01",
  contractEndAt: "2025-08-20T23:59:59.999Z",
  bio: null,
};

const hannam: Gallery = {
  id: "g-hannam",
  name: "한남 아틀리에",
  region: "서울",
  initial: "ㅎ",
  contractState: "contracted",
  contractStartAt: "2024-01-01",
  contractEndAt: null,
  bio: null,
};

const tide: Exhibition = {
  id: "ex-tide",
  title: "간조",
  galleryId: "g-busan",
  status: "contracted",
  venue: "해변 갤러리",
  startDate: "2025-07-01",
  endDate: "2025-08-20",
  posterUrl: "/",
  description: null,
  leafletEnabled: true,
  published: true,
  approvalState: "approved",
  ended: true,
  floorPlanUrl: null,
  themeColorName: null,
};

const winter: Exhibition = {
  id: "ex-winter",
  title: "겨울",
  galleryId: "g-hannam",
  status: "contracted",
  venue: "한남",
  startDate: "2025-01-01",
  endDate: "2025-02-01",
  posterUrl: "/",
  description: null,
  leafletEnabled: true,
  published: true,
  approvalState: "approved",
  ended: true,
  floorPlanUrl: null,
  themeColorName: null,
};

describe("galleryContract", () => {
  it("계약 종료면 리플릿 서비스 불가 (leafletEnabled여도)", () => {
    expect(isContractEnded(busan)).toBe(true);
    expect(canUseLeafletService({ ...tide, ended: false }, busan)).toBe(false);
  });

  it("유효 계약의 종료 전시는 입장 불가·만료 QR 아님 (서비스 게이트만)", () => {
    expect(isContractEnded(hannam)).toBe(false);
    expect(canUseLeafletService(winter, hannam)).toBe(false);
  });
});
