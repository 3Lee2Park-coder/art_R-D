/** 나의 색 상위 5 + Top1(무채색 제외) (LEAFLET_SPEC 7-2) */

import { ACHROMATIC_NAMES, COLOR_NAMES } from "@/lib/leaflet/colors";
import { uniqueCameraArtworkIds, type VisitRecord } from "@/lib/leaflet/dwell";

export type ColorShare = Record<string, number>;

export type TopColor = {
  name: string;
  /** 0~100 반올림 % */
  percent: number;
  ratio: number;
};

export type PaletteResult = {
  topColors: TopColor[];
  top1Color: string | null;
};

/**
 * 촬영한 고유 작품들의 65색 비율 평균 → 상위 5.
 * 동률은 CSV 순서 [가안]. map 제외.
 */
export function computePalette(
  records: VisitRecord[],
  colorLabels: Record<string, ColorShare | undefined>,
): PaletteResult {
  const ids = uniqueCameraArtworkIds(records);
  if (ids.length === 0) {
    return { topColors: [], top1Color: null };
  }

  const sums: Record<string, number> = Object.fromEntries(
    COLOR_NAMES.map((n) => [n, 0]),
  );
  for (const id of ids) {
    const lab = colorLabels[id];
    if (!lab) continue;
    for (const name of COLOR_NAMES) {
      sums[name] += lab[name] ?? 0;
    }
  }
  const n = ids.length;
  const ratios = COLOR_NAMES.map((name) => ({
    name,
    ratio: sums[name] / n,
  }));
  // 동률은 CSV 순서 유지(이미 COLOR_NAMES 순) → 비율 내림차순 안정 정렬
  ratios.sort((a, b) => {
    if (b.ratio !== a.ratio) return b.ratio - a.ratio;
    return COLOR_NAMES.indexOf(a.name) - COLOR_NAMES.indexOf(b.name);
  });

  const topColors: TopColor[] = ratios.slice(0, 5).map((r) => ({
    name: r.name,
    ratio: r.ratio,
    percent: Math.round(r.ratio * 100),
  }));

  const top1 =
    ratios.find((r) => !ACHROMATIC_NAMES.has(r.name) && r.ratio > 0)?.name ??
    null;

  return { topColors, top1Color: top1 };
}
