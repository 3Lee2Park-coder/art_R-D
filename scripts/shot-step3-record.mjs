/**
 * STEP3 390px 스크린샷: V-15 / V-04 / V-05 / V-06
 * 카메라 미지원 환경에서는 모의 촬영(작품 이미지)로 시트를 연다.
 */
import { createRequire } from "module";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = process.env.LEAFLET_CHECK_URL ?? "http://127.0.0.1:3001";
const OUT = join(process.cwd(), "docs/leaflet/verify");
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function loadPuppeteer() {
  const require = createRequire(import.meta.url);
  return require("puppeteer-core");
}

async function seedCapture(page, withRecords) {
  await page.evaluate((seed) => {
    const visitId = "visit-shot-step3";
    sessionStorage.setItem("restart.visitId", visitId);
    sessionStorage.setItem("restart.scenario", "color-collector");
    sessionStorage.setItem("restart.qrEntry", "ex-edge");
    const records = seed
      ? [
          {
            artworkId: "aw-plane",
            source: "camera",
            atSec: 0,
            movingSec: 12,
            emotionId: "curiosity",
            descriptionOpened: false,
            photoUrl: "/images/artworks/plane.svg",
          },
          {
            artworkId: "aw-edge",
            source: "camera",
            atSec: 40,
            movingSec: 8,
            emotionId: null,
            descriptionOpened: false,
            photoUrl: "/images/artworks/edge.svg",
          },
        ]
      : [];
    sessionStorage.setItem(
      "restart.capture",
      JSON.stringify({
        exhibitionId: "ex-edge",
        photos: [],
        records,
        visitId,
        cameraIndex: records.length,
      }),
    );
  }, withRecords);
}

async function shot(page, name) {
  const path = join(OUT, name);
  await page.screenshot({ path, fullPage: false });
  console.log("wrote", path);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const chrome = findChrome();
  if (!chrome) throw new Error("Chrome not found");
  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ["--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  // V-15 empty + blocked alert
  await page.goto(`${BASE}/exhibitions/ex-edge/hub?from=qr&scenario=color-collector`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await seedCapture(page, false);
  await page.reload({ waitUntil: "networkidle0" });
  await shot(page, "step3-v15-empty.png");
  await page.click("button.btn-accent");
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, "step3-v15-blocked.png");
  await page.keyboard.press("Escape").catch(() => undefined);
  // close alert via 확인
  const confirm = await page.$('button.btn-accent');
  if (confirm) {
    const text = await page.evaluate((el) => el.textContent, confirm);
    if (text?.includes("확인")) await confirm.click();
  }

  // V-15 with records
  await seedCapture(page, true);
  await page.reload({ waitUntil: "networkidle0" });
  await shot(page, "step3-v15-records.png");

  // V-04 closed
  await page.goto(`${BASE}/exhibitions/ex-edge/capture?from=qr&scenario=color-collector`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await seedCapture(page, true);
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));
  await shot(page, "step3-v04-closed.png");

  // open sheet via shutter
  const shutter = await page.$('button[aria-label="촬영"]');
  if (shutter) await shutter.click();
  await new Promise((r) => setTimeout(r, 500));
  await shot(page, "step3-v04-sheet.png");

  // expand description
  const expand = await page.evaluateHandle(() => {
    const buttons = [...document.querySelectorAll("button")];
    return buttons.find((b) => b.textContent?.includes("위로 올려"));
  });
  const expandEl = expand.asElement();
  if (expandEl) {
    await expandEl.click();
    await new Promise((r) => setTimeout(r, 400));
    await shot(page, "step3-v04-expanded.png");
  }

  // V-05
  await page.goto(`${BASE}/exhibitions/ex-edge/photos?from=qr&scenario=color-collector`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await seedCapture(page, true);
  await page.reload({ waitUntil: "networkidle0" });
  await shot(page, "step3-v05.png");
  // open emotion sheet for null emotion
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("li button")];
    const target = buttons.find((b) => b.textContent?.includes("감성 선택"));
    target?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, "step3-v05-sheet.png");

  // V-06 sheet
  await page.goto(`${BASE}/exhibitions/ex-edge/map?from=qr&scenario=color-collector`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await seedCapture(page, true);
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const item = document.querySelector("ul li button");
    item?.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await shot(page, "step3-v06-sheet.png");

  await browser.close();
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
