"use client";

import Link from "next/link";
import type { LeafletTheme } from "@/components/leaflet/theme";
import { MockRegion } from "@/components/ui";
import { mockDbWork } from "@/lib/leaflet/demoLeaflets";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import { emotionNameKo, type EmotionId } from "@/lib/leaflet/emotions";
import { formatPeriod } from "@/lib/format";
import type { Exhibition, Gallery } from "@/lib/types";

export function NextCard({
  result,
  theme,
  leafletId,
  nextExhibition,
  nextGallery,
  archived,
  onSave,
  readOnly = false,
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  leafletId: string;
  nextExhibition?: Exhibition;
  nextGallery?: Gallery;
  archived: boolean;
  onSave: () => void;
  readOnly?: boolean;
}) {
  const recs = result.dbRecommendationIds.slice(0, 2).map((id) => mockDbWork(id)).filter(Boolean);

  return (
    <div className="flex h-full flex-col gap-5 px-1 pb-2 pt-1">
      <h2 className="m-0 text-[22px] font-semibold" style={{ color: theme.text }}>
        다음 감상
      </h2>

      {nextExhibition ? (
        <div className="flex gap-3">
          <div
            className="h-24 w-20 shrink-0 overflow-hidden"
            style={{
              border: theme.imageBorder ? `1px solid ${theme.border}` : undefined,
              background: `${theme.text}14`,
            }}
          >
            <img src={nextExhibition.posterUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="m-0 text-[15px] font-semibold" style={{ color: theme.text }}>
              {nextExhibition.title}
            </p>
            {nextGallery ? (
              <p className="m-0 text-[12px]" style={{ color: theme.aux }}>
                {nextGallery.name} · {nextGallery.region}
              </p>
            ) : null}
            <p className="m-0 text-[12px]" style={{ color: theme.aux }}>
              {formatPeriod(nextExhibition.startDate, nextExhibition.endDate)}
            </p>
          </div>
        </div>
      ) : null}

      <MockRegion>
        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-[14px] font-semibold" style={{ color: theme.text }}>
            추천 작품
          </h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {recs.map((work) =>
              work ? (
                <li key={work.id} className="flex gap-3">
                  <div
                    className="h-12 w-12 shrink-0"
                    style={{
                      background: `${theme.text}22`,
                      border: `1px solid ${theme.border}`,
                    }}
                  />
                  <div className="min-w-0">
                    <p className="m-0 truncate text-[13px] font-medium" style={{ color: theme.text }}>
                      {work.title}
                    </p>
                    {work.artistName ? (
                      <p className="m-0 text-[12px]" style={{ color: theme.aux }}>
                        {work.artistName}
                      </p>
                    ) : null}
                  </div>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </MockRegion>

      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-[14px] font-semibold" style={{ color: theme.text }}>
          나의 누적 · 전시 {result.cumulative.exhibitionCount}곳
        </h3>
        <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
          {result.cumulative.topEmotions
            .map((e) => `${emotionNameKo(e.key as EmotionId)} ${e.count}회`)
            .join(" · ")}
        </p>
        <p className="m-0 text-[13px]" style={{ color: theme.aux }}>
          {result.cumulative.topColors.map((c) => `${c.key} ${c.count}회`).join(" · ")}
        </p>
      </div>

      {!readOnly ? (
        <div className="mt-auto flex flex-col gap-2.5">
          {archived ? (
            <Link
              href="/my-room/archive"
              className="inline-flex h-12 w-full items-center justify-center text-[15px] font-semibold"
              style={{ background: theme.text, color: theme.bg }}
            >
              기록함
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center text-[15px] font-semibold"
              style={{ background: theme.text, color: theme.bg }}
              onClick={onSave}
            >
              마이룸에 저장
            </button>
          )}
          <Link
            href={`/leaflets/${leafletId}/share`}
            className="inline-flex h-12 w-full items-center justify-center border text-[15px] font-medium"
            style={{ borderColor: theme.text, color: theme.text }}
          >
            공유하기
          </Link>
        </div>
      ) : null}
    </div>
  );
}
