import { describe, expect, it } from "vitest";
import type { GalleryCustomerDetail } from "@/lib/leaflet/customersFromSource";
import { parseArtworkCsv } from "@/lib/studio/parseArtworkCsv";
import {
  ARTWORK_CSV_TEMPLATE_HEADERS,
  ALL_CUSTOMERS_CSV_HEADERS,
  EXHIBITION_CUSTOMERS_CSV_HEADERS,
  INQUIRIES_CSV_HEADERS,
  allCustomersCsvRows,
  artworkTemplateCsv,
  customerIdByInquiryId,
  exhibitionCustomersCsvRows,
  inquiriesCsvRows,
  toCsv,
} from "@/lib/studio/exportCsv";

function detail(partial: Partial<GalleryCustomerDetail>): GalleryCustomerDetail {
  return {
    customerId: "c-0000000000000001",
    name: "설하린",
    displayKind: "identified",
    storedIdentityKinds: [],
    emails: [],
    phones: [],
    consentContact: null,
    consentNews: null,
    visits: [],
    interests: [],
    inquiries: [],
    recommendations: [],
    similarArtworks: [],
    exhibitionIds: [],
    ...partial,
  };
}

describe("exportCsv", () => {
  it("UTF-8 BOM과 따옴표 이스케이프", () => {
    const csv = toCsv([
      ["a", 'he said "hi"'],
      ["1", null],
    ]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"he said ""hi"""');
    expect(csv).toContain("\r\n");
  });

  it("작품 양식은 머리글만 (예시 행 없음)", () => {
    const text = artworkTemplateCsv();
    expect(text.replace(/^\uFEFF/, "").split("\r\n")).toHaveLength(1);
    expect(text).not.toContain("예시 작품");
    expect(text).not.toContain("홍길동");
    expect(parseArtworkCsv(text)).toEqual([]);
    const withRow = `${text}\r\n"작품","작가","","50","","",""`;
    const parsed = parseArtworkCsv(withRow);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.widthCm).toBe(50);
    expect(ARTWORK_CSV_TEMPLATE_HEADERS[0]).toBe("작품명");
  });

  it("전체 고객 열 순서(HTML)와 여러 연락처 `; ` 연결, 빈 칸", () => {
    expect([...ALL_CUSTOMERS_CSV_HEADERS]).toEqual([
      "고객ID",
      "이름",
      "최초 확보 전시",
      "이메일",
      "전화번호",
      "방문 전시",
      "방문 횟수",
      "문의 수",
      "전시 소식 동의",
      "메모",
    ]);
    const rows = allCustomersCsvRows([
      detail({
        emails: ["a@example.com", "b@example.com"],
        phones: ["010-0000-0101", "010-0000-0102"],
        consentNews: true,
        visits: [
          {
            exhibitionId: "ex-edge",
            exhibitionTitle: "경계",
            leafletId: "L2",
            recordedAt: "2026-03-01",
          },
          {
            exhibitionId: "ex-winter",
            exhibitionTitle: "겨울",
            leafletId: "L1",
            recordedAt: "2026-01-10",
          },
        ],
        inquiries: [{ id: "q1", exhibitionId: "ex-edge", createdAt: null, name: null }],
      }),
      detail({ customerId: "c-0000000000000002", name: null }),
    ]);
    expect(rows[0]).toEqual([...ALL_CUSTOMERS_CSV_HEADERS]);
    expect(rows[1]).toEqual([
      "c-0000000000000001",
      "설하린",
      "겨울",
      "a@example.com; b@example.com",
      "010-0000-0101; 010-0000-0102",
      "경계; 겨울",
      2,
      1,
      "동의",
      "",
    ]);
    expect(rows[2]?.slice(1)).toEqual(["", "", "", "", "", 0, 0, "", ""]);
  });

  it("전시별 고객 열 순서와 닮은 작품 열", () => {
    expect([...EXHIBITION_CUSTOMERS_CSV_HEADERS]).toEqual([
      "customer_id",
      "display_name",
      "registration_source",
      "email",
      "phone",
      "inquiry_reply_consent",
      "newsletter_consent",
      "internal_memo",
      "interest_artworks_in_selected_exhibition",
      "recommended_similar_artworks_in_selected_exhibition",
      "inquiry_count_in_selected_exhibition",
      "owner",
      "last_activity",
    ]);
    const rows = exhibitionCustomersCsvRows(
      [
        detail({
          emails: ["a@example.com"],
          consentContact: true,
          consentNews: false,
          interests: [
            { artworkId: "aw-1", exhibitionId: "ex", addedAt: "2026-01-02" },
          ],
          similarArtworks: [{ artworkId: "aw-2", exhibitionId: "ex", leafletId: "L" }],
          recommendations: [{ artworkId: "aw-study", exhibitionId: "ex", leafletId: "L" }],
          visits: [
            { exhibitionId: "ex", exhibitionTitle: "X", leafletId: "L", recordedAt: "2026-01-03" },
          ],
        }),
      ],
      (id) => ({ "aw-1": "하나", "aw-2": "둘", "aw-study": "스터디" })[id] ?? "",
    );
    expect(rows[1]).toEqual([
      "c-0000000000000001",
      "설하린",
      "",
      "a@example.com",
      "",
      "동의",
      "미동의",
      "",
      "하나",
      "둘",
      0,
      "",
      "2026-01-03",
    ]);
  });

  it("문의 CSV 열 순서·고객 ID 빈 칸", () => {
    expect([...INQUIRIES_CSV_HEADERS]).toEqual([
      "exhibition",
      "inquiry_id",
      "customer_id",
      "artwork",
      "source",
      "message",
      "status",
      "owner",
      "follow_up_date",
      "inquiry_reply_consent",
    ]);
    const rows = inquiriesCsvRows([
      {
        exhibition: "겨울",
        inquiryId: "q1",
        customerId: "",
        artwork: "하나",
        message: "문의",
        status: "신규",
        replyConsent: true,
      },
    ]);
    expect(rows[1]).toEqual(["겨울", "q1", "", "하나", "", "문의", "신규", "", "", "동의"]);
  });

  it("문의 ID → 고객 ID", () => {
    const map = customerIdByInquiryId([
      detail({
        inquiries: [{ id: "q1", exhibitionId: "ex", createdAt: null, name: "설하린" }],
      }),
    ]);
    expect(map.get("q1")).toBe("c-0000000000000001");
    expect(map.get("q2")).toBeUndefined();
  });
});
