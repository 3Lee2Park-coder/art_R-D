"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { Frame, PageTitle, SiteFooter } from "@/components/ui";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const app = useApp();
  const items = app.cart.map((id) => app.artworks.find((artwork) => artwork.id === id)).filter((artwork) => artwork !== undefined);
  const priced = items.filter((artwork) => artwork.priceKrw !== null);
  const total = priced.length === items.length && items.length > 0 ? priced.reduce((sum, artwork) => sum + (artwork.priceKrw ?? 0), 0) : null;

  return (
    <>
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
          <ul className="m-0 list-none p-0">
            {items.map((artwork) => {
              const artist = app.artists.find((item) => item.id === artwork.artistId);
              return (
                <li key={artwork.id} className="list-row">
                  <Link href={`/artworks/${artwork.id}`} className="frame-artwork h-[88px] w-[88px] shrink-0 !aspect-auto">
                    <img src={artwork.imageUrl} alt="" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/artworks/${artwork.id}`} className="link">
                      {artwork.title}
                    </Link>
                    {artist ? <p className="caption">{artist.name}</p> : null}
                  </div>
                  {artwork.priceKrw !== null ? <p className="price m-0">{formatPrice(artwork.priceKrw)}</p> : null}
                  <button type="button" className="btn btn-utility" onClick={() => app.removeFromCart(artwork.id)}>
                    빼기
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {total !== null ? <p className="price mt-6 text-[17px]">{formatPrice(total)}</p> : null}
      </Frame>
      <SiteFooter />
    </>
  );
}
