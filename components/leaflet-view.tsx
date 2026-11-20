"use client";

import Link from "next/link";
import { useTitle } from "@/components/ui";
import { useApp } from "@/components/providers";
import { themeById } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { Leaflet } from "@/lib/types";

export function LeafletView({ leaflet, readOnly = false }: { leaflet: Leaflet; readOnly?: boolean }) {
  const app = useApp();
  const exhibition = leaflet.exhibitionId ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId) : undefined;
  const gallery = exhibition?.galleryId ? app.galleries.find((item) => item.id === exhibition.galleryId) : undefined;
  const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
  const venue = exhibition?.venue ?? leaflet.unregisteredVenue ?? "";
  const theme = themeById(leaflet.themeId);
  const archived = app.isArchived(leaflet.id);
  const photo = leaflet.photos[0];
  const pick = leaflet.notes?.onePickArtworkId ? app.artworks.find((item) => item.id === leaflet.notes?.onePickArtworkId) : undefined;
  const recognized = leaflet.photos
    .map((item) => (item.recognizedArtworkId ? app.artworks.find((artwork) => artwork.id === item.recognizedArtworkId) : undefined))
    .find((item) => item);
  const artistSource = pick ?? recognized;
  const artist = artistSource ? app.artists.find((item) => item.id === artistSource.artistId) : undefined;
  const chips = leaflet.notes?.reasonChips ?? [];
  const line = leaflet.notes?.comment ?? leaflet.comment ?? "";
  useTitle(title);

  return (
    <div className="leaflet-stage">
      <div className="leaflet-col py-8 pb-28">
        <article className="ticket-card">
          <div className="ticket-photo">{photo ? <img src={photo.url} alt="" /> : null}</div>
          <h1 className="ticket-title">{title}</h1>
          {gallery ? <p className="ticket-subtitle">{gallery.name}</p> : null}
          <p className="ticket-field-value ticket-field-value--date">{formatDate(leaflet.visitDate)}</p>
          {venue ? <p className="ticket-field-value ticket-field-input ticket-field-input--place">{venue}</p> : null}
          {artist ? <p className="ticket-field-value ticket-field-input ticket-field-input--artist">{artist.name}</p> : null}
          {leaflet.themeId && leaflet.themeId !== "plain" ? (
            <p className="ticket-field-value ticket-field-input ticket-field-input--genre">{theme.name}</p>
          ) : null}
          <div className="ticket-artwork">{pick?.imageUrl ? <img src={pick.imageUrl} alt={pick.title} /> : null}</div>
          {chips[0] ? <p className="ticket-tag ticket-tag--first">{chips[0]}</p> : null}
          {chips[1] ? <p className="ticket-tag ticket-tag--second">{chips[1]}</p> : null}
          {line ? <p className="ticket-one-line">{line}</p> : null}
        </article>

        {!readOnly ? (
          <div className="mt-8 flex flex-col gap-3">
            {leaflet.kind === "visit" ? (
              <Link href={`/leaflets/${leaflet.id}/notes`} className="btn btn-secondary-dark">
                기록 남기기
              </Link>
            ) : null}
            <Link href={`/leaflets/${leaflet.id}/share`} className="btn btn-secondary-dark">
              공유
            </Link>
          </div>
        ) : null}
      </div>

      {!readOnly ? (
        <div className="leaflet-cta">
          {archived ? (
            <Link href="/my-room/archive" className="btn btn-accent w-full">
              기록함
            </Link>
          ) : (
            <button type="button" className="btn btn-accent w-full" onClick={() => app.saveLeaflet(leaflet)}>
              저장
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
