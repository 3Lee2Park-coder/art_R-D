"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { formatPrice, oneParam } from "@/lib/format";

export default function MapPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const router = useRouter();
  useVisitGate(id);
  useTitle("배치도");
  const works = app.artworks.filter((item) => item.exhibitionId === id && item.zone);
  const zones = useMemo(() => Array.from(new Set(works.map((item) => item.zone).filter((zone): zone is string => Boolean(zone)))), [works]);
  const [zone, setZone] = useState("전체");
  const [selected, setSelected] = useState<string | null>(null);
  const visible = works.filter((item) => zone === "전체" || item.zone === zone);
  const artwork = works.find((item) => item.id === selected);
  const artist = artwork ? app.artists.find((item) => item.id === artwork.artistId) : undefined;

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-6 pb-28">
      <div className="flex items-center justify-between gap-3">
        <h1 className="display">배치도</h1>
        <Link href={`/exhibitions/${id}/capture?from=qr`} className="link-accent text-[14px] font-semibold">
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
            <button type="button" className="flex w-full items-center gap-3 bg-transparent py-3 text-left" onClick={() => setSelected(item.id)}>
              <img src={item.imageUrl} alt="" className="h-14 w-12 object-cover" />
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="block text-[14px] text-mute-on-dark">{item.zone}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {artwork ? (
        <div className="fixed inset-0 z-40 flex items-end bg-[rgba(9,32,57,0.72)]" onClick={() => setSelected(null)}>
          <section className="w-full rounded-t-3xl bg-surface-dark px-6 pt-6 pb-10" onClick={(event) => event.stopPropagation()} role="dialog" aria-label={artwork.title}>
            <img src={artwork.imageUrl} alt={artwork.title} className="aspect-[4/5] max-h-64 w-full bg-canvas-dark-deep object-contain" />
            <h2 className="mt-4 text-[24px] font-semibold">{artwork.title}</h2>
            {artist ? <p className="text-mute-on-dark">{artist.name}</p> : null}
            {artwork.description ? <p className="mt-3">{artwork.description}</p> : null}
            {artwork.priceKrw !== null ? <p className="price-badge mt-3">{formatPrice(artwork.priceKrw)}</p> : null}
            <div className="mt-6 flex flex-col gap-3">
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
              <button type="button" className="btn btn-secondary-dark" onClick={() => setSelected(null)}>
                닫기
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
