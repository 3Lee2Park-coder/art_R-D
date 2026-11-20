"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CoverCard } from "@/components/leaflet/CoverCard";
import { EmotionsCard } from "@/components/leaflet/EmotionsCard";
import { ExhibitionEmotionsCard } from "@/components/leaflet/ExhibitionEmotionsCard";
import { NextCard } from "@/components/leaflet/NextCard";
import { RecordsCard } from "@/components/leaflet/RecordsCard";
import { resolveLeafletTheme } from "@/components/leaflet/theme";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import { isDemoLeafletId } from "@/lib/leaflet/demoLeaflets";
import type { Leaflet } from "@/lib/types";

const CARD_COUNT = 5;

export function LeafletCards({ leaflet, readOnly = false }: { leaflet: Leaflet; readOnly?: boolean }) {
  const app = useApp();
  const search = useSearchParams();
  const result = leaflet.result;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const exhibition = leaflet.exhibitionId
    ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId)
    : undefined;
  const gallery = exhibition?.galleryId
    ? app.galleries.find((item) => item.id === exhibition.galleryId)
    : undefined;
  const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
  useTitle(title);

  const themeQuery = search.get("theme");
  const themeName =
    isDemoLeafletId(leaflet.id) && themeQuery && COLOR_BY_NAME[themeQuery]
      ? themeQuery
      : leaflet.themeColor ?? "Persian Indigo";
  const theme = resolveLeafletTheme(themeName);

  const showArtists = (() => {
    if (!leaflet.exhibitionId) return "";
    const works = app.artworks.filter((a) => a.exhibitionId === leaflet.exhibitionId);
    const ids = [...new Set(works.map((w) => w.artistId))];
    const names = ids
      .map((id) => app.artists.find((a) => a.id === id)?.name)
      .filter((n): n is string => Boolean(n));
    if (names.length === 0) return "";
    const shown = names.slice(0, 3);
    const rest = names.length - shown.length;
    return rest > 0 ? `${shown.join(", ")} 외 ${rest}명` : shown.join(", ");
  })();

  const galleryLine =
    gallery && gallery.region ? `${gallery.name} · ${gallery.region}` : gallery?.name ?? "";

  const similarArtwork = result
    ? app.artworks.find((a) => a.id === result.similar.artworkId)
    : undefined;
  const similarArtist = similarArtwork
    ? app.artists.find((a) => a.id === similarArtwork.artistId)
    : undefined;

  const nextExhibitionId = app.recommendedExhibitionIds[0];
  const nextExhibition = nextExhibitionId
    ? app.exhibitions.find((e) => e.id === nextExhibitionId)
    : undefined;
  const nextGallery = nextExhibition?.galleryId
    ? app.galleries.find((g) => g.id === nextExhibition.galleryId)
    : undefined;

  const imageUrl =
    leaflet.myPhotoUrl ??
    result?.representative.url ??
    (result?.similar.artworkId
      ? app.artworks.find((a) => a.id === result.similar.artworkId)?.imageUrl
      : null) ??
    null;

  const comment = leaflet.notes?.comment ?? leaflet.comment;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.querySelector<HTMLElement>("[data-leaflet-card]");
      if (!card) return;
      const w = card.offsetWidth + 16;
      const next = Math.round(el.scrollLeft / w);
      setPage(Math.max(0, Math.min(CARD_COUNT - 1, next)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const el = scrollerRef.current;
      if (!el) return;
      const card = el.querySelector<HTMLElement>("[data-leaflet-card]");
      if (!card) return;
      const w = card.offsetWidth + 16;
      const target =
        e.key === "ArrowRight"
          ? Math.min(CARD_COUNT - 1, page + 1)
          : Math.max(0, page - 1);
      el.scrollTo({ left: target * w, behavior: "smooth" });
      setPage(target);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-leaflet-card]");
    if (!card) return;
    const w = card.offsetWidth + 16;
    el.scrollTo({ left: i * w, behavior: "smooth" });
    setPage(i);
  };

  if (!result) {
    return (
      <div className="px-6 py-10" style={{ background: theme.bg, color: theme.text }}>
        <p>리플릿 결과가 없습니다.</p>
      </div>
    );
  }

  const cards = [
    <CoverCard
      key="cover"
      result={result}
      theme={theme}
      visitDate={leaflet.visitDate}
      exhibitionTitle={title}
      galleryLine={galleryLine}
      artistLine={showArtists}
      imageUrl={imageUrl}
    />,
    <RecordsCard
      key="records"
      result={result}
      theme={theme}
      records={leaflet.records ?? []}
      artworks={app.artworks}
      artists={app.artists}
      comment={comment}
    />,
    <EmotionsCard
      key="emotions"
      result={result}
      theme={theme}
      similarArtwork={similarArtwork}
      similarArtist={similarArtist}
    />,
    <ExhibitionEmotionsCard
      key="exhibition"
      result={result}
      theme={theme}
      exhibitionId={leaflet.exhibitionId}
    />,
    <NextCard
      key="next"
      result={result}
      theme={theme}
      leafletId={leaflet.id}
      nextExhibition={nextExhibition}
      nextGallery={nextGallery}
      archived={app.isArchived(leaflet.id)}
      onSave={() => app.saveLeaflet(leaflet)}
      readOnly={readOnly}
    />,
  ];

  return (
    <div className="min-h-[100svh] pb-10" style={{ background: theme.bg, color: theme.text }}>
      <div className="mx-auto w-full max-w-[480px] px-6 pt-6">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, i) => (
            <section
              key={i}
              data-leaflet-card
              className="w-[min(100%,calc(100vw-48px))] max-w-[432px] shrink-0 snap-center"
              style={{ aspectRatio: "9 / 16" }}
            >
              {card}
            </section>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-2" role="tablist" aria-label="카드">
          {Array.from({ length: CARD_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={page === i}
              aria-label={`${i + 1}/5`}
              className="h-2 w-2 rounded-full"
              style={{
                background: page === i ? theme.text : theme.aux,
                opacity: page === i ? 1 : 0.5,
              }}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
