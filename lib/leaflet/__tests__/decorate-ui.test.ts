import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

describe("V-09 꾸미기 UI 계약", () => {
  const cards = readFileSync(
    join(process.cwd(), "components/leaflet/LeafletCards.tsx"),
    "utf8",
  );

  it("내 사진·한줄평 남기기 notes 링크가 없다", () => {
    expect(cards).not.toContain("내 사진·한줄평 남기기");
    expect(cards).not.toContain("/notes");
    expect(cards).not.toContain("showNotesLink");
  });

  it("꾸미기 필과 DecorateSheet를 쓴다", () => {
    expect(cards).toContain("꾸미기");
    expect(cards).toContain("data-decorate-pill");
    expect(cards).toContain("DecorateSheet");
  });
});
