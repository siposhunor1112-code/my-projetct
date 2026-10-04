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
  @font-face { font-family: Display; font-weight: 600 800; font-stretch: 75% 100%; src: url(${font("bricolage-grotesque-var.woff2")}); }
  @font-face { font-family: Body; font-weight: 400 700; src: url(${font("figtree-var.woff2")}); }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { background: #f3f5fa; color: #111a33; overflow: hidden; position: relative; font-family: Display; }
`;
// Logó: kobaltkék zománctábla, belső fehér szegéllyel, rajta a „W”
const mark = `<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#2448d8"/><rect x="3.2" y="3.2" width="33.6" height="33.6" rx="6.4" fill="none" stroke="#fff" stroke-width="1.3"/><path d="M10.5 14.5l4.4 12 5.1-10 5.1 10 4.4-12" fill="none" stroke="#fff" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const phone = (img, x, y, r) => `<div class="ph" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"><div><img src="${shot(img)}"></div></div>`;
const og = `<style>${base}
  .glow { position: absolute; right: 40px; top: 60px; width: 520px; height: 520px; border-radius: 50%; background: #d2446f; opacity: .22; filter: blur(80px); }
  .wrap { position: absolute; left: 72px; top: 64px; bottom: 60px; width: 660px; display: flex; flex-direction: column; align-items: flex-start; }
  .top { display: flex; align-items: center; gap: 16px; font-weight: 760; font-stretch: 86%; font-size: 34px; }
  .top svg { width: 54px; height: 54px; }
  h1 { margin-top: auto; font-weight: 800; font-stretch: 75%; font-size: 112px; line-height: .9; letter-spacing: -.02em; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .plate { position: relative; padding: 4px 38px 12px; background: #2448d8; color: #fff; border-radius: 15px; white-space: nowrap;
    box-shadow: inset 0 0 0 7px #2448d8, inset 0 0 0 10px #fff, 0 6px 0 #142a7f; transform: rotate(-1.6deg); transform-origin: 0 100%; }
  .plate::before, .plate::after { content: ""; position: absolute; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: #fff; }
  .plate::before { left: 17px; } .plate::after { right: 17px; }
  .bottom { margin-top: 40px; display: flex; gap: 10px; font: 700 20px/1 Body; white-space: nowrap; }
  .bottom span { padding: 12px 16px; border-radius: 12px; border: 1.5px solid #c0c9dc; background: #fff; }
  .ph { position: absolute; width: 230px; padding: 7px; border-radius: 34px; background: #0b0e18; box-shadow: 0 30px 60px -20px rgba(17,26,51,.45); }
  .ph > div { border-radius: 28px; overflow: hidden; aspect-ratio: 390 / 844; }
  .ph img { width: 100%; display: block; }
</style>
<div class="glow"></div>
${phone("margareta-mobile.webp", 770, 120, -6)}
${phone("molly-mobile.webp", 1010, 230, 5)}
${phone("meggie-mobile.webp", 890, 70, 0)}
<div class="wrap">
  <div class="top">${mark}Webzone Stúdió</div>
  <h1><span>Weboldal, ami</span><span class="plate">ügyfelet hoz.</span></h1>
  <div class="bottom"><span>70–150 ezer Ft</span><span>0 Ft havidíj</span><span>Első változat ingyen</span></div>
</div>`;

const icon = `<style>${base} body { background: #2448d8; } svg { width: 100%; height: 100%; }</style>
<svg viewBox="0 0 40 40"><rect width="40" height="40" fill="#2448d8"/><rect x="4" y="4" width="32" height="32" rx="5" fill="none" stroke="#fff" stroke-width="1.1"/><path d="M10.5 14.5l4.4 12 5.1-10 5.1 10 4.4-12" fill="none" stroke="#fff" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

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
