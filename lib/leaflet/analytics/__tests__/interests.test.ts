import { describe, expect, it } from "vitest";
import {
  buildInterestsAnalytics,
  buildRecommendationHistoryRows,
  interestsArtworkCsvRows,
  recommendationHistoryCsvRows,
} from "@/lib/leaflet/analytics/interests";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import { toCsv } from "@/lib/studio/exportCsv";

function source(partial: Partial<ExhibitionReportSource>): ExhibitionReportSource {
  return {
    exhibitionId: "ex-a",
    exhibitionTitle: "전시A",
    themeColorName: "기본",
    leaflets: [],
    interests: [],
    inquiries: [],
    events: [],
    zonesByArtwork: {},
    artworkTitles: { "aw-1": "작품1", "aw-rec": "추천작", "aw-sim": "닮은작" },
    ...partial,
  };
}

describe("interests analytics", () => {
  it("기록 0이면 비율 데이터 부족(null)", () => {
    const a = buildInterestsAnalytics(
      source({
        interests: [
          {
            artworkId: "aw-1",
            exhibitionId: "ex-a",
            leafletId: "L1",
            addedAt: "2026-01-01",
          },
        ],
        leaflets: [{ id: "L1", exhibitionId: "ex-a", records: [] }],
      }),
    );
    const row = a.artworkRows.find((r) => r.artworkId === "aw-1");
    expect(row?.recordCount).toBe(0);
    expect(row?.recordToInterestRate).toBeNull();
    expect(a.overallRecordToInterestRate).toBeNull();
  });

  it("추천과 가장 닮은 작품을 같은 ID여도 따로 셈", () => {
    const a = buildInterestsAnalytics(
      source({
        leaflets: [
          {
            id: "L1",
            exhibitionId: "ex-a",
            recommendationArtworkIds: ["aw-x"],
            result: { similar: { artworkId: "aw-x" } },
            records: [],
          },
        ],
        artworkTitles: { "aw-x": "동일ID" },
      }),
    );
    expect(a.similarRows.find((r) => r.artworkId === "aw-x")?.exposureCount).toBe(
      1,
    );
    expect(
      a.recommendationRows.find((r) => r.artworkId === "aw-x")?.exposureCount,
    ).toBe(1);
  });

  it("CSV에 kind로 분리하고 BOM", () => {
    const src = source({
      leaflets: [
        {
          id: "L1",
          exhibitionId: "ex-a",
          recommendationArtworkIds: ["aw-rec"],
          result: { similar: { artworkId: "aw-sim" } },
          recordedAt: "2026-01-02",
        },
      ],
    });
    const hist = buildRecommendationHistoryRows(src);
    expect(hist.some((r) => r.kind === "recommendation")).toBe(true);
    expect(hist.some((r) => r.kind === "similar")).toBe(true);
    expect(hist.every((r) => r.kind !== undefined)).toBe(true);
    const csv = toCsv(recommendationHistoryCsvRows(hist));
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("recommendation");
    expect(csv).toContain("similar");

    const artCsv = toCsv(
      interestsArtworkCsvRows(
        buildInterestsAnalytics(
          source({
            leaflets: [
              {
                id: "L1",
                exhibitionId: "ex-a",
                records: [
                  {
                    artworkId: "aw-1",
                    source: "camera",
                    atSec: 0,
                    movingSec: 0,
                    emotionId: null,
                  },
                ],
              },
            ],
          }),
        ),
      ),
    );
    expect(artCsv.startsWith("\uFEFF")).toBe(true);
  });
});
