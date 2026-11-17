"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { Frame, MockRegion, PageTitle, SectionHeader } from "@/components/ui";
import { formatPeriod, formatPrice, oneParam } from "@/lib/format";
import { contractLabel, exhibitionStateLabel, interestLabel } from "@/lib/labels";
import type { Exhibition, Gallery } from "@/lib/types";

const STATES: Gallery["contractState"][] = ["contracted", "uncontracted", "ended"];

export default function OperatorGalleryPage() {
  const id = oneParam(useParams<{ galleryId: string }>().galleryId);
  const app = useApp();
  const gallery = app.galleries.find((item) => item.id === id);
  if (!gallery) {
    return (
      <Frame width="utility">
        <PageTitle title="갤러리" />
        <p>갤러리를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  const shows = app.exhibitions.filter((item) => item.galleryId === gallery.id);
  const live = shows.filter((item) => item.published && !item.ended);
  const upcoming = shows.filter((item) => !item.ended && !item.published);
  const ended = shows.filter((item) => item.ended);
  const reports = app.reports.filter((item) => item.galleryId === gallery.id);
  const period = gallery.contractStart && gallery.contractEnd ? formatPeriod(gallery.contractStart, gallery.contractEnd) : "";

  return (
    <Frame width="utility">
      <PageTitle title={gallery.name} kicker={gallery.region} lead={gallery.bio ?? undefined} />

      <SectionHeader title="기본 정보" />
      <section className="utility-panel mb-8">
        {gallery.imageUrl ? (
          <div className="frame-portrait w-[180px]">
            <img src={gallery.imageUrl} alt="" />
          </div>
        ) : null}
        {gallery.manager ? <p>담당자 {gallery.manager}</p> : null}
        {gallery.email ? <p>{gallery.email}</p> : null}
        {gallery.phone ? <p>{gallery.phone}</p> : null}
      </section>

      <SectionHeader title="계약 정보" />
      <section className="utility-panel mb-8">
        <p>
          <span className={gallery.contractState === "contracted" ? "status-badge status-badge-accent" : "status-badge"}>
            {contractLabel(gallery.contractState)}
          </span>
        </p>
        {period ? <p>{period}</p> : null}
        <div className="flex flex-wrap gap-2">
          {STATES.map((state) => (
            <button
              key={state}
              type="button"
              className={gallery.contractState === state ? "btn btn-primary min-h-11 px-3" : "btn btn-secondary min-h-11 px-3"}
              onClick={() => app.setContract(gallery.id, state)}
            >
              {contractLabel(state)}
            </button>
          ))}
        </div>
      </section>

      <SectionHeader title="전시" />
      {live.length + upcoming.length + ended.length === 0 ? <p>등록된 전시가 없습니다.</p> : null}
      <ExhibitionGroup label="게시" items={live} />
      <ExhibitionGroup label="예정" items={upcoming} />
      <ExhibitionGroup label="종료" items={ended} />

      <div className="mt-8">
        <SectionHeader title="작품" />
        {shows.length === 0 ? <p>등록된 작품이 없습니다.</p> : null}
        {shows.map((exhibition) => {
          const works = app.artworks.filter((item) => item.exhibitionId === exhibition.id);
          return (
            <section key={exhibition.id} className="mb-6">
              <h3 className="text-[17px] font-semibold">{exhibition.title}</h3>
              {works.length === 0 ? <p className="caption mt-2">등록된 작품이 없습니다.</p> : null}
              {works.map((artwork) => {
                const artist = app.artists.find((item) => item.id === artwork.artistId);
                return (
                  <div key={artwork.id} className="list-row">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{artwork.title}</span>
                      <span className="caption">
                        {[artist?.name, artwork.zone, artwork.priceKrw !== null ? formatPrice(artwork.priceKrw) : "", artwork.forSale ? "판매" : "비판매"]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <SectionHeader title="전시 리포트" />
      {reports.length === 0 ? <p>리포트가 없습니다.</p> : null}
      <MockRegion>
        {reports.map((report) => {
          const exhibition = app.exhibitions.find((item) => item.id === report.exhibitionId);
          return (
            <div key={report.id} className="utility-panel mb-4">
              <p className="font-semibold">{exhibition?.title}</p>
              <p>{report.zones.map((zone) => `${zone.zone} ${interestLabel(zone.interest)}`).join(", ")}</p>
            </div>
          );
        })}
      </MockRegion>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link href={`/operator/exhibitions?gallery=${gallery.id}`} className="btn btn-secondary">
          전시 확인
        </Link>
        <Link href={`/operator/artworks?gallery=${gallery.id}`} className="btn btn-secondary">
          작품 DB
        </Link>
        <Link href={`/operator/reports?gallery=${gallery.id}`} className="btn btn-secondary">
          전시 리포트
        </Link>
      </div>
    </Frame>
  );
}

function ExhibitionGroup({ label, items }: { label: string; items: Exhibition[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-4">
      <h3 className="text-[14px] font-semibold">{label}</h3>
      {items.map((exhibition) => (
        <div key={exhibition.id} className="list-row">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{exhibition.title}</span>
            <span className="caption">{formatPeriod(exhibition.startDate, exhibition.endDate)}</span>
          </span>
          <span className={exhibition.published && !exhibition.ended ? "status-badge status-badge-accent" : "status-badge"}>
            {exhibitionStateLabel(exhibition)}
          </span>
          {exhibition.status === "contracted" ? (
            <Link href={`/operator/exhibitions/${exhibition.id}/layout`} className="btn btn-utility">
              배치 점검
            </Link>
          ) : null}
        </div>
      ))}
    </section>
  );
}
