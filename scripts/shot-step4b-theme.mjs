/**
 * STEP4B: G-06 테마 색(1440), Wheat/Cinnabar 신규 리플릿(390), 허브 불변, 문의 처리
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
  for (const p of CHROME) if (p && existsSync(p)) return p;
  return null;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const puppeteer = createRequire(import.meta.url)("puppeteer-core");
  const fixtures = createRequire(import.meta.url)("../data/leaflet-fixtures.json");
  const colors = createRequire(import.meta.url)("../lib/leaflet/colors.ts");
  void colors;
  const COLOR = {
    Wheat: { name: "Wheat", r: 245, g: 223, b: 181, hex: "#F5DFB5" },
    Cinnabar: { name: "Cinnabar", r: 231, g: 47, b: 39, hex: "#E72F27" },
    "Persian Indigo": { name: "Persian Indigo", r: 46, g: 20, b: 141, hex: "#2E148D" },
  };

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  async function shot(name) {
    const path = join(OUT, name);
    await page.screenshot({ path, fullPage: false });
    console.log("wrote", path);
  }

  async function asRole(role) {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate((r) => {
      localStorage.setItem("restart.role", r);
      localStorage.setItem("restart.consentVersion", "2026-11-16");
    }, role);
  }

  async function seedGenerate(theme, visitId, outShot) {
    const records = fixtures.scenarios["wonder-immersive"].records.map((r) => ({
      artworkId: r.artworkId,
      atSec: r.atSec,
      movingSec: r.movingSec,
      emotionId: r.emotionId,
      source: r.source,
    }));
    await asRole("visitor-guest");
    await page.evaluate(
      (payload) => {
        const map = JSON.parse(localStorage.getItem("restart.exhibitionThemeColor") || "{}");
        map["ex-edge"] = payload.theme;
        localStorage.setItem("restart.exhibitionThemeColor", JSON.stringify(map));
        sessionStorage.setItem("restart.visitId", payload.visitId);
        sessionStorage.setItem("restart.scenario", "wonder-immersive");
        sessionStorage.setItem("restart.qrEntry", "ex-edge");
        sessionStorage.setItem(
          "restart.visitConsent",
          JSON.stringify({ visitId: payload.visitId, version: "2026-11-16" }),
        );
        sessionStorage.setItem(
          "restart.capture",
          JSON.stringify({
            exhibitionId: "ex-edge",
            photos: payload.records.map((r, i) => ({
              id: `p-${i}`,
              url: "/images/artworks/plane.svg",
              capturedAt: new Date().toISOString(),
              source: "camera",
              recognizedArtworkId: r.artworkId,
            })),
            records: payload.records,
            visitId: payload.visitId,
            cameraIndex: payload.records.length,
          }),
        );
      },
      { visitId, records, theme },
    );
    await page.goto(`${BASE}/exhibitions/ex-edge/generating?from=qr&scenario=wonder-immersive`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    await page.waitForFunction(() => location.pathname.startsWith("/leaflets/"), {
      timeout: 15000,
    });
    await new Promise((r) => setTimeout(r, 500));
    const themeColor = await page.evaluate(() => {
      const id = location.pathname.split("/")[2];
      const saved = JSON.parse(localStorage.getItem("restart.savedLeaflets") || "[]");
      return saved.find((l) => l.id === id)?.themeColor ?? null;
    });
    console.log(visitId, "themeColor", themeColor);
    await shot(outShot);
  }

  // G-06
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await asRole("gallery-contracted");
  await page.goto(`${BASE}/studio/exhibitions/ex-edge/theme-color`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.title === "Wheat");
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const selected = await page.evaluate(
    () => document.body.innerText.includes("Wheat") && document.body.innerText.includes("선택"),
  );
  console.log("G-06 Wheat selected", selected);
  await shot("step4b-g06-wheat.png");

  // Hub after Wheat — visitor, consent, not themed
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await asRole("visitor-guest");
  await page.evaluate(() => {
    sessionStorage.setItem("restart.qrEntry", "ex-edge");
    sessionStorage.setItem(
      "restart.visitConsent",
      JSON.stringify({ visitId: "hub-check", version: "2026-11-16" }),
    );
    sessionStorage.setItem("restart.visitId", "hub-check");
  });
  await page.goto(`${BASE}/exhibitions/ex-edge/hub?from=qr`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  console.log("hub path", await page.evaluate(() => location.pathname));
  await new Promise((r) => setTimeout(r, 400));
  await shot("step4b-hub-after-wheat.png");

  await seedGenerate(COLOR["Persian Indigo"], "visit-4b-indigo", "step4b-cover-indigo.png");
  await seedGenerate(COLOR.Wheat, "visit-4b-wheat", "step4b-cover-wheat.png");
  await seedGenerate(COLOR.Cinnabar, "visit-4b-cinnabar", "step4b-cover-cinnabar.png");

  // Inquiries
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await asRole("gallery-contracted");
  await page.evaluate(() => {
    localStorage.setItem(
      "restart.inquiries",
      JSON.stringify([
        {
          id: "inq-shot-1",
          createdAt: new Date().toISOString(),
          leafletId: "visit-4b-wheat",
          exhibitionId: "ex-edge",
          inquiredArtworkIds: ["aw-e01"],
          interestArtworkIds: [],
          name: "김관람",
          contactMethod: "phone",
          contactValue: "010-1234-5678",
          consentContact: true,
          consentNews: false,
          identityKind: "identified",
          status: "open",
          saleResult: null,
        },
      ]),
    );
  });
  await page.goto(`${BASE}/studio/inquiries`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 300));
  await shot("step4b-inquiries-list.png");
  await page.goto(`${BASE}/studio/inquiries/inq-shot-1`, { waitUntil: "networkidle0" });
  await page.select("select", "연락 완료");
  const selects = await page.$$("select");
  if (selects[1]) await selects[1].select("판매됨");
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 400));
  await shot("step4b-inquiry-detail.png");
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("restart.inquiries") || "[]")[0]);
  console.log("inquiry saved", saved?.status, saved?.saleResult);

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
