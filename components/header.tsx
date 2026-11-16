"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";
import type { Role } from "@/lib/types";

type Item = { href: string; label: string; logout?: boolean };

function itemsFor(role: Role): Item[] {
  if (role === "visitor-guest") {
    return [
      { href: "/exhibitions", label: "전시" },
      { href: "/artists", label: "작가" },
      { href: "/artworks", label: "작품" },
      { href: "/galleries", label: "갤러리" },
      { href: "/my-room/intro", label: "마이룸" },
      { href: "/login", label: "로그인" },
    ];
  }
  if (role === "visitor-member") {
    return [
      { href: "/exhibitions", label: "전시" },
      { href: "/artists", label: "작가" },
      { href: "/artworks", label: "작품" },
      { href: "/galleries", label: "갤러리" },
      { href: "/my-room", label: "마이룸" },
      { href: "/", label: "로그아웃", logout: true },
    ];
  }
  if (role === "gallery-contracted") {
    return [
      { href: "/studio", label: "내 전시" },
      { href: "/studio/exhibitions/new", label: "전시 등록" },
      { href: "/studio/reports/ex-winter", label: "고객 리포트" },
      { href: "/", label: "로그아웃", logout: true },
    ];
  }
  if (role === "gallery-uncontracted") {
    return [
      { href: "/studio", label: "내 전시" },
      { href: "/studio/exhibitions/new", label: "전시 등록" },
      { href: "/", label: "로그아웃", logout: true },
    ];
  }
  return [
    { href: "/operator/accounts", label: "갤러리 계정" },
    { href: "/operator/exhibitions", label: "전시 확인" },
    { href: "/operator/artworks", label: "작품 DB" },
    { href: "/operator/analytics", label: "관람객 분석" },
    { href: "/operator/reports", label: "전시 리포트" },
    { href: "/operator/errors", label: "오류·이력" },
    { href: "/", label: "로그아웃", logout: true },
  ];
}

function isActive(pathname: string, href: string) {
  if (href === "/exhibitions") return pathname === "/exhibitions" || pathname.startsWith("/exhibitions/") || pathname.startsWith("/record");
  if (href === "/my-room" || href === "/my-room/intro") return pathname.startsWith("/my-room");
  if (href === "/login") return pathname === "/login" || pathname === "/signup";
  if (href === "/studio") return pathname === "/studio";
  if (href === "/operator/exhibitions") return pathname === "/operator/exhibitions" || pathname.startsWith("/operator/exhibitions/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { role, mode, logout } = useApp();
  const [open, setOpen] = useState(false);
  const dark = mode === "dark";
  const items = itemsFor(role);
  const logo = role === "operator" ? "/operator/accounts" : role.startsWith("gallery") ? "/studio" : "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={dark ? "header header-dark" : "header header-light"}>
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-2 px-4">
        <Link href={logo} className="shrink-0 text-[18px] font-semibold no-underline">
          RestArt
        </Link>
        <nav className="ml-auto hidden min-w-0 items-center gap-1 overflow-x-auto min-[720px]:flex">
          {items.map((item) =>
            item.logout ? (
              <button key={item.label} type="button" className="nav-link bg-transparent" onClick={logout}>
                {item.label}
              </button>
            ) : (
              <Link key={item.href + item.label} href={item.href} className="nav-link" data-active={isActive(pathname, item.href)}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center bg-transparent min-[720px]:hidden"
          aria-label="메뉴"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex w-5 flex-col gap-1.5" aria-hidden>
            <span className="block h-px bg-current" />
            <span className="block h-px bg-current" />
            <span className="block h-px bg-current" />
          </span>
        </button>
      </div>
      {open ? (
        <div className={dark ? "menu-panel header-dark min-[720px]:hidden" : "menu-panel header-light min-[720px]:hidden"}>
          <nav className="flex flex-col px-3 py-2">
            {items.map((item) =>
              item.logout ? (
                <button key={item.label} type="button" className="nav-link justify-start bg-transparent text-[17px]" onClick={logout}>
                  {item.label}
                </button>
              ) : (
                <Link key={item.href + item.label} href={item.href} className="nav-link justify-start text-[17px]" data-active={isActive(pathname, item.href)}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
