"use client";

import { useEffect, useState } from "react";
import { PhotoPickField } from "@/components/leaflet/PhotoPickField";

export function DecorateSheet({
  open,
  initialPhoto,
  initialComment,
  onSave,
  onClose,
}: {
  open: boolean;
  initialPhoto: string | null;
  initialComment: string;
  onSave: (input: { myPhotoUrl: string | null; comment: string }) => void;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(initialPhoto);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (open) {
      setPreview(initialPhoto);
      setComment(initialComment);
    }
  }, [open, initialPhoto, initialComment]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-[rgba(9,32,57,0.72)]"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="flex max-h-[88svh] w-full flex-col rounded-t-3xl bg-surface-dark px-5 pt-4 pb-8 text-ink-on-dark"
        role="dialog"
        aria-label="꾸미기"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-hairline-on-dark" />
        <PhotoPickField preview={preview} onPick={setPreview} label="사진 추가" />
        <label className="mt-5 block">
          <span className="mb-2 block text-[14px] font-semibold">한줄평</span>
          <textarea
            className="field field-dark min-h-24"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="btn btn-accent mt-6 w-full"
          onClick={() => onSave({ myPhotoUrl: preview, comment })}
        >
          저장
        </button>
        <button type="button" className="btn btn-secondary-dark mt-3 w-full" onClick={onClose}>
          닫기
        </button>
      </section>
    </div>
  );
}
