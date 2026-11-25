"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExhibitionReportView } from "@/components/leaflet/ExhibitionReportView";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { buildExhibitionReport } from "@/lib/leaflet/exhibitionReport";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import {
  toExhibitionReportView,
  totalRecordsFromLeaflets,
  type ExhibitionReportViewModel,
} from "@/lib/leaflet/exhibitionReportView";
import { formatPeriod, oneParam } from "@/lib/format";

export default function GalleryReportPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const [model, setModel] = useState<ExhibitionReportViewModel | null>(null);

  useEffect(() => {
    if (!app.ready) return;
    if (!exhibition || exhibition.galleryId !== app.myGalleryId) {
      setModel(null);
      return;
    }
    const source = readExhibitionReportSource(id);
    const report = buildExhibitionReport(source);
    setModel(
      toExhibitionReportView(report, {
        totalRecords: totalRecordsFromLeaflets(source.leaflets, id),
      }),
    );
  }, [app.ready, app.myGalleryId, exhibition, id]);

  if (!exhibition || exhibition.galleryId !== app.myGalleryId) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 리포트" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="전시 리포트" />
      <p className="text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
      {exhibition.ended ? <p className="mt-2 text-[14px]">종료된 전시의 리포트입니다.</p> : null}
      <div className="mt-6">
        {model ? <ExhibitionReportView model={model} /> : null}
      </div>
    </Frame>
  );
}
