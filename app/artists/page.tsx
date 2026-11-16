"use client";

import { ArtistCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";

export default function ArtistsPage() {
  const { artists } = useApp();
  return (
    <Frame>
      <PageTitle title="작가" />
      <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </Frame>
  );
}
