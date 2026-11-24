/**
 * STEP3b 390×844 스크린샷
 */
import { createRequire } from "module";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = process.env.LEAFLET_CHECK_URL ?? "http://127.0.0.1:3001";
const OUT = join(process.cwd(), "docs/leaflet/verify");
const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

function findChrome() {
  for (const p of CHROME) if (existsSync(p)) return p;
  return null;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const puppeteer = createRequire(import.meta.url)("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  async function shot(name) {
    const path = join(OUT, name);
    await page.screenshot({ path, fullPage: false });
    console.log("wrote", path);
  }

  async function clearStorage() {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  // V-01 입장하기
  await page.goto(`${BASE}/exhibitions/ex-edge?from=qr`, { waitUntil: "networkidle0", timeout: 60000 });
  await clearStorage();
  await page.reload({ waitUntil: "networkidle0" });
  await shot("step3b-v01-enter.png");

  // 동의 우회: hub 직접 → consent
  await page.goto(`${BASE}/exhibitions/ex-edge/hub?from=qr`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForFunction(() => location.pathname.includes("/consent"), { timeout: 8000 }).catch(() => null);
  await new Promise((r) => setTimeout(r, 400));
  await shot("step3b-consent-redirect.png");
  console.log("path after hub bypass:", await page.evaluate(() => location.pathname));

  // 동의 → guide → hub (게스트)
  await page.goto(`${BASE}/exhibitions/ex-edge/consent?from=qr`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    sessionStorage.setItem("restart.visitId", "visit-shot-3b");
    sessionStorage.setItem(
      "restart.capture",
      JSON.stringify({
        exhibitionId: "ex-edge",
        photos: [],
        records: [],
        visitId: "visit-shot-3b",
        cameraIndex: 0,
      }),
    );
    sessionStorage.setItem("restart.qrEntry", "ex-edge");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.click("button.btn-accent");
  await page.waitForFunction(() => location.pathname.includes("/guide") || location.pathname.includes("/hub"), {
    timeout: 8000,
  });
  await new Promise((r) => setTimeout(r, 300));
  if ((await page.evaluate(() => location.pathname)).includes("/guide")) {
    await shot("step3b-guide.png");
    const go = await page.$("button.btn-accent");
    if (go) await go.click();
    await page.waitForFunction(() => location.pathname.includes("/hub"), { timeout: 8000 });
  }
  await new Promise((r) => setTimeout(r, 400));
  await shot("step3b-hub-guest.png");

  // 허브 회원 + 이름
  await page.evaluate(() => {
    localStorage.setItem("restart.role", "visitor-member");
    localStorage.setItem("restart.visitorName", "민혁");
    localStorage.setItem("restart.consentVersion", "2026-11-16");
    sessionStorage.setItem(
      "restart.visitConsent",
      JSON.stringify({ visitId: "visit-shot-3b", version: "2026-11-16" }),
    );
  });
  await page.goto(`${BASE}/exhibitions/ex-edge/hub?from=qr`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  await shot("step3b-hub-member.png");

  // 카메라 + 감성 선택 (펼침)
  await page.evaluate(() => {
    sessionStorage.setItem(
      "restart.visitConsent",
      JSON.stringify({ visitId: "visit-shot-3b", version: "2026-11-16" }),
    );
  });
  await page.goto(`${BASE}/exhibitions/ex-edge/capture?from=qr`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));
  const stage = await page.evaluate(() => {
    const el = document.querySelector("[data-camera-stage]");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height, taller: r.height > r.width };
  });
  console.log("camera stage:", stage);
  await shot("step3b-capture-stage.png");

  const shutter = await page.$('button[aria-label="촬영"]');
  if (shutter) await shutter.click();
  await new Promise((r) => setTimeout(r, 500));
  await shot("step3b-emotion-before.png");

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("위로 올려"),
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const chip = document.querySelector('[data-emotion-id="curiosity"]');
    chip?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 300));
  const pressed = await page.evaluate(() => {
    const chip = document.querySelector('[data-emotion-id="curiosity"]');
    return {
      aria: chip?.getAttribute("aria-pressed"),
      selected: chip?.getAttribute("data-selected"),
    };
  });
  console.log("emotion pressed:", pressed);
  await shot("step3b-emotion-selected.png");

  // 배치도 + 시트 CTA + 확대
  await page.goto(`${BASE}/exhibitions/ex-edge/map?from=qr`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    sessionStorage.setItem(
      "restart.visitConsent",
      JSON.stringify({ visitId: "visit-shot-3b", version: "2026-11-16" }),
    );
    localStorage.setItem("restart.consentVersion", "2026-11-16");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await shot("step3b-map-floorplan.png");
  await page.evaluate(() => {
    document.querySelector('button[aria-label="배치도 확대"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await shot("step3b-map-zoom.png");
  await page.evaluate(() => {
    const close = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "닫기");
    close?.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => document.querySelector("ul li button")?.click());
  await new Promise((r) => setTimeout(r, 500));
  await shot("step3b-map-sheet-cta.png");
  const cta = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[role="dialog"] button, section button')];
    const pick = (label) => {
      const b = buttons.find((el) => el.textContent?.trim() === label);
      if (!b) return null;
      const s = getComputedStyle(b);
      return { label, bg: s.backgroundColor, border: s.borderColor, cls: b.className };
    };
    return {
      damgi: pick("담기"),
      close: pick("닫기"),
      detail: pick("자세히 보기"),
    };
  });
  console.log("map sheet CTA:", JSON.stringify(cta, null, 2));

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
