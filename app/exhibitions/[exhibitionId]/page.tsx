"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SectionHeader, Shelf, SiteFooter } from "@/components/ui";
import { formatPeriod, oneParam } from "@/lib/format";

export default function ExhibitionPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const searchParams = useSearchParams();
  const fromQr = searchParams.get("from") === "qr";
  const router = useRouter();
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);

  useEffect(() => {
    if (fromQr) app.markQr(id);
  }, [app, fromQr, id]);

  if (!exhibition) {
    return (
      <Frame>
        <PageTitle title="전시" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  const gallery = exhibition.galleryId ? app.galleries.find((item) => item.id === exhibition.galleryId) : undefined;
  const works = app.artworks.filter((item) => item.exhibitionId === exhibition.id);
  const canStart = fromQr && exhibition.status === "contracted" && exhibition.leafletEnabled && !exhibition.ended;
  const showQrNote = !fromQr && exhibition.status === "contracted" && exhibition.leafletEnabled && !exhibition.ended;
  const wanted = app.wantedIds.includes(exhibition.id);

  function start() {
    const base = `/exhibitions/${exhibition!.id}`;
    if (app.role === "visitor-member" && app.consentVersion) {
      router.push(app.guideHidden ? `${base}/capture?from=qr` : `${base}/guide?from=qr`);
      return;
    }
    router.push(`${base}/consent?from=qr`);
  }

  return (
    <>
      <div className="keyvisual">
        <img src={exhibition.posterUrl} alt={exhibition.title} />
      </div>
      <Frame width="read" className="!pb-0">
        <PageTitle title={exhibition.title} kicker={gallery?.name} lead={exhibition.description ?? undefined} />
        <p className="caption">
          {formatPeriod(exhibition.startDate, exhibition.endDate)}
          <br />
          {exhibition.venue}
          {exhibition.ended ? " · 종료" : ""}
        </p>
        {canStart ? (
          <button type="button" className="btn btn-primary mt-6" onClick={start}>
            관람 시작
          </button>
        ) : null}
        {showQrNote ? (
          <div className="mt-6 flex flex-col items-start gap-3">
            <p className="m-0">전시장 입구의 QR로 입장하면 리플릿을 만들 수 있습니다.</p>
            <button type="button" className="btn btn-secondary" onClick={() => app.toggleWanted(exhibition.id)}>
              {wanted ? "저장됨" : "가고 싶은 전시"}
            </button>
          </div>
        ) : null}
        {exhibition.status === "uncontracted" && !exhibition.ended ? (
          <Link href={`/record/leaflet?exhibition=${exhibition.id}`} className="btn btn-primary mt-6">
            기록하기
          </Link>
        ) : null}
      </Frame>
      {works.length ? (
        <Frame className="mt-14">
          <SectionHeader title="작품" />
          <Shelf>
            {works.map((artwork) => (
              <ArtworkCard key={artwork.id} shelf artwork={artwork} artistName={app.artists.find((item) => item.id === artwork.artistId)?.name} />
            ))}
          </Shelf>
        </Frame>
      ) : (
        <div className="h-14" />
      )}
      <SiteFooter />
    </>
  );
}
