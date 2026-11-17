"use client";

import { useState } from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { readPreview } from "@/lib/files";

export default function ProfilePage() {
  const app = useApp();
  const gallery = app.galleries.find((item) => item.id === app.myGalleryId);
  const regions = Array.from(new Set([...app.galleries.map((item) => item.region), "기타"]));
  const [bio, setBio] = useState(gallery?.bio ?? "");
  const [region, setRegion] = useState(gallery?.region ?? regions[0] ?? "기타");
  const [phone, setPhone] = useState(gallery?.phone ?? "");
  const [email, setEmail] = useState(gallery?.email ?? "");
  const [imageUrl, setImageUrl] = useState(gallery?.imageUrl ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  if (!gallery) {
    return (
      <Frame width="read">
        <PageTitle title="프로필" />
        <p>갤러리를 찾을 수 없습니다.</p>
      </Frame>
    );
  }

  async function chooseImage(file: File | undefined) {
    if (!file) return;
    const preview = await readPreview(file);
    if (preview) setImageUrl(preview);
  }

  function save() {
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("이메일을 다시 확인해 주세요.");
      setSaved(false);
      return;
    }
    app.patchGalleryProfile(gallery!.id, {
      bio: bio.trim() || null,
      region,
      phone: phone.trim() || null,
      email: email.trim() || null,
      imageUrl: imageUrl || null,
    });
    setError("");
    setSaved(true);
  }

  return (
    <Frame width="read">
      <PageTitle title={gallery.name} kicker="프로필" />
      <form
        className="utility-panel"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">소개</span>
          <textarea className="field min-h-28" value={bio} onChange={(event) => setBio(event.target.value)} />
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
        <div>
          <p className="mb-2 text-[14px] font-semibold">대표 이미지</p>
          {imageUrl ? <img src={imageUrl} alt="" className="mb-3 h-40 w-32 object-contain" /> : null}
          <label className="btn btn-secondary">
            {imageUrl ? "다시 선택" : "파일 선택"}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void chooseImage(file);
              }}
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">연락처</span>
          <input className="field" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[14px] font-semibold">이메일</span>
          <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        {error ? <p className="text-danger">{error}</p> : null}
        {saved ? <p>저장했습니다.</p> : null}
        <button type="submit" className="btn btn-primary">
          저장
        </button>
      </form>
    </Frame>
  );
}
