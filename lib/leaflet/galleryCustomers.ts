/**
 * 갤러리 고객 목록·상세 파사드. 소스는 readExhibitionReportSource만.
 */

import { exhibitionSeed } from "@/lib/data";
import type { ExhibitionReportSource } from "@/lib/leaflet/exhibitionReport";
import {
  readExhibitionReportSource,
  type ReportStorage,
} from "@/lib/leaflet/exhibitionReportSource";
import {
  buildCustomersFromSources,
  buildExhibitionCustomers,
  type GalleryCustomerDetail,
  type GalleryCustomerListItem,
} from "@/lib/leaflet/customersFromSource";

export {
  buildCustomersFromSources,
  buildExhibitionCustomers,
  countExhibitionCustomers,
  customerIdFromKeys,
  type CustomerDisplayKind,
  type GalleryCustomerDetail,
  type GalleryCustomerListItem,
} from "@/lib/leaflet/customersFromSource";

export type LoadGalleryCustomersInput = {
  galleryId: string;
  exhibitionIds: string[];
  contractEndAt?: string | null;
  storage?: ReportStorage;
};

function toListItem(detail: GalleryCustomerDetail): GalleryCustomerListItem {
  const lastVisitAt =
    detail.visits.map((v) => v.recordedAt).filter(Boolean).sort().at(-1) ??
    detail.inquiries.map((i) => i.createdAt).filter(Boolean).sort().at(-1) ??
    null;
  return {
    customerId: detail.customerId,
    name: detail.name,
    displayKind: "identified",
    lastVisitAt,
    exhibitionIds: detail.exhibitionIds,
    hasInquiry: detail.inquiries.length > 0,
  };
}

function readSources(input: LoadGalleryCustomersInput): ExhibitionReportSource[] {
  return input.exhibitionIds.map((id) =>
    readExhibitionReportSource(id, input.storage, {
      contractEndAt: input.contractEndAt,
    }),
  );
}

export function listGalleryCustomers(
  input: LoadGalleryCustomersInput,
): GalleryCustomerListItem[] {
  return buildCustomersFromSources(readSources(input)).map(toListItem);
}

export function listExhibitionCustomers(
  input: LoadGalleryCustomersInput & { exhibitionId: string },
): GalleryCustomerListItem[] {
  if (!input.exhibitionIds.includes(input.exhibitionId)) return [];
  const source = readExhibitionReportSource(input.exhibitionId, input.storage, {
    contractEndAt: input.contractEndAt,
  });
  return buildExhibitionCustomers(source);
}

export function getGalleryCustomer(
  input: LoadGalleryCustomersInput & { customerId: string },
): GalleryCustomerDetail | null {
  const all = buildCustomersFromSources(readSources(input));
  return all.find((c) => c.customerId === input.customerId) ?? null;
}

export function exhibitionIdsForGallery(galleryId: string): string[] {
  return exhibitionSeed.filter((e) => e.galleryId === galleryId).map((e) => e.id);
}
