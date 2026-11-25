import { describe, expect, it } from "vitest";
import { accessDecision } from "@/lib/access";

describe("accessDecision studio login + contract", () => {
  it("로그아웃 /studio → /login + returnTo", () => {
    expect(accessDecision("visitor-guest", "/studio")).toEqual({
      ok: false,
      to: "/login",
      returnTo: "/studio",
    });
    expect(accessDecision("visitor-guest", "/studio/contract")).toEqual({
      ok: false,
      to: "/login",
      returnTo: "/studio/contract",
    });
  });

  it("관람객 회원 /studio는 홈으로 (로그아웃과 분리)", () => {
    expect(accessDecision("visitor-member", "/studio")).toEqual({
      ok: false,
      to: "/",
      notice: "이 페이지를 열 수 없습니다.",
    });
  });

  it("비계약 리포트·문의·고객 → /studio/contract (notice 없음)", () => {
    for (const path of [
      "/studio/reports/ex-alley",
      "/studio/reports/ex-edge",
      "/studio/inquiries",
      "/studio/inquiries/inq-1",
      "/studio/customers",
      "/studio/customers/c-email.a%40b.c",
      "/studio/exhibitions/ex-alley/customers",
    ]) {
      expect(accessDecision("gallery-uncontracted", path)).toEqual({
        ok: false,
        to: "/studio/contract",
      });
    }
  });

  it("비계약 /studio·계약 안내는 허용", () => {
    expect(accessDecision("gallery-uncontracted", "/studio")).toEqual({ ok: true });
    expect(accessDecision("gallery-uncontracted", "/studio/contract")).toEqual({
      ok: true,
    });
  });

  it("종료 계약은 리포트·문의 허용", () => {
    expect(accessDecision("gallery-ended", "/studio/reports/ex-tide")).toEqual({
      ok: true,
    });
    expect(accessDecision("gallery-ended", "/studio/inquiries")).toEqual({
      ok: true,
    });
  });

  it("종료 계약은 QR·배치·테마·등록을 /studio로", () => {
    const blocked = "이 페이지를 열 수 없습니다.";
    for (const path of [
      "/studio/exhibitions/ex-tide/qr",
      "/studio/exhibitions/ex-tide/review",
      "/studio/exhibitions/ex-tide/theme-color",
      "/studio/exhibitions/new",
    ]) {
      expect(accessDecision("gallery-ended", path)).toEqual({
        ok: false,
        to: "/studio",
        notice: blocked,
      });
      expect(
        accessDecision("gallery-contracted", path, { contractState: "ended" }),
      ).toEqual({
        ok: false,
        to: "/studio",
        notice: blocked,
      });
    }
  });

  it("계약 갤러리 리포트 허용", () => {
    expect(accessDecision("gallery-contracted", "/studio/reports/ex-edge")).toEqual({
      ok: true,
    });
  });
});
