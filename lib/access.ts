import type { Role } from "@/lib/types";

export function homeFor(role: Role) {
  if (role === "operator") return "/operator/accounts";
  if (role === "gallery-contracted" || role === "gallery-uncontracted") return "/studio";
  return "/";
}

export function accessDecision(role: Role, path: string): { ok: true } | { ok: false; to: string; notice?: string } {
  if (path === "/login" || path === "/signup") return { ok: true };

  const studio = path.startsWith("/studio");
  const operator = path.startsWith("/operator");
  const room = path.startsWith("/my-room");
  const blocked = "이 페이지를 열 수 없습니다.";

  if (role === "operator") {
    if (operator) return { ok: true };
    return { ok: false, to: homeFor(role), notice: blocked };
  }

  if (role === "gallery-contracted" || role === "gallery-uncontracted") {
    if (!studio) return { ok: false, to: homeFor(role), notice: blocked };
    const restricted = /\/review$/.test(path) || /\/qr$/.test(path) || path.startsWith("/studio/reports");
    if (role === "gallery-uncontracted" && restricted) {
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
