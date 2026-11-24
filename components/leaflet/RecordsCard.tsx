"use client";

import { useMemo, useRef, useState } from "react";
import { InquirySheet } from "@/components/leaflet/InquirySheet";
import { leafletPillStyle, type LeafletTheme } from "@/components/leaflet/theme";
import { useApp } from "@/components/providers";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import type { VisitRecord } from "@/lib/leaflet/dwell";
import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import { recordInquiryOpen } from "@/lib/leaflet/inquiry";
import { hasInterest, toggleInterestWork } from "@/lib/leaflet/interest";
import type { Artist, Artwork } from "@/lib/types";

export function RecordsCard({
  result,
  theme,
  records,
  artworks,
  artists,
  comment,
  leafletId,
  exhibitionId,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  records: VisitRecord[];
  artworks: Artwork[];
  artists: Artist[];
  comment?: string;
  leafletId: string;
  exhibitionId: string;
}) {
  const app = useApp();
  const items = records.length > 0 ? records : [];
  const [index, setIndex] = useState(0);
  const [interestTick, setInterestTick] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const current = items[Math.min(index, Math.max(0, items.length - 1))];
  const currentArtworkId = current?.artworkId;

  const interested = useMemo(() => {
    void interestTick;
    return currentArtworkId ? hasInterest(leafletId, currentArtworkId) : false;
  }, [interestTick, leafletId, currentArtworkId]);

  const artworkTitles = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of artworks) map[a.id] = a.title;
    return map;
  }, [artworks]);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(items.length - 1, i));
    setIndex(next);
    const el = trackRef.current;
    if (!el) return;
    const slide = el.children[next] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  function onToggleInterest() {
    if (!currentArtworkId) return;
    toggleInterestWork({
      artworkId: currentArtworkId,
      exhibitionId,
      leafletId,
      role: app.role,
    });
    setInterestTick((n) => n + 1);
  }

  function onOpenInquiry() {
    if (!currentArtworkId) return;
    recordInquiryOpen({
      leafletId,
      exhibitionId,
      artworkId: currentArtworkId,
      role: app.role,
    });
    setInquiryOpen(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 items-baseline justify-between gap-3">
        <h2
          className="m-0 font-semibold"
          style={{ color: theme.text, fontSize: "clamp(1rem, 2.8svh, 1.375rem)" }}
        >
          나의 기록
        </h2>
        <span style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}>
          기록 {result.stats.records}점
        </span>
      </div>

      {items.length > 0 ? (
        <>
          <div
            ref={trackRef}
            className="flex min-h-0 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ flex: "1 1 auto", maxHeight: "62%" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const w = el.clientWidth * 0.82;
              const next = Math.round(el.scrollLeft / (w + 12));
              if (next !== index) setIndex(Math.max(0, Math.min(items.length - 1, next)));
            }}
          >
            {items.map((rec, i) => {
              const aw = artworks.find((a) => a.id === rec.artworkId);
              const ar = aw ? artists.find((a) => a.id === aw.artistId) : undefined;
              const em =
                rec.emotionId && EMOTION_BY_ID[rec.emotionId as EmotionId]
                  ? EMOTION_BY_ID[rec.emotionId as EmotionId]
                  : null;
              return (
                <div
                  key={`${rec.artworkId}-${rec.atSec}-${i}`}
                  className="flex h-full min-h-0 w-[82%] shrink-0 snap-start flex-col"
                >
                  <div
                    className="flex min-h-0 items-center justify-center overflow-hidden"
                    style={{
                      flex: "0 1 58%",
                      maxHeight: "58%",
                      border: `1px solid ${theme.border}`,
                      background: `${theme.text}10`,
                    }}
                  >
                    {aw ? (
                      <img
                        src={aw.imageUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 flex shrink-0 flex-col gap-1">
                    <p
                      className="m-0 font-semibold"
                      style={{ color: theme.text, fontSize: "clamp(0.875rem, 2.2svh, 1rem)" }}
                    >
                      {aw?.title ?? rec.artworkId}
                    </p>
                    {ar ? (
                      <p
                        className="m-0"
                        data-record-artist
                        style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
                      >
                        {ar.name}
                      </p>
                    ) : null}
                    {em ? (
                      <span
                        data-record-emotion
                        className="mt-0.5 inline-flex w-fit rounded-full px-2.5 py-1 font-medium"
                        style={{
                          background: em.displayColor,
                          color: "#111111",
                          fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)",
                          border: theme.chipBorder(em.displayColor)
                            ? `1px solid ${theme.chipBorder(em.displayColor)}`
                            : undefined,
                        }}
                      >
                        {em.nameKo}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid shrink-0 grid-cols-6 gap-1.5" data-record-thumbs>
            {items.map((rec, i) => {
              const aw = artworks.find((a) => a.id === rec.artworkId);
              const em =
                rec.emotionId && EMOTION_BY_ID[rec.emotionId as EmotionId]
                  ? EMOTION_BY_ID[rec.emotionId as EmotionId]
                  : null;
              return (
                <button
                  key={`thumb-${rec.artworkId}-${rec.atSec}-${i}`}
                  type="button"
                  className="relative aspect-square w-full overflow-hidden"
                  style={{
                    border:
                      i === index
                        ? `2px solid ${theme.text}`
                        : `1px solid ${theme.border}`,
                    background: `${theme.text}10`,
                  }}
                  onClick={() => go(i)}
                  aria-label={`${i + 1}/${items.length}`}
                >
                  {aw ? (
                    <img src={aw.imageUrl} alt="" className="h-full w-full object-contain" />
                  ) : null}
                  {em ? (
                    <span
                      className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full"
                      style={{
                        background: em.displayColor,
                        boxShadow: `0 0 0 1px ${theme.bg}`,
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          {comment ? (
            <blockquote
              className="m-0 shrink-0 border-l-2 pl-3 leading-relaxed"
              style={{
                borderColor: theme.border,
                color: theme.text,
                fontSize: "clamp(0.8125rem, 2svh, 0.875rem)",
              }}
            >
              {comment}
            </blockquote>
          ) : null}
        </>
      ) : (
        <p className="m-0" style={{ color: theme.aux, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}>
          기록이 없습니다.
        </p>
      )}

      {currentArtworkId ? (
        <div className="mb-1 flex shrink-0 gap-2">
          <button
            type="button"
            className="inline-flex h-9 flex-1 items-center justify-center px-3 font-medium"
            style={{
              ...leafletPillStyle(theme, "secondary"),
              fontSize: "clamp(0.8125rem, 2svh, 0.875rem)",
            }}
            onClick={onToggleInterest}
          >
            {/* [가안] 이미 관심이면 "관심 해제" */}
            {interested ? "관심 해제" : "관심 작품"}
          </button>
          <button
            type="button"
            className="inline-flex h-9 flex-1 items-center justify-center px-3 font-medium"
            style={{
              ...leafletPillStyle(theme, "secondary"),
              fontSize: "clamp(0.8125rem, 2svh, 0.875rem)",
            }}
            onClick={onOpenInquiry}
          >
            작품 문의
          </button>
        </div>
      ) : null}

      <InquirySheet
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        theme={theme}
        leafletId={leafletId}
        exhibitionId={exhibitionId}
        inquiredArtworkIds={currentArtworkId ? [currentArtworkId] : []}
        artworkTitles={artworkTitles}
        role={app.role}
      />
    </div>
  );
}
