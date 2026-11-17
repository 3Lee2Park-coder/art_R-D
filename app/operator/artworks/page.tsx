"use client";

import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPrice } from "@/lib/format";

export default function ArtworkDbPage() {
  const app = useApp();
  const galleryId = useSearchParams().get("gallery");
  const gallery = galleryId ? app.galleries.find((item) => item.id === galleryId) : undefined;
  const rows = app.artworks.filter((artwork) => {
    if (!galleryId) return true;
    const exhibition = app.exhibitions.find((item) => item.id === artwork.exhibitionId);
    return exhibition?.galleryId === galleryId;
  });
  return (
    <Frame width="utility">
      <PageTitle title="작품" kicker={gallery?.name} />
      <div className="overflow-x-auto border border-hairline">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="bg-parchment">
            <tr>
              {["작품", "작가", "전시", "구역", "가격", "판매"].map((label) => (
                <th key={label} className="px-3 py-2 font-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((artwork) => {
              const artist = app.artists.find((item) => item.id === artwork.artistId);
              const exhibition = artwork.exhibitionId ? app.exhibitions.find((item) => item.id === artwork.exhibitionId) : undefined;
              return (
                <tr key={artwork.id} className="border-t border-hairline">
                  <td className="px-3 py-2">{artwork.title}</td>
                  <td className="px-3 py-2">{artist?.name}</td>
                  <td className="px-3 py-2">{exhibition?.title}</td>
                  <td className="px-3 py-2">{artwork.zone}</td>
                  <td className="px-3 py-2">{artwork.priceKrw !== null ? <span className="price">{formatPrice(artwork.priceKrw)}</span> : null}</td>
                  <td className="px-3 py-2">{artwork.forSale ? "판매" : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}
