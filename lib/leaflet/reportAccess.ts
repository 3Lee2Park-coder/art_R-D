/** 전시 리포트 접근 (계약 갤러리 · 자기 전시만) */

import type { Gallery, Role } from "@/lib/types";

export const REPORT_ACCESS_DENIED = "리포트를 볼 수 없습니다";

export type ReportAccessInput = {
  role: Role;
  myGalleryId: string | null;
  contractState: Gallery["contractState"] | null | undefined;
  exhibitionGalleryId: string | null | undefined;
};

/** 계약 갤러리 + 자기 전시만 true. 집계 호출 전에 검사. */
export function canViewExhibitionReport(input: ReportAccessInput): boolean {
  if (input.role !== "gallery-contracted") return false;
  if (input.contractState !== "contracted") return false;
  if (!input.myGalleryId || !input.exhibitionGalleryId) return false;
  return input.exhibitionGalleryId === input.myGalleryId;
}
