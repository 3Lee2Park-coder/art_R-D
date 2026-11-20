"use client";

import { useParams } from "next/navigation";
import { QrMark } from "@/components/qr-mark";
import { MockRegion } from "@/components/ui";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function QrPage() {
  const id = oneParam(useParams<{ exhibitionId: string }>().exhibitionId);
  const app = useApp();
  const exhibition = app.exhibitions.find((item) => item.id === id);
  if (!exhibition || exhibition.galleryId !== app.myGalleryId) {
    return (
      <Frame width="utility">
        <PageTitle title="전시 QR" />
        <p>전시를 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  const ready = exhibition.published && exhibition.status === "contracted";
  return (
    <Frame width="utility">
      <PageTitle title={exhibition.title} kicker="전시 QR" />
      {ready ? (
        <MockRegion>
          <div className="inline-block border border-hairline bg-white p-4">
            <QrMark value={`${exhibition.id}?from=qr`} />
          </div>
          <p className="mt-4 max-w-md text-[14px] text-mute">입구에 비치하면 관람객이 리플릿을 만들 수 있습니다.</p>
        </MockRegion>
      ) : (
        <p>게시 후 QR을 사용할 수 있습니다.</p>
      )}
    </Frame>
  );
}
