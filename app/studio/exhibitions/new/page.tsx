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
import { resolveLeafletTheme } from "@/components/leaflet/theme";
import { useApp } from "@/components/providers";
import { ThemeColorPicker } from "@/components/studio/ThemeColorPicker";
import { Frame, PageTitle } from "@/components/ui";
import { compressImageFile } from "@/lib/leaflet/compressImage";
import { writeExhibitionThemeColor } from "@/lib/leaflet/exhibitionTheme";
import { COLOR_BY_NAME, type RestartColor } from "@/lib/leaflet/colors";
import { KEYS, readJSON } from "@/lib/storage";
import { WIZARD_LABELS } from "@/lib/studio/copy";
import { artworkTemplateCsv } from "@/lib/studio/exportCsv";
import { EXHIBITION_OBJECTIVES } from "@/lib/studio/exhibitionOps";
import { parseArtworkCsv } from "@/lib/studio/parseArtworkCsv";
import {
  buildWizardSubmission,
  hydrateWizardDraft,
  removeWizardZone,
  toWizardWork,
  validateWizardStep1,
  emptyWizardDraft,
  type WizardDraft,
  type WizardZone,
} from "@/lib/studio/wizardDraft";

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
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const [draft, setDraft] = useState<WizardDraft>(() => emptyWizardDraft());
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualArtist, setManualArtist] = useState("");
  const [manualWidth, setManualWidth] = useState("");
  const [manualImage, setManualImage] = useState<string | null>(null);

  useEffect(() => {
    const stored = readJSON<WizardDraft | null>(localStorage, KEYS.wizardDraft, null);
    setDraft({ ...hydrateWizardDraft(stored), step });
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

  const step1Error = useMemo(
    () => validateWizardStep1(draft, { contracted }),
    [draft, contracted],
  );

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

  async function onManualImage(file: File | null) {
    if (!file) {
      setManualImage(null);
      return;
    }
    try {
      setManualImage(await compressImageFile(file));
    } catch {
      setError("작품 이미지를 처리하지 못했습니다.");
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
      persist({
        ...draft,
        works: [...draft.works, ...works.map((w) => toWizardWork(w))],
      });
    } catch {
      setError("작품 파일을 읽지 못했습니다.");
    }
  }

  function addManualWork() {
    const title = manualTitle.trim();
    const artistName = manualArtist.trim();
    if (!title || !artistName) {
      setError("작품명과 작가를 입력해 주세요.");
      return;
    }
    const width = manualWidth.trim() === "" ? null : Number(manualWidth);
    if (width !== null && (!Number.isFinite(width) || width <= 0)) {
      setError("가로 크기를 확인해 주세요.");
      return;
    }
    setError("");
    persist({
      ...draft,
      works: [
        ...draft.works,
        toWizardWork(
          {
            title,
            artistName,
            year: null,
            widthCm: width,
            heightCm: null,
            medium: null,
            description: null,
          },
          { imageDataUrl: manualImage },
        ),
      ],
    });
    setManualTitle("");
    setManualArtist("");
    setManualWidth("");
    setManualImage(null);
  }

  function removeWork(workId: string) {
    persist({ ...draft, works: draft.works.filter((w) => w.workId !== workId) });
  }

  function setWorkZone(workId: string, zoneId: string | null) {
    persist({
      ...draft,
      works: draft.works.map((w) => (w.workId === workId ? { ...w, zoneId } : w)),
    });
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

  function updateZone(zoneId: string, patch: Partial<WizardZone>) {
    persist({
      ...draft,
      zones: draft.zones.map((z) => (z.zoneId === zoneId ? { ...z, ...patch } : z)),
    });
  }

  function pickThemeColor(color: RestartColor) {
    persist({ ...draft, themeColorName: color.name });
  }

  function submitFinal(event: FormEvent) {
    event.preventDefault();
    if (!app.myGalleryId) {
      setError("갤러리 정보가 없습니다.");
      return;
    }
    const v1 = validateWizardStep1(draft, { contracted });
    if (v1) {
      setError(v1);
      goStep(1);
      return;
    }

    const exhibitionId = `ex-${Date.now().toString(36)}`;
    const result = buildWizardSubmission(draft, {
      galleryId: app.myGalleryId,
      contracted,
      exhibitionId,
    });
    app.upsertExhibition(result.exhibition);
    const color = draft.themeColorName ? COLOR_BY_NAME[draft.themeColorName] : null;
    if (color) writeExhibitionThemeColor(exhibitionId, color);
    if (result.goals) app.saveExhibitionGoals(result.goals);
    if (contracted) app.saveExhibitionZones(exhibitionId, result.zones);
    for (const artist of result.artists) app.upsertArtist(artist);
    for (const artwork of result.artworks) app.upsertArtwork(artwork);

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

  const themePreview = draft.themeColorName
    ? resolveLeafletTheme(draft.themeColorName)
    : null;

  return (
    <Frame width="utility">
      <PageTitle title="새 전시 등록" />

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
                  if (n > 1 && step1Error) {
                    setError(step1Error);
                    return;
                  }
                  setError("");
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
            <span className="mb-2 block text-[14px] font-semibold">{WIZARD_LABELS.title}</span>
            <input
              className="field"
              value={draft.title}
              onChange={(e) => persist({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">{WIZARD_LABELS.gallery}</span>
            <input className="field" value={gallery?.name ?? ""} readOnly />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">{WIZARD_LABELS.venue}</span>
            <input
              className="field"
              value={draft.venue}
              onChange={(e) => persist({ ...draft, venue: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">
              {WIZARD_LABELS.startDate}
            </span>
            <input
              className="field"
              type="date"
              value={draft.startDate}
              onChange={(e) => persist({ ...draft, startDate: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold">
              {WIZARD_LABELS.endDate}
            </span>
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
                <span className="mb-2 block text-[14px] font-semibold">
                  {WIZARD_LABELS.description}
                </span>
                <textarea
                  className="field min-h-24"
                  value={draft.description}
                  onChange={(e) =>
                    persist({ ...draft, description: e.target.value })
                  }
                />
              </label>
              <fieldset>
                <legend className="mb-2 text-[14px] font-semibold">
                  {WIZARD_LABELS.objectives}
                </legend>
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
            </>
          ) : null}

          <div>
            <span className="mb-2 block text-[14px] font-semibold">
              {WIZARD_LABELS.themeColor}
            </span>
            {themePreview ? (
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className="inline-block h-10 w-10 shrink-0 rounded-sm border border-hairline"
                  style={{ background: themePreview.bg }}
                  aria-hidden
                />
                <p className="m-0 text-[15px] font-semibold">
                  {themePreview.name}{" "}
                  <span className="ml-1 rounded-sm bg-ink/10 px-1.5 py-0.5 text-[12px] font-medium">
                    선택
                  </span>
                </p>
              </div>
            ) : null}
            <ThemeColorPicker
              selectedName={draft.themeColorName}
              onPick={pickThemeColor}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (step1Error) {
                setError(step1Error);
                return;
              }
              setError("");
              goStep(2);
            }}
          >
            {WIZARD_LABELS.next}
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
              <img
                src={draft.posterDataUrl}
                alt="포스터 미리보기"
                className="mt-3 max-h-48 rounded-lg object-contain"
              />
            ) : null}
          </div>

          <div className="studio-card">
            <h3 className="mt-0 text-[15px] font-semibold">작품 추가</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[12px] text-mute">작품명</span>
                <input
                  className="field"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] text-mute">작가</span>
                <input
                  className="field"
                  value={manualArtist}
                  onChange={(e) => setManualArtist(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] text-mute">가로(cm)</span>
                <input
                  className="field"
                  type="number"
                  min={0}
                  step="0.1"
                  value={manualWidth}
                  onChange={(e) => setManualWidth(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] text-mute">이미지</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => void onManualImage(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
            <button
              type="button"
              className="btn btn-secondary mt-3"
              onClick={addManualWork}
            >
              작품 추가
            </button>
          </div>

          <div className="studio-card">
            <h3 className="mt-0 text-[15px] font-semibold">작품 목록 CSV</h3>
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
                    <th aria-label="삭제" />
                  </tr>
                </thead>
                <tbody>
                  {draft.works.map((w) => (
                    <tr key={w.workId}>
                      <td>{w.title}</td>
                      <td>{w.artistName}</td>
                      <td>{w.widthCm ?? "—"}</td>
                      <td>{w.description ?? "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary min-h-9 px-2"
                          onClick={() => removeWork(w.workId)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => goStep(1)}>
              {WIZARD_LABELS.prev}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => goStep(3)}>
              {WIZARD_LABELS.next}
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
            {draft.zones.length > 0 ? (
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
                      onClick={() => persist(removeWizardZone(draft, z.zoneId))}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {draft.zones.length > 0 && draft.works.length > 0 ? (
            <div>
              <h3 className="mb-3 mt-0 text-[15px] font-semibold">작품별 구역</h3>
              <div className="table-wrap">
                <table className="studio-table">
                  <thead>
                    <tr>
                      <th>작품명</th>
                      <th>작가</th>
                      <th>구역</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.works.map((w) => (
                      <tr key={w.workId}>
                        <td>{w.title}</td>
                        <td>{w.artistName}</td>
                        <td>
                          <select
                            className="field"
                            aria-label={`${w.title} 구역`}
                            value={w.zoneId ?? ""}
                            onChange={(e) =>
                              setWorkZone(w.workId, e.target.value || null)
                            }
                          >
                            <option value="">구역 없음</option>
                            {draft.zones.map((z) => (
                              <option key={z.zoneId} value={z.zoneId}>
                                {z.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => goStep(2)}>
              {WIZARD_LABELS.prev}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => goStep(4)}>
              {WIZARD_LABELS.next}
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
              {draft.venue ? `${draft.venue} · ` : ""}
              {draft.startDate} – {draft.endDate}
            </p>
            <p className="m-0 mt-2 text-[14px]">
              작품 {draft.works.length}점 · 구역 {draft.zones.length}곳
            </p>
            {draft.themeColorName ? (
              <p className="m-0 mt-2 text-[13px] text-mute">
                테마 색 {draft.themeColorName}
              </p>
            ) : null}
            {contracted && draft.objectives.length ? (
              <p className="m-0 mt-2 text-[13px] text-mute">
                목표: {draft.objectives.join(", ")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => goStep(3)}>
              {WIZARD_LABELS.prev}
            </button>
            <button type="submit" className="btn btn-primary">
              {WIZARD_LABELS.submit}
            </button>
            <Link href="/studio" className="btn btn-secondary">
              {WIZARD_LABELS.cancel}
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
