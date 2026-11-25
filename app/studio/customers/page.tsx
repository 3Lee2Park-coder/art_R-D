"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import {
  getGalleryCustomer,
  listGalleryCustomers,
  type GalleryCustomerListItem,
} from "@/lib/leaflet/galleryCustomers";
import {
  canViewGalleryCustomers,
  CUSTOMER_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { formatDate } from "@/lib/format";
import { customersCsvRows, downloadCsv } from "@/lib/studio/exportCsv";

function CustomerRows({ items }: { items: GalleryCustomerListItem[] }) {
  if (items.length === 0) {
    return <p className="mt-6">데이터 부족</p>;
  }
  return (
    <ul className="mt-6 border-t border-hairline">
      {items.map((c) => (
        <li key={c.customerId} className="border-b border-hairline py-4">
          <Link href={`/studio/customers/${encodeURIComponent(c.customerId)}`} className="block no-underline">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[17px] font-semibold text-ink">{c.name ?? "이름 없음"}</h2>
              <span className="text-[14px] text-mute">식별</span>
            </div>
            <p className="m-0 mt-1 text-[14px] text-mute">
              {c.lastVisitAt ? formatDate(c.lastVisitAt.slice(0, 10)) : "—"}
              {c.hasInquiry ? " · 문의" : ""}
              {c.exhibitionIds.length ? ` · 전시 ${c.exhibitionIds.length}` : ""}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function StudioCustomersPage() {
  const app = useApp();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const allowed = useMemo(
    () =>
      canViewGalleryCustomers({
        role: app.role,
        myGalleryId: app.myGalleryId,
        contractState: gallery?.contractState,
      }),
    [app.role, app.myGalleryId, gallery?.contractState],
  );

  const items = useMemo(() => {
    if (!app.ready || !allowed || !app.myGalleryId) return [];
    const exhibitionIds = app.exhibitions
      .filter((e) => e.galleryId === app.myGalleryId)
      .map((e) => e.id);
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    return listGalleryCustomers({
      galleryId: app.myGalleryId,
      exhibitionIds,
      contractEndAt: cutoff,
    });
  }, [
    app.ready,
    allowed,
    app.myGalleryId,
    app.exhibitions,
    gallery?.contractState,
    gallery?.contractEndAt,
  ]);

  if (!allowed) {
    return (
      <Frame width="utility">
        <PageTitle title="전체 고객" />
        <p>{CUSTOMER_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  function exportCsv() {
    if (!app.myGalleryId) return;
    const exhibitionIds = app.exhibitions
      .filter((e) => e.galleryId === app.myGalleryId)
      .map((e) => e.id);
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const rows = customersCsvRows(
      items.map((c) => {
        const detail = getGalleryCustomer({
          galleryId: app.myGalleryId!,
          exhibitionIds,
          contractEndAt: cutoff,
          customerId: c.customerId,
        });
        return {
          customerId: c.customerId,
          displayName: c.name ?? "",
          email: detail?.emails[0] ?? null,
          phone: detail?.phones[0] ?? null,
          visitCount: detail?.visits.length ?? 0,
          inquiryCount: detail?.inquiries.length ?? 0,
          lastActivityAt: c.lastVisitAt,
        };
      }),
    );
    downloadCsv("restart-customers.csv", rows);
  }

  return (
    <Frame width="utility">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle title="전체 고객" kicker={gallery?.name} />
        <button type="button" className="btn btn-secondary" onClick={exportCsv}>
          CSV 내보내기
        </button>
      </div>
      <CustomerRows items={items} />
      <p className="mt-8">
        <Link href="/studio" className="link">
          전시 관리
        </Link>
      </p>
    </Frame>
  );
}
