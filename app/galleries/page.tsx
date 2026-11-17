"use client";

import { useMemo, useState } from "react";
import { GalleryCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SiteFooter } from "@/components/ui";

const INITIALS = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

export default function GalleriesPage() {
  const { galleries } = useApp();
  const [initial, setInitial] = useState("전체");
  const [region, setRegion] = useState("전체");
  const regions = useMemo(() => ["전체", ...Array.from(new Set(galleries.map((item) => item.region)))], [galleries]);
  const initials = ["전체", ...INITIALS.filter((char) => galleries.some((item) => item.initial === char))];
  const visible = galleries.filter((item) => (initial === "전체" || item.initial === initial) && (region === "전체" || item.region === region));

  return (
    <>
      <Frame>
        <PageTitle title="갤러리" />
        <div className="chip-row">
          {initials.map((item) => (
            <button key={item} type="button" className={item === initial ? "chip chip-selected" : "chip"} onClick={() => setInitial(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="chip-row">
          {regions.map((item) => (
            <button key={item} type="button" className={item === region ? "chip chip-selected" : "chip"} onClick={() => setRegion(item)}>
              {item}
            </button>
          ))}
        </div>
        {visible.length === 0 ? <p>해당하는 갤러리가 없습니다.</p> : null}
        <div className="utility-grid">
          {visible.map((gallery) => (
            <GalleryCard key={gallery.id} gallery={gallery} />
          ))}
        </div>
      </Frame>
      <SiteFooter />
    </>
  );
}
