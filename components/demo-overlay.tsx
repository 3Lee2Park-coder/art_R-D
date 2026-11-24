"use client";

import { CONSENT_VERSION } from "@/lib/constants";
import { FLOW_LINKS, SCREEN_INDEX, SCREEN_MEMOS, type FlowLink } from "@/lib/screens";
import { KEYS, SESSION } from "@/lib/storage";
import type { Role } from "@/lib/types";
import { useApp } from "@/components/providers";

const ROLES: { id: Role; label: string }[] = [
  { id: "visitor-guest", label: "관람객 · 비회원" },
  { id: "visitor-member", label: "관람객 · 회원" },
  { id: "gallery-contracted", label: "계약 갤러리" },
  { id: "gallery-uncontracted", label: "미계약 갤러리" },
  { id: "operator", label: "운영자" },
];

function go(role: Role, path: string) {
  localStorage.setItem(KEYS.role, role);
  window.location.assign(path);
}

function runFlow(flow: FlowLink) {
  localStorage.setItem(KEYS.role, flow.role);
  if (flow.consent === "set") localStorage.setItem(KEYS.consentVersion, CONSENT_VERSION);
  if (flow.consent === "clear") localStorage.removeItem(KEYS.consentVersion);
  if (flow.guide === "hide") {
    const until = new Date();
    until.setDate(until.getDate() + 7);
    localStorage.setItem(KEYS.guideHiddenUntil, until.toISOString());
  }
  if (flow.guide === "clear") localStorage.removeItem(KEYS.guideHiddenUntil);
  if (flow.clearCapture) {
    sessionStorage.removeItem(SESSION.capture);
    sessionStorage.removeItem(SESSION.visitId);
    sessionStorage.removeItem(SESSION.visitConsent);
  }
  window.location.assign(flow.path);
}

export function DemoOverlay() {
  const app = useApp();
  const memo = SCREEN_MEMOS[app.screenId];

  return (
    <>
      <button type="button" className="demo-toggle" data-on={app.demo} aria-label="데모" onClick={() => app.setDemo(!app.demo)}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <rect x="1" y="1" width="6" height="6" fill="currentColor" />
          <rect x="9" y="1" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="1" y="9" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="9" width="6" height="6" fill="currentColor" />
        </svg>
      </button>
      {app.demo ? (
        <>
          <div className={app.mode === "dark" ? "screen-chip screen-chip-dark" : "screen-chip screen-chip-light"}>{app.screenId || "—"}</div>
          <aside className="demo-sheet" aria-label="데모 오버레이">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold">화면 {app.screenId}</p>
              <button type="button" className="text-[14px] font-semibold text-primary" onClick={() => app.setDemo(false)}>
                닫기
              </button>
            </div>
            {memo ? <p className="mb-4 rounded-lg bg-white px-3 py-2 text-[13px] leading-snug">{memo}</p> : null}
            <p className="mb-2 text-[12px] font-semibold text-ink-muted">역할</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {ROLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === app.role ? "btn btn-primary min-h-10 px-3" : "btn btn-secondary min-h-10 px-3"}
                  onClick={() => go(item.id, item.id === "operator" ? "/operator/accounts" : item.id.startsWith("gallery") ? "/studio" : "/")}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary min-h-10 px-3" onClick={() => (app.consentVersion ? app.clearConsent() : app.grantConsent())}>
                {app.consentVersion ? "동의 해제" : "동의 적용"}
              </button>
              <button type="button" className="btn btn-secondary min-h-10 px-3" onClick={() => (app.guideHidden ? app.clearGuideHide() : app.hideGuideForWeek())}>
                {app.guideHidden ? "가이드 다시 보기" : "가이드 7일 숨김"}
              </button>
              <button type="button" className="btn btn-secondary min-h-10 px-3" onClick={() => app.setFailNext(!app.failNext)}>
                {app.failNext ? "생성 실패 해제" : "다음 생성 실패"}
              </button>
            </div>
            <p className="mb-2 text-[12px] font-semibold text-ink-muted">흐름</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {FLOW_LINKS.map((flow) => (
                <button key={flow.id} type="button" className="btn btn-secondary min-h-10 px-3" onClick={() => runFlow(flow)}>
                  {flow.label}
                </button>
              ))}
            </div>
            {SCREEN_INDEX.map((group) => (
              <section key={group.group} className="mb-4">
                <p className="mb-2 text-[12px] font-semibold text-ink-muted">{group.group}</p>
                <ul className="flex flex-col">
                  {group.items.map((item) => (
                    <li key={item.id + item.path + item.name}>
                      <button
                        type="button"
                        className="flex w-full items-baseline gap-2 bg-transparent py-1.5 text-left text-[14px]"
                        onClick={() => {
                          const nextRole =
                            item.role ??
                            (app.role === "operator" || app.role.startsWith("gallery") ? "visitor-guest" : app.role);
                          go(nextRole, item.path);
                        }}
                      >
                        <span className="w-12 shrink-0 font-semibold text-primary">{item.id}</span>
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-[12px] text-mute">V-07, A-09는 없음.</p>
          </aside>
        </>
      ) : null}
    </>
  );
}
