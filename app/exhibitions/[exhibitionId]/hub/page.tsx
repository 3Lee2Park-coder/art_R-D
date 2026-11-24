"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GenerateBlockedAlert } from "@/components/leaflet/GenerateBlockedAlert";
import { useScenario } from "@/components/leaflet/useScenario";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { canGenerateLeaflet } from "@/lib/leaflet/canGenerate";
import { oneParam } from "@/lib/format";

export default function HubPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const search = useSearchParams();
  const qs = search.toString();
  const suffix = qs ? `?${qs}` : "?from=qr";
  const app = useApp();
  const router = useRouter();
  useVisitGate(id);
  useScenario();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  useTitle(exhibition?.title ?? "허브");
  const records =
    app.capture?.exhibitionId === id ? (app.capture.records ?? []) : [];
  const count = records.length;
  const [blocked, setBlocked] = useState(false);

  function generate() {
    if (!canGenerateLeaflet(records)) {
      setBlocked(true);
      return;
    }
    router.push(`/exhibitions/${id}/generating${suffix}`);
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-[480px] flex-col px-5 py-8 pb-28">
      <h1 className="display m-0">{exhibition?.title ?? "전시"}</h1>
      <p className="mt-3 text-[15px] text-mute-on-dark">기록 {count}점</p>

      <div className="mt-10 flex flex-col gap-3">
        <Link href={`/exhibitions/${id}/capture${suffix}`} className="btn btn-secondary-dark">
          기록하기
        </Link>
        <Link href={`/exhibitions/${id}/map${suffix}`} className="btn btn-secondary-dark">
          배치도
        </Link>
      </div>

      <div className="mt-auto pt-10">
        <button type="button" className="btn btn-accent w-full" onClick={generate}>
          리플릿 생성하기
        </button>
      </div>

      <GenerateBlockedAlert open={blocked} onClose={() => setBlocked(false)} />
    </div>
  );
}
