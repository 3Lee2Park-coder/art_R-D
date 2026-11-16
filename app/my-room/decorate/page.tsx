"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";
import { WALLS } from "@/lib/constants";

export default function DecoratePage() {
  const app = useApp();
  const router = useRouter();
  const wall = WALLS.find((item) => item.id === app.decorWall) ?? WALLS[0];
  const placed = app.artworks.filter((item) => app.picks.includes(item.id));

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-6 pb-24">
      <PageTitle title="방 꾸미기" dark />
      <p className="text-mute-on-dark">관람 기록은 이 방에 그대로 둡니다.</p>
      <div className="mt-6 flex gap-2">
        {WALLS.map((item) => (
          <button key={item.id} type="button" className={item.id === wall.id ? "btn btn-accent min-h-11 px-4" : "btn btn-secondary-dark min-h-11 px-4"} onClick={() => app.setDecorWall(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="mt-6 min-h-64 rounded-2xl p-4" style={{ background: wall.color }}>
        {placed.length === 0 ? (
          <p className="text-mute-on-dark">
            고른 작품이 없습니다. <Link href="/my-room/picks" className="link-accent">작품 고르기</Link>
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {placed.map((artwork) => (
              <li key={artwork.id} className="bg-white/10 p-2">
                <img src={artwork.imageUrl} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" className="btn btn-accent mt-8" onClick={() => router.push("/my-room")}>
        완료
      </button>
    </div>
  );
}
