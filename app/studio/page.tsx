"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { contractLabel, exhibitionStateLabel } from "@/lib/labels";
import { formatPeriod } from "@/lib/format";

export default function StudioPage() {
  const app = useApp();
  const gallery = app.galleries.find((item) => item.id === app.myGalleryId);
  const shows = app.exhibitions.filter((item) => item.galleryId === app.myGalleryId);
  const contracted = app.role === "gallery-contracted" && gallery?.contractState === "contracted";
  const archive = app.role === "gallery-ended" || gallery?.contractState === "ended";
  const canReport = contracted || archive;
  const canInquiry = contracted || archive;

  return (
    <Frame width="utility">
      <PageTitle title="내 전시" kicker={gallery?.name} />
      {gallery ? <p className="mb-6 text-[14px] text-mute">{contractLabel(gallery.contractState)}</p> : null}
      <div className="flex flex-wrap gap-2">
        {contracted || app.role === "gallery-uncontracted" ? (
          <Link href="/studio/exhibitions/new" className="btn btn-primary">
            전시 등록
          </Link>
        ) : null}
        {canInquiry ? (
          <Link href="/studio/inquiries" className="btn btn-secondary">
            문의
          </Link>
        ) : null}
      </div>
      <ul className="mt-8 border-t border-hairline">
        {shows.map((exhibition) => {
          return (
            <li key={exhibition.id} className="border-b border-hairline py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[17px] font-semibold">{exhibition.title}</h2>
                <span className="text-[14px] text-mute">{exhibitionStateLabel(exhibition)}</span>
              </div>
              <p className="text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contracted ? (
                  <Link href={`/studio/exhibitions/${exhibition.id}/review`} className="btn btn-secondary min-h-11 px-4">
                    배치
                  </Link>
                ) : null}
                {contracted && exhibition.leafletEnabled && exhibition.status === "contracted" ? (
                  <Link
                    href={`/studio/exhibitions/${exhibition.id}/theme-color`}
                    className="btn btn-secondary min-h-11 px-4"
                  >
                    테마 색
                  </Link>
                ) : null}
                {contracted && exhibition.published && exhibition.status === "contracted" ? (
                  <Link href={`/studio/exhibitions/${exhibition.id}/qr`} className="btn btn-secondary min-h-11 px-4">
                    QR
                  </Link>
                ) : null}
                {canReport ? (
                  <Link href={`/studio/reports/${exhibition.id}`} className="btn btn-secondary min-h-11 px-4">
                    리포트
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}
