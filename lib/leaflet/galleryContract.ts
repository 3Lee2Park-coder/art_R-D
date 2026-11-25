/** 갤러리 계약 상태와 리플릿 서비스 가능 여부 */

import type { Exhibition, Gallery } from "@/lib/types";

export function isContractEnded(gallery: Gallery | null | undefined): boolean {
  return gallery?.contractState === "ended";
}

/** 계약 종료 후 해당 전시의 리플릿 입장·생성 불가 (leafletEnabled여도). */
export function canUseLeafletService(
  exhibition: Exhibition | null | undefined,
  gallery: Gallery | null | undefined,
): boolean {
  if (!exhibition) return false;
  if (isContractEnded(gallery)) return false;
  return (
    exhibition.status === "contracted" &&
    exhibition.leafletEnabled &&
    !exhibition.ended
  );
}
