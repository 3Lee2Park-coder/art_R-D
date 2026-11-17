"use client";

import Link from "next/link";
import { MockRegion, useTitle } from "@/components/ui";
import { useApp } from "@/components/providers";

export default function MyRoomPage() {
  const app = useApp();
  useTitle("마이룸");
  const picks = app.artworks.filter((item) => app.picks.includes(item.id));
  const recommended = app.artworks.filter((item) => app.recommendationArtworkIds.includes(item.id));

  return (
    <div className="leaflet-col py-8 pb-24">
      <header className="page-headline !px-0">
        <p className="eyebrow">RestArt</p>
        <h1>나의 방</h1>
        <p className="caption">리플릿 {app.archivedLeaflets.length}</p>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/my-room/archive" className="btn btn-accent">
          기록함
        </Link>
        <Link href="/my-room/space" className="btn btn-secondary-dark">
          공간
        </Link>
        <Link href="/my-room/picks" className="btn btn-secondary-dark">
          작품 고르기
        </Link>
        <Link href="/my-room/decorate" className="btn btn-secondary-dark">
          방 꾸미기
        </Link>
      </div>
      <section className="section-gap">
        <MockRegion>
          <h2 className="section-title">추천 작품</h2>
          <ul className="shelf-track mt-4">
            {recommended.map((artwork) => (
              <li key={artwork.id} className="shelf-artwork">
                <Link href={`/artworks/${artwork.id}`} className="block text-inherit no-underline">
                  <div className="frame-artwork">
                    <img src={artwork.imageUrl} alt={artwork.title} />
                  </div>
                  <span className="card-title mt-4 block">{artwork.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </MockRegion>
      </section>
      {picks.length ? (
        <section className="mt-10">
          <h2 className="text-[21px] font-semibold">고른 작품</h2>
          <ul className="mt-4 flex gap-3 overflow-x-auto">
            {picks.map((artwork) => (
              <li key={artwork.id} className="w-28 shrink-0">
                <Link href={`/artworks/${artwork.id}`}>
                  <img src={artwork.imageUrl} alt={artwork.title} className="aspect-square w-full object-cover" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
