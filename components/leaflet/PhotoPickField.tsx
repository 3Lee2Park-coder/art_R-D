"use client";

import { useRef } from "react";

/** 파일 선택 UI — 브라우저 기본 「파일 선택」 문구를 숨긴다. */
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

  function onFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) {
      onPick(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onPick(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => onFile(event.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-hairline-on-dark bg-canvas-dark-deep px-4 py-6 text-ink-on-dark"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="" className="max-h-48 w-full object-contain" />
        ) : (
          <span className="text-[15px] font-semibold">{label}</span>
        )}
        {preview ? <span className="text-[13px] text-mute-on-dark">{label}</span> : null}
      </button>
    </div>
  );
}
