"use client";

import { useMemo, useState } from "react";
import { GalleryCard } from "@/components/cards";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";

const INITIALS = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

export default function GalleriesPage() {
  const { galleries } = useApp();
  const [initial, setInitial] = useState("전체");
  const [region, setRegion] = useState("전체");
  const regions = useMemo(() => ["전체", ...Array.from(new Set(galleries.map((item) => item.region)))], [galleries]);
  const initials = ["전체", ...INITIALS.filter((char) => galleries.some((item) => item.initial === char))];
  const visible = galleries.filter((item) => (initial === "전체" || item.initial === initial) && (region === "전체" || item.region === region));

  return (
    <Frame>
      <PageTitle title="갤러리" />
      <div className="mb-3 flex flex-wrap gap-2">
        {initials.map((item) => (
          <button key={item} type="button" className={item === initial ? "btn btn-primary min-h-11 px-3" : "btn btn-secondary min-h-11 px-3"} onClick={() => setInitial(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {regions.map((item) => (
          <button key={item} type="button" className={item === region ? "btn btn-primary min-h-11 px-3" : "btn btn-secondary min-h-11 px-3"} onClick={() => setRegion(item)}>
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? <p>해당하는 갤러리가 없습니다.</p> : null}
      <div className="grid grid-cols-1 gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3">
        {visible.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>
    </Frame>
  );
}
