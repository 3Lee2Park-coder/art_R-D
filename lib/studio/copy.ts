/** 스튜디오 화면 고정 문구 (HTML RestArt_Gallery_Management_v2.2). */

export const POSITIONING_TITLE = "포지셔닝 원칙";

export const POSITIONING_BODY =
  "재고·회계·판매·메일링 시스템을 모두 대체하려 하지 않습니다. RestArt에서 발생한 관람·관심·문의 맥락을 갤러리의 고객 및 작품 데이터와 연결합니다.";

export const CUSTOMER_DATA_PRINCIPLES_TITLE = "고객 데이터 운영 원칙";

export const CUSTOMER_DATA_PRINCIPLES = [
  {
    title: "익명 방문 프로필 유지",
    note: "연락처가 없는 관심 기록은 익명 세션 단위로만 보관",
  },
  {
    title: "문의 답변 동의 확인",
    note: "문의 응답을 위한 연락처 사용 목적",
  },
  {
    title: "다음 전시 소식 수신 동의",
    note: "마케팅 및 소식 발송 목적의 별도 동의",
  },
] as const;

export const SETTINGS_SAVE_LABEL = "변경 사항 저장";

export const CSV_EXPORT_LABEL = "CSV 내보내기";
export const INQUIRY_EXPORT_LABEL = "문의 내보내기";

export const WIZARD_LABELS = {
  title: "전시명 *",
  gallery: "갤러리 *",
  venue: "전시 장소",
  startDate: "전시 시작일 *",
  endDate: "전시 종료일 *",
  description: "전시 소개",
  objectives: "전시 목표 *",
  themeColor: "전시 테마 색상 *",
  prev: "이전 단계",
  next: "다음 단계",
  submit: "등록",
  cancel: "등록 취소",
} as const;
