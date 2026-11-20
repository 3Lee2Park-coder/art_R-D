"use client";

import Link from "next/link";
import { useState } from "react";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import type { VisitRecord } from "@/lib/leaflet/dwell";
import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import type { Artist, Artwork } from "@/lib/types";
import type { LeafletTheme } from "@/components/leaflet/theme";

export function RecordsCard({
  result,
  theme,
  records,
  artworks,
  artists,
  comment,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  records: VisitRecord[];
  artworks: Artwork[];
  artists: Artist[];
  comment?: string;
}) {
  const items = records.length > 0 ? records : [];
  const [index, setIndex] = useState(0);
  const current = items[Math.min(index, Math.max(0, items.length - 1))];
  const artwork = current ? artworks.find((a) => a.id === current.artworkId) : undefined;
  const artist = artwork ? artists.find((a) => a.id === artwork.artistId) : undefined;
  const emotion =
    current?.emotionId && EMOTION_BY_ID[current.emotionId as EmotionId]
      ? EMOTION_BY_ID[current.emotionId as EmotionId]
      : null;
  const inquireId = artwork?.id;

  return (
    <div className="flex h-full flex-col gap-5 px-1 pb-2 pt-1">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-[22px] font-semibold" style={{ color: theme.text }}>
          나의 기록
        </h2>
        <span className="text-[13px]" style={{ color: theme.aux }}>
          기록 {result.stats.records}점
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {artwork ? (
          <div className="flex flex-col gap-3">
            <div
              className="w-full overflow-hidden"
              style={{
                aspectRatio: "3 / 4",
                maxHeight: "42%",
                border: theme.imageBorder ? `1px solid ${theme.border}` : undefined,
                background: `${theme.text}14`,
              }}
            >
              <img src={artwork.imageUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="m-0 text-[17px] font-semibold" style={{ color: theme.text }}>
                {artwork.title}
              </p>
              {artist ? (
                <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
                  {artist.name}
                </p>
              ) : null}
            </div>
            {emotion ? (
              <span
                className="inline-flex w-fit rounded-sm px-2.5 py-1 text-[12px] font-medium"
                style={{
                  background: emotion.displayColor,
                  color: "#111111",
                  border: theme.chipBorder(emotion.displayColor)
                    ? `1px solid ${theme.chipBorder(emotion.displayColor)}`
                    : undefined,
                }}
              >
                {emotion.nameKo}
              </span>
            ) : null}
          </div>
        ) : (
          <p className="m-0 text-[14px]" style={{ color: theme.aux }}>
            기록이 없습니다.
          </p>
        )}

        {items.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {items.map((rec, i) => {
              const aw = artworks.find((a) => a.id === rec.artworkId);
              const em =
                rec.emotionId && EMOTION_BY_ID[rec.emotionId as EmotionId]
                  ? EMOTION_BY_ID[rec.emotionId as EmotionId]
                  : null;
              return (
                <button
                  key={`${rec.artworkId}-${rec.atSec}-${i}`}
                  type="button"
                  className="relative h-14 w-14 shrink-0 overflow-hidden"
                  style={{
                    border:
                      i === index
                        ? `2px solid ${theme.text}`
                        : theme.imageBorder
                          ? `1px solid ${theme.border}`
                          : "1px solid transparent",
                    background: `${theme.text}14`,
                  }}
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}/${items.length}`}
                >
                  {aw ? <img src={aw.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
                  {em ? (
                    <span
                      className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full"
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
        ) : null}

        {comment ? (
          <blockquote
            className="m-0 border-l-2 pl-3 text-[14px] leading-relaxed"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            {comment}
          </blockquote>
        ) : null}
      </div>

      {inquireId ? (
        <Link
          href={`/artworks/${inquireId}`}
          className="inline-flex h-11 items-center justify-center border px-4 text-[14px] font-medium"
          style={{ borderColor: theme.text, color: theme.text }}
        >
          작품 문의
        </Link>
      ) : null}
    </div>
  );
}
