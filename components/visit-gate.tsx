"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/components/providers";
import { hasVisitAccess, readVisitConsent } from "@/lib/leaflet/visitConsent";
import { SESSION } from "@/lib/storage";

export function useVisitGate(exhibitionId: string) {
  const app = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromQr = searchParams.get("from") === "qr";
  const onConsent = pathname?.endsWith("/consent") ?? false;

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
    if (!allowed) {
      router.replace(`/exhibitions/${exhibitionId}`);
      return;
    }
    if (onConsent) return;

    const visitId =
      (app.capture?.exhibitionId === exhibitionId && app.capture.visitId) ||
      (typeof sessionStorage !== "undefined" ? sessionStorage.getItem(SESSION.visitId) : null);
    const ok = hasVisitAccess({
      visitId,
      memberConsentVersion: app.consentVersion,
      visitConsent: readVisitConsent(),
    });
    if (!ok) {
      const qs = searchParams.toString();
      const suffix = qs ? `?${qs}` : "?from=qr";
      router.replace(`/exhibitions/${exhibitionId}/consent${suffix}`);
    }
  }, [
    app.ready,
    app.exhibitions,
    app.qrExhibitionId,
    app.markQr,
    app.capture,
    app.consentVersion,
    exhibitionId,
    fromQr,
    onConsent,
    router,
    searchParams,
  ]);
}
