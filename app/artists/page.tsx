"use client";

import { ArtistCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SiteFooter } from "@/components/ui";

export default function ArtistsPage() {
  const { artists } = useApp();
  return (
    <>
      <Frame>
        <PageTitle title="작가" />
        <div className="artwork-grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </Frame>
      <SiteFooter />
    </>
  );
}
