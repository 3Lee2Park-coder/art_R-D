/** 연속 촬영 합치기 · 유효 관람 시간 (LEAFLET_SPEC 3-2 ①) */

export type VisitRecord = {
  artworkId: string;
  source: "camera" | "map";
  atSec: number;
  movingSec: number;
  emotionId: string | null;
  descriptionOpened?: boolean;
  photoUrl?: string | null;
};

export type MergedCameraRecord = {
  artworkId: string;
  atSec: number;
  movingSec: number;
  emotionId: string | null;
  /** 합친 원본 인덱스들 */
  indices: number[];
};

const MAX_DWELL_SEC = 600;

/** map 기록은 시간 축에서 제외 [가안] */
export function cameraRecords(records: VisitRecord[]): VisitRecord[] {
  return records.filter((r) => r.source === "camera");
}

/**
 * 연속 같은 작품을 한 기록으로 합친다(첫 촬영 시각, movingSec 합산).
 * 떨어진 같은 작품 재촬영은 합치지 않는다 [가안].
 */
export function mergeConsecutiveCamera(records: VisitRecord[]): MergedCameraRecord[] {
  const cams = cameraRecords(records);
  const merged: MergedCameraRecord[] = [];
  for (let i = 0; i < cams.length; i++) {
    const cur = cams[i];
    const last = merged[merged.length - 1];
    if (last && last.artworkId === cur.artworkId) {
      last.movingSec += cur.movingSec;
      last.emotionId = cur.emotionId ?? last.emotionId;
      last.indices.push(i);
    } else {
      merged.push({
        artworkId: cur.artworkId,
        atSec: cur.atSec,
        movingSec: cur.movingSec,
        emotionId: cur.emotionId,
        indices: [i],
      });
    }
  }
  return merged;
}

/**
 * 유효 = min(600, max(0, 다음 촬영 − 이번 촬영 − movingSec))
 * 마지막은 generateAtSec까지.
 */
export function dwellSeconds(
  merged: MergedCameraRecord[],
  generateAtSec: number,
): number[] {
  return merged.map((rec, i) => {
    const nextAt = i + 1 < merged.length ? merged[i + 1].atSec : generateAtSec;
    const raw = nextAt - rec.atSec - rec.movingSec;
    return Math.min(MAX_DWELL_SEC, Math.max(0, raw));
  });
}

export function uniqueCameraArtworkIds(records: VisitRecord[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of cameraRecords(records)) {
    if (!seen.has(r.artworkId)) {
      seen.add(r.artworkId);
      out.push(r.artworkId);
    }
  }
  return out;
}

export function uniqueCameraZones(
  records: VisitRecord[],
  zoneByArtwork: Record<string, string | null | undefined>,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of cameraRecords(records)) {
    const z = zoneByArtwork[r.artworkId];
    if (z && !seen.has(z)) {
      seen.add(z);
      out.push(z);
    }
  }
  return out;
}

/** 카드 1: camera + map 고유 작품 수 [가안] */
export function uniqueArtworkIdsAll(records: VisitRecord[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of records) {
    if (!seen.has(r.artworkId)) {
      seen.add(r.artworkId);
      out.push(r.artworkId);
    }
  }
  return out;
}
