"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DemoOverlay } from "@/components/demo-overlay";
import { Header } from "@/components/header";
import { accessDecision } from "@/lib/access";
import { CONSENT_VERSION, HANN_GALLERY_ID, SEOCHON_GALLERY_ID } from "@/lib/constants";
import {
  artistSeed,
  artworkSeed,
  errorSeed,
  exhibitionSeed,
  gallerySeed,
  leafletSeed,
  myRoomSeed,
  reportSeed,
} from "@/lib/data";
import { buildDemoLeaflet } from "@/lib/leaflet/demoLeaflets";
import { modeFor, screenIdFor } from "@/lib/screens";
import {
  KEYS,
  SESSION,
  readJSON,
  readRole,
  readSavedLeaflets,
  writeSavedLeaflets,
  type AccountPatches,
  type ExhibitionPatch,
} from "@/lib/storage";
import type { CaptureSession, DecorState, Exhibition, Gallery, Leaflet, LeafletPhoto, Role } from "@/lib/types";

type AppState = {
  ready: boolean;
  role: Role;
  mode: "light" | "dark" | "utility";
  screenId: string;
  demo: boolean;
  setDemo: (on: boolean) => void;
  notice: string | null;
  dismissNotice: () => void;
  consentVersion: string | null;
  grantConsent: () => void;
  clearConsent: () => void;
  guideHidden: boolean;
  hideGuideForWeek: () => void;
  clearGuideHide: () => void;
  uploadConsent: boolean;
  setUploadConsent: (on: boolean) => void;
  cart: string[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  exhibitions: Exhibition[];
  galleries: Gallery[];
  artists: typeof artistSeed;
  artworks: typeof artworkSeed;
  reports: typeof reportSeed;
  errors: typeof errorSeed;
  myGalleryId: string | null;
  upsertExhibition: (exhibition: Exhibition) => void;
  patchExhibition: (id: string, patch: ExhibitionPatch) => void;
  setContract: (galleryId: string, state: Gallery["contractState"]) => void;
  savedLeaflets: Leaflet[];
  upsertLeaflet: (leaflet: Leaflet) => void;
  archivedLeaflets: Leaflet[];
  isArchived: (id: string) => boolean;
  findLeaflet: (id: string) => Leaflet | undefined;
  saveLeaflet: (leaflet: Leaflet) => void;
  beginRoomLogin: () => void;
  login: (role: Role) => void;
  logout: () => void;
  wantedIds: string[];
  toggleWanted: (id: string) => void;
  recommendationArtworkIds: string[];
  recommendedExhibitionIds: string[];
  capture: CaptureSession | null;
  addPhoto: (exhibitionId: string, photo: LeafletPhoto) => void;
  clearCapture: () => void;
  markQr: (exhibitionId: string) => void;
  qrExhibitionId: string | null;
  failNext: boolean;
  setFailNext: (on: boolean) => void;
  spacePick: string | null;
  setSpacePick: (value: string) => void;
  picks: string[];
  togglePick: (id: string) => void;
  decorWall: string;
  setDecorWall: (id: string) => void;
  themeFor: (exhibitionId: string) => string | null;
  setExhibitionTheme: (exhibitionId: string, themeId: string) => void;
  layoutChecked: (exhibitionId: string) => boolean;
  markLayout: (exhibitionId: string) => void;
  reviewAsked: (exhibitionId: string) => boolean;
  askReview: (exhibitionId: string) => void;
};

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("App provider is missing");
  return value;
}

function galleryIdFor(role: Role) {
  if (role === "gallery-contracted") return HANN_GALLERY_ID;
  if (role === "gallery-uncontracted") return SEOCHON_GALLERY_ID;
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<Role>("visitor-guest");
  const [demo, setDemoState] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [consentVersion, setConsentVersion] = useState<string | null>(null);
  const [guideUntil, setGuideUntil] = useState<string | null>(null);
  const [uploadConsent, setUploadConsentState] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [saved, setSaved] = useState<Leaflet[]>([]);
  const [wantedIds, setWantedIds] = useState<string[]>([]);
  const [added, setAdded] = useState<Exhibition[]>([]);
  const [patches, setPatches] = useState<Record<string, ExhibitionPatch>>({});
  const [accounts, setAccounts] = useState<AccountPatches>({});
  const [spacePick, setSpacePickState] = useState<string | null>(null);
  const [picks, setPicks] = useState<string[]>([]);
  const [decorWall, setDecorWallState] = useState("navy");
  const [themes, setThemes] = useState<Record<string, string>>({});
  const [checkedLayouts, setCheckedLayouts] = useState<string[]>([]);
  const [asked, setAsked] = useState<string[]>([]);
  const [capture, setCapture] = useState<CaptureSession | null>(null);
  const [qrExhibitionId, setQrExhibitionId] = useState<string | null>(null);
  const [failNext, setFailNextState] = useState(false);

  useEffect(() => {
    const nextRole = readRole();
    setRole(nextRole);
    const demoQuery = new URLSearchParams(query).get("demo");
    if (demoQuery === "1") localStorage.setItem(KEYS.demo, "1");
    if (demoQuery === "0") localStorage.setItem(KEYS.demo, "0");
    setDemoState(localStorage.getItem(KEYS.demo) === "1");
    setConsentVersion(localStorage.getItem(KEYS.consentVersion));
    setGuideUntil(localStorage.getItem(KEYS.guideHiddenUntil));
    setUploadConsentState(localStorage.getItem(KEYS.uploadConsent) === "1");
    setCart(readJSON<string[]>(localStorage, KEYS.cart, []));
    setSaved(readSavedLeaflets());
    setAdded(readJSON<Exhibition[]>(localStorage, KEYS.studioAdded, []));
    setPatches(readJSON<Record<string, ExhibitionPatch>>(localStorage, KEYS.exhibitionPatches, {}));
    setAccounts(readJSON<AccountPatches>(localStorage, KEYS.accountPatches, {}));
    setSpacePickState(localStorage.getItem(KEYS.spacePick));
    setPicks(readJSON<string[]>(localStorage, KEYS.artworkPicks, []));
    setDecorWallState(localStorage.getItem(KEYS.decorWall) || "navy");
    setThemes(readJSON<Record<string, string>>(localStorage, KEYS.exhibitionTheme, {}));
    setCheckedLayouts(readJSON<string[]>(localStorage, KEYS.layoutChecked, []));
    setAsked(readJSON<string[]>(localStorage, KEYS.reviewAsked, []));
    setCapture(readJSON<CaptureSession | null>(sessionStorage, SESSION.capture, null));
    setQrExhibitionId(sessionStorage.getItem(SESSION.qrEntry));
    setFailNextState(sessionStorage.getItem(SESSION.failNext) === "1");

    let wanted = readJSON<string[] | null>(localStorage, KEYS.wantedIds, null);
    if (nextRole === "visitor-member" && localStorage.getItem(KEYS.memberWantedInit) !== "1") {
      const seed = myRoomSeed.wantedExhibitionIds;
      wanted = Array.from(new Set([...(wanted ?? []), ...seed]));
      localStorage.setItem(KEYS.wantedIds, JSON.stringify(wanted));
      localStorage.setItem(KEYS.memberWantedInit, "1");
    }
    setWantedIds(wanted ?? []);
    setReady(true);
  }, [query]);

  useEffect(() => {
    if (!ready) return;
    const stored = sessionStorage.getItem(SESSION.notice);
    if (stored) {
      setNotice(stored);
      sessionStorage.removeItem(SESSION.notice);
    }
    window.scrollTo(0, 0);
  }, [ready, pathname]);

  useEffect(() => {
    if (!ready) return;
    const decision = accessDecision(role, pathname);
    if (decision.ok) return;
    if (decision.notice) sessionStorage.setItem(SESSION.notice, decision.notice);
    router.replace(decision.to);
  }, [ready, role, pathname, router]);

  const setDemo = useCallback((on: boolean) => {
    localStorage.setItem(KEYS.demo, on ? "1" : "0");
    setDemoState(on);
  }, []);

  const grantConsent = useCallback(() => {
    localStorage.setItem(KEYS.consentVersion, CONSENT_VERSION);
    setConsentVersion(CONSENT_VERSION);
  }, []);

  const clearConsent = useCallback(() => {
    localStorage.removeItem(KEYS.consentVersion);
    setConsentVersion(null);
  }, []);

  const hideGuideForWeek = useCallback(() => {
    const until = new Date();
    until.setDate(until.getDate() + 7);
    const iso = until.toISOString();
    localStorage.setItem(KEYS.guideHiddenUntil, iso);
    setGuideUntil(iso);
  }, []);

  const clearGuideHide = useCallback(() => {
    localStorage.removeItem(KEYS.guideHiddenUntil);
    setGuideUntil(null);
  }, []);

  const setUploadConsent = useCallback((on: boolean) => {
    localStorage.setItem(KEYS.uploadConsent, on ? "1" : "0");
    setUploadConsentState(on);
  }, []);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(KEYS.cart, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = prev.filter((item) => item !== id);
      localStorage.setItem(KEYS.cart, JSON.stringify(next));
      return next;
    });
  }, []);

  const upsertExhibition = useCallback((exhibition: Exhibition) => {
    setAdded((prev) => {
      const next = [...prev.filter((item) => item.id !== exhibition.id), exhibition];
      localStorage.setItem(KEYS.studioAdded, JSON.stringify(next));
      return next;
    });
  }, []);

  const patchExhibition = useCallback((id: string, patch: ExhibitionPatch) => {
    setPatches((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      localStorage.setItem(KEYS.exhibitionPatches, JSON.stringify(next));
      return next;
    });
  }, []);

  const setContract = useCallback((galleryId: string, state: Gallery["contractState"]) => {
    setAccounts((prev) => {
      const next = { ...prev, [galleryId]: state };
      localStorage.setItem(KEYS.accountPatches, JSON.stringify(next));
      return next;
    });
  }, []);

  const upsertLeaflet = useCallback((leaflet: Leaflet) => {
    setSaved((prev) => {
      const next = [...prev.filter((item) => item.id !== leaflet.id), leaflet];
      writeSavedLeaflets(next);
      return next;
    });
  }, []);

  const saveLeaflet = useCallback((leaflet: Leaflet) => {
    const current = readRole();
    if (current === "visitor-member") {
      const nextLeaflet = { ...leaflet, inArchive: true };
      const stored = readSavedLeaflets().filter((item) => item.id !== leaflet.id);
      writeSavedLeaflets([...stored, nextLeaflet]);
      localStorage.removeItem(KEYS.leafletDraft);
      localStorage.removeItem(KEYS.returnTo);
      window.location.assign("/my-room/archive");
      return;
    }
    const draft = { ...leaflet, inArchive: false };
    const stored = readSavedLeaflets().filter((item) => item.id !== leaflet.id);
    writeSavedLeaflets([...stored, draft]);
    localStorage.setItem(KEYS.leafletDraft, JSON.stringify(draft));
    localStorage.setItem(KEYS.returnTo, `/leaflets/${leaflet.id}`);
    window.location.assign("/login");
  }, []);

  const beginRoomLogin = useCallback(() => {
    localStorage.setItem(KEYS.returnTo, "/my-room");
    router.push("/login");
  }, [router]);

  const login = useCallback((nextRole: Role) => {
    localStorage.setItem(KEYS.role, nextRole);
    let dest = "/";
    if (nextRole === "gallery-contracted" || nextRole === "gallery-uncontracted") dest = "/studio";
    else if (nextRole === "operator") dest = "/operator/accounts";
    else {
      const draftRaw = localStorage.getItem(KEYS.leafletDraft);
      const ret = localStorage.getItem(KEYS.returnTo);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw) as Leaflet;
        draft.inArchive = true;
        const stored = readSavedLeaflets().filter((item) => item.id !== draft.id);
        writeSavedLeaflets([...stored, draft]);
        localStorage.removeItem(KEYS.leafletDraft);
        localStorage.removeItem(KEYS.returnTo);
        dest = `/leaflets/${draft.id}`;
      } else if (ret === "/my-room" || ret === "/my-room/intro") {
        localStorage.removeItem(KEYS.returnTo);
        dest = "/my-room";
      } else {
        localStorage.removeItem(KEYS.returnTo);
        dest = "/";
      }
    }
    window.location.assign(dest);
  }, []);

  const logout = useCallback(() => {
    localStorage.setItem(KEYS.role, "visitor-guest");
    window.location.assign("/");
  }, []);

  const toggleWanted = useCallback((id: string) => {
    setWantedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(KEYS.wantedIds, JSON.stringify(next));
      return next;
    });
  }, []);

  const addPhoto = useCallback((exhibitionId: string, photo: LeafletPhoto) => {
    setCapture((prev) => {
      const base = prev && prev.exhibitionId === exhibitionId ? prev : { exhibitionId, photos: [] };
      const next = { exhibitionId, photos: [...base.photos, photo] };
      sessionStorage.setItem(SESSION.capture, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCapture = useCallback(() => {
    sessionStorage.removeItem(SESSION.capture);
    setCapture(null);
  }, []);

  const markQr = useCallback((exhibitionId: string) => {
    sessionStorage.setItem(SESSION.qrEntry, exhibitionId);
    setQrExhibitionId(exhibitionId);
  }, []);

  const setFailNext = useCallback((on: boolean) => {
    if (on) sessionStorage.setItem(SESSION.failNext, "1");
    else sessionStorage.removeItem(SESSION.failNext);
    setFailNextState(on);
  }, []);

  const setSpacePick = useCallback((value: string) => {
    localStorage.setItem(KEYS.spacePick, value);
    setSpacePickState(value);
  }, []);

  const togglePick = useCallback((id: string) => {
    setPicks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(KEYS.artworkPicks, JSON.stringify(next));
      return next;
    });
  }, []);

  const setDecorWall = useCallback((id: string) => {
    localStorage.setItem(KEYS.decorWall, id);
    setDecorWallState(id);
  }, []);

  const setExhibitionTheme = useCallback((exhibitionId: string, themeId: string) => {
    setThemes((prev) => {
      const next = { ...prev, [exhibitionId]: themeId };
      localStorage.setItem(KEYS.exhibitionTheme, JSON.stringify(next));
      return next;
    });
  }, []);

  const markLayout = useCallback((exhibitionId: string) => {
    setCheckedLayouts((prev) => {
      if (prev.includes(exhibitionId)) return prev;
      const next = [...prev, exhibitionId];
      localStorage.setItem(KEYS.layoutChecked, JSON.stringify(next));
      return next;
    });
  }, []);

  const askReview = useCallback((exhibitionId: string) => {
    setAsked((prev) => {
      const next = prev.includes(exhibitionId) ? prev : [...prev, exhibitionId];
      localStorage.setItem(KEYS.reviewAsked, JSON.stringify(next));
      return next;
    });
    setPatches((prev) => {
      const next = { ...prev, [exhibitionId]: { ...prev[exhibitionId], approvalState: "pending" as const } };
      localStorage.setItem(KEYS.exhibitionPatches, JSON.stringify(next));
      return next;
    });
  }, []);

  const exhibitions = useMemo(() => {
    const map = new Map<string, Exhibition>();
    for (const exhibition of exhibitionSeed) map.set(exhibition.id, { ...exhibition, ...patches[exhibition.id] });
    for (const exhibition of added) map.set(exhibition.id, { ...exhibition, ...patches[exhibition.id] });
    return [...map.values()];
  }, [added, patches]);

  const galleries = useMemo(
    () => gallerySeed.map((gallery) => (accounts[gallery.id] ? { ...gallery, contractState: accounts[gallery.id] } : gallery)),
    [accounts],
  );

  const archivedLeaflets = useMemo(() => {
    const map = new Map<string, Leaflet>();
    if (role === "visitor-member") {
      const seed = leafletSeed.find((leaflet) => leaflet.id === "demo-visit");
      if (seed) map.set(seed.id, { ...seed, inArchive: true });
    }
    for (const leaflet of saved) {
      if (leaflet.inArchive) map.set(leaflet.id, leaflet);
    }
    return [...map.values()];
  }, [role, saved]);

  const findLeaflet = useCallback(
    (id: string) => {
      const savedOne = saved.find((leaflet) => leaflet.id === id);
      if (savedOne?.result) return savedOne;

      const seed = leafletSeed.find((leaflet) => leaflet.id === id);
      if (seed?.result) return seed;

      // 시연 리플릿: 즉석 계산 (JSON에 result 저장하지 않음)
      const demo = buildDemoLeaflet(id);
      if (demo) {
        if (seed) {
          return {
            ...demo,
            notes: seed.notes,
            comment: seed.comment,
            photos: seed.photos.length > 0 ? seed.photos : demo.photos,
            myPhotoUrl: seed.myPhotoUrl ?? demo.myPhotoUrl,
            inArchive: seed.inArchive,
          };
        }
        return demo;
      }

      return savedOne ?? seed;
    },
    [saved],
  );

  const isArchived = useCallback(
    (id: string) => archivedLeaflets.some((leaflet) => leaflet.id === id),
    [archivedLeaflets],
  );

  const guideHidden = Boolean(guideUntil && new Date(guideUntil).getTime() > Date.now());
  const mode = modeFor(pathname);
  const screenId = screenIdFor(pathname);

  const value = useMemo<AppState>(
    () => ({
      ready,
      role,
      mode,
      screenId,
      demo,
      setDemo,
      notice,
      dismissNotice: () => setNotice(null),
      consentVersion,
      grantConsent,
      clearConsent,
      guideHidden,
      hideGuideForWeek,
      clearGuideHide,
      uploadConsent,
      setUploadConsent,
      cart,
      addToCart,
      removeFromCart,
      exhibitions,
      galleries,
      artists: artistSeed,
      artworks: artworkSeed,
      reports: reportSeed,
      errors: errorSeed,
      myGalleryId: galleryIdFor(role),
      upsertExhibition,
      patchExhibition,
      setContract,
      savedLeaflets: saved,
      upsertLeaflet,
      archivedLeaflets,
      isArchived,
      findLeaflet,
      saveLeaflet,
      beginRoomLogin,
      login,
      logout,
      wantedIds,
      toggleWanted,
      recommendationArtworkIds: myRoomSeed.recommendationArtworkIds,
      recommendedExhibitionIds: myRoomSeed.recommendedExhibitionIds,
      capture,
      addPhoto,
      clearCapture,
      markQr,
      qrExhibitionId,
      failNext,
      setFailNext,
      spacePick,
      setSpacePick,
      picks,
      togglePick,
      decorWall,
      setDecorWall,
      themeFor: (exhibitionId: string) => themes[exhibitionId] ?? null,
      setExhibitionTheme,
      layoutChecked: (exhibitionId: string) => checkedLayouts.includes(exhibitionId),
      markLayout,
      reviewAsked: (exhibitionId: string) => asked.includes(exhibitionId),
      askReview,
    }),
    [
      ready,
      role,
      mode,
      screenId,
      demo,
      setDemo,
      notice,
      consentVersion,
      grantConsent,
      clearConsent,
      guideHidden,
      hideGuideForWeek,
      clearGuideHide,
      uploadConsent,
      setUploadConsent,
      cart,
      addToCart,
      removeFromCart,
      exhibitions,
      galleries,
      upsertExhibition,
      patchExhibition,
      setContract,
      saved,
      upsertLeaflet,
      archivedLeaflets,
      isArchived,
      findLeaflet,
      saveLeaflet,
      beginRoomLogin,
      login,
      logout,
      wantedIds,
      toggleWanted,
      capture,
      addPhoto,
      clearCapture,
      markQr,
      qrExhibitionId,
      failNext,
      setFailNext,
      spacePick,
      setSpacePick,
      picks,
      togglePick,
      decorWall,
      setDecorWall,
      themes,
      setExhibitionTheme,
      checkedLayouts,
      markLayout,
      asked,
      askReview,
    ],
  );

  if (!ready) return <div className="min-h-dvh bg-white" data-ready="false" />;

  /** V-09 리플릿 카드: 사이트 헤더 숨김 (로고·날짜는 카드 1만) */
  const hideSiteHeader =
    /^\/leaflets\/[^/]+$/.test(pathname) || /^\/my-room\/leaflets\/[^/]+$/.test(pathname);

  return (
    <AppContext.Provider value={value}>
      <div data-ready="true" data-mode={mode} data-screen={screenId} data-demo={demo ? "1" : "0"} className="min-h-dvh">
        {hideSiteHeader ? null : <Header />}
        {notice ? (
          <div className="bg-parchment text-ink flex items-center justify-between gap-3 px-4 py-3 text-[14px]">
            <p>{notice}</p>
            <button type="button" className="link shrink-0 bg-transparent" onClick={() => setNotice(null)}>
              닫기
            </button>
          </div>
        ) : null}
        <main>{children}</main>
        {hideSiteHeader ? null : <DemoOverlay />}
      </div>
    </AppContext.Provider>
  );
}
