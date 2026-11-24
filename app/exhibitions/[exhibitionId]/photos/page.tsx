"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GenerateBlockedAlert } from "@/components/leaflet/GenerateBlockedAlert";
import { RecordSheet } from "@/components/leaflet/RecordSheet";
import { useScenario } from "@/components/leaflet/useScenario";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { canGenerateLeaflet } from "@/lib/leaflet/canGenerate";
import { EMOTION_BY_ID, type EmotionId } from "@/lib/leaflet/emotions";
import { oneParam } from "@/lib/format";

export default function PhotosPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const search = useSearchParams();
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "?from=qr";
  const app = useApp();
  const router = useRouter();
  useVisitGate(id);
  useScenario();
  useTitle("나의 기록");
  const records = app.capture?.exhibitionId === id ? (app.capture.records ?? []) : [];
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [blocked, setBlocked] = useState(false);
  const works = app.artworks.filter((a) => a.exhibitionId === id);
  const editing = editIndex != null ? records[editIndex] : null;
  const artwork = editing
    ? app.artworks.find((a) => a.id === editing.artworkId)
    : null;
  const artist = artwork
    ? app.artists.find((a) => a.id === artwork.artistId)
    : undefined;

  function generate() {
    if (!canGenerateLeaflet(records)) {
      setBlocked(true);
      return;
    }
    router.push(`/exhibitions/${id}/generating${suffix}`);
  }

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 py-6 pb-28">
      <h1 className="display">나의 기록</h1>
      {records.length === 0 ? (
        <p className="mt-6 text-mute-on-dark">기록이 없습니다.</p>
      ) : null}
      <ul className="mt-6 flex list-none flex-col gap-3 p-0">
        {records.map((rec, index) => {
          const aw = app.artworks.find((a) => a.id === rec.artworkId);
          const em =
            rec.emotionId && EMOTION_BY_ID[rec.emotionId as EmotionId]
              ? EMOTION_BY_ID[rec.emotionId as EmotionId]
              : null;
          return (
            <li key={`${rec.artworkId}-${rec.atSec}-${index}`}>
              <button
                type="button"
                className="flex w-full items-center gap-3 bg-transparent text-left"
                onClick={() => {
                  if (!rec.emotionId) setEditIndex(index);
                }}
              >
                <img
                  src={rec.photoUrl || aw?.imageUrl || ""}
                  alt=""
                  className="h-16 w-14 bg-canvas-dark-deep object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{aw?.title ?? rec.artworkId}</span>
                  {em ? (
                    <span
                      className="mt-1 inline-flex rounded-full px-2 py-0.5 text-[12px]"
                      style={{ background: em.displayColor, color: "#111" }}
                    >
                      {em.nameKo}
                    </span>
                  ) : (
                    <span className="mt-1 block text-[12px] text-mute-on-dark">감성 선택</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-col gap-3">
        <Link href={`/exhibitions/${id}/capture${suffix}`} className="btn btn-secondary-dark">
          계속 촬영하기
        </Link>
        <button type="button" className="btn btn-accent" onClick={generate}>
          리플릿 생성하기
        </button>
      </div>

      <RecordSheet
        open={editIndex != null && Boolean(artwork)}
        artwork={artwork ?? null}
        artist={artist}
        mode="camera"
        initialEmotionId={editing?.emotionId ?? null}
        exhibitionArtworks={works}
        onSelectEmotion={(emotionId) => {
          if (editIndex == null) return;
          app.updateRecordEmotion(id, editIndex, emotionId);
          setEditIndex(null);
        }}
        onDismissWithoutEmotion={() => setEditIndex(null)}
        onClose={() => setEditIndex(null)}
      />
      <GenerateBlockedAlert open={blocked} onClose={() => setBlocked(false)} />
    </div>
  );
}
