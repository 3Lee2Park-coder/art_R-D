"use client";

import { GENERATE_BLOCKED_MESSAGE } from "@/lib/leaflet/canGenerate";

export function GenerateBlockedAlert({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,32,57,0.72)] px-6"
      role="dialog"
      aria-modal="true"
      aria-label="리플릿 생성"
    >
      <div className="w-full max-w-[360px] rounded-2xl bg-surface-dark p-6 text-ink-on-dark">
        <p className="m-0 text-[15px] leading-relaxed">{GENERATE_BLOCKED_MESSAGE}</p>
        <button type="button" className="btn btn-accent mt-6 w-full" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
