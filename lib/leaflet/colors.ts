/** RestArt 65색 (docs/leaflet/restart_colors.csv 순서) */

export type RestartColor = {
  name: string;
  r: number;
  g: number;
  b: number;
  hex: string;
  /** max(R,G,B) − min(R,G,B) ≤ 10 [가안] */
  achromatic: boolean;
};

function toHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0").toUpperCase())
      .join("")
  );
}

function isAchromatic(r: number, g: number, b: number): boolean {
  return Math.max(r, g, b) - Math.min(r, g, b) <= 10;
}

function color(name: string, r: number, g: number, b: number): RestartColor {
  return {
    name,
    r,
    g,
    b,
    hex: toHex(r, g, b),
    achromatic: isAchromatic(r, g, b),
  };
}

/** CSV 순서 그대로 */
export const RESTART_COLORS: readonly RestartColor[] = [
  color("Cinnabar", 231, 47, 39),
  color("Black", 38, 38, 38),
  color("Matterhorn", 86, 86, 86),
  color("Nobel", 152, 152, 152),
  color("Very Light Grey", 206, 206, 206),
  color("White Smoke", 244, 244, 244),
  color("Paris Daisy", 255, 228, 15),
  color("Corn Field", 249, 239, 189),
  color("Bahia", 170, 198, 27),
  color("Kournikova", 255, 203, 88),
  color("Gossip", 146, 198, 131),
  color("Tangerine Yellow", 255, 200, 8),
  color("Pumpkin", 238, 113, 25),
  color("Harvest Gold", 241, 176, 102),
  color("Persian Indigo", 46, 20, 141),
  color("Cobalt", 3, 86, 155),
  color("Dark Pastel Green", 19, 166, 50),
  color("Shamrock Green", 4, 148, 87),
  color("Salem", 6, 134, 84),
  color("Wistful", 170, 165, 199),
  color("Eastern Blue", 1, 134, 141),
  color("Brandy Rose", 171, 131, 115),
  color("Granite Green", 148, 133, 105),
  color("Manz", 219, 220, 93),
  color("Wild Willow", 162, 179, 36),
  color("Cioccolato", 79, 46, 43),
  color("Cerulean", 6, 113, 148),
  color("Chelsea Cucumber", 88, 171, 45),
  color("Fun Green", 24, 89, 63),
  color("Deep Teal", 27, 86, 49),
  color("Deep Bronze", 75, 63, 45),
  color("Timber Green", 44, 60, 49),
  color("Palm Green", 31, 56, 45),
  color("Tiber", 25, 62, 63),
  color("Metallic Copper", 85, 55, 43),
  color("Tamarillo", 116, 47, 50),
  color("Apple Blossom", 175, 92, 87),
  color("Surfie Green", 3, 130, 122),
  color("Feldspar", 211, 142, 110),
  color("Vesuvius", 167, 100, 67),
  color("Blue Lagoon", 8, 87, 107),
  color("Tonys Pink", 231, 108, 86),
  color("Wafer", 213, 182, 166),
  color("Camarone", 20, 114, 48),
  color("Vida Loca", 88, 126, 61),
  color("Green House", 54, 88, 48),
  color("Granny Smith", 130, 154, 145),
  color("Wheat", 245, 223, 181),
  color("Pale Rose", 236, 217, 202),
  color("Oyster Pink", 218, 176, 176),
  color("Opal", 184, 190, 189),
  color("London Hue", 178, 137, 166),
  color("Lemon Ginger", 156, 137, 37),
  color("Guardsman Red", 172, 36, 48),
  color("Mandy", 204, 63, 92),
  color("Costa Del Sol", 160, 147, 131),
  color("Chetwode Blue", 92, 104, 163),
  color("Aqua Squeeze", 221, 232, 207),
  color("Siam", 109, 116, 73),
  color("Sprout", 179, 202, 157),
  color("Oxley", 122, 165, 123),
  color("Seagull", 122, 184, 204),
  color("Gulf Stream", 117, 173, 169),
  color("Heather", 165, 184, 199),
  color("Hawkes Blue", 203, 215, 232),
] as const;

export const COLOR_NAMES: readonly string[] = RESTART_COLORS.map((c) => c.name);

export const COLOR_BY_NAME: Readonly<Record<string, RestartColor>> = Object.fromEntries(
  RESTART_COLORS.map((c) => [c.name, c]),
);

export const ACHROMATIC_NAMES = new Set(
  RESTART_COLORS.filter((c) => c.achromatic).map((c) => c.name),
);
