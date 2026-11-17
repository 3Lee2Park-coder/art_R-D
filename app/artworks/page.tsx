"use client";

import Link from "next/link";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SiteFooter } from "@/components/ui";

export default function ArtworksPage() {
  const app = useApp();
  return (
    <>
      <Frame>
        <PageTitle title="작품" />
        {app.cart.length ? (
          <p className="-mt-4 mb-6">
            <Link href="/cart" className="link">
              장바구니
            </Link>
          </p>
        ) : null}
        <div className="artwork-grid">
          {app.artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} artistName={app.artists.find((item) => item.id === artwork.artistId)?.name} />
          ))}
        </div>
      </Frame>
      <SiteFooter />
    </>
  );
}
