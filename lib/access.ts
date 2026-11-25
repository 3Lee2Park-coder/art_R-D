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

/** 비계약: review·qr만 막음 (5g) */
function isUncontractedBlockedOpsPath(path: string): boolean {
  return /\/(review|qr)$/.test(path);
}

/** 종료: 등록·테마·배치·QR 막음 */
function isEndedBlockedOpsPath(path: string): boolean {
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

    if (role === "gallery-uncontracted" && isUncontractedBlockedOpsPath(path)) {
      return { ok: false, to: "/studio", notice: blocked };
    }

    if (
      isEndedGallery(role, options?.contractState) &&
      isEndedBlockedOpsPath(path)
    ) {
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
