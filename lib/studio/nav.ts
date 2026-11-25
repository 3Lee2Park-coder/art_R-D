/**
 * 갤러리 스튜디오 네비 (5g).
 * HTML RestArt_Gallery_Management_v2.2 라벨을 따른다.
 *
 * 나중에 연결할 경로 자리 (화면 미구현 — 네비에 넣지 않음):
 * - 고객 인텔리전스 홈
 * - 작품 관심 분석 (/studio/interests) — 5h
 * - 관람객 행동 / 익명 / 구역 — 5i
 * - 전시 등록 마법사 — 5j
 * - 전시 개선 인사이트 / 감성 — 5k
 * - 외부 연동 / 갤러리 설정 — 5l
 */

import type { Exhibition } from "@/lib/types";

export type StudioNavItem = {
  id: string;
  label: string;
  ico: string;
  /** path builder; exhibition-scoped items need selectedExhibitionId */
  href: (selectedExhibitionId: string | null) => string;
  match: (pathname: string) => boolean;
};

export type StudioNavGroup = {
  label: string;
  items: StudioNavItem[];
};

/** 계약·종료 갤러리 제품 네비 */
export const STUDIO_NAV_GROUPS: StudioNavGroup[] = [
  {
    label: "RELATIONSHIPS",
    items: [
      {
        id: "allCustomers",
        label: "전체 고객",
        ico: "♙",
        href: () => "/studio/customers",
        match: (p) => p === "/studio/customers" || /^\/studio\/customers\//.test(p),
      },
      {
        id: "customers",
        label: "전시별 고객",
        ico: "♧",
        href: (exId) =>
          exId ? `/studio/exhibitions/${exId}/customers` : "/studio",
        match: (p) => /\/studio\/exhibitions\/[^/]+\/customers/.test(p),
      },
      {
        id: "inquiries",
        label: "문의 인박스",
        ico: "✉",
        href: () => "/studio/inquiries",
        match: (p) => p.startsWith("/studio/inquiries"),
      },
    ],
  },
  {
    label: "EXHIBITION DATA",
    items: [
      {
        id: "exhibitions",
        label: "전시 관리",
        ico: "▧",
        href: () => "/studio",
        match: (p) =>
          p === "/studio" ||
          (p.startsWith("/studio/exhibitions/") &&
            !/\/customers$/.test(p) &&
            !/\/theme-color$/.test(p)),
      },
      {
        id: "reports",
        label: "전시 리포트",
        ico: "◫",
        href: (exId) => (exId ? `/studio/reports/${exId}` : "/studio"),
        match: (p) => p.startsWith("/studio/reports/"),
      },
    ],
  },
];

/** 비계약: 제품 데이터 항목 없음 */
export const STUDIO_NAV_UNCONTRACTED: StudioNavItem[] = [
  {
    id: "exhibitions",
    label: "전시 관리",
    ico: "▧",
    href: () => "/studio",
    match: (p) => p === "/studio" || p.startsWith("/studio/exhibitions/"),
  },
  {
    id: "contract",
    label: "계약 안내",
    ico: "↗",
    href: () => "/studio/contract",
    match: (p) => p === "/studio/contract" || p.startsWith("/studio/contract/"),
  },
];

export function crumbLabel(pathname: string): string {
  if (pathname === "/studio/contract") return "계약 안내";
  if (pathname.startsWith("/studio/customers/") && pathname !== "/studio/customers") {
    return "고객 상세";
  }
  if (pathname === "/studio/customers") return "전체 고객";
  if (/\/studio\/exhibitions\/[^/]+\/customers/.test(pathname)) return "전시별 고객";
  if (pathname.startsWith("/studio/inquiries")) return "문의 인박스";
  if (pathname.startsWith("/studio/reports/")) return "전시 리포트";
  if (pathname === "/studio/exhibitions/new") return "전시 등록";
  if (/\/theme-color$/.test(pathname)) return "테마 색";
  if (/\/review$/.test(pathname)) return "배치";
  if (/\/qr$/.test(pathname)) return "QR";
  if (pathname === "/studio") return "전시 관리";
  return "스튜디오";
}

/** 한남 기본 진행 중 전시. 없으면 목록 첫 항목. 새 전시 생성 안 함. */
export function pickDefaultExhibitionId(shows: Exhibition[]): string | null {
  if (shows.length === 0) return null;
  const edge = shows.find((e) => e.id === "ex-edge");
  if (edge) return edge.id;
  const open = shows.find((e) => !e.ended);
  if (open) return open.id;
  return shows[0].id;
}

export function resolveSelectedExhibitionId(
  shows: Exhibition[],
  storedId: string | null,
  pathname: string,
): string | null {
  const fromPath =
    pathname.match(/^\/studio\/reports\/([^/]+)/)?.[1] ??
    pathname.match(/^\/studio\/exhibitions\/([^/]+)\/customers/)?.[1] ??
    null;
  if (fromPath && shows.some((e) => e.id === fromPath)) return fromPath;
  if (storedId && shows.some((e) => e.id === storedId)) return storedId;
  return pickDefaultExhibitionId(shows);
}
