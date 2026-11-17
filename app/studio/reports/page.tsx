"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPeriod } from "@/lib/format";

export default function GalleryReportsPage() {
  const app = useApp();
  const rows = app.reports
    .map((report) => ({ report, exhibition: app.exhibitions.find((item) => item.id === report.exhibitionId) }))
    .filter((row) => row.exhibition && row.report.galleryId === app.myGalleryId)
    .sort((a, b) => {
      const left = a.exhibition!;
      const right = b.exhibition!;
      if (left.ended !== right.ended) return left.ended ? -1 : 1;
      return right.endDate.localeCompare(left.endDate);
    });

  return (
    <Frame width="utility">
      <PageTitle title="고객 리포트" />
      {rows.length === 0 ? <p>리포트가 없습니다.</p> : null}
      {rows.map(({ report, exhibition }) => (
        <Link key={report.id} href={`/studio/reports/${exhibition!.id}`} className="list-row">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{exhibition!.title}</span>
            <span className="caption">
              {formatPeriod(exhibition!.startDate, exhibition!.endDate)}
              {exhibition!.ended ? " · 종료" : ""}
            </span>
          </span>
          <span aria-hidden>→</span>
        </Link>
      ))}
    </Frame>
  );
}
