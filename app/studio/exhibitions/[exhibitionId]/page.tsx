"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, MockRegion, PageTitle, SectionHeader } from "@/components/ui";
import { formatPeriod, oneParam } from "@/lib/format";
import { exhibitionStateLabel } from "@/lib/labels";

export default function StudioExhibitionPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id && item.galleryId === app.myGalleryId);
  const contracted = app.role === "gallery-contracted";
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="전시" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  const report = app.reports.find((item) => item.exhibitionId === exhibition.id);
  const showQr = contracted && exhibition.published && exhibition.status === "contracted";

  function beginEdit() {
    setTitle(exhibition!.title);
    setVenue(exhibition!.venue);
    setStart(exhibition!.startDate);
    setEnd(exhibition!.endDate);
    setDescription(exhibition!.description ?? "");
    setError("");
    setEditing(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !venue.trim() || !start || !end) {
      setError("전시 이름, 장소, 기간을 입력해 주세요.");
      return;
    }
    if (end < start) {
      setError("기간을 다시 확인해 주세요.");
      return;
    }
    app.patchExhibition(exhibition!.id, {
      title: title.trim(),
      venue: venue.trim(),
      startDate: start,
      endDate: end,
      description: contracted ? description.trim() || null : exhibition!.description,
    });
    setEditing(false);
  }

  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker={exhibitionStateLabel(exhibition)} />
      <p className="caption">{formatPeriod(exhibition.startDate, exhibition.endDate)}</p>
      <p className="mt-2">{exhibition.venue}</p>

      <div className="mt-6">
        <SectionHeader title="기본 정보" />
        {editing ? (
          <form className="utility-panel" onSubmit={save}>
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold">전시 이름</span>
              <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold">장소</span>
              <input className="field" value={venue} onChange={(event) => setVenue(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold">시작</span>
              <input className="field" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold">종료</span>
              <input className="field" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
            </label>
            {contracted ? (
              <label className="block">
                <span className="mb-2 block text-[14px] font-semibold">소개</span>
                <textarea className="field min-h-28" value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
            ) : null}
            {error ? <p className="text-danger">{error}</p> : null}
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary">
                저장
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                취소
              </button>
            </div>
          </form>
        ) : (
          <section className="utility-panel">
            {exhibition.description ? <p>{exhibition.description}</p> : null}
            <button type="button" className="btn btn-secondary" onClick={beginEdit}>
              수정
            </button>
          </section>
        )}
      </div>

      <div className="mt-8">
        <SectionHeader title="자료" />
        {exhibition.floorPlanUrl ? (
          <MockRegion>
            <div className="flex justify-center rounded-[18px] border border-hairline bg-white p-4">
              <img src={exhibition.floorPlanUrl} alt="" className="h-auto max-h-[520px] w-auto max-w-full object-contain" />
            </div>
          </MockRegion>
        ) : (
          <p>올린 자료가 없습니다.</p>
        )}
      </div>

      {contracted ? (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href={`/studio/exhibitions/${exhibition.id}/review`} className="btn btn-secondary">
            배치와 작품
          </Link>
          {showQr ? (
            <Link href={`/studio/exhibitions/${exhibition.id}/qr`} className="btn btn-secondary">
              QR
            </Link>
          ) : null}
          {report ? (
            <Link href={`/studio/reports/${exhibition.id}`} className="btn btn-secondary">
              리포트
            </Link>
          ) : null}
        </div>
      ) : null}
      <p className="mt-8">
        <Link href="/studio" className="link">
          내 전시
        </Link>
      </p>
    </Frame>
  );
}
