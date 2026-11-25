import { beforeEach, describe, expect, it } from "vitest";
import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import {
  clearExhibitionThemeColor,
  themeColorNameForExhibition,
  writeExhibitionThemeColor,
} from "@/lib/leaflet/exhibitionTheme";
import {
  createVisitLeaflet,
  recomputeLeafletNotes,
} from "@/lib/leaflet/createVisitLeaflet";
import { scenarioToVisit } from "@/lib/leaflet/fixtures";
import { KEYS } from "@/lib/storage";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => [...map.keys()][i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
}

describe("exhibitionTheme", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = memoryStorage();
  });

  it("저장 없으면 seed → default", () => {
    expect(themeColorNameForExhibition("ex-edge", "Persian Indigo", storage)).toBe(
      "Persian Indigo",
    );
    expect(themeColorNameForExhibition("ex-other", null, storage)).toBe("Persian Indigo");
  });

  it("KEYS.exhibitionThemeColor가 seed보다 우선", () => {
    writeExhibitionThemeColor("ex-edge", COLOR_BY_NAME.Wheat, storage);
    expect(themeColorNameForExhibition("ex-edge", "Persian Indigo", storage)).toBe("Wheat");
    clearExhibitionThemeColor("ex-edge", storage);
    expect(themeColorNameForExhibition("ex-edge", "Persian Indigo", storage)).toBe(
      "Persian Indigo",
    );
    expect(storage.getItem(KEYS.exhibitionThemeColor)).toBe("{}");
  });

  it("테마를 바꿔도 이미 만든 리플릿 themeColor는 그대로", () => {
    const indigo = createVisitLeaflet({
      visitId: "old-indigo",
      exhibitionId: "ex-edge",
      records: scenarioToVisit("wonder-immersive").records,
      scenarioId: "wonder-immersive",
      themeColor: "Persian Indigo",
      visitDate: "2026-11-20",
    });
    writeExhibitionThemeColor("ex-edge", COLOR_BY_NAME.Wheat, storage);
    const wheatName = themeColorNameForExhibition("ex-edge", "Persian Indigo", storage);
    const wheat = createVisitLeaflet({
      visitId: "new-wheat",
      exhibitionId: "ex-edge",
      records: scenarioToVisit("wonder-immersive").records,
      scenarioId: "wonder-immersive",
      themeColor: wheatName,
      visitDate: "2026-11-20",
    });
    expect(indigo.themeColor).toBe("Persian Indigo");
    expect(wheat.themeColor).toBe("Wheat");

    const afterNotes = recomputeLeafletNotes(indigo, { comment: "유지" });
    expect(afterNotes.themeColor).toBe("Persian Indigo");
  });
});
