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

function slotWidth(scroller: HTMLDivElement) {
  return scroller.clientWidth;
}

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
      const w = slotWidth(el);
      if (w <= 0) return;
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
      const w = slotWidth(el);
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
    const w = slotWidth(el);
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
    <div
      className="flex h-[100svh] max-h-[100dvh] w-screen items-stretch justify-center overflow-hidden"
      style={{
        background: theme.bg,
        color: theme.text,
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div
        ref={scrollerRef}
        className="flex h-full w-full min-w-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <section
            key={i}
            data-leaflet-card
            className="relative flex h-full w-full shrink-0 snap-center justify-center"
          >
            <div
              className="relative flex h-full w-full min-w-0 flex-col md:w-auto"
              style={{
                width: "100%",
                maxWidth:
                  "min(100%, 480px, calc((100svh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) * 9 / 16))",
                height: "100%",
              }}
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 pb-10">
                {card}
              </div>
              <div
                className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center gap-1.5"
                role="tablist"
                aria-label="카드"
              >
                {Array.from({ length: CARD_COUNT }, (_, di) => (
                  <button
                    key={di}
                    type="button"
                    role="tab"
                    aria-selected={page === di}
                    aria-label={`${di + 1}/5`}
                    className={page === di ? "h-1.5 w-5 rounded-full" : "h-1.5 w-1.5 rounded-full"}
                    style={{
                      background: page === di ? theme.text : theme.aux,
                      opacity: page === di ? 1 : 0.55,
                    }}
                    onClick={() => goTo(di)}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
