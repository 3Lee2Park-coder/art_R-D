import { ARTWORK_CSV_TEMPLATE_HEADERS } from "@/lib/studio/exportCsv";

export type ParsedArtworkRow = {
  title: string;
  artistName: string;
  year: string | null;
  widthCm: number | null;
  heightCm: number | null;
  medium: string | null;
  description: string | null;
};

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"' && quoted && next === '"') {
      cell += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some((v) => String(v).trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  if (row.some((v) => String(v).trim())) rows.push(row);
  return rows;
}

function headerIndex(headers: string[], aliases: string[]): number {
  const norm = headers.map((h) => h.replace(/^\uFEFF/, "").trim().toLowerCase());
  for (const alias of aliases) {
    const i = norm.indexOf(alias.toLowerCase());
    if (i >= 0) return i;
  }
  return -1;
}

function numOrNull(v: string | undefined): number | null {
  if (v == null || !String(v).trim()) return null;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

/** CSV 텍스트 → 작품 행. 작품명·작가명 필수. */
export function parseArtworkCsv(text: string): ParsedArtworkRow[] {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
  if (rows.length < 2) return [];
  const headers = rows[0] ?? [];
  const titleI = headerIndex(headers, ["작품명", "title", "name"]);
  const artistI = headerIndex(headers, ["작가명", "artist", "작가"]);
  if (titleI < 0 || artistI < 0) return [];
  const yearI = headerIndex(headers, ["제작연도", "연도", "year"]);
  const widthI = headerIndex(headers, ["가로(cm)", "가로", "width"]);
  const heightI = headerIndex(headers, ["세로(cm)", "세로", "height"]);
  const mediumI = headerIndex(headers, ["매체", "medium"]);
  const descI = headerIndex(headers, ["작품 설명", "설명", "description"]);

  const out: ParsedArtworkRow[] = [];
  for (const row of rows.slice(1)) {
    const title = String(row[titleI] ?? "").trim();
    const artistName = String(row[artistI] ?? "").trim();
    if (!title || !artistName) continue;
    out.push({
      title,
      artistName,
      year: yearI >= 0 ? String(row[yearI] ?? "").trim() || null : null,
      widthCm: widthI >= 0 ? numOrNull(row[widthI]) : null,
      heightCm: heightI >= 0 ? numOrNull(row[heightI]) : null,
      medium: mediumI >= 0 ? String(row[mediumI] ?? "").trim() || null : null,
      description: descI >= 0 ? String(row[descI] ?? "").trim() || null : null,
    });
  }
  return out;
}

export function artworkTemplateHeaderLine(): string {
  return ARTWORK_CSV_TEMPLATE_HEADERS.join(",");
}
