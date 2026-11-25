import { describe, expect, it } from "vitest";
import { buildCheckInMetrics } from "@/lib/leaflet/checkInMetrics";
import { filterSourceByContractEnd } from "@/lib/leaflet/contractCutoff";
import { buildExhibitionReport } from "@/lib/leaflet/exhibitionReport";
import { readExhibitionReportSource } from "@/lib/leaflet/exhibitionReportSource";
import { toExhibitionReportView, totalRecordsFromLeaflets } from "@/lib/leaflet/exhibitionReportView";
import { listStudioInquiries, updateInquiry } from "@/lib/leaflet/inquiry";
import { FIXTURE_SEED } from "@/lib/mock/seededRandom";
import {
  FIXTURE_COUNTS,
  buildStudioFixtures,
  resetStudioFixturesCache,
} from "@/lib/mock/studioFixtures";

describe("studioFixtures", () => {
  it("같은 시드면 깊은 비교 같음", () => {
    const a = buildStudioFixtures(FIXTURE_SEED);
    const b = buildStudioFixtures(FIXTURE_SEED);
    expect(a.leaflets).toEqual(b.leaflets);
    expect(a.inquiries).toEqual(b.inquiries);
    expect(a.interests).toEqual(b.interests);
    expect(a.checkInSessions).toEqual(b.checkInSessions);
  });

  it("고정 수량·상태·스타일·판매 결과 커버", () => {
    const fx = buildStudioFixtures();
    expect(
      fx.leaflets.filter((l) => l.exhibitionId === "ex-winter"),
    ).toHaveLength(FIXTURE_COUNTS.winterLeaflets);
    expect(
      fx.leaflets.filter(
        (l) =>
          l.exhibitionId === "ex-tide" &&
          !String(l.id).includes("after"),
      ),
    ).toHaveLength(FIXTURE_COUNTS.tideLeafletsInContract);
    expect(
      fx.leaflets.filter((l) => String(l.id).includes("lf-t-after")),
    ).toHaveLength(FIXTURE_COUNTS.tideLeafletsAfter);
    expect(
      fx.leaflets.filter((l) => l.exhibitionId === "ex-edge"),
    ).toHaveLength(FIXTURE_COUNTS.edgeLeaflets);

    const statuses = new Set(fx.inquiries.map((q) => q.status));
    expect([...statuses].sort()).toEqual(
      ["신규", "연락 완료", "후속 예정", "종료"].sort(),
    );
    const sales = new Set(fx.inquiries.map((q) => q.saleResult));
    expect(sales.has(null)).toBe(true);
    expect(sales.has("판매됨")).toBe(true);
    expect(sales.has("렌탈됨")).toBe(true);
    expect(sales.has("해당 없음")).toBe(true);

    const styles = new Set(
      fx.leaflets.map((l) => l.result?.style).filter(Boolean),
    );
    expect(styles.has("collector")).toBe(true);
    expect(styles.has("explorer")).toBe(true);
    expect(styles.has("immersive")).toBe(true);
    expect(styles.has("walker")).toBe(true);

    expect(
      fx.checkInSessions.some((s) => s.sessionId.startsWith("ck-t-after")),
    ).toBe(true);
  });

  it("해변 컷오프 뒤 id는 필터 후 없고 경계는 남음", () => {
    resetStudioFixturesCache();
    const end = "2025-08-20";
    const source = readExhibitionReportSource("ex-tide", undefined, {
      contractEndAt: end,
    });
    expect(source.leaflets.some((l) => String(l.id).includes("after"))).toBe(
      false,
    );
    expect(
      source.inquiries.some((q) => String(q.id).includes("after")),
    ).toBe(false);
    expect(
      source.checkInSessions?.some((s) => s.sessionId.includes("after")),
    ).toBe(false);
    expect(
      source.leaflets.some((l) => l.recordedAt === "2025-08-20T20:00:00+09:00"),
    ).toBe(true);
    expect(
      source.checkInSessions?.some(
        (s) => s.checkedInAt === "2025-08-20T20:00:00+09:00",
      ),
    ).toBe(true);

    const raw = buildStudioFixtures();
    expect(raw.leaflets.some((l) => String(l.id).includes("after"))).toBe(true);
  });

  it("ex-winter 리포트·체크인 숫자, 추천 후 관심만 추정 불가", () => {
    resetStudioFixturesCache();
    const source = readExhibitionReportSource("ex-winter");
    const report = buildExhibitionReport(source);
    const checkIn = buildCheckInMetrics(source.checkInSessions ?? [], "ex-winter");
    const view = toExhibitionReportView(report, {
      totalRecords: totalRecordsFromLeaflets(source.leaflets, "ex-winter"),
      checkIn,
    });
    expect(view.leafletCount).toBe(FIXTURE_COUNTS.winterLeaflets);
    expect(view.kpis.find((k) => k.label === "QR 접속")?.value).toBe(
      FIXTURE_COUNTS.winterCheckInsOpened,
    );
    expect(view.kpis.find((k) => k.label === "고유 QR 체크인")?.value).toBe(
      FIXTURE_COUNTS.winterCheckInsChecked,
    );
    expect(view.funnel.find((f) => f.label === "기록 시작")?.value).toBe(
      FIXTURE_COUNTS.winterCheckInsRecordStarted,
    );
    expect(view.kpis.find((k) => k.label === "추천 후 관심 등록")?.value).toBeNull();
    expect(view.visitTrendEmpty).toBeNull();
    expect((view.visitTrend?.length ?? 0) >= 2).toBe(true);
    expect((view.hourlyTrend?.length ?? 0) >= 2).toBe(true);

    const qr = view.funnel.find((f) => f.label === "QR 접속")!.value!;
    const ck = view.funnel.find((f) => f.label === "고유 체크인")!.value!;
    const rs = view.funnel.find((f) => f.label === "기록 시작")!.value!;
    const lf = view.funnel.find((f) => f.label === "리플릿 생성")!.value!;
    expect(qr).toBeGreaterThanOrEqual(ck);
    expect(ck).toBeGreaterThanOrEqual(rs);
    expect(rs).toBeGreaterThanOrEqual(lf);
    expect(lf).toBe(view.leafletCount);
  });

  it("ex-edge 체크인 없으면 추정 불가", () => {
    const source = readExhibitionReportSource("ex-edge");
    const checkIn = buildCheckInMetrics(source.checkInSessions ?? [], "ex-edge");
    const view = toExhibitionReportView(buildExhibitionReport(source), {
      totalRecords: 0,
      checkIn,
    });
    expect(view.kpis.find((k) => k.label === "QR 접속")?.value).toBeNull();
    expect(view.visitTrendEmpty).toBe("추정 불가");
  });

  it("관람객 격리: skipFixtures면 fixture 리플릿 없음", () => {
    const withFx = readExhibitionReportSource("ex-winter");
    expect(withFx.leaflets.some((l) => String(l.id).startsWith("lf-w-"))).toBe(
      true,
    );
    const skip = readExhibitionReportSource("ex-winter", undefined, {
      skipFixtures: true,
    });
    expect(skip.leaflets.some((l) => String(l.id).startsWith("lf-w-"))).toBe(
      false,
    );
  });

  it("fixture 문의 상태 변경 후 저장값이 이김", () => {
    resetStudioFixturesCache();
    const fx = buildStudioFixtures();
    const target = fx.inquiries.find((q) => q.exhibitionId === "ex-winter");
    expect(target).toBeTruthy();

    const store: Record<string, string> = {};
    const fakeStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    } as Storage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).localStorage = fakeStorage;

    const updated = updateInquiry(target!.id, { status: "종료" });
    expect(updated?.status).toBe("종료");
    const again = listStudioInquiries().find((q) => q.id === target!.id);
    expect(again?.status).toBe("종료");
    expect(store["restart.inquiries"]).toContain(target!.id);
  });

  it("filterSourceByContractEnd keeps check-in boundary", () => {
    const fx = buildStudioFixtures();
    const source = {
      exhibitionId: "ex-tide",
      exhibitionTitle: "간조",
      themeColorName: "기본",
      leaflets: fx.leaflets.filter((l) => l.exhibitionId === "ex-tide"),
      interests: fx.interests.filter((i) => i.exhibitionId === "ex-tide"),
      inquiries: [],
      events: [],
      zonesByArtwork: {},
      checkInSessions: fx.checkInSessions.filter((s) => s.exhibitionId === "ex-tide"),
    };
    const filtered = filterSourceByContractEnd(source, "2025-08-20");
    expect(
      filtered.checkInSessions?.some(
        (s) => s.checkedInAt === "2025-08-20T20:00:00+09:00",
      ),
    ).toBe(true);
    expect(
      filtered.checkInSessions?.some((s) => s.sessionId.includes("after")),
    ).toBe(false);
  });
});
