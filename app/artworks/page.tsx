"use client";

import Link from "next/link";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";

export default function ArtworksPage() {
  const app = useApp();
  return (
    <Frame>
      <div className="mb-2 flex items-end justify-between gap-3">
        <PageTitle title="작품" />
        {app.cart.length ? (
          <Link href="/cart" className="link mb-6 text-[14px] font-semibold">
            장바구니
          </Link>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3">
        {app.artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} artistName={app.artists.find((item) => item.id === artwork.artistId)?.name} />
        ))}
      </div>
    </Frame>
  );
}
