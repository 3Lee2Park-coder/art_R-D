"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { listExhibitionCustomers } from "@/lib/leaflet/galleryCustomers";
import {
  canViewExhibitionReport,
  CUSTOMER_ACCESS_DENIED,
  REPORT_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { formatDate, oneParam } from "@/lib/format";

export default function ExhibitionCustomersPage() {
  const exhibitionId = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((e) => e.id === exhibitionId);
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

  const items = useMemo(() => {
    if (!app.ready || !allowed || !app.myGalleryId) return [];
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    return listExhibitionCustomers({
      galleryId: app.myGalleryId,
      exhibitionIds: [exhibitionId],
      exhibitionId,
      contractEndAt: cutoff,
    });
  }, [
    app.ready,
    allowed,
    app.myGalleryId,
    exhibitionId,
    gallery?.contractState,
    gallery?.contractEndAt,
  ]);

  if (!allowed) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 고객" />
        <p>{REPORT_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  if (!exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 고객" />
        <p>{CUSTOMER_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title="전시 고객" kicker={exhibition.title} />
      {items.length === 0 ? (
        <p className="mt-6">데이터 부족</p>
      ) : (
        <ul className="mt-6 border-t border-hairline">
          {items.map((c) => (
            <li key={c.customerId} className="border-b border-hairline py-4">
              <Link
                href={`/studio/customers/${encodeURIComponent(c.customerId)}`}
                className="block no-underline"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-[17px] font-semibold text-ink">
                    {c.name ?? "이름 없음"}
                  </h2>
                  <span className="text-[14px] text-mute">식별</span>
                </div>
                <p className="m-0 mt-1 text-[14px] text-mute">
                  {c.lastVisitAt ? formatDate(c.lastVisitAt.slice(0, 10)) : "—"}
                  {c.hasInquiry ? " · 문의" : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 flex flex-wrap gap-4">
        <Link href={`/studio/reports/${exhibitionId}`} className="link">
          리포트
        </Link>
        <Link href="/studio/customers" className="link">
          전체 고객
        </Link>
        <Link href="/studio" className="link">
          내 전시
        </Link>
      </p>
    </Frame>
  );
}
