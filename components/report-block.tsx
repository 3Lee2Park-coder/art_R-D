"use client";

import { MockRegion } from "@/components/ui";
import { useApp } from "@/components/providers";
import { dwellLabel, interestLabel } from "@/lib/labels";
import type { Report } from "@/lib/types";

export function ReportBlock({ report }: { report: Report }) {
  const { artworks } = useApp();
  return (
    <MockRegion>
      <div className="flex flex-col gap-6 pt-2">
        <section>
          <h2 className="text-[17px] font-semibold">구역 관심</h2>
          <ul className="mt-2">
            {report.zones.map((zone) => (
              <li key={zone.zone} className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
                <span>{zone.zone}</span>
                <span>{interestLabel(zone.interest)}</span>
              </li>
            ))}
          </ul>
        </section>
        {report.artworks.length ? (
          <section>
            <h2 className="text-[17px] font-semibold">작품 관심</h2>
            <ul className="mt-2">
              {report.artworks.map((item) => (
                <li key={item.artworkId} className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
                  <span>{artworks.find((artwork) => artwork.id === item.artworkId)?.title ?? item.artworkId}</span>
                  <span>{interestLabel(item.interest)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section>
          <h2 className="text-[17px] font-semibold">체류</h2>
          <ul className="mt-2">
            {report.dwell.map((item) => (
              <li key={item.zone} className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
                <span>{item.zone}</span>
                <span>{dwellLabel(item.estimate)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MockRegion>
  );
}
