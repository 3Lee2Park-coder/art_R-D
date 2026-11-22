"use client";

import Link from "next/link";
import { ArtistCard, ExhibitionCard, GalleryCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { SectionHeader, Shelf, SiteFooter, useTitle } from "@/components/ui";
import { formatPeriod } from "@/lib/format";

export default function HomePage() {
  const app = useApp();
  useTitle("RestArt");
  const openShows = app.exhibitions.filter((item) => item.published && !item.ended && item.status === "contracted");
  const featured = openShows.find((item) => item.leafletEnabled) ?? openShows[0];
  const featuredGallery = featured ? app.galleries.find((item) => item.id === featured.galleryId) : undefined;
  const roomHref = app.role === "visitor-member" ? "/my-room" : "/my-room/intro";

  return (
    <div>
      <div className="page-wrap max-w-[1440px] !pb-0">
        <header className="page-headline">
          <p className="eyebrow">RestArt</p>
          <h1>관람이 기록이 됩니다</h1>
          <p className="lead">전시장에서 고른 장면이 나만의 리플릿으로 남습니다.</p>
        </header>
        {featured ? (
          <article className="feature-card">
            <Link href={`/exhibitions/${featured.id}`} className="feature-media block text-inherit no-underline">
              <img src={featured.posterUrl} alt={featured.title} />
            </Link>
            <div className="feature-copy">
              <p className="eyebrow">{featuredGallery?.name}</p>
              <h2 className="display-md">{featured.title}</h2>
              <p className="caption">
                {formatPeriod(featured.startDate, featured.endDate)}
                <br />
                {featured.venue}
              </p>
              <Link href={`/exhibitions/${featured.id}`} className="btn btn-primary">
                전시 보기
              </Link>
            </div>
          </article>
        ) : null}
        <section className="section-gap">
          <SectionHeader
            title="지금 열린 전시"
            action={
              <Link href="/exhibitions" className="link">
                더보기
              </Link>
            }
          />
          <Shelf>
            {openShows.map((exhibition) => (
              <ExhibitionCard
                key={exhibition.id}
                shelf
                exhibition={exhibition}
                galleryName={app.galleries.find((item) => item.id === exhibition.galleryId)?.name}
                href={`/exhibitions/${exhibition.id}`}
              />
            ))}
          </Shelf>
        </section>
      </div>

      <section className="band bg-canvas-dark text-white section-gap">
        <div className="band-inner">
          <p className="eyebrow">마이룸</p>
          <h2 className="display-lg">나의 방</h2>
          <p className="lead">관람한 전시와 고른 작품이 한곳에 모입니다.</p>
          <Link href={roomHref} className="btn btn-accent">
            들어가기
          </Link>
        </div>
      </section>

      <section className="band bg-canvas-dark-deep text-white">
        <div className="band-inner">
          <p className="eyebrow">리플릿</p>
          <h2 className="display-lg">한 장의 리플릿</h2>
          <p className="lead">전시장에서 남긴 순서가 한 장으로 남습니다.</p>
        </div>
      </section>

      <div className="page-wrap max-w-[1440px] ">
        <section className="section-gap">
          <SectionHeader
            title="갤러리"
            action={
              <Link href="/galleries" className="link">
                더보기
              </Link>
            }
          />
          <Shelf>
            {app.galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} shelf />
            ))}
          </Shelf>
        </section>
        <section className="section-gap">
          <SectionHeader
            title="작가"
            action={
              <Link href="/artists" className="link">
                더보기
              </Link>
            }
          />
          <Shelf>
            {app.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} shelf />
            ))}
          </Shelf>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
