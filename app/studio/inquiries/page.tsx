"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { listInquiries, type Inquiry } from "@/lib/leaflet/inquiry";
import { formatDate } from "@/lib/format";

export default function StudioInquiriesPage() {
  const app = useApp();
  const [items, setItems] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!app.ready) return;
    setItems(listInquiries());
  }, [app.ready]);

  const galleryShowIds = new Set(
    app.exhibitions.filter((e) => e.galleryId === app.myGalleryId).map((e) => e.id),
  );
  const mine = items.filter((i) => galleryShowIds.has(i.exhibitionId));

  return (
    <Frame width="utility">
      <PageTitle title="문의" kicker="갤러리" />
      {mine.length === 0 ? (
        <p className="text-[14px] text-mute">문의가 없습니다.</p>
      ) : (
        <ul className="border-t border-hairline">
          {mine.map((inq) => {
            const art = app.artworks.find((a) => a.id === inq.inquiredArtworkIds[0]);
            return (
              <li key={inq.id} className="border-b border-hairline py-4">
                <Link href={`/studio/inquiries/${inq.id}`} className="block no-underline">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="m-0 text-[17px] font-semibold text-ink">{inq.name}</h2>
                    <span className="text-[14px] text-mute">{inq.status}</span>
                  </div>
                  <p className="mt-1 m-0 text-[14px] text-mute">
                    {art?.title ?? inq.inquiredArtworkIds[0]} · 판매 결과{" "}
                    {inq.saleResult ?? "미입력"}
                  </p>
                  <p className="mt-1 m-0 text-[13px] text-mute">{formatDate(inq.createdAt.slice(0, 10))}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-8">
        <Link href="/studio" className="link">
          내 전시
        </Link>
      </p>
    </Frame>
  );
}
