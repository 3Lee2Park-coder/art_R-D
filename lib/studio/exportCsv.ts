import type { GalleryCustomerDetail } from "@/lib/leaflet/customersFromSource";

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

type Cell = string | number;

function consentLabel(value: boolean | null | undefined): string {
  if (value === true) return "동의";
  if (value === false) return "미동의";
  return "";
}

function uniqueJoin(values: (string | null | undefined)[]): string {
  return [...new Set(values.filter((v): v is string => Boolean(v && v.trim())))].join("; ");
}

function lastActivity(detail: GalleryCustomerDetail): string {
  const times = [
    ...detail.visits.map((v) => v.recordedAt),
    ...detail.inquiries.map((i) => i.createdAt),
    ...detail.interests.map((i) => i.addedAt),
  ].filter((t): t is string => Boolean(t));
  return times.sort().at(-1) ?? "";
}

export const ALL_CUSTOMERS_CSV_HEADERS = [
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
] as const;

/** 전체 고객. 이메일·전화가 여럿이면 `; `로 잇는다. 앱에 없는 값은 빈 칸. */
export function allCustomersCsvRows(customers: GalleryCustomerDetail[]): Cell[][] {
  return [
    [...ALL_CUSTOMERS_CSV_HEADERS],
    ...customers.map((c) => {
      const firstVisit = [...c.visits]
        .filter((v) => v.recordedAt)
        .sort((a, b) => (a.recordedAt ?? "").localeCompare(b.recordedAt ?? ""))[0];
      return [
        c.customerId,
        c.name ?? "",
        firstVisit?.exhibitionTitle ?? "",
        c.emails.join("; "),
        c.phones.join("; "),
        uniqueJoin(c.visits.map((v) => v.exhibitionTitle)),
        c.visits.length,
        c.inquiries.length,
        consentLabel(c.consentNews),
        "",
      ];
    }),
  ];
}

export const EXHIBITION_CUSTOMERS_CSV_HEADERS = [
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
] as const;

/**
 * 전시별 고객. details는 선택 전시 소스 하나로 만든 고객(그 전시 활동만 들어 있음).
 * 「추천 닮은 작품」 열은 가장 닮은 작품만(RestArt 추천 작품과 합치지 않음).
 */
export function exhibitionCustomersCsvRows(
  details: GalleryCustomerDetail[],
  artworkTitle: (artworkId: string) => string,
): Cell[][] {
  return [
    [...EXHIBITION_CUSTOMERS_CSV_HEADERS],
    ...details.map((c) => [
      c.customerId,
      c.name ?? "",
      "",
      c.emails.join("; "),
      c.phones.join("; "),
      consentLabel(c.consentContact),
      consentLabel(c.consentNews),
      "",
      uniqueJoin(c.interests.map((i) => i.title ?? artworkTitle(i.artworkId))),
      uniqueJoin(c.similarArtworks.map((s) => artworkTitle(s.artworkId))),
      c.inquiries.length,
      "",
      lastActivity(c),
    ]),
  ];
}

export const INQUIRIES_CSV_HEADERS = [
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
] as const;

export type InquiryCsvInput = {
  exhibition: string;
  inquiryId: string;
  /** 고객 목록과 같은 해시 ID. 찾을 수 없으면(익명) 빈 문자열 */
  customerId: string;
  artwork: string;
  message: string;
  status: string;
  replyConsent: boolean | null;
};

export function inquiriesCsvRows(inquiries: InquiryCsvInput[]): Cell[][] {
  return [
    [...INQUIRIES_CSV_HEADERS],
    ...inquiries.map((q) => [
      q.exhibition,
      q.inquiryId,
      q.customerId,
      q.artwork,
      "",
      q.message,
      q.status,
      "",
      "",
      consentLabel(q.replyConsent),
    ]),
  ];
}

/** 문의 ID → 고객 ID (고객 목록 규칙과 동일). */
export function customerIdByInquiryId(
  details: GalleryCustomerDetail[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const c of details) {
    for (const q of c.inquiries) map.set(q.id, c.customerId);
  }
  return map;
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
  return toCsv([[...ARTWORK_CSV_TEMPLATE_HEADERS]]);
}
