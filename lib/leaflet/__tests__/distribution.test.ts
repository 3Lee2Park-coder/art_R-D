/**
 * 모의 전시 관람객 1,000명 분포 출력 (단언 없음, 규칙 변경 없음).
 *
 * 가정 모델 [가안]:
 * - 시드 고정(42) Mulberry32 난수.
 * - 촬영 수: 1~10장, P(n) ∝ 1/n (짧은 관람 쪽 가중).
 * - 촬영 간격: 평균 45초 지수분포(클램프 10~200초).
 * - 이동 비율: 간격의 10%~60%를 movingSec로.
 * - 감성: 15감성 균등 선택(각 1/15).
 * - 구역·작품: 12점 4구역 균등 샘플, 연속 동일 작품 확률 8%.
 * - map 기록: 넣지 않음(이 분포는 camera만).
 * - 전시 규모: 작품 12 / 구역 4 (ex-edge와 동일 필요 수).
 */
import { describe, it } from "vitest";
import { EMOTION_ORDER } from "@/lib/leaflet/emotions";
import { MOOD_BY_ID } from "@/lib/leaflet/emotions";
import {
  dwellSeconds,
  mergeConsecutiveCamera,
  uniqueCameraArtworkIds,
  uniqueCameraZones,
  type VisitRecord,
} from "@/lib/leaflet/dwell";
import { computeMood } from "@/lib/leaflet/mood";
import { judgeStyle } from "@/lib/leaflet/style";
import { resolveTypeName } from "@/lib/leaflet/typeTable";

const ARTWORKS = [
  { id: "aw-plane", zone: "입구" },
  { id: "aw-edge", zone: "입구" },
  { id: "aw-e06", zone: "입구" },
  { id: "aw-window", zone: "창가" },
  { id: "aw-e07", zone: "창가" },
  { id: "aw-e08", zone: "창가" },
  { id: "aw-navy", zone: "중앙홀" },
  { id: "aw-fold", zone: "중앙홀" },
  { id: "aw-e09", zone: "중앙홀" },
  { id: "aw-e10", zone: "복도" },
  { id: "aw-e11", zone: "복도" },
  { id: "aw-e12", zone: "복도" },
];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickShotCount(rand: () => number): number {
  const weights = Array.from({ length: 10 }, (_, i) => 1 / (i + 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  let x = rand() * sum;
  for (let i = 0; i < weights.length; i++) {
    x -= weights[i];
    if (x <= 0) return i + 1;
  }
  return 10;
}

function simulateVisitor(rand: () => number): VisitRecord[] {
  const n = pickShotCount(rand);
  const records: VisitRecord[] = [];
  let t = 0;
  let lastId: string | null = null;
  for (let i = 0; i < n; i++) {
    let art = ARTWORKS[Math.floor(rand() * ARTWORKS.length)];
    if (lastId && rand() < 0.08) {
      art = ARTWORKS.find((a) => a.id === lastId) ?? art;
    }
    const gap = Math.min(200, Math.max(10, Math.round(-Math.log(1 - rand()) * 45)));
    if (i > 0) t += gap;
    const moving = Math.round(gap * (0.1 + rand() * 0.5));
    records.push({
      artworkId: art.id,
      atSec: t,
      movingSec: i === n - 1 ? 0 : moving,
      emotionId: EMOTION_ORDER[Math.floor(rand() * EMOTION_ORDER.length)],
      source: "camera",
    });
    lastId = art.id;
  }
  return records;
}

describe("분포 출력 (규칙 변경 없음)", () => {
  it("1,000명 대표 스타일·무드·산책자 비율", () => {
    const rand = mulberry32(42);
    const zoneBy = Object.fromEntries(ARTWORKS.map((a) => [a.id, a.zone]));
    const styleCounts: Record<string, number> = {
      collector: 0,
      explorer: 0,
      immersive: 0,
      walker: 0,
    };
    const moodCounts: Record<string, number> = {};
    let walker = 0;

    for (let i = 0; i < 1000; i++) {
      const records = simulateVisitor(rand);
      const last = records[records.length - 1];
      const generateAtSec = last.atSec + 40;
      const merged = mergeConsecutiveCamera(records);
      const dwellSecs = dwellSeconds(merged, generateAtSec);
      const judged = judgeStyle({
        uniqueCameraArtworks: uniqueCameraArtworkIds(records).length,
        totalArtworks: 12,
        uniqueCameraZones: uniqueCameraZones(records, zoneBy).length,
        totalZones: 4,
        dwellSecs,
      });
      styleCounts[judged.style] += 1;
      if (judged.style === "walker") walker += 1;
      const mood = computeMood(records, {});
      const typeName = resolveTypeName(mood.moodId, judged.style);
      moodCounts[MOOD_BY_ID[mood.moodId].nameKo] =
        (moodCounts[MOOD_BY_ID[mood.moodId].nameKo] ?? 0) + 1;
      void typeName;
    }

    const styleTable = Object.entries(styleCounts).map(([style, n]) => ({
      style,
      n,
      pct: `${((n / 1000) * 100).toFixed(1)}%`,
    }));
    const moodTable = Object.entries(moodCounts).map(([mood, n]) => ({
      mood,
      n,
      pct: `${((n / 1000) * 100).toFixed(1)}%`,
    }));

    console.log("\n[모의 관람객 1,000명 · 대표 스타일]");
    console.table(styleTable);
    console.log(`산책자 비율: ${((walker / 1000) * 100).toFixed(1)}%`);
    console.log("\n[모의 관람객 1,000명 · 무드]");
    console.table(moodTable);
  });
});
