/** 전시 테마 색 저장 · 조회 (CL-009). A-03 / KEYS.exhibitionTheme 과 분리. */

import { COLOR_BY_NAME, type RestartColor } from "@/lib/leaflet/colors";
import { leafletFixtures } from "@/lib/leaflet/fixtures";
import { KEYS, readJSON } from "@/lib/storage";

export type StoredThemeColor = {
  name: string;
  r: number;
  g: number;
  b: number;
  hex: string;
};

export type ExhibitionThemeMap = Record<string, StoredThemeColor>;

export function readExhibitionThemeMap(
  storage: Pick<Storage, "getItem"> = localStorage,
): ExhibitionThemeMap {
  if (typeof storage === "undefined") return {};
  return readJSON<ExhibitionThemeMap>(storage as Storage, KEYS.exhibitionThemeColor, {});
}

export function writeExhibitionThemeColor(
  exhibitionId: string,
  color: RestartColor,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage,
): void {
  const map = readExhibitionThemeMap(storage);
  map[exhibitionId] = {
    name: color.name,
    r: color.r,
    g: color.g,
    b: color.b,
    hex: color.hex,
  };
  storage.setItem(KEYS.exhibitionThemeColor, JSON.stringify(map));
}

export function clearExhibitionThemeColor(
  exhibitionId: string,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage,
): void {
  const map = readExhibitionThemeMap(storage);
  delete map[exhibitionId];
  storage.setItem(KEYS.exhibitionThemeColor, JSON.stringify(map));
}

/**
 * 저장값 → Exhibition.themeColorName(시드) → fixture defaultThemeColor.
 * ex-edge 시연 기본은 시드의 Persian Indigo.
 */
export function themeColorNameForExhibition(
  exhibitionId: string,
  seedName?: string | null,
  storage?: Pick<Storage, "getItem">,
): string {
  const canRead =
    storage != null || (typeof localStorage !== "undefined" && localStorage != null);
  const map = canRead ? readExhibitionThemeMap(storage ?? localStorage) : {};
  const stored = map[exhibitionId];
  if (stored?.name && COLOR_BY_NAME[stored.name]) return stored.name;
  if (seedName && COLOR_BY_NAME[seedName]) return seedName;
  return leafletFixtures.defaultThemeColor;
}

export function storedThemeFromName(name: string): StoredThemeColor | null {
  const c = COLOR_BY_NAME[name];
  if (!c) return null;
  return { name: c.name, r: c.r, g: c.g, b: c.b, hex: c.hex };
}
