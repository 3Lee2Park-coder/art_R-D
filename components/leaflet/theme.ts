/** 리플릿 테마 색 → 글자·테두리 (계산은 contrast/colors만) */

import type { CSSProperties } from "react";
import { COLOR_BY_NAME, type RestartColor } from "@/lib/leaflet/colors";
import { hexToRgb, needsBorder, textColorFor } from "@/lib/leaflet/contrast";

export type LeafletTheme = {
  name: string;
  color: RestartColor;
  bg: string;
  text: string;
  aux: string;
  border: string;
  chipBorder: (chipHex: string) => string | undefined;
  imageBorder: boolean;
};

export function resolveLeafletTheme(themeColorName: string | undefined): LeafletTheme {
  const name = themeColorName && COLOR_BY_NAME[themeColorName] ? themeColorName : "Persian Indigo";
  const color = COLOR_BY_NAME[name];
  const bgRgb = { r: color.r, g: color.g, b: color.b };
  const text = textColorFor(bgRgb, name);
  return {
    name,
    color,
    bg: color.hex,
    text,
    aux: `${text}B3`,
    border: `${text}33`,
    chipBorder: (chipHex: string) => {
      try {
        return needsBorder(hexToRgb(chipHex), bgRgb) ? `${text}33` : undefined;
      } catch {
        return undefined;
      }
    },
    imageBorder: needsBorder({ r: 128, g: 128, b: 128 }, bgRgb),
  };
}

/** 와이어프레임 알약 버튼 */
export function leafletPillStyle(
  theme: LeafletTheme,
  kind: "primary" | "secondary",
): CSSProperties {
  if (kind === "primary") {
    return {
      background: theme.text,
      color: theme.bg,
      borderRadius: 9999,
      border: "none",
    };
  }
  return {
    background: "transparent",
    color: theme.text,
    borderRadius: 9999,
    border: `1px solid ${theme.text}`,
  };
}
