"use client";

import { useEffect } from "react";
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
  const max = width === "leaflet" ? "max-w-[430px]" : width === "browse" ? "max-w-[1440px]" : "max-w-[980px]";
  return <div className={`mx-auto w-full ${max} px-4 py-6 pb-20 ${className}`}>{children}</div>;
}

export function PageTitle({ title, kicker, dark = false }: { title: string; kicker?: string; dark?: boolean }) {
  useTitle(title);
  return (
    <header className="mb-6">
      {kicker ? <p className={dark ? "text-[12px] font-semibold text-accent" : "text-[12px] font-semibold text-primary"}>{kicker}</p> : null}
      <h1 className="display">{title}</h1>
    </header>
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
  return <p className="text-mute">{children}</p>;
}
