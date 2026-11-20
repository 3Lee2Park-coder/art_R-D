import type { LeafletResult } from "@/lib/leaflet/buildLeafletResult";
import type { VisitRecord } from "@/lib/leaflet/dwell";

export type Role =
  | "visitor-guest"
  | "visitor-member"
  | "gallery-contracted"
  | "gallery-uncontracted"
  | "operator";

export type Mode = "light" | "dark" | "utility";

export type ExhibitionStatus = "contracted" | "uncontracted" | "unregistered";

export type Exhibition = {
  id: string;
  title: string;
  galleryId: string | null;
  status: ExhibitionStatus;
  venue: string;
  startDate: string;
  endDate: string;
  posterUrl: string;
  description: string | null;
  leafletEnabled: boolean;
  published: boolean;
  approvalState: "none" | "pending" | "approved";
  /** 종료 확정 방식이 정해지기 전, 데이터에 직접 둔다. */
  ended: boolean;
};

export type Artwork = {
  id: string;
  title: string;
  artistId: string;
  exhibitionId: string | null;
  zone: string | null;
  imageUrl: string;
  description: string | null;
  priceKrw: number | null;
  forSale: boolean;
  likeCount: number;
};

export type Artist = {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
};

export type Gallery = {
  id: string;
  name: string;
  region: string;
  initial: string;
  contractState: "contracted" | "uncontracted" | "ended";
  bio: string | null;
};

export type LeafletPhoto = {
  id: string;
  url: string;
  capturedAt?: string;
  source: "camera" | "upload";
  recognizedArtworkId: string | null;
};

export type LeafletNotes = {
  onePickArtworkId?: string;
  reasonChips?: string[];
  comment?: string;
};

export type Leaflet = {
  id: string;
  kind: "visit" | "record";
  exhibitionId: string | null;
  unregisteredTitle?: string;
  unregisteredVenue?: string;
  unregisteredStart?: string;
  unregisteredEnd?: string;
  visitDate: string;
  themeId: string | null;
  photos: LeafletPhoto[];
  notes?: LeafletNotes;
  comment?: string;
  recommendationArtworkIds: string[];
  inArchive?: boolean;
  /** 관람 기록 (카드 2) */
  records?: VisitRecord[];
  /** STEP1 계산 결과 (카드는 이 값만 그린다) */
  result?: LeafletResult;
  /** 65색 이름 (LEAFLET_SPEC 7-3) */
  themeColor?: string;
  myPhotoUrl?: string;
};

export type Report = {
  id: string;
  exhibitionId: string;
  galleryId: string;
  zones: { zone: string; interest: string }[];
  artworks: { artworkId: string; interest: string }[];
  dwell: { zone: string; estimate: string | null }[];
};

export type ErrorLog = {
  id: string;
  at: string;
  area: string;
  summary: string;
  status: string;
};

export type CaptureSession = {
  exhibitionId: string;
  photos: LeafletPhoto[];
};

export type DecorState = {
  wall: string;
};
