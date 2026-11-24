export function todayISO() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${year}.${month}.${day}`;
}

export function formatPeriod(start: string, end: string) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function formatStamp(iso: string) {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return iso;
  return `${match[1]}.${match[2]}.${match[3]} ${match[4]}:${match[5]}`;
}

export function formatClock(iso: string | undefined) {
  if (!iso) return "";
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

export function oneParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** V-01 로그인 복귀: 기존 쿼리(?from=qr&scenario=…) 보존 */
export function exhibitionReturnPath(exhibitionId: string, search: string): string {
  const qs = search.startsWith("?") ? search.slice(1) : search;
  return `/exhibitions/${exhibitionId}${qs ? `?${qs}` : ""}`;
}

export function outsidePeriod(date: string, start: string, end: string) {
  if (!date || !start || !end) return false;
  return date < start || date > end;
}
