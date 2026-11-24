"use client";

import { EmotionMap } from "@/components/leaflet/EmotionMap";
import type { LeafletTheme } from "@/components/leaflet/theme";
import { MockRegion } from "@/components/ui";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import type { Artist, Artwork } from "@/lib/types";

export function EmotionsCard({
  result,
  theme,
  similarArtwork,
  similarArtist,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  similarArtwork?: Artwork;
  similarArtist?: Artist;
}) {
  const sum = result.topColors.reduce((s, c) => s + c.percent, 0) || 1;
  const normalized = result.topColors.map((c) => ({
    ...c,
    share: (c.percent / sum) * 100,
  }));

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <h2
        className="m-0 shrink-0 font-semibold"
        style={{ color: theme.text, fontSize: "clamp(1rem, 2.8svh, 1.375rem)" }}
      >
        나의 감성
      </h2>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <EmotionMap counts={result.emotionCounts} theme={theme} />
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <h3
          className="m-0 font-semibold"
          style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
        >
          나의 색
        </h3>
        <div className="flex w-full gap-1">
          {normalized.map((c) => {
            const swatch = COLOR_BY_NAME[c.name];
            return (
              <div key={c.name} className="flex min-w-0 flex-col gap-1" style={{ width: `${c.share}%` }}>
                <div
                  className="h-4 w-full"
                  style={{
                    background: swatch?.hex ?? "#888",
                    // 배경과 같은 색(Persian Indigo·Wheat)도 구분되게 본문 글자색 테두리
                    border: `1px solid ${theme.text}59`,
                  }}
                />
                <p
                  className="m-0 truncate leading-tight"
                  style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)" }}
                  title={`${c.name} ${c.percent}%`}
                >
                  {c.name}
                </p>
                <p
                  className="m-0"
                  style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)" }}
                >
                  {c.percent}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <MockRegion>
        <div className="flex shrink-0 flex-col gap-2">
          <h3
            className="m-0 font-semibold"
            style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
          >
            나와 닮은 작품
          </h3>
          <div className="flex gap-3">
            <div
              className="flex size-[clamp(3rem,8svh,4rem)] shrink-0 items-center justify-center overflow-hidden"
              style={{
                border: `1px solid ${theme.border}`,
                background: `${theme.text}10`,
              }}
            >
              {similarArtwork ? (
                <img
                  src={similarArtwork.imageUrl}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p
                className="m-0 font-medium"
                style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
              >
                {similarArtwork?.title ?? result.similar.artworkId}
              </p>
              {similarArtist ? (
                <p
                  className="m-0"
                  style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)" }}
                >
                  {similarArtist.name}
                </p>
              ) : null}
              <p
                className="m-0 leading-snug"
                style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.75rem)" }}
              >
                {result.similar.reason}
              </p>
            </div>
          </div>
        </div>
      </MockRegion>
    </div>
  );
}
