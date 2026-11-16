"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { formatClock, oneParam } from "@/lib/format";

export default function PhotosPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const router = useRouter();
  useVisitGate(id);
  useTitle("촬영한 사진");
  const photos = app.capture?.exhibitionId === id ? app.capture.photos : [];

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 pb-24">
      <h1 className="display">촬영한 사진</h1>
      {photos.length === 0 ? <p className="mt-6 text-mute-on-dark">촬영한 사진이 없습니다.</p> : null}
      <ul className="mt-6 grid grid-cols-2 gap-3">
        {photos.map((photo) => (
          <li key={photo.id}>
            <img src={photo.url} alt="" className="aspect-[3/4] w-full bg-canvas-dark-deep object-cover" />
            <p className="mt-1 text-[12px] text-mute-on-dark">{formatClock(photo.capturedAt)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3">
        <Link href={`/exhibitions/${id}/capture?from=qr`} className="btn btn-secondary-dark">
          촬영 계속
        </Link>
        <button type="button" className="btn btn-accent" disabled={photos.length === 0} onClick={() => router.push(`/exhibitions/${id}/generating?from=qr`)}>
          리플릿 만들기
        </button>
      </div>
    </div>
  );
}
