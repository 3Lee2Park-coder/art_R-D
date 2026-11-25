/**
 * 갤러리 스튜디오 CSV 조립. 계약·종료 갤러리만, 자기 전시만, 종료는 컷오프 적용.
 * 행 형식은 exportCsv.ts. 화면(고객·문의·연동)은 모두 여기 함수를 쓴다.
 */

import { isOnOrBeforeContractEnd } from "@/lib/leaflet/contractCutoff";
import {
  listExhibitionCustomerDetails,
  listGalleryCustomerDetails,
} from "@/lib/leaflet/galleryCustomers";
import type { ReportStorage } from "@/lib/leaflet/exhibitionReportSource";
import { listStudioInquiries } from "@/lib/leaflet/inquiry";
import { canViewGalleryCustomers } from "@/lib/leaflet/reportAccess";
import {
  allCustomersCsvRows,
  customerIdByInquiryId,
  exhibitionCustomersCsvRows,
  inquiriesCsvRows,
} from "@/lib/studio/exportCsv";
import type { Exhibition, Gallery, Role } from "@/lib/types";

export type StudioCsvContext = {
  role: Role;
  gallery: Gallery | null | undefined;
  exhibitions: Exhibition[];
  artworkTitle: (artworkId: string) => string;
  storage?: ReportStorage;
};

type Cell = string | number;

function scope(ctx: StudioCsvContext) {
  const galleryId = ctx.gallery?.id ?? null;
  const allowed = canViewGalleryCustomers({
    role: ctx.role,
    myGalleryId: galleryId,
    contractState: ctx.gallery?.contractState,
  });
  if (!allowed || !galleryId) return null;
  const exhibitionIds = ctx.exhibitions
    .filter((e) => e.galleryId === galleryId)
    .map((e) => e.id);
  const contractEndAt =
    ctx.gallery?.contractState === "ended" ? ctx.gallery.contractEndAt : null;
  return { galleryId, exhibitionIds, contractEndAt };
}

/** 전체 고객 CSV (restart-all-customers.csv). 권한 없으면 null → 파일 없음. */
export function buildAllCustomersCsvRows(ctx: StudioCsvContext): Cell[][] | null {
  const s = scope(ctx);
  if (!s) return null;
  return allCustomersCsvRows(
    listGalleryCustomerDetails({ ...s, storage: ctx.storage }),
  );
}

/** 전시별 고객 CSV. 그 전시 고객만. */
export function buildExhibitionCustomersCsvRows(
  ctx: StudioCsvContext,
  exhibitionId: string,
): Cell[][] | null {
  const s = scope(ctx);
  if (!s || !s.exhibitionIds.includes(exhibitionId)) return null;
  return exhibitionCustomersCsvRows(
    listExhibitionCustomerDetails({ ...s, exhibitionId, storage: ctx.storage }),
    ctx.artworkTitle,
  );
}

/** 문의 CSV. 선택 전시의 문의만. */
export function buildInquiriesCsvRows(
  ctx: StudioCsvContext,
  exhibitionId: string,
): Cell[][] | null {
  const s = scope(ctx);
  if (!s || !s.exhibitionIds.includes(exhibitionId)) return null;
  const customerIds = customerIdByInquiryId(
    listGalleryCustomerDetails({ ...s, storage: ctx.storage }),
  );
  const exhibition = ctx.exhibitions.find((e) => e.id === exhibitionId);
  const mine = listStudioInquiries().filter((q) => {
    if (q.exhibitionId !== exhibitionId) return false;
    if (s.contractEndAt && !isOnOrBeforeContractEnd(q.createdAt, s.contractEndAt)) {
      return false;
    }
    return true;
  });
  return inquiriesCsvRows(
    mine.map((q) => ({
      exhibition: exhibition?.title ?? "",
      inquiryId: q.id,
      customerId: customerIds.get(q.id) ?? "",
      artwork: q.inquiredArtworkIds.map((id) => ctx.artworkTitle(id)).join("; "),
      message: q.message ?? "",
      status: q.status,
      replyConsent: q.consentContact,
    })),
  );
}

export const CSV_FILENAMES = {
  allCustomers: "restart-all-customers.csv",
  exhibitionCustomers: "restart-exhibition-customers.csv",
  inquiries: "restart-inquiries.csv",
} as const;
