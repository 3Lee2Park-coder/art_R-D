/** 이메일 lower/trim, 전화 숫자만 [가안] */

export function normalizeContactKey(
  contactValue: string,
  contactMethod?: "email" | "phone" | null,
): string | null {
  const raw = contactValue.trim();
  if (!raw) return null;
  const looksPhone =
    contactMethod === "phone" || (!contactMethod && /^[\d\s+\-()]+$/.test(raw));
  if (looksPhone) {
    const digits = raw.replace(/\D/g, "");
    return digits.length > 0 ? `phone:${digits}` : null;
  }
  return `email:${raw.toLowerCase()}`;
}
