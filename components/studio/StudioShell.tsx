"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers";
import {
  STUDIO_NAV_GROUPS,
  STUDIO_NAV_UNCONTRACTED,
  crumbLabel,
  resolveSelectedExhibitionId,
  type StudioNavItem,
} from "@/lib/studio/nav";
import { KEYS } from "@/lib/storage";
import "@/app/studio/studio-shell.css";

function NavLink({
  item,
  pathname,
  selectedExhibitionId,
}: {
  item: StudioNavItem;
  pathname: string;
  selectedExhibitionId: string | null;
}) {
  const href = item.href(selectedExhibitionId);
  const active = item.match(pathname);
  return (
    <Link href={href} data-active={active ? "true" : "false"}>
      <span className="ico">{item.ico}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export function StudioShell({ children }: { children: React.ReactNode }) {
  const app = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const gallery = app.galleries.find((g) => g.id === app.myGalleryId);
  const shows = useMemo(
    () => app.exhibitions.filter((e) => e.galleryId === app.myGalleryId),
    [app.exhibitions, app.myGalleryId],
  );
  const uncontracted =
    app.role === "gallery-uncontracted" || gallery?.contractState === "uncontracted";

  const [storedExId, setStoredExId] = useState<string | null>(null);

  useEffect(() => {
    setStoredExId(localStorage.getItem(KEYS.studioExhibitionId));
  }, []);

  const selectedExhibitionId = useMemo(
    () => resolveSelectedExhibitionId(shows, storedExId, pathname),
    [shows, storedExId, pathname],
  );

  useEffect(() => {
    if (!selectedExhibitionId) return;
    if (storedExId === selectedExhibitionId) return;
    localStorage.setItem(KEYS.studioExhibitionId, selectedExhibitionId);
    setStoredExId(selectedExhibitionId);
  }, [selectedExhibitionId, storedExId]);

  function onSelectExhibition(id: string) {
    localStorage.setItem(KEYS.studioExhibitionId, id);
    setStoredExId(id);
    if (pathname.startsWith("/studio/reports/")) {
      router.push(`/studio/reports/${id}`);
      return;
    }
    if (/\/studio\/exhibitions\/[^/]+\/customers/.test(pathname)) {
      router.push(`/studio/exhibitions/${id}/customers`);
    }
  }

  const initial = gallery?.initial || gallery?.name?.slice(0, 1) || "G";

  return (
    <div className="studio-app">
      <aside className="studio-sidebar">
        <div className="studio-brand">
          <div className="studio-brand-mark" aria-hidden>
            R
          </div>
          <div>
            <strong>RestArt</strong>
            <small>GALLERY INTELLIGENCE</small>
          </div>
        </div>

        {uncontracted ? (
          <nav className="studio-nav" aria-label="스튜디오">
            {STUDIO_NAV_UNCONTRACTED.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                pathname={pathname}
                selectedExhibitionId={selectedExhibitionId}
              />
            ))}
          </nav>
        ) : (
          <>
            {STUDIO_NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="studio-nav-label">{group.label}</div>
                <nav className="studio-nav" aria-label={group.label}>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      selectedExhibitionId={selectedExhibitionId}
                    />
                  ))}
                </nav>
              </div>
            ))}
          </>
        )}

        <div className="studio-side-bottom">
          <div className="studio-gallery-profile">
            <div className="studio-avatar">{initial}</div>
            <div>
              <b>{gallery?.name ?? "갤러리"}</b>
              <small>갤러리 관리자</small>
            </div>
          </div>
          <button type="button" className="studio-logout" onClick={() => app.logout()}>
            로그아웃
          </button>
        </div>
      </aside>

      <div className="studio-main">
        <header className="studio-topbar">
          <div className="studio-crumb">
            {gallery?.name ?? "갤러리"}　/　<b>{crumbLabel(pathname)}</b>
          </div>
          <div className="studio-top-actions">
            {!uncontracted && shows.length > 0 ? (
              <select
                className="studio-select"
                aria-label="전시 선택"
                value={selectedExhibitionId ?? ""}
                onChange={(e) => onSelectExhibition(e.target.value)}
              >
                {shows.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </header>
        <div className="studio-content">{children}</div>
      </div>
    </div>
  );
}
