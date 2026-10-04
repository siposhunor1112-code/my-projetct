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
  @font-face { font-family: Display; font-weight: 650 900; font-stretch: 100% 125%; src: url(${font("archivo-latin-wdth-normal.woff2")}); }
  @font-face { font-family: Display; font-weight: 650 900; font-stretch: 100% 125%; src: url(${font("archivo-latin-ext-wdth-normal.woff2")}); unicode-range: U+0100-02BA; }
  @font-face { font-family: Serif; font-style: italic; src: url(${font("instrument-serif-latin-400-italic.woff2")}); }
  @font-face { font-family: Serif; font-style: italic; src: url(${font("instrument-serif-latin-ext-400-italic.woff2")}); unicode-range: U+0100-02BA; }
  @font-face { font-family: Mono; font-weight: 500; src: url(${font("geist-mono-latin-500-normal.woff2")}); }
  @font-face { font-family: Mono; font-weight: 500; src: url(${font("geist-mono-latin-ext-500-normal.woff2")}); unicode-range: U+0100-02BA; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { background: #0d0d0f; color: #f2efe7; overflow: hidden; position: relative; font-family: Display; }
`;
const mark = (bg, fg) => `<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="${bg}"/><path d="M11 25.5l6-6-6-6" fill="none" stroke="${fg}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 27h9" stroke="${fg}" stroke-width="3.4" stroke-linecap="round"/></svg>`;

const phone = (img, x, y, r) => `<div class="ph" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"><div><img src="${shot(img)}"></div></div>`;
const og = `<style>${base}
  .glow { position: absolute; right: -200px; top: -200px; width: 900px; height: 900px; background: radial-gradient(closest-side, rgba(227,164,108,.35), transparent 70%); }
  .wrap { position: absolute; left: 72px; top: 64px; bottom: 60px; width: 640px; display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; gap: 16px; font-weight: 700; font-size: 30px; font-stretch: 108%; letter-spacing: -.02em; }
  .top svg { width: 52px; height: 52px; }
  h1 { margin-top: auto; font-weight: 780; font-stretch: 118%; font-size: 92px; line-height: .9; letter-spacing: -.045em; }
  h1 em { font-family: Serif; font-style: italic; font-weight: 400; font-stretch: 100%; font-size: 1.16em; letter-spacing: -.01em; color: #cfff45; }
  .bottom { margin-top: 34px; display: flex; gap: 12px; font: 500 21px/1 Mono; }
  .bottom span { padding: 12px 16px; border-radius: 999px; border: 1px solid rgba(242,239,231,.2); }
  .bottom span:first-child { background: #cfff45; color: #0d0d0f; border-color: #cfff45; }
  .ph { position: absolute; width: 230px; padding: 7px; border-radius: 34px; background: #0a0a0c; box-shadow: 0 0 0 1.5px #34343b, 0 30px 60px rgba(0,0,0,.6); }
  .ph > div { border-radius: 28px; overflow: hidden; aspect-ratio: 390 / 844; }
  .ph img { width: 100%; display: block; }
</style>
<div class="glow"></div>
${phone("zenith-mobile.webp", 760, 120, -6)}
${phone("lutri-mobile.webp", 1010, 230, 5)}
${phone("molly-mobile.webp", 880, 70, 0)}
<div class="wrap">
  <div class="top">${mark("#cfff45", "#0d0d0f")}Sipos Hunor</div>
  <h1>Weboldal, ami <em>ügyfelet hoz.</em></h1>
  <div class="bottom"><span>70–150 ezer Ft</span><span>1–2 hét</span><span>0 Ft havidíj</span></div>
</div>`;

const icon = `<style>${base} body { background: #cfff45; display: grid; place-items: center; } svg { width: 100%; height: 100%; }</style>
<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#cfff45"/><path d="M11 25.5l6-6-6-6" fill="none" stroke="#0d0d0f" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 27h9" stroke="#0d0d0f" stroke-width="3.4" stroke-linecap="round"/></svg>`;

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
