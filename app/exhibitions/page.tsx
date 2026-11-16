"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Picture } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPeriod } from "@/lib/format";

export default function ExhibitionsPage() {
  const app = useApp();
  const [query, setQuery] = useState("");
  const shows = useMemo(
    () => app.exhibitions.filter((item) => item.published && (`${item.title} ${item.venue}`.includes(query.trim()) || query.trim() === "")),
    [app.exhibitions, query],
  );

  return (
    <Frame>
      <PageTitle title="전시" />
      <input className="field mb-6 max-w-md" value={query} placeholder="전시 이름, 장소" onChange={(event) => setQuery(event.target.value)} />
      {shows.length === 0 ? <p className="mb-6">해당하는 전시가 없습니다.</p> : null}
      <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
        {shows.map((exhibition) => {
          const gallery = app.galleries.find((item) => item.id === exhibition.galleryId);
          const contracted = exhibition.status === "contracted";
          return (
            <article key={exhibition.id} className="card">
              <Link href={`/exhibitions/${exhibition.id}`} className="block text-inherit no-underline">
                <Picture src={exhibition.posterUrl} alt={exhibition.title} />
              </Link>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {gallery ? <p className="text-[12px] font-semibold text-primary">{gallery.name}</p> : null}
                  {contracted && exhibition.leafletEnabled && !exhibition.ended ? <span className="mock-badge">리플릿</span> : null}
                  {exhibition.ended ? <span className="text-[12px] text-mute">종료</span> : null}
                </div>
                <Link href={`/exhibitions/${exhibition.id}`} className="mt-1 block text-[21px] font-semibold text-inherit no-underline">
                  {exhibition.title}
                </Link>
                <p className="mt-1 text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
                {!contracted && !exhibition.ended ? (
                  <Link href={`/record/leaflet?exhibition=${exhibition.id}`} className="btn btn-primary mt-4">
                    기록하기
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-10">
        <Link href="/record/new" className="link font-semibold">
          찾는 전시가 없습니다
        </Link>
      </p>
    </Frame>
  );
}
