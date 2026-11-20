"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { formatPeriod, outsidePeriod, todayISO } from "@/lib/format";
import type { Leaflet, LeafletPhoto } from "@/lib/types";

function readRecord() {
  try {
    const raw = sessionStorage.getItem("restart.recordLeaflet");
    return raw ? (JSON.parse(raw) as Leaflet) : null;
  } catch {
    return null;
  }
}

export default function RecordLeafletPage() {
  const app = useApp();
  const router = useRouter();
  const exhibitionId = useSearchParams().get("exhibition");
  const [leaflet, setLeaflet] = useState<Leaflet | null>(null);
  const [ready, setReady] = useState(false);
  const [askConsent, setAskConsent] = useState(false);
  const pendingFile = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!app.ready) return;
    const exhibition = exhibitionId ? app.exhibitions.find((item) => item.id === exhibitionId) : undefined;
    const existing = readRecord();
    if (exhibition) {
      if (existing?.exhibitionId === exhibition.id) setLeaflet(existing);
      else {
        const created: Leaflet = {
          id: `record-${Date.now()}`,
          kind: "record",
          exhibitionId: exhibition.id,
          visitDate: todayISO(),
          themeId: "plain",
          photos: [],
          comment: "",
          recommendationArtworkIds: [],
        };
        sessionStorage.setItem("restart.recordLeaflet", JSON.stringify(created));
        setLeaflet(created);
      }
    } else if (existing && !exhibitionId) {
      setLeaflet(existing);
    }
    setReady(true);
  }, [app.ready, app.exhibitions, exhibitionId]);

  function persist(next: Leaflet) {
    setLeaflet(next);
    sessionStorage.setItem("restart.recordLeaflet", JSON.stringify(next));
    app.upsertLeaflet(next);
  }

  function addUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (!leaflet) return;
      const photo: LeafletPhoto = {
        id: `up-${Date.now()}`,
        url: String(reader.result || ""),
        capturedAt: new Date().toISOString(),
        source: "upload",
        recognizedArtworkId: null,
      };
      persist({ ...leaflet, photos: [...leaflet.photos, photo] });
    };
    reader.readAsDataURL(file);
  }

  if (!ready || !leaflet) {
    return (
      <div className="mx-auto w-full leaflet-col py-8">
        <PageTitle title="관람 기록" />
        {ready ? (
          <div className="flex flex-col gap-3">
            <Link href="/exhibitions" className="btn btn-accent">
              전시 찾기
            </Link>
            <Link href="/record/new" className="btn btn-secondary-dark">
              직접 입력
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  const exhibition = leaflet.exhibitionId ? app.exhibitions.find((item) => item.id === leaflet.exhibitionId) : undefined;
  const title = exhibition?.title ?? leaflet.unregisteredTitle ?? "관람 기록";
  const venue = exhibition?.venue ?? leaflet.unregisteredVenue ?? "";
  const start = exhibition?.startDate ?? leaflet.unregisteredStart ?? "";
  const end = exhibition?.endDate ?? leaflet.unregisteredEnd ?? "";
  const outside = outsidePeriod(leaflet.visitDate, start, end);

  return (
    <div className="mx-auto w-full leaflet-col py-6 pb-24">
      <PageTitle title={title} />
      {venue ? <p className="text-mute-on-dark">{venue}</p> : null}
      {start && end ? <p className="text-[14px] text-mute-on-dark">{formatPeriod(start, end)}</p> : null}
      <label className="mt-6 block">
        <span className="mb-2 block text-[14px] font-semibold">방문 날짜</span>
        <input className="field field-dark" type="date" value={leaflet.visitDate} onChange={(event) => persist({ ...leaflet, visitDate: event.target.value })} />
      </label>
      {outside ? <p className="mt-2 text-[14px] text-error-on-dark">방문 날짜가 전시 기간 밖입니다.</p> : null}
      <div className="mt-6">
        <p className="text-[14px] font-semibold">사진</p>
        <p className="mt-1 text-[14px] text-mute-on-dark">업로드한 사진은 관람 기록에만 남고, 체류 시간과 리포트에는 쓰이지 않습니다.</p>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            if (!app.uploadConsent) {
              pendingFile.current = file;
              setAskConsent(true);
              return;
            }
            addUpload(file);
          }}
        />
        <button type="button" className="btn btn-secondary-dark mt-3" onClick={() => inputRef.current?.click()}>
          사진 올리기
        </button>
        <ul className="mt-4 flex flex-col gap-4">
          {leaflet.photos.map((photo) => (
            <li key={photo.id}>
              <img src={photo.url} alt="업로드 사진" className="aspect-[4/5] w-full object-contain" />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[14px] text-mute-on-dark">업로드 사진</span>
                <button type="button" className="text-[14px] font-semibold text-white" onClick={() => persist({ ...leaflet, photos: leaflet.photos.filter((item) => item.id !== photo.id) })}>
                  빼기
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <label className="mt-6 block">
        <span className="mb-2 block text-[14px] font-semibold">한줄평</span>
        <input className="field field-dark" value={leaflet.comment ?? ""} onChange={(event) => persist({ ...leaflet, comment: event.target.value })} />
      </label>
      <div className="mt-8 flex flex-col gap-3">
        <button type="button" className="btn btn-accent" onClick={() => app.saveLeaflet(leaflet)}>
          저장
        </button>
        <button
          type="button"
          className="btn btn-secondary-dark"
          onClick={() => {
            app.upsertLeaflet(leaflet);
            router.push(`/leaflets/${leaflet.id}/share`);
          }}
        >
          공유
        </button>
      </div>
      {askConsent ? (
        <div className="fixed inset-0 z-40 flex items-end bg-[rgba(9,32,57,0.72)]">
          <section className="w-full rounded-t-3xl bg-surface-dark p-6" role="dialog" aria-label="사진 업로드">
            <h2 className="text-[21px] font-semibold">사진 업로드</h2>
            <p className="mt-3 text-mute-on-dark">고른 사진을 관람 기록에 넣습니다. 위치 정보는 읽지 않습니다.</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {
                  app.setUploadConsent(true);
                  const file = pendingFile.current;
                  pendingFile.current = null;
                  setAskConsent(false);
                  if (file) addUpload(file);
                }}
              >
                동의
              </button>
              <button
                type="button"
                className="btn btn-secondary-dark"
                onClick={() => {
                  pendingFile.current = null;
                  setAskConsent(false);
                }}
              >
                취소
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
