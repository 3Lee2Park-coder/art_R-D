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
    <div className="mx-auto w-full max-w-[980px] px-4 py-8 pb-24">
      <p className="text-[12px] font-semibold text-accent">RestArt</p>
      <h1 className="display mt-2">나의 방</h1>
      <p className="mt-2 text-[14px] text-mute-on-dark">리플릿 {app.archivedLeaflets.length}</p>
      <div className="mt-8 grid grid-cols-2 gap-3">
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
      <section className="mt-12">
        <MockRegion>
          <h2 className="text-[21px] font-semibold">추천 작품</h2>
          <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {recommended.map((artwork) => (
              <li key={artwork.id} className="w-36 shrink-0">
                <Link href={`/artworks/${artwork.id}`} className="block text-inherit no-underline">
                  <img src={artwork.imageUrl} alt={artwork.title} className="aspect-[4/5] w-full bg-canvas-dark-deep object-cover" />
                  <span className="mt-2 block text-[14px] font-semibold">{artwork.title}</span>
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
