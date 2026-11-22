"use client";

import { EMOTIONS, type EmotionId } from "@/lib/leaflet/emotions";
import type { LeafletTheme } from "@/components/leaflet/theme";

/** 15감성 원형 지도 — 가운데에서 뻗는 뾰족한 꽃잎 (LEAFLET_CARDS 카드 3) */
export function EmotionMap({
  counts,
  theme,
}: {
  counts: Record<EmotionId, number>;
  theme: LeafletTheme;
}) {
  const max = Math.max(1, ...EMOTIONS.map((e) => counts[e.id] ?? 0));
  const cx = 150;
  const cy = 150;
  const hub = 14;
  const minLen = 58;
  const maxLen = 98;
  const n = EMOTIONS.length;
  const slice = (Math.PI * 2) / n;

  return (
    <svg viewBox="0 0 300 300" className="mx-auto block h-auto w-full max-w-[300px]" aria-hidden>
      {EMOTIONS.map((emotion, i) => {
        const count = counts[emotion.id] ?? 0;
        const selected = count > 0;
        const t = count / max;
        const len = selected ? minLen + (maxLen - minLen) * t : minLen;
        const mid = -Math.PI / 2 + i * slice + slice / 2;
        const half = slice * 0.38;
        const path = sharpPetal(cx, cy, hub, len, mid, half);
        const labelR = maxLen + 22;
        const lx = cx + Math.cos(mid) * labelR;
        const ly = cy + Math.sin(mid) * labelR;
        return (
          <g key={emotion.id}>
            <path
              d={path}
              fill={selected ? emotion.displayColor : "transparent"}
              stroke={selected ? emotion.displayColor : theme.aux}
              strokeWidth={selected ? 0.5 : 1.2}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={theme.text}
              fontSize="10"
              fontWeight={selected ? 600 : 400}
              opacity={selected ? 1 : 0.75}
            >
              {emotion.nameKo}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={hub - 2} fill={theme.bg} stroke={theme.aux} strokeWidth={1} />
    </svg>
  );
}

/** 중심에서 tip까지 뾰족한 꽃잎 (양옆 기점 → tip) */
function sharpPetal(
  cx: number,
  cy: number,
  hub: number,
  length: number,
  angle: number,
  halfWidth: number,
): string {
  const tipX = cx + Math.cos(angle) * length;
  const tipY = cy + Math.sin(angle) * length;
  const left = angle - halfWidth;
  const right = angle + halfWidth;
  const lx = cx + Math.cos(left) * hub;
  const ly = cy + Math.sin(left) * hub;
  const rx = cx + Math.cos(right) * hub;
  const ry = cy + Math.sin(right) * hub;
  // 살짝 바깥으로 볼록한 옆선 → tip에서 모이도록
  const bulge = length * 0.55;
  const blx = cx + Math.cos(angle - halfWidth * 0.55) * bulge;
  const bly = cy + Math.sin(angle - halfWidth * 0.55) * bulge;
  const brx = cx + Math.cos(angle + halfWidth * 0.55) * bulge;
  const bry = cy + Math.sin(angle + halfWidth * 0.55) * bulge;
  return `M ${lx} ${ly} Q ${blx} ${bly} ${tipX} ${tipY} Q ${brx} ${bry} ${rx} ${ry} Z`;
}
