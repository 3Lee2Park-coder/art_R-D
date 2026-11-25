"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import {
  canViewExhibitionReport,
  REPORT_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { formatPeriod, oneParam } from "@/lib/format";

export default function GalleryReportPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const allowed = useMemo(
    () =>
      canViewExhibitionReport({
        role: app.role,
        myGalleryId: app.myGalleryId,
        contractState: gallery?.contractState,
        exhibitionGalleryId: exhibition?.galleryId,
      }),
    [app.role, app.myGalleryId, gallery?.contractState, exhibition?.galleryId],
  );
  const [model, setModel] = useState<ExhibitionReportViewModel | null>(null);

  useEffect(() => {
    if (!app.ready) return;
    if (!allowed) {
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
  }, [app.ready, allowed, id]);

  if (!allowed) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 리포트" />
        <p>{REPORT_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  if (!exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 리포트" />
        <p>{REPORT_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="전시 리포트" />
      <p className="text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
      <p className="mt-2 text-[14px]">{exhibition.ended ? "종료" : "진행 중"}</p>
      <div className="mt-6">{model ? <ExhibitionReportView model={model} /> : null}</div>
    </Frame>
  );
}
