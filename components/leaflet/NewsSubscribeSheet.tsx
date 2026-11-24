"use client";

import { useState } from "react";
import { leafletPillStyle, type LeafletTheme } from "@/components/leaflet/theme";
import {
  submitNewsSubscribe,
  type ContactMethod,
} from "@/lib/leaflet/inquiry";
import type { Role } from "@/lib/types";

/** [가안] 다음 전시 소식 받기 짧은 시트 */
export function NewsSubscribeSheet({
  open,
  onClose,
  onSuccess,
  theme,
  leafletId,
  exhibitionId,
  role,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  theme: LeafletTheme;
  leafletId: string;
  exhibitionId: string;
  role: Role;
}) {
  const [contactMethod, setContactMethod] = useState<ContactMethod | null>(null);
  const [contactValue, setContactValue] = useState("");
  const [consentNews, setConsentNews] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function close() {
    setContactMethod(null);
    setContactValue("");
    setConsentNews(false);
    setError(null);
    onClose();
  }

  function send() {
    const result = submitNewsSubscribe({
      form: { contactMethod, contactValue, consentNews },
      leafletId,
      exhibitionId,
      role,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess();
    close();
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
      aria-label="다음 전시 소식 받기"
    >
      <div
        className="flex w-full max-w-[480px] flex-col gap-4 rounded-t-2xl px-5 py-5 sm:rounded-2xl"
        style={{ background: theme.bg, color: theme.text }}
      >
        <h2 className="m-0 text-[18px] font-semibold">다음 전시 소식 받기</h2>

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
                style={leafletPillStyle(theme, contactMethod === value ? "primary" : "secondary")}
                onClick={() => {
                  setContactMethod(value);
                  setContactValue("");
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {contactMethod ? (
            <input
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              style={fieldStyle}
              type={contactMethod === "email" ? "email" : "tel"}
            />
          ) : null}
        </div>

        <label className="flex items-start gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={consentNews}
            onChange={(e) => setConsentNews(e.target.checked)}
            className="mt-0.5"
          />
          {/* [가안 문구] — 이 경로에서는 필수 */}
          <span>전시 소식을 받겠습니다</span>
        </label>

        {error ? <p className="m-0 text-[13px]">{error}</p> : null}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center text-[15px] font-semibold"
            style={leafletPillStyle(theme, "primary")}
            onClick={send}
          >
            보내기
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center text-[15px] font-medium"
            style={leafletPillStyle(theme, "secondary")}
            onClick={close}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
