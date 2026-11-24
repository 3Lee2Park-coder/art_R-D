"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { FloorPlanViewer } from "@/components/leaflet/FloorPlanViewer";
import { RecordSheet } from "@/components/leaflet/RecordSheet";
import { useScenario } from "@/components/leaflet/useScenario";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import type { EmotionId } from "@/lib/leaflet/emotions";
import { formatPrice, oneParam } from "@/lib/format";

export default function MapPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const search = useSearchParams();
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "?from=qr";
  const app = useApp();
  const router = useRouter();
  useVisitGate(id);
  useScenario();
  useTitle("배치도");
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const works = app.artworks.filter((item) => item.exhibitionId === id && item.zone);
  const zones = useMemo(
    () => Array.from(new Set(works.map((item) => item.zone).filter((z): z is string => Boolean(z)))),
    [works],
  );
  const [zone, setZone] = useState("전체");
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const mapSaveIndex = useRef<number | null>(null);
  const visible = works.filter((item) => zone === "전체" || item.zone === zone);
  const artwork = works.find((item) => item.id === selected) ?? null;
  const artist = artwork
    ? app.artists.find((item) => item.id === artwork.artistId)
    : undefined;
  const records = app.capture?.exhibitionId === id ? (app.capture.records ?? []) : [];
  const priorEmotion =
    artwork && records.find((r) => r.artworkId === artwork.id && r.emotionId)?.emotionId;
  const floorPlanUrl = exhibition?.floorPlanUrl ?? null;

  function openSheet(artworkId: string) {
    mapSaveIndex.current = null;
    setSelected(artworkId);
    setSheetOpen(true);
  }

  function closeSheet() {
    mapSaveIndex.current = null;
    setSheetOpen(false);
    setSelected(null);
  }

  function persistMapEmotion(emotionId: EmotionId, descriptionOpened: boolean) {
    if (!artwork) return;
    if (mapSaveIndex.current != null) {
      app.updateRecordEmotion(id, mapSaveIndex.current, emotionId);
      return;
    }
    const atSec = Math.floor(Date.now() / 1000) % 100000;
    const idx = records.length;
    app.addRecord(id, {
      artworkId: artwork.id,
      source: "map",
      atSec,
      movingSec: 0,
      emotionId,
      descriptionOpened,
    });
    mapSaveIndex.current = idx;
  }

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 py-6 pb-28">
      <div className="flex items-center justify-between gap-3">
        <h1 className="display">배치도</h1>
        <Link href={`/exhibitions/${id}/capture${suffix}`} className="link-accent text-[14px] font-semibold">
          촬영
        </Link>
      </div>

      {floorPlanUrl ? (
        <button
          type="button"
          className="mt-5 block w-full overflow-hidden rounded-2xl bg-canvas-dark-deep p-0"
          onClick={() => setPlanOpen(true)}
          aria-label="배치도 확대"
        >
          <img src={floorPlanUrl} alt="" className="h-auto w-full object-cover" />
        </button>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-2">
        {["전체", ...zones].map((item) => (
          <button
            key={item}
            type="button"
            className={item === zone ? "btn btn-accent min-h-16" : "btn btn-secondary-dark min-h-16"}
            onClick={() => setZone(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <ul className="mt-6">
        {visible.map((item) => (
          <li key={item.id} className="border-b border-hairline-on-dark">
            <button
              type="button"
              className="flex w-full items-center gap-3 bg-transparent py-3 text-left"
              onClick={() => openSheet(item.id)}
            >
              <img src={item.imageUrl} alt="" className="h-14 w-12 object-cover" />
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="block text-[14px] text-mute-on-dark">{item.zone}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <RecordSheet
        open={sheetOpen && Boolean(artwork)}
        artwork={artwork}
        artist={artist}
        mode="map"
        initialDescriptionOpen
        initialEmotionId={priorEmotion ?? null}
        exhibitionArtworks={works}
        continueLabel="닫기"
        continueVariant="secondary"
        footer={
          artwork ? (
            <>
              {artwork.priceKrw !== null ? (
                <p className="price-badge m-0">{formatPrice(artwork.priceKrw)}</p>
              ) : null}
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {
                  app.addToCart(artwork.id);
                  router.push("/cart");
                }}
              >
                담기
              </button>
              <Link href={`/artworks/${artwork.id}`} className="btn btn-secondary-dark">
                자세히 보기
              </Link>
            </>
          ) : null
        }
        onSelectEmotion={(emotionId, descriptionOpened) => {
          persistMapEmotion(emotionId, descriptionOpened);
        }}
        onDismissWithoutEmotion={() => closeSheet()}
        onContinue={() => closeSheet()}
        onClose={() => closeSheet()}
      />

      {floorPlanUrl ? (
        <FloorPlanViewer open={planOpen} src={floorPlanUrl} onClose={() => setPlanOpen(false)} />
      ) : null}
    </div>
  );
}
