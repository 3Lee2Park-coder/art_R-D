import { describe, expect, it } from "vitest";
import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import { textColorFor } from "@/lib/leaflet/contrast";
import { buildDemoLeaflet } from "@/lib/leaflet/demoLeaflets";

describe("step2 demo", () => {
  it("theme text colors", () => {
    const indigo = COLOR_BY_NAME["Persian Indigo"];
    const wheat = COLOR_BY_NAME["Wheat"];
    expect(textColorFor({ r: indigo.r, g: indigo.g, b: indigo.b }, "Persian Indigo")).toBe(
      "#FFFFFF",
    );
    expect(textColorFor({ r: wheat.r, g: wheat.g, b: wheat.b }, "Wheat")).toBe("#111111");
  });

  it("demo leaflets type names", () => {
    expect(buildDemoLeaflet("demo-wonder-immersive")?.result?.typeName).toBe("경이 몰입가");
    expect(buildDemoLeaflet("demo-bright-explorer")?.result?.typeName).toBe("설렘 탐험가");
    expect(buildDemoLeaflet("demo-bright-explorer")?.result?.similar.artworkId).toBe("aw-e12");
    expect(buildDemoLeaflet("demo-bright-explorer")?.result?.similar.reason).toContain("행복");
    expect(buildDemoLeaflet("demo-color-collector")?.result?.typeName).toBe("컬러 수집가");
    expect(buildDemoLeaflet("demo-walker")?.result?.typeName).toBe("오늘의 산책자");
    expect(buildDemoLeaflet("demo-empty")).toBeUndefined();
  });
});
