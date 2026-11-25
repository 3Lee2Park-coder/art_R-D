"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { resolveLeafletTheme } from "@/components/leaflet/theme";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SectionHeader } from "@/components/ui";
import { RESTART_COLORS, type RestartColor } from "@/lib/leaflet/colors";
import {
  themeColorNameForExhibition,
  writeExhibitionThemeColor,
} from "@/lib/leaflet/exhibitionTheme";
import { oneParam } from "@/lib/format";

export default function ExhibitionThemeColorPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find(
    (item) => item.id === id && item.galleryId === app.myGalleryId,
  );
  const contracted = app.role === "gallery-contracted";
  const canEdit =
    contracted &&
    Boolean(exhibition?.leafletEnabled) &&
    exhibition?.status === "contracted";

  const [selectedName, setSelectedName] = useState(() =>
    themeColorNameForExhibition(id, exhibition?.themeColorName),
  );
  const [query, setQuery] = useState("");
  const [tick, setTick] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESTART_COLORS;
    return RESTART_COLORS.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const theme = resolveLeafletTheme(selectedName);

  function pick(color: RestartColor) {
    if (!canEdit) return;
    writeExhibitionThemeColor(id, color);
    setSelectedName(color.name);
    setTick((n) => n + 1);
  }

  if (!exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 테마 색상" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="전시 테마 색상" />

      {!canEdit ? (
        <p className="mb-6 text-[14px] text-mute">리플릿을 제공하는 계약 전시에서만 고를 수 있습니다.</p>
      ) : null}

      <div className="mt-2">
        <SectionHeader title="전시 테마 색상" />
        {!selectedName ? (
          <p className="mb-4 text-[14px]">테마 색상을 선택해 주세요.</p>
        ) : (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className="inline-block h-10 w-10 shrink-0 rounded-sm border border-hairline"
              style={{ background: theme.bg }}
              aria-hidden
            />
            <div>
              <p className="m-0 text-[15px] font-semibold">
                {theme.name}{" "}
                <span className="ml-1 rounded-sm bg-ink/10 px-1.5 py-0.5 text-[12px] font-medium">
                  선택
                </span>
              </p>
              <p className="m-0 text-[13px] text-mute">
                RGB {theme.color.r}, {theme.color.g}, {theme.color.b} · {theme.color.hex}
              </p>
            </div>
          </div>
        )}

        <label className="mb-4 block">
          <span className="sr-only">색상명 검색</span>
          <input
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="색상명 검색"
            disabled={!canEdit}
          />
        </label>

        {filtered.length === 0 ? (
          <p className="text-[14px]">검색된 색상이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
            {filtered.map((color) => {
              const on = color.name === selectedName;
              return (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  disabled={!canEdit}
                  aria-pressed={on}
                  aria-label={color.name}
                  onClick={() => pick(color)}
                  className="relative aspect-square rounded-sm border border-hairline disabled:opacity-50"
                  style={{
                    background: color.hex,
                    outline: on ? `2px solid ${theme.text === "#FFFFFF" ? "#111" : theme.bg}` : undefined,
                    outlineOffset: 2,
                  }}
                >
                  {on ? (
                    <span className="absolute inset-x-0 bottom-0 bg-black/55 px-0.5 py-0.5 text-center text-[9px] text-white">
                      선택
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10" key={tick}>
        <SectionHeader title="리플릿 미리보기" />
        <div
          className="mx-auto w-full max-w-[220px] rounded-sm p-4"
          style={{ background: theme.bg, color: theme.text }}
        >
          <p className="m-0 text-[11px] font-semibold tracking-tight" style={{ color: theme.text }}>
            RestArt
          </p>
          <div
            className="my-3 flex aspect-[3/4] items-center justify-center"
            style={{ border: `1px solid ${theme.border}`, background: `${theme.text}10` }}
          >
            <span className="text-[11px]" style={{ color: theme.aux }}>
              카드 1
            </span>
          </div>
          <p className="m-0 text-[17px] font-bold leading-tight">경이 몰입가</p>
          <p className="mt-1 m-0 text-[12px] leading-snug" style={{ color: theme.aux }}>
            {exhibition.title}
          </p>
        </div>
      </div>

      <p className="mt-8">
        <Link href="/studio" className="link">
          내 전시
        </Link>
      </p>
    </Frame>
  );
}
