"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MockRegion } from "@/components/ui";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { dwellLabel, interestLabel } from "@/lib/labels";

export default function OperatorReportsPage() {
  const app = useApp();
  const queryGallery = useSearchParams().get("gallery");
  const [galleryId, setGalleryId] = useState(queryGallery || "all");
  const [exhibitionId, setExhibitionId] = useState("all");
  const rows = useMemo(
    () =>
      app.reports.filter((report) => (galleryId === "all" || report.galleryId === galleryId) && (exhibitionId === "all" || report.exhibitionId === exhibitionId)),
    [app.reports, galleryId, exhibitionId],
  );

  return (
    <Frame width="utility">
      <PageTitle title="전시 리포트" />
      <div className="mb-6 flex flex-col gap-3 min-[720px]:flex-row">
        <select className="field" value={galleryId} onChange={(event) => setGalleryId(event.target.value)}>
          <option value="all">모든 갤러리</option>
          {app.galleries.map((gallery) => (
            <option key={gallery.id} value={gallery.id}>
              {gallery.name}
            </option>
          ))}
        </select>
        <select className="field" value={exhibitionId} onChange={(event) => setExhibitionId(event.target.value)}>
          <option value="all">모든 전시</option>
          {app.exhibitions.map((exhibition) => (
            <option key={exhibition.id} value={exhibition.id}>
              {exhibition.title}
            </option>
          ))}
        </select>
      </div>
      {rows.length === 0 ? <p>해당하는 리포트가 없습니다.</p> : null}
      <MockRegion>
        <div className="overflow-x-auto border border-hairline">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="bg-parchment">
              <tr>
                {["갤러리", "전시", "구역 관심", "체류"].map((label) => (
                  <th key={label} className="px-3 py-2 font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((report) => {
                const gallery = app.galleries.find((item) => item.id === report.galleryId);
                const exhibition = app.exhibitions.find((item) => item.id === report.exhibitionId);
                return (
                  <tr key={report.id} className="border-t border-hairline align-top">
                    <td className="px-3 py-2">{gallery?.name}</td>
                    <td className="px-3 py-2">{exhibition?.title}</td>
                    <td className="px-3 py-2">{report.zones.map((zone) => `${zone.zone} ${interestLabel(zone.interest)}`).join(", ")}</td>
                    <td className="px-3 py-2">{report.dwell.map((item) => `${item.zone} ${dwellLabel(item.estimate)}`).join(", ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </MockRegion>
    </Frame>
  );
}
