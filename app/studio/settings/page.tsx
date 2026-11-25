"use client";

import { FormEvent, useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import {
  CUSTOMER_DATA_PRINCIPLES,
  CUSTOMER_DATA_PRINCIPLES_TITLE,
  SETTINGS_SAVE_LABEL,
} from "@/lib/studio/copy";
import { canEditGallerySettings } from "@/lib/studioAccess";

export default function StudioSettingsPage() {
  const app = useApp();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const editable = canEditGallerySettings(app.role, gallery?.contractState);

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
    if (!app.myGalleryId || !editable) return;
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
      <form className="mt-6 flex max-w-lg flex-col gap-4" onSubmit={submit}>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">갤러리 이름</span>
          <input
            className="field"
            value={name}
            disabled={!editable}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">주소</span>
          <input
            className="field"
            value={address}
            disabled={!editable}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">전화</span>
          <input
            className="field"
            value={phone}
            disabled={!editable}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이메일</span>
          <input
            className="field"
            type="email"
            value={email}
            disabled={!editable}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">소개</span>
          <textarea
            className="field min-h-28"
            value={bio}
            disabled={!editable}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        {editable && saved ? (
          <p className="text-[14px] text-[var(--studio-green)]">저장했습니다.</p>
        ) : null}
        {editable ? (
          <button type="submit" className="btn btn-primary">
            {SETTINGS_SAVE_LABEL}
          </button>
        ) : null}
      </form>
      <section className="studio-card mt-8 max-w-lg" aria-labelledby="data-principles">
        <h3 id="data-principles" className="mt-0 text-[15px] font-semibold">
          {CUSTOMER_DATA_PRINCIPLES_TITLE}
        </h3>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {CUSTOMER_DATA_PRINCIPLES.map((item) => (
            <li key={item.title}>
              <b className="block text-[14px]">{item.title}</b>
              <small className="text-[13px] text-mute">{item.note}</small>
            </li>
          ))}
        </ul>
      </section>
    </Frame>
  );
}
