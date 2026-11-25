# 전시 운영 데이터 (5h)

## ExhibitionGoals

전시별 운영 목표. **시드 JSON에 가짜 목표를 넣지 않는다.** 갤러리가 등록 마법사·설정에서 저장한 값만 쓴다.

```ts
{
  exhibitionId: string;
  objectives: string[]; // EXHIBITION_OBJECTIVES 중 복수
  targets: {
    records: number | null;
    interests: number | null;
    inquiries: number | null;
  };
}
```

로컬 키: `restart.exhibitionGoals`

## ExhibitionZone

구역은 `zoneId` + `name`. 작품의 `Artwork.zone`은 **name 문자열**과 맞춘다 (기존 시드 호환).

```ts
{
  exhibitionId: string;
  zoneId: string;
  name: string;
  wallLengthM: number | null;
}
```

로컬 키: `restart.exhibitionZones`

## Artwork.widthCm

가로(cm). 없으면 `null`. CSV 업로드 시 파싱한다.

## Gallery 연락처

`address`, `contactPhone`, `contactEmail` — 시드는 null, 설정 화면에서 패치 (`restart.galleryProfiles`).

## 고유 체크인

수집 파이프라인이 없으면 UI에 「데이터 부족」. 가짜 숫자를 만들지 않는다.
