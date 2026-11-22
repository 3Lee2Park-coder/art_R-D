import type { Exhibition, Gallery } from "@/lib/types";

export function contractLabel(state: Gallery["contractState"]) {
  if (state === "contracted") return "계약";
  if (state === "uncontracted") return "미계약";
  return "계약 종료";
}

export function exhibitionStateLabel(exhibition: Exhibition) {
  if (exhibition.ended) return "종료";
  if (!exhibition.published && exhibition.approvalState === "pending") return "확인 대기";
  if (exhibition.published) return "게시됨";
  return "작성 중";
}

export function interestLabel(value: string) {
  if (value === "추정 불가") return value;
  return `${value} · 추정`;
}

export function dwellLabel(value: string | null) {
  if (!value) return "추정 불가";
  return `${value} · 추정`;
}
