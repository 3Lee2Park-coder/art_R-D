import { describe, expect, it } from "vitest";
import {
  filterSourceByContractEnd,
  isOnOrBeforeContractEnd,
  toCutoffMillis,
} from "@/lib/leaflet/contractCutoff";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";

/** g-busan 모의 종료 시각 (전시 간조 endDate 2025-08-20 포함) */
const END = "2025-08-20T23:59:59.999Z";

describe("contract cutoff Asia/Seoul", () => {
  it("등호 포함: 종료 시각과 같으면 포함", () => {
    expect(isOnOrBeforeContractEnd(END, END)).toBe(true);
  });

  it("날짜만인 종료값: 당일 오후 포함, 다음날 제외", () => {
    const endDate = "2025-08-20";
    expect(isOnOrBeforeContractEnd("2025-08-20T14:00:00+09:00", endDate)).toBe(true);
    expect(isOnOrBeforeContractEnd("2025-08-20T23:59:59.999+09:00", endDate)).toBe(true);
    expect(isOnOrBeforeContractEnd("2025-08-21", endDate)).toBe(false);
    expect(isOnOrBeforeContractEnd("2025-08-21T00:00:00+09:00", endDate)).toBe(false);
  });

  it("날짜만인 기록은 그날 00:00 Seoul로 해석", () => {
    expect(toCutoffMillis("2025-08-20", "record")).toBe(
      Date.parse("2025-08-20T00:00:00.000+09:00"),
    );
    expect(toCutoffMillis("2025-08-20", "end")).toBe(
      Date.parse("2025-08-20T23:59:59.999+09:00"),
    );
  });

  it("종료 이후 datetime은 제외 (절대 시각 END)", () => {
    expect(isOnOrBeforeContractEnd("2025-08-21T00:00:00.000Z", END)).toBe(false);
  });

  it("filterSourceByContractEnd가 리플릿·관심·문의·이벤트를 걸러낸다", () => {
    const endDate = "2025-08-20";
    const source: ExhibitionReportSource = {
      exhibitionId: "ex-tide",
      exhibitionTitle: "간조",
      themeColorName: "기본",
      leaflets: [
        { id: "in", exhibitionId: "ex-tide", recordedAt: "2025-08-20" },
        { id: "out", exhibitionId: "ex-tide", recordedAt: "2025-08-21" },
      ],
      interests: [
        {
          artworkId: "a1",
          exhibitionId: "ex-tide",
          leafletId: "in",
          addedAt: "2025-08-20T14:00:00+09:00",
        },
        {
          artworkId: "a1",
          exhibitionId: "ex-tide",
          leafletId: "out",
          addedAt: "2025-08-21T00:00:00+09:00",
        },
      ],
      inquiries: [
        {
          id: "q1",
          leafletId: "in",
          exhibitionId: "ex-tide",
          createdAt: "2025-08-19T10:00:00+09:00",
        },
        {
          id: "q2",
          leafletId: "out",
          exhibitionId: "ex-tide",
          createdAt: "2025-08-21T01:00:00+09:00",
        },
      ],
      events: [
        {
          id: "e1",
          at: "2025-08-20T23:59:59.999+09:00",
          type: "interest_add",
          leafletId: "in",
          visitorKey: "v",
          identityKind: "anonymous",
        },
        {
          id: "e2",
          at: "2025-08-21T00:00:00.000+09:00",
          type: "interest_add",
          leafletId: "out",
          visitorKey: "v",
          identityKind: "anonymous",
        },
      ],
      zonesByArtwork: {},
    };

    const filtered = filterSourceByContractEnd(source, endDate);
    expect(filtered.leaflets.map((l) => l.id)).toEqual(["in"]);
    expect(filtered.interests.map((i) => i.leafletId)).toEqual(["in"]);
    expect(filtered.inquiries.map((q) => q.id)).toEqual(["q1"]);
    expect(filtered.events.map((e) => e.id)).toEqual(["e1"]);
  });
});
