"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { formatDate, formatPeriod } from "@/lib/format";

export default function ArchivePage() {
  const app = useApp();
  const wanted = app.wantedIds.map((id) => app.exhibitions.find((item) => item.id === id)).filter((item) => item !== undefined);
  const recommended = app.recommendedExhibitionIds
    .map((id) => app.exhibitions.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  return (
    <div className="leaflet-col pb-24">
      <PageTitle title="기록함" />
      <section>
        <h2 className="section-title">리플릿</h2>
        {app.archivedLeaflets.length === 0 ? <p className="mt-3 text-mute-on-dark">저장된 리플릿이 없습니다.</p> : null}
        <ul className="artwork-grid mt-4">
          {app.archivedLeaflets.map((leaflet) => {
            const exhibition = leaflet.exhibitionId ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId) : undefined;
            const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
            const cover = leaflet.photos[0]?.url ?? exhibition?.posterUrl;
            return (
              <li key={leaflet.id}>
                <Link href={`/my-room/leaflets/${leaflet.id}`} className="block overflow-hidden rounded-[18px] bg-surface-dark text-inherit no-underline">
                  {cover ? <img src={cover} alt="" className="aspect-[3/4] w-full object-cover" /> : <div className="aspect-[3/4] bg-canvas-dark-deep" />}
                  <span className="block px-3 pt-3 font-semibold">{title}</span>
                  <span className="caption block px-3 pt-1 pb-4">{formatDate(leaflet.visitDate)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="section-title">가고 싶은 전시</h2>
        {wanted.length === 0 ? <p className="mt-3 text-mute-on-dark">저장한 전시가 없습니다.</p> : null}
        <ul className="mt-4 flex flex-col gap-3">
          {wanted.map((exhibition) => (
            <li key={exhibition.id}>
              <Link href={`/exhibitions/${exhibition.id}`} className="block rounded-2xl bg-surface-dark px-4 py-4 text-inherit no-underline">
                <span className="block font-semibold">{exhibition.title}</span>
                <span className="mt-1 block text-[14px] text-mute-on-dark">{formatPeriod(exhibition.startDate, exhibition.endDate)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="section-title">추천 전시</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {recommended.map((exhibition) => (
            <li key={exhibition.id}>
              <Link href={`/exhibitions/${exhibition.id}`} className="block rounded-2xl bg-surface-dark px-4 py-4 text-inherit no-underline">
                <span className="block font-semibold">{exhibition.title}</span>
                <span className="mt-1 block text-[14px] text-mute-on-dark">
                  {formatPeriod(exhibition.startDate, exhibition.endDate)}
                  {exhibition.ended ? " · 종료" : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
