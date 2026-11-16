"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { MockRegion } from "@/components/ui";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { THEMES } from "@/lib/constants";
import { oneParam } from "@/lib/format";

export default function ThemePage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const current = app.themeFor(id) ?? "deep";
  const [saved, setSaved] = useState(false);
  if (!exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 테마" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="전시 테마" />
      <MockRegion>
        <div className="flex flex-col gap-3">
          {THEMES.filter((theme) => theme.id !== "plain").map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={current === theme.id ? "btn btn-primary justify-start gap-3" : "btn btn-secondary justify-start gap-3"}
              onClick={() => {
                app.setExhibitionTheme(id, theme.id);
                setSaved(true);
              }}
            >
              <span className="inline-block h-4 w-4" style={{ background: theme.bar }} />
              {theme.name}
            </button>
          ))}
        </div>
      </MockRegion>
      {saved ? <p className="mt-4 text-[14px]">저장했습니다.</p> : null}
    </Frame>
  );
}
