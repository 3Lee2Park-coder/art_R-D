/** 대표 이미지: 내 사진 > 닮은 작품. 포스터 대체 없음 (LEAFLET_SPEC 4) */

export type RepresentativeResult = {
  kind: "userPhoto" | "similarArtwork";
  url: string | null;
  artworkId: string | null;
};

export function pickRepresentative(input: {
  userPhotoUrl: string | null | undefined;
  similarArtworkId: string;
  similarArtworkImageUrl: string | null | undefined;
}): RepresentativeResult {
  if (input.userPhotoUrl) {
    return {
      kind: "userPhoto",
      url: input.userPhotoUrl,
      artworkId: null,
    };
  }
  return {
    kind: "similarArtwork",
    url: input.similarArtworkImageUrl ?? null,
    artworkId: input.similarArtworkId,
  };
}
