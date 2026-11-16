"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { SPACE_LABELS } from "@/lib/constants";

export default function SpacePage() {
  const app = useApp();
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 pb-24">
      <PageTitle title="공간" dark />
      <p className="text-mute-on-dark">지금 마음에 가까운 공간을 고릅니다.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {SPACE_LABELS.map((label) => (
          <button key={label} type="button" className={app.spacePick === label ? "btn btn-accent min-h-20" : "btn btn-secondary-dark min-h-20"} onClick={() => app.setSpacePick(label)}>
            {label}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-accent mt-8 w-full" disabled={!app.spacePick} onClick={() => router.push("/my-room/picks")}>
        다음
      </button>
    </div>
  );
}
