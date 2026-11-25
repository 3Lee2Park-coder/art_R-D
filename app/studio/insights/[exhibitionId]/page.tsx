"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { buildInsightsAnalytics, type InsightsAnalytics } from "@/lib/leaflet/analytics/insights";
import { buildInterestsAnalytics } from "@/lib/leaflet/analytics/interests";
import {
  buildZonesAnalytics,
  resolveZonesForExhibition,
} from "@/lib/leaflet/analytics/zones";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import {
  canViewExhibitionReport,
  REPORT_ACCESS_DENIED,
} from "@/lib/leaflet/reportAccess";
import { oneParam } from "@/lib/format";
import { EXHIBITION_OBJECTIVES, goalsForExhibition, zonesForExhibition } from "@/lib/studio/exhibitionOps";
import { canMutateStudioInquiry } from "@/lib/studioAccess";

export default function InsightsPage() {
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
  const canEditGoals = canMutateStudioInquiry(
    app.role,
    gallery?.contractState,
  );
  const [model, setModel] = useState<InsightsAnalytics | null>(null);
  const [editing, setEditing] = useState(false);
  const [objDraft, setObjDraft] = useState<string[]>([]);
  const [records, setRecords] = useState("");
  const [interests, setInterests] = useState("");
  const [inquiries, setInquiries] = useState("");

  function reload() {
    if (!app.ready || !allowed) {
      setModel(null);
      return;
    }
    const cutoff =
      gallery?.contractState === "ended" ? gallery.contractEndAt : null;
    const source = readExhibitionReportSource(id, undefined, {
      contractEndAt: cutoff,
    });
    const interestsA = buildInterestsAnalytics(source);
    const zones = resolveZonesForExhibition(
      id,
      zonesForExhibition(app.exhibitionZones, id),
      app.artworks,
    );
    const zonesA = buildZonesAnalytics({
      source,
      zones,
      artworks: app.artworks,
    });
    const goals = goalsForExhibition(app.exhibitionGoals, id);
    setModel(
      buildInsightsAnalytics({
        goals,
        interests: interestsA,
        zones: zonesA,
      }),
    );
    setObjDraft(goals?.objectives ?? []);
    setRecords(goals?.targets.records != null ? String(goals.targets.records) : "");
    setInterests(
      goals?.targets.interests != null ? String(goals.targets.interests) : "",
    );
    setInquiries(
      goals?.targets.inquiries != null ? String(goals.targets.inquiries) : "",
    );
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    app.ready,
    allowed,
    id,
    gallery?.contractState,
    gallery?.contractEndAt,
    app.exhibitionGoals,
    app.exhibitionZones,
    app.artworks,
  ]);

  function saveGoals(event: FormEvent) {
    event.preventDefault();
    if (!canEditGoals) return;
    app.saveExhibitionGoals({
      exhibitionId: id,
      objectives: objDraft,
      targets: {
        records: records.trim() === "" ? null : Number(records),
        interests: interests.trim() === "" ? null : Number(interests),
        inquiries: inquiries.trim() === "" ? null : Number(inquiries),
      },
    });
    setEditing(false);
  }

  if (!allowed || !exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 개선 인사이트" />
        <p>{REPORT_ACCESS_DENIED}</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title="전시 개선 인사이트" kicker={exhibition.title} />

      <div className="studio-card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="m-0 text-[15px] font-semibold">이번 전시의 주요 목표</h2>
          {canEditGoals ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditing((v) => !v)}
            >
              목표 수정
            </button>
          ) : null}
        </div>
        {model ? (
          <>
            <p className="mt-3 text-[14px]">
              {model.objectives.length
                ? model.objectives.join(", ")
                : "설정된 목표가 없습니다."}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {model.goalRows.map((g) => (
                <div key={g.label} className="rounded-xl border border-[var(--studio-line)] p-3">
                  <div className="text-[12px] text-mute">{g.label}</div>
                  <div className="mt-1 text-[16px] font-semibold">
                    {g.actual}
                    {g.target != null ? ` / ${g.target}` : ""}
                  </div>
                  <div className="mt-1 text-[12px] text-mute">
                    {g.achievementPct == null
                      ? "추정 불가"
                      : `${g.achievementPct}% 달성`}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {editing && canEditGoals ? (
          <form className="mt-4 flex max-w-lg flex-col gap-3" onSubmit={saveGoals}>
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold">목표</legend>
              {EXHIBITION_OBJECTIVES.map((o) => {
                const checked = objDraft.includes(o);
                return (
                  <label key={o} className="mb-1 flex items-center gap-2 text-[13px]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setObjDraft((prev) =>
                          checked ? prev.filter((x) => x !== o) : [...prev, o],
                        )
                      }
                    />
                    {o}
                  </label>
                );
              })}
            </fieldset>
            <label className="block text-[13px]">
              작품 기록 목표
              <input
                className="field mt-1"
                type="number"
                min={0}
                value={records}
                onChange={(e) => setRecords(e.target.value)}
              />
            </label>
            <label className="block text-[13px]">
              관심 등록 목표
              <input
                className="field mt-1"
                type="number"
                min={0}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </label>
            <label className="block text-[13px]">
              작품 문의 목표
              <input
                className="field mt-1"
                type="number"
                min={0}
                value={inquiries}
                onChange={(e) => setInquiries(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              목표 저장
            </button>
          </form>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {model?.cards.map((c) => (
          <div key={c.tag + c.title} className="studio-card">
            <span className="text-[11px] font-semibold text-[var(--studio-amber-ink)]">
              {c.tag}
            </span>
            <h3 className="mt-2 text-[15px] font-semibold">{c.title}</h3>
            <p className="text-[13px]">
              <strong>관찰:</strong> {c.observation}
            </p>
            {c.hypothesis ? (
              <p className="text-[13px]">
                <strong>검토 가설:</strong> {c.hypothesis}
              </p>
            ) : null}
            {c.experiment ? (
              <p className="text-[13px]">
                <strong>제안 실험:</strong> {c.experiment}
              </p>
            ) : null}
            {c.suggestion ? (
              <p className="text-[13px]">
                <strong>제안:</strong> {c.suggestion}
              </p>
            ) : null}
            <p className="text-[12px] text-mute">{c.metricRef}</p>
          </div>
        ))}
        {model && model.cards.length === 0 ? (
          <p className="text-[14px] text-mute">데이터 부족</p>
        ) : null}
      </div>
    </Frame>
  );
}
