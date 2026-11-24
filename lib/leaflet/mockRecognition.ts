/** [기술 확인] 작품 인식·이동 감지 모의 */

import { artworksInExhibition } from "@/lib/data";
import {
  leafletFixtures,
  type ScenarioId,
} from "@/lib/leaflet/fixtures";

export type { ScenarioId };

export type MockRecognition = {
  artworkId: string;
  atSec: number;
  movingSec: number;
};

const SCENARIO_IDS: ScenarioId[] = [
  "wonder-immersive",
  "bright-explorer",
  "color-collector",
  "walker",
];

export function isScenarioId(value: string | null | undefined): value is ScenarioId {
  return Boolean(value && SCENARIO_IDS.includes(value as ScenarioId));
}

/** 기본 시나리오 [가안] */
export const DEFAULT_SCENARIO: ScenarioId = "wonder-immersive";

/**
 * 시나리오 카메라 기록 순서로 인식 결과를 돌려준다.
 * cameraIndex가 시나리오보다 길면 남은 작품을 데이터 순서로 붙이고 유효 30초·이동 0 [가안].
 */
export function mockRecognize(scenarioId: ScenarioId, cameraIndex: number): MockRecognition {
  const sc = leafletFixtures.scenarios[scenarioId];
  const cams = sc.records.filter((r) => r.source === "camera");
  if (cameraIndex >= 0 && cameraIndex < cams.length) {
    const row = cams[cameraIndex];
    return {
      artworkId: row.artworkId,
      atSec: row.atSec,
      movingSec: row.movingSec,
    };
  }
  const exhibitionId = leafletFixtures.exhibitionId;
  const works = artworksInExhibition(exhibitionId).filter((a) => a.zone);
  const used = new Set(cams.map((c) => c.artworkId));
  const rest = works.filter((w) => !used.has(w.id));
  const extra = cameraIndex - cams.length;
  const pick = rest[extra] ?? works[extra % Math.max(works.length, 1)];
  const lastAt = cams.length ? cams[cams.length - 1].atSec + 30 : 0;
  return {
    artworkId: pick?.id ?? "aw-plane",
    atSec: lastAt + extra * 30,
    movingSec: 0,
  };
}
