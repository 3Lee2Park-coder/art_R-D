"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPeriod } from "@/lib/format";
import { contractLabel } from "@/lib/labels";
import type { Gallery } from "@/lib/types";

type Filter = "all" | Gallery["contractState"];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "contracted", label: "계약" },
  { id: "uncontracted", label: "미계약" },
  { id: "ended", label: "계약 종료" },
];

export default function AccountsPage() {
  const app = useApp();
  const [filter, setFilter] = useState<Filter>("contracted");
  const rows = app.galleries.filter((gallery) => filter === "all" || gallery.contractState === filter);

  return (
    <Frame width="utility">
      <div className="flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
        <PageTitle title="갤러리 계정" />
        <Link href="/operator/accounts/new" className="btn btn-primary">
          계정 생성
        </Link>
      </div>
      <div className="chip-row">
        {FILTERS.map((item) => (
          <button key={item.id} type="button" className={item.id === filter ? "chip chip-selected" : "chip"} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {rows.length === 0 ? <p>해당하는 갤러리가 없습니다.</p> : null}
      <div>
        {rows.map((gallery) => {
          const shows = app.exhibitions.filter((item) => item.galleryId === gallery.id).length;
          const period = gallery.contractStart && gallery.contractEnd ? formatPeriod(gallery.contractStart, gallery.contractEnd) : "";
          return (
            <Link key={gallery.id} href={`/operator/galleries/${gallery.id}`} className="list-row">
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold">{gallery.name}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-[14px]">
                  <span>{gallery.region}</span>
                  <span className={gallery.contractState === "contracted" ? "status-badge status-badge-accent" : "status-badge"}>
                    {contractLabel(gallery.contractState)}
                  </span>
                  {period ? <span className="text-mute">{period}</span> : null}
                  <span className="text-mute">전시 {shows}</span>
                </span>
              </span>
              <span aria-hidden>→</span>
            </Link>
          );
        })}
      </div>
    </Frame>
  );
}
