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
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden px-1 pb-1 pt-1">
      <div className="flex shrink-0 flex-col gap-1">
        <h2 className="m-0 text-[22px] font-semibold" style={{ color: theme.text }}>
          이 전시의 감성
        </h2>
        <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
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
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium"
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
        ))}
      </div>

      {result.comparison.line ? (
        <p className="m-0 shrink-0 text-[15px] leading-snug" style={{ color: theme.text }}>
          {result.comparison.line}
        </p>
      ) : null}

      {exhibitionId ? (
        <Link
          href={`/exhibitions/${exhibitionId}`}
          className="inline-flex h-10 w-fit shrink-0 items-center justify-center px-5 text-[14px] font-medium"
          style={leafletPillStyle(theme, "secondary")}
        >
          전시 기록 더 보기
        </Link>
      ) : null}
    </div>
  );
}
