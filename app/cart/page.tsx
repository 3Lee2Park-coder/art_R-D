"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const app = useApp();
  const items = app.cart.map((id) => app.artworks.find((artwork) => artwork.id === id)).filter((artwork) => artwork !== undefined);
  const priced = items.filter((artwork) => artwork.priceKrw !== null);
  const total = priced.length === items.length && items.length > 0 ? priced.reduce((sum, artwork) => sum + (artwork.priceKrw ?? 0), 0) : null;

  return (
    <Frame width="read">
      <PageTitle title="장바구니" />
      {items.length === 0 ? (
        <div>
          <p>담긴 작품이 없습니다.</p>
          <Link href="/artworks" className="btn btn-primary mt-6">
            작품 보기
          </Link>
        </div>
      ) : (
        <ul>
          {items.map((artwork) => {
            const artist = app.artists.find((item) => item.id === artwork.artistId);
            return (
              <li key={artwork.id} className="flex gap-4 border-b border-hairline py-4">
                <Link href={`/artworks/${artwork.id}`} className="shrink-0">
                  <img src={artwork.imageUrl} alt="" className="h-24 w-20 bg-parchment object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/artworks/${artwork.id}`} className="link font-semibold">
                    {artwork.title}
                  </Link>
                  {artist ? <p className="text-[14px] text-mute">{artist.name}</p> : null}
                  {artwork.priceKrw !== null ? <p className="price mt-1">{formatPrice(artwork.priceKrw)}</p> : null}
                </div>
                <button type="button" className="btn btn-secondary min-h-11 self-center px-4" onClick={() => app.removeFromCart(artwork.id)}>
                  빼기
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {total !== null ? <p className="price mt-6 text-[21px]">{formatPrice(total)}</p> : null}
    </Frame>
  );
}
