"use client";

import { SectionHeader } from "@/components/ui";
import {
  EMPTY_ARTWORK_ROWS,
  EMPTY_DATA,
  EMPTY_ZONES,
  LABEL_UNSPECIFIED,
  type ExhibitionReportViewModel,
} from "@/lib/leaflet/exhibitionReportView";

function KpiGrid({ items }: { items: ExhibitionReportViewModel["kpis"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((kpi) => (
        <div key={kpi.label} className="utility-panel !p-4">
          <p className="m-0 text-[13px] text-mute">{kpi.label}</p>
          <p className="mt-1 mb-0 text-[20px] font-semibold tabular-nums">
            {kpi.value === null ? (
              <span className="text-[14px] font-normal text-mute">{EMPTY_DATA}</span>
            ) : (
              <>
                {kpi.value}
                <span className="ml-0.5 text-[13px] font-normal text-mute">{kpi.unit}</span>
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

function BarList({ rows }: { rows: { label: string; value: number; pct: number }[] }) {
  if (rows.every((r) => r.value === 0)) {
    return <p className="m-0 text-[14px] text-mute">{EMPTY_DATA}</p>;
  }
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center gap-3 text-[14px]">
          <span className="w-28 shrink-0">{row.label}</span>
          <div className="h-2 min-w-0 flex-1 rounded-sm bg-hairline">
            <div
              className="h-2 rounded-sm bg-ink"
              style={{ width: `${row.pct}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right tabular-nums">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyCard({ title, kicker, message }: { title: string; kicker?: string; message: string }) {
  return (
    <section className="utility-panel">
      <SectionHeader title={title} />
      {kicker ? <p className="mt-0 mb-3 text-[13px] text-mute">{kicker}</p> : null}
      <p className="m-0 text-[14px] text-mute">{message}</p>
    </section>
  );
}

export function ExhibitionReportView({ model }: { model: ExhibitionReportViewModel }) {
  return (
    <div className="flex flex-col gap-8">
      <p className="m-0 text-[13px] text-mute">테마 색 · {model.themeColorName}</p>

      <section>
        <SectionHeader title="요약" />
        <KpiGrid items={model.kpis} />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <EmptyCard
          title="날짜별 전시 방문 추이"
          kicker="고유 QR 체크인 세션 · 날짜별"
          message={model.visitTrendEmpty}
        />
        <EmptyCard
          title="시간대별 전시 방문 추이"
          kicker="고유 QR 체크인 세션 · 2시간 단위"
          message={model.hourlyTrendEmpty}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="utility-panel">
          <SectionHeader title="관람 참여 퍼널" />
          <p className="mt-0 mb-3 text-[13px] text-mute">동일한 전시·기간 기준</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {model.funnel.map((step) => (
              <li key={step.label} className="flex justify-between gap-3 text-[14px]">
                <span>{step.label}</span>
                <span className="tabular-nums text-mute">
                  {step.value === null ? EMPTY_DATA : step.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="utility-panel">
          <SectionHeader title="관람 스타일 분포" />
          <p className="mt-0 mb-3 text-[13px] text-mute">리플릿 기준 v1 · 실험 지표</p>
          <BarList rows={model.styles} />
          {model.typeNames.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-[14px] font-semibold">유형명</p>
              <BarList rows={model.typeNames} />
            </div>
          ) : null}
        </section>
      </div>

      <section className="utility-panel">
        <SectionHeader title="작품별 관람·관심 데이터" />
        <p className="mt-0 mb-3 text-[13px] text-mute">촬영 기록 · 관심 등록 · 문의 · 체류 시간</p>
        {model.interests.length === 0 ? (
          <p className="m-0 text-[14px] text-mute">{EMPTY_ARTWORK_ROWS}</p>
        ) : (
          <ul className="m-0 list-none border-t border-hairline p-0">
            {model.interests.map((row) => (
              <li
                key={row.artworkId}
                className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]"
              >
                <span>{row.label}</span>
                <span className="tabular-nums text-mute">관심 {row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="utility-panel">
        <SectionHeader title="구역" />
        {!model.zonesAvailable || model.zones.length === 0 ? (
          <p className="m-0 text-[14px] text-mute">{EMPTY_ZONES}</p>
        ) : (
          <ul className="m-0 list-none border-t border-hairline p-0">
            {model.zones.map((z) => (
              <li
                key={z.zone}
                className="flex flex-wrap justify-between gap-2 border-b border-hairline py-2 text-[14px]"
              >
                <span>{z.zone}</span>
                <span className="text-mute">
                  기록 {z.recordCount}
                  {z.dwellLabel ? ` · 평균 ${z.dwellLabel}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <EmptyCard
        title="가장 닮은 작품 추천 성과"
        kicker="리플릿에 실제 노출된 추천 작품 기준"
        message={model.recommendationsEmpty}
      />

      <section className="utility-panel">
        <SectionHeader title="이 전시의 고객·리플릿 세션" />
        <p className="mt-0 mb-3 text-[13px] text-mute">연락처 확인 고객과 익명 방문을 분리해 표시</p>
        <ul className="m-0 list-none border-t border-hairline p-0">
          <li className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
            <span>식별</span>
            <span className="tabular-nums">{model.visitors.identified}</span>
          </li>
          <li className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
            <span>익명</span>
            <span className="tabular-nums">{model.visitors.anonymous}</span>
          </li>
          <li className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
            <span>{LABEL_UNSPECIFIED}</span>
            <span className="tabular-nums">{model.visitors.unspecified}</span>
          </li>
          <li className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
            <span>리플릿</span>
            <span className="tabular-nums">{model.leafletCount}</span>
          </li>
        </ul>

        <p className="mt-6 mb-2 text-[14px] font-semibold">문의</p>
        <ul className="m-0 list-none border-t border-hairline p-0">
          <li className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]">
            <span>전체</span>
            <span className="tabular-nums">{model.inquiryTotal}</span>
          </li>
          {model.inquiryByStatus.map((row) => (
            <li
              key={row.label}
              className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]"
            >
              <span>{row.label}</span>
              <span className="tabular-nums">{row.count}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 mb-2 text-[14px] font-semibold">판매 결과</p>
        <ul className="m-0 list-none border-t border-hairline p-0">
          {model.saleSummary.map((row) => (
            <li
              key={row.label}
              className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]"
            >
              <span>{row.label}</span>
              <span className="tabular-nums">{row.count}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 mb-2 text-[14px] font-semibold">감성</p>
        {model.emotions.length === 0 ? (
          <p className="m-0 text-[14px] text-mute">{EMPTY_DATA}</p>
        ) : (
          <ul className="m-0 list-none border-t border-hairline p-0">
            {model.emotions.map((e) => (
              <li
                key={e.emotionId}
                className="flex justify-between gap-3 border-b border-hairline py-2 text-[14px]"
              >
                <span>{e.label}</span>
                <span className="tabular-nums">{e.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
