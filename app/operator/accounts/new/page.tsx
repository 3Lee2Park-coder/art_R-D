"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { initialOf } from "@/lib/format";
import { SESSION } from "@/lib/storage";

export default function NewAccountPage() {
  const app = useApp();
  const router = useRouter();
  const regions = Array.from(new Set([...app.galleries.map((gallery) => gallery.region), "기타"]));
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState(regions[0] ?? "기타");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !manager.trim() || !email.trim() || !start || !end) {
      setError("필수 항목을 입력해 주세요.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("이메일을 다시 확인해 주세요.");
      return;
    }
    if (end < start) {
      setError("계약 기간을 다시 확인해 주세요.");
      return;
    }
    const issued = email.trim();
    app.addGallery({
      id: `g-${Date.now().toString(36)}`,
      name: name.trim(),
      region,
      initial: initialOf(name),
      contractState: "contracted",
      bio: null,
      contractStart: start,
      contractEnd: end,
      manager: manager.trim(),
      email: issued,
      phone: phone.trim() || null,
      imageUrl: null,
    });
    sessionStorage.setItem(SESSION.notice, `계정을 발급했습니다. ${issued}`);
    router.push("/operator/accounts");
  }

  return (
    <Frame width="read">
      <PageTitle title="계정 생성" />
      <form className="utility-panel" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">갤러리명</span>
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">담당자</span>
          <input className="field" value={manager} onChange={(event) => setManager(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이메일</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">연락처</span>
          <input className="field" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">지역</span>
          <select className="field" value={region} onChange={(event) => setRegion(event.target.value)}>
            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">계약 시작일</span>
          <input className="field" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">계약 종료일</span>
          <input className="field" type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
        </label>
        {error ? <p className="text-danger">{error}</p> : null}
        <button type="submit" className="btn btn-primary">
          계정 발급
        </button>
        <Link href="/operator/accounts" className="link">
          취소
        </Link>
      </form>
    </Frame>
  );
}
