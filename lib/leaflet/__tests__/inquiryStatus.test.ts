import { describe, expect, it } from "vitest";
import {
  normalizeInquiryStatus,
  normalizeSaleResult,
} from "@/lib/leaflet/inquiryStatus";

describe("normalizeInquiryStatus", () => {
  it("open·빈값 → 신규", () => {
    expect(normalizeInquiryStatus("open")).toBe("신규");
    expect(normalizeInquiryStatus("")).toBe("신규");
    expect(normalizeInquiryStatus(null)).toBe("신규");
    expect(normalizeInquiryStatus(undefined)).toBe("신규");
  });

  it("한글 네 상태는 그대로", () => {
    expect(normalizeInquiryStatus("신규")).toBe("신규");
    expect(normalizeInquiryStatus("연락 완료")).toBe("연락 완료");
    expect(normalizeInquiryStatus("후속 예정")).toBe("후속 예정");
    expect(normalizeInquiryStatus("종료")).toBe("종료");
  });
});

describe("normalizeSaleResult", () => {
  it("허용 값만 통과", () => {
    expect(normalizeSaleResult(null)).toBeNull();
    expect(normalizeSaleResult("판매됨")).toBe("판매됨");
    expect(normalizeSaleResult("렌탈됨")).toBe("렌탈됨");
    expect(normalizeSaleResult("해당 없음")).toBe("해당 없음");
    expect(normalizeSaleResult("기타")).toBeNull();
  });
});
