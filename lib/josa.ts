/** 한글 조사 선택 (받침 유무). 「이(가)」 같은 병기를 화면에 쓰지 않기 위함. */

const DIGIT_HAS_BATCHIM: Record<string, boolean> = {
  "0": true, // 영
  "1": true, // 일
  "2": false, // 이
  "3": true, // 삼
  "4": false, // 사
  "5": false, // 오
  "6": true, // 육
  "7": true, // 칠
  "8": true, // 팔
  "9": false, // 구
};

/** 마지막 글자에 받침이 있으면 true. 한글·숫자 외 문자는 ㄹ/ㅁ/ㄴ/ㅇ로 읽히는 알파벳만 받침으로 본다. */
export function hasBatchim(word: string): boolean {
  const trimmed = word.trim();
  const ch = trimmed.charAt(trimmed.length - 1);
  if (!ch) return false;
  const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
  if (ch in DIGIT_HAS_BATCHIM) return DIGIT_HAS_BATCHIM[ch]!;
  return /[lmnrLMNR]/.test(ch);
}

/** 주격 조사: 받침 있으면 「이」, 없으면 「가」. */
export function subjectParticle(word: string): "이" | "가" {
  return hasBatchim(word) ? "이" : "가";
}

/** `${word}이/가` */
export function withSubject(word: string): string {
  return `${word}${subjectParticle(word)}`;
}
