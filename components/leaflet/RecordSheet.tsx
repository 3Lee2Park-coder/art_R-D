"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EMOTIONS, type EmotionId } from "@/lib/leaflet/emotions";
import type { Artist, Artwork } from "@/lib/types";

export type RecordSheetMode = "camera" | "map";

export function RecordSheet({
  open,
  artwork,
  artist,
  mode,
  initialDescriptionOpen = false,
  exhibitionArtworks,
  footer,
  continueLabel,
  onPickArtwork,
  onSelectEmotion,
  onDismissWithoutEmotion,
  onContinue,
  onClose,
}: {
  open: boolean;
  artwork: Artwork | null;
  artist?: Artist;
  mode: RecordSheetMode;
  initialDescriptionOpen?: boolean;
  exhibitionArtworks: Artwork[];
  footer?: ReactNode;
  continueLabel?: string;
  onPickArtwork?: (artworkId: string) => void;
  onSelectEmotion: (emotionId: EmotionId, descriptionOpened: boolean) => void;
  onDismissWithoutEmotion: (descriptionOpened: boolean) => void;
  onContinue?: () => void;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(initialDescriptionOpen);
  const [picker, setPicker] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setExpanded(initialDescriptionOpen);
      setPicker(false);
    }
  }, [open, initialDescriptionOpen, artwork?.id]);

  if (!open || !artwork) return null;

  function finishEmotion(emotionId: EmotionId) {
    onSelectEmotion(emotionId, expanded);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end bg-[rgba(9,32,57,0.72)]"
      onClick={() => {
        onDismissWithoutEmotion(expanded);
        onClose();
      }}
    >
      <section
        className="flex max-h-[88svh] w-full flex-col rounded-t-3xl bg-surface-dark px-5 pt-4 pb-8 text-ink-on-dark"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={artwork.title}
        onTouchStart={(e) => {
          startY.current = e.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(e) => {
          const y0 = startY.current;
          const y1 = e.changedTouches[0]?.clientY;
          startY.current = null;
          if (y0 != null && y1 != null && y0 - y1 > 48) setExpanded(true);
          if (y0 != null && y1 != null && y1 - y0 > 64 && !expanded) {
            onDismissWithoutEmotion(false);
            onClose();
          }
        }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-hairline-on-dark" />

        <div className="flex gap-3">
          <img
            src={artwork.imageUrl}
            alt=""
            className="h-20 w-16 shrink-0 bg-canvas-dark-deep object-contain"
          />
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-[20px] font-semibold">{artwork.title}</h2>
            {artist ? (
              <p className="m-0 mt-1 text-[14px] text-mute-on-dark">{artist.name}</p>
            ) : null}
            {mode === "camera" && onPickArtwork ? (
              <button
                type="button"
                className="link-accent mt-2 bg-transparent p-0 text-[13px]"
                onClick={() => setPicker((v) => !v)}
              >
                다른 작품이에요
              </button>
            ) : null}
          </div>
        </div>

        {picker ? (
          <ul className="mt-4 max-h-40 list-none overflow-y-auto p-0">
            {exhibitionArtworks.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 bg-transparent py-2 text-left"
                  onClick={() => {
                    onPickArtwork?.(item.id);
                    setPicker(false);
                  }}
                >
                  <img src={item.imageUrl} alt="" className="h-10 w-8 object-cover" />
                  <span className="text-[14px]">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-5 mb-3 text-[15px] font-medium">어떤 느낌이었나요?</p>
        <div className="grid grid-cols-5 gap-2">
          {EMOTIONS.map((em) => (
            <button
              key={em.id}
              type="button"
              className="flex aspect-square flex-col items-center justify-center rounded-full border bg-transparent p-1 text-center text-[10px] leading-tight"
              style={{
                borderColor: em.displayColor,
                background: `${em.displayColor}33`,
                color: "#F5F2EA",
              }}
              onClick={() => finishEmotion(em.id)}
              aria-label={em.nameKo}
            >
              {em.nameKo}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[12px] text-mute-on-dark">하나만 눌러 주세요</p>

        {!expanded ? (
          <button
            type="button"
            className="link mt-4 bg-transparent p-0 text-[13px] text-mute-on-dark"
            onClick={() => setExpanded(true)}
          >
            위로 올려 작품 설명 보기
          </button>
        ) : (
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {artwork.description ? (
              <p className="m-0 text-[14px] leading-relaxed text-mute-on-dark">{artwork.description}</p>
            ) : (
              <p className="m-0 text-[14px] text-mute-on-dark">설명이 없습니다.</p>
            )}
            {footer ? <div className="mt-4 flex flex-col gap-2">{footer}</div> : null}
            {onContinue ? (
              <button type="button" className="btn btn-accent mt-6 w-full" onClick={onContinue}>
                {continueLabel ?? "계속 촬영하기"}
              </button>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
