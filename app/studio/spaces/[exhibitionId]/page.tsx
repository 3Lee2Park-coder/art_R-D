"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import {
  buildZonesAnalytics,
  resolveZonesForExhibition,
  type ZonesAnalytics,
} from "@/lib/leaflet/analytics/zones";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import {
  canViewExhibitionReport,
  REPORT_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { oneParam } from "@/lib/format";
import { zonesForExhibition } from "@/lib/studio/exhibitionOps";

function fmtDwell(sec: number | null): string {
  if (sec == null) return "추정 불가";
  if (sec < 60) return `${Math.round(sec)}초`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s ? `${m}분 ${s}초` : `${m}분`;
}

export default function SpacesPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((e) => e.id === id);
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const allowed = useMemo(
    () =>
      canViewExhibitionReport({
        role: app.role,
        myGalleryId: app.myGalleryId,
        contractState: gallery?.contractState,
        exhibitionGalleryId: exhibition?.galleryId,
      }),
    [app.role, app.myGalleryId, gallery?.contractState, exhibition?.galleryId],
  );
  const [model, setModel] = useState<ZonesAnalytics | null>(null);

  useEffect(() => {
    if (!app.ready || !allowed) {
      setModel(null);
      return;
    }
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const source = readExhibitionReportSource(id, undefined, {
      contractEndAt: cutoff,
    });
    const zones = resolveZonesForExhibition(
      id,
      zonesForExhibition(app.exhibitionZones, id),
      app.artworks,
    );
    setModel(
      buildZonesAnalytics({
        source,
        zones,
        artworks: app.artworks,
      }),
    );
  }, [
    app.ready,
    allowed,
    id,
    gallery?.contractState,
    gallery?.contractEndAt,
    app.exhibitionZones,
    app.artworks,
  ]);

  if (!allowed || !exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="구역별 반응" />
        <p>{REPORT_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title="구역별 반응" kicker={exhibition.title} />

      {!model || model.empty ? (
        <p className="mt-6 text-[14px] text-mute">데이터 부족</p>
      ) : (
        <>
          <div className="studio-card mt-6">
            <h2 className="mt-0 text-[15px] font-semibold">
              구역별 배치 및 관람 성과 비교
            </h2>
            <div className="table-wrap mt-3">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>구역</th>
                    <th>벽면 길이</th>
                    <th>작품+간격 점유 폭</th>
                    <th>벽면 점유율</th>
                    <th>작품 수</th>
                    <th>작품 기록</th>
                    <th>참여 세션</th>
                    <th>평균 작품 감상</th>
                    <th>대표 감성</th>
                  </tr>
                </thead>
                <tbody>
                  {model.rows.map((z) => (
                    <tr key={z.zoneId}>
                      <td>
                        <strong>{z.name}</strong>
                      </td>
                      <td>
                        {z.wallLengthM != null
                          ? `${z.wallLengthM.toFixed(1)}m`
                          : "추정 불가"}
                      </td>
                      <td>
                        {z.occupiedWidthM != null
                          ? `${z.occupiedWidthM.toFixed(1)}m`
                          : "추정 불가"}
                      </td>
                      <td>
                        {z.occupancyPct != null
                          ? `${z.occupancyPct}%`
                          : "추정 불가"}
                      </td>
                      <td>{z.artworkCount}점</td>
                      <td>{z.recordCount}회</td>
                      <td>{z.participatingSessions}개</td>
                      <td>{fmtDwell(z.averageDwellSec)}</td>
                      <td>{z.topEmotionLabel ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="studio-card mt-6">
            <h2 className="mt-0 text-[15px] font-semibold">
              촬영 순서 기반 구역 전환
            </h2>
            {model.transitions.length === 0 ? (
              <p className="text-[14px] text-mute">데이터 부족</p>
            ) : (
              <ul className="mt-3 list-none p-0">
                {model.transitions.slice(0, 8).map((t) => (
                  <li
                    key={t.route}
                    className="flex justify-between border-b border-[var(--studio-line)] py-2 text-[14px]"
                  >
                    <span>{t.route}</span>
                    <span>
                      <strong>{t.count}회</strong>
                      <span className="ml-2 text-mute">{t.sharePct}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Frame>
  );
}
