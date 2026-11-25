import { COLOR_BY_NAME } from "@/lib/leaflet/colors";
import type { ParsedArtworkRow } from "@/lib/studio/parseArtworkCsv";
import type {
  Artist,
  Artwork,
  Exhibition,
  ExhibitionGoals,
  ExhibitionZone,
} from "@/lib/types";

export type WizardWork = ParsedArtworkRow & {
  /** 초안 안에서 작품을 구분하는 키 */
  workId: string;
  /** 3단계에서 고른 구역 (초안 구역 zoneId). 없으면 null */
  zoneId: string | null;
  /** 수동 추가 시 고른 이미지 (선택) */
  imageDataUrl: string | null;
};

export type WizardZone = Omit<ExhibitionZone, "exhibitionId">;

export type WizardDraft = {
  step: 1 | 2 | 3 | 4;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  description: string;
  objectives: string[];
  targets: ExhibitionGoals["targets"];
  /** 4B 65색 이름. 1단계 필수 */
  themeColorName: string | null;
  posterDataUrl: string | null;
  posterName: string | null;
  works: WizardWork[];
  floorPlanDataUrl: string | null;
  zones: WizardZone[];
};

export function emptyWizardDraft(): WizardDraft {
  return {
    step: 1,
    title: "",
    venue: "",
    startDate: "",
    endDate: "",
    description: "",
    objectives: [],
    targets: { records: null, interests: null, inquiries: null },
    themeColorName: null,
    posterDataUrl: null,
    posterName: null,
    works: [],
    floorPlanDataUrl: null,
    zones: [],
  };
}

export function newWorkId(): string {
  return `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** CSV 행·수동 입력 → 초안 작품 */
export function toWizardWork(
  row: ParsedArtworkRow,
  extra?: Partial<Pick<WizardWork, "workId" | "zoneId" | "imageDataUrl">>,
): WizardWork {
  return {
    ...row,
    workId: extra?.workId ?? newWorkId(),
    zoneId: extra?.zoneId ?? null,
    imageDataUrl: extra?.imageDataUrl ?? null,
  };
}

/** 저장된 초안(구 형식 포함) → 현재 형식 */
export function hydrateWizardDraft(stored: Partial<WizardDraft> | null): WizardDraft {
  const base = emptyWizardDraft();
  if (!stored) return base;
  const works = (stored.works ?? []).map((w, i) => ({
    ...w,
    workId: (w as Partial<WizardWork>).workId ?? `w-legacy-${i}`,
    zoneId: (w as Partial<WizardWork>).zoneId ?? null,
    imageDataUrl: (w as Partial<WizardWork>).imageDataUrl ?? null,
  }));
  return {
    ...base,
    ...stored,
    themeColorName:
      stored.themeColorName && COLOR_BY_NAME[stored.themeColorName]
        ? stored.themeColorName
        : null,
    works,
  };
}

export type WizardStepContext = { contracted: boolean };

/** 1단계 검증. 통과하면 null, 아니면 안내 문구. */
export function validateWizardStep1(
  draft: WizardDraft,
  ctx: WizardStepContext,
): string | null {
  if (!draft.title.trim() || !draft.startDate || !draft.endDate) {
    return "전시명과 전시 기간을 입력해 주세요.";
  }
  if (draft.endDate < draft.startDate) return "전시 기간을 다시 확인해 주세요.";
  if (!draft.themeColorName || !COLOR_BY_NAME[draft.themeColorName]) {
    return "전시 테마 색상을 선택해 주세요.";
  }
  if (ctx.contracted && draft.objectives.length === 0) {
    return "전시 목표를 하나 이상 선택해 주세요.";
  }
  return null;
}

export function removeWizardZone(draft: WizardDraft, zoneId: string): WizardDraft {
  return {
    ...draft,
    zones: draft.zones.filter((z) => z.zoneId !== zoneId),
    works: draft.works.map((w) => (w.zoneId === zoneId ? { ...w, zoneId: null } : w)),
  };
}

export type WizardSubmission = {
  exhibition: Exhibition;
  artists: Artist[];
  artworks: Artwork[];
  /** 계약 갤러리만 저장 */
  zones: ExhibitionZone[];
  goals: ExhibitionGoals | null;
};

/**
 * 등록 결과물. 작품마다 고른 구역의 이름을 Artwork.zone에 넣는다.
 * 구역을 고르지 않았거나 구역이 없으면 null (첫 구역으로 채우지 않는다).
 */
export function buildWizardSubmission(
  draft: WizardDraft,
  input: {
    galleryId: string;
    contracted: boolean;
    exhibitionId: string;
    placeholderImageUrl?: string;
  },
): WizardSubmission {
  const { exhibitionId, contracted } = input;
  const exhibition: Exhibition = {
    id: exhibitionId,
    title: draft.title.trim(),
    galleryId: input.galleryId,
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
    themeColorName: draft.themeColorName,
  };

  const zones: ExhibitionZone[] = contracted
    ? draft.zones.map((z) => ({ ...z, exhibitionId }))
    : [];
  const zoneNameById = new Map(draft.zones.map((z) => [z.zoneId, z.name]));

  const artistIdByName = new Map<string, string>();
  const artists: Artist[] = [];
  const artworks: Artwork[] = [];
  for (const work of draft.works) {
    let artistId = artistIdByName.get(work.artistName);
    if (!artistId) {
      artistId = `ar-${exhibitionId}-${artistIdByName.size}`;
      artistIdByName.set(work.artistName, artistId);
      artists.push({ id: artistId, name: work.artistName, bio: null, imageUrl: null });
    }
    artworks.push({
      id: `aw-${exhibitionId}-${artworks.length}`,
      title: work.title,
      artistId,
      exhibitionId,
      zone: (work.zoneId && zoneNameById.get(work.zoneId)) || null,
      imageUrl:
        work.imageDataUrl ?? input.placeholderImageUrl ?? "/images/artworks/plane.svg",
      description: work.description,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: work.widthCm,
    });
  }

  const goals: ExhibitionGoals | null = contracted
    ? { exhibitionId, objectives: draft.objectives, targets: draft.targets }
    : null;

  return { exhibition, artists, artworks, zones, goals };
}
