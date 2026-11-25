import { describe, expect, it } from "vitest";
import {
  filterSourceByContractEnd,
  isOnOrBeforeContractEnd,
} from "@/lib/leaflet/contractCutoff";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";

/** g-busan 모의 종료 시각 (전시 간조 endDate 2025-08-20 포함) */
const END = "2025-08-20T23:59:59.999Z";

describe("contract cutoff ISO ≤", () => {
  it("등호 포함: 종료 시각과 같으면 포함", () => {
    expect(isOnOrBeforeContractEnd(END, END)).toBe(true);
  });

  it("날짜만 있는 visitDate는 종료일 당일 포함", () => {
    expect(isOnOrBeforeContractEnd("2025-08-20", END)).toBe(true);
    expect(isOnOrBeforeContractEnd("2025-08-21", END)).toBe(false);
  });

  it("종료 이후 datetime은 제외", () => {
    expect(isOnOrBeforeContractEnd("2025-08-21T00:00:00.000Z", END)).toBe(false);
  });

  it("filterSourceByContractEnd가 리플릿·관심·문의·이벤트를 걸러낸다", () => {
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
          addedAt: "2025-08-20T12:00:00.000Z",
        },
        {
          artworkId: "a1",
          exhibitionId: "ex-tide",
          leafletId: "out",
          addedAt: "2025-09-01T00:00:00.000Z",
        },
      ],
      inquiries: [
        {
          id: "q1",
          leafletId: "in",
          exhibitionId: "ex-tide",
          createdAt: "2025-08-19T10:00:00.000Z",
        },
        {
          id: "q2",
          leafletId: "out",
          exhibitionId: "ex-tide",
          createdAt: "2025-08-21T01:00:00.000Z",
        },
      ],
      events: [
        {
          id: "e1",
          at: "2025-08-20T23:59:59.999Z",
          type: "interest_add",
          leafletId: "in",
          visitorKey: "v",
          identityKind: "anonymous",
        },
        {
          id: "e2",
          at: "2025-08-21T00:00:00.000Z",
          type: "interest_add",
          leafletId: "out",
          visitorKey: "v",
          identityKind: "anonymous",
        },
      ],
      zonesByArtwork: {},
    };

    const filtered = filterSourceByContractEnd(source, END);
    expect(filtered.leaflets.map((l) => l.id)).toEqual(["in"]);
    expect(filtered.interests.map((i) => i.leafletId)).toEqual(["in"]);
    expect(filtered.inquiries.map((q) => q.id)).toEqual(["q1"]);
    expect(filtered.events.map((e) => e.id)).toEqual(["e1"]);
  });
});
