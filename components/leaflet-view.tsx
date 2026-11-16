"use client";

import Link from "next/link";
import { MockRegion, useTitle } from "@/components/ui";
import { useApp } from "@/components/providers";
import { themeById } from "@/lib/constants";
import { formatClock, formatDate, formatPeriod } from "@/lib/format";
import type { Leaflet } from "@/lib/types";

export function LeafletView({ leaflet, readOnly = false }: { leaflet: Leaflet; readOnly?: boolean }) {
  const app = useApp();
  const exhibition = leaflet.exhibitionId ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId) : undefined;
  const gallery = exhibition?.galleryId ? app.galleries.find((item) => item.id === exhibition.galleryId) : undefined;
  const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
  const venue = exhibition?.venue ?? leaflet.unregisteredVenue;
  const start = exhibition?.startDate ?? leaflet.unregisteredStart;
  const end = exhibition?.endDate ?? leaflet.unregisteredEnd;
  const theme = themeById(leaflet.themeId);
  const archived = app.isArchived(leaflet.id);
  useTitle(title);

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 pb-24">
      <article className="ticket">
        <div className="h-1.5" style={{ background: theme.bar }} />
        <div className="px-5 py-6">
          <p className="text-[12px] font-semibold text-accent">RestArt</p>
          <h1 className="mt-3 text-[34px] leading-[1.35] font-semibold">{title}</h1>
          {gallery ? <p className="mt-3 text-[14px] text-mute-on-dark">{gallery.name}</p> : null}
          {venue ? <p className="text-[14px] text-mute-on-dark">{venue}</p> : null}
          {start && end ? <p className="mt-4 text-[14px]">{formatPeriod(start, end)}</p> : null}
          <p className="mt-1 text-[14px]">방문 {formatDate(leaflet.visitDate)}</p>
          {leaflet.themeId && leaflet.themeId !== "plain" ? (
            <p className="mt-4 text-[14px]">
              <MockRegion>
                <span>테마 {theme.name}</span>
              </MockRegion>
            </p>
          ) : null}
        </div>
      </article>

      {leaflet.kind === "visit" ? (
        <section className="mt-10">
          <h2 className="text-[21px] font-semibold">본 순서</h2>
          <ol className="mt-5 flex flex-col gap-8">
            {leaflet.photos.map((photo, index) => {
              const artwork = photo.recognizedArtworkId ? app.artworks.find((item) => item.id === photo.recognizedArtworkId) : undefined;
              return (
                <li key={photo.id}>
                  <p className="text-[12px] font-semibold text-accent">{String(index + 1).padStart(2, "0")}</p>
                  <img src={photo.url} alt="" className="photo-shadow mt-2 aspect-[4/5] w-full bg-canvas-dark-deep object-contain" />
                  <p className="mt-2 text-[14px] text-mute-on-dark">{formatClock(photo.capturedAt)}</p>
                  {artwork ? (
                    <MockRegion>
                      <Link href={`/artworks/${artwork.id}`} className="link mt-1 inline-block font-semibold">
                        {artwork.title}
                      </Link>
                    </MockRegion>
                  ) : null}
                  {photo.source === "upload" ? <p className="mt-1 text-[14px] text-mute-on-dark">업로드 사진</p> : null}
                </li>
              );
            })}
          </ol>
          {leaflet.notes && (leaflet.notes.comment || leaflet.notes.onePickArtworkId || leaflet.notes.reasonChips?.length) ? (
            <div className="mt-8 border-t border-hairline-on-dark pt-5">
              {leaflet.notes.onePickArtworkId ? (
                <p>{app.artworks.find((item) => item.id === leaflet.notes?.onePickArtworkId)?.title}</p>
              ) : null}
              {leaflet.notes.reasonChips?.length ? <p className="text-[14px] text-mute-on-dark">{leaflet.notes.reasonChips.join(" · ")}</p> : null}
              {leaflet.notes.comment ? <p className="mt-2">{leaflet.notes.comment}</p> : null}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="mt-10">
          {leaflet.photos.length ? (
            <ul className="flex flex-col gap-6">
              {leaflet.photos.map((photo) => (
                <li key={photo.id}>
                  <img src={photo.url} alt="업로드 사진" className="photo-shadow aspect-[4/5] w-full bg-canvas-dark-deep object-contain" />
                  <p className="mt-2 text-[14px] text-mute-on-dark">업로드 사진</p>
                </li>
              ))}
            </ul>
          ) : null}
          {leaflet.comment ? <p className="mt-6">{leaflet.comment}</p> : null}
        </section>
      )}

      {leaflet.kind === "visit" && leaflet.recommendationArtworkIds.length ? (
        <section className="mt-12">
          <MockRegion>
            <h2 className="text-[21px] font-semibold">다음 작품</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {leaflet.recommendationArtworkIds.map((id) => {
                const artwork = app.artworks.find((item) => item.id === id);
                if (!artwork) return null;
                const artist = app.artists.find((item) => item.id === artwork.artistId);
                return (
                  <li key={id}>
                    <Link href={`/artworks/${artwork.id}`} className="flex items-center gap-3 rounded-2xl bg-surface-dark p-3 text-inherit no-underline">
                      <img src={artwork.imageUrl} alt="" className="h-16 w-14 object-cover" />
                      <span>
                        <span className="block font-semibold">{artwork.title}</span>
                        {artist ? <span className="block text-[14px] text-mute-on-dark">{artist.name}</span> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </MockRegion>
        </section>
      ) : null}

      {!readOnly ? (
        <div className="mt-10 flex flex-col gap-3">
          {leaflet.kind === "visit" ? (
            <Link href={`/leaflets/${leaflet.id}/notes`} className="btn btn-secondary-dark">
              기록 남기기
            </Link>
          ) : null}
          <Link href={`/leaflets/${leaflet.id}/share`} className="btn btn-secondary-dark">
            공유
          </Link>
          {archived ? (
            <Link href="/my-room/archive" className="btn btn-accent">
              기록함
            </Link>
          ) : (
            <button type="button" className="btn btn-accent" onClick={() => app.saveLeaflet(leaflet)}>
              저장
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
