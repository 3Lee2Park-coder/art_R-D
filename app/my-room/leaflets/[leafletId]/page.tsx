"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LeafletView } from "@/components/leaflet-view";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function SavedLeafletPage() {
  const id = oneParam(useParams<{ leafletId: string }>().leafletId);
  const leaflet = useApp().findLeaflet(id);
  if (!leaflet) {
    return (
      <div className="mx-auto leaflet-col py-8">
        <PageTitle title="리플릿" />
        <p>리플릿을 찾을 수 없습니다.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mx-auto w-full leaflet-col pt-6">
        <Link href="/my-room/archive" className="link-accent text-[14px] font-semibold">
          기록함
        </Link>
      </div>
      <LeafletView leaflet={leaflet} readOnly />
    </div>
  );
}
