import artistJson from "@/data/artists.json";
import artworkJson from "@/data/artworks.json";
import errorJson from "@/data/errors.json";
import exhibitionJson from "@/data/exhibitions.json";
import galleryJson from "@/data/galleries.json";
import leafletJson from "@/data/leaflets.json";
import myRoomJson from "@/data/myroom.json";
import reportJson from "@/data/reports.json";
import type { Artist, Artwork, ErrorLog, Exhibition, Gallery, Leaflet, Report } from "@/lib/types";

export const artistSeed = artistJson as Artist[];
export const artworkSeed = artworkJson as Artwork[];
export const errorSeed = errorJson as ErrorLog[];
export const exhibitionSeed = exhibitionJson as Exhibition[];
export const gallerySeed = galleryJson as Gallery[];
export const leafletSeed = leafletJson as Leaflet[];
export const reportSeed = reportJson as Report[];

export const myRoomSeed = myRoomJson as {
  recommendationArtworkIds: string[];
  wantedExhibitionIds: string[];
  recommendedExhibitionIds: string[];
};

export function artworksInExhibition(exhibitionId: string) {
  return artworkSeed.filter((artwork) => artwork.exhibitionId === exhibitionId);
}

/**
 * 촬영 순서 샘플. 실제 촬영 경로는 `mockRecognize`(시나리오)를 쓴다.
 * 서버 인식은 하지 않는다.
 */
export function recognizedArtworkId(exhibitionId: string, index: number) {
  const works = artworksInExhibition(exhibitionId).filter((artwork) => artwork.zone);
  return works[index]?.id ?? null;
}

export function recommendationIds(exhibitionId: string, recognized: Array<string | null>) {
  const seen = new Set(recognized.filter((id): id is string => Boolean(id)));
  const same = artworkSeed.filter((artwork) => artwork.exhibitionId === exhibitionId && !seen.has(artwork.id));
  const others = artworkSeed.filter((artwork) => artwork.exhibitionId !== exhibitionId);
  return [...same, ...others].slice(0, 3).map((artwork) => artwork.id);
}
