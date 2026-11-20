"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/components/providers";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · RestArt` : "RestArt";
  }, [title]);
}

export function Frame({
  children,
  width = "browse",
  className = "",
}: {
  children: React.ReactNode;
  width?: "browse" | "read" | "leaflet" | "utility";
  className?: string;
}) {
  const max = width === "leaflet" ? "max-w-[480px]" : width === "read" ? "max-w-[980px]" : "max-w-[1440px]";
  return <div className={`page-wrap ${max} ${className}`}>{children}</div>;
}

export function PageTitle({ title, kicker, lead }: { title: string; kicker?: string; lead?: string }) {
  useTitle(title);
  return (
    <header className="page-headline">
      {kicker ? <p className="eyebrow">{kicker}</p> : null}
      <h1>{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
    </header>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {action}
    </div>
  );
}

export function Shelf({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(direction: number) {
    ref.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  }
  return (
    <div className="shelf">
      <div className="shelf-arrows">
        <button type="button" className="icon-btn" aria-label="이전" onClick={() => move(-1)}>
          <span aria-hidden>←</span>
        </button>
        <button type="button" className="icon-btn" aria-label="다음" onClick={() => move(1)}>
          <span aria-hidden>→</span>
        </button>
      </div>
      <div ref={ref} className="shelf-track">
        {children}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap max-w-[1440px]">
        <p className="m-0 text-[17px] font-semibold">RestArt</p>
        <p className="caption mt-3">전시, 작품, 관람 기록</p>
        <p className="fine-print">관람 기록은 전시장에서 남긴 순서로 만들어집니다.</p>
      </div>
    </footer>
  );
}

export function MockRegion({ children }: { children: React.ReactNode }) {
  const { demo } = useApp();
  return (
    <div className="relative">
      {demo ? <span className="mock-badge absolute top-0 right-0 z-10">모의</span> : null}
      {children}
    </div>
  );
}

export function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="caption">{children}</p>;
}
