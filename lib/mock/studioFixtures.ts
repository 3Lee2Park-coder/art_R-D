/**
 * Gallery studio fixtures (STEP 5j).
 * Deterministic mock data for ended / in-progress exhibition reports.
 * Do not surface this label in UI, CSV, or filenames.
 */

import type { InterestWork } from "@/lib/leaflet/interest";
import type {
  ExhibitionReportSourceInquiry,
  ExhibitionReportSourceLeaflet,
} from "@/lib/leaflet/exhibitionReport";
import type { VisitorEvent } from "@/lib/leaflet/events";
import type { Inquiry } from "@/lib/leaflet/inquiry";
import {
  FIXTURE_SEED,
  intBetween,
  mulberry32,
  pick,
} from "@/lib/mock/seededRandom";
import type {
  Artist,
  Artwork,
  ExhibitionGoals,
  ExhibitionZone,
} from "@/lib/types";

export type CheckInSession = {
  sessionId: string;
  exhibitionId: string;
  checkedInAt: string | null;
  source: "qr";
  openedAt: string;
  recordStartedAt: string | null;
};

export type StudioFixtures = {
  artworks: Artwork[];
  artists: Artist[];
  zones: ExhibitionZone[];
  goals: ExhibitionGoals[];
  leaflets: ExhibitionReportSourceLeaflet[];
  interests: InterestWork[];
  inquiries: Inquiry[];
  events: VisitorEvent[];
  checkInSessions: CheckInSession[];
};

const EMOTION_IDS = [
  "happiness",
  "joy",
  "curiosity",
  "awe",
  "sadness",
  "sophistication",
  "sensuous",
  "compassion",
] as const;

const STYLES = [
  { id: "collector" as const, typeName: "컬러 수집가" },
  { id: "explorer" as const, typeName: "설렘 탐험가" },
  { id: "immersive" as const, typeName: "몰입가" },
  { id: "walker" as const, typeName: "오늘의 산책자" },
];

const RESTART_ARTWORK_IDS = ["aw-study", "aw-plane", "aw-window", "aw-navy"];

const STATUSES = ["신규", "연락 완료", "후속 예정", "종료"] as const;
const SALES = [null, "판매됨", "렌탈됨", "해당 없음"] as const;

const NAMES = [
  "설하린",
  "도예나",
  "한누리",
  "채이서",
  "류건우",
  "배수진",
  "오세린",
  "진마루",
  "강이현",
  "문다올",
  "표시온",
  "연가람",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isoKst(y: number, m: number, d: number, h: number, min: number) {
  return `${y}-${pad2(m)}-${pad2(d)}T${pad2(h)}:${pad2(min)}:00+09:00`;
}

function dateOnly(y: number, m: number, d: number) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function daysInRange(
  start: string,
  end: string,
): { y: number; m: number; d: number }[] {
  const out: { y: number; m: number; d: number }[] = [];
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const cur = new Date(Date.UTC(sy!, sm! - 1, sd!));
  const last = new Date(Date.UTC(ey!, em! - 1, ed!));
  while (cur <= last) {
    out.push({
      y: cur.getUTCFullYear(),
      m: cur.getUTCMonth() + 1,
      d: cur.getUTCDate(),
    });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

function makeRecords(
  rng: () => number,
  artworkIds: string[],
  count: number,
): ExhibitionReportSourceLeaflet["records"] {
  const records = [];
  let at = intBetween(rng, 0, 40);
  for (let i = 0; i < count; i++) {
    records.push({
      artworkId: pick(rng, artworkIds),
      source: (rng() < 0.85 ? "camera" : "map") as "camera" | "map",
      atSec: at,
      movingSec: intBetween(rng, 0, 25),
      emotionId: rng() < 0.7 ? pick(rng, EMOTION_IDS) : null,
    });
    at += intBetween(rng, 20, 90);
  }
  return records;
}

type BuildCtx = {
  rng: () => number;
  leaflets: ExhibitionReportSourceLeaflet[];
  interests: InterestWork[];
  inquiries: Inquiry[];
  events: VisitorEvent[];
  checkInSessions: CheckInSession[];
};

function addLeafletBundle(
  ctx: BuildCtx,
  input: {
    exhibitionId: string;
    leafletId: string;
    visitDate: string;
    recordedAt: string;
    artworkIds: string[];
    similarId: string;
    styleIndex: number;
    identity: "identified" | "member" | "anonymous";
    name: string;
    email?: string;
    phone?: string;
    consentNews: boolean;
    withInquiry?: {
      status: (typeof STATUSES)[number];
      sale: (typeof SALES)[number];
      inquired: string[];
      createdAt: string;
    };
    interestIds?: string[];
    generateAtSec?: number;
  },
) {
  const style = STYLES[input.styleIndex % STYLES.length]!;
  const records = makeRecords(
    ctx.rng,
    input.artworkIds,
    intBetween(ctx.rng, 2, 8),
  );
  const lastAt = records?.[records.length - 1]?.atSec ?? 60;
  ctx.leaflets.push({
    id: input.leafletId,
    exhibitionId: input.exhibitionId,
    recordedAt: input.recordedAt,
    records,
    generateAtSec: input.generateAtSec ?? lastAt + intBetween(ctx.rng, 30, 120),
    recommendationArtworkIds: [pick(ctx.rng, RESTART_ARTWORK_IDS)],
    result: {
      style: style.id,
      typeName: style.typeName,
      similar: { artworkId: input.similarId },
    },
  });

  for (const artId of input.interestIds ?? []) {
    ctx.interests.push({
      artworkId: artId,
      exhibitionId: input.exhibitionId,
      leafletId: input.leafletId,
      addedAt: input.recordedAt,
    });
  }

  if (input.withInquiry && input.identity !== "anonymous") {
    const inqId = `inq-fx-${input.leafletId}`;
    const method = input.email ? "email" : "phone";
    const value = input.email ?? input.phone ?? "010-0000-0000";
    const inquiry: Inquiry = {
      id: inqId,
      createdAt: input.withInquiry.createdAt,
      leafletId: input.leafletId,
      exhibitionId: input.exhibitionId,
      inquiredArtworkIds: input.withInquiry.inquired,
      interestArtworkIds: input.interestIds ?? [],
      name: input.name,
      contactMethod: method,
      contactValue: value,
      message: "작품 문의드립니다.",
      consentContact: true,
      consentNews: input.consentNews,
      identityKind: input.identity,
      status: input.withInquiry.status,
      saleResult: input.withInquiry.sale,
    };
    ctx.inquiries.push(inquiry);
    ctx.events.push({
      id: `evt-inq-${input.leafletId}`,
      type: "inquiry_submit",
      at: input.withInquiry.createdAt,
      leafletId: input.leafletId,
      exhibitionId: input.exhibitionId,
      visitorKey: `vk-${input.leafletId}`,
      identityKind: input.identity,
      artworkId: input.withInquiry.inquired[0],
      payload: {
        consentContact: true,
        consentNews: input.consentNews,
        contactMethod: method,
        inquiredArtworkIds: input.withInquiry.inquired,
        interestArtworkIds: input.interestIds ?? [],
      },
    });
  } else if (input.identity === "anonymous") {
    ctx.events.push({
      id: `evt-anon-${input.leafletId}`,
      type: "inquiry_open",
      at: input.recordedAt,
      leafletId: input.leafletId,
      exhibitionId: input.exhibitionId,
      visitorKey: `vk-${input.leafletId}`,
      identityKind: "anonymous",
    });
  }

  if (input.email && input.consentNews && input.identity !== "anonymous") {
    ctx.events.push({
      id: `evt-news-${input.leafletId}`,
      type: "news_subscribe",
      at: input.recordedAt,
      leafletId: input.leafletId,
      exhibitionId: input.exhibitionId,
      visitorKey: `vk-${input.leafletId}`,
      identityKind: input.identity,
      payload: {
        contactMethod: "email",
        contactValue: input.email,
        consentNews: true,
      },
    });
  }
}

function buildWinter(ctx: BuildCtx): {
  artworks: Artwork[];
  artists: Artist[];
  zones: ExhibitionZone[];
  goals: ExhibitionGoals;
} {
  const artists: Artist[] = [
    { id: "ar-fx-w1", name: "권미래", bio: null, imageUrl: null },
    { id: "ar-fx-w2", name: "서다흰", bio: null, imageUrl: null },
  ];
  const zones: ExhibitionZone[] = [
    {
      exhibitionId: "ex-winter",
      zoneId: "zw-jeonsil",
      name: "전실",
      wallLengthM: 8.5,
    },
    {
      exhibitionId: "ex-winter",
      zoneId: "zw-hall",
      name: "중정",
      wallLengthM: 12,
    },
    {
      exhibitionId: "ex-winter",
      zoneId: "zw-end",
      name: "끝방",
      wallLengthM: 6.2,
    },
  ];
  const winterArts: Artwork[] = [
    {
      id: "aw-w-fx01",
      title: "첫서리",
      artistId: "ar-fx-w1",
      exhibitionId: "ex-winter",
      zone: "전실",
      imageUrl: "/images/artworks/grain.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 60,
    },
    {
      id: "aw-w-fx02",
      title: "흰 숨",
      artistId: "ar-fx-w2",
      exhibitionId: "ex-winter",
      zone: "전실",
      imageUrl: "/images/artworks/white.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 45,
    },
    {
      id: "aw-w-fx03",
      title: "중정의 그림자",
      artistId: "ar-fx-w1",
      exhibitionId: "ex-winter",
      zone: "중정",
      imageUrl: "/images/artworks/fold.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 80,
    },
    {
      id: "aw-w-fx04",
      title: "얇은 얼음",
      artistId: "ar-fx-w2",
      exhibitionId: "ex-winter",
      zone: "중정",
      imageUrl: "/images/artworks/edge.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 55,
    },
    {
      id: "aw-w-fx05",
      title: "끝방의 온기",
      artistId: "ar-fx-w1",
      exhibitionId: "ex-winter",
      zone: "끝방",
      imageUrl: "/images/artworks/navy.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 70,
    },
    {
      id: "aw-w-fx06",
      title: "남은 결",
      artistId: "ar-fx-w2",
      exhibitionId: "ex-winter",
      zone: "끝방",
      imageUrl: "/images/artworks/window.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 50,
    },
  ];
  // ensure seed works have width for occupancy
  const seedWidth: Artwork[] = [
    {
      id: "aw-grain",
      title: "결",
      artistId: "a-haram",
      exhibitionId: "ex-winter",
      zone: "전실",
      imageUrl: "/images/artworks/grain.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 65,
    },
    {
      id: "aw-white",
      title: "흰",
      artistId: "a-seorin",
      exhibitionId: "ex-winter",
      zone: "전실",
      imageUrl: "/images/artworks/white.svg",
      description: null,
      priceKrw: null,
      forSale: false,
      likeCount: 0,
      widthCm: 40,
    },
  ];

  const artIds = [
    "aw-grain",
    "aw-white",
    ...winterArts.map((a) => a.id),
  ];
  const days = daysInRange("2026-01-08", "2026-03-02");
  const hours = [10, 11, 14, 15, 18, 19];

  for (let i = 0; i < 40; i++) {
    const day = days[i % days.length]!;
    const hour = hours[i % hours.length]!;
    const recordedAt = isoKst(day.y, day.m, day.d, hour, (i * 7) % 50);
    const visitDate = dateOnly(day.y, day.m, day.d);
    const identity =
      i % 7 === 0 ? "anonymous" : i % 5 === 0 ? "member" : "identified";
    const name = NAMES[i % NAMES.length]!;
    const email =
      identity === "anonymous"
        ? undefined
        : i === 1
          ? " Han.Nuri@Example.com "
          : i === 2
            ? "han.nuri@example.com"
            : `winter${pad2(i)}@example.com`;
    const phone =
      identity === "anonymous"
        ? undefined
        : i === 3
          ? "010-0000-0101"
          : i === 4
            ? "01000000101"
            : i === 5
              ? "010 0000 0101"
              : `010-0000-${String(2000 + i).slice(-4)}`;

    // same name different contacts → two people (i=10,11)
    const displayName = i === 11 ? NAMES[10]! : name;

    addLeafletBundle(ctx, {
      exhibitionId: "ex-winter",
      leafletId: `lf-w-${pad2(i)}`,
      visitDate,
      recordedAt,
      artworkIds: artIds,
      similarId: artIds[i % artIds.length]!,
      styleIndex: i,
      identity,
      name: displayName,
      email: i === 4 || i === 5 ? undefined : email,
      phone: i === 1 || i === 2 ? undefined : phone,
      consentNews: i % 3 !== 0,
      interestIds:
        i === 0
          ? [artIds[0]!, RESTART_ARTWORK_IDS[0]!]
          : i % 4 === 0
            ? [artIds[i % artIds.length]!]
            : i % 4 === 1
              ? [RESTART_ARTWORK_IDS[i % RESTART_ARTWORK_IDS.length]!]
              : [],
      withInquiry:
        identity === "anonymous"
          ? undefined
          : i < 12
            ? {
                status: STATUSES[i % 4]!,
                sale: SALES[i % 4]!,
                inquired:
                  i % 3 === 0
                    ? [artIds[i % artIds.length]!]
                    : i % 3 === 1
                      ? [RESTART_ARTWORK_IDS[0]!]
                      : [],
                createdAt: recordedAt,
              }
            : i % 6 === 0
              ? {
                  status: "신규",
                  sale: null,
                  inquired: [artIds[0]!],
                  createdAt: recordedAt,
                }
              : undefined,
    });
  }

  // check-ins: more than leaflets, spread hours
  for (let i = 0; i < 48; i++) {
    const day = days[i % days.length]!;
    const hour = hours[i % hours.length]!;
    const openedAt = isoKst(day.y, day.m, day.d, hour, (i * 3) % 55);
    const hasCheckin = i < 45;
    const hasRecord = i < 42;
    ctx.checkInSessions.push({
      sessionId: `ck-w-${pad2(i)}`,
      exhibitionId: "ex-winter",
      source: "qr",
      openedAt,
      checkedInAt: hasCheckin
        ? isoKst(day.y, day.m, day.d, hour, ((i * 3) % 55) + 1)
        : null,
      recordStartedAt: hasRecord
        ? isoKst(day.y, day.m, day.d, hour, ((i * 3) % 55) + 2)
        : null,
    });
  }

  return {
    artworks: [...seedWidth, ...winterArts],
    artists,
    zones,
    goals: {
      exhibitionId: "ex-winter",
      objectives: ["작품 문의 및 소장 관심 유도"],
      targets: { records: 200, interests: 40, inquiries: 15 },
    },
  };
}

function buildTide(ctx: BuildCtx): {
  artworks: Artwork[];
  artists: Artist[];
  zones: ExhibitionZone[];
  goals: ExhibitionGoals;
} {
  const artists: Artist[] = [
    { id: "ar-fx-t1", name: "배해율", bio: null, imageUrl: null },
    { id: "ar-fx-t2", name: "윤모래", bio: null, imageUrl: null },
  ];
  const zones: ExhibitionZone[] = [
    {
      exhibitionId: "ex-tide",
      zoneId: "zt-main",
      name: "본관",
      wallLengthM: 10,
    },
    {
      exhibitionId: "ex-tide",
      zoneId: "zt-side",
      name: "옆방",
      wallLengthM: 7.5,
    },
  ];
  const artworks: Artwork[] = Array.from({ length: 6 }, (_, i) => ({
    id: `aw-t-fx${pad2(i + 1)}`,
    title: `간조 ${i + 1}`,
    artistId: i % 2 === 0 ? "ar-fx-t1" : "ar-fx-t2",
    exhibitionId: "ex-tide",
    zone: i < 3 ? "본관" : "옆방",
    imageUrl: "/images/artworks/plane.svg",
    description: null,
    priceKrw: null,
    forSale: false,
    likeCount: 0,
    widthCm: 40 + i * 8,
  }));
  const artIds = artworks.map((a) => a.id);
  const days = daysInRange("2025-07-01", "2025-08-20");
  const hours = [9, 11, 13, 16, 18];

  for (let i = 0; i < 30; i++) {
    const day = days[i % days.length]!;
    const hour = hours[i % hours.length]!;
    const recordedAt =
      i === 0
        ? "2025-08-20T20:00:00+09:00"
        : isoKst(day.y, day.m, day.d, hour, (i * 5) % 50);
    addLeafletBundle(ctx, {
      exhibitionId: "ex-tide",
      leafletId: `lf-t-${pad2(i)}`,
      visitDate: recordedAt.slice(0, 10),
      recordedAt,
      artworkIds: artIds,
      similarId: artIds[i % artIds.length]!,
      styleIndex: i,
      identity: i % 6 === 0 ? "anonymous" : "identified",
      name: NAMES[(i + 3) % NAMES.length]!,
      email: `tide${pad2(i)}@example.com`,
      phone: `010-0000-${String(3000 + i).slice(-4)}`,
      consentNews: i % 2 === 0,
      interestIds: i % 3 === 0 ? [artIds[0]!] : [],
      withInquiry:
        i % 6 === 0
          ? undefined
          : i < 8
            ? {
                status: STATUSES[i % 4]!,
                sale: SALES[i % 4]!,
                inquired: i % 2 === 0 ? [artIds[0]!] : [RESTART_ARTWORK_IDS[1]!],
                createdAt: recordedAt,
              }
            : undefined,
    });
  }

  // after cutoff leaflets / inquiries / interests
  for (let i = 0; i < 3; i++) {
    const recordedAt = isoKst(2025, 8, 22 + i, 11, 0);
    addLeafletBundle(ctx, {
      exhibitionId: "ex-tide",
      leafletId: `lf-t-after-${i}`,
      visitDate: recordedAt.slice(0, 10),
      recordedAt,
      artworkIds: artIds,
      similarId: artIds[0]!,
      styleIndex: i,
      identity: "identified",
      name: "컷오프뒤손님",
      email: `tide-after${i}@example.com`,
      phone: `010-0000-${String(9000 + i).slice(-4)}`,
      consentNews: true,
      interestIds: i === 0 ? [artIds[0]!] : [],
      withInquiry:
        i < 2
          ? {
              status: "신규",
              sale: null,
              inquired: [artIds[0]!],
              createdAt: isoKst(2025, 8, 21 + i, 10, 0),
            }
          : undefined,
    });
  }

  for (let i = 0; i < 36; i++) {
    const day = days[i % days.length]!;
    const hour = hours[i % hours.length]!;
    const openedAt =
      i === 0
        ? "2025-08-20T20:00:00+09:00"
        : isoKst(day.y, day.m, day.d, hour, (i * 4) % 50);
    ctx.checkInSessions.push({
      sessionId: `ck-t-${pad2(i)}`,
      exhibitionId: "ex-tide",
      source: "qr",
      openedAt,
      checkedInAt:
        i < 34
          ? i === 0
            ? "2025-08-20T20:00:00+09:00"
            : isoKst(day.y, day.m, day.d, hour, ((i * 4) % 50) + 1)
          : null,
      recordStartedAt:
        i < 32
          ? i === 0
            ? "2025-08-20T20:05:00+09:00"
            : isoKst(day.y, day.m, day.d, hour, ((i * 4) % 50) + 2)
          : null,
    });
  }
  for (let i = 0; i < 3; i++) {
    const at = isoKst(2025, 8, 21, 10 + i, 0);
    ctx.checkInSessions.push({
      sessionId: `ck-t-after-${i}`,
      exhibitionId: "ex-tide",
      source: "qr",
      openedAt: at,
      checkedInAt: at,
      recordStartedAt: at,
    });
  }

  return {
    artworks,
    artists,
    zones,
    goals: {
      exhibitionId: "ex-tide",
      objectives: ["관람객 참여 확대"],
      targets: { records: 150, interests: 30, inquiries: 10 },
    },
  };
}

function buildEdge(ctx: BuildCtx) {
  const edgeArts = [
    "aw-plane",
    "aw-window",
    "aw-navy",
    "aw-fold",
    "aw-edge",
  ];
  for (let i = 0; i < 6; i++) {
    const recordedAt = isoKst(2026, 10, 10 + i, 14, 0);
    // multi-exhibition visitors shared with winter (same email/phone)
    const shared = i < 2;
    addLeafletBundle(ctx, {
      exhibitionId: "ex-edge",
      leafletId: `lf-e-${pad2(i)}`,
      visitDate: recordedAt.slice(0, 10),
      recordedAt,
      artworkIds: edgeArts,
      similarId: edgeArts[i % edgeArts.length]!,
      styleIndex: i,
      identity: "identified",
      name: shared ? (i === 0 ? "한누리" : NAMES[3]!) : NAMES[(i + 4) % NAMES.length]!,
      email: shared
        ? i === 0
          ? "han.nuri@example.com"
          : "winter03@example.com"
        : `edge${pad2(i)}@example.com`,
      phone: shared
        ? i === 0
          ? "010-0000-0101"
          : "010-0000-2003"
        : `010-0000-${String(4000 + i).slice(-4)}`,
      consentNews: true,
      interestIds: [edgeArts[0]!],
      withInquiry: {
        status: STATUSES[i % 4]!,
        sale: SALES[i % 4]!,
        inquired: [edgeArts[i % edgeArts.length]!],
        createdAt: recordedAt,
      },
    });
  }
}

let cached: StudioFixtures | null = null;

export function buildStudioFixtures(seed = FIXTURE_SEED): StudioFixtures {
  const rng = mulberry32(seed);
  const ctx: BuildCtx = {
    rng,
    leaflets: [],
    interests: [],
    inquiries: [],
    events: [],
    checkInSessions: [],
  };
  const winter = buildWinter(ctx);
  const tide = buildTide(ctx);
  buildEdge(ctx);

  return {
    artworks: [...winter.artworks, ...tide.artworks],
    artists: [...winter.artists, ...tide.artists],
    zones: [...winter.zones, ...tide.zones],
    goals: [winter.goals, tide.goals],
    leaflets: ctx.leaflets,
    interests: ctx.interests,
    inquiries: ctx.inquiries,
    events: ctx.events,
    checkInSessions: ctx.checkInSessions,
  };
}

export function getStudioFixtures(): StudioFixtures {
  if (!cached) cached = buildStudioFixtures();
  return cached;
}

export function resetStudioFixturesCache() {
  cached = null;
}

/** Fixed counts for tests */
export const FIXTURE_COUNTS = {
  winterLeaflets: 40,
  tideLeafletsInContract: 30,
  tideLeafletsAfter: 3,
  edgeLeaflets: 6,
  winterCheckInsOpened: 48,
  winterCheckInsChecked: 45,
  winterCheckInsRecordStarted: 42,
  tideCheckInsOpenedInContract: 36,
  tideCheckInsAfter: 3,
} as const;
