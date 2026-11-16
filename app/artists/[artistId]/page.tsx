"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function ArtistPage() {
  const params = useParams<{ artistId: string }>();
  const id = oneParam(params.artistId);
  const app = useApp();
  const artist = app.artists.find((item) => item.id === id);
  if (!artist) {
    return (
      <Frame>
        <PageTitle title="작가" />
        <p>작가를 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  const works = app.artworks.filter((item) => item.artistId === artist.id);
  return (
    <Frame width="read">
      <Link href="/artists" className="link text-[14px] font-semibold">
        작가
      </Link>
      <div className="mt-4">
        <PageTitle title={artist.name} />
      </div>
      {artist.imageUrl ? <img src={artist.imageUrl} alt="" className="photo-shadow mb-6 aspect-square w-full max-w-sm object-cover" /> : null}
      {artist.bio ? <p>{artist.bio}</p> : null}
      <div className="mt-8 grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
        {works.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} artistName={artist.name} />
        ))}
      </div>
    </Frame>
  );
}
