"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CoverCard } from "@/components/leaflet/CoverCard";
import { resolveLeafletTheme } from "@/components/leaflet/theme";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { formatDate, oneParam } from "@/lib/format";

export default function SharePage() {
  const id = oneParam(useParams<{ leafletId: string }>().leafletId);
  const app = useApp();
  const leaflet = app.findLeaflet(id);
  const [includeUploads, setIncludeUploads] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  if (!leaflet) {
    return (
      <div className="mx-auto leaflet-col py-8">
        <PageTitle title="공유" />
        <p>리플릿을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const exhibition = leaflet.exhibitionId
    ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId)
    : undefined;
  const gallery = exhibition?.galleryId
    ? app.galleries.find((item) => item.id === exhibition.galleryId)
    : undefined;
  const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
  const hasUpload = leaflet.photos.some((photo) => photo.source === "upload");
  const theme = resolveLeafletTheme(leaflet.themeColor ?? "Persian Indigo");
  const result = leaflet.result;

  const showArtists = (() => {
    if (!leaflet.exhibitionId) return "";
    const works = app.artworks.filter((a) => a.exhibitionId === leaflet.exhibitionId);
    const ids = [...new Set(works.map((w) => w.artistId))];
    const names = ids
      .map((aid) => app.artists.find((a) => a.id === aid)?.name)
      .filter(Boolean) as string[];
    if (names.length <= 3) return names.join(" · ");
    return `${names.slice(0, 2).join(" · ")} 외 ${names.length - 2}명`;
  })();

  async function share() {
    const text = [title, formatDate(leaflet!.visitDate), leaflet!.comment ?? leaflet!.notes?.comment]
      .filter(Boolean)
      .join("\n");
    if (!navigator.share) {
      setUnsupported(true);
      return;
    }
    try {
      await navigator.share({ title, text });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setUnsupported(true);
    }
  }

  return (
    <div className="mx-auto w-full leaflet-col py-6 pb-24">
      <PageTitle title="공유" />
      {result ? (
        <div
          className="mx-auto w-full max-w-[342px] overflow-hidden rounded-2xl"
          style={{ background: theme.bg, color: theme.text, aspectRatio: "9 / 16" }}
        >
          <div className="flex h-full flex-col px-4 pt-4 pb-4">
            <CoverCard
              result={result}
              theme={theme}
              exhibitionTitle={title}
              galleryLine={[gallery?.name, exhibition?.venue].filter(Boolean).join(" · ")}
              artistLine={showArtists}
              visitDate={leaflet.visitDate}
              imageUrl={result.representative.url ?? leaflet.myPhotoUrl ?? null}
            />
          </div>
        </div>
      ) : (
        <article className="ticket">
          <div className="h-1.5 bg-accent" />
          <div className="px-5 py-6">
            <h2 className="text-[28px] font-semibold">{title}</h2>
            <p className="mt-3 text-[14px] text-mute-on-dark">방문 {formatDate(leaflet.visitDate)}</p>
            {leaflet.comment || leaflet.notes?.comment ? (
              <p className="mt-4">{leaflet.comment ?? leaflet.notes?.comment}</p>
            ) : null}
          </div>
        </article>
      )}
      {hasUpload ? (
        <label className="mt-6 flex min-h-12 items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={includeUploads}
            onChange={(event) => setIncludeUploads(event.target.checked)}
          />
          <span>업로드한 사진 포함</span>
        </label>
      ) : null}
      <button type="button" className="btn btn-accent mt-8 w-full" onClick={share}>
        공유하기
      </button>
      {unsupported ? (
        <p className="mt-4 text-[14px] text-mute-on-dark">이 브라우저에서는 공유를 지원하지 않습니다.</p>
      ) : null}
    </div>
  );
}
