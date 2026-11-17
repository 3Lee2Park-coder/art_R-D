"use client";

import { useParams } from "next/navigation";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SectionHeader, Shelf, SiteFooter } from "@/components/ui";
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
    <>
      <div className="page-wrap max-w-[1440px] !pb-0">
        <div className="frame-portrait mx-auto w-full max-w-[420px] min-[1024px]:mx-0">
          {artist.imageUrl ? <img src={artist.imageUrl} alt={artist.name} /> : null}
        </div>
      </div>
      <Frame width="read" className="!pb-0">
        <PageTitle title={artist.name} />
        {artist.bio ? <p className="m-0">{artist.bio}</p> : null}
      </Frame>
      {works.length ? (
        <Frame className="mt-14">
          <SectionHeader title="작품" />
          <Shelf>
            {works.map((artwork) => (
              <ArtworkCard key={artwork.id} shelf artwork={artwork} artistName={artist.name} />
            ))}
          </Shelf>
        </Frame>
      ) : null}
      <SiteFooter />
    </>
  );
}
