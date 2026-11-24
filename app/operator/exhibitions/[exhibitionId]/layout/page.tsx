"use client";

import { useParams } from "next/navigation";
import { MockRegion } from "@/components/ui";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function LayoutCheckPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  if (!exhibition) {
    return (
      <Frame width="utility">
        <PageTitle title="배치 확인" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  const works = app.artworks.filter((item) => item.exhibitionId === id);
  const zones = Array.from(new Set(works.map((item) => item.zone).filter((zone): zone is string => Boolean(zone))));
  const checked = app.layoutChecked(id);
  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="배치 확인" />
      <MockRegion>
        {zones.length === 0 ? (
          <p>배치할 작품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-3">
            {zones.map((zone) => (
              <section key={zone} className="border border-hairline p-3">
                <h2 className="text-[14px] font-semibold">{zone}</h2>
                <ul>
                  {works
                    .filter((item) => item.zone === zone)
                    .map((item) => (
                      <li key={item.id} className="text-[14px]">
                        {item.title}
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </MockRegion>
      {checked ? <p className="mt-4">배치를 확인했습니다.</p> : null}
      <button type="button" className="btn btn-primary mt-6" onClick={() => app.markLayout(id)}>
        확인
      </button>
    </Frame>
  );
}
