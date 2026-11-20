import { describe, expect, it } from "vitest";
import { RESTART_COLORS } from "@/lib/leaflet/colors";
import {
  auxiliaryContrast,
  contrastRatio,
  hexToRgb,
  textColorFor,
} from "@/lib/leaflet/contrast";

describe("대비 (LEAFLET_SPEC 7-3)", () => {
  it("65색 전부 본문 글자 대비 ≥ 4.5", () => {
    for (const c of RESTART_COLORS) {
      const bg = { r: c.r, g: c.g, b: c.b };
      const text = textColorFor(bg, c.name);
      const ratio = contrastRatio(hexToRgb(text), bg);
      expect(ratio, `${c.name} text=${text}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("Persian Indigo → #FFFFFF, Wheat → #111111", () => {
    const pi = RESTART_COLORS.find((c) => c.name === "Persian Indigo")!;
    const wheat = RESTART_COLORS.find((c) => c.name === "Wheat")!;
    expect(textColorFor({ r: pi.r, g: pi.g, b: pi.b }, pi.name)).toBe(
      "#FFFFFF",
    );
    expect(
      textColorFor({ r: wheat.r, g: wheat.g, b: wheat.b }, wheat.name),
    ).toBe("#111111");
  });

  it("Cinnabar·Eastern Blue → #000000 [결정]", () => {
    const cin = RESTART_COLORS.find((c) => c.name === "Cinnabar")!;
    const eb = RESTART_COLORS.find((c) => c.name === "Eastern Blue")!;
    expect(textColorFor({ r: cin.r, g: cin.g, b: cin.b }, cin.name)).toBe(
      "#000000",
    );
    expect(textColorFor({ r: eb.r, g: eb.g, b: eb.b }, eb.name)).toBe(
      "#000000",
    );
  });
});

describe("70% 보조 글자 대비 출력 [가안]", () => {
  it("4.5 미만인 테마 색 목록을 console로 출력 (단언 없음)", () => {
    const below: { name: string; text: string; aux: number }[] = [];
    for (const c of RESTART_COLORS) {
      const bg = { r: c.r, g: c.g, b: c.b };
      const text = textColorFor(bg, c.name);
      const aux = auxiliaryContrast(bg, text);
      if (aux < 4.5) below.push({ name: c.name, text, aux: Number(aux.toFixed(2)) });
    }
    console.log("\n[보조 글자 70% 대비 < 4.5]");
    console.table(below);
  });
});
