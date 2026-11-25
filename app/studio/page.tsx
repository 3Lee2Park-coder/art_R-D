"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPeriod } from "@/lib/format";
import { contractLabel } from "@/lib/labels";
import { readSavedLeaflets } from "@/lib/storage";
import { buildCheckInMetrics } from "@/lib/leaflet/checkInMetrics";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import { EMPTY_INESTIMABLE } from "@/lib/leaflet/exhibitionReportView";
import {
  buildExhibitionOpsRows,
  filterExhibitionOpsRows,
} from "@/lib/studio/exhibitionOps";

type PeriodFilter = "전체" | "준비 중" | "진행 중" | "종료";

export default function StudioPage() {
  const app = useApp();
  const gallery = app.galleries.find((item) => item.id === app.myGalleryId);
  const shows = useMemo(
    () => app.exhibitions.filter((item) => item.galleryId === app.myGalleryId),
    [app.exhibitions, app.myGalleryId],
  );
  const contracted =
    app.role === "gallery-contracted" && gallery?.contractState === "contracted";
  const archive = app.role === "gallery-ended" || gallery?.contractState === "ended";
  const canReport = contracted || archive;
  const canRegister =
    contracted || app.role === "gallery-uncontracted";
  const [filter, setFilter] = useState<PeriodFilter>("전체");

  const rows = useMemo(() => {
    if (!app.ready) return [];
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const leafletCounts: Record<string, number> = {};
    const uniqueCheckIns: Record<string, number | null> = {};
    if (!(contracted || archive)) {
      for (const l of readSavedLeaflets()) {
        if (!l.exhibitionId) continue;
        leafletCounts[l.exhibitionId] = (leafletCounts[l.exhibitionId] ?? 0) + 1;
      }
    } else {
      for (const e of shows) {
        const source = readExhibitionReportSource(e.id, undefined, {
          contractEndAt: cutoff,
        });
        leafletCounts[e.id] = source.leaflets.length;
        uniqueCheckIns[e.id] = buildCheckInMetrics(
          source.checkInSessions ?? [],
          e.id,
          cutoff,
        ).uniqueCheckIns;
      }
    }
    return buildExhibitionOpsRows({
      exhibitions: shows,
      artworks: app.artworks,
      leafletCounts,
      uniqueCheckIns,
    });
  }, [app.ready, app.artworks, shows, gallery, contracted, archive]);

  const visible = filterExhibitionOpsRows(rows, filter);

  return (
    <Frame width="utility">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle title="전시 관리" kicker={gallery?.name} />
        {canRegister ? (
          <Link href="/studio/exhibitions/new?step=1" className="btn btn-primary">
            ＋ 전시 등록
          </Link>
        ) : null}
      </div>
      {gallery ? (
        <p className="mb-4 text-[14px] text-mute">{contractLabel(gallery.contractState)}</p>
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {(["전체", "준비 중", "진행 중", "종료"] as PeriodFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`btn btn-secondary min-h-10 px-3 ${filter === f ? "ring-1 ring-[var(--studio-green)]" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-[14px] text-mute">등록된 전시가 없습니다.</p>
      ) : (
        <div className="table-wrap">
          <table className="studio-table">
            <thead>
              <tr>
                <th>전시</th>
                <th>기간</th>
                <th>상태</th>
                <th>참여 작가</th>
                <th>작품</th>
                <th>고유 체크인</th>
                <th>리플릿</th>
                <th aria-label="작업" />
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const e = row.exhibition;
                return (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.title}</strong>
                      <div className="text-mute">{e.venue}</div>
                    </td>
                    <td>{formatPeriod(e.startDate, e.endDate)}</td>
                    <td>{row.state}</td>
                    <td>{row.artistCount}</td>
                    <td>{row.artworkCount}</td>
                    <td>
                      {row.uniqueCheckIns == null
                        ? EMPTY_INESTIMABLE
                        : row.uniqueCheckIns}
                    </td>
                    <td>{row.leafletCount}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {contracted ? (
                          <Link
                            href={`/studio/exhibitions/${e.id}/review`}
                            className="btn btn-secondary min-h-9 px-2"
                          >
                            배치
                          </Link>
                        ) : null}
                        {contracted &&
                        e.leafletEnabled &&
                        e.status === "contracted" ? (
                          <Link
                            href={`/studio/exhibitions/${e.id}/theme-color`}
                            className="btn btn-secondary min-h-9 px-2"
                          >
                            테마 색
                          </Link>
                        ) : null}
                        {contracted &&
                        e.published &&
                        e.status === "contracted" ? (
                          <Link
                            href={`/studio/exhibitions/${e.id}/qr`}
                            className="btn btn-secondary min-h-9 px-2"
                          >
                            QR
                          </Link>
                        ) : null}
                        {canReport ? (
                          <Link
                            href={`/studio/reports/${e.id}`}
                            className="btn btn-secondary min-h-9 px-2"
                          >
                            리포트
                          </Link>
                        ) : null}
                        {canReport ? (
                          <Link
                            href={`/studio/exhibitions/${e.id}/customers`}
                            className="btn btn-secondary min-h-9 px-2"
                          >
                            고객
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Frame>
  );
}
