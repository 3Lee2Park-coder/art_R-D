import type { Mode, Role } from "@/lib/types";

export function screenIdFor(path: string) {
  if (path === "/") return "C-11";
  if (path === "/login") return "C-01";
  if (path === "/signup") return "C-02";
  if (path === "/cart") return "C-04";
  if (path === "/artists") return "C-06";
  if (path.startsWith("/artists/")) return "C-07";
  if (path === "/artworks") return "C-08";
  if (path.startsWith("/artworks/")) return "C-03";
  if (path === "/galleries") return "C-09";
  if (path.startsWith("/galleries/")) return "C-10";
  if (path === "/exhibitions") return "V-12";
  if (path === "/record/new") return "V-13";
  if (path === "/record/leaflet") return "V-14";
  if (/^\/leaflets\/[^/]+\/notes$/.test(path)) return "V-10";
  if (/^\/leaflets\/[^/]+\/share$/.test(path)) return "V-11";
  if (path.startsWith("/leaflets/")) return "V-09";
  if (path === "/my-room") return "R-01";
  if (path === "/my-room/archive") return "R-02";
  if (path.startsWith("/my-room/leaflets/")) return "R-03";
  if (path === "/my-room/space") return "R-04";
  if (path === "/my-room/picks") return "R-05";
  if (path === "/my-room/decorate") return "R-06";
  if (path === "/my-room/intro") return "R-07";
  if (path === "/studio") return "G-01";
  if (path === "/studio/exhibitions/new") return "G-02";
  if (/^\/studio\/exhibitions\/[^/]+$/.test(path)) return "G-06";
  if (/^\/studio\/exhibitions\/[^/]+\/review$/.test(path)) return "G-03";
  if (/^\/studio\/exhibitions\/[^/]+\/qr$/.test(path)) return "G-04";
  if (path.startsWith("/studio/reports/")) return "G-05";
  if (path === "/operator/accounts/new") return "A-11";
  if (path === "/operator/accounts") return "A-01";
  if (/^\/operator\/galleries\/[^/]+$/.test(path)) return "A-10";
  if (path === "/operator/exhibitions") return "A-02";
  if (/^\/operator\/exhibitions\/[^/]+\/theme$/.test(path)) return "A-03";
  if (/^\/operator\/exhibitions\/[^/]+\/layout$/.test(path)) return "A-04";
  if (path === "/operator/artworks") return "A-05";
  if (path === "/operator/analytics") return "A-06";
  if (path === "/operator/reports") return "A-07";
  if (path === "/operator/errors") return "A-08";

  const exhibition = path.match(/^\/exhibitions\/[^/]+(?:\/([^/]+))?$/);
  if (exhibition) {
    const sub = exhibition[1];
    if (!sub) return "V-01";
    if (sub === "consent") return "V-02";
    if (sub === "guide") return "V-03";
    if (sub === "capture") return "V-04";
    if (sub === "photos") return "V-05";
    if (sub === "map") return "V-06";
    if (sub === "generating") return "V-08";
  }
  return "";
}

const DARK = new Set(["V-02", "V-03", "V-04", "V-05", "V-06", "V-08", "V-09", "V-10", "V-11", "V-13", "V-14"]);

export function modeFor(path: string): Mode {
  const id = screenIdFor(path);
  if (id.startsWith("R-")) return "dark";
  if (id.startsWith("G-") || id.startsWith("A-")) return "utility";
  if (DARK.has(id)) return "dark";
  return "light";
}

export type ScreenLink = {
  id: string;
  name: string;
  path: string;
  role?: Role;
};

export type FlowLink = {
  id: string;
  label: string;
  path: string;
  role: Role;
  consent?: "set" | "clear";
  guide?: "hide" | "clear";
};

export const FLOW_LINKS: FlowLink[] = [
  { id: "UF-01", label: "UF-01 현장 QR · 비회원", path: "/exhibitions/ex-edge?from=qr", role: "visitor-guest", consent: "clear", guide: "clear" },
  { id: "UF-01-member", label: "UF-01 회원 · 동의 후", path: "/exhibitions/ex-edge?from=qr", role: "visitor-member", consent: "set", guide: "clear" },
  { id: "UF-01-guide", label: "UF-01 가이드 숨김", path: "/exhibitions/ex-edge?from=qr", role: "visitor-member", consent: "set", guide: "hide" },
  { id: "UF-02", label: "UF-02 미계약 기록", path: "/exhibitions", role: "visitor-guest" },
  { id: "UF-03", label: "UF-03 미등록 기록", path: "/record/new", role: "visitor-guest" },
  { id: "UF-04", label: "UF-04 비회원 저장", path: "/leaflets/demo-visit", role: "visitor-guest" },
  { id: "UF-05", label: "UF-05 마이룸 · 회원", path: "/my-room", role: "visitor-member" },
  { id: "UF-05-guest", label: "UF-05 마이룸 · 비회원", path: "/my-room/intro", role: "visitor-guest" },
  { id: "UF-06", label: "UF-06 둘러보기", path: "/", role: "visitor-guest" },
  { id: "UF-07", label: "UF-07 계약 갤러리", path: "/studio", role: "gallery-contracted" },
  { id: "UF-07-open", label: "UF-07 미계약 갤러리", path: "/studio/exhibitions/new", role: "gallery-uncontracted" },
  { id: "UF-08", label: "UF-08 운영자", path: "/operator/accounts", role: "operator" },
  { id: "UF-11", label: "UF-11 운영자 계정 발급", path: "/operator/accounts/new", role: "operator" },
  { id: "UF-09", label: "UF-09 갤러리 리포트", path: "/studio/reports/ex-winter", role: "gallery-contracted" },
  { id: "UF-09-op", label: "UF-09 운영 리포트", path: "/operator/reports", role: "operator" },
  { id: "UF-10", label: "UF-10 로그인", path: "/login", role: "visitor-guest" },
];

export const SCREEN_INDEX: { group: string; items: ScreenLink[] }[] = [
  {
    group: "둘러보기",
    items: [
      { id: "C-11", name: "메인 홈", path: "/" },
      { id: "C-01", name: "로그인", path: "/login" },
      { id: "C-02", name: "회원가입", path: "/signup" },
      { id: "C-06", name: "작가 목록", path: "/artists" },
      { id: "C-07", name: "작가 상세", path: "/artists/a-seorin" },
      { id: "C-08", name: "작품 목록", path: "/artworks" },
      { id: "C-03", name: "작품 상세", path: "/artworks/aw-plane" },
      { id: "C-04", name: "장바구니", path: "/cart" },
      { id: "C-09", name: "갤러리 목록", path: "/galleries" },
      { id: "C-10", name: "갤러리 상세", path: "/galleries/g-hannam" },
    ],
  },
  {
    group: "전시 · 리플릿",
    items: [
      { id: "V-12", name: "전시 둘러보기", path: "/exhibitions" },
      { id: "V-01", name: "전시 페이지", path: "/exhibitions/ex-edge" },
      { id: "V-01", name: "현장 QR", path: "/exhibitions/ex-edge?from=qr" },
      { id: "V-02", name: "수집 안내", path: "/exhibitions/ex-edge/consent?from=qr" },
      { id: "V-03", name: "촬영 안내", path: "/exhibitions/ex-edge/guide?from=qr" },
      { id: "V-04", name: "촬영", path: "/exhibitions/ex-edge/capture?from=qr" },
      { id: "V-05", name: "촬영 사진", path: "/exhibitions/ex-edge/photos?from=qr" },
      { id: "V-06", name: "배치도", path: "/exhibitions/ex-edge/map?from=qr" },
      { id: "C-05", name: "작품 설명 시트", path: "/exhibitions/ex-edge/map?from=qr" },
      { id: "V-08", name: "생성 대기", path: "/exhibitions/ex-edge/generating?from=qr" },
      { id: "V-09", name: "리플릿", path: "/leaflets/demo-visit" },
      { id: "V-10", name: "기록 입력", path: "/leaflets/demo-visit/notes" },
      { id: "V-11", name: "공유 미리보기", path: "/leaflets/demo-visit/share" },
      { id: "V-13", name: "전시 정보 입력", path: "/record/new" },
      { id: "V-14", name: "기록용 리플릿", path: "/record/leaflet?exhibition=ex-alley" },
    ],
  },
  {
    group: "마이룸",
    items: [
      { id: "R-07", name: "소개", path: "/my-room/intro", role: "visitor-guest" },
      { id: "R-01", name: "마이룸", path: "/my-room", role: "visitor-member" },
      { id: "R-02", name: "기록함", path: "/my-room/archive", role: "visitor-member" },
      { id: "R-03", name: "저장 리플릿", path: "/my-room/leaflets/demo-visit", role: "visitor-member" },
      { id: "R-04", name: "공간 질문", path: "/my-room/space", role: "visitor-member" },
      { id: "R-05", name: "작품 고르기", path: "/my-room/picks", role: "visitor-member" },
      { id: "R-06", name: "방 꾸미기", path: "/my-room/decorate", role: "visitor-member" },
    ],
  },
  {
    group: "갤러리",
    items: [
      { id: "G-01", name: "내 전시", path: "/studio", role: "gallery-contracted" },
      { id: "G-02", name: "전시 등록", path: "/studio/exhibitions/new", role: "gallery-contracted" },
      { id: "G-06", name: "전시 상세", path: "/studio/exhibitions/ex-edge", role: "gallery-contracted" },
      { id: "G-03", name: "배치 검토", path: "/studio/exhibitions/ex-pending/review", role: "gallery-contracted" },
      { id: "G-04", name: "전시 QR", path: "/studio/exhibitions/ex-edge/qr", role: "gallery-contracted" },
      { id: "G-05", name: "고객 리포트", path: "/studio/reports/ex-winter", role: "gallery-contracted" },
    ],
  },
  {
    group: "운영",
    items: [
      { id: "A-01", name: "갤러리 계정", path: "/operator/accounts", role: "operator" },
      { id: "A-10", name: "갤러리 상세", path: "/operator/galleries/g-hannam", role: "operator" },
      { id: "A-11", name: "계정 생성", path: "/operator/accounts/new", role: "operator" },
      { id: "A-02", name: "전시 확인", path: "/operator/exhibitions", role: "operator" },
      { id: "A-03", name: "테마", path: "/operator/exhibitions/ex-edge/theme", role: "operator" },
      { id: "A-04", name: "배치 점검", path: "/operator/exhibitions/ex-edge/layout", role: "operator" },
      { id: "A-05", name: "작품 DB", path: "/operator/artworks", role: "operator" },
      { id: "A-06", name: "관람객 분석", path: "/operator/analytics", role: "operator" },
      { id: "A-07", name: "전시 리포트", path: "/operator/reports", role: "operator" },
      { id: "A-08", name: "오류 · 이력", path: "/operator/errors", role: "operator" },
    ],
  },
];

export const SCREEN_MEMOS: Record<string, string> = {
  "C-11": "가안. 메인 홈 전용 요구사항은 아직 없다. 섹션 순서와 더보기(전시, 마이룸, 갤러리, 작가)는 후보.",
  "C-01": "가안. 회원 헤더의 로그인 자리는 로그아웃만 둔다. 원문은 마이룸/로그아웃.",
  "G-01": "가안. 갤러리 로고는 내 전시로 이동한다.",
  "G-06": "전시 삭제는 지원하지 않음(추후 재결정). 게시 후 수정은 운영자 재확인 없음.",
  "G-02": "파일 전송·저장은 모의. 형식·용량은 미정.",
  "A-01": "가안. 운영자 로고는 갤러리 계정으로 이동한다.",
  "A-11": "계정 발급은 모의. 필수 항목은 가안.",
  "V-11": "공유 미리보기는 검토 중이라 확정 기능으로 두지 않는다. 링크는 발급하지 않는다.",
  "V-13": "가안. 입력 항목은 미정. 화면에는 전시명, 장소, 기간만 둔다.",
  "V-14": "비회원 리플릿 보관 기간은 미정. 만료는 없다.",
  "R-04": "가안. 질문 열 개와 S1–S6의 대응은 미정. 라벨만 보여 준다.",
  "R-05": "가안. 여러 점 선택 허용 여부는 미정. 여러 점을 고를 수 있게 둔다.",
  "R-06": "가안. 개인 사진 액자 범위는 미정. 고른 작품만 놓는다.",
  "A-05": "가안. 작품 DB 필드는 확정 전이다.",
  "A-08": "가안. 이력 범위는 미정. 예시 몇 건만 둔다.",
  "A-06": "진행 중 전시는 과정 수치를 보여 주지 않는다. 종료 확정 방식은 미정.",
};
