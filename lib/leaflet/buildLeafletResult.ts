/** 리플릿 계산 진입점 (visit → LeafletResult) */

import {
  comparisonLine,
  visitorCount,
  wordBlocks,
  type ComparisonResult,
  type WordBlock,
} from "@/lib/leaflet/comparison";
import type { CumulativeResult, HistoryEntry } from "@/lib/leaflet/cumulative";
import { computeCumulative } from "@/lib/leaflet/cumulative";
import {
  dwellSeconds,
  mergeConsecutiveCamera,
  uniqueArtworkIdsAll,
  uniqueCameraArtworkIds,
  uniqueCameraZones,
  type VisitRecord,
} from "@/lib/leaflet/dwell";
import type { EmotionId, MoodId } from "@/lib/leaflet/emotions";
import { computeMood } from "@/lib/leaflet/mood";
import { computePalette, type TopColor } from "@/lib/leaflet/palette";
import {
  hasColorOverlap,
  hasEmotionOverlap,
  similarReason,
} from "@/lib/leaflet/reason";
import {
  cosine,
  mockRecommender,
  nearestInExhibition,
  to80Vector,
  visitVectorFromRecords,
  type VectorLabel,
} from "@/lib/leaflet/recommender";
import {
  pickRepresentative,
  type RepresentativeResult,
} from "@/lib/leaflet/representative";
import {
  judgeStyle,
  STYLE_RULE_VERSION,
  type StyleId,
  type StyleMet,
} from "@/lib/leaflet/style";
import { oneLinerFor, resolveTypeName, type TypeName } from "@/lib/leaflet/typeTable";

export type ArtworkLabel = VectorLabel & { zone?: string };

export type ExhibitionInput = {
  id: string;
  totalArtworks: number;
  totalZones: number;
  /** artworkId → zone */
  zonesByArtwork: Record<string, string | null | undefined>;
  /** artworkId → imageUrl */
  imageByArtwork: Record<string, string | null | undefined>;
  visitDate?: string;
};

export type VisitInput = {
  records: VisitRecord[];
  generateAtSec: number;
  dbRecommendationIds?: string[];
  /** [가안, 모의] RestArt DB 작품 라벨 */
  mockDb?: Record<string, VectorLabel>;
  userPhotoUrl?: string | null;
  otherVisitorsTop1: Partial<Record<EmotionId, number>>;
};

export type LeafletResult = {
  ruleVersion: string;
  style: StyleId;
  walkerReason?: "no_condition";
  mood: MoodId;
  typeName: TypeName;
  oneLiner: string;
  top1EmotionId: EmotionId;
  emotionCounts: Record<EmotionId, number>;
  topColors: TopColor[];
  top1Color: string | null;
  similar: {
    artworkId: string;
    recorded: boolean;
    reason: string;
    score: number;
  };
  dbRecommendationIds: string[];
  comparison: ComparisonResult & {
    visitorCount: number;
    wordBlocks: WordBlock[];
  };
  cumulative: CumulativeResult;
  representative: RepresentativeResult;
  stats: { records: number; minutes: number };
  met: StyleMet;
  dwellSecs: number[];
};

export class LeafletBlockedError extends Error {
  readonly blocked = true as const;
  constructor(message = "LEAFLET_BLOCKED: no records") {
    super(message);
    this.name = "LeafletBlockedError";
  }
}

export function buildLeafletResult(
  visit: VisitInput,
  exhibition: ExhibitionInput,
  labels: Record<string, ArtworkLabel | undefined>,
  history: HistoryEntry[] = [],
): LeafletResult {
  if (visit.records.length === 0) {
    throw new LeafletBlockedError();
  }

  const merged = mergeConsecutiveCamera(visit.records);
  const dwellSecs = dwellSeconds(merged, visit.generateAtSec);
  const uniqueCams = uniqueCameraArtworkIds(visit.records);
  const zones = uniqueCameraZones(visit.records, exhibition.zonesByArtwork);

  const judged = judgeStyle({
    uniqueCameraArtworks: uniqueCams.length,
    totalArtworks: exhibition.totalArtworks,
    uniqueCameraZones: zones.length,
    totalZones: exhibition.totalZones,
    dwellSecs,
  });

  const moodResult = computeMood(
    visit.records,
    Object.fromEntries(
      Object.entries(labels).map(([id, lab]) => [id, lab?.emotions]),
    ),
  );

  const palette = computePalette(
    visit.records,
    Object.fromEntries(
      Object.entries(labels).map(([id, lab]) => [id, lab?.colors]),
    ),
  );

  const typeName = resolveTypeName(moodResult.moodId, judged.style);
  const oneLiner = oneLinerFor(typeName);

  const exhibitionWorks: Record<string, VectorLabel> = {};
  for (const [id, lab] of Object.entries(labels)) {
    if (lab) exhibitionWorks[id] = { emotions: lab.emotions, colors: lab.colors };
  }

  const mockDb = visit.mockDb ?? {};
  const visitVec = visitVectorFromRecords(uniqueCams, labels);
  const dbIds = mockRecommender.recommend({
    visitVector: visitVec,
    mockDb,
    scenarioDbIds: visit.dbRecommendationIds,
  });

  let similarArtworkId = "";
  let similarScore = 0;
  const primaryDbId = dbIds[0];
  const primaryDb = primaryDbId ? mockDb[primaryDbId] : undefined;
  if (primaryDb) {
    const nearest = nearestInExhibition(primaryDb, exhibitionWorks);
    if (nearest) {
      similarArtworkId = nearest.artworkId;
      similarScore = nearest.score;
    }
  } else {
    let bestId = "";
    let best = -1;
    for (const [id, lab] of Object.entries(exhibitionWorks)) {
      const s = cosine(visitVec, to80Vector(lab));
      if (s > best || (s === best && id < bestId)) {
        best = s;
        bestId = id;
      }
    }
    similarArtworkId = bestId;
    similarScore = best;
  }

  const recordedIds = new Set(visit.records.map((r) => r.artworkId));
  const recorded = recordedIds.has(similarArtworkId);
  const simLab = labels[similarArtworkId];

  const emotionOverlap = simLab
    ? hasEmotionOverlap(moodResult.top1EmotionId, simLab.emotions)
    : false;
  const colorOverlap = simLab
    ? hasColorOverlap(palette.top1Color, simLab.colors)
    : false;
  const colorPercentInArtwork = palette.top1Color
    ? Math.round((simLab?.colors[palette.top1Color] ?? 0) * 100)
    : 0;

  let longestDwell = false;
  if (merged.length > 0) {
    let maxD = -1;
    let maxId = "";
    merged.forEach((m, i) => {
      if (dwellSecs[i] > maxD) {
        maxD = dwellSecs[i];
        maxId = m.artworkId;
      }
    });
    longestDwell = maxId === similarArtworkId;
  }

  const reason = similarReason({
    style: judged.style,
    top1EmotionId: moodResult.top1EmotionId,
    top1Color: palette.top1Color,
    similarArtworkId,
    recorded,
    emotionOverlap,
    colorOverlap,
    colorPercentInArtwork,
    longestDwell,
  });

  const comparison = comparisonLine(
    moodResult.top1EmotionId,
    visit.otherVisitorsTop1,
  );

  const visitDate = exhibition.visitDate ?? "2099-01-01";
  const cumulative = computeCumulative(history, {
    exhibitionId: exhibition.id,
    visitDate,
    top1EmotionId: moodResult.top1EmotionId,
    top1Color: palette.top1Color,
  });

  const representative = pickRepresentative({
    userPhotoUrl: visit.userPhotoUrl,
    similarArtworkId,
    similarArtworkImageUrl: exhibition.imageByArtwork[similarArtworkId],
  });

  const firstAt = Math.min(...visit.records.map((r) => r.atSec));
  const minutes = Math.max(
    1,
    Math.round((visit.generateAtSec - firstAt) / 60),
  );

  return {
    ruleVersion: STYLE_RULE_VERSION,
    style: judged.style,
    walkerReason: judged.walkerReason,
    mood: moodResult.moodId,
    typeName,
    oneLiner,
    top1EmotionId: moodResult.top1EmotionId,
    emotionCounts: moodResult.emotionCounts,
    topColors: palette.topColors,
    top1Color: palette.top1Color,
    similar: {
      artworkId: similarArtworkId,
      recorded,
      reason,
      score: similarScore,
    },
    dbRecommendationIds: dbIds,
    comparison: {
      ...comparison,
      visitorCount: visitorCount(visit.otherVisitorsTop1),
      wordBlocks: wordBlocks(moodResult.top1EmotionId, visit.otherVisitorsTop1),
    },
    cumulative,
    representative,
    stats: {
      records: uniqueArtworkIdsAll(visit.records).length,
      minutes,
    },
    met: judged.met,
    dwellSecs,
  };
}

