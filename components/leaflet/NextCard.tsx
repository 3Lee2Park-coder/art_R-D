"use client";

import Link from "next/link";
import { leafletPillStyle, type LeafletTheme } from "@/components/leaflet/theme";
import { MockRegion } from "@/components/ui";
import { mockDbWork } from "@/lib/leaflet/demoLeaflets";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import { EMOTION_BY_ID, emotionNameKo, type EmotionId } from "@/lib/leaflet/emotions";
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
  const recs = result.dbRecommendationIds
    .slice(0, 2)
    .map((id) => mockDbWork(id))
    .filter(Boolean);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-1 pb-1 pt-1">
      <h2 className="m-0 shrink-0 text-[22px] font-semibold" style={{ color: theme.text }}>
        다음 감상
      </h2>

      {nextExhibition ? (
        <div className="flex shrink-0 gap-3">
          <div
            className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden"
            style={{
              border: `1px solid ${theme.border}`,
              background: `${theme.text}10`,
            }}
          >
            <img
              src={nextExhibition.posterUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
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
                    className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden"
                    style={{
                      background: `${theme.text}10`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {work.imageUrl ? (
                      <img
                        src={work.imageUrl}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : null}
                  </div>
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

      <div className="flex flex-col gap-2.5">
        <h3 className="m-0 text-[14px] font-semibold" style={{ color: theme.text }}>
          나의 누적 · 전시 {result.cumulative.exhibitionCount}곳
        </h3>
        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-[12px] font-medium" style={{ color: theme.aux }}>
            Top 감성
          </p>
          <div className="flex flex-wrap gap-2">
            {result.cumulative.topEmotions.map((e) => {
              const em = EMOTION_BY_ID[e.key as EmotionId];
              return (
                <span
                  key={e.key}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]"
                  style={{
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: em?.displayColor ?? theme.text }}
                  />
                  {emotionNameKo(e.key as EmotionId)} {e.count}회
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-[12px] font-medium" style={{ color: theme.aux }}>
            Top 색
          </p>
          <div className="flex flex-wrap gap-2">
            {result.cumulative.topColors.map((c) => {
              const swatch = COLOR_BY_NAME[c.key];
              return (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]"
                  style={{
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                >
                  <span
                    className="h-2.5 w-2.5"
                    style={{
                      background: swatch?.hex ?? theme.text,
                      border: `1px solid ${theme.border}`,
                    }}
                  />
                  {c.key} {c.count}회
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {!readOnly ? (
        <div className="mt-auto flex shrink-0 flex-col gap-2.5">
          {archived ? (
            <Link
              href="/my-room/archive"
              className="inline-flex h-11 w-full items-center justify-center text-[15px] font-semibold"
              style={leafletPillStyle(theme, "primary")}
            >
              기록함
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center text-[15px] font-semibold"
              style={leafletPillStyle(theme, "primary")}
              onClick={onSave}
            >
              마이룸에 저장
            </button>
          )}
          <Link
            href={`/leaflets/${leafletId}/share`}
            className="inline-flex h-11 w-full items-center justify-center text-[15px] font-medium"
            style={leafletPillStyle(theme, "secondary")}
          >
            공유하기
          </Link>
        </div>
      ) : null}
    </div>
  );
}
