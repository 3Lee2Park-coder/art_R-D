"use client";

import { useMemo, useState } from "react";
import { resolveLeafletTheme } from "@/components/leaflet/theme";
import { RESTART_COLORS, type RestartColor } from "@/lib/leaflet/colors";

/** 4B 65색 팔레트 선택 (검색 + 격자). 전시 등록 1단계·테마 색 화면 공용. */
export function ThemeColorPicker({
  selectedName,
  onPick,
  disabled = false,
}: {
  selectedName: string | null | undefined;
  onPick: (color: RestartColor) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const theme = resolveLeafletTheme(selectedName ?? undefined);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESTART_COLORS;
    return RESTART_COLORS.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <label className="mb-4 block">
        <span className="sr-only">색상명 검색</span>
        <input
          className="field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="색상명 검색"
          disabled={disabled}
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
                disabled={disabled}
                aria-pressed={on}
                aria-label={color.name}
                onClick={() => onPick(color)}
                className="relative aspect-square rounded-sm border border-hairline disabled:opacity-50"
                style={{
                  background: color.hex,
                  outline: on
                    ? `2px solid ${theme.text === "#FFFFFF" ? "#111" : theme.bg}`
                    : undefined,
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
    </>
  );
}
