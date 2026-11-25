# 체크인 세션 데이터 계약 (5j)

실제 QR 입장 게이트·스캔 저장은 범위 밖이다. 갤러리 리포트용 타입·목 데이터·집계만 다룬다.

## 레코드

```ts
{
  sessionId: string;
  exhibitionId: string;
  checkedInAt: string | null; // ISO. 없으면 고유 체크인에 미포함
  source: "qr";               // 지금은 "qr"만
  openedAt: string;           // QR 접속 시각. 모든 세션에 있음
  recordStartedAt: string | null; // 기록 시작. 리플릿 있는 세션은 값 있음
}
```

관련: [EXHIBITION_OPS_DATA.md](./EXHIBITION_OPS_DATA.md)

## 집계 (컷오프는 지표별 시각)

종료 계약이면 각 시각 ≤ `contractEndAt`인 것만 센다.

| 지표 | 정의 |
|------|------|
| QR 접속 | `openedAt`이 있는 세션 수 |
| 고유 체크인 | `checkedInAt`이 있는 `sessionId` 고유 수 |
| 기록 시작 | `recordStartedAt`이 있는 세션 수 |
| 리플릿 생성 | 파사드 리플릿 수 |
| 날짜별·시간대별 추이 | 고유 체크인의 `checkedInAt` (날짜, 2시간 칸) |

## 단조 (컷오프 적용 뒤)

QR 접속 ≥ 고유 체크인 ≥ 기록 시작 ≥ 리플릿 생성

## 없는 것

입장 게이트 실수집, 운영 이벤트 적재, 관람객 QR 흐름 변경.
