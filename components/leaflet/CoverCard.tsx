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
    <div className="flex h-full min-h-0 flex-col justify-between gap-5 overflow-hidden px-1 pb-1 pt-1">
      <div className="flex shrink-0 items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold tracking-tight" style={{ color: theme.text }}>
          RestArt
        </span>
        <span className="text-[13px]" style={{ color: theme.aux }}>
          {formatDate(visitDate)}
        </span>
      </div>

      <div
        className="relative flex w-full shrink-0 items-center justify-center overflow-hidden"
        style={{
          height: "50%",
          border: `1px solid ${theme.border}`,
          background: `${theme.text}10`,
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="max-h-full max-w-full object-contain" />
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <h1
            className="m-0 text-[32px] font-bold leading-[1.15] tracking-[-0.01em]"
            style={{ color: theme.text }}
          >
            {result.typeName}
          </h1>
          <p className="m-0 text-[15px] leading-snug" style={{ color: theme.text }}>
            {result.oneLiner}
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <hr className="m-0 border-0 border-t" style={{ borderColor: theme.border }} />
          <div className="flex flex-col gap-1.5">
            <p className="m-0 text-[15px] font-medium" style={{ color: theme.text }}>
              {exhibitionTitle}
            </p>
            {galleryLine ? (
              <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
                {galleryLine}
              </p>
            ) : null}
            <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
              기록 {result.stats.records}점 · {result.stats.minutes}분
            </p>
            {artistLine ? (
              <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
                {artistLine}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
