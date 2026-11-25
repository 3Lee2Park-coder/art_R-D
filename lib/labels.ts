import { todayISO } from "@/lib/format";
import type { Exhibition, Gallery } from "@/lib/types";

export function contractLabel(state: Gallery["contractState"]) {
  if (state === "contracted") return "계약";
  if (state === "uncontracted") return "미계약";
  return "계약 종료";
}

export type ExhibitionPeriodState = "준비 중" | "진행 중" | "종료";

/** 기간 기준 상태. 「게시됨」 없음. */
export function exhibitionPeriodState(
  exhibition: Exhibition,
  today: string = todayISO(),
): ExhibitionPeriodState {
  if (exhibition.ended || exhibition.endDate < today) return "종료";
  if (exhibition.startDate > today) return "준비 중";
  return "진행 중";
}

/**
 * 목록 상태. 승인 대기(pending)가 기간 상태보다 먼저.
 * 「게시됨」은 쓰지 않는다. published 값은 유지.
 */
export function exhibitionStateLabel(
  exhibition: Exhibition,
  today: string = todayISO(),
): string {
  if (exhibition.approvalState === "pending") return "확인 대기";
  return exhibitionPeriodState(exhibition, today);
}

export function interestLabel(value: string) {
  if (value === "추정 불가") return value;
  return `${value} · 추정`;
}

export function dwellLabel(value: string | null) {
  if (!value) return "추정 불가";
  return `${value} · 추정`;
}
