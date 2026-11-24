"use client";

import Link from "next/link";
import { leafletPillStyle, type LeafletTheme } from "@/components/leaflet/theme";
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

  // 위가 좁고 아래가 넓은 군집: 행 길이 3,4,5,6,6… 로 나눔
  const rows: (typeof blocks)[] = [];
  let offset = 0;
  let rowSize = 3;
  while (offset < blocks.length) {
    rows.push(blocks.slice(offset, offset + rowSize));
    offset += rowSize;
    rowSize = Math.min(rowSize + 1, 7);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 flex-col gap-1">
        <h2
          className="m-0 font-semibold"
          style={{ color: theme.text, fontSize: "clamp(1rem, 2.8svh, 1.375rem)" }}
        >
          이 전시의 감성
        </h2>
        <p
          className="m-0"
          style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
        >
          관람객 {result.comparison.visitorCount}명의 기록
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden">
        {rows.map((row, ri) => (
          <div key={ri} className="flex flex-wrap justify-center gap-1.5">
            {row.map((b) => {
              const em = EMOTION_BY_ID[b.emotionId];
              const filled = b.isMine;
              return (
                <span
                  key={b.key}
                  className="inline-flex items-center rounded-full px-2.5 py-1 font-medium"
                  style={{
                    background: filled ? em.displayColor : "transparent",
                    color: filled ? "#111111" : theme.text,
                    fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)",
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
        ))}
      </div>

      {result.comparison.line ? (
        <p
          className="m-0 shrink-0 leading-snug"
          style={{ color: theme.text, fontSize: "clamp(0.875rem, 2.2svh, 0.9375rem)" }}
        >
          {result.comparison.line}
        </p>
      ) : null}

      {exhibitionId ? (
        <Link
          href={`/exhibitions/${exhibitionId}`}
          className="inline-flex h-10 w-fit shrink-0 items-center justify-center px-5 font-medium"
          style={{
            ...leafletPillStyle(theme, "secondary"),
            fontSize: "clamp(0.8125rem, 2svh, 0.875rem)",
          }}
        >
          전시 기록 더 보기
        </Link>
      ) : null}
    </div>
  );
}
