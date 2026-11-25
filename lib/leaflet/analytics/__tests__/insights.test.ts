import { describe, expect, it } from "vitest";
import { buildInsightsAnalytics } from "@/lib/leaflet/analytics/insights";
import type { InterestsAnalytics } from "@/lib/leaflet/analytics/interests";
import type { ZonesAnalytics } from "@/lib/leaflet/analytics/zones";

const emptyInterests: InterestsAnalytics = {
  exhibitionId: "ex-a",
  exhibitionTitle: "A",
  totalRecords: 10,
  totalInterests: 2,
  totalInquiries: 1,
  overallRecordToInterestRate: 20,
  artworkRows: [],
  similarRows: [],
  recommendationRows: [],
};

const emptyZones: ZonesAnalytics = {
  exhibitionId: "ex-a",
  empty: true,
  rows: [],
  transitions: [],
};

describe("insights analytics", () => {
  it("목표 null이면 달성률 추정 불가", () => {
    const a = buildInsightsAnalytics({
      goals: {
        exhibitionId: "ex-a",
        objectives: ["관람객 참여 확대"],
        targets: { records: null, interests: 20, inquiries: null },
      },
      interests: emptyInterests,
      zones: emptyZones,
    });
    expect(a.goalRows.find((g) => g.label === "작품 기록")?.achievementPct).toBeNull();
    expect(a.goalRows.find((g) => g.label === "관심 등록")?.achievementPct).toBe(
      10,
    );
    expect(a.goalRows.find((g) => g.label === "작품 문의")?.achievementPct).toBeNull();
  });

  it("근거 0이면 카드 없음", () => {
    const a = buildInsightsAnalytics({
      goals: null,
      interests: emptyInterests,
      zones: emptyZones,
    });
    expect(a.cards).toEqual([]);
  });

  it("전환 근거가 있으면 관람 흐름 카드", () => {
    const a = buildInsightsAnalytics({
      goals: null,
      interests: emptyInterests,
      zones: {
        exhibitionId: "ex-a",
        empty: false,
        rows: [],
        transitions: [
          {
            from: "A",
            to: "B",
            route: "A → B",
            count: 3,
            sharePct: 100,
          },
        ],
      },
    });
    expect(a.cards.some((c) => c.tag === "관람 흐름 검토")).toBe(true);
  });
});
