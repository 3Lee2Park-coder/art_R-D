"use client";

import Link from "next/link";
import { useApp } from "@/components/providers";
import { PageTitle } from "@/components/ui";

export default function MyRoomIntroPage() {
  const { beginRoomLogin } = useApp();
  return (
    <div className="leaflet-col flex min-h-[70vh] flex-col justify-center py-10">
      <PageTitle title="마이룸" kicker="RestArt" />
      <p className="text-mute-on-dark">관람 기록과 고른 작품이 모이는 방입니다. 로그인하면 기록을 저장할 수 있습니다.</p>
      <button type="button" className="btn btn-accent mt-8" onClick={beginRoomLogin}>
        로그인하기
      </button>
      <Link href="/signup" className="btn btn-secondary-dark mt-3" onClick={() => localStorage.setItem("restart.returnTo", "/my-room")}>
        회원가입하기
      </Link>
    </div>
  );
}
