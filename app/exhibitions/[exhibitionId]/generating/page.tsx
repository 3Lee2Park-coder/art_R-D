"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GenerateBlockedAlert } from "@/components/leaflet/GenerateBlockedAlert";
import { useScenario } from "@/components/leaflet/useScenario";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { canGenerateLeaflet, GENERATE_BLOCKED_MESSAGE } from "@/lib/leaflet/canGenerate";
import {
  createVisitLeaflet,
  LeafletBlockedError,
} from "@/lib/leaflet/createVisitLeaflet";
import { themeColorNameForExhibition } from "@/lib/leaflet/exhibitionTheme";
import { oneParam, todayISO } from "@/lib/format";
import { SESSION } from "@/lib/storage";
import { newVisitId } from "@/lib/leaflet/visitSession";

export default function GeneratingPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const search = useSearchParams();
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "?from=qr";
  const app = useApp();
  const router = useRouter();
  const scenario = useScenario();
  useVisitGate(id);
  useTitle("리플릿");
  const [phase, setPhase] = useState<"wait" | "fail" | "blocked">("wait");
  const [blockedOpen, setBlockedOpen] = useState(false);
  const appRef = useRef(app);
  appRef.current = app;
  const scenarioRef = useRef(scenario);
  scenarioRef.current = scenario;

  const createRef = useRef<(ignoreFail: boolean) => void>(() => undefined);
  createRef.current = (ignoreFail: boolean) => {
    const current = appRef.current;
    const fromQr = new URLSearchParams(window.location.search).get("from") === "qr";
    const exhibition = current.exhibitions.find((item) => item.id === id);
    const allowed = Boolean(
      exhibition &&
        exhibition.status === "contracted" &&
        exhibition.leafletEnabled &&
        !exhibition.ended &&
        (fromQr || current.qrExhibitionId === id),
    );
    if (!allowed) return;

    const capture = current.capture?.exhibitionId === id ? current.capture : null;
    const records = capture?.records ?? [];
    if (!canGenerateLeaflet(records) || records.length === 0) {
      setPhase("blocked");
      setBlockedOpen(true);
      return;
    }

    if (!ignoreFail && sessionStorage.getItem(SESSION.failNext) === "1") {
      sessionStorage.removeItem(SESSION.failNext);
      setPhase("fail");
      return;
    }

    const visitId =
      capture?.visitId ||
      sessionStorage.getItem(SESSION.visitId) ||
      newVisitId();
    sessionStorage.setItem(SESSION.visitId, visitId);

    try {
      const leaflet = createVisitLeaflet({
        visitId,
        exhibitionId: id,
        records,
        photos: capture?.photos ?? [],
        scenarioId: scenarioRef.current,
        themeColor: themeColorNameForExhibition(id, exhibition?.themeColorName),
        visitDate: todayISO(),
        history: [],
      });
      current.upsertLeaflet(leaflet);
      current.clearCapture();
      router.replace(`/leaflets/${leaflet.id}`);
    } catch (err) {
      if (err instanceof LeafletBlockedError) {
        setPhase("blocked");
        setBlockedOpen(true);
        return;
      }
      setPhase("fail");
    }
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

  function goHub() {
    setBlockedOpen(false);
    router.replace(`/exhibitions/${id}/hub${suffix}`);
  }

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
      {phase === "blocked" ? (
        <p className="text-[15px] text-mute-on-dark">{GENERATE_BLOCKED_MESSAGE}</p>
      ) : null}

      <GenerateBlockedAlert
        open={blockedOpen}
        onClose={() => {
          goHub();
        }}
      />
    </div>
  );
}
