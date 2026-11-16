"use client";

import { useParams } from "next/navigation";
import { LeafletView } from "@/components/leaflet-view";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { oneParam } from "@/lib/format";

export default function LeafletPage() {
  const id = oneParam(useParams<{ leafletId: string }>().leafletId);
  const leaflet = useApp().findLeaflet(id);
  if (!leaflet) {
    return (
      <Frame>
        <PageTitle title="리플릿" dark />
        <p>리플릿을 찾을 수 없습니다.</p>
      </Frame>
    );
  }
  return <LeafletView leaflet={leaflet} />;
}
