/** LEAFLET_SPEC 1-4 리플릿 생성 조건 */

import type { VisitRecord } from "@/lib/leaflet/dwell";

/** 촬영 1점 이상, 또는 배치도에서 감성 1개 이상 */
export function canGenerateLeaflet(records: VisitRecord[]): boolean {
  if (records.some((r) => r.source === "camera")) return true;
  if (records.some((r) => r.source === "map" && r.emotionId)) return true;
  return false;
}

/** [가안] LEAFLET_SPEC 1-4 알림 문구 */
export const GENERATE_BLOCKED_MESSAGE =
  "작품을 1점 이상 촬영하거나, 배치도에서 작품 설명을 보고 감성을 하나 선택해 주세요.";
