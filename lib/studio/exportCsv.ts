/** UTF-8 BOM + CRLF CSV. 셀은 따옴표로 감싼다. */
export function toCsv(rows: (string | number | null | undefined)[][]): string {
  const body = rows
    .map((row) =>
      row
        .map((cell) => {
          const raw = cell == null ? "" : String(cell);
          return `"${raw.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
  return `\uFEFF${body}`;
}

export function downloadCsv(filename: string, rows: (string | number | null | undefined)[][]) {
  if (typeof document === "undefined") return;
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function customersCsvRows(
  customers: {
    customerId: string;
    displayName: string;
    email: string | null;
    phone: string | null;
    visitCount: number;
    inquiryCount: number;
    lastActivityAt: string | null;
  }[],
): (string | number)[][] {
  return [
    [
      "customer_id",
      "display_name",
      "email",
      "phone",
      "visit_count",
      "inquiry_count",
      "last_activity_at",
    ],
    ...customers.map((c) => [
      c.customerId,
      c.displayName,
      c.email ?? "",
      c.phone ?? "",
      c.visitCount,
      c.inquiryCount,
      c.lastActivityAt ?? "",
    ]),
  ];
}

export function inquiriesCsvRows(
  inquiries: {
    inquiryId: string;
    customerId: string;
    artworkTitle: string;
    message: string;
    status: string;
    createdAt: string;
  }[],
): (string | number)[][] {
  return [
    [
      "inquiry_id",
      "customer_id",
      "artwork",
      "message",
      "status",
      "created_at",
    ],
    ...inquiries.map((q) => [
      q.inquiryId,
      q.customerId,
      q.artworkTitle,
      q.message,
      q.status,
      q.createdAt,
    ]),
  ];
}

export const ARTWORK_CSV_TEMPLATE_HEADERS = [
  "작품명",
  "작가명",
  "제작연도",
  "가로(cm)",
  "세로(cm)",
  "매체",
  "작품 설명",
] as const;

export function artworkTemplateCsv(): string {
  return toCsv([
    [...ARTWORK_CSV_TEMPLATE_HEADERS],
    ["예시 작품", "홍길동", "2024", "50", "70", "유채", "짧은 설명"],
  ]);
}
