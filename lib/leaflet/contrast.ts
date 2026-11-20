/** WCAG 상대 휘도·대비율 · 테마 글자색 (LEAFLET_SPEC 7-3) */

export type Rgb = { r: number; g: number; b: number };

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseHex(hex: string): Rgb {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const DARK = "#111111";
const LIGHT = "#FFFFFF";
const FORCE_BLACK = "#000000";

/** Cinnabar·Eastern Blue → #000000 [결정] */
const FORCE_BLACK_NAMES = new Set(["Cinnabar", "Eastern Blue"]);

export function textColorFor(bg: Rgb, colorName?: string): string {
  if (colorName && FORCE_BLACK_NAMES.has(colorName)) {
    return FORCE_BLACK;
  }
  const dark = parseHex(DARK);
  const light = parseHex(LIGHT);
  const darkC = contrastRatio(dark, bg);
  const lightC = contrastRatio(light, bg);
  if (darkC < 4.5 && lightC < 4.5) {
    return FORCE_BLACK;
  }
  return darkC >= lightC ? DARK : LIGHT;
}

/** 보조 글자 = 본문 글자색 70% 불투명도 대비 [가안] */
export function auxiliaryContrast(bg: Rgb, textHex: string): number {
  const fg = parseHex(textHex);
  const blended: Rgb = {
    r: Math.round(fg.r * 0.7 + bg.r * 0.3),
    g: Math.round(fg.g * 0.7 + bg.g * 0.3),
    b: Math.round(fg.b * 0.7 + bg.b * 0.3),
  };
  return contrastRatio(blended, bg);
}

/** 감성 칩·작품 이미지와 배경 대비 3:1 미만이면 테두리 [가안] */
export function needsBorder(fg: Rgb, bg: Rgb): boolean {
  return contrastRatio(fg, bg) < 3;
}

export function hexToRgb(hex: string): Rgb {
  return parseHex(hex);
}
