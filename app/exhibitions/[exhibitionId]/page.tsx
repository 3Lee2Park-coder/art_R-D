"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ArtworkCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SectionHeader, Shelf, SiteFooter } from "@/components/ui";
import { exhibitionReturnPath, formatPeriod, oneParam } from "@/lib/format";
import { KEYS } from "@/lib/storage";

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
    const qs = searchParams.toString();
    const suffix = qs ? `?${qs}` : "?from=qr";
    app.ensureVisit(exhibition!.id);
    const scenario = searchParams.get("scenario");
    if (scenario) app.setScenario(scenario);
    if (app.role === "visitor-member" && app.consentVersion) {
      router.push(app.guideHidden ? `${base}/hub${suffix}` : `${base}/guide${suffix}`);
      return;
    }
    router.push(`${base}/consent${suffix}`);
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
          <div className="mt-6 flex flex-col items-start gap-3">
            <button type="button" className="btn btn-primary" onClick={start}>
              관람 시작
            </button>
            {/* 미정: 인앱 브라우저 세션 */}
            <div className="flex gap-4 text-[13px]">
              <button
                type="button"
                className="link bg-transparent p-0 font-normal text-[13px] opacity-70"
                onClick={() => {
                  localStorage.setItem(
                    KEYS.returnTo,
                    exhibitionReturnPath(exhibition.id, searchParams.toString()),
                  );
                  router.push("/login");
                }}
              >
                로그인
              </button>
              <button
                type="button"
                className="link bg-transparent p-0 font-normal text-[13px] opacity-70"
                onClick={() => {
                  localStorage.setItem(
                    KEYS.returnTo,
                    exhibitionReturnPath(exhibition.id, searchParams.toString()),
                  );
                  router.push("/signup");
                }}
              >
                회원가입
              </button>
            </div>
          </div>
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
