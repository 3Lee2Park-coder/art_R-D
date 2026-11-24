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
  const isMember = app.role === "visitor-member";
  const greet = isMember
    ? app.visitorName
      ? `${app.visitorName} 님, 무엇을 진행할까요?`
      : "무엇을 진행할까요?"
    : null;

  function generate() {
    if (!canGenerateLeaflet(records)) {
      setBlocked(true);
      return;
    }
    router.push(`/exhibitions/${id}/generating${suffix}`);
  }

  return (
    <div className="mx-auto flex h-[100svh] w-full max-w-[480px] flex-col px-5 py-8 pb-28">
      <h1 className="display m-0">{exhibition?.title ?? "전시"}</h1>
      {greet ? <p className="mt-3 text-[16px] text-ink-on-dark">{greet}</p> : null}
      <p className={`text-[15px] text-mute-on-dark ${greet ? "mt-2" : "mt-3"}`}>기록 {count}점</p>

      <div className="mt-8 flex flex-1 flex-col gap-4">
        <Link
          href={`/exhibitions/${id}/capture${suffix}`}
          className="hub-tile flex min-h-[140px] flex-1 flex-col items-center justify-center gap-3 rounded-3xl bg-surface-dark text-ink-on-dark no-underline"
        >
          <span className="hub-tile-icon text-[40px] leading-none" aria-hidden>
            ◎
          </span>
          <span className="text-[18px] font-semibold">기록하기</span>
        </Link>
        <Link
          href={`/exhibitions/${id}/map${suffix}`}
          className="hub-tile flex min-h-[140px] flex-1 flex-col items-center justify-center gap-3 rounded-3xl bg-surface-dark text-ink-on-dark no-underline"
        >
          <span className="hub-tile-icon text-[40px] leading-none" aria-hidden>
            ▦
          </span>
          <span className="text-[18px] font-semibold">배치도</span>
        </Link>
      </div>

      <div className="pt-8">
        <button type="button" className="btn btn-accent w-full" onClick={generate}>
          리플릿 생성하기
        </button>
      </div>

      <GenerateBlockedAlert open={blocked} onClose={() => setBlocked(false)} />

      <style>{`
        @keyframes hub-tile-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .hub-tile-icon {
          display: inline-block;
          animation: hub-tile-breathe 2.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hub-tile-icon { animation: none; }
        }
      `}</style>
    </div>
  );
}
