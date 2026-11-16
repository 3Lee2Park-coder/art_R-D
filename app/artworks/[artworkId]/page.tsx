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
    <Frame width="read">
      <PageTitle title={artwork.title} kicker={artist?.name} />
      <img src={artwork.imageUrl} alt={artwork.title} className="photo-shadow aspect-[4/5] w-full bg-parchment object-contain" />
      <div className="mt-6 flex flex-col gap-2">
        {artist ? (
          <Link href={`/artists/${artist.id}`} className="link font-semibold">
            {artist.name}
          </Link>
        ) : null}
        {exhibition?.published ? (
          <Link href={`/exhibitions/${exhibition.id}`} className="link">
            {exhibition.title}
          </Link>
        ) : null}
        {artwork.description ? <p className="mt-2">{artwork.description}</p> : null}
        {artwork.priceKrw !== null ? <p className="price text-[21px]">{formatPrice(artwork.priceKrw)}</p> : null}
        <p className="text-[14px] text-mute">관심 {artwork.likeCount}</p>
      </div>
      <button
        type="button"
        className="btn btn-primary mt-8"
        onClick={() => {
          app.addToCart(artwork.id);
          router.push("/cart");
        }}
      >
        담기
      </button>
    </Frame>
  );
}
