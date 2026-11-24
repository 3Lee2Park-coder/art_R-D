"use client";

import { useParams } from "next/navigation";
import { ReportBlock } from "@/components/report-block";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPeriod, oneParam } from "@/lib/format";

export default function GalleryReportPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const report = app.reports.find((item) => item.exhibitionId === id);
  if (!exhibition || exhibition.galleryId !== app.myGalleryId || !report) {
    return (
      <Frame width="utility">
        <PageTitle title="고객 리포트" />
        <p>리포트가 없습니다.</p>
      </Frame>
    );
  }
  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="고객 리포트" />
      <p className="text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
      {exhibition.ended ? <p className="mt-2 text-[14px]">종료된 전시의 리포트입니다.</p> : null}
      <div className="mt-6">
        <ReportBlock report={report} />
      </div>
    </Frame>
  );
}
