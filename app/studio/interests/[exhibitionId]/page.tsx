"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import {
  buildInterestsAnalytics,
  buildRecommendationHistoryRows,
  interestsArtworkCsvRows,
  recommendationHistoryCsvRows,
  type InterestsAnalytics,
} from "@/lib/leaflet/analytics/interests";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import {
  canViewExhibitionReport,
  REPORT_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { oneParam } from "@/lib/format";
import { downloadCsv } from "@/lib/studio/exportCsv";

function fmtDwell(sec: number | null, samples: number): string {
  if (sec == null || samples <= 0) return "추정 불가";
  if (sec < 60) return `${Math.round(sec)}초`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return s ? `${m}분 ${s}초` : `${m}분`;
}

export default function InterestsPage() {
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
  const [model, setModel] = useState<InterestsAnalytics | null>(null);

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
    setModel(buildInterestsAnalytics(source));
  }, [app.ready, allowed, id, gallery?.contractState, gallery?.contractEndAt]);

  function exportArtworks() {
    if (!model) return;
    downloadCsv("restart-artwork-interests.csv", interestsArtworkCsvRows(model));
  }

  function exportRecommendations() {
    if (!allowed) return;
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const source = readExhibitionReportSource(id, undefined, {
      contractEndAt: cutoff,
    });
    downloadCsv(
      "restart-recommendation-history.csv",
      recommendationHistoryCsvRows(buildRecommendationHistoryRows(source)),
    );
  }

  if (!allowed || !exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="작품 관심 분석" />
        <p>{REPORT_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle title="작품 관심 분석" kicker={exhibition.title} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary" onClick={exportArtworks}>
            작품 데이터 내보내기
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={exportRecommendations}
          >
            추천 이력 내보내기
          </button>
        </div>
      </div>

      {model ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="studio-card">
              <div className="text-[12px] text-mute">작품 기록</div>
              <div className="text-[18px] font-semibold">{model.totalRecords}회</div>
            </div>
            <div className="studio-card">
              <div className="text-[12px] text-mute">관심 등록</div>
              <div className="text-[18px] font-semibold">{model.totalInterests}건</div>
            </div>
            <div className="studio-card">
              <div className="text-[12px] text-mute">기록→관심 비율</div>
              <div className="text-[18px] font-semibold">
                {model.overallRecordToInterestRate == null
                  ? "데이터 부족"
                  : `${model.overallRecordToInterestRate}%`}
              </div>
            </div>
            <div className="studio-card">
              <div className="text-[12px] text-mute">작품 문의</div>
              <div className="text-[18px] font-semibold">{model.totalInquiries}건</div>
            </div>
          </div>

          <div className="studio-card mt-6">
            <h2 className="mt-0 text-[15px] font-semibold">작품별 관람·관심 데이터</h2>
            {model.artworkRows.length === 0 ? (
              <p className="text-[14px] text-mute">데이터 부족</p>
            ) : (
              <div className="table-wrap mt-3">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>작품</th>
                      <th>작품 촬영 기록(카드 2)</th>
                      <th>관심 등록</th>
                      <th>기록→관심 비율</th>
                      <th>문의</th>
                      <th>평균 체류 추정</th>
                      <th>대표 감성</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.artworkRows.map((r) => (
                      <tr key={r.artworkId}>
                        <td>
                          <strong>{r.title}</strong>
                        </td>
                        <td>{r.recordCount}회</td>
                        <td>{r.interestCount}건</td>
                        <td>
                          {r.recordToInterestRate == null
                            ? "데이터 부족"
                            : `${r.recordToInterestRate}%`}
                        </td>
                        <td>{r.inquiryCount}건</td>
                        <td>{fmtDwell(r.averageDwellSec, r.dwellSampleCount)}</td>
                        <td>{r.topEmotionLabel ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="studio-card mt-6">
            <h2 className="mt-0 text-[15px] font-semibold">가장 닮은 작품</h2>
            {model.similarRows.length === 0 ? (
              <p className="text-[14px] text-mute">데이터 부족</p>
            ) : (
              <div className="table-wrap mt-3">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>작품</th>
                      <th>노출</th>
                      <th>노출 후 관심 등록</th>
                      <th>노출 후 문의</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.similarRows.map((r) => (
                      <tr key={`sim-${r.artworkId}`}>
                        <td>
                          <strong>{r.title}</strong>
                        </td>
                        <td>{r.exposureCount}회</td>
                        <td>{r.interestAfter}회</td>
                        <td>{r.inquiryAfter}건</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="studio-card mt-6">
            <h2 className="mt-0 text-[15px] font-semibold">추천</h2>
            {model.recommendationRows.length === 0 ? (
              <p className="text-[14px] text-mute">데이터 부족</p>
            ) : (
              <div className="table-wrap mt-3">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>RestArt 추천 작품</th>
                      <th>노출</th>
                      <th>노출 후 관심 등록</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.recommendationRows.map((r) => (
                      <tr key={`rec-${r.artworkId}`}>
                        <td>
                          <strong>{r.title}</strong>
                        </td>
                        <td>{r.exposureCount}회</td>
                        <td>{r.interestAfter}회</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </Frame>
  );
}
