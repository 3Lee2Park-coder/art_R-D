"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { InquirySheet } from "@/components/leaflet/InquirySheet";
import { NewsSubscribeSheet } from "@/components/leaflet/NewsSubscribeSheet";
import { leafletPillStyle, type LeafletTheme } from "@/components/leaflet/theme";
import { useApp } from "@/components/providers";
import { MockRegion } from "@/components/ui";
import { mockDbWork } from "@/lib/leaflet/demoLeaflets";
import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import { EMOTION_BY_ID, emotionNameKo, type EmotionId } from "@/lib/leaflet/emotions";
import { formatPeriod } from "@/lib/format";
import {
  hasNewsSubscribe,
  recordInquiryOpen,
} from "@/lib/leaflet/inquiry";
import { interestIdsFromWorks } from "@/lib/leaflet/interest";
import type { Exhibition, Gallery } from "@/lib/types";

export function NextCard({
  result,
  theme,
  leafletId,
  exhibitionId,
  nextExhibition,
  nextGallery,
  archived,
  onSave,
  readOnly = false,
  artworkTitles = {},
}: {
  result: LeafletResult;
  theme: LeafletTheme;
  leafletId: string;
  exhibitionId: string;
  nextExhibition?: Exhibition;
  nextGallery?: Gallery;
  archived: boolean;
  onSave: () => void;
  readOnly?: boolean;
  artworkTitles?: Record<string, string>;
}) {
  const app = useApp();
  const [tick, setTick] = useState(0);
  const [newsOpen, setNewsOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const interestIds = useMemo(
    () => interestIdsFromWorks(app.interestWorks, leafletId),
    [app.interestWorks, leafletId],
  );

  const newsOn = useMemo(() => {
    void tick;
    return nextExhibition
      ? hasNewsSubscribe(leafletId, nextExhibition.id)
      : false;
  }, [tick, leafletId, nextExhibition]);

  const recs = result.dbRecommendationIds
    .slice(0, 2)
    .map((id) => mockDbWork(id))
    .filter(Boolean);

  const titles = useMemo(() => {
    const map = { ...artworkTitles };
    for (const id of interestIds) {
      if (!map[id]) map[id] = id;
    }
    return map;
  }, [artworkTitles, interestIds]);

  function openInterestInquiry() {
    recordInquiryOpen({
      leafletId,
      exhibitionId,
      role: app.role,
    });
    setInquiryOpen(true);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <h2
        className="m-0 shrink-0 font-semibold"
        style={{ color: theme.text, fontSize: "clamp(1rem, 2.8svh, 1.375rem)" }}
      >
        다음 감상
      </h2>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto">
        {/* [가안 배치] 다음 전시 정보 옆·아래에 소식 받기 */}
        {nextExhibition ? (
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex gap-3">
              <div
                className="flex w-[22%] max-w-[5.5rem] shrink-0 items-center justify-center overflow-hidden self-stretch"
                style={{
                  border: `1px solid ${theme.border}`,
                  background: `${theme.text}10`,
                  minHeight: "clamp(3.5rem, 10svh, 6rem)",
                }}
              >
                <img
                  src={nextExhibition.posterUrl}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p
                  className="m-0 font-semibold"
                  style={{ color: theme.text, fontSize: "clamp(0.875rem, 2.2svh, 0.9375rem)" }}
                >
                  {nextExhibition.title}
                </p>
                {nextGallery ? (
                  <p
                    className="m-0"
                    style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.75rem)" }}
                  >
                    {nextGallery.name} · {nextGallery.region}
                  </p>
                ) : null}
                <p
                  className="m-0"
                  style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.8svh, 0.75rem)" }}
                >
                  {formatPeriod(nextExhibition.startDate, nextExhibition.endDate)}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-9 w-fit shrink-0 items-center justify-center px-4 font-medium"
              style={{
                ...leafletPillStyle(theme, "secondary"),
                fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)",
              }}
              onClick={() => setNewsOpen(true)}
            >
              {/* [가안] 이미 동의하면 "소식 받는 중" */}
              {newsOn ? "소식 받는 중" : "다음 전시 소식 받기"}
            </button>
          </div>
        ) : null}

        {interestIds.length > 0 ? (
          <button
            type="button"
            className="inline-flex h-9 w-fit shrink-0 items-center justify-center px-4 font-medium"
            style={{
              ...leafletPillStyle(theme, "secondary"),
              fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)",
            }}
            onClick={openInterestInquiry}
          >
            관심 작품 문의하기
          </button>
        ) : null}

        <MockRegion>
          <div className="flex flex-col gap-2">
            <h3
              className="m-0 font-semibold"
              style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
            >
              추천 작품
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {recs.map((work) =>
                work ? (
                  <li key={work.id} className="flex gap-3">
                    <div
                      className="flex size-[clamp(2.5rem,7svh,3rem)] shrink-0 items-center justify-center overflow-hidden"
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
                      <p
                        className="m-0 truncate font-medium"
                        style={{ color: theme.text, fontSize: "clamp(0.75rem, 1.8svh, 0.8125rem)" }}
                      >
                        {work.title}
                      </p>
                      {work.artistName ? (
                        <p
                          className="m-0"
                          style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)" }}
                        >
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
          <h3
            className="m-0 font-semibold"
            style={{ color: theme.text, fontSize: "clamp(0.8125rem, 2svh, 0.875rem)" }}
          >
            나의 누적 · 전시 {result.cumulative.exhibitionCount}곳
          </h3>
          <div className="flex flex-col gap-1.5">
            <p
              className="m-0 font-medium"
              style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)" }}
            >
              Top 감성
            </p>
            <div className="flex flex-wrap gap-2">
              {result.cumulative.topEmotions.map((e) => {
                const em = EMOTION_BY_ID[e.key as EmotionId];
                return (
                  <span
                    key={e.key}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                      fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)",
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
            <p
              className="m-0 font-medium"
              style={{ color: theme.aux, fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)" }}
            >
              Top 색
            </p>
            <div className="flex flex-wrap gap-2">
              {result.cumulative.topColors.map((c) => {
                const swatch = COLOR_BY_NAME[c.key];
                return (
                  <span
                    key={c.key}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                    style={{
                      border: `1px solid ${theme.border}`,
                      color: theme.text,
                      fontSize: "clamp(0.75rem, 1.6svh, 0.75rem)",
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
      </div>

      {!readOnly ? (
        <div className="mt-auto flex shrink-0 flex-col gap-2 pb-3" data-next-cta>
          {archived ? (
            <Link
              href="/my-room/archive"
              className="inline-flex h-11 w-full items-center justify-center font-semibold"
              style={{
                ...leafletPillStyle(theme, "primary"),
                fontSize: "clamp(0.875rem, 2.2svh, 0.9375rem)",
              }}
            >
              기록함
            </Link>
          ) : (
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center font-semibold"
              style={{
                ...leafletPillStyle(theme, "primary"),
                fontSize: "clamp(0.875rem, 2.2svh, 0.9375rem)",
              }}
              onClick={onSave}
            >
              마이룸에 저장
            </button>
          )}
          <Link
            href={`/leaflets/${leafletId}/share`}
            data-share-cta
            className="inline-flex h-11 w-full items-center justify-center font-medium"
            style={{
              ...leafletPillStyle(theme, "secondary"),
              fontSize: "clamp(0.875rem, 2.2svh, 0.9375rem)",
            }}
          >
            공유하기
          </Link>
        </div>
      ) : null}

      {nextExhibition ? (
        <NewsSubscribeSheet
          open={newsOpen}
          onClose={() => setNewsOpen(false)}
          onSuccess={() => setTick((n) => n + 1)}
          theme={theme}
          leafletId={leafletId}
          exhibitionId={nextExhibition.id}
          role={app.role}
        />
      ) : null}

      <InquirySheet
        open={inquiryOpen}
        onClose={() => {
          setInquiryOpen(false);
          setTick((n) => n + 1);
        }}
        theme={theme}
        leafletId={leafletId}
        exhibitionId={exhibitionId}
        inquiredArtworkIds={interestIds}
        artworkTitles={titles}
        role={app.role}
      />
    </div>
  );
}
