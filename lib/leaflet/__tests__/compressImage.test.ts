import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("꾸미기 저장 · localStorage 할당량", () => {
  it("PhotoPickField가 compressImageFile을 쓴다", () => {
    const src = readFileSync(join(process.cwd(), "components/leaflet/PhotoPickField.tsx"), "utf8");
    expect(src).toContain("compressImageFile");
  });

  it("writeSavedLeaflets가 QuotaExceededError를 다룬다", () => {
    const src = readFileSync(join(process.cwd(), "lib/storage.ts"), "utf8");
    expect(src).toContain("QuotaExceededError");
    expect(src).toContain("myPhotoUrl");
  });
});
