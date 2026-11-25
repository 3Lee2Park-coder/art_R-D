import { describe, expect, it } from "vitest";
import {
  buildZonesAnalytics,
  resolveZonesForExhibition,
  zoneTransitionsFromLeaflets,
} from "@/lib/leaflet/analytics/zones";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import type { Artwork, ExhibitionZone } from "@/lib/types";

function art(
  partial: Partial<Artwork> & { id: string; zone: string | null },
): Artwork {
  return {
    title: partial.id,
    artistId: "ar",
    exhibitionId: "ex-a",
    imageUrl: "/",
    description: null,
    priceKrw: null,
    forSale: false,
    likeCount: 0,
    widthCm: null,
    ...partial,
  };
}

describe("zones analytics", () => {
  it("Artwork.zone 이름으로 구역 구성", () => {
    const zones = resolveZonesForExhibition(
      "ex-a",
      [],
      [art({ id: "a1", zone: "중앙홀" }), art({ id: "a2", zone: "우측" })],
    );
    expect(zones.map((z) => z.name).sort()).toEqual(["우측", "중앙홀"]);
  });

  it("참여 세션은 고유 리플릿 수", () => {
    const source: ExhibitionReportSource = {
      exhibitionId: "ex-a",
      exhibitionTitle: "A",
      themeColorName: "기본",
      leaflets: [
        {
          id: "L1",
          exhibitionId: "ex-a",
          records: [
            {
              artworkId: "a1",
              source: "camera",
              atSec: 0,
              movingSec: 0,
              emotionId: null,
            },
          ],
        },
        {
          id: "L2",
          exhibitionId: "ex-a",
          records: [
            {
              artworkId: "a1",
              source: "camera",
              atSec: 0,
              movingSec: 0,
              emotionId: null,
            },
            {
              artworkId: "a1",
              source: "camera",
              atSec: 10,
              movingSec: 0,
              emotionId: null,
            },
          ],
        },
      ],
      interests: [],
      inquiries: [],
      events: [],
      zonesByArtwork: { a1: "중앙홀" },
      artworkTitles: {},
    };
    const stored: ExhibitionZone[] = [
      {
        exhibitionId: "ex-a",
        zoneId: "z1",
        name: "중앙홀",
        wallLengthM: null,
      },
    ];
    const a = buildZonesAnalytics({
      source,
      zones: stored,
      artworks: [art({ id: "a1", zone: "중앙홀" })],
    });
    expect(a.rows[0]?.participatingSessions).toBe(2);
    expect(a.rows[0]?.recordCount).toBe(3);
  });

  it("A→B 전환, 같은 구역 연속은 0", () => {
    const transitions = zoneTransitionsFromLeaflets(
      [
        {
          id: "L1",
          exhibitionId: "ex-a",
          records: [
            {
              artworkId: "a1",
              source: "camera",
              atSec: 0,
              movingSec: 0,
              emotionId: null,
            },
            {
              artworkId: "a2",
              source: "camera",
              atSec: 20,
              movingSec: 0,
              emotionId: null,
            },
            {
              artworkId: "a3",
              source: "camera",
              atSec: 40,
              movingSec: 0,
              emotionId: null,
            },
          ],
        },
      ],
      "ex-a",
      { a1: "A", a2: "A", a3: "B" },
    );
    expect(transitions).toEqual([
      expect.objectContaining({ route: "A → B", count: 1 }),
    ]);
  });

  it("widthCm·wallLengthM 하나라도 없으면 점유율 추정 불가", () => {
    const source: ExhibitionReportSource = {
      exhibitionId: "ex-a",
      exhibitionTitle: "A",
      themeColorName: "기본",
      leaflets: [],
      interests: [],
      inquiries: [],
      events: [],
      zonesByArtwork: { a1: "중앙홀", a2: "중앙홀" },
      artworkTitles: {},
    };
    const zones: ExhibitionZone[] = [
      {
        exhibitionId: "ex-a",
        zoneId: "z1",
        name: "중앙홀",
        wallLengthM: 10,
      },
    ];
    const a = buildZonesAnalytics({
      source,
      zones,
      artworks: [
        art({ id: "a1", zone: "중앙홀", widthCm: 100 }),
        art({ id: "a2", zone: "중앙홀", widthCm: null }),
      ],
    });
    expect(a.rows[0]?.occupancyPct).toBeNull();
    expect(a.rows[0]?.occupiedWidthM).toBeNull();
  });
});
