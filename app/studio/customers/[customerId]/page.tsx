"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { getGalleryCustomer } from "@/lib/leaflet/galleryCustomers";
import {
  canViewGalleryCustomers,
  CUSTOMER_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { formatDate, oneParam } from "@/lib/format";

export default function StudioCustomerDetailPage() {
  const rawId = oneParam(useParams<{ customerId: string }>().customerId);
  const customerId = decodeURIComponent(rawId);
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

  const detail = useMemo(() => {
    if (!app.ready || !allowed || !app.myGalleryId) return null;
    const exhibitionIds = app.exhibitions
      .filter((e) => e.galleryId === app.myGalleryId)
      .map((e) => e.id);
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    return getGalleryCustomer({
      galleryId: app.myGalleryId,
      exhibitionIds,
      contractEndAt: cutoff,
      customerId,
    });
  }, [
    app.ready,
    allowed,
    app.myGalleryId,
    app.exhibitions,
    gallery?.contractState,
    gallery?.contractEndAt,
    customerId,
  ]);

  if (!allowed || !detail) {
    return (
      <Frame width="utility">
        <PageTitle title="고객" />
        <p>{CUSTOMER_ACCESS_DENIED}</p>
        <p className="mt-6">
          <Link href="/studio/customers" className="link">
            목록
          </Link>
        </p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title={detail.name ?? "고객"} kicker="고객 상세" />
      <p className="m-0 text-[14px] text-mute">식별</p>

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold">연락처</h2>
        {detail.emails.length === 0 && detail.phones.length === 0 ? (
          <p className="mt-2">데이터 부족</p>
        ) : (
          <ul className="mt-2 list-none p-0">
            {detail.emails.map((email) => (
              <li key={`e-${email}`} className="text-[15px]">
                이메일 · {email}
              </li>
            ))}
            {detail.phones.map((phone) => (
              <li key={`p-${phone}`} className="text-[15px]">
                전화 · {phone}
              </li>
            ))}
          </ul>
        )}
      </section>

      {(detail.consentContact !== null || detail.consentNews !== null) && (
        <section className="mt-6">
          <h2 className="text-[15px] font-semibold">동의</h2>
          <ul className="mt-2 list-none p-0 text-[15px]">
            {detail.consentContact !== null ? (
              <li>문의 응대 · {detail.consentContact ? "동의" : "미동의"}</li>
            ) : null}
            {detail.consentNews !== null ? (
              <li>전시 소식 · {detail.consentNews ? "동의" : "미동의"}</li>
            ) : null}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold">방문</h2>
        {detail.visits.length === 0 ? (
          <p className="mt-2">데이터 부족</p>
        ) : (
          <ul className="mt-2 list-none p-0">
            {detail.visits.map((v) => (
              <li key={`${v.exhibitionId}-${v.leafletId}`} className="text-[15px]">
                {v.exhibitionTitle ?? v.exhibitionId}
                {v.recordedAt ? ` · ${formatDate(v.recordedAt.slice(0, 10))}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold">관심 작품</h2>
        {detail.interests.length === 0 ? (
          <p className="mt-2">데이터 부족</p>
        ) : (
          <ul className="mt-2 list-none p-0">
            {detail.interests.map((w) => (
              <li key={`${w.artworkId}-${w.addedAt}`} className="text-[15px]">
                {w.title ?? w.artworkId}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold">문의</h2>
        {detail.inquiries.length === 0 ? (
          <p className="mt-2">데이터 부족</p>
        ) : (
          <ul className="mt-2 list-none p-0">
            {detail.inquiries.map((inq) => (
              <li key={inq.id} className="text-[15px]">
                <Link href={`/studio/inquiries/${inq.id}`} className="link">
                  {inq.createdAt ? formatDate(inq.createdAt.slice(0, 10)) : inq.id}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold">추천 작품</h2>
        {detail.recommendations.length === 0 ? (
          <p className="mt-2">데이터 부족</p>
        ) : (
          <ul className="mt-2 list-none p-0">
            {detail.recommendations.map((r, i) => (
              <li key={`rec-${r.leafletId}-${r.artworkId}-${i}`} className="text-[15px]">
                {r.artworkId}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-[15px] font-semibold">가장 닮은 작품</h2>
        {detail.similarArtworks.length === 0 ? (
          <p className="mt-2">데이터 부족</p>
        ) : (
          <ul className="mt-2 list-none p-0">
            {detail.similarArtworks.map((r, i) => (
              <li key={`sim-${r.leafletId}-${r.artworkId}-${i}`} className="text-[15px]">
                {r.artworkId}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-8">
        <Link href="/studio/customers" className="link">
          목록
        </Link>
      </p>
    </Frame>
  );
}
