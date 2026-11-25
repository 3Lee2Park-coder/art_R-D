"use client";

import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import {
  customersCsvRows,
  downloadCsv,
  inquiriesCsvRows,
} from "@/lib/studio/exportCsv";
import { getGalleryCustomer, listGalleryCustomers } from "@/lib/leaflet/galleryCustomers";
import { listInquiries } from "@/lib/leaflet/inquiry";
import { isOnOrBeforeContractEnd } from "@/lib/leaflet/contractCutoff";

const CONNECTORS = [
  {
    logo: "AL",
    title: "Artlogic Connect",
    body: "연락처·오디언스·세일즈/마케팅·인벤토리 관리 영역과 데이터 연계를 검토합니다.",
    chip: "연동 검토 대상",
    badge: "미연결",
  },
  {
    logo: "A+",
    title: "Artsy / Artnet · First Thursday",
    body: "갤러리 운영 OS를 2027년 초 일부 파트너에게 제공할 예정이라고 발표했습니다.",
    chip: "향후 생태계 연계 검토",
    badge: "발표 단계",
  },
  {
    logo: "Q",
    title: "QuRated.art",
    body: "작품 QR·문의·스캔 알림 등 유사 서비스입니다. 데이터 교환 가능 여부는 별도 확인이 필요합니다.",
    chip: "서비스 비교·연계 검토",
    badge: "외부 서비스",
  },
  {
    logo: "CSV",
    title: "CSV 내보내기",
    body: "고객·문의 데이터를 CSV로 내려받아 외부 도구에 전달할 수 있습니다.",
    chip: "현재 지원",
    badge: "사용 가능",
  },
] as const;

export default function StudioConnectionsPage() {
  const app = useApp();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const ended = app.role === "gallery-ended" || gallery?.contractState === "ended";
  const canCsv =
    (app.role === "gallery-contracted" || ended) && Boolean(app.myGalleryId);

  function exportCustomers() {
    if (!app.myGalleryId) return;
    const exhibitionIds = app.exhibitions
      .filter((e) => e.galleryId === app.myGalleryId)
      .map((e) => e.id);
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const list = listGalleryCustomers({
      galleryId: app.myGalleryId,
      exhibitionIds,
      contractEndAt: cutoff,
    });
    const rows = customersCsvRows(
      list.map((c) => {
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

  function exportInquiries() {
    if (!app.myGalleryId) return;
    const galleryShowIds = new Set(
      app.exhibitions
        .filter((e) => e.galleryId === app.myGalleryId)
        .map((e) => e.id),
    );
    const endAt =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const mine = listInquiries().filter((i) => {
      if (!galleryShowIds.has(i.exhibitionId)) return false;
      if (endAt && !isOnOrBeforeContractEnd(i.createdAt, endAt)) return false;
      return true;
    });
    const rows = inquiriesCsvRows(
      mine.map((q) => {
        const art = app.artworks.find((a) => a.id === q.inquiredArtworkIds[0]);
        return {
          inquiryId: q.id,
          customerId: q.name,
          artworkTitle: art?.title ?? q.inquiredArtworkIds[0] ?? "",
          message: q.message ?? "",
          status: q.status,
          createdAt: q.createdAt,
        };
      }),
    );
    downloadCsv("restart-inquiries.csv", rows);
  }

  return (
    <Frame width="utility">
      <PageTitle title="외부 서비스 연동" kicker={gallery?.name} />
      <p className="mb-6 max-w-2xl text-[14px] text-mute">
        RestArt는 전시 현장의 관심·문의 데이터를 수집하고, 갤러리가 사용하는 운영
        도구와 연결되는 것을 목표로 합니다.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONNECTORS.map((c) => (
          <div key={c.title} className="studio-card flex gap-3">
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--studio-green-soft)] text-[13px] font-semibold text-[var(--studio-green)]"
              aria-hidden
            >
              {c.logo}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="m-0 text-[15px] font-semibold">{c.title}</h3>
                <span className="text-[12px] text-mute">{c.badge}</span>
              </div>
              <p className="mt-2 mb-2 text-[13px] text-mute">{c.body}</p>
              <span className="text-[11px] text-[var(--studio-amber-ink)]">
                {c.chip}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="studio-card mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <strong>현재 구현 범위</strong>
          <p className="m-0 mt-1 text-[13px] text-mute">
            실제 API 연동·자동 이메일 발송·외부 CRM 동기화는 포함되지 않습니다.
            CSV로 전달 흐름을 확인할 수 있습니다.
          </p>
        </div>
        {canCsv ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportCustomers}
            >
              고객 CSV
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={exportInquiries}
            >
              문의 CSV
            </button>
          </div>
        ) : null}
      </div>
    </Frame>
  );
}
