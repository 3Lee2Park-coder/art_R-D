"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { isOnOrBeforeContractEnd } from "@/lib/leaflet/contractCutoff";
import { listInquiries, type Inquiry } from "@/lib/leaflet/inquiry";
import { formatDate } from "@/lib/format";

export default function StudioInquiriesPage() {
  const app = useApp();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const [items, setItems] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!app.ready) return;
    setItems(listInquiries());
  }, [app.ready]);

  const mine = useMemo(() => {
    const galleryShowIds = new Set(
      app.exhibitions.filter((e) => e.galleryId === app.myGalleryId).map((e) => e.id),
    );
    const endAt =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    return items.filter((i) => {
      if (!galleryShowIds.has(i.exhibitionId)) return false;
      if (endAt && !isOnOrBeforeContractEnd(i.createdAt, endAt)) return false;
      return true;
    });
  }, [items, app.exhibitions, app.myGalleryId, gallery?.contractState, gallery?.contractEndAt]);

  return (
    <Frame width="utility">
      <PageTitle title="문의 인박스" kicker={gallery?.name} />
      {mine.length === 0 ? (
        <p className="text-[14px] text-mute">데이터 부족</p>
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
