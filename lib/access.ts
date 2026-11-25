import {
  isEndedGallery,
  isGalleryRole,
  isLoggedOut,
  pathNeedsContractLanding,
} from "@/lib/studioAccess";
import type { Gallery, Role } from "@/lib/types";

export function homeFor(role: Role) {
  if (role === "operator") return "/operator/accounts";
  if (isGalleryRole(role)) return "/studio";
  return "/";
}

export type AccessDecision =
  | { ok: true }
  | { ok: false; to: string; notice?: string; returnTo?: string };

export type AccessOptions = {
  contractState?: Gallery["contractState"] | null;
};

function isEndedOpsPath(path: string): boolean {
  if (path === "/studio/exhibitions/new") return true;
  return /\/(review|qr|theme-color)$/.test(path);
}

export function accessDecision(
  role: Role,
  path: string,
  options?: AccessOptions,
): AccessDecision {
  if (path === "/login" || path === "/signup") return { ok: true };

  const studio = path.startsWith("/studio");
  const operator = path.startsWith("/operator");
  const room = path.startsWith("/my-room");
  const blocked = "이 페이지를 열 수 없습니다.";

  if (studio && isLoggedOut(role)) {
    return { ok: false, to: "/login", returnTo: path };
  }

  if (role === "operator") {
    if (operator) return { ok: true };
    return { ok: false, to: homeFor(role), notice: blocked };
  }

  if (isGalleryRole(role)) {
    if (!studio) return { ok: false, to: homeFor(role), notice: blocked };

    if (role === "gallery-uncontracted" && pathNeedsContractLanding(path)) {
      return { ok: false, to: "/studio/contract" };
    }

    const opsRestricted = isEndedOpsPath(path);
    if (role === "gallery-uncontracted" && opsRestricted) {
      return { ok: false, to: "/studio", notice: blocked };
    }

    if (isEndedGallery(role, options?.contractState) && opsRestricted) {
      return { ok: false, to: "/studio", notice: blocked };
    }

    return { ok: true };
  }

  if (studio || operator) return { ok: false, to: "/", notice: blocked };

  if (room) {
    const intro = path === "/my-room/intro";
    if (role === "visitor-guest" && !intro) return { ok: false, to: "/my-room/intro" };
    if (role === "visitor-member" && intro) return { ok: false, to: "/my-room" };
  }

  return { ok: true };
}
