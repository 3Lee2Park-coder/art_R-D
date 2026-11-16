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
    <div className="mx-auto w-full max-w-[720px] px-4 py-6 pb-24">
      <PageTitle title="기록함" dark />
      <section>
        <h2 className="text-[21px] font-semibold">리플릿</h2>
        {app.archivedLeaflets.length === 0 ? <p className="mt-3 text-mute-on-dark">저장된 리플릿이 없습니다.</p> : null}
        <ul className="mt-4 flex flex-col gap-3">
          {app.archivedLeaflets.map((leaflet) => {
            const exhibition = leaflet.exhibitionId ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId) : undefined;
            const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
            return (
              <li key={leaflet.id}>
                <Link href={`/my-room/leaflets/${leaflet.id}`} className="block rounded-2xl bg-surface-dark px-4 py-4 text-inherit no-underline">
                  <span className="block font-semibold">{title}</span>
                  <span className="mt-1 block text-[14px] text-mute-on-dark">{formatDate(leaflet.visitDate)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="text-[21px] font-semibold">가고 싶은 전시</h2>
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
        <h2 className="text-[21px] font-semibold">추천 전시</h2>
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
