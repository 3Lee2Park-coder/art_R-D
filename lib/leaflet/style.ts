/** 관람 스타일 판정 (LEAFLET_SPEC 3-2, 3-3). secondary는 계산·저장하지 않는다 [결정]. */

export const STYLE_RULE_VERSION = "v1-2026-11-20";

export type StyleId = "immersive" | "explorer" | "collector" | "walker";

export type StyleMet = {
  immersive: boolean;
  explorer: boolean;
  collector: boolean;
};

export type JudgeStyleResult = {
  style: StyleId;
  met: StyleMet;
  walkerReason?: "no_condition";
};

/** null = 판정 제외(불충족) */
export function collectorNeed(n: number): number | null {
  if (n <= 4) return null;
  if (n <= 10) return Math.ceil(n * 0.7);
  if (n <= 20) return Math.max(7, Math.ceil(n * 0.6));
  if (n <= 40) return Math.max(12, Math.ceil(n * 0.5));
  if (n <= 60) return Math.max(20, Math.ceil(n * 0.4));
  return Math.max(24, Math.ceil(n * 0.3));
}

/** null = 판정 제외(불충족) */
export function explorerNeed(z: number): number | null {
  if (z <= 1) return null;
  if (z <= 3) return 2;
  if (z <= 5) return 3;
  if (z <= 7) return 4;
  return Math.ceil(z * 0.5);
}

export function judgeStyle(input: {
  uniqueCameraArtworks: number;
  totalArtworks: number;
  uniqueCameraZones: number;
  totalZones: number;
  /** 작품별 유효 시간(초). 60초 이상 1점이면 몰입 */
  dwellSecs: number[];
}): JudgeStyleResult {
  const needC = collectorNeed(input.totalArtworks);
  const needE = explorerNeed(input.totalZones);
  const met: StyleMet = {
    collector: needC !== null && input.uniqueCameraArtworks >= needC,
    explorer: needE !== null && input.uniqueCameraZones >= needE,
    immersive: input.dwellSecs.some((s) => s >= 60),
  };

  // 대표 = 수집가 > 탐험가 > 몰입가
  if (met.collector) {
    return { style: "collector", met };
  }
  if (met.explorer) {
    return { style: "explorer", met };
  }
  if (met.immersive) {
    return { style: "immersive", met };
  }
  return { style: "walker", met, walkerReason: "no_condition" };
}
