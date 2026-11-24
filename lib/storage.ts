import type { Exhibition, Gallery, Leaflet, Role } from "@/lib/types";

/**
 * 브라우저 보관 키. 접두사는 restart.
 * restart.leafletDraft 는 비회원 리플릿이다.
 * 보관 기간은 정해져 있지 않아 만료를 두지 않고, 로그인에 성공하면 지운다.
 */
export const KEYS = {
  role: "restart.role",
  leafletDraft: "restart.leafletDraft",
  consentVersion: "restart.consentVersion",
  guideHiddenUntil: "restart.guideHiddenUntil",
  uploadConsent: "restart.uploadConsent",
  demo: "restart.demo",
  cart: "restart.cart",
  savedLeaflets: "restart.savedLeaflets",
  wantedIds: "restart.wantedIds",
  memberWantedInit: "restart.memberWantedInit",
  studioAdded: "restart.studioAdded",
  exhibitionPatches: "restart.exhibitionPatches",
  accountPatches: "restart.accountPatches",
  spacePick: "restart.spacePick",
  artworkPicks: "restart.artworkPicks",
  /** 리플릿 관심 작품. 마이룸 artworkPicks와 분리 */
  interestWorks: "restart.interestWorks",
  visitorEvents: "restart.visitorEvents",
  inquiries: "restart.inquiries",
  decorWall: "restart.decorWall",
  returnTo: "restart.returnTo",
  exhibitionTheme: "restart.exhibitionTheme",
  layoutChecked: "restart.layoutChecked",
  reviewAsked: "restart.reviewAsked",
} as const;

export const SESSION = {
  qrEntry: "restart.qrEntry",
  capture: "restart.capture",
  failNext: "restart.failNext",
  notice: "restart.notice",
} as const;

const ROLES: Role[] = [
  "visitor-guest",
  "visitor-member",
  "gallery-contracted",
  "gallery-uncontracted",
  "operator",
];

export function readJSON<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    if (raw === null || raw === "") return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readRole(): Role {
  const value = localStorage.getItem(KEYS.role);
  if (value && ROLES.includes(value as Role)) return value as Role;
  return "visitor-guest";
}

export type ExhibitionPatch = Partial<
  Pick<Exhibition, "published" | "approvalState" | "ended" | "leafletEnabled" | "description" | "title" | "venue" | "startDate" | "endDate">
>;

export type AccountPatches = Record<string, Gallery["contractState"]>;

export function readSavedLeaflets() {
  return readJSON<Leaflet[]>(localStorage, KEYS.savedLeaflets, []);
}

export function writeSavedLeaflets(leaflets: Leaflet[]) {
  localStorage.setItem(KEYS.savedLeaflets, JSON.stringify(leaflets));
}
