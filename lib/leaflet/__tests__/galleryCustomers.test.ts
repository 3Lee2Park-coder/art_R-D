import { describe, expect, it } from "vitest";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import {
  buildCustomersFromSources,
  buildExhibitionCustomers,
  customerIdFromKeys,
} from "@/lib/leaflet/galleryCustomers";
import { KEYS } from "@/lib/storage";
import {
  listExhibitionCustomers,
  listGalleryCustomers,
  getGalleryCustomer,
} from "@/lib/leaflet/galleryCustomers";

function emptySource(
  exhibitionId: string,
  title: string,
): ExhibitionReportSource {
  return {
    exhibitionId,
    exhibitionTitle: title,
    themeColorName: "기본",
    leaflets: [],
    interests: [],
    inquiries: [],
    events: [],
    zonesByArtwork: {},
  };
}

describe("galleryCustomers merge", () => {
  it("같은 이메일(대소문자·공백)은 한 고객", () => {
    const source = emptySource("ex-edge", "경계");
    source.leaflets = [
      { id: "L1", exhibitionId: "ex-edge", recordedAt: "2026-01-01" },
      { id: "L2", exhibitionId: "ex-edge", recordedAt: "2026-01-02" },
    ];
    source.inquiries = [
      {
        id: "q1",
        leafletId: "L1",
        exhibitionId: "ex-edge",
        name: "Kim",
        contactMethod: "email",
        contactValue: " A@B.C ",
        consentContact: true,
        identityKind: "identified",
        createdAt: "2026-01-01T10:00:00.000Z",
      },
      {
        id: "q2",
        leafletId: "L2",
        exhibitionId: "ex-edge",
        name: "Kim",
        contactMethod: "email",
        contactValue: "a@b.c",
        consentContact: true,
        identityKind: "identified",
        createdAt: "2026-01-02T10:00:00.000Z",
      },
    ];
    const list = buildExhibitionCustomers(source);
    expect(list).toHaveLength(1);
    expect(list[0].customerId).toBe(customerIdFromKeys(["email:a@b.c"]));
    expect(list[0].customerId).toMatch(/^c-[0-9a-f]{16}$/);
    expect(list[0].customerId).not.toContain("@");
    expect(list[0].customerId).not.toMatch(/010\d{8}/);
  });

  it("같은 키 묶음이면 같은 해시 ID", () => {
    expect(customerIdFromKeys(["email:a@b.c", "phone:010"])).toBe(
      customerIdFromKeys(["phone:010", "email:a@b.c"]),
    );
  });

  it("같은 숫자 전화(하이픈 유무)은 한 고객", () => {
    const source = emptySource("ex-edge", "경계");
    source.leaflets = [
      { id: "L1", exhibitionId: "ex-edge", recordedAt: "2026-01-01" },
      { id: "L2", exhibitionId: "ex-edge", recordedAt: "2026-01-02" },
    ];
    source.inquiries = [
      {
        id: "q1",
        leafletId: "L1",
        exhibitionId: "ex-edge",
        contactMethod: "phone",
        contactValue: "010-1111-2222",
        consentContact: true,
        createdAt: "2026-01-01T10:00:00.000Z",
      },
      {
        id: "q2",
        leafletId: "L2",
        exhibitionId: "ex-edge",
        contactMethod: "phone",
        contactValue: "01011112222",
        consentContact: true,
        createdAt: "2026-01-02T10:00:00.000Z",
      },
    ];
    expect(buildExhibitionCustomers(source)).toHaveLength(1);
  });

  it("이메일만 다르고 전화가 같으면 한 고객·상세에 이메일 둘", () => {
    const source = emptySource("ex-edge", "경계");
    source.leaflets = [
      { id: "LA", exhibitionId: "ex-edge", recordedAt: "2026-01-01" },
      { id: "LB", exhibitionId: "ex-edge", recordedAt: "2026-01-03" },
    ];
    source.inquiries = [
      {
        id: "qA",
        leafletId: "LA",
        exhibitionId: "ex-edge",
        name: "A",
        contactMethod: "email",
        contactValue: "alpha@x.com",
        consentContact: true,
        identityKind: "identified",
        createdAt: "2026-01-01T10:00:00.000Z",
      },
      {
        id: "qA2",
        leafletId: "LA",
        exhibitionId: "ex-edge",
        contactMethod: "phone",
        contactValue: "010-9999-0000",
        consentContact: true,
        createdAt: "2026-01-01T11:00:00.000Z",
      },
      {
        id: "qB",
        leafletId: "LB",
        exhibitionId: "ex-edge",
        name: "B",
        contactMethod: "email",
        contactValue: "beta@x.com",
        consentContact: true,
        identityKind: "member",
        createdAt: "2026-01-03T10:00:00.000Z",
      },
      {
        id: "qB2",
        leafletId: "LB",
        exhibitionId: "ex-edge",
        contactMethod: "phone",
        contactValue: "01099990000",
        consentContact: true,
        createdAt: "2026-01-03T11:00:00.000Z",
      },
    ];
    const details = buildCustomersFromSources([source]);
    expect(details).toHaveLength(1);
    const d = details[0];
    expect(d.emails.sort()).toEqual(["alpha@x.com", "beta@x.com"]);
    expect(d.phones).toHaveLength(1);
    expect(d.displayKind).toBe("identified");
    expect(d.storedIdentityKinds).toEqual(
      expect.arrayContaining(["identified", "member"]),
    );
  });

  it("익명 세션만 있으면 고객 목록 비움", () => {
    const source = emptySource("ex-edge", "경계");
    source.leaflets = [
      {
        id: "Lan",
        exhibitionId: "ex-edge",
        recordedAt: "2026-01-01",
        result: { style: "walker", typeName: "산책" },
      },
    ];
    source.events = [
      {
        id: "e1",
        at: "2026-01-01T12:00:00.000Z",
        type: "interest_add",
        leafletId: "Lan",
        exhibitionId: "ex-edge",
        visitorKey: "v",
        identityKind: "anonymous",
      },
    ];
    expect(buildExhibitionCustomers(source)).toHaveLength(0);
  });
});

describe("galleryCustomers scope via facade storage", () => {
  function memory(data: Record<string, string>): Storage {
    return {
      getItem: (k) => data[k] ?? null,
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    };
  }

  it("전시별 목록은 해당 전시 고객만", () => {
    const store = memory({
      [KEYS.savedLeaflets]: JSON.stringify([
        {
          id: "L-edge",
          kind: "visit",
          exhibitionId: "ex-edge",
          visitDate: "2026-01-10",
          themeId: null,
          photos: [],
          recommendationArtworkIds: [],
        },
        {
          id: "L-winter",
          kind: "visit",
          exhibitionId: "ex-winter",
          visitDate: "2026-01-11",
          themeId: null,
          photos: [],
          recommendationArtworkIds: [],
        },
      ]),
      [KEYS.inquiries]: JSON.stringify([
        {
          id: "q-edge",
          leafletId: "L-edge",
          exhibitionId: "ex-edge",
          name: "Edge",
          contactMethod: "email",
          contactValue: "edge@x.com",
          consentContact: true,
          createdAt: "2026-01-10T12:00:00.000Z",
        },
        {
          id: "q-winter",
          leafletId: "L-winter",
          exhibitionId: "ex-winter",
          name: "Winter",
          contactMethod: "email",
          contactValue: "winter@x.com",
          consentContact: true,
          createdAt: "2026-01-11T12:00:00.000Z",
        },
      ]),
      [KEYS.interestWorks]: "[]",
      [KEYS.visitorEvents]: "[]",
    });

    const all = listGalleryCustomers({
      galleryId: "g-hannam",
      exhibitionIds: ["ex-edge", "ex-winter"],
      storage: store,
      skipFixtures: true,
    });
    expect(all.map((c) => c.name).sort()).toEqual(["Edge", "Winter"]);

    const edgeOnly = listExhibitionCustomers({
      galleryId: "g-hannam",
      exhibitionIds: ["ex-edge", "ex-winter"],
      exhibitionId: "ex-edge",
      storage: store,
      skipFixtures: true,
    });
    expect(edgeOnly).toHaveLength(1);
    expect(edgeOnly[0].name).toBe("Edge");
    expect(edgeOnly[0].exhibitionIds).toEqual(["ex-edge"]);
  });

  it("종료 컷오프 이후 기록은 고객에 안 들어감", () => {
    const end = "2025-08-20T23:59:59.999Z";
    const store = memory({
      [KEYS.savedLeaflets]: JSON.stringify([
        {
          id: "L-in",
          kind: "visit",
          exhibitionId: "ex-tide",
          visitDate: "2025-08-20",
          themeId: null,
          photos: [],
          recommendationArtworkIds: [],
        },
        {
          id: "L-out",
          kind: "visit",
          exhibitionId: "ex-tide",
          visitDate: "2025-08-21",
          themeId: null,
          photos: [],
          recommendationArtworkIds: [],
        },
      ]),
      [KEYS.inquiries]: JSON.stringify([
        {
          id: "q-in",
          leafletId: "L-in",
          exhibitionId: "ex-tide",
          name: "In",
          contactMethod: "email",
          contactValue: "in@x.com",
          consentContact: true,
          createdAt: "2025-08-20T12:00:00.000Z",
        },
        {
          id: "q-out",
          leafletId: "L-out",
          exhibitionId: "ex-tide",
          name: "Out",
          contactMethod: "email",
          contactValue: "out@x.com",
          consentContact: true,
          createdAt: "2025-08-21T12:00:00.000Z",
        },
      ]),
      [KEYS.interestWorks]: "[]",
      [KEYS.visitorEvents]: "[]",
    });

    const list = listGalleryCustomers({
      galleryId: "g-busan",
      exhibitionIds: ["ex-tide"],
      contractEndAt: end,
      storage: store,
      skipFixtures: true,
    });
    expect(list.map((c) => c.name)).toEqual(["In"]);

    const detail = getGalleryCustomer({
      galleryId: "g-busan",
      exhibitionIds: ["ex-tide"],
      contractEndAt: end,
      storage: store,
      skipFixtures: true,
      customerId: list[0].customerId,
    });
    expect(detail?.emails).toEqual(["in@x.com"]);
  });
});
