"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { compressImageFile } from "@/lib/leaflet/compressImage";
import { KEYS, readJSON } from "@/lib/storage";
import { artworkTemplateCsv } from "@/lib/studio/exportCsv";
import { EXHIBITION_OBJECTIVES } from "@/lib/studio/exhibitionOps";
import { parseArtworkCsv } from "@/lib/studio/parseArtworkCsv";
import {
  emptyWizardDraft,
  type WizardDraft,
} from "@/lib/studio/wizardDraft";
import type { Artist, Artwork, Exhibition, ExhibitionZone } from "@/lib/types";

const STEP_LABELS = ["기본 정보", "작품 및 작가", "배치도 및 구역", "최종 검수"] as const;

function clampStep(n: number): 1 | 2 | 3 | 4 {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  return 4;
}

function NewExhibitionWizard() {
  const app = useApp();
  const router = useRouter();
  const search = useSearchParams();
  const step = clampStep(Number(search.get("step") || "1"));
  const contracted = app.role === "gallery-contracted";
  const [draft, setDraft] = useState<WizardDraft>(() => emptyWizardDraft());
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readJSON<WizardDraft | null>(localStorage, KEYS.wizardDraft, null);
    if (stored) setDraft({ ...emptyWizardDraft(), ...stored, step });
    else setDraft((d) => ({ ...d, step }));
    setHydrated(true);
  }, [step]);

  const persist = useCallback((next: WizardDraft) => {
    setDraft(next);
    localStorage.setItem(KEYS.wizardDraft, JSON.stringify(next));
  }, []);

  const goStep = useCallback(
    (n: 1 | 2 | 3 | 4) => {
      const next = { ...draft, step: n };
      persist(next);
      router.replace(`/studio/exhibitions/new?step=${n}`);
    },
    [draft, persist, router],
  );

  const canStep2 = useMemo(() => {
    if (!draft.title.trim() || !draft.venue.trim() || !draft.startDate || !draft.endDate) {
      return false;
    }
    if (draft.endDate < draft.startDate) return false;
    if (contracted && draft.objectives.length === 0) return false;
    return true;
  }, [draft, contracted]);

  async function onPoster(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      persist({
        ...draft,
        posterDataUrl: dataUrl,
        posterName: file.name,
      });
    } catch {
      setError("포스터 이미지를 처리하지 못했습니다.");
    }
  }

  async function onFloorPlan(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      persist({ ...draft, floorPlanDataUrl: dataUrl });
    } catch {
      setError("배치도 이미지를 처리하지 못했습니다.");
    }
  }

  async function onArtworkFile(file: File | null) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("CSV 파일만 지원합니다. (xlsx는 양식 CSV로 저장해 주세요)");
      return;
    }
    try {
      const text = await file.text();
      const works = parseArtworkCsv(text);
      if (!works.length) {
        setError("작품명과 작가명이 포함된 표를 확인해 주세요.");
        return;
      }
      setError("");
      persist({ ...draft, works });
    } catch {
      setError("작품 파일을 읽지 못했습니다.");
    }
  }

  function addZone() {
    const zoneId = `z-${Date.now().toString(36)}`;
    persist({
      ...draft,
      zones: [
        ...draft.zones,
        { zoneId, name: `구역 ${draft.zones.length + 1}`, wallLengthM: null },
      ],
    });
  }

  function updateZone(
    zoneId: string,
    patch: Partial<Omit<ExhibitionZone, "exhibitionId">>,
  ) {
    persist({
      ...draft,
      zones: draft.zones.map((z) => (z.zoneId === zoneId ? { ...z, ...patch } : z)),
    });
  }

  function removeZone(zoneId: string) {
    persist({ ...draft, zones: draft.zones.filter((z) => z.zoneId !== zoneId) });
  }

  function validateStep1(): string | null {
    if (!draft.title.trim() || !draft.venue.trim() || !draft.startDate || !draft.endDate) {
      return "전시 이름, 장소, 기간을 입력해 주세요.";
    }
    if (draft.endDate < draft.startDate) return "기간을 다시 확인해 주세요.";
    if (contracted && draft.objectives.length === 0) {
      return "전시 목표를 하나 이상 선택해 주세요.";
    }
    return null;
  }

  function submitFinal(event: FormEvent) {
    event.preventDefault();
    if (!app.myGalleryId) {
      setError("갤러리 정보가 없습니다.");
      return;
    }
    const v1 = validateStep1();
    if (v1) {
      setError(v1);
      goStep(1);
      return;
    }

    const exhibitionId = `ex-${Date.now().toString(36)}`;
    const exhibition: Exhibition = {
      id: exhibitionId,
      title: draft.title.trim(),
      galleryId: app.myGalleryId,
      status: contracted ? "contracted" : "uncontracted",
      venue: draft.venue.trim(),
      startDate: draft.startDate,
      endDate: draft.endDate,
      posterUrl: draft.posterDataUrl || "/images/posters/plain.svg",
      description:
        contracted && draft.description.trim() ? draft.description.trim() : null,
      leafletEnabled: contracted,
      published: !contracted,
      approvalState: contracted ? "pending" : "none",
      ended: false,
      floorPlanUrl: draft.floorPlanDataUrl,
      themeColorName: null,
    };
    app.upsertExhibition(exhibition);

    if (contracted) {
      app.saveExhibitionGoals({
        exhibitionId,
        objectives: draft.objectives,
        targets: draft.targets,
      });
      app.saveExhibitionZones(
        exhibitionId,
        draft.zones.map((z) => ({ ...z, exhibitionId })),
      );
    }

    const artistByName = new Map<string, string>();
    for (const work of draft.works) {
      let artistId = artistByName.get(work.artistName);
      if (!artistId) {
        artistId = `ar-${Date.now().toString(36)}-${artistByName.size}`;
        artistByName.set(work.artistName, artistId);
        const artist: Artist = {
          id: artistId,
          name: work.artistName,
          bio: null,
          imageUrl: null,
        };
        app.upsertArtist(artist);
      }
      const artwork: Artwork = {
        id: `aw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        title: work.title,
        artistId,
        exhibitionId,
        zone: draft.zones[0]?.name ?? null,
        imageUrl: "/images/artworks/plane.svg",
        description: work.description,
        priceKrw: null,
        forSale: false,
        likeCount: 0,
        widthCm: work.widthCm,
      };
      app.upsertArtwork(artwork);
    }

    localStorage.removeItem(KEYS.wizardDraft);
    router.push(
      contracted ? `/studio/exhibitions/${exhibitionId}/review` : "/studio",
    );
  }

  if (!hydrated) {
    return (
      <Frame width="utility">
        <PageTitle title="새 전시 등록" />
        <p className="text-mute">불러오는 중…</p>
      </Frame>
    );
  }

  return (
    <Frame width="utility">
      <PageTitle title="새 전시 등록" />
      <p className="mb-4 text-[14px] text-mute">
        전시 기본 정보부터 작품 목록, 구역 배치까지 순서대로 등록합니다.
      </p>

      <ol className="mb-6 flex flex-wrap gap-2 p-0 list-none">
        {STEP_LABELS.map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3 | 4;
          const active = step === n;
          return (
            <li key={label}>
              <button
                type="button"
                className={`btn btn-secondary min-h-10 px-3 ${active ? "ring-1 ring-[var(--studio-green)]" : ""}`}
                onClick={() => {
                  if (n > 1 && !canStep2) {
                    setError(validateStep1() ?? "1단계를 먼저 채워 주세요.");
                    return;
                  }
                  goStep(n);
                }}
              >
                {n}. {label}
              </button>
            </li>
          );
        })}
      </ol>

      {error ? <p className="mb-4 text-[14px] text-danger">{error}</p> : null}

      {step === 1 ? (
        <div className="flex max-w-lg flex-col gap-4">
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">전시 이름</span>
            <input
              className="field"
              value={draft.title}
              onChange={(e) => persist({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">장소</span>
            <input
              className="field"
              value={draft.venue}
              onChange={(e) => persist({ ...draft, venue: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">시작</span>
            <input
              className="field"
              type="date"
              value={draft.startDate}
              onChange={(e) => persist({ ...draft, startDate: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">종료</span>
            <input
              className="field"
              type="date"
              value={draft.endDate}
              onChange={(e) => persist({ ...draft, endDate: e.target.value })}
            />
          </label>
          {contracted ? (
            <>
              <label className="block">
                <span className="mb-2 block text-[14px] font-semibold">소개</span>
                <textarea
                  className="field min-h-24"
                  value={draft.description}
                  onChange={(e) =>
                    persist({ ...draft, description: e.target.value })
                  }
                />
              </label>
              <fieldset>
                <legend className="mb-2 text-[14px] font-semibold">전시 목표</legend>
                <div className="flex flex-col gap-2">
                  {EXHIBITION_OBJECTIVES.map((obj) => {
                    const checked = draft.objectives.includes(obj);
                    return (
                      <label key={obj} className="flex items-center gap-2 text-[14px]">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const objectives = checked
                              ? draft.objectives.filter((o) => o !== obj)
                              : [...draft.objectives, obj];
                            persist({ ...draft, objectives });
                          }}
                        />
                        {obj}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold">
                    기록 목표
                  </span>
                  <input
                    className="field"
                    type="number"
                    min={0}
                    value={draft.targets.records ?? ""}
                    onChange={(e) =>
                      persist({
                        ...draft,
                        targets: {
                          ...draft.targets,
                          records: e.target.value === "" ? null : Number(e.target.value),
                        },
                      })
                    }
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold">
                    관심 목표
                  </span>
                  <input
                    className="field"
                    type="number"
                    min={0}
                    value={draft.targets.interests ?? ""}
                    onChange={(e) =>
                      persist({
                        ...draft,
                        targets: {
                          ...draft.targets,
                          interests:
                            e.target.value === "" ? null : Number(e.target.value),
                        },
                      })
                    }
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-semibold">
                    문의 목표
                  </span>
                  <input
                    className="field"
                    type="number"
                    min={0}
                    value={draft.targets.inquiries ?? ""}
                    onChange={(e) =>
                      persist({
                        ...draft,
                        targets: {
                          ...draft.targets,
                          inquiries:
                            e.target.value === "" ? null : Number(e.target.value),
                        },
                      })
                    }
                  />
                </label>
              </div>
              <p className="m-0 text-[12px] text-mute">
                목표는 갤러리 내부 운영 기준입니다. 업계 평균을 의미하지 않습니다.
              </p>
            </>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const msg = validateStep1();
              if (msg) {
                setError(msg);
                return;
              }
              setError("");
              goStep(2);
            }}
          >
            다음
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-6">
          <div className="studio-card">
            <h3 className="mt-0 text-[15px] font-semibold">전시 포스터</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => void onPoster(e.target.files?.[0] ?? null)}
            />
            {draft.posterName ? (
              <p className="text-[13px] text-mute">{draft.posterName}</p>
            ) : null}
            {draft.posterDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draft.posterDataUrl}
                alt="포스터 미리보기"
                className="mt-3 max-h-48 rounded-lg object-contain"
              />
            ) : null}
          </div>
          <div className="studio-card">
            <h3 className="mt-0 text-[15px] font-semibold">작품 목록 CSV</h3>
            <p className="text-[13px] text-mute">
              권장 열: 작품명, 작가명, 제작연도, 가로(cm), 세로(cm), 매체, 작품 설명
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const blob = new Blob([artworkTemplateCsv()], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "artwork-template.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                양식 다운로드
              </button>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => void onArtworkFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          {draft.works.length > 0 ? (
            <div className="table-wrap">
              <table className="studio-table">
                <thead>
                  <tr>
                    <th>작품명</th>
                    <th>작가</th>
                    <th>가로</th>
                    <th>설명</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.works.map((w, i) => (
                    <tr key={`${w.title}-${i}`}>
                      <td>{w.title}</td>
                      <td>{w.artistName}</td>
                      <td>{w.widthCm ?? "—"}</td>
                      <td>{w.description ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[14px] text-mute">아직 불러온 작품이 없습니다.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => goStep(1)}>
              이전
            </button>
            <button type="button" className="btn btn-primary" onClick={() => goStep(3)}>
              다음
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-6">
          <div className="studio-card">
            <h3 className="mt-0 text-[15px] font-semibold">배치도</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => void onFloorPlan(e.target.files?.[0] ?? null)}
            />
            {draft.floorPlanDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draft.floorPlanDataUrl}
                alt="배치도 미리보기"
                className="mt-3 max-h-48 rounded-lg object-contain"
              />
            ) : null}
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="m-0 text-[15px] font-semibold">구역</h3>
              <button type="button" className="btn btn-secondary" onClick={addZone}>
                구역 추가
              </button>
            </div>
            {draft.zones.length === 0 ? (
              <p className="text-[14px] text-mute">구역을 추가해 주세요. (선택)</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {draft.zones.map((z) => (
                  <li key={z.zoneId} className="studio-card flex flex-wrap gap-3">
                    <label className="block flex-1">
                      <span className="mb-1 block text-[12px] text-mute">이름</span>
                      <input
                        className="field"
                        value={z.name}
                        onChange={(e) =>
                          updateZone(z.zoneId, { name: e.target.value })
                        }
                      />
                    </label>
                    <label className="block w-28">
                      <span className="mb-1 block text-[12px] text-mute">벽(m)</span>
                      <input
                        className="field"
                        type="number"
                        min={0}
                        step="0.1"
                        value={z.wallLengthM ?? ""}
                        onChange={(e) =>
                          updateZone(z.zoneId, {
                            wallLengthM:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary self-end"
                      onClick={() => removeZone(z.zoneId)}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => goStep(2)}>
              이전
            </button>
            <button type="button" className="btn btn-primary" onClick={() => goStep(4)}>
              다음
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <form className="flex max-w-xl flex-col gap-4" onSubmit={submitFinal}>
          <div className="studio-card">
            <h3 className="mt-0 text-[15px] font-semibold">검수</h3>
            <p className="m-0 text-[14px]">
              <strong>{draft.title || "(제목 없음)"}</strong>
            </p>
            <p className="m-0 mt-1 text-[14px] text-mute">
              {draft.venue} · {draft.startDate} – {draft.endDate}
            </p>
            <p className="m-0 mt-2 text-[14px]">
              작품 {draft.works.length}점 · 구역 {draft.zones.length}곳
            </p>
            {contracted && draft.objectives.length ? (
              <p className="m-0 mt-2 text-[13px] text-mute">
                목표: {draft.objectives.join(", ")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => goStep(3)}>
              이전
            </button>
            <button type="submit" className="btn btn-primary">
              {contracted ? "확인 요청" : "게시"}
            </button>
            <Link href="/studio" className="btn btn-secondary">
              취소
            </Link>
          </div>
        </form>
      ) : null}
    </Frame>
  );
}

export default function NewExhibitionPage() {
  return (
    <Suspense
      fallback={
        <Frame width="utility">
          <PageTitle title="새 전시 등록" />
          <p className="text-mute">불러오는 중…</p>
        </Frame>
      }
    >
      <NewExhibitionWizard />
    </Suspense>
  );
}
