"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { listInquiries, updateInquiry, type Inquiry } from "@/lib/leaflet/inquiry";
import {
  INQUIRY_STATUSES,
  SALE_RESULTS,
  type InquiryStatus,
  type SaleResult,
} from "@/lib/leaflet/inquiryStatus";
import { isOnOrBeforeContractEnd } from "@/lib/leaflet/contractCutoff";
import { formatDate, oneParam } from "@/lib/format";
import { canMutateStudioInquiry } from "@/lib/studioAccess";

export default function StudioInquiryDetailPage() {
  const id = oneParam(useParams<{ inquiryId: string }>().inquiryId);
  const app = useApp();
  const router = useRouter();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const canMutate = canMutateStudioInquiry(app.role, gallery?.contractState);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState<InquiryStatus>("신규");
  const [saleResult, setSaleResult] = useState<SaleResult>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!app.ready) return;
    const found = listInquiries().find((i) => i.id === id) ?? null;
    setInquiry(found);
    if (found) {
      setStatus(found.status);
      setSaleResult(found.saleResult);
    }
  }, [app.ready, id]);

  const galleryShowIds = new Set(
    app.exhibitions.filter((e) => e.galleryId === app.myGalleryId).map((e) => e.id),
  );
  const endAt =
    gallery?.contractState === "ended" ? gallery.contractEndAt : null;
  const allowed =
    inquiry &&
    galleryShowIds.has(inquiry.exhibitionId) &&
    !(endAt && !isOnOrBeforeContractEnd(inquiry.createdAt, endAt));

  if (!app.ready) {
    return (
      <Frame width="utility">
        <PageTitle title="문의" />
      </Frame>
    );
  }

  if (!allowed) {
    return (
      <Frame width="utility">
        <PageTitle title="문의" />
        <p>문의를 찾을 수 없습니다.</p>
        <p className="mt-6">
          <Link href="/studio/inquiries" className="link">
            목록
          </Link>
        </p>
      </Frame>
    );
  }

  const art = app.artworks.find((a) => a.id === inquiry!.inquiredArtworkIds[0]);
  const exhibition = app.exhibitions.find((e) => e.id === inquiry!.exhibitionId);

  function onSave(event: FormEvent) {
    event.preventDefault();
    if (!canMutate) return;
    const next = updateInquiry(inquiry!.id, { status, saleResult });
    if (next) {
      setInquiry(next);
      setSaved(true);
    }
  }

  return (
    <Frame width="utility">
      <PageTitle title={inquiry.name} kicker="문의" />
      <p className="m-0 text-[14px] text-mute">
        {exhibition?.title ?? inquiry.exhibitionId} · {formatDate(inquiry.createdAt.slice(0, 10))}
      </p>
      <p className="mt-2 m-0 text-[15px]">{art?.title ?? inquiry.inquiredArtworkIds.join(", ")}</p>
      <p className="mt-2 m-0 text-[14px]">
        {inquiry.contactMethod === "email" ? "이메일" : "연락처"} · {inquiry.contactValue}
      </p>
      {inquiry.message ? <p className="mt-4 m-0 text-[15px]">{inquiry.message}</p> : null}

      <form className="utility-panel mt-8" onSubmit={onSave}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">상태</span>
          <select
            className="field"
            value={status}
            disabled={!canMutate}
            onChange={(e) => setStatus(e.target.value as InquiryStatus)}
          >
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-[14px] font-semibold">판매 결과</span>
          <select
            className="field"
            value={saleResult ?? ""}
            disabled={!canMutate}
            onChange={(e) => {
              const v = e.target.value;
              setSaleResult(v === "" ? null : (v as Exclude<SaleResult, null>));
            }}
          >
            <option value="">미입력</option>
            {SALE_RESULTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {canMutate ? (
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          ) : null}
          <button type="button" className="btn btn-secondary" onClick={() => router.push("/studio/inquiries")}>
            목록
          </button>
        </div>
        {saved ? <p className="mt-3 mb-0 text-[14px]">저장했습니다.</p> : null}
      </form>
    </Frame>
  );
}
