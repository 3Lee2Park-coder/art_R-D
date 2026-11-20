"use client";

import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import { formatDate } from "@/lib/format";
import type { LeafletTheme } from "@/components/leaflet/theme";

export function CoverCard({
  result,
  theme,
  visitDate,
  exhibitionTitle,
  galleryLine,
  artistLine,
  imageUrl,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  visitDate: string;
  exhibitionTitle: string;
  galleryLine: string;
  artistLine: string;
  imageUrl: string | null;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-1 pb-2 pt-1">
      <div className="flex shrink-0 items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: theme.text }}>
          RestArt
        </span>
        <span className="text-[13px]" style={{ color: theme.aux }}>
          {formatDate(visitDate)}
        </span>
      </div>

      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{
          height: "46%",
          border: theme.imageBorder ? `1px solid ${theme.border}` : undefined,
          background: `${theme.text}14`,
        }}
      >
        {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : null}
      </div>

      <div className="flex min-h-0 flex-col gap-2.5">
        <h1
          className="m-0 text-[30px] font-bold leading-[1.15] tracking-[-0.01em]"
          style={{ color: theme.text }}
        >
          {result.typeName}
        </h1>
        <p className="m-0 text-[14px] leading-snug" style={{ color: theme.text }}>
          {result.oneLiner}
        </p>
        <hr className="m-0 border-0 border-t" style={{ borderColor: theme.border }} />
        <div className="flex flex-col gap-1">
          <p className="m-0 text-[14px] font-medium" style={{ color: theme.text }}>
            {exhibitionTitle}
          </p>
          {galleryLine ? (
            <p className="m-0 text-[12px]" style={{ color: theme.aux }}>
              {galleryLine}
            </p>
          ) : null}
          <p className="m-0 text-[12px]" style={{ color: theme.aux }}>
            기록 {result.stats.records}점 · {result.stats.minutes}분
          </p>
          {artistLine ? (
            <p className="m-0 text-[11px]" style={{ color: theme.aux }}>
              {artistLine}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
