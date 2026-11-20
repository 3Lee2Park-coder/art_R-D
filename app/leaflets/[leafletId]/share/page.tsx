"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
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

  const exhibition = leaflet.exhibitionId ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId) : undefined;
  const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
  const hasUpload = leaflet.photos.some((photo) => photo.source === "upload");
  const photos = leaflet.photos.filter((photo) => photo.source !== "upload" || includeUploads);

  async function share() {
    const text = [title, formatDate(leaflet!.visitDate), leaflet!.comment ?? leaflet!.notes?.comment].filter(Boolean).join("\n");
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
      <article className="ticket">
        <div className="h-1.5 bg-accent" />
        <div className="px-5 py-6">
          <h2 className="text-[28px] font-semibold">{title}</h2>
          <p className="mt-3 text-[14px] text-mute-on-dark">방문 {formatDate(leaflet.visitDate)}</p>
          {leaflet.comment || leaflet.notes?.comment ? <p className="mt-4">{leaflet.comment ?? leaflet.notes?.comment}</p> : null}
        </div>
      </article>
      {photos.length ? (
        <ul className="mt-6 grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <li key={photo.id}>
              <img src={photo.url} alt={photo.source === "upload" ? "업로드 사진" : ""} className="aspect-square w-full object-cover" />
            </li>
          ))}
        </ul>
      ) : null}
      {hasUpload ? (
        <label className="mt-6 flex min-h-12 items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5" checked={includeUploads} onChange={(event) => setIncludeUploads(event.target.checked)} />
          <span>
            업로드한 사진을 포함합니다.
            <span className="mt-1 block text-[14px] text-mute-on-dark">업로드한 사진의 공개 범위를 확인해 주세요.</span>
          </span>
        </label>
      ) : null}
      <button type="button" className="btn btn-accent mt-8 w-full" onClick={() => void share()}>
        공유하기
      </button>
      {unsupported ? <p className="mt-4 text-[14px] text-error-on-dark">이 브라우저에서는 공유 시트를 열 수 없습니다.</p> : null}
    </div>
  );
}
