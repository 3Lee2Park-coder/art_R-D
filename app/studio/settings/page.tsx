"use client";

import { FormEvent, useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";

export default function StudioSettingsPage() {
  const app = useApp();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!gallery) return;
    setName(gallery.name);
    setAddress(gallery.address ?? "");
    setPhone(gallery.contactPhone ?? "");
    setEmail(gallery.contactEmail ?? "");
    setBio(gallery.bio ?? "");
  }, [gallery]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!app.myGalleryId) return;
    app.patchGalleryProfile({
      galleryId: app.myGalleryId,
      name: name.trim() || gallery?.name,
      address: address.trim() || null,
      contactPhone: phone.trim() || null,
      contactEmail: email.trim() || null,
      bio: bio.trim() || null,
    });
    setSaved(true);
  }

  if (!gallery) {
    return (
      <Frame width="utility">
        <PageTitle title="갤러리 설정" />
        <p>갤러리를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title="갤러리 설정" kicker={gallery.name} />
      <p className="mb-6 text-[14px] text-mute">
        갤러리 프로필과 담당자 연락처를 관리합니다.
      </p>
      <form className="flex max-w-lg flex-col gap-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">갤러리 이름</span>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">주소</span>
          <input
            className="field"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">전화</span>
          <input
            className="field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이메일</span>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">소개</span>
          <textarea
            className="field min-h-28"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        {saved ? (
          <p className="text-[14px] text-[var(--studio-green)]">저장했습니다.</p>
        ) : null}
        <button type="submit" className="btn btn-primary">
          저장
        </button>
      </form>
    </Frame>
  );
}
