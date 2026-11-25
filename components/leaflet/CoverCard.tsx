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
  /** 꾸미기 필 자리 — 공유 미리보기에서는 false */
  dateEndPad = false,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  visitDate: string;
  exhibitionTitle: string;
  galleryLine: string;
  artistLine: string;
  imageUrl: string | null;
  dateEndPad?: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 items-baseline justify-between gap-3">
        <span
          className="font-semibold tracking-tight"
          style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.9375rem)" }}
        >
          RestArt
        </span>
        <span
          data-cover-date
          className={dateEndPad ? "pr-[5.5rem]" : undefined}
          style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
        >
          {formatDate(visitDate)}
        </span>
      </div>

      <div
        className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden"
        style={{
          border: `1px solid ${theme.border}`,
          background: `${theme.text}10`,
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <h1
          className="m-0 font-bold leading-[1.15] tracking-[-0.01em]"
          style={{ color: theme.text, fontSize: "clamp(1.25rem, 3.6svh, 1.75rem)" }}
        >
          {result.typeName}
        </h1>
        <p
          className="m-0 leading-snug"
          style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
        >
          {result.oneLiner}
        </p>
        <hr className="m-0 border-0 border-t" style={{ borderColor: theme.border }} />
        <div className="flex flex-col gap-1">
          <p
            className="m-0 font-medium"
            style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
          >
            {exhibitionTitle}
          </p>
          {galleryLine ? (
            <p
              className="m-0"
              style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
            >
              {galleryLine}
            </p>
          ) : null}
          <p
            className="m-0"
            style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
          >
            기록 {result.stats.records}점 · {result.stats.minutes}분
          </p>
          {artistLine ? (
            <p
              className="m-0"
              style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
            >
              {artistLine}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
