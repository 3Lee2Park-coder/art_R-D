"use client";

import { useParams } from "next/navigation";
import { ExhibitionCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SectionHeader, Shelf, SiteFooter } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function GalleryPage() {
  const id = oneParam(useParams<{ galleryId: string }>().galleryId);
  const app = useApp();
  const gallery = app.galleries.find((item) => item.id === id);
  if (!gallery) {
    return (
      <Frame>
        <PageTitle title="갤러리" />
        <p>갤러리를 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  const shows = app.exhibitions.filter((item) => item.galleryId === gallery.id && item.published);
  return (
    <>
      <Frame width="read" className="!pb-0">
        <PageTitle title={gallery.name} kicker={gallery.region} lead={gallery.bio ?? undefined} />
      </Frame>
      {shows.length ? (
        <Frame>
          <SectionHeader title="전시" />
          <Shelf>
            {shows.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} shelf exhibition={exhibition} href={`/exhibitions/${exhibition.id}`} />
            ))}
          </Shelf>
        </Frame>
      ) : null}
      <SiteFooter />
    </>
  );
}
