"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/providers";
import { useTitle } from "@/components/ui";
import { useVisitGate } from "@/components/visit-gate";
import { oneParam } from "@/lib/format";

export default function ConsentPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const router = useRouter();
  const app = useApp();
  useVisitGate(id);
  useTitle("관람 기록 안내");

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[480px] items-center px-4 py-10">
      <section className="w-full rounded-2xl bg-surface-dark p-6">
        <h1 className="text-[28px] font-semibold">관람 기록 안내</h1>
        <p className="mt-4 text-mute-on-dark">촬영한 사진과 관람 순서는 리플릿을 만드는 데 쓰입니다. 동의하면 이어서 촬영할 수 있고, 거부하면 전시 소개로 돌아갑니다.</p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => {
              if (app.role === "visitor-member") app.grantConsent();
              router.push(app.guideHidden ? `/exhibitions/${id}/capture?from=qr` : `/exhibitions/${id}/guide?from=qr`);
            }}
          >
            동의
          </button>
          <button
            type="button"
            className="btn btn-secondary-dark"
            onClick={() => {
              app.clearCapture();
              router.push(`/exhibitions/${id}`);
            }}
          >
            거부
          </button>
        </div>
      </section>
    </div>
  );
}
