"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { recognizedArtworkId } from "@/lib/data";
import { oneParam } from "@/lib/format";

export default function CapturePage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  useVisitGate(id);
  useTitle("촬영");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [denied, setDenied] = useState(false);
  const [live, setLive] = useState(false);
  const count = app.capture?.exhibitionId === id ? app.capture.photos.length : 0;

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
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
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
    if (!video || !video.videoWidth) return;
    const scale = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const index = app.capture?.exhibitionId === id ? app.capture.photos.length : 0;
    app.addPhoto(id, {
      id: `cap-${Date.now()}`,
      url: canvas.toDataURL("image/jpeg", 0.62),
      capturedAt: new Date().toISOString(),
      source: "camera",
      recognizedArtworkId: recognizedArtworkId(id, index),
    });
  }

  return (
    <div className="mx-auto w-full leaflet-col py-6 pb-24">
      <h1 className="display">촬영</h1>
      <div className="relative mt-6 aspect-[3/4] overflow-hidden bg-canvas-dark-deep">
        <span className="pointer-events-none absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-accent" />
        <span className="pointer-events-none absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2 border-accent" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-accent" />
        <span className="pointer-events-none absolute right-3 bottom-3 h-6 w-6 border-r-2 border-b-2 border-accent" />
        <video ref={videoRef} playsInline muted autoPlay className={live ? "h-full w-full object-cover" : "hidden"} />
        {denied ? <p className="absolute inset-x-6 bottom-8 text-center text-[14px] text-mute-on-dark">카메라를 사용할 수 없습니다. 브라우저에서 카메라 권한을 허용해 주세요.</p> : null}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Link href={`/exhibitions/${id}/photos?from=qr`} className="link-accent text-[14px] font-semibold">
          사진 {count}
        </Link>
        <button type="button" className="h-16 w-16 rounded-full border-4 border-accent bg-transparent" aria-label="촬영" disabled={!live} onClick={shoot} />
        <Link href={`/exhibitions/${id}/map?from=qr`} className="link text-[14px] font-semibold">
          배치도
        </Link>
      </div>
    </div>
  );
}
