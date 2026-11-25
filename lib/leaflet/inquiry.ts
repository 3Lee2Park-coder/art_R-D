/** 작품 문의 모의 저장 · 검증 */

import { KEYS, readJSON } from "@/lib/storage";
import {
  appendVisitorEvent,
  listVisitorEvents,
  mergeIdentityForLeaflet,
} from "@/lib/leaflet/events";
import { interestArtworkIdsForLeaflet } from "@/lib/leaflet/interest";
import {
  normalizeInquiryStatus,
  normalizeSaleResult,
  type InquiryStatus,
  type SaleResult,
} from "@/lib/leaflet/inquiryStatus";
import {
  resolveIdentityKind,
  visitorKeyForLeaflet,
  type VisitorIdentityKind,
} from "@/lib/leaflet/visitorIdentity";
import type { Role } from "@/lib/types";

export type ContactMethod = "email" | "phone";

export type Inquiry = {
  id: string;
  createdAt: string;
  leafletId: string;
  exhibitionId: string;
  inquiredArtworkIds: string[];
  interestArtworkIds: string[];
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
  message?: string;
  consentContact: true;
  consentNews: boolean;
  identityKind: VisitorIdentityKind;
  status: InquiryStatus;
  saleResult: SaleResult;
};

export type InquiryFormInput = {
  name: string;
  contactMethod: ContactMethod | null;
  contactValue: string;
  message?: string;
  consentContact: boolean;
  consentNews: boolean;
};

function hydrateInquiry(raw: Inquiry & { status?: unknown; saleResult?: unknown }): Inquiry {
  return {
    ...raw,
    status: normalizeInquiryStatus(raw.status),
    saleResult: normalizeSaleResult(raw.saleResult),
  };
}

export function listInquiries(leafletId?: string): Inquiry[] {
  if (typeof localStorage === "undefined") return [];
  const all = readJSON<Inquiry[]>(localStorage, KEYS.inquiries, []).map(hydrateInquiry);
  return leafletId ? all.filter((i) => i.leafletId === leafletId) : all;
}

/** 실패 시 짧은 안내 문구, 성공 시 null */
export function validateInquiryForm(input: InquiryFormInput): string | null {
  if (!input.name.trim()) return "이름을 입력해 주세요.";
  if (!input.contactMethod) return "연락 수단을 골라 주세요.";
  if (!input.contactValue.trim()) {
    return input.contactMethod === "email"
      ? "이메일을 입력해 주세요."
      : "연락처를 입력해 주세요.";
  }
  if (!input.consentContact) return "문의 답변을 위한 연락에 동의해 주세요.";
  return null;
}

export function submitInquiry(input: {
  form: InquiryFormInput;
  leafletId: string;
  exhibitionId: string;
  inquiredArtworkIds: string[];
  role: Role;
}): { ok: true; inquiry: Inquiry } | { ok: false; error: string } {
  const error = validateInquiryForm(input.form);
  if (error) return { ok: false, error };

  const prevKind = resolveIdentityKind(input.role, input.leafletId);
  const visitorKey = visitorKeyForLeaflet(input.leafletId);
  const nextKind: VisitorIdentityKind =
    input.role === "visitor-member" ? "member" : "identified";

  const inquiry: Inquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    leafletId: input.leafletId,
    exhibitionId: input.exhibitionId,
    inquiredArtworkIds: [...input.inquiredArtworkIds],
    interestArtworkIds: interestArtworkIdsForLeaflet(input.leafletId),
    name: input.form.name.trim(),
    contactMethod: input.form.contactMethod!,
    contactValue: input.form.contactValue.trim(),
    message: input.form.message?.trim() || undefined,
    consentContact: true,
    consentNews: Boolean(input.form.consentNews),
    identityKind: nextKind,
    status: "신규",
    saleResult: null,
  };

  if (typeof localStorage !== "undefined") {
    const all = listInquiries();
    localStorage.setItem(KEYS.inquiries, JSON.stringify([...all, inquiry]));
  }

  if (prevKind !== nextKind) {
    mergeIdentityForLeaflet(input.leafletId, prevKind, nextKind, visitorKey);
  }

  appendVisitorEvent({
    type: "inquiry_submit",
    leafletId: input.leafletId,
    exhibitionId: input.exhibitionId,
    artworkId: input.inquiredArtworkIds[0],
    visitorKey,
    identityKind: nextKind,
    payload: {
      consentContact: true,
      consentNews: inquiry.consentNews,
      contactMethod: inquiry.contactMethod,
      interestArtworkIds: inquiry.interestArtworkIds,
      inquiredArtworkIds: inquiry.inquiredArtworkIds,
    },
  });

  return { ok: true, inquiry };
}

export function updateInquiry(
  id: string,
  patch: { status?: InquiryStatus; saleResult?: SaleResult },
): Inquiry | null {
  if (typeof localStorage === "undefined") return null;
  const all = listInquiries();
  const index = all.findIndex((i) => i.id === id);
  if (index < 0) return null;
  const next: Inquiry = {
    ...all[index],
    status: patch.status ?? all[index].status,
    saleResult: patch.saleResult !== undefined ? patch.saleResult : all[index].saleResult,
  };
  const updated = [...all];
  updated[index] = next;
  localStorage.setItem(KEYS.inquiries, JSON.stringify(updated));
  return next;
}

export function recordInquiryOpen(input: {
  leafletId: string;
  exhibitionId: string;
  artworkId?: string;
  role: Role;
}) {
  const identityKind = resolveIdentityKind(input.role, input.leafletId);
  appendVisitorEvent({
    type: "inquiry_open",
    leafletId: input.leafletId,
    exhibitionId: input.exhibitionId,
    artworkId: input.artworkId,
    visitorKey: visitorKeyForLeaflet(input.leafletId),
    identityKind,
  });
}

export type NewsSubscribeForm = {
  contactMethod: ContactMethod | null;
  contactValue: string;
  consentNews: boolean;
};

export function validateNewsSubscribeForm(input: NewsSubscribeForm): string | null {
  if (!input.contactMethod) return "연락 수단을 골라 주세요.";
  if (!input.contactValue.trim()) {
    return input.contactMethod === "email"
      ? "이메일을 입력해 주세요."
      : "연락처를 입력해 주세요.";
  }
  if (!input.consentNews) return "전시 소식 받기에 동의해 주세요.";
  return null;
}

export function submitNewsSubscribe(input: {
  form: NewsSubscribeForm;
  leafletId: string;
  exhibitionId: string;
  role: Role;
}): { ok: true } | { ok: false; error: string } {
  const error = validateNewsSubscribeForm(input.form);
  if (error) return { ok: false, error };
  const identityKind = resolveIdentityKind(input.role, input.leafletId);
  appendVisitorEvent({
    type: "news_subscribe",
    leafletId: input.leafletId,
    exhibitionId: input.exhibitionId,
    visitorKey: visitorKeyForLeaflet(input.leafletId),
    identityKind,
    payload: {
      consentNews: true,
      contactMethod: input.form.contactMethod,
      contactValue: input.form.contactValue.trim(),
    },
  });
  return { ok: true };
}

export function hasNewsSubscribe(leafletId: string, exhibitionId: string): boolean {
  return listVisitorEvents(leafletId).some(
    (e) => e.type === "news_subscribe" && e.exhibitionId === exhibitionId,
  );
}
