import { describe, expect, it } from "vitest";
import { parseArtworkCsv } from "@/lib/studio/parseArtworkCsv";
import { toCsv, customersCsvRows, artworkTemplateCsv } from "@/lib/studio/exportCsv";

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

  it("고객 CSV 헤더", () => {
    const rows = customersCsvRows([
      {
        customerId: "c1",
        displayName: "김",
        email: "a@b.c",
        phone: null,
        visitCount: 2,
        inquiryCount: 1,
        lastActivityAt: "2026-01-01",
      },
    ]);
    expect(rows[0]?.[0]).toBe("customer_id");
    expect(rows[1]?.[1]).toBe("김");
  });

  it("작품 CSV 파싱", () => {
    const text = artworkTemplateCsv();
    const parsed = parseArtworkCsv(text);
    expect(parsed.length).toBe(1);
    expect(parsed[0]?.title).toBe("예시 작품");
    expect(parsed[0]?.widthCm).toBe(50);
  });
});
