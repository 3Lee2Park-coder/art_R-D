/** 문의 status · saleResult 정규화 (STEP4B) */

export const INQUIRY_STATUSES = ["신규", "연락 완료", "후속 예정", "종료"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const SALE_RESULTS = ["판매됨", "렌탈됨", "해당 없음"] as const;
export type SaleResult = (typeof SALE_RESULTS)[number] | null;

/** 저장값 → 화면/로직용. open·빈값 → 신규 */
export function normalizeInquiryStatus(raw: unknown): InquiryStatus {
  if (raw === "연락 완료" || raw === "후속 예정" || raw === "종료" || raw === "신규") {
    return raw;
  }
  if (raw === "open" || raw === "" || raw == null) return "신규";
  return "신규";
}

export function normalizeSaleResult(raw: unknown): SaleResult {
  if (raw === "판매됨" || raw === "렌탈됨" || raw === "해당 없음") return raw;
  return null;
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return (INQUIRY_STATUSES as readonly string[]).includes(value);
}
