"use client";

import { EMOTIONS, type EmotionId } from "@/lib/leaflet/emotions";
import type { LeafletTheme } from "@/components/leaflet/theme";

/** 15감성 원형 지도 — 6계열 꽃잎, 고른 횟수만큼 길이 (LEAFLET_CARDS 카드 3) */
export function EmotionMap({
  counts,
  theme,
}: {
  counts: Record<EmotionId, number>;
  theme: LeafletTheme;
}) {
  const max = Math.max(1, ...EMOTIONS.map((e) => counts[e.id] ?? 0));
  const cx = 120;
  const cy = 120;
  const inner = 28;
  const minOuter = 52;
  const maxOuter = 108;
  const n = EMOTIONS.length;
  const slice = (Math.PI * 2) / n;

  return (
    <svg viewBox="0 0 240 240" className="mx-auto block h-auto w-full max-w-[280px]" aria-hidden>
      {EMOTIONS.map((emotion, i) => {
        const count = counts[emotion.id] ?? 0;
        const selected = count > 0;
        const t = count / max;
        const outer = selected ? minOuter + (maxOuter - minOuter) * t : minOuter;
        const a0 = -Math.PI / 2 + i * slice;
        const a1 = a0 + slice * 0.92;
        const mid = (a0 + a1) / 2;
        const path = petalPath(cx, cy, inner, outer, a0, a1);
        const labelR = outer + 10;
        const lx = cx + Math.cos(mid) * labelR;
        const ly = cy + Math.sin(mid) * labelR;
        return (
          <g key={emotion.id}>
            <path
              d={path}
              fill={selected ? emotion.displayColor : "transparent"}
              stroke={selected ? emotion.displayColor : theme.aux}
              strokeWidth={selected ? 0 : 1.25}
            />
            {selected ? (
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={theme.text}
                fontSize="9"
                fontWeight={600}
              >
                {emotion.nameKo}
              </text>
            ) : null}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={inner - 4} fill={theme.bg} stroke={theme.aux} strokeWidth={1} />
    </svg>
  );
}

function petalPath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  a0: number,
  a1: number,
): string {
  const x0 = cx + Math.cos(a0) * inner;
  const y0 = cy + Math.sin(a0) * inner;
  const x1 = cx + Math.cos(a0) * outer;
  const y1 = cy + Math.sin(a0) * outer;
  const x2 = cx + Math.cos(a1) * outer;
  const y2 = cy + Math.sin(a1) * outer;
  const x3 = cx + Math.cos(a1) * inner;
  const y3 = cy + Math.sin(a1) * inner;
  const mid = (a0 + a1) / 2;
  const tip = outer + 6;
  const tx = cx + Math.cos(mid) * tip;
  const ty = cy + Math.sin(mid) * tip;
  return `M ${x0} ${y0} L ${x1} ${y1} Q ${tx} ${ty} ${x2} ${y2} L ${x3} ${y3} Z`;
}
