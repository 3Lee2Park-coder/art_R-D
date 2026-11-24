/**
 * 리플릿 카드 뷰포트 수용 검사 (STEP2d).
 * 360×780 / 390×844 / 430×932 / 1440×900 에서
 * 카드 높이·옆 카드 비침·공유하기 잘림·카드2 작가·감성 겹침을 검사한다.
 */
import { createRequire } from "module";
import { spawn } from "child_process";
import { existsSync } from "fs";

const BASE = process.env.LEAFLET_CHECK_URL ?? "http://127.0.0.1:3001";
const PATH = "/leaflets/demo-bright-explorer";
const VIEWPORTS = [
  { name: "360", width: 360, height: 780 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "1440", width: 1440, height: 900 },
];

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function loadPuppeteer() {
  const require = createRequire(import.meta.url);
  try {
    return require("puppeteer-core");
  } catch {
    throw new Error("puppeteer-core가 없습니다. npm i -D puppeteer-core 후 다시 실행하세요.");
  }
}

async function ensureServer() {
  try {
    const res = await fetch(`${BASE}${PATH}`, { method: "HEAD" });
    if (res.ok || res.status === 405 || res.status === 200) return null;
  } catch {
    /* start */
  }
  const child = spawn("npx", ["next", "dev", "--port", "3001", "--hostname", "127.0.0.1"], {
    cwd: new URL("..", import.meta.url).pathname,
    stdio: "ignore",
    detached: true,
  });
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch(`${BASE}${PATH}`);
      if (res.ok) return child;
    } catch {
      /* retry */
    }
  }
  throw new Error(`${BASE} 서버를 띄우지 못했습니다.`);
}

async function goToCard(page, index) {
  await page.evaluate((i) => {
    const scroller = document.querySelector("[data-leaflet-card]")?.parentElement;
    if (!scroller) throw new Error("scroller missing");
    const w = scroller.clientWidth;
    scroller.scrollLeft = i * w;
  }, index);
  await new Promise((r) => setTimeout(r, 400));
}

async function measure(page, vp) {
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${PATH}`, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector("[data-leaflet-card]");
  await new Promise((r) => setTimeout(r, 800));

  const failures = [];
  const report = { name: vp.name, width: vp.width, height: vp.height };

  // Card 1 — height + peek
  await goToCard(page, 0);
  const card1 = await page.evaluate(() => {
    const cards = [...document.querySelectorAll("[data-leaflet-card]")];
    const vpH = window.innerHeight;
    const current = cards[0];
    const cr = current.getBoundingClientRect();
    let peek = 0;
    for (let i = 1; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      const visible = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
      if (visible > peek) peek = visible;
    }
    return {
      height: cr.height,
      top: cr.top,
      bottom: cr.bottom,
      viewportHeight: vpH,
      peek,
      overflowY: cr.bottom > vpH + 1 || cr.top < -1,
    };
  });
  report.cardHeight = card1.height;
  report.viewportHeight = card1.viewportHeight;
  report.peek = card1.peek;
  if (Math.abs(card1.height - card1.viewportHeight) > 1) {
    failures.push(
      `${vp.name}: 카드 높이 ${card1.height} ≠ 뷰포트 ${card1.viewportHeight}`,
    );
  }
  if (card1.peek > 2) {
    failures.push(`${vp.name}: 다음 카드 보임 ${card1.peek.toFixed(1)}px > 2`);
  }
  if (card1.overflowY) {
    failures.push(`${vp.name}: 카드1이 뷰포트 밖으로 넘침`);
  }

  // Card 2 — artist/emotion vs thumbs
  await goToCard(page, 1);
  const card2 = await page.evaluate(() => {
    const section = document.querySelectorAll("[data-leaflet-card]")[1];
    const artist = section.querySelector("[data-record-artist]");
    const emotion = section.querySelector("[data-record-emotion]");
    const thumbs = section.querySelector("[data-record-thumbs]");
    const info = artist || emotion;
    if (!info || !thumbs) {
      return { ok: false, reason: "작가·감성 칩 또는 썸네일 없음" };
    }
    const ir = info.getBoundingClientRect();
    const er = emotion ? emotion.getBoundingClientRect() : null;
    const tr = thumbs.getBoundingClientRect();
    const overlapInfo = !(ir.bottom <= tr.top || ir.top >= tr.bottom);
    const overlapEm = er ? !(er.bottom <= tr.top || er.top >= tr.bottom) : false;
    return {
      ok: true,
      hasArtist: Boolean(artist),
      hasEmotion: Boolean(emotion),
      overlap: overlapInfo || overlapEm,
      artistText: artist?.textContent ?? "",
      emotionText: emotion?.textContent ?? "",
      thumbsInCard: tr.bottom <= section.getBoundingClientRect().bottom + 1,
    };
  });
  report.card2 = card2;
  if (!card2.ok) failures.push(`${vp.name}: 카드2 ${card2.reason}`);
  else {
    if (!card2.hasArtist) failures.push(`${vp.name}: 카드2 작가명 없음`);
    if (!card2.hasEmotion) failures.push(`${vp.name}: 카드2 감성 칩 없음`);
    if (card2.overlap) failures.push(`${vp.name}: 카드2 작가·감성이 썸네일과 겹침`);
    if (!card2.thumbsInCard) failures.push(`${vp.name}: 카드2 썸네일이 카드 밖`);
  }

  // Card 5 — share CTA
  await goToCard(page, 4);
  const card5 = await page.evaluate(() => {
    const section = document.querySelectorAll("[data-leaflet-card]")[4];
    const share = section.querySelector("[data-share-cta]");
    const dots = section.querySelector('[role="tablist"]');
    if (!share) return { ok: false, reason: "공유하기 없음" };
    const sr = share.getBoundingClientRect();
    const dr = dots?.getBoundingClientRect();
    const clipped =
      sr.bottom > window.innerHeight + 1 ||
      (dr && sr.bottom > dr.top + 1) ||
      sr.height < 8;
    return {
      ok: true,
      shareBottom: sr.bottom,
      dotsTop: dr?.top ?? null,
      viewportHeight: window.innerHeight,
      clipped,
      visible: sr.width > 0 && sr.height > 0 && sr.bottom > 0 && sr.top < window.innerHeight,
    };
  });
  report.card5 = card5;
  if (!card5.ok) failures.push(`${vp.name}: 카드5 ${card5.reason}`);
  else {
    if (!card5.visible || card5.clipped) {
      failures.push(
        `${vp.name}: 공유하기 잘림 (bottom=${card5.shareBottom}, dots=${card5.dotsTop}, vh=${card5.viewportHeight})`,
      );
    }
  }

  return { report, failures };
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("Chrome/Chromium을 찾지 못했습니다. CHROME_PATH를 설정하세요.");
    process.exit(1);
  }
  const puppeteer = await loadPuppeteer();
  const started = await ensureServer();
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const allFailures = [];
  const rows = [];
  try {
    const page = await browser.newPage();
    for (const vp of VIEWPORTS) {
      const { report, failures } = await measure(page, vp);
      rows.push(report);
      allFailures.push(...failures);
      console.log(
        `[${vp.name}] h=${report.cardHeight}/${report.viewportHeight} peek=${report.peek?.toFixed?.(1) ?? report.peek} shareClipped=${report.card5?.clipped} card2overlap=${report.card2?.overlap}`,
      );
    }
  } finally {
    await browser.close();
    if (started) {
      try {
        process.kill(-started.pid);
      } catch {
        /* ignore */
      }
    }
  }

  console.log("\n| 항목 | 360 | 390 | 430 | 1440 |");
  console.log("|---|---|---|---|---|");
  const by = Object.fromEntries(rows.map((r) => [r.name, r]));
  console.log(
    `| 카드 높이(실측/뷰포트) | ${VIEWPORTS.map((v) => `${by[v.name].cardHeight}/${by[v.name].viewportHeight}`).join(" | ")} |`,
  );
  console.log(
    `| 다음 카드 보임(px) | ${VIEWPORTS.map((v) => (by[v.name].peek ?? 0).toFixed(1)).join(" | ")} |`,
  );
  console.log(
    `| 공유하기 잘림 | ${VIEWPORTS.map((v) => (by[v.name].card5?.clipped ? "잘림" : "OK")).join(" | ")} |`,
  );
  console.log(
    `| 카드 2 작가·감성 | ${VIEWPORTS.map((v) =>
      by[v.name].card2?.ok && !by[v.name].card2?.overlap && by[v.name].card2?.hasArtist && by[v.name].card2?.hasEmotion
        ? "OK"
        : "FAIL",
    ).join(" | ")} |`,
  );

  if (allFailures.length) {
    console.error("\nFAIL:");
    for (const f of allFailures) console.error("-", f);
    process.exit(1);
  }
  console.log("\nPASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
