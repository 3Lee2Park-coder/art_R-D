"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { MockRegion } from "@/components/ui";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function ReviewPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  const [sent, setSent] = useState(false);
  if (!exhibition || exhibition.galleryId !== app.myGalleryId) {
    return (
      <Frame width="utility">
        <PageTitle title="배치와 작품" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  const works = app.artworks.filter((item) => item.exhibitionId === exhibition.id);
  const zones = Array.from(new Set(works.map((item) => item.zone).filter((zone): zone is string => Boolean(zone))));
  const waiting = exhibition.approvalState === "pending" || sent || app.reviewAsked(exhibition.id);

  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="배치와 작품" />
      <MockRegion>
        {works.length === 0 ? (
          <p>배치할 작품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2">
            {zones.map((zone) => (
              <section key={zone} className="border border-hairline p-4">
                <h2 className="text-[14px] font-semibold">{zone}</h2>
                <ul className="mt-2">
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
      {exhibition.approvalState === "approved" ? <p className="mt-6">게시된 전시입니다.</p> : null}
      {waiting && exhibition.approvalState !== "approved" ? <p className="mt-6">확인을 기다리는 중입니다.</p> : null}
      {exhibition.approvalState !== "approved" ? (
        <button
          type="button"
          className="btn btn-primary mt-6"
          onClick={() => {
            app.askReview(exhibition.id);
            setSent(true);
          }}
        >
          확인 요청
        </button>
      ) : null}
    </Frame>
  );
}
