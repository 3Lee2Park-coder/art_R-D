"use client";

import Link from "next/link";
import { ArtistCard, ExhibitionCard, GalleryCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";

export default function HomePage() {
  const app = useApp();
  useTitle("RestArt");
  const openShows = app.exhibitions.filter((item) => item.published && !item.ended && item.status === "contracted");
  const featured = openShows.find((item) => item.leafletEnabled) ?? openShows[0];
  const featuredGallery = featured ? app.galleries.find((item) => item.id === featured.galleryId) : undefined;
  const roomHref = app.role === "visitor-member" ? "/my-room" : "/my-room/intro";

  return (
    <div>
      <section className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-12 min-[1024px]:grid-cols-2 min-[1024px]:py-20">
        <div>
          <p className="text-[12px] font-semibold text-primary">RestArt</p>
          <h1 className="hero-title mt-3 max-w-[10em]">관람이 기록이 됩니다</h1>
          <p className="mt-4 max-w-[24em] text-mute">전시장에서 고른 장면이 나만의 리플릿으로 남습니다.</p>
        </div>
        {featured ? (
          <Link href={`/exhibitions/${featured.id}`} className="block text-inherit no-underline">
            <img src={featured.posterUrl} alt={featured.title} className="photo-shadow aspect-[4/5] w-full rounded-2xl bg-parchment object-cover" />
            <p className="mt-4 text-[12px] font-semibold text-primary">{featuredGallery?.name}</p>
            <p className="text-[21px] font-semibold">{featured.title}</p>
          </Link>
        ) : null}
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1440px] px-4 py-16 min-[720px]:py-20">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="display">지금 열린 전시</h2>
            <Link href="/exhibitions" className="link text-[14px] font-semibold">
              더보기
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3">
            {openShows.map((exhibition) => (
              <ExhibitionCard
                key={exhibition.id}
                exhibition={exhibition}
                galleryName={app.galleries.find((item) => item.id === exhibition.galleryId)?.name}
                href={`/exhibitions/${exhibition.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas-dark text-white">
        <div className="mx-auto max-w-[980px] px-4 py-16 min-[720px]:py-20">
          <p className="text-[12px] font-semibold text-accent">마이룸</p>
          <h2 className="display mt-2">나의 방</h2>
          <p className="mt-4 max-w-[28em] text-mute-on-dark">관람한 전시와 고른 작품이 한곳에 모입니다.</p>
          <Link href={roomHref} className="btn btn-accent mt-8">
            들어가기
          </Link>
        </div>
      </section>

      <section className="bg-canvas-dark-deep text-white">
        <div className="mx-auto max-w-[980px] px-4 py-16 min-[720px]:py-20">
          <p className="text-[12px] font-semibold text-accent">리플릿</p>
          <h2 className="display mt-2">한 장의 리플릿</h2>
          <p className="mt-4 max-w-[28em] text-mute-on-dark">전시장에서 남긴 순서가 한 장으로 남습니다.</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-4 py-16 min-[720px]:py-20">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="display">갤러리</h2>
            <Link href="/galleries" className="link text-[14px] font-semibold">
              더보기
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3">
            {app.galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1440px] px-4 py-16 min-[720px]:py-20">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="display">작가</h2>
            <Link href="/artists" className="link text-[14px] font-semibold">
              더보기
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3">
            {app.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-canvas-dark-deep px-4 py-12 pb-24 text-white">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[18px] font-semibold">RestArt</p>
          <p className="mt-2 text-[14px] text-mute-on-dark">전시, 작품, 관람 기록</p>
        </div>
      </footer>
    </div>
  );
}
