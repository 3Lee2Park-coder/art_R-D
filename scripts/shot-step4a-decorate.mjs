/**
 * STEP4A decorate 390px shots
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

/** 짧은 변 1200 — 검수용 실제 크기 JPEG data URL */
function makePhotoDataUrl() {
  try {
    const { createCanvas: cc } = createRequire(import.meta.url)("canvas");
    const canvas = cc(1200, 1600);
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 1200, 1600);
    g.addColorStop(0, "#3a6ea5");
    g.addColorStop(0.5, "#f2c14e");
    g.addColorStop(1, "#d94f30");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1200, 1600);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText("DECORATE", 80, 200);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    // fallback without node-canvas: large SVG data url (>=390 short side)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3a6ea5"/><stop offset="100%" stop-color="#d94f30"/>
      </linearGradient></defs>
      <rect width="1200" height="1600" fill="url(#g)"/>
      <text x="80" y="200" fill="#fff" font-size="72" font-family="sans-serif">DECORATE</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const fixtures = createRequire(import.meta.url)("../data/leaflet-fixtures.json");
  const puppeteer = createRequire(import.meta.url)("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const photo = makePhotoDataUrl();
  console.log("photo bytes ~", Math.round(photo.length / 1024), "KB");

  async function shot(name) {
    const path = join(OUT, name);
    await page.screenshot({ path, fullPage: false });
    console.log("wrote", path);
  }

  const visitId = "visit-shot-decorate";
  const records = fixtures.scenarios["wonder-immersive"].records.map((r) => ({
    artworkId: r.artworkId,
    atSec: r.atSec,
    movingSec: r.movingSec,
    emotionId: r.emotionId,
    source: r.source,
  }));

  await page.goto(`${BASE}/exhibitions/ex-edge?from=qr&scenario=wonder-immersive`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await page.evaluate(
    (payload) => {
      localStorage.setItem("restart.role", "visitor-guest");
      localStorage.setItem("restart.consentVersion", "2026-11-16");
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
          photos: [],
          records: payload.records,
          visitId: payload.visitId,
          cameraIndex: payload.records.length,
        }),
      );
    },
    { visitId, records },
  );
  await page.goto(`${BASE}/exhibitions/ex-edge/generating?from=qr&scenario=wonder-immersive`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await page.waitForFunction(() => location.pathname.startsWith("/leaflets/"), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 700));

  const hasNotes = await page.evaluate(() =>
    document.body.innerText.includes("내 사진·한줄평 남기기"),
  );
  console.log("notes link absent:", !hasNotes);
  const hasPill = await page.$("[data-decorate-pill]");
  console.log("decorate pill:", Boolean(hasPill));
  await shot("step4a-decorate-card1.png");

  // card 2
  await page.evaluate(() => {
    const scroller = document.querySelector("[data-leaflet-card]")?.parentElement;
    if (scroller) scroller.scrollLeft = scroller.clientWidth;
  });
  await new Promise((r) => setTimeout(r, 400));
  const pillOn2 = await page.evaluate(() => {
    const pill = document.querySelector("[data-decorate-pill]");
    if (!pill) return false;
    const r = pill.getBoundingClientRect();
    return r.width > 0 && r.left < window.innerWidth && r.right > 0;
  });
  console.log("pill visible on card2:", pillOn2);
  await shot("step4a-decorate-card2.png");

  // card 5
  await page.evaluate(() => {
    const scroller = document.querySelector("[data-leaflet-card]")?.parentElement;
    if (scroller) scroller.scrollLeft = scroller.clientWidth * 4;
  });
  await new Promise((r) => setTimeout(r, 400));
  await shot("step4a-decorate-card5.png");

  // back to card 1 + open sheet
  await page.evaluate(() => {
    const scroller = document.querySelector("[data-leaflet-card]")?.parentElement;
    if (scroller) scroller.scrollLeft = 0;
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.click("[data-decorate-pill]");
  await new Promise((r) => setTimeout(r, 400));
  const sheetText = await page.evaluate(() => document.body.innerText);
  console.log(
    "sheet labels:",
    ["사진 추가", "한줄평", "저장", "닫기"].map((t) => [t, sheetText.includes(t)]),
  );
  console.log(
    "no native file chrome:",
    !sheetText.includes("파일 선택") && !sheetText.includes("선택된 파일 없음"),
  );
  await shot("step4a-decorate-sheet.png");

  // inject photo + comment and save
  await page.evaluate((dataUrl) => {
    const ta = document.querySelector('[role="dialog"] textarea');
    if (ta) {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
      setter?.call(ta, "검수 한줄평");
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
    // set preview via React: click save after patching through evaluate of button handlers is hard;
    // instead dispatch custom path — fill by calling storage after close won't work.
    // Use File in input
    const input = document.querySelector('[role="dialog"] input[type=file]');
    if (!input) return;
    const bin = atob(dataUrl.split(",")[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const mime = dataUrl.startsWith("data:image/jpeg") ? "image/jpeg" : "image/svg+xml";
    const file = new File([arr], "photo.jpg", { type: mime });
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, photo);
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => {
    const save = [...document.querySelectorAll('[role="dialog"] button')].find((b) =>
      b.textContent?.includes("저장"),
    );
    save?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await shot("step4a-decorate-after-save-card1.png");

  // card 2 quote
  await page.evaluate(() => {
    const scroller = document.querySelector("[data-leaflet-card]")?.parentElement;
    if (scroller) scroller.scrollLeft = scroller.clientWidth;
  });
  await new Promise((r) => setTimeout(r, 400));
  const hasQuote = await page.evaluate(() => document.body.innerText.includes("검수 한줄평"));
  console.log("card2 quote:", hasQuote);
  await shot("step4a-decorate-after-save-card2.png");

  // reload persistence
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));
  await shot("step4a-decorate-after-reload.png");

  // share
  await page.goto(`${BASE}/leaflets/${visitId}/share`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  const sharePill = await page.$("[data-decorate-pill]");
  console.log("share has decorate pill:", Boolean(sharePill));
  await shot("step4a-decorate-share.png");

  // floorplan
  await page.goto(`${BASE}/exhibitions/ex-edge/map?from=qr`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.setItem("restart.consentVersion", "2026-11-16");
    sessionStorage.setItem(
      "restart.visitConsent",
      JSON.stringify({ visitId: "visit-shot-decorate", version: "2026-11-16" }),
    );
    sessionStorage.setItem("restart.qrEntry", "ex-edge");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  const planOk = await page.evaluate(() => {
    const img = document.querySelector('button[aria-label="배치도 확대"] img');
    if (!img) return { ok: false };
    return { ok: img.naturalWidth > 0, w: img.naturalWidth, h: img.naturalHeight };
  });
  console.log("floorplan img:", planOk);
  await shot("step4a-map-floorplan.png");
  await page.click('button[aria-label="배치도 확대"]');
  await new Promise((r) => setTimeout(r, 400));
  await shot("step4a-map-zoom.png");

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
