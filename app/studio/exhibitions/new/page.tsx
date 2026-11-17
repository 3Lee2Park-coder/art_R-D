"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatFileSize, readPreview } from "@/lib/files";
import type { Exhibition, ExhibitionFile } from "@/lib/types";

type Kind = ExhibitionFile["kind"];

type DraftFile = {
  id: string;
  kind: Kind;
  file: File;
  previewDataUrl: string | null;
};

const KIND_LABEL: Record<Kind, string> = {
  floorplan: "배치도",
  artworks: "작품 자료",
  poster: "포스터",
};

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
  const [files, setFiles] = useState<DraftFile[]>([]);
  const [progress, setProgress] = useState<Record<string, "진행" | "완료">>({});
  const [busy, setBusy] = useState(false);
  const estimate = useMemo(() => Math.max(1, Math.ceil(files.reduce((sum, item) => sum + item.file.size, 0) / (800 * 1024)) || (files.length ? 1 : 0)), [files]);

  async function addFiles(kind: Kind, list: FileList | null, replaceId?: string) {
    const picked = list ? [...list] : [];
    if (picked.length === 0) return;
    const next: DraftFile[] = [];
    for (const file of picked) {
      next.push({ id: `file-${Date.now().toString(36)}-${next.length}`, kind, file, previewDataUrl: await readPreview(file) });
    }
    setFiles((prev) => {
      if (replaceId) return prev.map((item) => (item.id === replaceId ? { ...next[0], id: item.id } : item));
      if (kind === "artworks") return [...prev, ...next];
      return [...prev.filter((item) => item.kind !== kind), next[0]];
    });
  }

  async function submit(event: FormEvent) {
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
      posterUrl: files.find((item) => item.kind === "poster")?.previewDataUrl || "/images/posters/plain.svg",
      floorPlanUrl: null,
      description: contracted && description.trim() ? description.trim() : null,
      leafletEnabled: contracted,
      published: !contracted,
      approvalState: contracted ? "pending" : "none",
      ended: false,
    };
    setError("");
    setBusy(true);
    const stored: ExhibitionFile[] = [];
    for (const item of files) {
      setProgress((prev) => ({ ...prev, [item.id]: "진행" }));
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setProgress((prev) => ({ ...prev, [item.id]: "완료" }));
      stored.push({
        id: item.id,
        name: item.file.name,
        kind: item.kind,
        size: item.file.size,
        type: item.file.type,
        previewDataUrl: item.previewDataUrl,
        status: "done",
      });
    }
    app.upsertExhibition(exhibition);
    if (stored.length) app.setExhibitionFiles(exhibition.id, stored);
    router.push(contracted ? `/studio/exhibitions/${exhibition.id}/review` : "/studio");
  }

  return (
    <Frame width="read">
      <PageTitle title="전시 등록" />
      <form className="utility-panel" onSubmit={submit}>
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
        {contracted ? (
          <>
            {files.length ? <p>약 {estimate}초</p> : null}
            <FileSlot kind="floorplan" accept="image/*,application/pdf" files={files} progress={progress} onPick={addFiles} />
            <FileSlot kind="artworks" accept="image/*,.pdf,application/pdf,.xlsx,.csv,text/csv" multiple files={files} progress={progress} onPick={addFiles} />
            <FileSlot kind="poster" accept="image/*" files={files} progress={progress} onPick={addFiles} />
          </>
        ) : null}
        {error ? <p className="text-danger">{error}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {contracted ? "확인 요청" : "게시"}
        </button>
      </form>
    </Frame>
  );
}

function FileSlot({
  kind,
  accept,
  multiple = false,
  files,
  progress,
  onPick,
}: {
  kind: Kind;
  accept: string;
  multiple?: boolean;
  files: DraftFile[];
  progress: Record<string, "진행" | "완료">;
  onPick: (kind: Kind, list: FileList | null, replaceId?: string) => void;
}) {
  const rows = files.filter((item) => item.kind === kind);
  return (
    <div>
      <p className="mb-2 text-[14px] font-semibold">{KIND_LABEL[kind]}</p>
      {rows.map((item) => (
        <div key={item.id} className="mb-3 flex items-center gap-3">
          {item.previewDataUrl ? <img src={item.previewDataUrl} alt="" className="h-16 w-12 object-contain" /> : null}
          <span className="min-w-0 flex-1 text-[14px]">
            <span className="block truncate">{item.file.name}</span>
            <span className="caption">
              {formatFileSize(item.file.size)}
              {progress[item.id] ? ` · ${progress[item.id]}` : ""}
            </span>
          </span>
          <label className="btn btn-utility">
            다시 선택
            <input className="sr-only" type="file" accept={accept} onChange={(event) => onPick(kind, event.target.files, item.id)} />
          </label>
        </div>
      ))}
      {kind === "artworks" || rows.length === 0 ? (
        <label className="btn btn-secondary">
          {rows.length === 0 ? KIND_LABEL[kind] : "추가"}
          <input className="sr-only" type="file" accept={accept} multiple={multiple} onChange={(event) => onPick(kind, event.target.files)} />
        </label>
      ) : null}
    </div>
  );
}
