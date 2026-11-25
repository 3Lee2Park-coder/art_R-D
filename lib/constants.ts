export const CONSENT_VERSION = "2026-11-16";

export const HANN_GALLERY_ID = "g-hannam";
export const SEOCHON_GALLERY_ID = "g-seochon";
export const BUSAN_GALLERY_ID = "g-busan";

/** 랜딩 HTML과 동일. 임의로 바꾸지 않는다. */
export const COMPANY_INQUIRY_EMAIL = "restart@restart-official.com";

/** 랜딩 HTML mailto subject와 동일 */
export const COMPANY_INQUIRY_SUBJECT = "RestArt 갤러리 솔루션 도입 상담";

export const COMPANY_INQUIRY_MAILTO = `mailto:${COMPANY_INQUIRY_EMAIL}?subject=${encodeURIComponent(COMPANY_INQUIRY_SUBJECT)}`;

export const COMPANY_INQUIRY_MAILTO_PLAIN = `mailto:${COMPANY_INQUIRY_EMAIL}`;

export const REASON_CHIPS = ["색", "형태", "자리", "크기", "재료"];

export const SPACE_LABELS = ["S1", "S2", "S3", "S4", "S5", "S6"];

export const WALLS = [
  { id: "navy", name: "남색", color: "#0D2E52" },
  { id: "deep", name: "깊은 남색", color: "#092039" },
  { id: "soft", name: "밝은 남색", color: "#254263" },
] as const;

export const THEMES = [
  { id: "deep", name: "깊은 남색", bar: "#F6CD52" },
  { id: "navy", name: "남색", bar: "#FFFFFF" },
  { id: "yellow", name: "노랑", bar: "#F6CD52" },
  { id: "plain", name: "기본", bar: "#CCCCCC" },
] as const;

export function themeById(id: string | null | undefined) {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
