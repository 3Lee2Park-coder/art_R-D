"use client";

import { Suspense } from "react";
import { LeafletCards } from "@/components/leaflet/LeafletCards";
import type { Leaflet } from "@/lib/types";

/** V-09: 카드 5장만. 세로 티켓 분기 없음 (LEAFLET_CARDS). */
export function LeafletView({ leaflet, readOnly = false }: { leaflet: Leaflet; readOnly?: boolean }) {
  return (
    <Suspense fallback={<div className="min-h-[100svh]" />}>
      <LeafletCards leaflet={leaflet} readOnly={readOnly} />
    </Suspense>
  );
}
