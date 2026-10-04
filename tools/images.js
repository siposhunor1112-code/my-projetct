// Elkészíti a megosztási képet (public/assets/og.jpg) és az iPhone-ikont (public/assets/apple-touch-icon.png).
// Futtatás:  node tools/images.js      (Playwright kell hozzá; a referencia-képek már legyenek meg: node tools/shots.js)
const path = require("path");
const fs = require("fs");
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); }

const ROOT = path.join(__dirname, "..", "public");
const data = (f, type) => `data:${type};base64,${fs.readFileSync(path.join(ROOT, "assets", f)).toString("base64")}`;
const font = (f) => data(`fonts/${f}`, "font/woff2");
const shot = (f) => data(`work/${f}`, "image/webp");

const base = `
  @font-face { font-family: Inter; font-weight: 400 700; src: url(${font("inter-var.woff2")}); }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { background: #fff; color: #1d1d1f; overflow: hidden; position: relative; font-family: Inter, sans-serif; letter-spacing: -.02em; }
`;
// Logó: fekete, lekerekített négyzet, benne vékony „W”
const mark = (r = 10) => `<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="${r}" fill="#1d1d1f"/><path d="M10.5 14l4.6 12.5 4.9-10 4.9 10 4.6-12.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const og = `<style>${base}
  .wrap { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 64px; text-align: center; }
  .top { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 28px; }
  .top svg { width: 40px; height: 40px; }
  h1 { margin-top: 26px; font-weight: 600; font-size: 84px; line-height: 1.02; letter-spacing: -.035em; }
  p { margin-top: 18px; font-size: 30px; color: #6e6e73; }
  .laptop { position: absolute; left: 50%; bottom: -150px; width: 700px; transform: translateX(-56%); }
  .lid { padding: 12px 12px 18px; border-radius: 22px 22px 0 0; background: #0a0a0b; box-shadow: 0 0 0 2px #c9cacd; }
  .lid div { aspect-ratio: 16/10; overflow: hidden; border-radius: 4px; }
  .lid img { width: 100%; display: block; }
  .ph { position: absolute; left: 50%; bottom: -260px; width: 190px; margin-left: 200px; padding: 6px; border-radius: 32px; background: #1d1d1f; box-shadow: 0 30px 60px -20px rgba(0,0,0,.4); }
  .ph div { border-radius: 27px; overflow: hidden; aspect-ratio: 390 / 844; }
  .ph img { width: 100%; display: block; }
</style>
<div class="wrap">
  <div class="top">${mark()}Webzone Stúdió</div>
  <h1>Weboldal, ami ügyfelet hoz.</h1>
  <p>Fix ár 70 000 Ft-tól. Havidíj nélkül.</p>
</div>
<div class="laptop"><div class="lid"><div><img src="${shot("meggie-hero.webp")}"></div></div></div>
<div class="ph"><div><img src="${shot("meggie-mobile.webp")}"></div></div>`;

const icon = `<style>${base} body { background: #1d1d1f; } svg { width: 100%; height: 100%; }</style>${mark(0)}`;

(async () => {
  const browser = await chromium.launch();
  const render = async (html, w, h, file, type) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(ROOT, "assets", file), type, ...(type === "jpeg" ? { quality: 86 } : {}) });
    await page.close();
  };
  await render(og, 1200, 630, "og.jpg", "jpeg");
  await render(icon, 180, 180, "apple-touch-icon.png", "png");
  await browser.close();
  console.log("Kész: public/assets/og.jpg, public/assets/apple-touch-icon.png");
})();
