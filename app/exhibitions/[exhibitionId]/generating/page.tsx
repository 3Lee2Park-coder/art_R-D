"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { recommendationIds } from "@/lib/data";
import { oneParam, todayISO } from "@/lib/format";
import { SESSION } from "@/lib/storage";
import type { Leaflet } from "@/lib/types";

export default function GeneratingPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const router = useRouter();
  useVisitGate(id);
  useTitle("리플릿");
  const [phase, setPhase] = useState<"wait" | "fail" | "empty">("wait");
  const appRef = useRef(app);
  appRef.current = app;
  const createRef = useRef<(ignoreFail: boolean) => void>(() => undefined);
  createRef.current = (ignoreFail: boolean) => {
    const current = appRef.current;
    const fromQr = new URLSearchParams(window.location.search).get("from") === "qr";
    const exhibition = current.exhibitions.find((item) => item.id === id);
    const allowed = Boolean(
      exhibition && exhibition.status === "contracted" && exhibition.leafletEnabled && !exhibition.ended && (fromQr || current.qrExhibitionId === id),
    );
    if (!allowed) return;
    const photos = current.capture?.exhibitionId === id ? current.capture.photos : [];
    if (photos.length === 0) {
      setPhase("empty");
      return;
    }
    if (!ignoreFail && sessionStorage.getItem(SESSION.failNext) === "1") {
      sessionStorage.removeItem(SESSION.failNext);
      setPhase("fail");
      return;
    }
    const leaflet: Leaflet = {
      id: `visit-${Date.now()}`,
      kind: "visit",
      exhibitionId: id,
      visitDate: todayISO(),
      themeId: current.themeFor(id) ?? "deep",
      photos,
      recommendationArtworkIds: recommendationIds(
        id,
        photos.map((photo) => photo.recognizedArtworkId),
      ),
    };
    current.upsertLeaflet(leaflet);
    current.clearCapture();
    router.replace(`/leaflets/${leaflet.id}`);
  };

  useEffect(() => {
    if (!app.ready) return;
    let cancel = false;
    const timer = window.setTimeout(() => {
      if (!cancel) createRef.current(false);
    }, 1400);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [app.ready, id]);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[480px] flex-col items-center justify-center px-6 text-center">
      {phase === "wait" ? (
        <>
          <div className="spinner" aria-hidden />
          <p className="mt-6 text-[24px] leading-snug font-semibold" aria-live="polite">
            리플릿을 만들고 있습니다
          </p>
        </>
      ) : null}
      {phase === "fail" ? (
        <>
          <p className="text-[24px] leading-snug font-semibold">리플릿을 만들지 못했습니다.</p>
          <p className="mt-3 text-mute-on-dark">촬영한 사진은 그대로 있습니다.</p>
          <button
            type="button"
            className="btn btn-accent mt-8"
            onClick={() => {
              setPhase("wait");
              createRef.current(true);
            }}
          >
            다시 시도
          </button>
        </>
      ) : null}
      {phase === "empty" ? (
        <>
          <p className="text-[24px] font-semibold">촬영한 사진이 없습니다.</p>
          <button type="button" className="btn btn-accent mt-8" onClick={() => router.push(`/exhibitions/${id}/capture?from=qr`)}>
            촬영으로
          </button>
        </>
      ) : null}
    </div>
  );
}
