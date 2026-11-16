"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { KEYS } from "@/lib/storage";

export default function LoginPage() {
  const { login, galleries } = useApp();
  const [pending, setPending] = useState(false);
  const [fromRoom, setFromRoom] = useState(false);

  useEffect(() => {
    setPending(Boolean(localStorage.getItem(KEYS.leafletDraft)));
    setFromRoom(localStorage.getItem(KEYS.returnTo) === "/my-room");
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    login("visitor-member");
  }

  return (
    <Frame width="read">
      <PageTitle title="로그인" />
      {pending ? <p className="mb-6">기록을 저장하려면 로그인해 주세요.</p> : null}
      {fromRoom && !pending ? <p className="mb-6">로그인하면 마이룸을 사용할 수 있습니다.</p> : null}
      <form className="flex max-w-md flex-col gap-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이메일</span>
          <input className="field" type="email" name="email" autoComplete="username" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">비밀번호</span>
          <input className="field" type="password" name="password" autoComplete="current-password" />
        </label>
        <button type="submit" className="btn btn-primary">
          로그인
        </button>
      </form>
      <p className="mt-6 text-[14px]">
        계정이 없으면 <Link href="/signup" className="link font-semibold">회원가입</Link>
      </p>
      <section className="mt-12 max-w-md border-t border-hairline pt-8">
        <h2 className="text-[17px] font-semibold">갤러리 계정</h2>
        <div className="mt-4 flex flex-col gap-3">
          {galleries
            .filter((gallery) => gallery.id === "g-hannam" || gallery.id === "g-seochon")
            .map((gallery) => (
              <button
                key={gallery.id}
                type="button"
                className="btn btn-secondary"
                onClick={() => login(gallery.id === "g-hannam" ? "gallery-contracted" : "gallery-uncontracted")}
              >
                {gallery.name}
              </button>
            ))}
        </div>
        <h2 className="mt-8 text-[17px] font-semibold">운영</h2>
        <button type="button" className="btn btn-secondary mt-4" onClick={() => login("operator")}>
          운영 로그인
        </button>
      </section>
    </Frame>
  );
}
