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
  return (
    <div className="flex h-full flex-col gap-5 px-1 pb-2 pt-1">
      <h2 className="m-0 text-[22px] font-semibold" style={{ color: theme.text }}>
        나의 감성
      </h2>

      <div className="min-h-0 flex-1">
        <EmotionMap counts={result.emotionCounts} theme={theme} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-[14px] font-semibold" style={{ color: theme.text }}>
          나의 색
        </h3>
        <div className="flex h-4 w-full overflow-hidden" style={{ border: `1px solid ${theme.border}` }}>
          {result.topColors.map((c) => {
            const swatch = COLOR_BY_NAME[c.name];
            return (
              <div
                key={c.name}
                style={{
                  width: `${c.percent}%`,
                  background: swatch?.hex ?? "#888",
                }}
                title={`${c.name} ${c.percent}%`}
              />
            );
          })}
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-[12px]" style={{ color: theme.aux }}>
          {result.topColors.map((c) => (
            <li key={c.name}>
              {c.name} {c.percent}%
            </li>
          ))}
        </ul>
      </div>

      <MockRegion>
        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-[14px] font-semibold" style={{ color: theme.text }}>
            나와 닮은 작품
          </h3>
          <div className="flex gap-3">
            <div
              className="h-16 w-16 shrink-0 overflow-hidden"
              style={{
                border: theme.imageBorder ? `1px solid ${theme.border}` : undefined,
                background: `${theme.text}14`,
              }}
            >
              {similarArtwork ? (
                <img src={similarArtwork.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="m-0 truncate text-[14px] font-medium" style={{ color: theme.text }}>
                {similarArtwork?.title ?? result.similar.artworkId}
              </p>
              {similarArtist ? (
                <p className="m-0 text-[12px]" style={{ color: theme.aux }}>
                  {similarArtist.name}
                </p>
              ) : null}
              <p className="m-0 text-[12px] leading-snug" style={{ color: theme.aux }}>
                {result.similar.reason}
              </p>
            </div>
          </div>
        </div>
      </MockRegion>
    </div>
  );
}
