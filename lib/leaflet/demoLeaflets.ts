/** 시연 리플릿 4개 + demo-visit — findLeaflet에서 즉석 계산 (JSON 저장 없음) */

import { buildLeafletResult } from "@/lib/leaflet/buildLeafletResult";
import {
  artworkLabelsFromFixtures,
  exhibitionFromFixtures,
  leafletFixtures,
  memberHistoryFromFixtures,
  scenarioToVisit,
  type ScenarioId,
} from "@/lib/leaflet/fixtures";
import type { Leaflet } from "@/lib/types";

export const DEMO_LEAFLET_SCENARIOS: Record<string, ScenarioId> = {
  "demo-wonder-immersive": "wonder-immersive",
  "demo-bright-explorer": "bright-explorer",
  "demo-color-collector": "color-collector",
  "demo-walker": "walker",
  /** [가안] demo-visit 기본 = 시나리오 A */
  "demo-visit": "wonder-immersive",
};

export const DEMO_LEAFLET_IDS = Object.keys(DEMO_LEAFLET_SCENARIOS);

export function isDemoLeafletId(id: string): boolean {
  return id.startsWith("demo-") && id !== "demo-empty";
}

export function buildDemoLeaflet(id: string): Leaflet | undefined {
  const scenarioId = DEMO_LEAFLET_SCENARIOS[id];
  if (!scenarioId) return undefined;

  const visit = scenarioToVisit(scenarioId);
  const exhibition = exhibitionFromFixtures();
  const labels = artworkLabelsFromFixtures();
  const history = memberHistoryFromFixtures();
  const result = buildLeafletResult(visit, exhibition, labels, history);

  return {
    id,
    kind: "visit",
    exhibitionId: leafletFixtures.exhibitionId,
    visitDate: exhibition.visitDate ?? "2026-11-20",
    themeId: null,
    themeColor: leafletFixtures.defaultThemeColor,
    photos: [],
    recommendationArtworkIds: result.dbRecommendationIds,
    records: visit.records,
    result,
  };
}

/** mockDb 작품 표시용 (카드 5 추천) */
export function mockDbWork(id: string): {
  id: string;
  title: string;
  artistName: string;
} | null {
  const entry = (
    leafletFixtures.mockDb as Record<
      string,
      { title?: string; artistName?: string }
    >
  )[id];
  if (!entry) return null;
  return {
    id,
    title: entry.title ?? id,
    artistName: entry.artistName ?? "",
  };
}
