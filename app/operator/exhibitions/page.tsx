"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { exhibitionStateLabel } from "@/lib/labels";

export default function OperatorExhibitionsPage() {
  const app = useApp();
  const rows = app.exhibitions.filter((item) => item.published || item.approvalState === "pending");
  return (
    <Frame width="utility">
      <PageTitle title="전시 확인" />
      <ul className="border-t border-hairline">
        {rows.map((exhibition) => {
          const gallery = app.galleries.find((item) => item.id === exhibition.galleryId);
          const contracted = exhibition.status === "contracted";
          return (
            <li key={exhibition.id} className="border-b border-hairline py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[17px] font-semibold">{exhibition.title}</h2>
                <span className="text-[14px] text-mute">{exhibitionStateLabel(exhibition)}</span>
              </div>
              <p className="text-[14px] text-mute">{gallery?.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {contracted && exhibition.approvalState === "pending" ? (
                  <button type="button" className="btn btn-primary min-h-11 px-4" onClick={() => app.patchExhibition(exhibition.id, { approvalState: "approved", published: true })}>
                    게시
                  </button>
                ) : null}
                {contracted ? (
                  <>
                    <Link href={`/operator/exhibitions/${exhibition.id}/theme`} className="btn btn-secondary min-h-11 px-4">
                      테마
                    </Link>
                    <Link href={`/operator/exhibitions/${exhibition.id}/layout`} className="btn btn-secondary min-h-11 px-4">
                      배치
                    </Link>
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}
