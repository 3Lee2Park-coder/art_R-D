"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, MockRegion, PageTitle } from "@/components/ui";
import { formatPrice, oneParam } from "@/lib/format";
import type { Artwork } from "@/lib/types";

export default function ReviewPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const [sent, setSent] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);
  const [title, setTitle] = useState("");
  const [zoneChoice, setZoneChoice] = useState("");
  const [customZone, setCustomZone] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [forSale, setForSale] = useState(false);

  if (!exhibition || exhibition.galleryId !== app.myGalleryId) {
    return (
      <Frame width="utility">
        <PageTitle title="배치와 작품" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  const works = app.artworks.filter((item) => item.exhibitionId === exhibition.id);
  const zones = Array.from(new Set(works.map((item) => item.zone).filter((zone): zone is string => Boolean(zone))));
  const grouped = new Map<string, Artwork[]>();
  for (const work of works) {
    const key = work.zone || "";
    grouped.set(key, [...(grouped.get(key) ?? []), work]);
  }
  const waiting = exhibition.approvalState === "pending" || sent || app.reviewAsked(exhibition.id);
  const published = exhibition.published;
  const plan = exhibition.floorPlanUrl;

  function begin(work: Artwork) {
    setEditingId(work.id);
    setTitle(work.title);
    setZoneChoice(work.zone && zones.includes(work.zone) ? work.zone : work.zone ? "__custom" : zones[0] ?? "__custom");
    setCustomZone(work.zone && !zones.includes(work.zone) ? work.zone : "");
    setDescription(work.description ?? "");
    setPrice(work.priceKrw === null ? "" : String(work.priceKrw));
    setForSale(work.forSale);
    setSavedNote(false);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!editingId) return;
    const zone = zoneChoice === "__custom" ? customZone.trim() : zoneChoice;
    const amount = price.trim() === "" ? null : Number(price);
    app.patchArtwork(editingId, {
      title: title.trim() || title,
      zone: zone || null,
      description: description.trim() || null,
      priceKrw: amount !== null && Number.isFinite(amount) ? amount : null,
      forSale,
    });
    setEditingId(null);
    setSavedNote(true);
  }

  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="배치와 작품" />
      <div className="grid grid-cols-1 items-start gap-8 min-[1024px]:grid-cols-2">
        <section>
          <h2 className="mb-3 text-[17px] font-semibold">원본 배치도</h2>
          {plan ? (
            <div className="flex justify-center rounded-[18px] border border-hairline bg-white p-4">
              <img src={plan} alt="" className="h-auto max-h-[640px] w-auto max-w-full object-contain" />
            </div>
          ) : (
            <p>올린 자료가 없습니다.</p>
          )}
        </section>
        <section>
          <h2 className="mb-3 text-[17px] font-semibold">작품</h2>
          <MockRegion>
            {works.length === 0 ? <p>배치할 작품이 없습니다.</p> : null}
            {[...grouped.entries()].map(([zone, items]) => (
              <div key={zone || "none"} className="mb-4">
                {zone ? <h3 className="text-[14px] font-semibold">{zone}</h3> : null}
                {items.map((item) =>
                  editingId === item.id ? (
                    <form key={item.id} className="utility-panel my-3" onSubmit={save}>
                      <label className="block">
                        <span className="mb-2 block text-[14px] font-semibold">작품명</span>
                        <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[14px] font-semibold">구역</span>
                        <select className="field" value={zoneChoice} onChange={(event) => setZoneChoice(event.target.value)}>
                          {zones.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                          <option value="__custom">직접 입력</option>
                        </select>
                      </label>
                      {zoneChoice === "__custom" ? (
                        <input className="field" value={customZone} onChange={(event) => setCustomZone(event.target.value)} />
                      ) : null}
                      <label className="block">
                        <span className="mb-2 block text-[14px] font-semibold">설명</span>
                        <textarea className="field min-h-24" value={description} onChange={(event) => setDescription(event.target.value)} />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[14px] font-semibold">가격</span>
                        <input className="field" inputMode="numeric" value={price} onChange={(event) => setPrice(event.target.value.replace(/[^\d]/g, ""))} />
                      </label>
                      <label className="flex items-center gap-2 text-[14px]">
                        <input type="checkbox" checked={forSale} onChange={(event) => setForSale(event.target.checked)} />
                        판매
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button type="submit" className="btn btn-primary">
                          저장
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
                          취소
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div key={item.id} className="list-row">
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{item.title}</span>
                        <span className="caption">{item.priceKrw !== null ? formatPrice(item.priceKrw) : ""}</span>
                      </span>
                      <button type="button" className="btn btn-utility" onClick={() => begin(item)}>
                        수정
                      </button>
                    </div>
                  ),
                )}
              </div>
            ))}
          </MockRegion>
        </section>
      </div>
      {savedNote ? <p className="mt-6">저장했습니다.</p> : null}
      {published ? <p className="mt-6">게시된 전시입니다.</p> : null}
      {!published && waiting ? <p className="mt-6">확인을 기다리는 중입니다.</p> : null}
      {!published ? (
        <button
          type="button"
          className="btn btn-primary mt-6"
          onClick={() => {
            app.askReview(exhibition.id);
            setSent(true);
          }}
        >
          확인 요청
        </button>
      ) : null}
      <p className="mt-8">
        <Link href={`/studio/exhibitions/${exhibition.id}`} className="link">
          전시 상세
        </Link>
      </p>
    </Frame>
  );
}
