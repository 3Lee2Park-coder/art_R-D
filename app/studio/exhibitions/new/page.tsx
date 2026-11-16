"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import type { Exhibition } from "@/lib/types";

export default function NewExhibitionPage() {
  const app = useApp();
  const router = useRouter();
  const contracted = app.role === "gallery-contracted";
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!app.myGalleryId || !title.trim() || !venue.trim() || !start || !end) {
      setError("전시 이름, 장소, 기간을 입력해 주세요.");
      return;
    }
    if (end < start) {
      setError("기간을 다시 확인해 주세요.");
      return;
    }
    const exhibition: Exhibition = {
      id: `ex-${Date.now().toString(36)}`,
      title: title.trim(),
      galleryId: app.myGalleryId,
      status: contracted ? "contracted" : "uncontracted",
      venue: venue.trim(),
      startDate: start,
      endDate: end,
      posterUrl: "/images/posters/plain.svg",
      description: contracted && description.trim() ? description.trim() : null,
      leafletEnabled: contracted,
      published: !contracted,
      approvalState: contracted ? "pending" : "none",
      ended: false,
    };
    app.upsertExhibition(exhibition);
    router.push(contracted ? `/studio/exhibitions/${exhibition.id}/review` : "/studio");
  }

  return (
    <Frame width="utility">
      <PageTitle title="전시 등록" />
      <form className="flex max-w-lg flex-col gap-4" onSubmit={submit}>
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
        {error ? <p className="text-[14px] text-danger">{error}</p> : null}
        <button type="submit" className="btn btn-primary">
          {contracted ? "확인 요청" : "게시"}
        </button>
      </form>
    </Frame>
  );
}
