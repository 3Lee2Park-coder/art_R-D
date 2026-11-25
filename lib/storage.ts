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
  /** 전시 리플릿 테마 색(65색). A-03 exhibitionTheme 과 분리 (CL-009) */
  exhibitionThemeColor: "restart.exhibitionThemeColor",
  layoutChecked: "restart.layoutChecked",
  reviewAsked: "restart.reviewAsked",
  /** 회원가입 이름. 허브 인사에만 사용 [가안] */
  visitorName: "restart.visitorName",
  /** 갤러리 스튜디오 전역 전시 선택 (5g) */
  studioExhibitionId: "restart.studioExhibitionId",
  /** 5h 전시 등록 초안 */
  wizardDraft: "restart.wizardDraft",
  exhibitionGoals: "restart.exhibitionGoals",
  exhibitionZones: "restart.exhibitionZones",
  studioArtworks: "restart.studioArtworks",
  studioArtists: "restart.studioArtists",
  galleryProfiles: "restart.galleryProfiles",
} as const;

export const SESSION = {
  qrEntry: "restart.qrEntry",
  capture: "restart.capture",
  failNext: "restart.failNext",
  notice: "restart.notice",
  /** 시나리오 id. 화면에는 보이지 않음 [가안 기본 wonder-immersive] */
  scenario: "restart.scenario",
  visitId: "restart.visitId",
  /** [가안] 이번 visitId 동의 { visitId, version } */
  visitConsent: "restart.visitConsent",
} as const;

const ROLES: Role[] = [
  "visitor-guest",
  "visitor-member",
  "gallery-contracted",
  "gallery-uncontracted",
  "gallery-ended",
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

/**
 * localStorage 할당량(~5MB) 초과 시 큰 data URL 사진을 비우고 재시도.
 * 프로토타입: 서버 스토리지 없이 메타·리플릿은 남기고, 초고용량 미리보기만 포기.
 */
export function writeSavedLeaflets(leaflets: Leaflet[]) {
  const payload = JSON.stringify(leaflets);
  try {
    localStorage.setItem(KEYS.savedLeaflets, payload);
    return;
  } catch (err) {
    if (!(err instanceof DOMException) || err.name !== "QuotaExceededError") throw err;
  }
  const stripped = leaflets.map((item) => {
    const url = item.myPhotoUrl;
    if (!url || url.length < 80_000) return item;
    return { ...item, myPhotoUrl: undefined };
  });
  localStorage.setItem(KEYS.savedLeaflets, JSON.stringify(stripped));
}
