"use client";

import { useMemo, useState } from "react";
import { leafletPillStyle, type LeafletTheme } from "@/components/leaflet/theme";
import {
  submitInquiry,
  type ContactMethod,
  type InquiryFormInput,
} from "@/lib/leaflet/inquiry";
import { interestIdsFromWorks } from "@/lib/leaflet/interest";
import { useApp } from "@/components/providers";
import type { Role } from "@/lib/types";

const ERR_NAME = "이름을 입력해 주세요.";
const ERR_METHOD = "연락 수단을 골라 주세요.";
const ERR_EMAIL = "이메일을 입력해 주세요.";
const ERR_PHONE = "연락처를 입력해 주세요.";
const ERR_CONSENT = "문의 답변을 위한 연락에 동의해 주세요.";

export function InquirySheet({
  open,
  onClose,
  theme,
  leafletId,
  exhibitionId,
  inquiredArtworkIds,
  artworkTitles,
  role,
}: {
  open: boolean;
  onClose: () => void;
  theme: LeafletTheme;
  leafletId: string;
  exhibitionId: string;
  inquiredArtworkIds: string[];
  artworkTitles: Record<string, string>;
  role: Role;
}) {
  const app = useApp();
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);
  const [contactValue, setContactValue] = useState("");
  const [message, setMessage] = useState("");
  const [consentContact, setConsentContact] = useState(false);
  const [consentNews, setConsentNews] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const interestIds = useMemo(
    () => (open ? interestIdsFromWorks(app.interestWorks, leafletId) : []),
    [open, leafletId, app.interestWorks],
  );

  function clearError(...messages: string[]) {
    setError((prev) => (prev && messages.includes(prev) ? null : prev));
  }

  if (!open) return null;

  function resetAndClose() {
    setName("");
    setContactMethod(null);
    setContactValue("");
    setMessage("");
    setConsentContact(false);
    setConsentNews(false);
    setError(null);
    setDone(false);
    onClose();
  }

  function send() {
    const form: InquiryFormInput = {
      name,
      contactMethod,
      contactValue,
      message,
      consentContact,
      consentNews,
    };
    const result = submitInquiry({
      form,
      leafletId,
      exhibitionId,
      inquiredArtworkIds,
      role,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setDone(true);
  }

  const fieldStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${theme.border}`,
    background: "transparent",
    color: theme.text,
    fontSize: "0.875rem",
  } as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-label="작품 문의"
    >
      <div
        className="flex max-h-[90svh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
        style={{ background: theme.bg, color: theme.text }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
          {done ? (
            <>
              {/* [가안] 성공 문구 */}
              <p className="m-0 text-[16px] font-medium">문의가 접수되었습니다.</p>
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center text-[15px] font-semibold"
                style={leafletPillStyle(theme, "primary")}
                onClick={resetAndClose}
              >
                {/* [가안] */}
                확인
              </button>
            </>
          ) : (
            <>
              <h2 className="m-0 text-[18px] font-semibold">작품 문의</h2>

              <label className="flex flex-col gap-1.5 text-[13px]">
                이름
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) clearError(ERR_NAME);
                  }}
                  style={fieldStyle}
                  autoComplete="name"
                />
              </label>

              <div className="flex flex-col gap-2">
                <p className="m-0 text-[13px]">연락 수단</p>
                <div className="flex gap-2">
                  {(
                    [
                      ["email", "이메일"],
                      ["phone", "연락처"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className="inline-flex h-9 flex-1 items-center justify-center text-[13px] font-medium"
                      style={leafletPillStyle(
                        theme,
                        contactMethod === value ? "primary" : "secondary",
                      )}
                      onClick={() => {
                        setContactMethod(value);
                        setContactValue("");
                        clearError(ERR_METHOD);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {contactMethod ? (
                  <input
                    value={contactValue}
                    onChange={(e) => {
                      setContactValue(e.target.value);
                      if (e.target.value.trim()) clearError(ERR_EMAIL, ERR_PHONE);
                    }}
                    style={fieldStyle}
                    type={contactMethod === "email" ? "email" : "tel"}
                    autoComplete={contactMethod === "email" ? "email" : "tel"}
                    placeholder={contactMethod === "email" ? "이메일" : "연락처"}
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="m-0 text-[13px]">문의 작품</p>
                <ul className="m-0 list-none p-0 text-[14px]">
                  {inquiredArtworkIds.map((id) => (
                    <li key={id}>{artworkTitles[id] ?? id}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="m-0 text-[13px]">관심 작품</p>
                {interestIds.length === 0 ? (
                  <p className="m-0 text-[14px]" style={{ color: theme.aux }}>
                    없음
                  </p>
                ) : (
                  <ul className="m-0 list-none p-0 text-[14px]">
                    {interestIds.map((id) => (
                      <li key={id}>{artworkTitles[id] ?? id}</li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="flex flex-col gap-1.5 text-[13px]">
                문의 내용
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  style={{ ...fieldStyle, resize: "vertical" }}
                />
              </label>

              <label className="flex items-start gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={consentContact}
                  onChange={(e) => {
                    setConsentContact(e.target.checked);
                    if (e.target.checked) clearError(ERR_CONSENT);
                  }}
                  className="mt-0.5"
                />
                {/* [가안 문구] */}
                <span>문의 답변을 위한 연락에 동의합니다</span>
              </label>
              <label className="flex items-start gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={consentNews}
                  onChange={(e) => setConsentNews(e.target.checked)}
                  className="mt-0.5"
                />
                {/* [가안 문구] */}
                <span>전시 소식을 받겠습니다</span>
              </label>

              {error ? (
                <p className="m-0 text-[13px]" style={{ color: theme.text }}>
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center text-[15px] font-semibold"
                  style={leafletPillStyle(theme, "primary")}
                  onClick={send}
                >
                  {/* [가안] */}
                  보내기
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center text-[15px] font-medium"
                  style={leafletPillStyle(theme, "secondary")}
                  onClick={resetAndClose}
                >
                  {/* [가안] */}
                  닫기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
