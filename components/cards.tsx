import Link from "next/link";
import type { Artist, Artwork, Exhibition, Gallery } from "@/lib/types";
import { formatPeriod, formatPrice } from "@/lib/format";

export function ArtworkCard({
  artwork,
  artistName,
  shelf = false,
}: {
  artwork: Artwork;
  artistName?: string;
  shelf?: boolean;
}) {
  return (
    <article className={shelf ? "shelf-artwork" : undefined}>
      <Link href={`/artworks/${artwork.id}`} className="block text-inherit no-underline">
        <div className="frame-artwork">
          <img src={artwork.imageUrl} alt={artwork.title} />
        </div>
        <div className="card-caption">
          <h3 className="card-title">{artwork.title}</h3>
          {artistName ? <p className="caption">{artistName}</p> : null}
          {artwork.priceKrw !== null ? <p className="price text-[17px]">{formatPrice(artwork.priceKrw)}</p> : null}
        </div>
      </Link>
    </article>
  );
}

export function ExhibitionCard({
  exhibition,
  galleryName,
  href,
  shelf = false,
}: {
  exhibition: Exhibition;
  galleryName?: string;
  href: string;
  shelf?: boolean;
}) {
  return (
    <article className={shelf ? "shelf-exhibition" : undefined}>
      <Link href={href} className="block text-inherit no-underline">
        <div className="frame-poster">
          <img src={exhibition.posterUrl} alt={exhibition.title} />
        </div>
        <div className="card-caption">
          <p className="eyebrow">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
          <h3 className="card-title">{exhibition.title}</h3>
          <p className="caption">{galleryName ? `${galleryName} · ${exhibition.venue}` : exhibition.venue}</p>
        </div>
      </Link>
    </article>
  );
}

export function ArtistCard({ artist, shelf = false }: { artist: Artist; shelf?: boolean }) {
  return (
    <article className={shelf ? "shelf-artist" : undefined}>
      <Link href={`/artists/${artist.id}`} className="block text-inherit no-underline">
        <div className="frame-portrait">
          {artist.imageUrl ? <img src={artist.imageUrl} alt={artist.name} /> : null}
        </div>
        <div className="card-caption">
          <h3 className="card-title">{artist.name}</h3>
        </div>
      </Link>
    </article>
  );
}

export function GalleryCard({ gallery, shelf = false }: { gallery: Gallery; shelf?: boolean }) {
  return (
    <article className={shelf ? "shelf-utility utility-card" : "utility-card"}>
      <Link href={`/galleries/${gallery.id}`} className="flex h-full flex-col gap-3 text-inherit no-underline">
        <p className="eyebrow">{gallery.region}</p>
        <h3 className="m-0 text-[17px] font-semibold">{gallery.name}</h3>
        {gallery.bio ? <p className="caption">{gallery.bio}</p> : null}
      </Link>
    </article>
  );
}
