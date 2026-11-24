"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { KEYS } from "@/lib/storage";

export default function SignupPage() {
  const { login } = useApp();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("name");
    const trimmed = typeof name === "string" ? name.trim() : "";
    if (trimmed) localStorage.setItem(KEYS.visitorName, trimmed);
    else localStorage.removeItem(KEYS.visitorName);
    login("visitor-member");
  }

  return (
    <Frame width="read">
      <PageTitle title="회원가입" />
      <form className="flex max-w-md flex-col gap-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이름</span>
          <input className="field" name="name" autoComplete="name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이메일</span>
          <input className="field" type="email" name="email" autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">비밀번호</span>
          <input className="field" type="password" name="password" autoComplete="new-password" />
        </label>
        <button type="submit" className="btn btn-primary">
          가입
        </button>
      </form>
      <p className="mt-6 text-[14px]">
        이미 계정이 있으면 <Link href="/login" className="link font-semibold">로그인</Link>
      </p>
    </Frame>
  );
}
