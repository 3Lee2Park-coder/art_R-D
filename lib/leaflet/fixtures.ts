/** data/leaflet-fixtures.json → visit 입력 */

import fixturesJson from "@/data/leaflet-fixtures.json";
import type { EmotionId } from "@/lib/leaflet/emotions";
import type {
  ArtworkLabel,
  ExhibitionInput,
  VisitInput,
} from "@/lib/leaflet/buildLeafletResult";
import type { HistoryEntry } from "@/lib/leaflet/cumulative";
import type { VisitRecord } from "@/lib/leaflet/dwell";
import type { VectorLabel } from "@/lib/leaflet/recommender";
import { artworkSeed } from "@/lib/data";

export type ScenarioId =
  | "wonder-immersive"
  | "bright-explorer"
  | "color-collector"
  | "walker";

type FixtureFile = typeof fixturesJson;

export const leafletFixtures = fixturesJson as FixtureFile;

export function artworkLabelsFromFixtures(): Record<string, ArtworkLabel> {
  const out: Record<string, ArtworkLabel> = {};
  for (const [id, lab] of Object.entries(leafletFixtures.artworkLabels)) {
    out[id] = {
      zone: lab.zone,
      emotions: lab.emotions as ArtworkLabel["emotions"],
      colors: lab.colors,
    };
  }
  return out;
}

export function mockDbFromFixtures(): Record<string, VectorLabel> {
  const out: Record<string, VectorLabel> = {};
  for (const [id, lab] of Object.entries(leafletFixtures.mockDb)) {
    out[id] = {
      emotions: lab.emotions as VectorLabel["emotions"],
      colors: lab.colors,
    };
  }
  return out;
}

export function exhibitionFromFixtures(): ExhibitionInput {
  const labels = artworkLabelsFromFixtures();
  const zoneSet = new Set(leafletFixtures.zones);
  const artworks = artworkSeed.filter(
    (a) => a.exhibitionId === leafletFixtures.exhibitionId,
  );
  const zonesByArtwork: Record<string, string | null | undefined> = {};
  const imageByArtwork: Record<string, string | null | undefined> = {};
  for (const a of artworks) {
    zonesByArtwork[a.id] = a.zone;
    imageByArtwork[a.id] = a.imageUrl;
  }
  for (const [id, lab] of Object.entries(labels)) {
    if (!(id in zonesByArtwork)) zonesByArtwork[id] = lab.zone ?? null;
  }
  return {
    id: leafletFixtures.exhibitionId,
    totalArtworks: Object.keys(labels).length,
    totalZones: zoneSet.size,
    zonesByArtwork,
    imageByArtwork,
    visitDate: "2026-11-20",
  };
}

export function scenarioToVisit(scenarioId: ScenarioId): VisitInput {
  const sc = leafletFixtures.scenarios[scenarioId];
  const records: VisitRecord[] = sc.records.map((r) => ({
    artworkId: r.artworkId,
    atSec: r.atSec,
    movingSec: r.movingSec,
    emotionId: r.emotionId,
    source: r.source as "camera" | "map",
  }));
  return {
    records,
    generateAtSec: sc.generateAtSec,
    dbRecommendationIds: sc.dbRecommendationIds,
    mockDb: mockDbFromFixtures(),
    otherVisitorsTop1: leafletFixtures.otherVisitorsTop1 as Partial<
      Record<EmotionId, number>
    >,
  };
}

export function memberHistoryFromFixtures(): HistoryEntry[] {
  return leafletFixtures.memberHistory.map((h) => ({
    leafletId: h.leafletId,
    exhibitionId: h.exhibitionId,
    visitDate: h.visitDate,
    top1EmotionId: h.top1EmotionId as EmotionId,
    top1Color: h.top1Color,
  }));
}
