/** 방문 기록 → Leaflet (V-08·V-10 재계산) */

import {
  buildLeafletResult,
  LeafletBlockedError,
} from "@/lib/leaflet/buildLeafletResult";
import type { HistoryEntry } from "@/lib/leaflet/cumulative";
import type { VisitRecord } from "@/lib/leaflet/dwell";
import {
  artworkLabelsFromFixtures,
  exhibitionFromFixtures,
  leafletFixtures,
  mockDbFromFixtures,
  type ScenarioId,
} from "@/lib/leaflet/fixtures";
import {
  DEFAULT_SCENARIO,
  isScenarioId,
} from "@/lib/leaflet/mockRecognition";
import type { EmotionId } from "@/lib/leaflet/emotions";
import { pickRepresentative } from "@/lib/leaflet/representative";
import type { Leaflet, LeafletPhoto } from "@/lib/types";

export { LeafletBlockedError };

function resolveScenario(scenarioId: string | null | undefined): ScenarioId {
  return isScenarioId(scenarioId) ? scenarioId : DEFAULT_SCENARIO;
}

export function createVisitLeaflet(input: {
  visitId: string;
  exhibitionId: string;
  records: VisitRecord[];
  photos?: LeafletPhoto[];
  scenarioId?: string | null;
  themeColor?: string;
  visitDate: string;
  history?: HistoryEntry[];
  myPhotoUrl?: string | null;
  comment?: string | null;
}): Leaflet {
  if (input.records.length === 0) {
    throw new LeafletBlockedError();
  }

  const scenarioId = resolveScenario(input.scenarioId);
  const sc = leafletFixtures.scenarios[scenarioId];
  const labels = artworkLabelsFromFixtures();
  const exhibition = {
    ...exhibitionFromFixtures(),
    id: input.exhibitionId,
    visitDate: input.visitDate,
  };

  const result = buildLeafletResult(
    {
      records: input.records,
      generateAtSec: sc.generateAtSec,
      dbRecommendationIds: sc.dbRecommendationIds,
      mockDb: mockDbFromFixtures(),
      userPhotoUrl: input.myPhotoUrl ?? null,
      otherVisitorsTop1: leafletFixtures.otherVisitorsTop1 as Partial<
        Record<EmotionId, number>
      >,
    },
    exhibition,
    labels,
    input.history ?? [],
  );

  return {
    id: input.visitId,
    kind: "visit",
    exhibitionId: input.exhibitionId,
    visitDate: input.visitDate,
    themeId: null,
    themeColor: input.themeColor ?? leafletFixtures.defaultThemeColor,
    photos: input.photos ?? [],
    recommendationArtworkIds: result.dbRecommendationIds,
    records: input.records,
    result,
    myPhotoUrl: input.myPhotoUrl ?? undefined,
    comment: input.comment?.trim() || undefined,
  };
}

/**
 * 내 사진·한줄평만 반영. 유형·ruleVersion·판정 필드는 유지하고
 * 대표 이미지(representative)만 다시 고른다.
 */
export function recomputeLeafletNotes(
  leaflet: Leaflet,
  patch: { myPhotoUrl?: string | null; comment?: string | null },
): Leaflet {
  const myPhotoUrl =
    patch.myPhotoUrl === undefined ? leaflet.myPhotoUrl : patch.myPhotoUrl ?? undefined;
  const commentRaw = patch.comment === undefined ? leaflet.comment : patch.comment;
  const comment = commentRaw?.trim() || undefined;

  if (!leaflet.result) {
    return { ...leaflet, myPhotoUrl, comment };
  }

  const similarId = leaflet.result.similar.artworkId;
  const imageByArtwork = exhibitionFromFixtures().imageByArtwork;
  const representative = pickRepresentative({
    userPhotoUrl: myPhotoUrl ?? null,
    similarArtworkId: similarId,
    similarArtworkImageUrl: imageByArtwork[similarId],
  });

  return {
    ...leaflet,
    myPhotoUrl,
    comment,
    result: {
      ...leaflet.result,
      representative,
    },
  };
}
