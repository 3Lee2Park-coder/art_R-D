"use client";

import Link from "next/link";
import type { LeafletTheme } from "@/components/leaflet/theme";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import { EMOTION_BY_ID } from "@/lib/leaflet/emotions";

export function ExhibitionEmotionsCard({
  result,
  theme,
  exhibitionId,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  exhibitionId: string | null;
}) {
  const blocks = result.comparison.wordBlocks.flatMap((block) =>
    Array.from({ length: block.count }, (_, i) => ({
      key: `${block.emotionId}-${i}`,
      emotionId: block.emotionId,
      isMine: block.isMine,
    })),
  );

  return (
    <div className="flex h-full flex-col gap-5 px-1 pb-2 pt-1">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-[22px] font-semibold" style={{ color: theme.text }}>
          이 전시의 감성
        </h2>
        <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
          관람객 {result.comparison.visitorCount}명의 기록
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-wrap content-start gap-2 overflow-hidden">
        {blocks.map((b) => {
          const em = EMOTION_BY_ID[b.emotionId];
          const filled = b.isMine;
          return (
            <span
              key={b.key}
              className="inline-flex items-center px-2.5 py-1.5 text-[13px] font-medium"
              style={{
                background: filled ? em.displayColor : "transparent",
                color: filled ? "#111111" : theme.text,
                border: filled
                  ? theme.chipBorder(em.displayColor)
                    ? `1px solid ${theme.chipBorder(em.displayColor)}`
                    : undefined
                  : `1px solid ${theme.border}`,
              }}
            >
              {em.nameKo}
            </span>
          );
        })}
      </div>

      {result.comparison.line ? (
        <p className="m-0 text-[15px] leading-snug" style={{ color: theme.text }}>
          {result.comparison.line}
        </p>
      ) : null}

      {exhibitionId ? (
        <Link
          href={`/exhibitions/${exhibitionId}`}
          className="inline-flex h-11 items-center justify-center border px-4 text-[14px] font-medium"
          style={{ borderColor: theme.text, color: theme.text }}
        >
          전시 기록 더 보기
        </Link>
      ) : null}
    </div>
  );
}
