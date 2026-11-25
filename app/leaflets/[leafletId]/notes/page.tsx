"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PhotoPickField } from "@/components/leaflet/PhotoPickField";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { REASON_CHIPS } from "@/lib/constants";
import { recomputeLeafletNotes } from "@/lib/leaflet/createVisitLeaflet";
import { oneParam } from "@/lib/format";

export default function NotesPage() {
  const id = oneParam(useParams<{ leafletId: string }>().leafletId);
  const app = useApp();
  const router = useRouter();
  const leaflet = app.findLeaflet(id);
  const hasRecords = Boolean(leaflet?.records?.length);
  const works = leaflet?.exhibitionId
    ? app.artworks.filter((item) => item.exhibitionId === leaflet.exhibitionId)
    : [];
  const [pick, setPick] = useState(leaflet?.notes?.onePickArtworkId ?? "");
  const [chips, setChips] = useState<string[]>(leaflet?.notes?.reasonChips ?? []);
  const [comment, setComment] = useState(leaflet?.comment ?? leaflet?.notes?.comment ?? "");
  const [preview, setPreview] = useState<string | null>(leaflet?.myPhotoUrl ?? null);

  if (!leaflet) {
    return (
      <div className="mx-auto leaflet-col py-8">
        <PageTitle title="기록" />
        <p>리플릿을 찾을 수 없습니다.</p>
      </div>
    );
  }

  function save() {
    if (hasRecords) {
      const next = recomputeLeafletNotes(leaflet!, {
        myPhotoUrl: preview,
        comment,
      });
      app.upsertLeaflet(next);
      router.push(`/leaflets/${leaflet!.id}`);
      return;
    }
    app.upsertLeaflet({
      ...leaflet!,
      notes: {
        onePickArtworkId: pick || undefined,
        reasonChips: chips,
        comment: comment.trim() || undefined,
      },
      comment: comment.trim() || undefined,
    });
    router.push(`/leaflets/${leaflet!.id}`);
  }

  return (
    <div className="mx-auto w-full leaflet-col py-6 pb-24">
      <PageTitle title="기록" />
      {hasRecords ? (
        <>
          <PhotoPickField preview={preview} onPick={setPreview} label="사진 추가" />
          <label className="mt-6 block">
            <span className="mb-2 block text-[14px] font-semibold">한줄평</span>
            <textarea
              className="field field-dark min-h-28"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </>
      ) : (
        <>
          <p className="mb-6 text-[14px] text-mute-on-dark">비워 두어도 됩니다.</p>
          {works.length ? (
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold">오래 본 작품</span>
              <select
                className="field field-dark"
                value={pick}
                onChange={(event) => setPick(event.target.value)}
              >
                <option value="">선택 안 함</option>
                {works.map((artwork) => (
                  <option key={artwork.id} value={artwork.id}>
                    {artwork.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {REASON_CHIPS.map((chip) => {
              const on = chips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  className={on ? "btn btn-accent min-h-11 px-4" : "btn btn-secondary-dark min-h-11 px-4"}
                  onClick={() =>
                    setChips((prev) =>
                      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip],
                    )
                  }
                >
                  {chip}
                </button>
              );
            })}
          </div>
          <label className="mt-6 block">
            <span className="mb-2 block text-[14px] font-semibold">메모</span>
            <textarea
              className="field field-dark min-h-28"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </>
      )}
      <button type="button" className="btn btn-accent mt-8 w-full" onClick={save}>
        저장
      </button>
    </div>
  );
}
