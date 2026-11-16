"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";

export default function PicksPage() {
  const app = useApp();
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-6 pb-24">
      <PageTitle title="작품 고르기" dark />
      <ul className="grid grid-cols-2 gap-3 min-[720px]:grid-cols-3">
        {app.artworks.map((artwork) => {
          const on = app.picks.includes(artwork.id);
          return (
            <li key={artwork.id}>
              <button type="button" className={`w-full bg-transparent text-left ${on ? "outline outline-2 outline-accent" : ""}`} onClick={() => app.togglePick(artwork.id)}>
                <img src={artwork.imageUrl} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
                <span className="mt-2 block text-[14px] font-semibold">{artwork.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn btn-accent mt-8" onClick={() => router.push("/my-room")}>
        다음
      </button>
    </div>
  );
}
