"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageTitle } from "@/components/ui";
import { todayISO } from "@/lib/format";
import type { Leaflet } from "@/lib/types";

export default function RecordNewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !venue.trim() || !start || !end) {
      setError("전시 이름, 장소, 기간을 입력해 주세요.");
      return;
    }
    if (end < start) {
      setError("기간을 다시 확인해 주세요.");
      return;
    }
    const leaflet: Leaflet = {
      id: `record-${Date.now()}`,
      kind: "record",
      exhibitionId: null,
      unregisteredTitle: title.trim(),
      unregisteredVenue: venue.trim(),
      unregisteredStart: start,
      unregisteredEnd: end,
      visitDate: todayISO(),
      themeId: "plain",
      photos: [],
      comment: "",
      recommendationArtworkIds: [],
    };
    sessionStorage.setItem("restart.recordLeaflet", JSON.stringify(leaflet));
    router.push("/record/leaflet");
  }

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 pb-24">
      <PageTitle title="전시 정보" dark />
      <form className="flex flex-col gap-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">전시 이름</span>
          <input className="field field-dark" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">장소</span>
          <input className="field field-dark" value={venue} onChange={(event) => setVenue(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">시작</span>
          <input className="field field-dark" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">종료</span>
          <input className="field field-dark" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
        </label>
        {error ? <p className="text-[14px] text-error-on-dark">{error}</p> : null}
        <button type="submit" className="btn btn-accent">
          다음
        </button>
      </form>
    </div>
  );
}
