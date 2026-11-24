"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GenerateBlockedAlert } from "@/components/leaflet/GenerateBlockedAlert";
import { RecordSheet } from "@/components/leaflet/RecordSheet";
import { useScenario } from "@/components/leaflet/useScenario";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { canGenerateLeaflet } from "@/lib/leaflet/canGenerate";
import type { EmotionId } from "@/lib/leaflet/emotions";
import { mockRecognize } from "@/lib/leaflet/mockRecognition";
import { oneParam } from "@/lib/format";
import type { Artwork } from "@/lib/types";

export default function CapturePage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const search = useSearchParams();
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "?from=qr";
  const app = useApp();
  const router = useRouter();
  const scenario = useScenario();
  useVisitGate(id);
  useTitle("촬영");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const savedWhileOpen = useRef(false);
  const [denied, setDenied] = useState(false);
  const [live, setLive] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, setPending] = useState<{
    artwork: Artwork;
    photoUrl: string;
    atSec: number;
    movingSec: number;
  } | null>(null);
  const [fly, setFly] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const records = app.capture?.exhibitionId === id ? (app.capture.records ?? []) : [];
  const count = records.length;
  const lastThumb =
    [...records].reverse().find((r) => r.photoUrl || r.artworkId)?.photoUrl ??
    app.artworks.find(
      (a) => a.id === [...records].reverse().find((r) => r.source === "camera")?.artworkId,
    )?.imageUrl ??
    null;
  const works = app.artworks.filter((a) => a.exhibitionId === id && a.zone);
  const pendingArtist = pending
    ? app.artists.find((a) => a.id === pending.artwork.artistId)
    : undefined;

  useEffect(() => {
    let cancelled = false;
    async function open() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setDenied(true);
        return;
      }
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setLive(true);
      } catch {
        if (!cancelled) setDenied(true);
      }
    }
    void open();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function shoot() {
    const video = videoRef.current;
    let photoUrl = "";
    if (video && video.videoWidth) {
      const scale = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoUrl = canvas.toDataURL("image/jpeg", 0.62);
      }
    }
    const cameraIndex = app.capture?.exhibitionId === id ? (app.capture.cameraIndex ?? 0) : 0;
    const mock = mockRecognize(scenario, cameraIndex);
    const artwork =
      app.artworks.find((a) => a.id === mock.artworkId) ??
      works[0] ??
      null;
    if (!artwork) return;
    savedWhileOpen.current = false;
    setPending({
      artwork,
      photoUrl: photoUrl || artwork.imageUrl,
      atSec: mock.atSec,
      movingSec: mock.movingSec,
    });
    setSheetOpen(true);
  }

  function persist(
    emotionId: string | null,
    descriptionOpened: boolean,
    artworkOverride?: Artwork,
  ) {
    if (!pending) return;
    const artwork = artworkOverride ?? pending.artwork;
    const photo = {
      id: `cap-${Date.now()}`,
      url: pending.photoUrl,
      capturedAt: new Date().toISOString(),
      source: "camera" as const,
      recognizedArtworkId: artwork.id,
    };
    app.addRecord(
      id,
      {
        artworkId: artwork.id,
        source: "camera",
        atSec: pending.atSec,
        movingSec: pending.movingSec,
        emotionId,
        descriptionOpened,
        photoUrl: pending.photoUrl,
      },
      photo,
    );
    savedWhileOpen.current = true;
  }

  function closeWithFly() {
    if (pending) {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) setFly(pending.photoUrl);
      setTimeout(() => setFly(null), reduce ? 0 : 450);
    }
    setSheetOpen(false);
    setPending(null);
    savedWhileOpen.current = false;
  }

  function commit(
    emotionId: string | null,
    descriptionOpened: boolean,
    artworkOverride?: Artwork,
  ) {
    persist(emotionId, descriptionOpened, artworkOverride);
    closeWithFly();
  }

  function generate() {
    if (!canGenerateLeaflet(records)) {
      setBlocked(true);
      return;
    }
    router.push(`/exhibitions/${id}/generating${suffix}`);
  }

  return (
    <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[480px] flex-col px-4 pb-6 pt-4">
      <div className="flex shrink-0 items-center justify-between">
        <p className="m-0 text-[14px] font-semibold">기록 {count}점</p>
        <button type="button" className="link-accent bg-transparent text-[14px] font-semibold" onClick={generate}>
          리플릿 생성하기
        </button>
      </div>

      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden bg-canvas-dark-deep">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={live ? "h-full w-full object-cover" : "hidden"}
        />
        {denied ? (
          <p className="absolute inset-x-6 bottom-8 text-center text-[14px] text-mute-on-dark">
            카메라를 사용할 수 없습니다. 브라우저에서 카메라 권한을 허용해 주세요.
          </p>
        ) : null}
        {!live && !denied ? (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-mute-on-dark">
            카메라 준비 중
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <Link
          href={`/exhibitions/${id}/photos${suffix}`}
          className="relative flex w-20 flex-col items-center gap-1 text-[12px] text-mute-on-dark"
        >
          <span className="relative block h-14 w-12 overflow-hidden bg-canvas-dark-deep">
            {lastThumb ? (
              <img src={lastThumb} alt="" className="h-full w-full object-cover" />
            ) : null}
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-ink">
                {count}
              </span>
            ) : null}
          </span>
          나의 기록
        </Link>
        <button
          type="button"
          className="h-16 w-16 shrink-0 rounded-full border-4 border-accent bg-transparent"
          aria-label="촬영"
          onClick={shoot}
        />
        <Link
          href={`/exhibitions/${id}/map${suffix}`}
          className="flex w-20 flex-col items-center gap-1 text-[12px] text-mute-on-dark"
        >
          <span className="flex h-14 w-12 items-center justify-center border border-hairline-on-dark text-[18px]">
            ▦
          </span>
          배치도
        </Link>
      </div>

      {fly ? (
        <img
          src={fly}
          alt=""
          className="pointer-events-none fixed z-50 h-14 w-12 object-cover"
          style={{
            left: "50%",
            bottom: "20%",
            animation: "leaflet-fly-thumb 0.45s ease-in forwards",
          }}
        />
      ) : null}
      <style>{`
        @keyframes leaflet-fly-thumb {
          to { transform: translate(-42vw, 28vh) scale(0.7); opacity: 0.2; }
        }
      `}</style>

      <RecordSheet
        open={sheetOpen}
        artwork={pending?.artwork ?? null}
        artist={pendingArtist}
        mode="camera"
        exhibitionArtworks={works}
        onPickArtwork={(artworkId) => {
          const next = works.find((a) => a.id === artworkId);
          if (next && pending) setPending({ ...pending, artwork: next });
        }}
        onSelectEmotion={(emotionId: EmotionId, descriptionOpened) => {
          if (descriptionOpened) {
            persist(emotionId, true);
            return;
          }
          commit(emotionId, false);
        }}
        onDismissWithoutEmotion={(descriptionOpened) => {
          if (savedWhileOpen.current) return;
          persist(null, descriptionOpened);
        }}
        onContinue={() => {
          if (!savedWhileOpen.current) persist(null, true);
          closeWithFly();
        }}
        onClose={() => {
          if (!savedWhileOpen.current && pending) persist(null, false);
          setSheetOpen(false);
          setPending(null);
          savedWhileOpen.current = false;
        }}
      />

      <GenerateBlockedAlert open={blocked} onClose={() => setBlocked(false)} />
    </div>
  );
}
