/**
 * 갤러리 스튜디오 네비 (5g/5h/5i).
 * HTML RestArt_Gallery_Management_v2.2 라벨을 따른다.
 *
 * 네비에 넣지 않음: 고객 인텔리전스 홈, 관람객 행동, 익명 관람, 감성 및 관람 유형.
 */

import type { Exhibition } from "@/lib/types";

export type StudioNavItem = {
  id: string;
  label: string;
  ico: string;
  /** path builder; exhibition-scoped items need selectedExhibitionId */
  href: (selectedExhibitionId: string | null) => string;
  match: (pathname: string) => boolean;
  /** 종료 갤러리에서 숨김 */
  hideWhenEnded?: boolean;
};

export type StudioNavGroup = {
  label: string;
  items: StudioNavItem[];
};

const REGISTER_NAV_ITEM: StudioNavItem = {
  id: "register",
  label: "전시 등록",
  ico: "＋",
  href: () => "/studio/exhibitions/new?step=1",
  match: (p) => p.startsWith("/studio/exhibitions/new"),
  hideWhenEnded: true,
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
      {
        id: "interests",
        label: "작품 관심 분석",
        ico: "♡",
        href: (exId) => (exId ? `/studio/interests/${exId}` : "/studio"),
        match: (p) => p.startsWith("/studio/interests"),
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
            !p.startsWith("/studio/exhibitions/new") &&
            !/\/customers$/.test(p) &&
            !/\/theme-color$/.test(p)),
      },
      REGISTER_NAV_ITEM,
      {
        id: "reports",
        label: "전시 리포트",
        ico: "◫",
        href: (exId) => (exId ? `/studio/reports/${exId}` : "/studio"),
        match: (p) => p.startsWith("/studio/reports/"),
      },
      {
        id: "spaces",
        label: "구역별 반응",
        ico: "▦",
        href: (exId) => (exId ? `/studio/spaces/${exId}` : "/studio"),
        match: (p) => p.startsWith("/studio/spaces"),
      },
      {
        id: "insights",
        label: "전시 개선 인사이트",
        ico: "◇",
        href: (exId) => (exId ? `/studio/insights/${exId}` : "/studio"),
        match: (p) => p.startsWith("/studio/insights"),
      },
    ],
  },
  {
    label: "ECOSYSTEM",
    items: [
      {
        id: "connections",
        label: "외부 서비스 연동",
        ico: "⇄",
        href: () => "/studio/connections",
        match: (p) => p.startsWith("/studio/connections"),
      },
      {
        id: "settings",
        label: "갤러리 설정",
        ico: "⚙",
        href: () => "/studio/settings",
        match: (p) => p.startsWith("/studio/settings"),
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
    match: (p) =>
      p === "/studio" ||
      (p.startsWith("/studio/exhibitions/") &&
        !p.startsWith("/studio/exhibitions/new")),
  },
  REGISTER_NAV_ITEM,
  {
    id: "contract",
    label: "계약 안내",
    ico: "↗",
    href: () => "/studio/contract",
    match: (p) => p === "/studio/contract" || p.startsWith("/studio/contract/"),
  },
  {
    id: "settings",
    label: "갤러리 설정",
    ico: "⚙",
    href: () => "/studio/settings",
    match: (p) => p.startsWith("/studio/settings"),
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
  if (pathname.startsWith("/studio/interests")) return "작품 관심 분석";
  if (pathname.startsWith("/studio/spaces")) return "구역별 반응";
  if (pathname.startsWith("/studio/insights")) return "전시 개선 인사이트";
  if (pathname.startsWith("/studio/connections")) return "외부 서비스 연동";
  if (pathname.startsWith("/studio/settings")) return "갤러리 설정";
  if (pathname === "/studio/exhibitions/new") return "새 전시 등록";
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
    pathname.match(/^\/studio\/interests\/([^/]+)/)?.[1] ??
    pathname.match(/^\/studio\/spaces\/([^/]+)/)?.[1] ??
    pathname.match(/^\/studio\/insights\/([^/]+)/)?.[1] ??
    pathname.match(/^\/studio\/exhibitions\/([^/]+)\/customers/)?.[1] ??
    null;
  if (fromPath && shows.some((e) => e.id === fromPath)) return fromPath;
  if (storedId && shows.some((e) => e.id === storedId)) return storedId;
  return pickDefaultExhibitionId(shows);
}

/** 갤러리 상태에 맞는 네비 항목 (종료 갤러리는 등록 숨김). */
export function visibleNavItems(
  items: StudioNavItem[],
  ended: boolean,
): StudioNavItem[] {
  return ended ? items.filter((i) => !i.hideWhenEnded) : items;
}
