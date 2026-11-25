# 구역 데이터 계약 (5i)

## 지금 있는 것

| 필드 | 출처 | 비고 |
|------|------|------|
| `leafletId` | 리플릿 | |
| `artworkId` | `VisitRecord.artworkId` | |
| `Artwork.zone` | 작품 seed / studio | **구역 이름 문자열** (`ExhibitionZone.name`과 동일). `zoneId`가 아님 |
| 리플릿 안 순서 | `VisitRecord.atSec` 정렬 | |
| `source` | `camera` \| `map` | 구역 전환·체류는 **camera**만 (`uniqueCameraArtworkIds`와 동일) |
| `emotionId` | 기록 | null이면 감성 집계 제외 |
| `visitDate` | 리플릿 | 컷오프·날짜 표시용 |
| `ExhibitionZone.wallLengthM` | 5h 저장 | 없으면 점유율 「추정 불가」 |
| `Artwork.widthCm` | 5h | 구역 내 **모든** 작품에 있어야 점유 폭 계산 |

## 지금 없는 것 (수집 필요)

- 기록 단위 `record_id`
- 절대 시각 `captured_at`
- 저장된 `sequence_no` (현재는 `atSec` 정렬로 대체)
- 고유 QR 체크인
- 작품 간 간격(cm)
- 벽면 폴리곤 / 평면도 좌표

## 없는 항목에 기대는 지표 → 「추정 불가」

- 시간대별 구역 반응
- 실제 체류(현장 체류 시간)
- 실입장객 대비 구역 참여율 (고유 체크인 분모 없음)
- 작품 간 간격을 포함한 점유 폭

## 점유 폭 계산 (5i)

간격 데이터가 없으므로 **점유 폭 = 해당 구역 작품 `widthCm` 합계(cm→m)** 만 사용한다.  
`wallLengthM` 또는 구역 작품 중 `widthCm`이 하나라도 없으면 점유 폭·점유율은 「추정 불가」.
