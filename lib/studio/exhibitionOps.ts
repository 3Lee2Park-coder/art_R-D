import { todayISO } from "@/lib/format";
import { exhibitionPeriodState } from "@/lib/labels";
import type {
  Artist,
  Artwork,
  Exhibition,
  ExhibitionGoals,
  ExhibitionZone,
} from "@/lib/types";

export const EXHIBITION_OBJECTIVES = [
  "신진 작가 소개",
  "특정 작가 및 대표 작품 소개",
  "전시 주제 및 메시지 전달",
  "관람객 참여 확대",
  "작품 문의 및 소장 관심 유도",
  "기타",
] as const;

export type ExhibitionOpsRow = {
  exhibition: Exhibition;
  state: string;
  periodState: ReturnType<typeof exhibitionPeriodState>;
  leafletCount: number;
  artistCount: number;
  /** 고유 체크인 수집이 없으면 null → UI 「데이터 부족」 */
  uniqueCheckIns: number | null;
};

export function buildExhibitionOpsRows(input: {
  exhibitions: Exhibition[];
  artworks: Artwork[];
  leafletCounts: Record<string, number>;
  today?: string;
}): ExhibitionOpsRow[] {
  const today = input.today ?? todayISO();
  return input.exhibitions.map((exhibition) => {
    const works = input.artworks.filter((a) => a.exhibitionId === exhibition.id);
    const artistIds = new Set(works.map((a) => a.artistId));
    return {
      exhibition,
      state:
        exhibition.approvalState === "pending"
          ? "확인 대기"
          : exhibitionPeriodState(exhibition, today),
      periodState: exhibitionPeriodState(exhibition, today),
      leafletCount: input.leafletCounts[exhibition.id] ?? 0,
      artistCount: artistIds.size,
      uniqueCheckIns: null,
    };
  });
}

export function filterExhibitionOpsRows(
  rows: ExhibitionOpsRow[],
  filter: "전체" | "준비 중" | "진행 중" | "종료",
): ExhibitionOpsRow[] {
  if (filter === "전체") return rows;
  return rows.filter((r) => r.periodState === filter);
}

export function goalsForExhibition(
  all: ExhibitionGoals[],
  exhibitionId: string,
): ExhibitionGoals | null {
  return all.find((g) => g.exhibitionId === exhibitionId) ?? null;
}

export function zonesForExhibition(
  all: ExhibitionZone[],
  exhibitionId: string,
): ExhibitionZone[] {
  return all.filter((z) => z.exhibitionId === exhibitionId);
}

export function mergeArtists(seed: Artist[], added: Artist[]): Artist[] {
  const map = new Map<string, Artist>();
  for (const a of seed) map.set(a.id, a);
  for (const a of added) map.set(a.id, a);
  return [...map.values()];
}

export function mergeArtworks(seed: Artwork[], added: Artwork[]): Artwork[] {
  const map = new Map<string, Artwork>();
  for (const a of seed) map.set(a.id, { ...a, widthCm: a.widthCm ?? null });
  for (const a of added) map.set(a.id, { ...a, widthCm: a.widthCm ?? null });
  return [...map.values()];
}

export type GalleryProfilePatch = {
  galleryId: string;
  name?: string;
  address?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  bio?: string | null;
  region?: string;
};

export function applyGalleryProfile<T extends {
  id: string;
  name: string;
  region: string;
  bio: string | null;
  address: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
}>(gallery: T, patch: GalleryProfilePatch | undefined): T {
  if (!patch || patch.galleryId !== gallery.id) return gallery;
  return {
    ...gallery,
    name: patch.name ?? gallery.name,
    region: patch.region ?? gallery.region,
    bio: patch.bio !== undefined ? patch.bio : gallery.bio,
    address: patch.address !== undefined ? patch.address : gallery.address,
    contactPhone:
      patch.contactPhone !== undefined ? patch.contactPhone : gallery.contactPhone,
    contactEmail:
      patch.contactEmail !== undefined ? patch.contactEmail : gallery.contactEmail,
  };
}
