---
version: v2-alpha
name: RestArt-prototype-design
description: >
  RestArt 프로토타입의 시각 언어 v2. 작품 사진이 주인공이고 UI는 뒤로 물러난다.
  둘러보기·소개는 흰 캔버스와 파치먼트 밴드가 번갈아 이어지는 라이트 모드, 리플릿·마이룸은
  네이비 캔버스의 다크 모드, 갤러리·운영자는 히어로 없는 유틸리티 모드다. 화면은 같은 카드를
  세로로 쌓지 않고 페이지 제목 블록 → 가로 셸프 → 풀블리드 타일 → 유틸리티 카드의 리듬으로
  만든다. 브랜드 색은 네이비 #0D2E52, 노랑 #F6CD52, 빨강 #B8312B 세 가지뿐이고, 서체는
  Pretendard 하나다. 모바일은 별도 타입 스케일을 쓴다. 공식 브랜드 가이드가 아니라 시연용 기준이다.

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
  scrim: "rgba(9, 32, 57, 0.56)"

typography:
  # ── 데스크톱(≥1024px) 기준. 태블릿(720–1023px)도 이 값을 쓴다.
  hero-display:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: -0.01em
  display-lg:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  display-md:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  section-title:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  lead:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  tagline:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  card-title:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 19px
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
  eyebrow:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
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
    lineHeight: 1.45
    letterSpacing: 0
  button:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  button-large:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  button-utility:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  nav-link:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  chip:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  price:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  fine-print:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  # ── 모바일(<720px) 전용 스케일. 같은 이름 + "-mobile". 모바일에서는 데스크톱 토큰 대신 이것을 쓴다.
  hero-display-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: -0.01em
  display-md-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.28
    letterSpacing: 0
  section-title-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  lead-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  tagline-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 19px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  card-title-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  eyebrow-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  caption-mobile:
    fontFamily: "Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
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
  section-mobile: 56px
  section: 80px
  section-lg: 96px
  gutter-mobile: 20px
  gutter-tablet: 32px
  gutter-desktop: 48px
  card-gap-mobile: 12px
  card-gap: 20px
  card-padding-mobile: 20px
  card-padding: 24px
  title-to-content: 16px
  title-to-content-lg: 24px
  image-clearance: 40px

components:
  # ── Buttons
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    height: 48px
  button-primary-active:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-primary-focus:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-primary-on-dark:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    height: 48px
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 11px 23px
    height: 48px
  button-secondary-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 11px 23px
    height: 48px
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    height: 48px
  button-utility:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 8px 14px
    height: 36px
  button-icon-circular:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 44px
  button-icon-circular-on-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body-strong}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.accent}"
    typography: "{typography.body-strong}"

  # ── Navigation
  global-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 52px
    heightMobile: 48px
    padding: 0 48px
    paddingMobile: 0 20px
    gap: 28px
  global-header-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.nav-link}"
    height: 52px
    heightMobile: 48px
    padding: 0 48px
    paddingMobile: 0 20px
    gap: 28px
  sub-nav-frosted:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.tagline}"
    typographyMobile: "{typography.card-title-mobile}"
    height: 52px
    heightMobile: 48px
    padding: 0 48px
    paddingMobile: 0 20px
  filter-chip-row:
    backgroundColor: transparent
    height: 36px
    padding: 0 48px
    paddingMobile: 0 20px
    gap: 8px
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
    height: 36px
  filter-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
    height: 36px
  filter-chip-on-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
    height: 36px
  filter-chip-on-dark-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: 8px 16px
    height: 36px

  # ── Page structure (라이트)
  page-headline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.hero-display}"
    typographyMobile: "{typography.hero-display-mobile}"
    taglineTypography: "{typography.lead}"
    taglineTypographyMobile: "{typography.lead-mobile}"
    padding: 64px 48px 40px
    paddingMobile: 32px 20px 24px
    gap: 12px
    maxWidth: 980px
  page-headline-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.hero-display}"
    typographyMobile: "{typography.hero-display-mobile}"
    taglineTypography: "{typography.lead}"
    taglineTypographyMobile: "{typography.lead-mobile}"
    padding: 64px 48px 40px
    paddingMobile: 32px 20px 24px
    gap: 12px
    maxWidth: 980px
  section-header:
    textColor: "{colors.ink}"
    typography: "{typography.section-title}"
    typographyMobile: "{typography.section-title-mobile}"
    linkTypography: "{typography.body-strong}"
    padding: 0 48px
    paddingMobile: 0 20px
    marginBottom: 24px
    marginBottomMobile: 16px
  shelf-row:
    backgroundColor: transparent
    padding: 0 48px
    paddingMobile: 0 20px
    gap: 20px
    gapMobile: 12px
    scrollSnap: x mandatory
    snapAlign: start
    scrollPadding: 48px
    scrollPaddingMobile: 20px
    sectionSpacing: 80px
    sectionSpacingMobile: 56px
  shelf-card-artwork:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    typographyMobile: "{typography.card-title-mobile}"
    rounded: "{rounded.lg}"
    width: 300px
    widthTablet: 280px
    widthMobile: 72vw
    maxWidthMobile: 300px
    imageAspectRatio: 4/5
    imageBackground: "{colors.canvas-parchment}"
    padding: 0
    captionPadding: 16px 4px 0
    gap: 4px
  shelf-card-exhibition:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    typographyMobile: "{typography.card-title-mobile}"
    rounded: "{rounded.lg}"
    width: 340px
    widthTablet: 320px
    widthMobile: 80vw
    maxWidthMobile: 340px
    imageAspectRatio: 3/4
    imageBackground: "{colors.canvas-parchment}"
    padding: 0
    captionPadding: 16px 4px 0
    gap: 4px
  shelf-card-artist:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.card-title}"
    typographyMobile: "{typography.card-title-mobile}"
    rounded: "{rounded.lg}"
    width: 220px
    widthMobile: 38vw
    maxWidthMobile: 180px
    imageAspectRatio: 4/5
    imageBackground: "{colors.canvas-parchment}"
    padding: 0
    captionPadding: 12px 4px 0
    gap: 2px
  feature-card:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    typographyMobile: "{typography.display-md-mobile}"
    rounded: "{rounded.lg}"
    width: 100%
    maxWidth: 1344px
    imageAspectRatio: 16/9
    imageAspectRatioMobile: 4/5
    padding: 32px
    paddingMobile: 24px
    gap: 12px
  utility-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: 24px
    paddingMobile: 20px
    gap: 12px
    minHeight: 160px
  artwork-tile-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    typographyMobile: "{typography.display-lg-mobile}"
    taglineTypography: "{typography.lead}"
    taglineTypographyMobile: "{typography.lead-mobile}"
    rounded: "{rounded.none}"
    padding: 80px 48px
    paddingMobile: 56px 20px
    gap: 12px
    ctaGap: 12px
    imageMarginTop: 40px
    imageMaxHeight: 64vh
  artwork-tile-parchment:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    typographyMobile: "{typography.display-lg-mobile}"
    rounded: "{rounded.none}"
    padding: 80px 48px
    paddingMobile: 56px 20px
    gap: 12px
    imageMarginTop: 40px
    imageMaxHeight: 64vh
  artwork-tile-dark:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.display-lg}"
    typographyMobile: "{typography.display-lg-mobile}"
    rounded: "{rounded.none}"
    padding: 80px 48px
    paddingMobile: 56px 20px
    gap: 12px
    imageMarginTop: 40px
    imageMaxHeight: 64vh
  artwork-tile-dark-2:
    backgroundColor: "{colors.canvas-dark-deep}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.display-lg}"
    typographyMobile: "{typography.display-lg-mobile}"
    rounded: "{rounded.none}"
    padding: 80px 48px
    paddingMobile: 56px 20px
    gap: 12px
  artwork-grid:
    columns: 4
    columnsTablet: 3
    columnsMobile: 2
    gap: 20px
    gapMobile: 12px
    rowGap: 32px
    rowGapMobile: 24px
    imageAspectRatio: 4/5
    imageBackground: "{colors.canvas-parchment}"
    captionTypography: "{typography.card-title}"
    captionTypographyMobile: "{typography.caption-strong}"

  # ── Utility mode (G-*, A-*)
  list-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: 64px
    padding: 12px 0
    gap: 12px
    thumbnailSize: 48px
    thumbnailRounded: "{rounded.sm}"
  list-row-on-dark:
    backgroundColor: transparent
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: 64px
    padding: 12px 0
    gap: 12px
    thumbnailSize: 48px
    thumbnailRounded: "{rounded.sm}"
  utility-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 24px
    paddingMobile: 16px
    gap: 16px
  status-badge:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
    height: 24px
  status-badge-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.caption-strong}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
    height: 24px

  # ── Leaflet & My Room (다크)
  leaflet-cover:
    backgroundColor: "{colors.canvas-dark-deep}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.hero-display-mobile}"
    rounded: "{rounded.none}"
    width: 100%
    maxWidth: 480px
    minHeight: 100svh
    imageAspectRatio: 3/4
    padding: 24px 20px 40px
    gap: 12px
  leaflet-artwork-full:
    backgroundColor: "{colors.canvas-dark-deep}"
    rounded: "{rounded.none}"
    width: 100%
    maxWidth: 480px
    imagePadding: 24px
    imageMaxHeight: 72svh
    objectFit: contain
  leaflet-caption:
    backgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.card-title-mobile}"
    metaTypography: "{typography.caption-mobile}"
    metaColor: "{colors.mute-on-dark}"
    padding: 16px 20px 32px
    gap: 4px
  leaflet-ticket-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.tagline-mobile}"
    rounded: "{rounded.lg}"
    padding: 20px
    gap: 8px
    margin: 0 20px
  leaflet-note-block:
    backgroundColor: transparent
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body-mobile}"
    rounded: "{rounded.none}"
    padding: 24px 20px
    gap: 12px
    dividerColor: "{colors.hairline-on-dark}"
  archive-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.card-title-mobile}"
    rounded: "{rounded.lg}"
    imageAspectRatio: 3/4
    columnsMobile: 2
    columns: 4
    gap: 12px
    captionPadding: 12px 12px 16px

  # ── Overlays & bars
  bottom-sheet:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body-mobile}"
    rounded: "{rounded.xl}"
    padding: 12px 20px 32px
    maxHeight: 85svh
    handleSize: 36px 4px
    gap: 16px
  bottom-sheet-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-mobile}"
    rounded: "{rounded.xl}"
    padding: 12px 20px 32px
    maxHeight: 85svh
    handleSize: 36px 4px
    gap: 16px
  sticky-cta-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    height: 72px
    padding: 12px 20px
    gap: 12px
  sticky-cta-bar-dark:
    backgroundColor: "{colors.canvas-dark-deep}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body-strong}"
    height: 72px
    padding: 12px 20px
    gap: 12px

  # ── Forms & commerce
  search-input:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 48px
  form-field:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 48px
  form-field-on-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 48px
  consent-sheet:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body-mobile}"
    rounded: "{rounded.xl}"
    padding: 24px 20px 32px
    gap: 16px
  cart-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 16px 0
    gap: 16px
    thumbnailSize: 88px
    thumbnailRounded: "{rounded.sm}"

  # ── Images (사진 프레임 규칙)
  image-artwork:
    backgroundColor: "{colors.canvas-parchment}"
    backgroundColorOnDark: "{colors.canvas-dark-deep}"
    aspectRatio: native
    frameAspectRatio: 4/5
    objectFit: contain
    framePadding: 8%
  image-artist-portrait:
    backgroundColor: "{colors.canvas-parchment}"
    aspectRatio: 4/5
    objectFit: cover
    objectPosition: center 30%
  image-artist-avatar:
    backgroundColor: "{colors.canvas-parchment}"
    aspectRatio: 1/1
    size: 48px
    rounded: "{rounded.full}"
    objectFit: cover
  image-exhibition-poster:
    backgroundColor: "{colors.canvas-parchment}"
    aspectRatio: 3/4
    objectFit: cover
  image-exhibition-keyvisual:
    backgroundColor: "{colors.canvas-parchment}"
    aspectRatio: 16/9
    aspectRatioMobile: 4/5
    objectFit: cover
  image-leaflet-cover:
    backgroundColor: "{colors.canvas-dark-deep}"
    aspectRatio: 3/4
    objectFit: cover

  footer:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    padding: 48px 48px 64px
    paddingMobile: 40px 20px 48px
    gap: 24px
---

## Overview

RestArt는 현대미술 작가·작품·갤러리·전시를 잇는 플랫폼이고, 이 파일은 시연용 Next.js 웹 프로토타입의 시각 언어 v2다. v1에서 드러난 문제(모든 화면이 같은 카드를 세로로 쌓기만 함, 모바일 글자 위계가 평평함, 모바일 섹션 간격이 사라짐, 사진 대신 도형)를 **토큰과 컴포넌트 수치**로 고치는 것이 목적이다. Cursor에서 고칠 때는 이 파일의 `{component.x}` 키를 이름으로 불러 한 번에 하나씩 바꾼다.

참고한 것은 getdesign.md의 Apple 분석 파일의 **형식과 구조**(사진이 앞서는 풀블리드 타일, 면 색 교차가 곧 구분선, 18px 모서리 유틸리티 카드, 얇은 내비 + 서브 내비, 그림자는 사진에만)다. Apple의 색·서체·로고는 쓰지 않는다. 가로 셸프(`shelf-row`)처럼 Apple 분석 파일에 없는 컴포넌트는 RestArt 쪽에서 새로 정한 규칙이며, Apple 수치라고 주장하지 않는다. 이 파일의 어떤 값도 apple.com에서 직접 잰 값이 아니다.

화면은 세 가지 모드로 나눈다.

- **라이트 모드(둘러보기·소개):** 흰 캔버스 `{colors.canvas}`와 파치먼트 `{colors.canvas-parchment}` 밴드가 번갈아 이어지고, 작품·전시 사진이 주인공이다. 링크와 기본 CTA만 네이비 `{colors.primary}`다.
- **다크 모드(체험):** 바닥은 네이비 `{colors.canvas-dark}`. 노랑 `{colors.accent}`이 다크 CTA·선택 상태의 유일한 하이라이트다. 리플릿과 마이룸은 도록을 한 장씩 넘기는 느낌으로, 작품 한 점이 화면을 거의 다 차지한다.
- **유틸리티 모드(갤러리·운영자):** 라이트 토큰을 쓰되 히어로가 없고, `{component.list-row}`·`{component.utility-panel}` 중심으로 밀도를 높인다.

**페이지 리듬(라이트 기본형):** `{component.global-header}` → `{component.page-headline}` → `{component.feature-card}` 1개 → `{component.shelf-row}` 2~3줄 → 풀블리드 `{component.artwork-tile-*}` 1~2개 → `{component.footer}`. 같은 컴포넌트를 세 번 넘게 연달아 쌓지 않는다.

**Key Characteristics:**
- 사진 우선. 작품은 자르지 않고(`object-fit: contain`) 파치먼트·네이비 딥 바탕 위에 둔다.
- 브랜드 색은 세 개뿐이다. 네이비는 라이트 CTA·링크와 다크 바탕, 노랑은 다크 CTA·선택 상태, 빨강은 장바구니·가격·오류·삭제에만 쓴다.
- 노란 면 위 글자는 반드시 네이비 `{colors.on-accent}`다(흰 글자는 1.52:1로 미달).
- 다크 모드에서 빨강 `{colors.danger}`를 네이비 위 텍스트로 쓰지 않는다(2.30:1, 미달).
- 서체는 Pretendard 하나. 모바일은 별도 타입 스케일(`*-mobile`)을 쓴다.
- 가로 셸프는 다음 카드가 화면 오른쪽에 걸쳐 보이게(peek) 해서 "더 있다"를 글 없이 알린다.
- 그림자는 작품 이미지에만. 카드·버튼·텍스트에는 없다.
- 모바일 섹션 간격 56px, 좌우 여백 20px, 카드 안쪽 여백 20px를 모든 라이트 화면에 똑같이 쓴다.

### 부록 A. 화면 → 모드 (참고용, 시각 규칙 아님)

| 화면 ID | 모드 |
|---|---|
| C-11 메인 홈 | 라이트. 마이룸 설명·리플릿 설명 섹션만 다크 타일 |
| C-01~C-04, C-06~C-10, V-01, V-12 | 라이트 |
| V-02~V-06, V-08~V-11, V-13, V-14, C-05 | 다크 |
| R-01~R-07 | 다크 |
| G-01~G-05, A-01~A-08 | 유틸리티 |
| V-07, A-09 | 시연 제외, 라우트 없음 |

리플릿(다크)에서 C-03·C-04로 나가면 라이트로 바뀌고, 뒤로 가면 다크로 돌아온다. 그라데이션으로 섞지 않고 화면 단위로 바꾼다.

### 부록 B. 주요 화면 레이아웃 레시피 (가안)

C-11 섹션 순서는 CURSOR_BRIEF의 가안(Hero → 계약 전시 소개 → 마이룸 설명 → 리플릿 설명 → 갤러리 소개 → 작가 소개)을 그대로 두고, 각 섹션에 쓸 컴포넌트만 정한다.

| 화면 | 위에서 아래 순서 |
|---|---|
| C-11 | `page-headline` → `feature-card`(진행 중 계약 전시 1개) → `shelf-row` + `shelf-card-exhibition` → `artwork-tile-dark`(마이룸) → `artwork-tile-dark-2`(리플릿) → `shelf-row` + `utility-card`(갤러리) → `shelf-row` + `shelf-card-artist` → `footer` |
| V-12 | `page-headline`(제목만) → `search-input` → `filter-chip-row`(전체·계약·미계약) → `artwork-grid` 대신 전시용 2열 그리드(`image-exhibition-poster`, 간격은 `artwork-grid`와 동일) → 하단 `text-link`(찾는 전시 없음 → V-13) |
| C-06 / C-08 / C-09 | `page-headline`(제목만) → `filter-chip-row`(필요할 때만) → `artwork-grid` |
| C-03 | `image-artwork` 전체 폭(파치먼트 바탕, 이미지 그림자) → 제목·작가·가격 블록 → `sticky-cta-bar`(담기) |
| C-07 / C-10 / V-01 | `image-artist-portrait` 또는 `image-exhibition-keyvisual` → `page-headline` → `shelf-row`(작품) |
| V-09 / R-03 | `leaflet-cover` → `leaflet-ticket-card` → (`leaflet-artwork-full` + `leaflet-caption`) × 본 순서 → `leaflet-note-block` → `shelf-row`(다음 전시, 다크) → `sticky-cta-bar-dark`(저장) |
| V-14 | `leaflet-cover` → `form-field-on-dark`(방문 날짜) → 사진 영역 → `leaflet-note-block`(한줄평) → `sticky-cta-bar-dark` |
| C-05 | `bottom-sheet` |
| R-02 | `page-headline-dark` → `filter-chip-row`(다크 칩) → `archive-card` 그리드 |
| G-* / A-* | `global-header` → 제목(`section-title`) → `filter-chip-row` → `list-row` 목록 또는 `utility-panel` |

## Colors

> **유지 항목:** v1의 브랜드 색, 중성 사다리, WCAG 계산표를 그대로 둔다. v2에서 새 색은 없다. `{colors.scrim}`만 추가했는데, 이는 `{colors.primary-deep}` #092039를 56% 불투명도로 쓴 것으로 바텀시트 뒤 배경 어둡게 하기 전용이다.

계산 방법은 WCAG 2.1 상대 휘도 공식이다. 대비율 `(L1 + 0.05) / (L2 + 0.05)`. 기준은 본문 AA 4.5:1, 큰 텍스트(18pt 이상 또는 14pt 이상 볼드) AA 3.0:1, AAA는 본문 7:1·큰 텍스트 4.5:1.

### Brand & Accent

- **네이비** (`{colors.primary}` — #0D2E52, L=0.0265): 라이트 모드의 기본 CTA·링크·선택된 필터 칩, 다크 모드의 기본 캔버스. 흰 면 위 13.73:1 (AAA).
- **네이비 딥** (`{colors.primary-deep}` / `{colors.canvas-dark-deep}` — #092039, L=0.0139): 라이트 CTA 누름 상태, 다크 히어로·리플릿 작품 바탕·하단 고정 바. #0D2E52에 검정 30%. 흰 글자 16.44:1, 노랑 10.78:1.
- **네이비 엘레베이티드** (`{colors.primary-elevated}` / `{colors.surface-dark}` — #254263, L=0.0519): 다크 카드·바텀시트·입력 면. #0D2E52에 흰 10%. 흰 글자 10.30:1, 노랑 6.76:1, `#CCCCCC` 6.42:1.
- **노랑** (`{colors.accent}` — #F6CD52, L=0.6386): 다크 CTA 면, 다크 선택 칩, 다크 링크, 상태 배지. 네이비 위 9.00:1. **흰 면 위 텍스트 색으로 쓰지 않는다**(1.52:1).
- **빨강** (`{colors.danger}` — #B8312B, L=0.1256): 가격, 장바구니 강조, 오류, 삭제. 흰 면 5.98:1, 파치먼트 5.49:1.

### Surface

- **캔버스** (`{colors.canvas}` — #FFFFFF): 라이트 기본 바닥, 셸프 카드·유틸리티 카드 면.
- **파치먼트** (`{colors.canvas-parchment}` — #F5F5F7): 교차 밴드, 피처 카드, 푸터, **모든 라이트 이미지의 자리표시 바탕**.
- **펄** (`{colors.surface-pearl}` — #FAFAFC): 입력 면.
- **다크 캔버스** (`{colors.canvas-dark}` — #0D2E52), **다크 딥** (`{colors.canvas-dark-deep}` — #092039), **다크 엘레베이티드** (`{colors.surface-dark}` — #254263): 다크 모드의 세 단계 면. 깊이는 이 세 면의 전환으로 만든다.

### Text

- **잉크** (`{colors.ink}` — #1D1D1F): 라이트 기본 글자. 흰 면 16.83:1, 파치먼트 15.46:1.
- **잉크 뮤트** (`{colors.ink-muted}` — #333333): 보조 제목, 푸터 글자. 흰 면 12.63:1.
- **뮤트** (`{colors.mute}` — #707070): 캡션·메타. 흰 면 4.95:1, 파치먼트 4.55:1. Apple 분석의 `#7A7A7A`는 흰 면 4.29:1이라 쓰지 않는다.
- **다크 본문** (`{colors.ink-on-dark}` — #FFFFFF): 네이비 위 13.73:1.
- **다크 뮤트** (`{colors.mute-on-dark}` — #CCCCCC): 네이비 위 8.55:1, 엘레베이티드 위 6.42:1.
- **다크 오류** (`{colors.error-on-dark}` — #D4837F): 네이비 위 4.81:1. 브랜드 빨강에 흰 40%를 섞은 지원 토큰(가안). 기본은 흰 글자 빨간 배지.

### Hairlines & Borders

- **헤어라인** (`{colors.hairline}` — #E0E0E0): 유틸리티 카드·필터 칩·입력 외곽 1px, 리스트 행 구분선.
- **디바이더** (`{colors.divider-soft}` — #F0F0F0): 아주 옅은 구분선. 글자 색 금지(흰 면 1.32:1).
- **다크 헤어라인** (`{colors.hairline-on-dark}` — #385371): 다크 구분선 전용.

### 글자/배경 짝과 계산 대비율

| 짝 | 비율 | 판정 | 사용 |
|---|---|---|---|
| `#1D1D1F` on `#FFFFFF` | 16.83:1 | AAA | 라이트 본문 |
| `#1D1D1F` on `#F5F5F7` | 15.46:1 | AAA | 파치먼트 본문 |
| `#0D2E52` on `#FFFFFF` | 13.73:1 | AAA | 링크, 네이비 텍스트 |
| `#FFFFFF` on `#0D2E52` | 13.73:1 | AAA | 라이트 CTA 글자, 다크 본문 |
| `#F6CD52` on `#0D2E52` | 9.00:1 | AAA | 다크 링크·하이라이트 텍스트 |
| `#0D2E52` on `#F6CD52` | 9.00:1 | AAA | **노란 CTA·칩·배지의 글자** |
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
| `#D4837F` on `#0D2E52` | 4.81:1 | AA | 다크 오류 텍스트(가안) |

### 미달 — 쓰지 말 것

| 짝 | 비율 | 판정 | 이유 |
|---|---|---|---|
| `#FFFFFF` on `#F6CD52` | 1.52:1 | 미달 | 노란 버튼·칩에 흰 글자 금지 |
| `#F6CD52` on `#FFFFFF` | 1.52:1 | 미달 | 노란 글자를 흰 배경에 금지. 노랑은 면·아이콘 채움만 |
| `#F6CD52` on `#F5F5F7` | 1.40:1 | 미달 | 위와 같음 |
| `#B8312B` on `#0D2E52` | 2.30:1 | 미달 | 다크에서 빨간 텍스트 금지 |
| `#B8312B` on `#092039` | 2.87:1 | 미달 | 위와 같음 |
| `#B8312B` on `#F6CD52` | 3.92:1 | 본문 미달 | 노란 면 위 빨간 글자 금지 |
| `#7A7A7A` on `#FFFFFF` | 4.29:1 | 본문 미달 | `{colors.mute}` #707070 사용 |
| `#939393` on `#0D2E52` | 4.47:1 | 본문 미달 | 다크 캡션 금지 |
| `#676F7B` on `#0D2E52` | 2.70:1 | 미달 | 다크 본문·캡션 금지 |

### Brand Gradient

**장식용 그라데이션은 없다.** 분위기는 작품 사진이 만든다. 사진 위에 글자를 올려야 할 때도 그라데이션 오버레이 대신 글자를 사진 아래로 내린다(`{component.feature-card}` 참고).

## Typography

### Font Family

- **전 레벨:** `Pretendard, Pretendard Variable, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif`. Apple의 SF Pro는 쓰지 않는다.
- **웨이트 사다리:** 400(본문) / 500(내비만) / 600(카드 제목·강조·버튼) / 700(디스플레이·섹션 제목). Apple 분석의 300은 한글 가독성 때문에 쓰지 않는다.
- **숫자:** 가격·날짜·통계에는 `font-variant-numeric: tabular-nums`를 켠다.

### Hierarchy — 데스크톱·태블릿(≥720px)

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 56px | 700 | 1.18 | -0.01em | 페이지 제목, 리플릿 표지 제목(데스크톱) |
| `{typography.display-lg}` | 40px | 700 | 1.2 | -0.01em | 풀블리드 타일 제목 |
| `{typography.display-md}` | 32px | 600 | 1.25 | 0 | 피처 카드 제목 |
| `{typography.section-title}` | 28px | 700 | 1.3 | 0 | 셸프·섹션 제목 |
| `{typography.lead}` | 24px | 400 | 1.45 | 0 | 페이지·타일 한 줄 소개 |
| `{typography.tagline}` | 21px | 600 | 1.4 | 0 | 서브 내비 이름, 티켓 카드 전시명 |
| `{typography.card-title}` | 19px | 600 | 1.35 | 0 | 셸프 카드 제목 |
| `{typography.body}` | 17px | 400 | 1.6 | 0 | 본문 |
| `{typography.body-strong}` | 17px | 600 | 1.5 | 0 | 강조, 텍스트 링크 |
| `{typography.price}` | 17px | 700 | 1.3 | 0 | 가격(빨강, 라이트 면만) |
| `{typography.button-large}` | 18px | 600 | 1.2 | 0 | 하단 고정 바 CTA |
| `{typography.button}` | 16px | 600 | 1.2 | 0 | 기본 버튼 |
| `{typography.eyebrow}` | 15px | 600 | 1.4 | 0 | 제목 위 분류 표시(전시 상태·기간 등) |
| `{typography.caption}` | 14px | 400 | 1.5 | 0 | 메타, 작가명 |
| `{typography.caption-strong}` | 14px | 600 | 1.45 | 0 | 강조 캡션, 상태 배지 |
| `{typography.chip}` | 14px | 600 | 1.2 | 0 | 필터 칩 |
| `{typography.nav-link}` | 14px | 500 | 1.2 | 0 | 헤더 메뉴 |
| `{typography.button-utility}` | 14px | 600 | 1.3 | 0 | 유틸리티 버튼 |
| `{typography.fine-print}` | 12px | 400 | 1.5 | 0 | 푸터 법적 고지만 |

### Hierarchy — 모바일(<720px)

| Token | Size | Weight | Line Height | Letter Spacing | 이전 단계와 차이 |
|---|---|---|---|---|---|
| `{typography.hero-display-mobile}` | 40px | 700 | 1.2 | -0.01em | — |
| `{typography.display-lg-mobile}` | 32px | 700 | 1.22 | -0.01em | −8px |
| `{typography.display-md-mobile}` | 28px | 600 | 1.28 | 0 | −4px |
| `{typography.section-title-mobile}` | 24px | 700 | 1.3 | 0 | −4px |
| `{typography.lead-mobile}` | 19px | 400 | 1.5 | 0 | −5px |
| `{typography.tagline-mobile}` | 19px | 600 | 1.4 | 0 | lead와 같은 크기, 웨이트로 구분 |
| `{typography.card-title-mobile}` | 17px | 600 | 1.4 | 0 | −2px |
| `{typography.body-mobile}` | 16px | 400 | 1.6 | 0 | −1px |
| `{typography.eyebrow-mobile}` | 14px | 600 | 1.4 | 0 | — |
| `{typography.caption-mobile}` | 13px | 400 | 1.5 | 0 | −3px |

버튼(16px), 칩(14px), 가격(17px)은 모바일에서도 같은 값을 쓴다. 12px는 모바일 제품 화면에 쓰지 않는다(푸터 법적 고지 제외).

### Principles

- **모바일 위계는 크기 차이로 만든다.** v1은 히어로 36px, 섹션 제목·본문 차이가 작아 화면이 평평했다. v2는 40 → 32 → 24 → 17 → 16 → 13으로, 단계마다 최소 4px(제목 영역) 또는 웨이트 차이를 둔다. 한 화면에 쓰는 크기는 최대 4단계(예: 히어로 40, 섹션 24, 카드 17, 캡션 13)로 제한한다.
- **눈썹(eyebrow)은 12px에서 14~15px / 600으로 올린다.** 12px 한글은 모바일에서 읽히지 않았다. 색은 라이트 `{colors.mute}`, 다크 `{colors.mute-on-dark}`. 노란 글자 금지.
- **디스플레이 줄간격은 1.18~1.3, 본문은 1.6.** Apple 분석의 디스플레이 1.07~1.19는 라틴 문자 기준이다. 한글은 받침과 겹모음 때문에 글자 높이가 꽉 차서, 1.1 아래로 내리면 두 줄 제목의 위아래 글자가 닿아 보인다. 그래서 히어로 1.18(모바일 1.2)부터 시작한다. 본문은 v1의 1.6을 유지한다.
- **자간: 본문·캡션·버튼은 0. 40px 이상 디스플레이만 −0.01em(가안).** 이유: 한글은 정사각형 글자라 라틴보다 자간을 줄였을 때 글자끼리 빨리 붙는다. 그래서 17px 이하에는 절대 줄이지 않는다. 다만 40~56px에서는 글자 사이 기본 여백이 눈에 띄게 벌어져 보여 제목 덩어리가 흩어지므로, 1% 정도(56px에서 약 −0.56px)만 줄여 묶는다. 시연에서 어색하면 0으로 되돌린다. Apple 분석의 −0.28~−0.374px를 그대로 옮긴 값이 아니다.
- **디스플레이 웨이트 700(가안).** Apple 분석은 600이지만, v1 화면 점검에서 600 제목과 400 본문의 대비가 약해 위계가 평평해 보였으므로 제목 계열만 700으로 올린다. 피처 카드 제목(`display-md`)과 카드 제목은 600을 유지해 단계를 나눈다.
- **본문은 데스크톱 17px, 모바일 16px.** Apple 분석은 17px를 고집하지만, 한글은 같은 px에서 라틴보다 꽉 차 보여 모바일 좁은 폭에서는 16px가 한 줄 글자 수(약 20~22자)를 확보하기 좋다. 데스크톱은 17px.

### Note on Font Substitutes

Pretendard를 못 불러오면 `-apple-system`(iOS/macOS에서 Apple SD Gothic Neo로 대체), `Segoe UI`, `system-ui` 순으로 떨어진다. 폴백 서체는 글자 폭이 달라 셸프 카드 제목이 두 줄로 넘칠 수 있으니, 카드 제목은 `line-clamp: 2`로 자른다.

## Layout

### Spacing System

- **기본 단위:** 8px. 4px는 글자·아이콘 미세 조정에만.
- **토큰:** `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 24 · `{spacing.xl}` 32 · `{spacing.xxl}` 48 · `{spacing.section-mobile}` 56 · `{spacing.section}` 80 · `{spacing.section-lg}` 96.
- **페이지 좌우 여백:** 모바일 `{spacing.gutter-mobile}` 20px · 태블릿 `{spacing.gutter-tablet}` 32px · 데스크톱 `{spacing.gutter-desktop}` 48px. 헤더·제목·셸프 시작점·리스트가 모두 이 선에 맞춰 시작한다. 예외는 풀블리드 이미지와 셸프의 스크롤 영역(오른쪽 끝까지 흘러 나감)뿐이다.
- **섹션 간격:** 같은 바탕 위에서 섹션과 섹션 사이는 모바일 `{spacing.section-mobile}` 56px, 데스크톱 `{spacing.section}` 80px. 바탕 색이 바뀌는 풀블리드 타일끼리는 간격 0(면 색 전환이 구분선).
- **제목 → 내용:** 섹션 제목과 그 아래 셸프·그리드 사이는 모바일 `{spacing.title-to-content}` 16px, 데스크톱 `{spacing.title-to-content-lg}` 24px.
- **카드 간격:** 모바일 `{spacing.card-gap-mobile}` 12px, 데스크톱 `{spacing.card-gap}` 20px. 셸프와 그리드가 같은 값을 쓴다.
- **카드 안쪽 여백:** 모바일 `{spacing.card-padding-mobile}` 20px, 데스크톱 `{spacing.card-padding}` 24px. 이미지가 위에 붙는 카드(셸프 카드)는 이미지에는 여백 없이, 캡션에만 여백을 준다.
- **이미지 여유:** 작품 이미지와 가장 가까운 글자·버튼 사이는 최소 `{spacing.image-clearance}` 40px(풀블리드 타일 기준). 셸프 카드 캡션은 예외로 16px.
- **유틸리티 모드:** 섹션 간격 `{spacing.xl}` 32px(모바일 24px), 리스트 행 높이 64px.

### Grid & Container

- **최대 폭:** 라이트 셸프·그리드 1440px(좌우 48px 여백 포함, 내용 1344px). 본문·폼·제목 블록 980px. 리플릿·마이룸은 모바일 기준 폭 최대 480px 중앙 정렬, 데스크톱에서는 양옆을 `{colors.canvas-dark-deep}`로 채운다.
- **그리드:** 작품·작가 그리드(`{component.artwork-grid}`) 모바일 2열 · 태블릿 3열 · 데스크톱 4열. 전시 포스터 그리드는 모바일 2열 · 태블릿 3열 · 데스크톱 4열, 비율 3:4. 갤러리 유틸리티 카드는 모바일 1열 · 태블릿 2열 · 데스크톱 3열.
- **셸프:** 모바일은 카드 1장 + 다음 카드 일부(peek)가 보인다. 카드 폭 38~80vw(종류별, Components 참고). 데스크톱은 카드 폭 고정(220~340px)으로 3.5~5장이 보이고 마지막 카드가 잘려 보인다.
- **가운데 정렬 vs 왼쪽 정렬:** 풀블리드 타일(`artwork-tile-*`)과 리플릿 표지만 가운데 정렬. 페이지 제목·섹션 제목·셸프·그리드·리스트는 왼쪽 정렬.

### Whitespace Philosophy

여백은 작품의 받침대다. v1은 모바일에서 섹션 사이 간격이 거의 사라져 카드가 한 덩어리로 보였다. v2는 모바일에서도 섹션마다 56px를 비우고, 셸프 하나가 화면 높이의 절반 정도를 차지하게 해서 스크롤할 때 "한 섹션 = 한 호흡"이 되게 한다. 유틸리티 모드(갤러리·운영자)만 일부러 빽빽하게 해서 한눈에 많은 행을 보게 한다.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | 그림자 없음, 테두리 없음 | 풀블리드 타일, 페이지 제목, 푸터, 리플릿 면 |
| Hairline | 라이트 `1px {colors.hairline}`, 다크 `1px {colors.hairline-on-dark}` | 유틸리티 카드, 필터 칩(선택 전), 입력, 리스트 행 구분선 |
| Backdrop | `backdrop-filter: saturate(180%) blur(20px)` + 해당 캔버스 80% 불투명 | `global-header`, `sub-nav-frosted`, `sticky-cta-bar`(라이트) |
| Scrim | `{colors.scrim}` 전체 화면 | `bottom-sheet`, `consent-sheet` 뒤 |
| Artwork shadow | `rgba(13, 46, 82, 0.18) 0 8px 28px 0` | **작품 이미지에만**, 그것도 `object-fit: contain`으로 바탕 위에 "걸린" 작품일 때만 |

**Shadow philosophy.** 그림자는 시스템 전체에 하나뿐이고, 작품 이미지에만 쓴다. 작가 사진·전시 포스터·리플릿 표지·카드·버튼·텍스트에는 쓰지 않는다. 다크 모드에서는 그림자가 거의 보이지 않으므로 넣지 않고, 작품 주위 `{colors.canvas-dark-deep}` 여백으로 무게를 준다. UI의 깊이는 면 색 전환(흰 ↔ 파치먼트, 네이비 ↔ 네이비 딥 ↔ 엘레베이티드)으로 만든다.

### Decorative Depth

- 풀블리드 타일의 면 색 교차가 리듬을 만든다. 테두리·그림자로 섹션을 나누지 않는다.
- 고정 헤더·하단 바의 블러는 기능이다(아래 내용이 비치며 떠 있음을 알림). 장식으로 쓰지 않는다.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | 풀블리드 타일, 리플릿 작품 면, 리스트 행, 히어로 이미지 |
| `{rounded.xs}` | 4px | 거의 쓰지 않음(인라인 태그) |
| `{rounded.sm}` | 8px | 유틸리티 버튼, 리스트·장바구니 썸네일 |
| `{rounded.md}` | 12px | 입력, 유틸리티 패널 |
| `{rounded.lg}` | 18px | 셸프 카드·피처 카드·유틸리티 카드·티켓 카드·기록함 카드 **(v1 16px → v2 18px)** |
| `{rounded.xl}` | 24px | 바텀시트·동의 시트 위쪽 두 모서리 |
| `{rounded.pill}` | 9999px | 모든 버튼, 필터 칩, 상태 배지, 검색 입력 |
| `{rounded.full}` | 50% | 원형 아이콘 버튼, 작가 아바타 |

카드 안 이미지는 카드와 같은 반경을 위쪽 두 모서리에만 준다(`overflow: hidden`으로 카드가 자른다). 이미지에 따로 반경을 주지 않는다.

### Photography Geometry

| 대상 | 컴포넌트 | 비율 | 자르기 | 바탕(자리표시) | 그림자 |
|---|---|---|---|---|---|
| 작품(상세·리플릿) | `{component.image-artwork}` | 원본 비율 그대로 | `contain`(절대 자르지 않음) | 라이트 `{colors.canvas-parchment}` / 다크 `{colors.canvas-dark-deep}` | 라이트만 |
| 작품(셸프·그리드 썸네일) | `{component.image-artwork}` | 4:5 프레임 안에 원본 비율 | `contain`, 프레임 안쪽 여백 8% | 위와 같음 | 없음(작아서 지저분해짐) |
| 작가 사진 | `{component.image-artist-portrait}` | 4:5 | `cover`, 초점 `center 30%` | `{colors.canvas-parchment}` | 없음 |
| 작가 아바타(리스트) | `{component.image-artist-avatar}` | 1:1, 48px | `cover` | `{colors.canvas-parchment}` | 없음 |
| 전시 포스터 | `{component.image-exhibition-poster}` | 3:4 | `cover` | `{colors.canvas-parchment}` | 없음 |
| 전시 키 비주얼(V-01·피처 카드) | `{component.image-exhibition-keyvisual}` | 데스크톱 16:9 / 모바일 4:5 | `cover` | `{colors.canvas-parchment}` | 없음 |
| 리플릿 표지·기록함 썸네일 | `{component.image-leaflet-cover}` | 3:4 | `cover` | `{colors.canvas-dark-deep}` | 없음 |

- 작품은 작가의 결과물이므로 **자르지 않는다**. 셸프·그리드에서 세로로 긴 작품과 가로로 긴 작품이 섞여도 4:5 프레임과 파치먼트 바탕이 줄을 맞춘다.
- 이미지가 없을 때는 해당 바탕 색 면만 같은 비율로 남긴다. 도형·아이콘·"이미지 없음" 글자를 그리지 않는다.
- 사진 위에 글자를 올리지 않는다(리플릿 표지 제외. 표지는 이미지 아래쪽에 `{colors.canvas-dark-deep}` 단색 띠를 두고 그 위에 글자를 쓴다).

## Components

> 모든 수치는 위 YAML의 `components:`에 있다. 아래는 쓰임과 구조 설명이다. `*Mobile` 속성은 <720px에서, `*Tablet`은 720–1023px에서 기본값을 대신한다.

### Top Navigation

**`global-header` / `global-header-dark`** — 상단 고정. 높이 데스크톱 52px, 모바일 48px. 좌우 여백은 페이지 여백과 같다(48 / 20px). 왼쪽 워드마크 `RestArt`, 메뉴 간격 28px, 글자 `{typography.nav-link}`. 배경은 화면 캔버스(라이트 흰색 / 다크 네이비) 80% + 블러. 하단 1px 헤어라인은 스크롤이 시작된 뒤에만 보인다. 모바일(<720px)은 워드마크 + 메뉴 아이콘(`{component.button-icon-circular}` 44px, 배경 투명)으로 접는다. 접을지 펼칠지는 열린 질문(Known Gaps)이다.

역할별 메뉴는 CURSOR_BRIEF의 확정 IA를 따른다.
- 관람객: 전시(V-12), 작가(C-06), 작품(C-08), 갤러리(C-09), 마이룸(회원 R-01 / 비회원 R-07), 로그인 또는 로그아웃.
- 갤러리: 내 전시(G-01), 전시 등록(G-02), 고객 리포트(G-05, 계약만), 로그아웃.
- 운영자: 갤러리 계정(A-01), 전시 확인(A-02), 작품 DB(A-05), 관람객 분석(A-06), 전시 리포트(A-07), 오류·이력(A-08), 로그아웃.

**`sub-nav-frosted`** — 상세 화면(C-07 작가, C-10 갤러리, V-01 전시)에서 헤더 아래 붙는 두 번째 줄. 높이 52px(모바일 48px), 파치먼트 80% + 블러. 왼쪽에 현재 대상 이름(`{typography.tagline}`, 모바일 `{typography.card-title-mobile}`, 한 줄 말줄임), 오른쪽에 그 화면의 주 CTA 하나(`{component.button-primary}`, 높이 36px로 줄임). 페이지 제목이 스크롤로 사라진 뒤에만 나타난다.

**`filter-chip-row`** — 가로 스크롤 칩 줄. 높이 36px, 칩 간격 8px, 좌우 여백은 페이지 여백. 스크롤바 숨김. 섹션 제목 아래 16px, 내용 위 24px(모바일 16px).
- **`filter-chip`**: 흰 면, 1px `{colors.hairline}`, `{typography.chip}`, 높이 36px, 패딩 8×16px.
- **`filter-chip-selected`**: 네이비 면, 흰 글자, 테두리 없음.
- **`filter-chip-on-dark` / `-on-dark-selected`**: 다크 엘레베이티드 면 / 노란 면 + 네이비 글자.
- V-12 기본 칩: `전체` · `계약` · `미계약`(라벨은 확정 카피가 아니면 이 세 단어로 둔다). 터치 영역은 칩 위아래 4px 투명 여백을 더해 44px를 맞춘다.

### Buttons

**`button-primary`** — 라이트·유틸리티의 기본 CTA. 네이비 면, 흰 글자 `{typography.button}`, 필, 높이 48px, 패딩 12×24px.
- 누름: `{component.button-primary-active}` — 면이 `{colors.primary-deep}`로 바뀌고 `transform: scale(0.97)`.
- 포커스: `{component.button-primary-focus}` — `outline: 2px solid {colors.primary}`, `outline-offset: 2px`.

**`button-primary-on-dark`** — 다크 모드의 기본 CTA. 노란 면, 네이비 글자. 흰 글자 금지. 포커스 링은 2px `{colors.accent}`.

**`button-secondary` / `button-secondary-on-dark`** — 투명 면, 1px 테두리(라이트 `{colors.primary}`, 다크 `{colors.ink-on-dark}`), 같은 필·높이. 한 묶음에서 주 CTA 옆 두 번째 버튼으로만.

**`button-danger`** — 빨간 면, 흰 글자. 삭제·취소성 동작에만.

**`button-utility`** — 유틸리티 모드의 작은 버튼. 잉크 면, 흰 글자 `{typography.button-utility}`, 모서리 8px, 높이 36px, 패딩 8×14px. 표·리스트 행 안에서만.

**`button-icon-circular` / `-on-dark`** — 44×44px 원형. 셸프 좌우 화살표(데스크톱만), 바텀시트 닫기, 메뉴 아이콘. 글자 없음, `aria-label` 필수.

**`text-link` / `text-link-on-dark`** — 섹션 제목 오른쪽의 `더보기` 같은 링크. 라이트 네이비, 다크 노랑. `{typography.body-strong}`. 밑줄 없음, 누르면 불투명도 0.6.

버튼 묶음: 가로로 둘 때 간격 12px, 모바일에서 버튼 두 개가 한 줄에 안 들어가면 세로로 쌓고 각각 전체 폭.

### Cards & Containers

**`page-headline` / `page-headline-dark`** — 화면 맨 위 제목 블록. 최대 폭 980px, 왼쪽 정렬. 패딩 데스크톱 64/48/40px(위/좌우/아래), 모바일 32/20/24px. 구성: (선택) 눈썹 `{typography.eyebrow}` → 제목 `{typography.hero-display}`(모바일 `hero-display-mobile` 40px) → (선택) 한 줄 소개 `{typography.lead}`(모바일 19px), 각 사이 12px. 목록 화면(C-06, C-08, C-09, V-12, R-02)은 제목만 둔다. 소개 문장은 실제 서비스 카피가 있을 때만 넣는다.

**`section-header`** — 셸프·그리드 위 한 줄. 왼쪽 제목 `{typography.section-title}`(모바일 24px), 오른쪽 `{component.text-link}`(`더보기`, 연결 화면이 있을 때만). 아래 여백 24px(모바일 16px). 제목 줄과 링크는 baseline 정렬.

**`shelf-row`** — 가로 스크롤 셸프. v2의 핵심 컴포넌트다.
- 구조: `section-header` → 가로 스크롤 트랙. 트랙은 페이지 여백 선에서 시작해 화면 오른쪽 끝까지 흘러 나간다(오른쪽 여백 없음, 대신 마지막 카드 뒤에 페이지 여백만큼 빈 공간).
- 스크롤: `overflow-x: auto`, `scroll-snap-type: x mandatory`, 카드 `scroll-snap-align: start`, `scroll-padding-inline-start` = 페이지 여백(20 / 48px). 스크롤바 숨김. 관성 스크롤 허용.
- 카드 간격 모바일 12px, 데스크톱 20px.
- peek: 모바일에서 첫 카드 오른쪽에 다음 카드가 최소 40px 보여야 한다. 카드 폭(vw)은 이 조건을 맞춘 값이다. 390px 화면, 여백 20px 기준: 전시 카드 80vw ≈ 312px → 다음 카드 약 46px 노출, 작품 카드 72vw ≈ 281px → 약 77px, 작가 카드 38vw ≈ 148px × 2장 → 세 번째 카드 약 50px.
- 데스크톱: 트랙 양끝 위쪽에 `{component.button-icon-circular}` 두 개(이전·다음). 처음·끝에서는 해당 버튼 비활성(불투명도 0.3).
- 셸프와 셸프 사이 간격 모바일 56px, 데스크톱 80px.
- 한 셸프에는 한 종류의 카드만 넣는다.

**`shelf-card-exhibition`** — 전시 셸프 카드. 폭 데스크톱 340 / 태블릿 320 / 모바일 80vw(최대 340px). 위: 포스터 3:4(`{component.image-exhibition-poster}`), 카드 모서리 18px로 잘림. 아래 캡션(패딩 16px 4px 0): 눈썹(기간 또는 진행 상태) → 전시명 `{typography.card-title}` 최대 2줄 → 장소 `{typography.caption}` `{colors.mute}`. 줄 간격 4px. 카드 자체 배경·테두리 없음(이미지와 글자만).

**`shelf-card-artwork`** — 작품 셸프 카드. 폭 데스크톱 300 / 태블릿 280 / 모바일 72vw(최대 300px). 위: 4:5 프레임 + 파치먼트 바탕 + 작품 `contain`. 캡션: 작품명(최대 2줄) → 작가명 캡션 → 가격(있을 때만, `{typography.price}` `{colors.danger}`).

**`shelf-card-artist`** — 작가 셸프 카드. 폭 데스크톱 220 / 모바일 38vw(최대 180px, 2장 + peek). 위: 작가 사진 4:5. 캡션: 이름 `{typography.card-title}` → (있으면) 대표 매체 캡션.

**`feature-card`** — 한 화면에 최대 1개. C-11에서 진행 중인 계약 전시를 크게 보여 준다. 페이지 여백 안쪽 전체 폭(최대 1344px), 파치먼트 면, 모서리 18px. 데스크톱: 왼쪽 키 비주얼 16:9가 카드 폭의 60%, 오른쪽 40%에 글 블록(패딩 32px). 모바일: 위 이미지 4:5, 아래 글 블록(패딩 24px). 글 블록: 눈썹 → 전시명 `{typography.display-md}`(모바일 28px) → 장소·기간 캡션 → `{component.button-primary}` 하나. 사이 간격 12px, 버튼 위만 24px.

**`utility-card`** — 작은 정보 카드(갤러리 소개, 마이룸 기능 요약, 운영 지표 등). 흰 면, 1px 헤어라인, 모서리 18px, 패딩 24px(모바일 20px), 최소 높이 160px, 내부 간격 12px. 구성: (선택) 1:1 이미지 또는 48px 아바타 → 제목 `{typography.body-strong}` → 캡션 → (선택) `text-link`. 그림자 없음. 파치먼트 밴드 위에 놓을 때 가장 잘 보인다.

**`artwork-tile-light` / `-parchment` / `-dark` / `-dark-2`** — 풀블리드 밴드. 모서리 0, 화면 가로 전체. 세로 패딩 데스크톱 80px, 모바일 56px. 가운데 정렬 스택: 제목 `{typography.display-lg}`(모바일 32px) → 한 줄 소개 `{typography.lead}`(모바일 19px) → CTA 묶음(간격 12px) → 40px 띄우고 이미지(최대 높이 화면의 64%). 같은 색 타일을 연달아 두지 않는다. 다크 타일 두 개가 이어지면 `-dark` 다음 `-dark-2`. C-11의 마이룸·리플릿 소개가 이 컴포넌트다.

**`artwork-grid`** — 목록 화면 그리드. 열 수 4 / 3 / 2(데스크톱 / 태블릿 / 모바일), 가로 간격 20 / 12px, 세로 간격 32 / 24px. 칸 구성은 `shelf-card-artwork`와 같다(4:5 프레임 + 캡션). 모바일 캡션은 `{typography.caption-strong}` 한 줄 + 작가명 캡션 한 줄.

**`list-row` / `list-row-on-dark`** — 유틸리티 화면과 마이룸 목록의 기본 행. 높이 최소 64px, 위아래 패딩 12px, 하단 1px 헤어라인. 왼쪽 48px 썸네일(모서리 8px) → 제목·메타 두 줄 → 오른쪽 `{component.status-badge}` 또는 `{component.button-utility}`. 요소 간격 12px. 행 전체가 눌리는 영역이면 오른쪽 끝에 화살표 아이콘.

**`utility-panel`** — 유틸리티 모드의 묶음 상자(폼 섹션, 리포트 블록). 흰 면, 1px 헤어라인, 모서리 12px, 패딩 24px(모바일 16px), 내부 간격 16px. 유틸리티 화면 바탕은 `{colors.canvas-parchment}`로 깔고 패널을 흰 면으로 띄운다.

**`status-badge` / `status-badge-accent`** — 높이 24px 필. 기본은 파치먼트 + 잉크 뮤트 글자(예: `미계약`, `확인 대기`). 강조는 노란 면 + 네이비 글자(예: `계약`, `게시`).

### Leaflet & My Room (다크)

**`leaflet-cover`** — V-09·V-14·R-03 첫 화면. 최대 폭 480px, 최소 높이 화면 전체(`100svh`). 위: 전시 키 비주얼 또는 대표 작품 3:4(`{component.image-leaflet-cover}`), 모서리 0. 아래 네이비 딥 띠 위에 (선택) 눈썹(방문 날짜) → 전시명 `{typography.hero-display-mobile}` → 장소 캡션. 패딩 24/20/40px, 간격 12px.

**`leaflet-ticket-card`** — 티켓형 방문 카드. 엘레베이티드 면, 모서리 18px, 패딩 20px, 좌우 바깥 여백 20px. 전시명 `{typography.tagline-mobile}`, 날짜·장소 캡션, 간격 8px. 표지 아래 24px.

**`leaflet-artwork-full`** — 본 순서대로 작품 한 점씩. 폭 전체(최대 480px), 네이비 딥 바탕, 작품은 `contain`으로 안쪽 여백 24px, 최대 높이 화면의 72%. 그림자 없음.

**`leaflet-caption`** — 작품 바로 아래. 작품명 `{typography.card-title-mobile}` → 작가·연도·재료 `{typography.caption-mobile}` `{colors.mute-on-dark}`. 패딩 16/20/32px, 간격 4px. 누르면 C-05 바텀시트.

**`leaflet-note-block`** — 관람 노트·한줄평. 투명 면, 위아래 1px 다크 헤어라인, 패딩 24/20px, 본문 `{typography.body-mobile}`.

**`archive-card`** — R-02 기록함 카드. 엘레베이티드 면, 모서리 18px, 표지 3:4, 캡션(패딩 12/12/16px): 전시명 `{typography.card-title-mobile}` → 방문 날짜 캡션. 모바일 2열, 데스크톱 4열, 간격 12px.

### Overlays & Bars

**`bottom-sheet` / `bottom-sheet-light`** — 아래에서 올라오는 시트. 위쪽 두 모서리 24px, 패딩 12/20/32px, 최대 높이 화면의 85%, 맨 위 손잡이 36×4px(다크 `{colors.hairline-on-dark}`, 라이트 `{colors.hairline}`), 내부 간격 16px. 뒤에 `{colors.scrim}`. 오른쪽 위 닫기 `{component.button-icon-circular}`. 리플릿 위 C-05는 다크, 라이트 화면 위는 `-light`.

**`consent-sheet`** — V-02 수집 안내·동의. 다크 바텀시트 구조 + 본문은 실제 동의 문구만, 하단에 `{component.button-primary-on-dark}`(동의)와 `{component.button-secondary-on-dark}`(거부)를 세로로 쌓음.

**`sticky-cta-bar` / `sticky-cta-bar-dark`** — 화면 아래 고정 바. 높이 72px + `env(safe-area-inset-bottom)`, 패딩 12/20px. 왼쪽 정보(가격 또는 선택 수, `{typography.body-strong}`), 오른쪽 주 CTA(높이 48px). 정보가 없으면 CTA 하나가 전체 폭. 라이트는 흰 면 80% + 블러 + 위쪽 1px 헤어라인, 다크는 네이비 딥 불투명. 바가 있는 화면은 본문 아래에 바 높이만큼 여백을 더한다.

### Inputs & Forms

**`search-input`** — V-12·작품 DB 검색. 파치먼트 면, 필, 높이 48px, 패딩 12×20px, 왼쪽 16px 검색 아이콘(`{colors.mute}`), `{typography.body}`(모바일 16px — iOS 확대 방지를 위해 16px 미만 금지).

**`form-field` / `form-field-on-dark`** — 높이 48px, 모서리 12px, 패딩 12×16px. 라벨은 입력 위 `{typography.caption-strong}`, 간격 8px. 필드끼리 간격 20px. 포커스 링 라이트 네이비 2px, 다크 노랑 2px. 오류: 라이트는 테두리 `{colors.danger}` + 아래 `{typography.caption}` 빨간 문장, 다크는 `{colors.error-on-dark}` 문장(가안).

**`cart-row`** — C-04. 88px 썸네일(모서리 8px, 작품 `contain`, 파치먼트 바탕) → 작품명·작가 → 오른쪽 가격(빨강, 있을 때만). 패딩 위아래 16px, 간격 16px, 하단 헤어라인.

### Footer

**`footer`** — 파치먼트 면, 패딩 데스크톱 48/48/64px, 모바일 40/20/48px, 내부 간격 24px. 링크 묶음 `{typography.caption}` `{colors.ink-muted}`, 맨 아래 법적 고지 `{typography.fine-print}` `{colors.mute}`. 리플릿·마이룸(다크)과 유틸리티 화면에는 두지 않는다.

### Demo overlay (참고)

화면 ID 칩, `모의` 표시, 역할 전환기, 화면 목록은 OVERRIDES.md에 따라 **데모 오버레이에만** 있고 제품 화면 디자인 토큰이 아니다. 이 파일에서 정하지 않는다.

## Image Assets (가안)

실제 이미지를 연결할 때의 규칙이다. 확정 정책이 아니며, 특히 RestArt 작가 작품 이미지는 **사용권 확인 전 내부 R&D 전용**으로 표시된 자료다(Known Gaps 참고).

### 폴더와 파일명

```
public/images/
  artists/{artistId}.webp        # 작가 사진, 4:5, 긴 변 최대 1000px
  artworks/{artworkId}.webp      # 작품, 원본 비율, 긴 변 최대 1600px
  exhibitions/{exhibitionId}.webp        # 포스터 3:4, 긴 변 최대 1600px
  exhibitions/{exhibitionId}-key.webp    # 키 비주얼(있을 때만), 16:9 또는 원본, 가로 최대 1920px
  leaflets/{leafletId}.webp      # 리플릿 표지·샘플 디자인 캡처, 3:4, 가로 최대 1080px
```

- 파일명은 모의 JSON의 `id`와 똑같이 쓴다. 기존 `id`는 바꾸지 않는다.
- 형식 WebP, 품질 80 기준, 파일당 400KB 이하 목표. 원본 고해상도(수 MB~수십 MB) 파일을 그대로 넣지 않는다.
- 렌더링은 Next.js `next/image`로 하고 `sizes`를 컴포넌트 폭에 맞춘다(예: 전시 셸프 카드 `(max-width: 719px) 80vw, 340px`). 첫 화면 위쪽 이미지 1장만 `priority`, 나머지는 지연 로딩.
- 외부 URL(예: Firebase Storage 토큰 URL)을 직접 걸지 않는다. 로컬 `public/` 파일로 복사해 쓴다. 이유: 원본 크기가 매우 크고, 토큰이 바뀌면 깨진다.

### 모의 데이터 필드

기존 필드 이름(`imageUrl`, `posterUrl`)은 유지하고, 같은 레벨에 아래 필드를 더한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| `imageUrl` (전시는 `posterUrl`) | string \| null | `/images/artworks/{id}.webp` 같은 로컬 경로. 없으면 `null` → 바탕 색 면만 표시 |
| `imageAlt` | string | 대체 텍스트. 작품은 `작품명, 작가명`, 작가는 `작가명` |
| `imageCredit` | string \| null | 출처·저작권 표기(예: 퍼블릭 도메인 출처). 화면에는 상세 화면 하단 캡션으로만 |
| `imageWidth` | number | 원본 가로 px (`next/image` 비율 계산용) |
| `imageHeight` | number | 원본 세로 px |

전시 키 비주얼은 `keyVisualUrl`(string \| null)을 추가하고 alt·크기 필드는 `keyVisual*` 접두로 맞춘다(가안).

### 리플릿 샘플 디자인

리플릿 샘플을 이미지로 넣을 경우 `leaflets/{leafletId}.webp`에 표지 캡처만 넣고, 리플릿 본문(V-09 화면)은 이미지가 아니라 위 `leaflet-*` 컴포넌트로 그린다. 본문을 통째로 이미지로 넣으면 글자 크기·대비 규칙을 적용할 수 없다.

## Do's and Don'ts

### Do
- 라이트 화면은 `page-headline` → `feature-card` → `shelf-row` → 풀블리드 타일 순의 리듬을 따른다.
- 모바일 셸프에서 다음 카드가 최소 40px 보이게 한다.
- 모바일에서 `*-mobile` 타이포 토큰을 쓴다. 데스크톱 토큰을 비율로 줄이지 않는다.
- 섹션 간격은 모바일 56px, 데스크톱 80px로 고정한다.
- 좌우 여백은 모바일 20px, 데스크톱 48px. 헤더·제목·셸프 시작점이 같은 선에 서야 한다.
- 작품은 `contain` + 바탕 색. 그림자는 라이트 화면에서 크게 보이는 작품에만.
- 노란 면에는 네이비 글자, 빨강은 가격·장바구니·오류·삭제에만.
- 이미지가 없으면 비율을 지킨 바탕 색 면만 남긴다.

### Don't
- 같은 카드를 세로로 세 개 넘게 연달아 쌓지 않는다. 목록이면 그리드, 추천이면 셸프로 바꾼다.
- 작품을 `cover`로 잘라 썸네일을 맞추지 않는다.
- 도형·일러스트로 가짜 작품 이미지를 그리지 않는다.
- 카드·버튼·텍스트에 그림자를 넣지 않는다. 장식 그라데이션을 쓰지 않는다.
- 한 화면에 글자 크기를 5단계 넘게 쓰지 않는다. 12px를 모바일 제품 화면에 쓰지 않는다.
- 17px 이하 글자에 음수 자간을 쓰지 않는다.
- 노란 글자를 흰 면에, 빨간 글자를 네이비 면에 쓰지 않는다.
- 반경을 18px(카드) / 12px(입력·패널) / 8px(썸네일·유틸리티 버튼) / 필(버튼·칩) 외에 새로 만들지 않는다.
- 제품 화면에 설명 문구, 화면 ID, `모의`, `가안` 같은 메타 글자를 넣지 않는다(OVERRIDES).
- hex를 코드에 직접 쓰지 않는다. 항상 토큰을 쓴다.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small phone | ≤ 359px | 모바일 규칙 그대로. 히어로만 `clamp()`로 34px까지 줄어들 수 있음(별도 토큰 없음). 셸프 peek은 약 30px까지 줄어드는 것을 허용 |
| Mobile | 360–719px | **기본 기준.** `*-mobile` 타이포, 여백 20px, 섹션 56px, 그리드 2열, 헤더 접힘, 셸프 카드 vw 폭 |
| Tablet | 720–1023px | 데스크톱 타이포, 여백 32px, 섹션 80px, 그리드 3열, 셸프 카드 고정 폭(`*Tablet`), 헤더 메뉴 펼침(메뉴가 넘치면 접음) |
| Desktop | 1024–1439px | 여백 48px, 그리드 4열, 셸프 화살표 버튼 표시, 피처 카드 좌우 분할 |
| Wide | ≥ 1440px | 내용 폭 1440px에서 고정, 남는 폭은 양옆 여백. 풀블리드 타일 배경만 끝까지 |

리플릿·마이룸은 모든 너비에서 최대 480px 중앙 컬럼을 유지한다.

### Touch Targets
- 최소 44×44px. 버튼 높이 48px, 아이콘 버튼 44px.
- 필터 칩은 시각 높이 36px + 위아래 투명 여백 4px로 44px.
- 셸프 카드는 카드 전체가 하나의 링크(이미지와 캡션을 따로 누르게 하지 않음).

### Collapsing Strategy
- **헤더:** 720px 아래에서 워드마크 + 메뉴 아이콘. 메뉴는 `bottom-sheet-light`(라이트) / `bottom-sheet`(다크)로 연다.
- **서브 내비:** 모바일에서 오른쪽 CTA만 남기고 다른 링크는 숨긴다.
- **피처 카드:** 1024px 아래에서 좌우 분할 → 위아래(이미지 4:5 위).
- **셸프:** 접지 않는다. 너비와 관계없이 가로 스크롤 유지, 카드 폭만 바뀐다.
- **그리드:** 4 → 3 → 2열. 모바일 1열로 내리지 않는다(작품·전시). 갤러리 유틸리티 카드만 1열까지.
- **풀블리드 타일:** 세로 패딩 80 → 56px, 제목 40 → 32px.
- **C-11 다크 타일:** 아코디언으로 접지 않고 스크롤 섹션으로 둔다.

### Image Behavior
- `next/image` + `sizes`로 너비별 크기를 받는다. 비율은 Photography Geometry 표를 모든 너비에서 유지한다.
- 예외: 전시 키 비주얼만 데스크톱 16:9 → 모바일 4:5로 비율이 바뀐다(같은 이미지를 `cover`로 다시 자름. 별도 모바일 이미지가 있으면 그것을 쓴다).
- 첫 화면 위쪽 이미지 1장만 즉시 로딩, 나머지는 지연 로딩. 로딩 중에는 바탕 색 면을 같은 비율로 먼저 그린다(레이아웃 밀림 방지).

## Iteration Guide

Cursor와 대화하며 고칠 때의 규칙이다.

1. **한 번에 컴포넌트 하나.** 키를 직접 부른다. 예: "`{component.shelf-card-exhibition}`의 모바일 폭을 80vw에서 76vw로 바꿔."
2. **형용사 대신 숫자.** "더 크게", "애플처럼" 대신 "제목을 `{typography.section-title-mobile}` 24px에서 26px로", "섹션 간격 56px → 64px".
3. **hex를 코드에 쓰지 않는다.** 색은 항상 `{colors.*}` 토큰으로. 새 색이 필요하면 코드보다 이 파일을 먼저 고친다.
4. **값을 바꾸면 이 파일도 같이 바꾼다.** YAML 값을 먼저 고치고, Cursor에는 "DESIGN_v2.md의 `{component.x}` 값을 기준으로 다시 맞춰"라고 지시한다. 코드와 문서가 어긋나지 않게 한다.
5. **참고 캡처를 붙인다.** 현재 화면 캡처와 참고 화면 캡처를 함께 붙이고, 무엇을 맞출지(간격·크기·배치 중 하나)를 숫자로 적는다.
6. **다른 화면은 건드리지 말라고 명시한다.** 예: "C-11만 수정, 공용 컴포넌트 값은 바꾸지 마." 공용 컴포넌트를 바꿀 때는 영향을 받는 화면 목록을 먼저 물어본다.
7. **변형은 새 키로.** 상태·모드 차이(`-selected`, `-on-dark`, `-2`)는 기존 키를 덮어쓰지 말고 `components:`에 새 항목으로 추가한다.
8. **상태는 기본·누름·포커스·비활성만.** 호버 전용 디자인은 만들지 않는다(모바일 우선).
9. **강조가 필요하면 면을 먼저 바꾼다.** 테두리·그림자·색을 더하기 전에 흰 → 파치먼트, 네이비 → 네이비 딥 전환을 먼저 시도한다.
10. **화면 글자는 실제 서비스 카피만.** 고치는 김에 설명 문구를 넣지 않는다(OVERRIDES 1번).

## Known Gaps

- **v1에서 바뀐 값:** `rounded.lg` 16 → 18px, 모바일 히어로 36 → 40px, 눈썹 12 → 14~15px, 디스플레이 웨이트 600 → 700, 40px 이상 제목 자간 0 → −0.01em, 버튼 높이 44 → 48px, 내비 13 → 14px. 시연 화면에서 확인 후 되돌릴 수 있다. 모두 가안이다.
- **헤더 메뉴:** 모바일 햄버거로 접을지, 주요 메뉴를 펼쳐 보일지는 열린 질문이다. 지금 값은 접는 쪽이다.
- **화면 ID 칩·`모의` 표시:** 데모 오버레이에만 있다. v1의 `screen-id-chip`, `mock-badge` 토큰은 이 파일에서 뺐다. 오버레이 스타일은 코드 쪽에서 정한다.
- **이미지 사용권:** 내부 샘플(`48-세개의문-샘플`)의 RestArt 작가 작품 83점과 작가 프로필 15장은 "사용권 계약 확인 전 내부 R&D 전용"으로 표시돼 있다. 공개 URL(Vercel 등)에 올리기 전에 RestArt·작가 사용 범위를 확인해야 한다. 고전 작품 53점은 퍼블릭 도메인(Wikimedia Commons)이라 출처 표기 후 쓸 수 있다.
- **CURSOR_BRIEF와의 충돌:** 브리프는 "실존 작가의 작품 설명·가격을 사실인 양 쓰지 않는다"고 했다. 실제 RestArt 작품 이미지를 쓰면 작품명·작가명도 실제가 되므로, 가격·설명을 실제 값으로 둘지 모의 값으로 둘지 결정이 필요하다.
- **전시 포스터·키 비주얼:** 박스에 실제 전시 포스터 이미지 자료가 없다. 확보 전까지 대표 작품 이미지를 포스터 자리에 쓰거나 바탕 색 면으로 둔다.
- **리플릿 샘플 디자인:** 박스에는 리플릿 디자인 프롬프트 문서만 있고 완성된 샘플 이미지 파일은 없다.
- **로고:** 최종 워드마크가 없다. 글자 `RestArt`로 둔다.
- **블러 값:** `saturate(180%) blur(20px)`는 일반적인 시작값이며 브라우저마다 다르게 보인다. 토큰으로 확정하지 않는다.
- **다크 모드 오류 문장 색** `{colors.error-on-dark}`는 가안이다.
- **유틸리티 모드의 표(테이블)** 컴포넌트는 아직 정하지 않았다. 지금은 `list-row`로 대신한다.
- 이 파일은 Apple의 공식 가이드가 아니며 Apple의 시각 정체성을 복제하지 않는다. 형식과 원칙만 참고했다.
