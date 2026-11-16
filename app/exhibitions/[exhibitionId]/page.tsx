"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
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
    <Frame width="read">
      <PageTitle title={exhibition.title} kicker={gallery?.name} />
      <img src={exhibition.posterUrl} alt={exhibition.title} className="photo-shadow aspect-[4/5] w-full bg-parchment object-cover" />
      <p className="mt-4 text-[14px] text-mute">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
      <p className="text-[14px] text-mute">{exhibition.venue}</p>
      {exhibition.ended ? <p className="mt-2 text-[14px]">종료</p> : null}
      {exhibition.description ? <p className="mt-4">{exhibition.description}</p> : null}

      {canStart ? (
        <button type="button" className="btn btn-primary mt-8" onClick={start}>
          관람 시작
        </button>
      ) : null}

      {showQrNote ? (
        <div className="mt-8">
          <p>전시장 입구의 QR로 입장하면 리플릿을 만들 수 있습니다.</p>
          <button type="button" className="btn btn-secondary mt-4" onClick={() => app.toggleWanted(exhibition.id)}>
            {wanted ? "저장됨" : "가고 싶은 전시"}
          </button>
        </div>
      ) : null}

      {exhibition.status === "uncontracted" && !exhibition.ended ? (
        <Link href={`/record/leaflet?exhibition=${exhibition.id}`} className="btn btn-primary mt-8">
          기록하기
        </Link>
      ) : null}

      {works.length ? (
        <div className="mt-10 grid grid-cols-1 gap-4 min-[720px]:grid-cols-2">
          {works.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} artistName={app.artists.find((item) => item.id === artwork.artistId)?.name} />
          ))}
        </div>
      ) : null}
    </Frame>
  );
}
