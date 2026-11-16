"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ExhibitionCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
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
    <Frame width="read">
      <Link href="/galleries" className="link text-[14px] font-semibold">
        갤러리
      </Link>
      <div className="mt-4">
        <PageTitle title={gallery.name} kicker={gallery.region} />
      </div>
      {gallery.bio ? <p>{gallery.bio}</p> : null}
      <div className="mt-8 grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
        {shows.map((exhibition) => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} href={`/exhibitions/${exhibition.id}`} />
        ))}
      </div>
    </Frame>
  );
}
