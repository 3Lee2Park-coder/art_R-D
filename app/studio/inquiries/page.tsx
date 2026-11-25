"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { isOnOrBeforeContractEnd } from "@/lib/leaflet/contractCutoff";
import { listStudioInquiries, type Inquiry } from "@/lib/leaflet/inquiry";
import { formatDate } from "@/lib/format";
import { usePathname } from "next/navigation";
import { KEYS } from "@/lib/storage";
import { resolveSelectedExhibitionId } from "@/lib/studio/nav";
import { downloadCsv } from "@/lib/studio/exportCsv";
import { buildInquiriesCsvRows, CSV_FILENAMES } from "@/lib/studio/studioCsv";

export default function StudioInquiriesPage() {
  const app = useApp();
  const pathname = usePathname();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const [items, setItems] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!app.ready) return;
    setItems(listStudioInquiries());
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

  function exportCsv() {
    const shows = app.exhibitions.filter((e) => e.galleryId === app.myGalleryId);
    const selected = resolveSelectedExhibitionId(
      shows,
      localStorage.getItem(KEYS.studioExhibitionId),
      pathname,
    );
    if (!selected) return;
    const rows = buildInquiriesCsvRows(
      {
        role: app.role,
        gallery,
        exhibitions: app.exhibitions,
        artworkTitle: (id) => app.artworks.find((a) => a.id === id)?.title ?? "",
      },
      selected,
    );
    if (rows) downloadCsv(CSV_FILENAMES.inquiries, rows);
  }

  return (
    <Frame width="utility">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle title="문의 인박스" kicker={gallery?.name} />
        <button type="button" className="btn btn-secondary" onClick={exportCsv}>
          문의 내보내기
        </button>
      </div>
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
          전시 관리
        </Link>
      </p>
    </Frame>
  );
}
