import { beforeEach, describe, expect, it } from "vitest";
import { KEYS } from "@/lib/storage";
import { listVisitorEvents, mergeIdentityForLeaflet } from "@/lib/leaflet/events";
import {
  hasInterest,
  listInterestWorks,
  toggleInterestWork,
} from "@/lib/leaflet/interest";
import {
  listInquiries,
  submitInquiry,
  validateInquiryForm,
} from "@/lib/leaflet/inquiry";
import { resolveIdentityKind } from "@/lib/leaflet/visitorIdentity";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  const local = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: local,
    configurable: true,
  });
});

describe("inquiry validation", () => {
  it("이름·연락 동의 없으면 실패하고, 소식 동의는 필수가 아니다", () => {
    expect(
      validateInquiryForm({
        name: "",
        contactMethod: "email",
        contactValue: "a@b.c",
        consentContact: true,
        consentNews: false,
      }),
    ).toBe("이름을 입력해 주세요.");

    expect(
      validateInquiryForm({
        name: "홍길동",
        contactMethod: "email",
        contactValue: "a@b.c",
        consentContact: false,
        consentNews: false,
      }),
    ).toBe("문의 답변을 위한 연락에 동의해 주세요.");

    expect(
      validateInquiryForm({
        name: "홍길동",
        contactMethod: "email",
        contactValue: "a@b.c",
        consentContact: true,
        consentNews: false,
      }),
    ).toBeNull();

    expect(
      validateInquiryForm({
        name: "홍길동",
        contactMethod: null,
        contactValue: "",
        consentContact: true,
        consentNews: false,
      }),
    ).toBe("연락 수단을 골라 주세요.");
  });
});

describe("interest vs artworkPicks", () => {
  it("관심 토글은 interestWorks만 바꾸고 artworkPicks는 건드리지 않는다", () => {
    localStorage.setItem(KEYS.artworkPicks, JSON.stringify(["aw-keep"]));
    const r1 = toggleInterestWork({
      artworkId: "aw-e01",
      exhibitionId: "ex-edge",
      leafletId: "demo-bright-explorer",
      role: "visitor-guest",
    });
    expect(r1.added).toBe(true);
    expect(hasInterest("demo-bright-explorer", "aw-e01")).toBe(true);
    expect(JSON.parse(localStorage.getItem(KEYS.artworkPicks)!)).toEqual(["aw-keep"]);

    const r2 = toggleInterestWork({
      artworkId: "aw-e01",
      exhibitionId: "ex-edge",
      leafletId: "demo-bright-explorer",
      role: "visitor-guest",
    });
    expect(r2.added).toBe(false);
    expect(listInterestWorks("demo-bright-explorer")).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(KEYS.artworkPicks)!)).toEqual(["aw-keep"]);
  });
});

describe("events and leaflet merge", () => {
  it("문의 열기·제출 이벤트와 문의 레코드를 남긴다", () => {
    toggleInterestWork({
      artworkId: "aw-e01",
      exhibitionId: "ex-edge",
      leafletId: "demo-bright-explorer",
      role: "visitor-guest",
    });
    const result = submitInquiry({
      form: {
        name: "김관람",
        contactMethod: "phone",
        contactValue: "010-1234-5678",
        message: "가격 문의",
        consentContact: true,
        consentNews: true,
      },
      leafletId: "demo-bright-explorer",
      exhibitionId: "ex-edge",
      inquiredArtworkIds: ["aw-e01"],
      role: "visitor-guest",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.inquiry.leafletId).toBe("demo-bright-explorer");
    expect(result.inquiry.inquiredArtworkIds).toEqual(["aw-e01"]);
    expect(result.inquiry.interestArtworkIds).toEqual(["aw-e01"]);
    expect(result.inquiry.consentContact).toBe(true);
    expect(result.inquiry.consentNews).toBe(true);
    expect(result.inquiry.createdAt).toBeTruthy();
    expect(result.inquiry.saleResult).toBeNull();
    expect(result.inquiry.status).toBe("open");
    expect(result.inquiry.identityKind).toBe("identified");

    const events = listVisitorEvents("demo-bright-explorer");
    expect(events.some((e) => e.type === "interest_add")).toBe(true);
    expect(events.some((e) => e.type === "inquiry_submit")).toBe(true);
    expect(events.some((e) => e.type === "identity_merge")).toBe(true);
    expect(listInquiries("demo-bright-explorer")).toHaveLength(1);
  });

  it("익명 관심 후 회원 병합 시 identity_merge와 member 유형", () => {
    toggleInterestWork({
      artworkId: "aw-e02",
      exhibitionId: "ex-edge",
      leafletId: "demo-bright-explorer",
      role: "visitor-guest",
    });
    expect(resolveIdentityKind("visitor-guest", "demo-bright-explorer")).toBe("anonymous");
    mergeIdentityForLeaflet(
      "demo-bright-explorer",
      "anonymous",
      "member",
      "demo-bright-explorer",
    );
    const events = listVisitorEvents("demo-bright-explorer");
    expect(events.some((e) => e.type === "identity_merge")).toBe(true);
    expect(events.filter((e) => e.type === "interest_add")[0]?.identityKind).toBe("member");
    expect(listInterestWorks("demo-bright-explorer")[0]?.artworkId).toBe("aw-e02");
    expect(resolveIdentityKind("visitor-member", "demo-bright-explorer")).toBe("member");
  });
});
