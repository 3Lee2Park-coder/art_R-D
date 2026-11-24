"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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
  const works = app.artworks.filter((item) => item.exhibitionId === id && item.zone);
  const zones = useMemo(
    () => Array.from(new Set(works.map((item) => item.zone).filter((z): z is string => Boolean(z)))),
    [works],
  );
  const [zone, setZone] = useState("전체");
  const [selected, setSelected] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const visible = works.filter((item) => zone === "전체" || item.zone === zone);
  const artwork = works.find((item) => item.id === selected) ?? null;
  const artist = artwork
    ? app.artists.find((item) => item.id === artwork.artistId)
    : undefined;

  function openSheet(artworkId: string) {
    setSelected(artworkId);
    setSheetOpen(true);
  }

  function saveMap(emotionId: EmotionId | null, descriptionOpened: boolean) {
    if (!artwork || !emotionId) {
      setSheetOpen(false);
      setSelected(null);
      return;
    }
    const atSec = Math.floor(Date.now() / 1000) % 100000;
    app.addRecord(id, {
      artworkId: artwork.id,
      source: "map",
      atSec,
      movingSec: 0,
      emotionId,
      descriptionOpened,
    });
    setSheetOpen(false);
    setSelected(null);
  }

  return (
    <div className="mx-auto w-full max-w-[480px] px-4 py-6 pb-28">
      <div className="flex items-center justify-between gap-3">
        <h1 className="display">배치도</h1>
        <Link href={`/exhibitions/${id}/capture${suffix}`} className="link-accent text-[14px] font-semibold">
          촬영
        </Link>
      </div>
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
        exhibitionArtworks={works}
        continueLabel="닫기"
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
          saveMap(emotionId, descriptionOpened);
        }}
        onDismissWithoutEmotion={() => {
          setSheetOpen(false);
          setSelected(null);
        }}
        onContinue={() => {
          setSheetOpen(false);
          setSelected(null);
        }}
        onClose={() => {
          setSheetOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}
