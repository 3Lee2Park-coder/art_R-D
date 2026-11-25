/**
 * 구역별 반응 (5i). ExhibitionZone + Artwork.zone(name) + report source.
 */

import {
  cameraRecords,
  dwellSeconds,
  mergeConsecutiveCamera,
  type VisitRecord,
} from "@/lib/leaflet/dwell";
import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import type { Artwork, ExhibitionZone } from "@/lib/types";

export type ZoneAnalyticsRow = {
  zoneId: string;
  name: string;
  wallLengthM: number | null;
  /** null → 「추정 불가」 */
  occupiedWidthM: number | null;
  /** null → 「추정 불가」 */
  occupancyPct: number | null;
  artworkCount: number;
  recordCount: number;
  /** 구역 작품을 기록한 고유 리플릿 수 */
  participatingSessions: number;
  /** null → 「추정 불가」 */
  averageDwellSec: number | null;
  dwellSampleCount: number;
  topEmotionLabel: string | null;
};

export type ZoneTransition = {
  from: string;
  to: string;
  route: string;
  count: number;
  sharePct: number;
};

export type ZonesAnalytics = {
  exhibitionId: string;
  /** 구역·작품 매핑이 전혀 없으면 true */
  empty: boolean;
  rows: ZoneAnalyticsRow[];
  transitions: ZoneTransition[];
};

/** C8: 리포트·구역 화면 공통 체류 표시 */
export function formatZoneDwellSec(sec: number | null): string | null {
  if (sec == null) return null;
  if (sec < 60) return `${Math.round(sec)}초`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s ? `${m}분 ${s}초` : `${m}분`;
}

function emotionLabel(counts: Map<string, number>): string | null {
  let best: string | null = null;
  let n = 0;
  for (const [id, c] of counts) {
    if (c > n || (c === n && (!best || id < best))) {
      best = id;
      n = c;
    }
  }
  if (!best || n <= 0) return null;
  return EMOTION_BY_ID[best as EmotionId]?.nameKo ?? best;
}

/** zones 없으면 Artwork.zone 이름으로 구성 */
export function resolveZonesForExhibition(
  exhibitionId: string,
  storedZones: ExhibitionZone[],
  artworks: Artwork[],
): ExhibitionZone[] {
  const fromStore = storedZones.filter((z) => z.exhibitionId === exhibitionId);
  if (fromStore.length > 0) return fromStore;

  const names = new Set<string>();
  for (const a of artworks) {
    if (a.exhibitionId !== exhibitionId) continue;
    if (a.zone) names.add(a.zone);
  }
  return [...names].sort().map((name, i) => ({
    exhibitionId,
    zoneId: `derived-${i}-${name}`,
    name,
    wallLengthM: null,
  }));
}

/**
 * 촬영 순서 기반 A→B. camera만, atSec 정렬, 연속 같은 구역은 세지 않음.
 */
export function zoneTransitionsFromLeaflets(
  leaflets: ExhibitionReportSource["leaflets"],
  exhibitionId: string,
  zoneByArtwork: Record<string, string | null | undefined>,
): ZoneTransition[] {
  const counts = new Map<string, number>();
  for (const l of leaflets) {
    if (l.exhibitionId !== exhibitionId) continue;
    const cams = cameraRecords((l.records ?? []) as VisitRecord[]).slice();
    cams.sort((a, b) => a.atSec - b.atSec);
    let prevZone: string | null = null;
    for (const r of cams) {
      const z = zoneByArtwork[r.artworkId] ?? null;
      if (!z) {
        prevZone = null;
        continue;
      }
      if (prevZone && prevZone !== z) {
        const key = `${prevZone}\0${z}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      prevZone = z;
    }
  }
  const total = [...counts.values()].reduce((s, n) => s + n, 0);
  return [...counts.entries()]
    .map(([key, count]) => {
      const [from, to] = key.split("\0");
      return {
        from: from!,
        to: to!,
        route: `${from} → ${to}`,
        count,
        sharePct: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.count - a.count || a.route.localeCompare(b.route));
}

export function buildZonesAnalytics(input: {
  source: ExhibitionReportSource;
  zones: ExhibitionZone[];
  artworks: Artwork[];
}): ZonesAnalytics {
  const { source, artworks } = input;
  const zones = input.zones;
  if (zones.length === 0) {
    return {
      exhibitionId: source.exhibitionId,
      empty: true,
      rows: [],
      transitions: [],
    };
  }

  const zoneByArtwork: Record<string, string | null | undefined> = {
    ...source.zonesByArtwork,
  };
  for (const a of artworks) {
    if (a.exhibitionId === source.exhibitionId) {
      zoneByArtwork[a.id] = a.zone;
    }
  }

  const artworksInZone = (zoneName: string) =>
    artworks.filter(
      (a) => a.exhibitionId === source.exhibitionId && a.zone === zoneName,
    );

  const leaflets = source.leaflets.filter(
    (l) => l.exhibitionId === source.exhibitionId,
  );

  const rows: ZoneAnalyticsRow[] = zones.map((z) => {
    const works = artworksInZone(z.name);

    let recordCount = 0;
    const sessionIds = new Set<string>();
    const emotionCounts = new Map<string, number>();
    const dwellSamples: number[] = [];

    for (const l of leaflets) {
      const records = (l.records ?? []) as VisitRecord[];
      let hit = false;
      for (const r of records) {
        if (zoneByArtwork[r.artworkId] !== z.name) continue;
        recordCount += 1;
        hit = true;
        if (r.emotionId) {
          emotionCounts.set(
            r.emotionId,
            (emotionCounts.get(r.emotionId) ?? 0) + 1,
          );
        }
      }
      if (hit) sessionIds.add(l.id);

      const merged = mergeConsecutiveCamera(records);
      if (merged.length === 0) continue;
      const generateAtSec =
        typeof l.generateAtSec === "number"
          ? l.generateAtSec
          : merged[merged.length - 1]!.atSec;
      const dwells = dwellSeconds(merged, generateAtSec);
      merged.forEach((m, i) => {
        if (zoneByArtwork[m.artworkId] !== z.name) return;
        if (typeof l.generateAtSec !== "number" && i === merged.length - 1) {
          return;
        }
        dwellSamples.push(dwells[i] ?? 0);
      });
    }

    const widths = works.map((w) => w.widthCm);
    const allWidths =
      works.length > 0 && widths.every((w) => w != null && Number.isFinite(w));
    let occupiedWidthM: number | null = null;
    let occupancyPct: number | null = null;
    if (allWidths && z.wallLengthM != null && z.wallLengthM > 0) {
      const sumCm = widths.reduce<number>((s, w) => s + (w as number), 0);
      occupiedWidthM = sumCm / 100;
      occupancyPct = Math.round((occupiedWidthM / z.wallLengthM) * 1000) / 10;
    }

    return {
      zoneId: z.zoneId,
      name: z.name,
      wallLengthM: z.wallLengthM,
      occupiedWidthM,
      occupancyPct,
      artworkCount: works.length,
      recordCount,
      participatingSessions: sessionIds.size,
      averageDwellSec:
        dwellSamples.length > 0
          ? dwellSamples.reduce((s, n) => s + n, 0) / dwellSamples.length
          : null,
      dwellSampleCount: dwellSamples.length,
      topEmotionLabel: emotionLabel(emotionCounts),
    };
  });

  return {
    exhibitionId: source.exhibitionId,
    empty: false,
    rows,
    transitions: zoneTransitionsFromLeaflets(
      leaflets,
      source.exhibitionId,
      zoneByArtwork,
    ),
  };
}
