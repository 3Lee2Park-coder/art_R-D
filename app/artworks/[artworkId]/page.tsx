"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPrice, oneParam } from "@/lib/format";

export default function ArtworkPage() {
  const params = useParams<{ artworkId: string }>();
  const id = oneParam(params.artworkId);
  const router = useRouter();
  const app = useApp();
  const artwork = app.artworks.find((item) => item.id === id);
  if (!artwork) {
    return (
      <Frame>
        <PageTitle title="작품" />
        <p>작품을 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  const artist = app.artists.find((item) => item.id === artwork.artistId);
  const exhibition = artwork.exhibitionId ? app.exhibitions.find((item) => item.id === artwork.exhibitionId) : undefined;
  return (
    <>
      <div className="artwork-hero">
        <img src={artwork.imageUrl} alt={artwork.title} />
      </div>
      <Frame width="read" className="!pb-0">
        <PageTitle title={artwork.title} kicker={artist?.name} />
        <div className="flex flex-col gap-3">
          {artist ? (
            <Link href={`/artists/${artist.id}`} className="link">
              {artist.name}
            </Link>
          ) : null}
          {exhibition?.published ? (
            <Link href={`/exhibitions/${exhibition.id}`} className="link">
              {exhibition.title}
            </Link>
          ) : null}
          {artwork.description ? <p className="m-0">{artwork.description}</p> : null}
          <p className="caption m-0">관심 {artwork.likeCount}</p>
        </div>
        <div className="sticky-cta">
          <p className="price m-0 text-[17px]">{artwork.priceKrw !== null ? formatPrice(artwork.priceKrw) : ""}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              app.addToCart(artwork.id);
              router.push("/cart");
            }}
          >
            담기
          </button>
        </div>
      </Frame>
    </>
  );
}
