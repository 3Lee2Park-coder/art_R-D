"use client";

import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { KEYS } from "@/lib/storage";
import {
  CSV_EXPORT_LABEL,
  INQUIRY_EXPORT_LABEL,
  POSITIONING_BODY,
  POSITIONING_TITLE,
} from "@/lib/studio/copy";
import { downloadCsv } from "@/lib/studio/exportCsv";
import { resolveSelectedExhibitionId } from "@/lib/studio/nav";
import {
  buildAllCustomersCsvRows,
  buildInquiriesCsvRows,
  CSV_FILENAMES,
} from "@/lib/studio/studioCsv";

export default function StudioConnectionsPage() {
  const app = useApp();
  const pathname = usePathname();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const ended = app.role === "gallery-ended" || gallery?.contractState === "ended";
  const canCsv =
    (app.role === "gallery-contracted" || ended) && Boolean(app.myGalleryId);

  const csvContext = () => ({
    role: app.role,
    gallery,
    exhibitions: app.exhibitions,
    artworkTitle: (id: string) => app.artworks.find((a) => a.id === id)?.title ?? "",
  });

  function exportCustomers() {
    const rows = buildAllCustomersCsvRows(csvContext());
    if (rows) downloadCsv(CSV_FILENAMES.allCustomers, rows);
  }

  function exportInquiries() {
    const shows = app.exhibitions.filter((e) => e.galleryId === app.myGalleryId);
    const selected = resolveSelectedExhibitionId(
      shows,
      localStorage.getItem(KEYS.studioExhibitionId),
      pathname,
    );
    if (!selected) return;
    const rows = buildInquiriesCsvRows(csvContext(), selected);
    if (rows) downloadCsv(CSV_FILENAMES.inquiries, rows);
  }

  return (
    <Frame width="utility">
      <PageTitle title="외부 서비스 연동" kicker={gallery?.name} />
      <div className="studio-card mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <strong>{POSITIONING_TITLE}</strong>
          <p className="m-0 mt-1 text-[13px] text-mute">{POSITIONING_BODY}</p>
        </div>
        {canCsv ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={exportCustomers}>
              {CSV_EXPORT_LABEL}
            </button>
            <button type="button" className="btn btn-secondary" onClick={exportInquiries}>
              {INQUIRY_EXPORT_LABEL}
            </button>
          </div>
        ) : null}
      </div>
    </Frame>
  );
}
