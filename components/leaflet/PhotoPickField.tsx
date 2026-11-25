"use client";

import { useRef, useState } from "react";
import { compressImageFile } from "@/lib/leaflet/compressImage";

/** 파일 선택 UI — 브라우저 기본 「파일 선택」 문구를 숨긴다. 저장 전 압축. */
export function PhotoPickField({
  preview,
  onPick,
  label = "사진 추가",
}: {
  preview: string | null;
  onPick: (dataUrl: string | null) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      onPick(null);
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compressImageFile(file);
      onPick(dataUrl);
    } catch {
      onPick(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          void onFile(event.target.files?.[0] ?? null);
        }}
      />
      <button
        type="button"
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-hairline-on-dark bg-canvas-dark-deep px-4 py-6 text-ink-on-dark"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {preview ? (
          <img src={preview} alt="" className="max-h-48 w-full object-contain" />
        ) : (
          <span className="text-[15px] font-semibold">{busy ? "준비 중" : label}</span>
        )}
        {preview ? <span className="text-[13px] text-mute-on-dark">{label}</span> : null}
      </button>
    </div>
  );
}
