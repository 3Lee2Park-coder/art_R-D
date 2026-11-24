---
version: alpha
name: RestArt-prototype-design
description: >
  RestArt 프로토타입의 시각 언어. 둘러보기·소개 화면은 밝은 사진 우선 톤(Apple 분석의
  구조만 참고)으로, 리플릿·마이룸 등 체험 화면은 어두운 네이비 캔버스(Runway 분석의
  섹션 리듬만 참고)로 나눈다. 브랜드 색은 네이비 #0D2E52, 노랑 #F6CD52, 빨강 #B8312B
  세 가지뿐이며 Apple·Runway의 상징색과 서체는 쓰지 않는다. 한글은 Pretendard,
  자간은 풀어서 쓴다. 공식 브랜드 가이드가 아니라 시연용 출발점이다.

colors:
  primary: "#0D2E52"
  primary-deep: "#092039"
  primary-elevated: "#254263"
  accent: "#F6CD52"
  danger: "#B8312B"
  ink: "#1D1D1F"
  ink-muted: "#333333"
  mute: "#707070"
  canvas: "#FFFFFF"
  canvas-parchment: "#F5F5F7"
  surface-pearl: "#FAFAFC"
  hairline: "#E0E0E0"
  divider-soft: "#F0F0F0"
  on-primary: "#FFFFFF"
  on-accent: "#0D2E52"
  on-danger: "#FFFFFF"
  canvas-dark: "#0D2E52"
  canvas-dark-deep: "#092039"
  surface-dark: "#254263"
  ink-on-dark: "#FFFFFF"
  mute-on-dark: "#CCCCCC"
  hairline-on-dark: "#385371"
  error-on-dark: "#D4837F"

typography:
  hero-display:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: 0
  display-lg:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  display-md:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  lead:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0
  lead-airy:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  body:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-strong:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption-strong:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  button-large:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  nav-link:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  fine-print:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  chip:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  eyebrow:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px
  section-lg: 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
  button-primary-on-dark:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 11px 20px
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 22px
  header-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
  header-bar-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
  hero-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.hero-display}"
    rounded: "{rounded.none}"
  hero-dark:
    backgroundColor: "{colors.canvas-dark-deep}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.hero-display}"
    rounded: "{rounded.none}"
  card-exhibition:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 0
  card-artwork:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 0
  card-artist:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-gallery:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 16px
  leaflet-page:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
  bottom-sheet:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 24px
  cart-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 16px 0
  form-field:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  form-field-on-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  consent-modal:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 24px
  screen-id-chip:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.chip}"
    rounded: "{rounded.sm}"
    padding: 4px 8px
  mock-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
---

## Overview

RestArt는 현대미술 작가·작품·갤러리·전시를 잇는 플랫폼이다. 이 파일은 시연용 Next.js 웹 프로토타입의 시각 언어다. 참고한 것은 getdesign.md의 Apple·Runway DESIGN.md **구조**(사진이 앞서는 타일 리듬, 어두운 히어로와 읽기 밴드의 교차)일 뿐, 두 브랜드의 색·서체·로고·버튼 문법은 쓰지 않는다.

화면은 두 가지 모드로 나눈다.

- **라이트 모드(둘러보기·소개):** 흰 캔버스 `{colors.canvas}`와 연한 회백 `{colors.canvas-parchment}` 위에서 작품·전시 사진이 주인공이다. 크로마는 거의 쓰지 않고, 링크와 기본 CTA만 네이비 `{colors.primary}`다.
- **다크 모드(체험):** 페이지 바닥은 네이비 `{colors.canvas-dark}`다. 노랑 `{colors.accent}`이 다크 CTA·배지·활성 상태의 유일한 하이라이트다. 리플릿과 마이룸은 “도록을 펼쳐 보는” 느낌으로 간다.

갤러리·운영자 화면은 라이트 토큰을 쓰되, 히어로 없이 밀도를 높인 **유틸리티 모드**다.

**Key Characteristics:**
- 브랜드 색은 세 개뿐이다. 네이비는 라이트 CTA·링크와 다크 바탕, 노랑은 하이라이트와 다크 CTA, 빨강은 장바구니·가격·오류·삭제에만 아껴 쓴다.
- 노란 면 위 글자는 반드시 네이비 `{colors.on-accent}`다. 흰 글자를 노란 면 위에 두지 않는다(대비율 1.52:1, 미달).
- 다크 모드에서 빨강 `{colors.danger}`를 네이비 위 텍스트로 쓰지 않는다(2.30:1, 미달). 오류는 흰 글자의 빨간 배지, 또는 지원 토큰 `{colors.error-on-dark}`다.
- 서체는 Pretendard 하나다. 한글에는 네거티브 트래킹을 쓰지 않는다. 본문 17px, 줄간격 1.6.
- 그림자 규칙은 전 모드 공통이다. 카드·버튼에는 그림자를 두지 않고, 사진에만 아주 약한 그림자를 허용한다.
- 모든 화면 한구석에 화면 ID 칩을 달고, 모의 데이터·모의 분석에는 `모의` 배지를 단다.

## Colors

계산 방법은 WCAG 2.1 상대 휘도 공식이다. 대비율 `(L1 + 0.05) / (L2 + 0.05)`. 기준은 본문 AA 4.5:1, 큰 텍스트(18pt 이상 또는 14pt 이상 볼드) AA 3.0:1, AAA는 본문 7:1·큰 텍스트 4.5:1. 값은 추정하지 않고 계산했다.

### Brand

- **네이비** (`{colors.primary}` — #0D2E52, L=0.0265): 라이트 모드의 기본 CTA와 링크, 다크 모드의 기본 캔버스. 흰 면 위 13.73:1 (AAA), 흰 글자를 올리면 13.73:1 (AAA).
- **네이비 딥** (`{colors.primary-deep}` / `{colors.canvas-dark-deep}` — #092039, L=0.0139): 다크 히어로·푸터·스크림. #0D2E52에 검정 30%를 섞어 만든 지원 토큰이다. 흰 글자 16.44:1, 노랑 10.78:1 (둘 다 AAA).
- **네이비 엘레베이티드** (`{colors.primary-elevated}` / `{colors.surface-dark}` — #254263, L=0.0519): 다크 카드·바텀시트·입력 면. #0D2E52에 흰 10%를 섞었다. 흰 글자 10.30:1 (AAA), 노랑 6.76:1 (AA), 뮤트 `#CCCCCC` 6.42:1 (AA).
- **노랑** (`{colors.accent}` — #F6CD52, L=0.6386): 배지, 활성 점, 다크 CTA 면, 메인 홈의 마이룸·리플릿 섹션을 예고하는 작은 하이라이트. 네이비 위 9.00:1 (AAA). **텍스트 색으로 흰 면 위에 쓰지 않는다** (1.52:1, 본문·큰 글 모두 미달).
- **빨강** (`{colors.danger}` — #B8312B, L=0.1256): 장바구니 강조, 가격, 오류, 삭제. 흰 면 위 5.98:1 (AA), 파치먼트 위 5.49:1 (AA). 흰 글자를 빨간 버튼에 올리면 5.98:1 (AA).

### 라이트 중성색 (Apple 분석의 중성 사다리에서 가져오되, 미달 값은 교체)

- **잉크** (`{colors.ink}` — #1D1D1F): 기본 글자. 흰 면 16.83:1, 파치먼트 15.46:1 (AAA).
- **잉크 뮤트** (`{colors.ink-muted}` — #333333): 보조 제목. 흰 면 12.63:1 (AAA).
- **뮤트** (`{colors.mute}` — #707070): 캡션·메타. 흰 면 4.95:1, 파치먼트 4.55:1 (둘 다 본문 AA). Apple 분석의 `#7A7A7A`는 흰 면 4.29:1로 본문 AA 미달이라 쓰지 않는다.
- **캔버스** (`{colors.canvas}` — #FFFFFF), **파치먼트** (`{colors.canvas-parchment}` — #F5F5F7), **펄** (`{colors.surface-pearl}` — #FAFAFC): 페이지 바닥, 교차 밴드, 입력 면.
- **헤어라인** (`{colors.hairline}` — #E0E0E0), **디바이더** (`{colors.divider-soft}` — #F0F0F0): 구분선만. 글자 색으로 쓰지 않는다(흰 면 1.32:1, 미달).

### 다크 중성색 (Runway의 역할 분리를 네이비 톤에 옮김)

- **다크 캔버스** (`{colors.canvas-dark}` — #0D2E52): 체험 화면의 기본 바닥.
- **다크 본문** (`{colors.ink-on-dark}` — #FFFFFF): 13.73:1 (AAA).
- **다크 뮤트** (`{colors.mute-on-dark}` — #CCCCCC): 네이비 위 8.55:1 (AAA), 엘레베이티드 위 6.42:1 (AA). Runway의 슬레이트 `#676F7B`(네이비 위 2.70:1)와 스톤 `#939393`(네이비 위 4.47:1, 본문 미달)은 다크 본문에 쓰지 않는다.
- **다크 헤어라인** (`{colors.hairline-on-dark}` — #385371): 구분선 전용.

### 글자/배경 짝과 계산 대비율

| 짝 | 비율 | 판정 | 사용 |
|---|---|---|---|
| `#1D1D1F` on `#FFFFFF` | 16.83:1 | AAA | 라이트 본문 |
| `#1D1D1F` on `#F5F5F7` | 15.46:1 | AAA | 파치먼트 본문 |
| `#0D2E52` on `#FFFFFF` | 13.73:1 | AAA | 링크, 네이비 텍스트 |
| `#FFFFFF` on `#0D2E52` | 13.73:1 | AAA | 라이트 CTA 글자, 다크 본문 |
| `#F6CD52` on `#0D2E52` | 9.00:1 | AAA | 다크 하이라이트 텍스트(배지 속 짧은 라벨이 아닐 때) |
| `#0D2E52` on `#F6CD52` | 9.00:1 | AAA | **노란 CTA·배지의 글자** |
| `#1D1D1F` on `#F6CD52` | 11.04:1 | AAA | 노란 배지 대체 글자 |
| `#B8312B` on `#FFFFFF` | 5.98:1 | AA | 라이트 가격·오류 텍스트 |
| `#FFFFFF` on `#B8312B` | 5.98:1 | AA | 삭제 버튼, 다크 오류 배지 |
| `#B8312B` on `#F5F5F7` | 5.49:1 | AA | 파치먼트 위 가격 |
| `#707070` on `#FFFFFF` | 4.95:1 | AA | 라이트 캡션 |
| `#707070` on `#F5F5F7` | 4.55:1 | AA | 파치먼트 캡션 |
| `#CCCCCC` on `#0D2E52` | 8.55:1 | AAA | 다크 캡션 |
| `#FFFFFF` on `#254263` | 10.30:1 | AAA | 다크 카드 본문 |
| `#F6CD52` on `#254263` | 6.76:1 | AA | 다크 카드 위 노랑 |
| `#CCCCCC` on `#254263` | 6.42:1 | AA | 다크 카드 캡션 |
| `#D4837F` on `#0D2E52` | 4.81:1 | AA | 다크 오류 **텍스트** 지원(가안) |

### 미달 — 쓰지 말 것

| 짝 | 비율 | 판정 | 이유 |
|---|---|---|---|
| `#FFFFFF` on `#F6CD52` | 1.52:1 | 본문·큰 글 미달 | 노란 버튼에 흰 글자 금지 |
| `#F6CD52` on `#FFFFFF` | 1.52:1 | 본문·큰 글 미달 | 노란 글자를 흰 배경에 금지. 노랑은 면·아이콘 채움만 |
| `#F6CD52` on `#F5F5F7` | 1.40:1 | 미달 | 위와 같음 |
| `#B8312B` on `#0D2E52` | 2.30:1 | 본문·큰 글 미달 | 다크에서 빨간 텍스트 금지. 흰 글자 빨간 배지를 쓴다 |
| `#B8312B` on `#092039` | 2.87:1 | 미달 | 위와 같음 |
| `#B8312B` on `#F6CD52` | 3.92:1 | 본문 미달(큰 글만 AA) | 노란 면 위 빨간 글자 금지 |
| `#7A7A7A` on `#FFFFFF` | 4.29:1 | 본문 미달 | Apple 캡션 값을 채택하지 않음. `{colors.mute}` #707070 사용 |
| `#939393` on `#0D2E52` | 4.47:1 | 본문 미달 | 다크 캡션으로 쓰지 않음 |
| `#676F7B` on `#0D2E52` | 2.70:1 | 미달 | 다크 본문·캡션 금지 |

`{colors.error-on-dark}` `#D4837F`는 브랜드 빨강에 흰 40%를 섞어 네이비 위 본문 AA를 맞춘 **지원 토큰**이다. 새 브랜드 색이 아니며, 다크 인라인 오류 문장이 필요할 때만 가안으로 쓴다. 기본은 흰 글자 빨간 배지다.

## Typography

### Font Family

전 레벨을 **Pretendard**(가변 폰트 가능) 하나로 간다. 폴백은 `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`. Apple의 SF Pro, Runway의 abcNormal은 쓰지 않는다.

규모는 Apple 분석의 계층(히어로 56, 디스플레이 40/34, 리드 28/24, 본문 17, 캡션 14)을 따르되, 한글을 위해 다음만 조정한다.

- 모든 `letterSpacing`은 `0`. 한글에 네거티브 트래킹을 쓰지 않는다. 영문만 있는 짧은 라벨도 프로토타입에서는 0으로 통일한다.
- 본문 줄간격은 1.47이 아니라 **1.6**.
- `lead-airy`와 큰 버튼은 웨이트 300 대신 **400/600**. 얇은 글자는 한글 가독성이 떨어진다.
- 내비는 12px 대신 **13px / 500**.
- 화면 ID 칩은 **11px / 600**. 10px는 한글에 너무 작다.

모바일에서 히어로는 56px → 36px, `display-lg`는 40px → 28px로 줄인다. 본문 17px는 유지한다.

## Layout

- **기본 단위:** 8px. 마이크로만 4px.
- **토큰:** `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section}` 80 · `{spacing.section-lg}` 96.
- Apple 분석의 md 17px는 16px로 반올림해 한 스케일로 맞춘다.
- 라이트 소개 밴드와 다크 체험 밴드의 세로 리듬은 `{spacing.section}` 또는 `{spacing.section-lg}`.
- 유틸리티 모드(G-*, A-*)는 섹션 패딩을 `{spacing.xl}`~`{spacing.xxl}`로 줄이고, 표·리스트 밀도를 높인다.
- 콘텐츠 최대 너비는 둘러보기 그리드 약 1440px, 본문·폼 약 980px, 리플릿은 모바일 우선(폭 390~430px 기준, 중앙 정렬).
- 카드 그리드는 데스크톱 3열, 태블릿 2열, 모바일 1열. 작품 이미지는 사진 비율을 자르지 않고, 여백이 필요하면 파치먼트 또는 네이비 딥으로 채운다.

## Elevation

전 모드 공통이다.

| 단계 | 처리 | 사용 |
|---|---|---|
| Flat | 그림자 없음, 면 전환만 | 페이지 바닥, 히어로, 푸터, 섹션 교차 |
| Hairline | 라이트 `1px {colors.hairline}`, 다크 `1px {colors.hairline-on-dark}` | 카드 외곽, 헤더 하단, 폼, 장바구니 행 |
| Backdrop | `backdrop-filter: blur(16px)` + 캔버스 80% 투명 | 고정 헤더만 |
| Image shadow | `rgba(13, 46, 82, 0.18) 0 8px 28px 0` | 작품·전시 사진에만. 버튼·카드 패널·텍스트에는 쓰지 않음 |

깊이는 그림자보다 **면 색 전환**(흰 ↔ 파치먼트, 네이비 ↔ 네이비 딥 ↔ 엘레베이티드)으로 만든다.

## 화면 → 모드

| 화면 ID | 화면명 | 모드 |
|---|---|---|
| C-11 | 메인 홈 | 라이트. 단, **마이룸 설명·리플릿 설명 섹션만 다크 밴드** |
| C-01, C-02 | 로그인, 회원가입 | 라이트 |
| C-03, C-04 | 작품 상세, 장바구니 | 라이트 |
| C-06, C-07, C-08, C-09, C-10 | 작가·작품·갤러리 목록/상세 | 라이트 |
| V-01 | 전시 페이지 | 라이트 |
| V-12 | 전시 둘러보기·찾기 | 라이트 |
| V-02, V-03, V-04, V-05, V-06, V-08, V-09, V-10, V-11 | 동의·안내·촬영·리플릿 | 다크 |
| V-13, V-14 | 미등록 입력, 기록용 리플릿 | 다크 |
| C-05 | 작품 설명 팝업(리플릿 위 바텀시트) | 다크 |
| R-01 ~ R-07 | 마이룸 전체(비회원 소개 포함) | 다크 |
| G-01 ~ G-05 | 갤러리 관리 | 유틸리티(라이트 토큰, 밀도 높음) |
| A-01 ~ A-08 | 운영자 | 유틸리티(라이트 토큰, 밀도 높음) |
| V-07, A-09 | — | **시연 제외. 라우트도 만들지 않음** |

리플릿(다크)에서 C-03·C-04로 나가면 라이트 모드로 바뀐다. 뒤로 가면 다크로 돌아온다. 이 전환을 그라데이션으로 섞지 말고, 화면 단위로 바꾼다.

## Components

**`button-primary`** — 라이트·유틸리티의 기본 CTA. 배경 `{colors.primary}`, 글자 `{colors.on-primary}`, `{rounded.pill}`, 최소 높이 44px. 누르기: `{colors.primary-deep}`.

**`button-primary-on-dark`** — 다크 모드의 기본 CTA. 배경 `{colors.accent}`, 글자 `{colors.on-accent}`(네이비). 흰 글자 금지.

**`button-secondary`** — 투명 또는 흰 면, 1px `{colors.hairline}`(다크는 `{colors.hairline-on-dark}`), 글자는 라이트에서 네이비, 다크에서 흰색. 같은 필 형태.

**`button-danger`** — 배경 `{colors.danger}`, 글자 `{colors.on-danger}`. 삭제·취소성 동작에만.

**`header-bar` / `header-bar-dark`** — 상단 고정, 모드를 화면 캔버스에 맞춘다. 왼쪽 로고, 가운데 또는 오른쪽 메뉴, 맨 오른쪽 계정. 모바일은 햄버거. 로고 탭: 관람객은 C-11, 갤러리·운영자는 각각 G-01·A-01(가안, 미확인).

헤더 메뉴(확정된 IA 기준):

- 관람객(비회원): 전시(V-12), 작가(C-06), 작품(C-08), 갤러리(C-09), 마이룸(R-07로 안내), 로그인(C-01).
- 관람객(회원): 같은 메뉴. 마이룸은 R-01. 로그인 자리는 「마이룸/로그아웃」이 사용자 결정이다. 마이룸 메뉴와 겹치므로 **구현 가안은 로그인 자리를 「로그아웃」만** 두고, 확정은 열린 질문으로 남긴다.
- 갤러리: 내 전시(G-01), 전시 등록(G-02), 고객 리포트(G-05, 계약 갤러리만), 로그아웃.
- 운영자: 갤러리 계정(A-01), 전시 확인(A-02), 작품 DB(A-05), 관람객 분석(A-06), 전시 리포트(A-07), 오류·이력(A-08), 로그아웃. A-09는 넣지 않는다.

**`hero-light`** — 큰 사진 또는 여백이 충분한 타이틀 밴드. C-11 상단, 전시·작가 소개에 쓴다.

**`hero-dark`** — 풀블리드 또는 네이비 딥 위 짧은 제목. 리플릿 표지, 마이룸 입구, C-11의 마이룸·리플릿 소개 섹션.

**`card-exhibition` / `card-artwork` / `card-artist` / `card-gallery`** — 사진이 먼저, 아래 또는 옆에 제목·메타. 모서리 `{rounded.lg}`, 외곽은 헤어라인만. 계약/미계약 구분은 노란 작은 배지(글자는 네이비) 또는 네이비 텍스트 라벨. 가격이 있으면 빨강 텍스트(라이트 면 위에서만). 없는 소개·가격은 만들지 않고 해당 줄을 생략한다.

**`leaflet-page`** — 다크 캔버스. 계약 리플릿(V-09)은 한 화면 안 세 단락: 티켓형 방문 카드, 본 순서 관람 노트, 다음 전시 추천. 기록용(V-14)은 추천 없이 방문 날짜·업로드 사진(선택, ‘업로드 사진’ 라벨)·한줄평. 추천·인식 결과에는 `모의` 배지.

**`bottom-sheet`** — C-05. 아래에서 올라오는 시트, 다크 엘레베이티드 면. 짧은 작품·작가 설명, 담기, 자세히 보기(C-03). 닫으면 관람 화면으로 복귀.

**`cart-row`** — 라이트. 왼쪽 썸네일, 제목·작가, 오른쪽 가격(빨강, 있을 때만). 실결제 없음 문구를 하단 고지하고, 결제 버튼이 있으면 `모의` 배지를 단다.

**`form-field` / `form-field-on-dark`** — 높이 최소 44px, 모서리 `{rounded.md}`. 포커스 링은 라이트에서 네이비 2px, 다크에서 노랑 2px.

**`consent-modal`** — V-02는 다크 화면 위의 라이트 또는 다크 패널(화면이 다크이므로 시트의 면은 `{colors.surface-dark}`, 글자 흰색). 거부하면 V-01로 돌아가고 리플릿을 만들지 않는다. V-03 하단에는 **「1주일 동안 보지 않기」** 체크박스가 있다. 회원은 계정, 비회원은 브라우저 저장소. 사진첩 업로드 동의는 첫 업로드 때 따로 한 번 받는다.

**`screen-id-chip`** — 모든 화면 좌상단 또는 헤더 아래 고정. 예: `V-09`. 제품 UI보다 작게, 파치먼트(다크에서는 엘레베이티드) 면 + 뮤트 글자. 시연 대조용이므로 숨기지 않는다.

**`mock-badge`** — 노란 필, 네이비 글자, 라벨은 `모의`. 작품 인식(VIS-010), 리플릿 추천, 마이룸 추천, 자동 배치 초안, 자료 자동 DB화, 리포트·분석, 공유 발급 등 모의 결과에 붙인다. 확인되지 않은 기능을 구현된 것처럼 보이지 않게 하는 최소 장치다.

## Responsive Behavior

| 이름 | 너비 | 주요 변화 |
|---|---|---|
| Mobile | < 720px | 기본 기준. 헤더 햄버거, 카드 1열, 히어로 56→36px, 바텀시트 전체 폭, CTA 높이 48px |
| Tablet | 720–1024px | 카드 2열, 헤더는 중요 메뉴만 |
| Desktop | 1024–1440px | 카드 3열, 전체 헤더 메뉴, 리플릿은 중앙 컬럼 유지 |
| Wide | > 1440px | 콘텐츠 폭을 1440px에서 끊고 여백은 양쪽에 |

### Touch Targets

기본 컨트롤은 44×44px 이상, 모바일 주요 CTA는 48px 높이.

### Collapsing Strategy

- 헤더는 720px 아래에서 햄버거. 로고와 화면 ID 칩은 남긴다.
- 그리드는 3→2→1. 행을 어색하게 재배치하지 않는다.
- C-11 다크 밴드(마이룸·리플릿 소개)는 스크롤 섹션으로 유지하고, 아코디언으로 접지 않는다.

## Known Gaps

- RestArt 로고·워드마크 최종안이 이 파일에 없다. 프로토타입은 글자 워드마크 `RestArt`로 둔다.
- 브랜드 색 세 개의 추가 단계(호버 전용 네이비 등)는 필요 최소만 계산해 넣었다. 그 밖의 임의 색을 만들지 않는다.
- 리플릿 슬롯 레이아웃·테마 장식은 기능정의서·와이어프레임 범위라 여기 적지 않는다. 테마는 모의 데이터로만 바꾼다.
- NFR(응답 시간, 용량, 지원 브라우저 등) 중 Review 항목은 시각 규칙이 아니다. 개발 기준으로 쓰지 않는다.
- 이 파일은 Apple·Runway의 공식 가이드가 아니고, 두 사이트의 시각 정체성을 복제하지 않는다.
