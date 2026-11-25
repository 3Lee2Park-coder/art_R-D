/** 전시 리포트 접근 (계약·종료 아카이브 · 자기 전시) */

import { isEndedGallery } from "@/lib/studioAccess";
import type { Gallery, Role } from "@/lib/types";

export const REPORT_ACCESS_DENIED = "리포트를 볼 수 없습니다";

export type ReportAccessInput = {
  role: Role;
  myGalleryId: string | null;
  contractState: Gallery["contractState"] | null | undefined;
  exhibitionGalleryId: string | null | undefined;
};

/** 계약 또는 종료 아카이브 + 자기 전시만 true. 집계 호출 전에 검사. */
export function canViewExhibitionReport(input: ReportAccessInput): boolean {
  if (!input.myGalleryId || !input.exhibitionGalleryId) return false;
  if (input.exhibitionGalleryId !== input.myGalleryId) return false;

  if (input.role === "gallery-contracted" && input.contractState === "contracted") {
    return true;
  }

  if (isEndedGallery(input.role, input.contractState)) {
    return true;
  }

  return false;
}
