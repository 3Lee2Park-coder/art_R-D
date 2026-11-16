import Link from "next/link";
import type { Artist, Artwork, Exhibition, Gallery } from "@/lib/types";
import { formatPeriod, formatPrice } from "@/lib/format";

export function Picture({ src, alt, ratio = "aspect-[4/5]" }: { src: string; alt: string; ratio?: string }) {
  return (
    <div className={`relative overflow-hidden bg-parchment ${ratio}`}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

export function ExhibitionCard({
  exhibition,
  galleryName,
  href,
}: {
  exhibition: Exhibition;
  galleryName?: string;
  href: string;
}) {
  return (
    <article className="card">
      <Link href={href} className="block text-inherit no-underline">
        <Picture src={exhibition.posterUrl} alt={exhibition.title} />
        <div className="p-4">
          <div className="flex items-center gap-2">
            {galleryName ? <p className="text-[12px] font-semibold text-primary">{galleryName}</p> : null}
            {exhibition.status === "contracted" && exhibition.leafletEnabled && !exhibition.ended ? (
              <span className="mock-badge">리플릿</span>
            ) : null}
            {exhibition.ended ? <span className="text-[12px] text-mute">종료</span> : null}
          </div>
          <h3 className="mt-1 text-[21px] font-semibold leading-snug">{exhibition.title}</h3>
          <p className="mt-1 text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
          <p className="text-[14px] text-mute">{exhibition.venue}</p>
        </div>
      </Link>
    </article>
  );
}

export function ArtworkCard({ artwork, artistName }: { artwork: Artwork; artistName?: string }) {
  return (
    <article className="card">
      <Link href={`/artworks/${artwork.id}`} className="block text-inherit no-underline">
        <Picture src={artwork.imageUrl} alt={artwork.title} />
        <div className="p-4">
          {artistName ? <p className="text-[12px] font-semibold text-primary">{artistName}</p> : null}
          <h3 className="mt-1 text-[17px] font-semibold">{artwork.title}</h3>
          {artwork.priceKrw !== null ? <p className="price mt-1 text-[17px]">{formatPrice(artwork.priceKrw)}</p> : null}
        </div>
      </Link>
    </article>
  );
}

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="card">
      <Link href={`/artists/${artist.id}`} className="block text-inherit no-underline">
        {artist.imageUrl ? (
          <Picture src={artist.imageUrl} alt="" ratio="aspect-square" />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-parchment text-[40px] font-semibold text-primary">{artist.name.slice(0, 1)}</div>
        )}
        <div className="p-4">
          <h3 className="text-[17px] font-semibold">{artist.name}</h3>
          {artist.bio ? <p className="mt-1 text-[14px] text-mute">{artist.bio}</p> : null}
        </div>
      </Link>
    </article>
  );
}

export function GalleryCard({ gallery }: { gallery: Gallery }) {
  return (
    <article className="card">
      <Link href={`/galleries/${gallery.id}`} className="block p-4 text-inherit no-underline">
        <p className="text-[12px] font-semibold text-primary">{gallery.region}</p>
        <h3 className="mt-1 text-[21px] font-semibold">{gallery.name}</h3>
        {gallery.bio ? <p className="mt-2 text-[14px] text-mute">{gallery.bio}</p> : null}
      </Link>
    </article>
  );
}
