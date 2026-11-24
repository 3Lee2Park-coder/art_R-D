"use client";

import { ReportBlock } from "@/components/report-block";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";

export default function AnalyticsPage() {
  const app = useApp();
  const shows = app.exhibitions.filter((item) => item.published || item.ended);
  return (
    <Frame width="utility">
      <PageTitle title="관람객 분석" />
      <div className="flex flex-col gap-8">
        {shows.map((exhibition) => {
          const report = app.reports.find((item) => item.exhibitionId === exhibition.id);
          return (
            <section key={exhibition.id}>
              <h2 className="text-[17px] font-semibold">{exhibition.title}</h2>
              {exhibition.ended && report ? (
                <ReportBlock report={report} />
              ) : (
                <p className="mt-2 text-[14px] text-mute">종료 후 집계됩니다.</p>
              )}
            </section>
          );
        })}
      </div>
    </Frame>
  );
}
