import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { artworkSeed, exhibitionSeed, gallerySeed } from "@/lib/data";
import { withSubject } from "@/lib/josa";
import { buildInsightsAnalytics } from "@/lib/leaflet/analytics/insights";
import type { InterestsAnalytics } from "@/lib/leaflet/analytics/interests";
import { buildZonesAnalytics } from "@/lib/leaflet/analytics/zones";
import { buildCheckInMetrics } from "@/lib/leaflet/checkInMetrics";
import { buildExhibitionReport } from "@/lib/leaflet/exhibitionReport";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import {
  EMPTY_INESTIMABLE,
  toExhibitionReportView,
} from "@/lib/leaflet/exhibitionReportView";
import { getStudioFixtures } from "@/lib/mock/studioFixtures";
import { buildExhibitionOpsRows } from "@/lib/studio/exhibitionOps";
import { toCsv } from "@/lib/studio/exportCsv";
import {
  STUDIO_NAV_GROUPS,
  STUDIO_NAV_UNCONTRACTED,
  visibleNavItems,
} from "@/lib/studio/nav";
import {
  CUSTOMER_DATA_PRINCIPLES,
  POSITIONING_BODY,
  POSITIONING_TITLE,
  WIZARD_LABELS,
} from "@/lib/studio/copy";
import {
  buildAllCustomersCsvRows,
  buildExhibitionCustomersCsvRows,
  buildInquiriesCsvRows,
} from "@/lib/studio/studioCsv";
import {
  buildWizardSubmission,
  emptyWizardDraft,
  hydrateWizardDraft,
  removeWizardZone,
  toWizardWork,
  validateWizardStep1,
  type WizardDraft,
} from "@/lib/studio/wizardDraft";
import { canEditGallerySettings } from "@/lib/studioAccess";
import type { Artwork, Gallery } from "@/lib/types";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");
const gallery = (id: string) => gallerySeed.find((g) => g.id === id) as Gallery;
const artworkTitle = (id: string) =>
  [...artworkSeed, ...getStudioFixtures().artworks].find((a) => a.id === id)?.title ?? "";

function csvCtx(role: Parameters<typeof buildAllCustomersCsvRows>[0]["role"], galleryId: string) {
  return {
    role,
    gallery: gallery(galleryId),
    exhibitions: exhibitionSeed,
    artworkTitle,
  };
}

function validDraft(overrides: Partial<WizardDraft> = {}): WizardDraft {
  return {
    ...emptyWizardDraft(),
    title: "새 전시",
    startDate: "2026-12-01",
    endDate: "2026-12-31",
    themeColorName: "Persian Indigo",
    objectives: ["관람객 참여 확대"],
    ...overrides,
  };
}

describe("C2 등록 1단계 테마 색", () => {
  it("테마 색 없이는 1단계를 통과하지 못한다", () => {
    expect(validateWizardStep1(validDraft({ themeColorName: null }), { contracted: true })).toBe(
      "전시 테마 색상을 선택해 주세요.",
    );
    expect(validateWizardStep1(validDraft({ themeColorName: "없는 색" }), { contracted: false })).not.toBeNull();
    expect(validateWizardStep1(validDraft(), { contracted: true })).toBeNull();
    expect(validateWizardStep1(validDraft(), { contracted: false })).toBeNull();
  });

  it("등록 결과의 themeColorName이 고른 65색 이름", () => {
    const out = buildWizardSubmission(validDraft({ themeColorName: "Persian Indigo" }), {
      galleryId: "g-hannam",
      contracted: true,
      exhibitionId: "ex-new",
    });
    expect(out.exhibition.themeColorName).toBe("Persian Indigo");
    const view = toExhibitionReportView(
      buildExhibitionReport({
        ...readExhibitionReportSource("ex-new", undefined, { skipFixtures: true }),
        themeColorName: out.exhibition.themeColorName!,
      }),
    );
    expect(view.themeColorName).toBe("Persian Indigo");
  });

  it("구 형식 초안은 테마 색 null로 복원", () => {
    const draft = hydrateWizardDraft({ title: "x", works: [] } as Partial<WizardDraft>);
    expect(draft.themeColorName).toBeNull();
  });
});

describe("C3 작품별 구역 배정", () => {
  it("서로 다른 구역의 작품 2점 → 구역별 작품 수 1·1, 구역 없으면 null", () => {
    const draft = validDraft({
      zones: [
        { zoneId: "z-a", name: "전실", wallLengthM: 10 },
        { zoneId: "z-b", name: "후실", wallLengthM: 8 },
      ],
      works: [
        toWizardWork(
          { title: "하나", artistName: "가", year: null, widthCm: 50, heightCm: null, medium: null, description: null },
          { workId: "w1", zoneId: "z-a" },
        ),
        toWizardWork(
          { title: "둘", artistName: "나", year: null, widthCm: 60, heightCm: null, medium: null, description: null },
          { workId: "w2", zoneId: "z-b" },
        ),
      ],
    });
    const out = buildWizardSubmission(draft, {
      galleryId: "g-hannam",
      contracted: true,
      exhibitionId: "ex-new",
    });
    expect(out.artworks.map((a) => a.zone)).toEqual(["전실", "후실"]);

    const source = readExhibitionReportSource("ex-new", undefined, { skipFixtures: true });
    const zones = buildZonesAnalytics({
      source,
      zones: out.zones,
      artworks: out.artworks as Artwork[],
    });
    expect(zones.rows.map((r) => [r.name, r.artworkCount])).toEqual([
      ["전실", 1],
      ["후실", 1],
    ]);

    const noZones = buildWizardSubmission(
      { ...draft, zones: [], works: draft.works.map((w) => ({ ...w, zoneId: null })) },
      { galleryId: "g-hannam", contracted: true, exhibitionId: "ex-new" },
    );
    expect(noZones.artworks.every((a) => a.zone === null)).toBe(true);
  });

  it("구역 삭제 시 그 구역 작품은 구역 없음", () => {
    const draft = validDraft({
      zones: [{ zoneId: "z-a", name: "전실", wallLengthM: null }],
      works: [
        toWizardWork(
          { title: "하나", artistName: "가", year: null, widthCm: null, heightCm: null, medium: null, description: null },
          { zoneId: "z-a" },
        ),
      ],
    });
    const next = removeWizardZone(draft, "z-a");
    expect(next.zones).toEqual([]);
    expect(next.works[0]?.zoneId).toBeNull();
  });

  it("비계약 등록은 구역·목표를 저장하지 않는다", () => {
    const out = buildWizardSubmission(validDraft(), {
      galleryId: "g-seochon",
      contracted: false,
      exhibitionId: "ex-u",
    });
    expect(out.zones).toEqual([]);
    expect(out.goals).toBeNull();
    expect(out.exhibition.status).toBe("uncontracted");
  });
});

describe("M3·M5 등록 화면 문구", () => {
  const src = read("app/studio/exhibitions/new/page.tsx");

  it("라벨", () => {
    expect(WIZARD_LABELS).toMatchObject({
      title: "전시명 *",
      gallery: "갤러리 *",
      venue: "전시 장소",
      startDate: "전시 시작일 *",
      endDate: "전시 종료일 *",
      description: "전시 소개",
      objectives: "전시 목표 *",
      prev: "이전 단계",
      next: "다음 단계",
      submit: "등록",
      cancel: "등록 취소",
    });
    expect(src).toContain("readOnly");
    expect(src).toContain("작품 추가");
    expect(src).toContain("removeWork");
  });

  it("부연 문구 삭제", () => {
    for (const text of [
      "전시 기본 정보부터",
      "업계 평균을 의미하지 않습니다",
      "권장 열",
      "구역을 추가해 주세요",
      "아직 불러온 작품이 없습니다",
      "RGB",
    ]) {
      expect(src).not.toContain(text);
    }
  });
});

describe("C4·M5 연동 화면", () => {
  const src = read("app/studio/connections/page.tsx");
  it("회사 카드·2027 없음, 포지셔닝 원칙만", () => {
    for (const text of [
      "Artlogic",
      "Artsy",
      "Artnet",
      "First Thursday",
      "QuRated",
      "2027",
      "현재 구현 범위",
    ]) {
      expect(src).not.toContain(text);
      expect(POSITIONING_BODY).not.toContain(text);
    }
    expect(POSITIONING_TITLE).toBe("포지셔닝 원칙");
    expect(POSITIONING_BODY).toContain("재고·회계·판매·메일링 시스템");
    expect(src).toContain("CSV_EXPORT_LABEL");
    expect(src).toContain("INQUIRY_EXPORT_LABEL");
  });
});

describe("C5·M4 설정", () => {
  it("종료 갤러리는 읽기 전용", () => {
    expect(canEditGallerySettings("gallery-ended", "ended")).toBe(false);
    expect(canEditGallerySettings("gallery-contracted", "ended")).toBe(false);
    expect(canEditGallerySettings("gallery-contracted", "contracted")).toBe(true);
    expect(canEditGallerySettings("gallery-uncontracted", "uncontracted")).toBe(true);
    const src = read("app/studio/settings/page.tsx");
    expect(src).toContain("disabled={!editable}");
    expect(src).toContain("{editable ? (");
    expect(src).not.toContain("갤러리 프로필과 담당자 연락처를 관리합니다");
  });

  it("고객 데이터 운영 원칙 세 항목(HTML)", () => {
    expect(CUSTOMER_DATA_PRINCIPLES.map((p) => p.title)).toEqual([
      "익명 방문 프로필 유지",
      "문의 답변 동의 확인",
      "다음 전시 소식 수신 동의",
    ]);
    expect(CUSTOMER_DATA_PRINCIPLES[0].note).toBe(
      "연락처가 없는 관심 기록은 익명 세션 단위로만 보관",
    );
    expect(read("lib/studio/copy.ts")).toContain('"변경 사항 저장"');
  });
});

describe("M2 네비", () => {
  it("＋ 전시 등록은 전시 관리 다음, 종료 갤러리에서는 숨김", () => {
    const data = STUDIO_NAV_GROUPS.find((g) => g.label === "EXHIBITION DATA")!;
    expect(data.items.map((i) => i.id).slice(0, 2)).toEqual(["exhibitions", "register"]);
    const reg = data.items[1]!;
    expect(`${reg.ico} ${reg.label}`).toBe("＋ 전시 등록");
    expect(reg.href(null)).toBe("/studio/exhibitions/new?step=1");
    expect(visibleNavItems(data.items, true).some((i) => i.id === "register")).toBe(false);
    expect(visibleNavItems(data.items, false).some((i) => i.id === "register")).toBe(true);
    expect(visibleNavItems(STUDIO_NAV_UNCONTRACTED, false).some((i) => i.id === "register")).toBe(true);
    const conn = STUDIO_NAV_GROUPS.flatMap((g) => g.items).find((i) => i.id === "connections")!;
    expect(conn.label).toBe("외부 서비스 연동");
  });

  it("전시 관리 항목은 등록 화면에서 활성화되지 않는다", () => {
    const data = STUDIO_NAV_GROUPS.find((g) => g.label === "EXHIBITION DATA")!;
    expect(data.items[0]!.match("/studio/exhibitions/new")).toBe(false);
    expect(data.items[1]!.match("/studio/exhibitions/new")).toBe(true);
  });
});

describe("M1·M6 전시 관리 표", () => {
  it("열·버튼 라벨", () => {
    const src = read("app/studio/page.tsx");
    const heads = [...src.matchAll(/<th[^>]*>([^<]*)<\/th>/g)].map((m) => m[1]);
    expect(heads.slice(0, 7)).toEqual([
      "전시",
      "기간",
      "상태",
      "참여 작가",
      "작품",
      "고유 체크인",
      "리플릿",
    ]);
    expect(src).toContain("테마 색");
    expect(src).toContain("EMPTY_INESTIMABLE");
    expect(src).not.toContain("데이터 부족");
  });

  it("체크인: 종료 전시는 숫자, 세션 없는 전시는 null(추정 불가)", () => {
    const sessions = getStudioFixtures().checkInSessions;
    const winter = buildCheckInMetrics(sessions, "ex-winter").uniqueCheckIns;
    const tide = buildCheckInMetrics(sessions, "ex-tide", "2025-08-20").uniqueCheckIns;
    expect(winter).toBeGreaterThan(0);
    expect(tide).toBeGreaterThan(0);
    for (const id of ["ex-edge", "ex-pending", "ex-alley"]) {
      expect(buildCheckInMetrics(sessions, id).uniqueCheckIns).toBeNull();
    }
    const rows = buildExhibitionOpsRows({
      exhibitions: exhibitionSeed.filter((e) => ["ex-winter", "ex-edge"].includes(e.id)),
      artworks: [...artworkSeed, ...getStudioFixtures().artworks],
      leafletCounts: {},
      uniqueCheckIns: { "ex-winter": winter, "ex-edge": null },
    });
    const w = rows.find((r) => r.exhibition.id === "ex-winter")!;
    expect(w.uniqueCheckIns).toBe(winter);
    expect(w.artworkCount).toBeGreaterThanOrEqual(8);
    expect(rows.find((r) => r.exhibition.id === "ex-edge")!.uniqueCheckIns).toBeNull();
  });
});

describe("C9 인사이트 용어", () => {
  const interests = (title: string): InterestsAnalytics => ({
    exhibitionId: "ex-a",
    exhibitionTitle: "A",
    totalRecords: 1,
    totalInterests: 1,
    totalInquiries: 0,
    overallRecordToInterestRate: null,
    artworkRows: [],
    recommendationRows: [],
    similarRows: [
      {
        artworkId: "a",
        title,
        exposureCount: 3,
        interestAfter: 1,
        inquiryAfter: 0,
        interestRate: 33,
      },
    ],
  });
  const zones = { exhibitionId: "ex-a", empty: true, rows: [], transitions: [] };

  it("받침에 맞는 조사, 「이(가)」·「추천」 없음", () => {
    expect(withSubject("노을")).toBe("노을이");
    expect(withSubject("바다")).toBe("바다가");
    expect(withSubject("7")).toBe("7이");
    for (const title of ["노을", "바다"]) {
      const card = buildInsightsAnalytics({ goals: null, interests: interests(title), zones }).cards[0]!;
      const all = JSON.stringify(card);
      expect(all).not.toContain("이(가)");
      expect(all).not.toContain("추천");
      expect(card.title).toContain(`${withSubject(title)} 가장 자주 “가장 닮은 작품”`);
    }
  });
});

describe("C7·12 리포트 작품표는 이 전시 작품만", () => {
  it("exhibitionArtworkIds 밖 작품은 표에서 빠진다", () => {
    const source = readExhibitionReportSource("ex-winter", undefined, {});
    const report = buildExhibitionReport(source);
    const own = [...artworkSeed, ...getStudioFixtures().artworks]
      .filter((a) => a.exhibitionId === "ex-winter")
      .map((a) => a.id);
    const unfiltered = toExhibitionReportView(report, {});
    const filtered = toExhibitionReportView(report, { exhibitionArtworkIds: own });
    expect(filtered.artworkRows.every((r) => own.includes(r.artworkId))).toBe(true);
    expect(filtered.artworkRows.length).toBeLessThanOrEqual(unfiltered.artworkRows.length);
    expect(filtered.artworkRows.some((r) => r.artworkId.startsWith("aw-study"))).toBe(false);
    expect(filtered.artworkRows.some((r) => /^aw-/.test(r.label))).toBe(false);
  });
});

describe("M6 / 11 리포트 체크인 표시", () => {
  it("종료 전시는 추이·KPI가 숫자, 추천 후 관심 등록만 추정 불가", () => {
    const source = readExhibitionReportSource("ex-winter", undefined, {});
    const view = toExhibitionReportView(buildExhibitionReport(source), {
      totalRecords: 1,
      checkIn: buildCheckInMetrics(source.checkInSessions ?? [], "ex-winter"),
    });
    expect(view.visitTrendEmpty).toBeNull();
    expect(view.hourlyTrendEmpty).toBeNull();
    expect(view.visitTrend.length).toBeGreaterThanOrEqual(2);
    expect(view.hourlyTrend.length).toBeGreaterThanOrEqual(2);
    const nulls = view.kpis.filter((k) => k.value === null).map((k) => k.label);
    expect(nulls).toEqual(["추천 후 관심 등록"]);
    const src = read("components/leaflet/ExhibitionReportView.tsx");
    expect(src).toContain("EMPTY_INESTIMABLE");
    expect(EMPTY_INESTIMABLE).toBe("추정 불가");
  });

  it("세션 없는 전시는 추정 불가", () => {
    const source = readExhibitionReportSource("ex-edge", undefined, {});
    const view = toExhibitionReportView(buildExhibitionReport(source), {
      checkIn: buildCheckInMetrics(source.checkInSessions ?? [], "ex-edge"),
    });
    expect(view.visitTrendEmpty).toBe(EMPTY_INESTIMABLE);
    expect(view.kpis.find((k) => k.label === "QR 접속")?.value).toBeNull();
  });
});

describe("C6·C10 CSV 범위·열·고객 ID", () => {
  const HASH = /^c-[0-9a-f]{16}$/;

  it("한남 문의 CSV: customer_id는 해시 ID이거나 빈 칸, 이름·작품 ID 없음", () => {
    const rows = buildInquiriesCsvRows(csvCtx("gallery-contracted", "g-hannam"), "ex-winter")!;
    expect(rows).not.toBeNull();
    expect(rows[0]).toEqual([
      "exhibition",
      "inquiry_id",
      "customer_id",
      "artwork",
      "source",
      "message",
      "status",
      "owner",
      "follow_up_date",
      "inquiry_reply_consent",
    ]);
    const body = rows.slice(1);
    expect(body.length).toBeGreaterThan(0);
    const names = new Set(
      getStudioFixtures()
        .inquiries.filter((q) => q.exhibitionId === "ex-winter")
        .map((q) => q.name),
    );
    for (const r of body) {
      const id = String(r[2]);
      expect(id === "" || HASH.test(id)).toBe(true);
      expect(names.has(id)).toBe(false);
      expect(String(r[3])).not.toMatch(/(^|; )aw-/);
    }
    expect(body.some((r) => HASH.test(String(r[2])))).toBe(true);
    expect(toCsv(rows).startsWith("\uFEFF")).toBe(true);
  });

  it("문의 CSV는 선택 전시만", () => {
    const rows = buildInquiriesCsvRows(csvCtx("gallery-contracted", "g-hannam"), "ex-edge")!;
    const ids = new Set(
      getStudioFixtures()
        .inquiries.filter((q) => q.exhibitionId === "ex-edge")
        .map((q) => q.id),
    );
    expect(rows.slice(1).every((r) => ids.has(String(r[1])))).toBe(true);
    expect(rows.length - 1).toBe(ids.size);
  });

  it("비계약·타 갤러리 전시는 파일 없음", () => {
    expect(buildAllCustomersCsvRows(csvCtx("gallery-uncontracted", "g-seochon"))).toBeNull();
    expect(
      buildInquiriesCsvRows(csvCtx("gallery-uncontracted", "g-seochon"), "ex-alley"),
    ).toBeNull();
    expect(
      buildExhibitionCustomersCsvRows(csvCtx("gallery-contracted", "g-hannam"), "ex-alley"),
    ).toBeNull();
    expect(buildInquiriesCsvRows(csvCtx("gallery-contracted", "g-hannam"), "ex-tide")).toBeNull();
  });

  it("해변 컷오프: 컷오프 뒤 문의·고객이 CSV에 없고 경계 이전은 있다", () => {
    const ctx = csvCtx("gallery-ended", "g-busan");
    const inquiries = buildInquiriesCsvRows(ctx, "ex-tide")!;
    const after = getStudioFixtures().inquiries.filter(
      (q) => q.exhibitionId === "ex-tide" && Date.parse(q.createdAt) > Date.parse("2025-08-20T23:59:59.999+09:00"),
    );
    const inContract = getStudioFixtures().inquiries.filter(
      (q) => q.exhibitionId === "ex-tide" && Date.parse(q.createdAt) <= Date.parse("2025-08-20T23:59:59.999+09:00"),
    );
    expect(after.length).toBeGreaterThanOrEqual(2);
    expect(inContract.length).toBeGreaterThan(0);
    const ids = new Set(inquiries.slice(1).map((r) => String(r[1])));
    for (const q of after) expect(ids.has(q.id)).toBe(false);
    for (const q of inContract) expect(ids.has(q.id)).toBe(true);

    const text = toCsv(buildAllCustomersCsvRows(ctx)!) + toCsv(buildExhibitionCustomersCsvRows(ctx, "ex-tide")!);
    for (const q of after) {
      if (!inContract.some((c) => c.contactValue.trim().toLowerCase() === q.contactValue.trim().toLowerCase())) {
        expect(text).not.toContain(q.contactValue.trim());
      }
    }
  });

  it("전체·전시별 고객 CSV 머리글", () => {
    const ctx = csvCtx("gallery-contracted", "g-hannam");
    const all = buildAllCustomersCsvRows(ctx)!;
    expect(all[0]!.join(",")).toBe(
      "고객ID,이름,최초 확보 전시,이메일,전화번호,방문 전시,방문 횟수,문의 수,전시 소식 동의,메모",
    );
    expect(all.length).toBeGreaterThan(1);
    expect(all.slice(1).every((r) => HASH.test(String(r[0])))).toBe(true);
    const ex = buildExhibitionCustomersCsvRows(ctx, "ex-winter")!;
    expect(ex[0]!.join(",")).toBe(
      "customer_id,display_name,registration_source,email,phone,inquiry_reply_consent,newsletter_consent,internal_memo,interest_artworks_in_selected_exhibition,recommended_similar_artworks_in_selected_exhibition,inquiry_count_in_selected_exhibition,owner,last_activity",
    );
    expect(ex.length).toBeGreaterThan(1);
    expect(ex.length).toBeLessThanOrEqual(all.length);
  });

  it("추천 이력 CSV customer_id는 해시 ID", async () => {
    const { buildRecommendationHistoryRows } = await import("@/lib/leaflet/analytics/interests");
    const rows = buildRecommendationHistoryRows(
      readExhibitionReportSource("ex-winter", undefined, {}),
    );
    expect(rows.length).toBeGreaterThan(0);
    const names = new Set(getStudioFixtures().inquiries.map((q) => q.name));
    for (const r of rows) {
      expect(r.customerId === "" || HASH.test(r.customerId)).toBe(true);
      expect(names.has(r.customerId)).toBe(false);
      expect(r.recommendedArtwork).not.toMatch(/^aw-/);
    }
    expect(rows.some((r) => HASH.test(r.customerId))).toBe(true);
  });
});

describe("M9 eslint 규칙 관련", () => {
  it("계약 안내 문구의 작은따옴표는 이스케이프", () => {
    expect(read("app/studio/contract/page.tsx")).toContain("LET&apos;S TALK");
  });
});
