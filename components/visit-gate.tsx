"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/components/providers";

export function useVisitGate(exhibitionId: string) {
  const app = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQr = searchParams.get("from") === "qr";

  useEffect(() => {
    if (!app.ready) return;
    if (fromQr) app.markQr(exhibitionId);
    const exhibition = app.exhibitions.find((item) => item.id === exhibitionId);
    const allowed = Boolean(
      exhibition &&
        exhibition.status === "contracted" &&
        exhibition.leafletEnabled &&
        !exhibition.ended &&
        (fromQr || app.qrExhibitionId === exhibitionId),
    );
    if (!allowed) router.replace(`/exhibitions/${exhibitionId}`);
  }, [app.ready, app.exhibitions, app.qrExhibitionId, app.markQr, exhibitionId, fromQr, router]);
}
