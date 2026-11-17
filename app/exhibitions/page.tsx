"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ExhibitionCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SiteFooter } from "@/components/ui";

type Filter = "all" | "contracted" | "uncontracted";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "contracted", label: "리플릿 전시" },
  { id: "uncontracted", label: "미리플릿 전시" },
];

export default function ExhibitionsPage() {
  const app = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const searched = query.trim().length > 0;
  const shows = useMemo(
    () =>
      app.exhibitions.filter((item) => {
        if (!item.published) return false;
        if (filter !== "all" && item.status !== filter) return false;
        const text = query.trim();
        return text === "" || `${item.title} ${item.venue}`.includes(text);
      }),
    [app.exhibitions, filter, query],
  );

  return (
    <>
      <Frame>
        <PageTitle title="전시" />
        <input className="search-input mb-6 max-w-[480px]" value={query} placeholder="전시 이름, 장소" onChange={(event) => setQuery(event.target.value)} />
        <div className="chip-row">
          {FILTERS.map((item) => (
            <button key={item.id} type="button" className={item.id === filter ? "chip chip-selected" : "chip"} onClick={() => setFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        {shows.length === 0 && !searched ? <p className="mb-6">해당하는 전시가 없습니다.</p> : null}
        <div className="artwork-grid">
          {shows.map((exhibition) => (
            <ExhibitionCard
              key={exhibition.id}
              exhibition={exhibition}
              galleryName={app.galleries.find((item) => item.id === exhibition.galleryId)?.name}
              href={`/exhibitions/${exhibition.id}`}
            />
          ))}
        </div>
        {searched && shows.length === 0 ? (
          <p className="mt-10">
            <Link href="/record/new" className="link">
              찾는 전시가 없습니다
            </Link>
          </p>
        ) : null}
      </Frame>
      <SiteFooter />
    </>
  );
}
