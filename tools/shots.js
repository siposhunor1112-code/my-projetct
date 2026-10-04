// Képernyőképeket készít a referencia-oldalakról (public/assets/work/*.webp).
// Az oldalakat előbb helyben el kell indítani (lásd README: „Referencia-képek frissítése”), a SITES-ben megadott címeken.
// Futtatás:  node tools/shots.js   (Playwright és ImageMagick kell hozzá)
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); }

const SITES = {
  zenith: "http://127.0.0.1:8801/",
  penge: "http://127.0.0.1:8802/",
  gordon: "http://127.0.0.1:8803/",
  molly: "http://127.0.0.1:8804/",
  csomo: "http://127.0.0.1:8805/",
  lutri: "http://127.0.0.1:8806/",
  rusty: "http://127.0.0.1:8807/",
  meggie: "http://127.0.0.1:8808/",
  margareta: "http://127.0.0.1:8809/",
  lashes: "http://127.0.0.1:8790/",
};
const CTX = { locale: "hu-HU", timezoneId: "Europe/Budapest" };
const OUT = path.join(__dirname, "..", "public", "assets", "work");
const TMP = path.join(require("os").tmpdir(), "shots");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

const webp = (src, dst, width, q = 72) =>
  execFileSync("convert", [src, "-resize", `${width}x`, "-strip", "-quality", String(q), "-define", "webp:method=6", dst]);

// Végiggörget, hogy a görgetésre megjelenő részek is kirajzolódjanak, aztán vissza a tetejére
async function warm(page) {
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.5) { scrollTo(0, y); await wait(140); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(1800);
}

// Egész oldalas képhez: a fix sávok (alsó gombsor) eltűnnek, a fix fejléc csak az oldal tetején marad
async function unfix(page) {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 0.4 || r.height === 0) el.style.setProperty("display", "none", "important");
      else el.style.setProperty("position", "absolute", "important");
    }
  });
}

(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  for (const [id, url] of Object.entries(SITES)) {
    if (only.length && !only.includes(id)) continue;
    // Asztali: első képernyő + hosszú, görgethető kép
    const d = await browser.newPage({ ...CTX, viewport: { width: 1440, height: 900 } });
    await d.goto(url, { waitUntil: "load" });
    await d.waitForTimeout(6000);
    await d.screenshot({ path: `${TMP}/${id}-hero.png` });
    await warm(d);
    await unfix(d);
    const dh = Math.min(await d.evaluate(() => document.documentElement.scrollHeight), 7200);
    await d.screenshot({ path: `${TMP}/${id}-long.png`, fullPage: true, clip: { x: 0, y: 0, width: 1440, height: dh } });
    await d.close();
    // Telefon: az első három képernyő
    const m = await browser.newPage({ ...CTX, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await m.goto(url, { waitUntil: "load" });
    await m.waitForTimeout(6000);
    await m.screenshot({ path: `${TMP}/${id}-m0.png` });
    await warm(m);
    await unfix(m);
    const mh = Math.min(await m.evaluate(() => document.documentElement.scrollHeight), 844 * 4);
    await m.screenshot({ path: `${TMP}/${id}-mobile.png`, fullPage: true, clip: { x: 0, y: 0, width: 390, height: mh } });
    await m.close();

    webp(`${TMP}/${id}-hero.png`, `${OUT}/${id}-hero.webp`, 1200);
    webp(`${TMP}/${id}-long.png`, `${OUT}/${id}-long.webp`, 960, 66);
    webp(`${TMP}/${id}-mobile.png`, `${OUT}/${id}-mobile.webp`, 600, 70);
    console.log("kész:", id);
  }
  await browser.close();
})();
