"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { oneParam } from "@/lib/format";

export default function GuidePage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const router = useRouter();
  const app = useApp();
  const [hide, setHide] = useState(false);
  useVisitGate(id);
  useTitle("촬영 안내");
  const sample = app.artworks.find((item) => item.exhibitionId === id);

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-8 pb-24">
      <h1 className="display">촬영</h1>
      <p className="mt-4 text-mute-on-dark">작품을 화면 가운데 두고 한 장씩 찍습니다. 사진은 이 기기에만 남습니다.</p>
      {sample ? (
        <figure className="mt-8">
          <img src={sample.imageUrl} alt="결과 예시" className="aspect-[4/5] w-full bg-canvas-dark-deep object-contain" />
          <figcaption className="mt-2 text-[14px] text-mute-on-dark">결과 예시</figcaption>
        </figure>
      ) : null}
      <label className="mt-8 flex min-h-12 items-center gap-3">
        <input type="checkbox" className="h-5 w-5" checked={hide} onChange={(event) => setHide(event.target.checked)} />
        <span>1주일 동안 보지 않기</span>
      </label>
      <button
        type="button"
        className="btn btn-accent mt-6 w-full"
        onClick={() => {
          if (hide) app.hideGuideForWeek();
          router.push(`/exhibitions/${id}/capture?from=qr`);
        }}
      >
        촬영하기
      </button>
    </div>
  );
}
