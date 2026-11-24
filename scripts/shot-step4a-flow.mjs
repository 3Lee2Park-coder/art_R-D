/**
 * STEP4A 390px: 시나리오 4종 카드1, V-10, 저장·로그인 복귀
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

const SCENARIOS = [
  { id: "wonder-immersive", expect: "경이 몰입가", shot: "step4a-cover-wonder.png" },
  { id: "bright-explorer", expect: "설렘 탐험가", shot: "step4a-cover-bright.png" },
  { id: "color-collector", expect: "컬러 수집가", shot: "step4a-cover-color.png" },
  { id: "walker", expect: "오늘의 산책자", shot: "step4a-cover-walker.png" },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const puppeteer = createRequire(import.meta.url)("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  async function shot(name) {
    const path = join(OUT, name);
    await page.screenshot({ path, fullPage: false });
    console.log("wrote", path);
  }

  async function seedAndGenerate(scenarioId, visitId) {
    await page.goto(`${BASE}/exhibitions/ex-edge/hub?from=qr&scenario=${scenarioId}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    const fixture = await page.evaluate(async (sid) => {
      const res = await fetch("/data/leaflet-fixtures.json").catch(() => null);
      return null;
    }, scenarioId);
    void fixture;

    // inject records from page context using known fixture via API... use inline from window by fetching fixtures from same origin
    await page.evaluate(
      async (sid, vid) => {
        localStorage.setItem("restart.consentVersion", "2026-11-16");
        sessionStorage.setItem("restart.visitId", vid);
        sessionStorage.setItem("restart.scenario", sid);
        sessionStorage.setItem("restart.qrEntry", "ex-edge");
        sessionStorage.setItem(
          "restart.visitConsent",
          JSON.stringify({ visitId: vid, version: "2026-11-16" }),
        );
        const res = await fetch("/_next/static/chunks/leaflet-fixtures.json").catch(() => null);
        void res;
      },
      scenarioId,
      visitId,
    );

    // Build records in Node by reading fixture file and inject
  }

  // Load fixtures in node
  const fixtures = createRequire(import.meta.url)("../data/leaflet-fixtures.json");

  for (const sc of SCENARIOS) {
    const visitId = `visit-shot-${sc.id}`;
    const records = fixtures.scenarios[sc.id].records.map((r) => ({
      artworkId: r.artworkId,
      atSec: r.atSec,
      movingSec: r.movingSec,
      emotionId: r.emotionId,
      source: r.source,
    }));
    await page.goto(`${BASE}/exhibitions/ex-edge?from=qr&scenario=${sc.id}`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    await page.evaluate(
      (payload) => {
        localStorage.setItem("restart.role", "visitor-guest");
        localStorage.setItem("restart.consentVersion", "2026-11-16");
        sessionStorage.setItem("restart.visitId", payload.visitId);
        sessionStorage.setItem("restart.scenario", payload.scenarioId);
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
      { visitId, scenarioId: sc.id, records },
    );
    await page.goto(
      `${BASE}/exhibitions/ex-edge/generating?from=qr&scenario=${sc.id}`,
      { waitUntil: "networkidle0", timeout: 60000 },
    );
    await page.waitForFunction(() => location.pathname.startsWith("/leaflets/"), {
      timeout: 10000,
    });
    await new Promise((r) => setTimeout(r, 600));
    const typeName = await page.evaluate(() => {
      const el = document.querySelector("h1, h2, [class*='display']");
      // cover type is large text — find text matching known types
      const body = document.body.innerText;
      for (const name of ["경이 몰입가", "설렘 탐험가", "컬러 수집가", "오늘의 산책자"]) {
        if (body.includes(name)) return name;
      }
      return body.slice(0, 80);
    });
    console.log(sc.id, "→", typeName, typeName === sc.expect ? "OK" : "MISMATCH");
    await shot(sc.shot);
  }

  // V-10 notes
  const leafletPath = await page.evaluate(() => location.pathname);
  await page.goto(`${BASE}${leafletPath}/notes`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  await shot("step4a-notes.png");
  await page.evaluate(() => {
    const ta = document.querySelector("textarea");
    if (ta) {
      ta.value = "오늘의 한줄평";
      ta.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await page.click("button.btn-accent");
  await page.waitForFunction(() => !location.pathname.endsWith("/notes"), { timeout: 8000 });
  await new Promise((r) => setTimeout(r, 500));
  await shot("step4a-after-notes.png");

  // guest save → login → return
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const save = btns.find((b) => b.textContent?.includes("마이룸에 저장"));
    save?.click();
  });
  await page.waitForFunction(() => location.pathname.includes("/login"), { timeout: 8000 }).catch(() => null);
  await new Promise((r) => setTimeout(r, 400));
  await shot("step4a-login-save.png");
  await page.evaluate(() => {
    localStorage.setItem("restart.role", "visitor-member");
  });
  // trigger login submit
  const loginBtn = await page.$('button[type="submit"], button.btn-primary');
  if (loginBtn) await loginBtn.click();
  await page.waitForFunction(() => location.pathname.startsWith("/leaflets/"), { timeout: 10000 }).catch(() => null);
  await new Promise((r) => setTimeout(r, 600));
  await shot("step4a-after-login.png");
  console.log("after login path:", await page.evaluate(() => location.pathname));

  // notes link on V-09
  const notesLink = await page.evaluate(() =>
    [...document.querySelectorAll("a")].some((a) => a.textContent?.includes("내 사진·한줄평")),
  );
  console.log("notes link visible:", notesLink);

  await browser.close();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
