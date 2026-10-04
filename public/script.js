// =========================================================================
// Pixelka – webkészítés
// Itt az elérhetőségek (SITE), a csomagok (PRESETS) és az oldal minden mozgása.
// A munkák adatai az index.html-ben vannak (<article class="card">), innen olvassuk ki őket.
// =========================================================================

const SITE = {
  name: "Pixelka",
  email: "siposhunor1112@gmail.com",
  phone: null,                 // pl. "+36 30 123 4567" – ha megadja, megjelenik a Hívás gomb is
  status: "Most is vállalok új munkát", // a nyitókép fölötti zöld pöttyös felirat; null = elrejti
};

// A csomagok tartalma a kalkulátor tételeiből (data-key) – az árak az index.html-ben, a data-price-ban
const PRESETS = {
  alap: [],
  kirakat: ["hero", "menu", "request", "reviews"],
  premium: ["hero", "menu", "request", "reviews", "booking"],
};
const PLAN_NAMES = { alap: "Alap – 70 000 Ft", kirakat: "Kirakat – 110 000 Ft", premium: "Prémium – 150 000 Ft" };
const BASE = 70000;
const CAP = 150000; // ennél többet a kalkulátor tételeiért nem számolunk

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const ft = (n) => new Intl.NumberFormat("hu-HU").format(n).replace(/ /g, " ");
document.documentElement.classList.add("js");

// ---------- Elérhetőségek ----------
(() => {
  $$("[data-email]").forEach((a) => { a.href = `mailto:${SITE.email}`; a.textContent = SITE.email; });
  if (SITE.phone) {
    const tel = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;
    const row = $("[data-phone-row]"), a = $("[data-phone]"), dock = $("[data-phone-dock]");
    row.hidden = false; a.href = tel; a.textContent = SITE.phone;
    dock.hidden = false; dock.href = tel;
  }
  if (SITE.status) {
    $("[data-slots]").hidden = false;
    $("[data-slots-text]").textContent = SITE.status;
  }
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();

// ---------- Fejléc és menü ----------
(() => {
  const top = $(".top"), burger = $(".burger"), menu = $("#menu");
  const onScroll = () => top.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Menü bezárása" : "Menü");
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // Melyik szekciónál tartunk – a menüben kiemelve
  const links = $$(".nav a");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-here", l.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) io.observe(s); });
})();

// ---------- Telefonon az alsó sáv: csak a nyitókép gombjai után, és a kapcsolatnál eltűnik ----------
(() => {
  const dock = $("[data-dock]");
  let pastHero = false, atContact = false;
  const set = () => dock.classList.toggle("is-on", pastHero && !atContact);
  new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting && en.boundingClientRect.top < 0; set(); }).observe($(".hero__actions"));
  new IntersectionObserver(([en]) => { atContact = en.isIntersecting; set(); }, { rootMargin: "0px 0px -30% 0px" }).observe($("#kapcsolat"));
})();

// ---------- A munkák adatai (a kártyákból) ----------
const WORKS = $$(".card").map((el) => ({
  el,
  id: el.dataset.id,
  name: el.dataset.name,
  host: el.dataset.host,
  sig: el.dataset.sig,
  accent: el.dataset.accent,
  url: el.dataset.url || "",
  kind: el.dataset.kind || "",
  meta: $(".card__meta", el).textContent,
  desc: $(".card__desc", el).textContent,
  tags: $$(".tags li", el).map((li) => li.textContent),
}));
const img = (id, kind) => `/assets/work/${id}-${kind}.webp`;
const preload = (src) => new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => res(i); i.src = src; });
WORKS.forEach((w) => w.el.style.setProperty("--accent", w.accent));

// ---------- Nyitókép: élő bemutató ----------
(() => {
  const stage = $(".stage");
  if (!stage || !WORKS.length) return;
  const devices = $(".stage__devices", stage);
  const phoneImg = $("[data-stage-phone]"), deskImg = $("[data-stage-desk]");
  const screen = phoneImg.parentElement;
  const root = document.documentElement;
  // a bemutató az átadott munkával (Meggie Virágbolt) indul
  let i = Math.max(0, WORKS.findIndex((w) => w.id === "meggie")), anim = null, timer = 0, busy = false;
  root.style.setProperty("--glow", WORKS[i].accent);
  const paused = { hover: false, off: false, hidden: false };
  const isPaused = () => paused.hover || paused.off || paused.hidden;
  $("[data-stage-total]").textContent = String(WORKS.length).padStart(2, "0");

  const queueNext = (ms = reduce ? 5200 : 1100) => {
    clearTimeout(timer);
    if (!isPaused()) timer = setTimeout(() => show(i + 1), ms);
  };

  // A telefonban lassan legörget az oldalon, mintha valaki nézegetné
  const scrollPhone = () => {
    anim?.cancel();
    anim = null;
    if (reduce) return queueNext();
    const dist = Math.min(phoneImg.getBoundingClientRect().height - screen.clientHeight, screen.clientHeight * 2.2);
    if (dist <= 0) return queueNext();
    anim = phoneImg.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(0)", offset: 0.14 }, { transform: `translateY(${-dist}px)` }],
      { duration: 7600, easing: "cubic-bezier(.5,.05,.4,1)", fill: "forwards" },
    );
    anim.onfinish = () => queueNext();
    if (isPaused()) anim.pause();
  };

  const setPause = (key, val) => {
    paused[key] = val;
    if (isPaused()) { anim?.pause(); clearTimeout(timer); }
    else if (anim && anim.playState === "paused") anim.play();
    else if (!busy && (!anim || anim.playState === "finished")) queueNext();
  };

  async function show(n) {
    if (busy) return;
    busy = true;
    clearTimeout(timer);
    i = (n + WORKS.length) % WORKS.length;
    const w = WORKS[i];
    root.style.setProperty("--glow", w.accent);
    stage.classList.add("is-swapping");
    await Promise.all([preload(img(w.id, "mobile")), preload(img(w.id, "hero")), new Promise((r) => setTimeout(r, reduce ? 0 : 420))]);
    anim?.cancel();
    phoneImg.src = img(w.id, "mobile");
    phoneImg.alt = `${w.name} weboldala telefonon`;
    deskImg.src = img(w.id, "hero");
    $("[data-stage-url]").textContent = w.url ? w.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : w.host;
    $("[data-stage-n]").textContent = String(i + 1).padStart(2, "0");
    $("[data-stage-name]").textContent = w.name;
    $("[data-stage-kind]").textContent = w.kind;
    $("[data-stage-kind]").classList.toggle("is-demo", w.kind !== "Átadott munka");
    $("[data-stage-sig]").textContent = w.sig;
    stage.classList.remove("is-swapping");
    busy = false;
    scrollPhone();
    // a következőt előre betöltjük
    const nx = WORKS[(i + 1) % WORKS.length];
    preload(img(nx.id, "mobile"));
  }

  $("[data-stage-next]").addEventListener("click", () => show(i + 1));
  $("[data-stage-prev]").addEventListener("click", () => show(i - 1));

  // Koppintás / kattintás a készülékekre: megnyílik a teljes oldal
  devices.style.cursor = "pointer";
  devices.addEventListener("click", () => openViewer(i));

  // Ujjal oldalra húzva lapoz
  let sx = 0, sy = 0;
  devices.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  devices.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) show(i + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Szünet: ha nem látszik, ha másik lapon van, vagy ha az egér rajta van
  new IntersectionObserver(([en]) => setPause("off", !en.isIntersecting), { threshold: 0.15 }).observe(stage);
  document.addEventListener("visibilitychange", () => setPause("hidden", document.hidden));
  if (finePointer) {
    stage.addEventListener("pointerenter", () => setPause("hover", true));
    stage.addEventListener("pointerleave", () => setPause("hover", false));
  }

  // Egérre finoman megdőlnek a készülékek
  if (finePointer && !reduce) {
    const hero = $(".hero"), browser = $(".stage__browser"), phone = $(".stage__phone");
    let raf = 0, tx = 0, ty = 0;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        browser.style.transform = `rotateY(${tx * 7 - 4}deg) rotateX(${-ty * 5}deg) translateZ(-40px)`;
        phone.style.transform = `rotateY(${tx * 10}deg) rotateX(${-ty * 7}deg) translate(${tx * 14}px, ${ty * 10}px)`;
      });
    });
    hero.addEventListener("pointerleave", () => { browser.style.transform = phone.style.transform = ""; });
  }

  if (phoneImg.complete) scrollPhone(); else phoneImg.addEventListener("load", scrollPhone, { once: true });
})();

// ---------- Munkák: szűrés, előnézet görgetéssel ----------
(() => {
  const chips = $$("[data-filter]");
  chips.forEach((c) => c.addEventListener("click", () => {
    const f = c.dataset.filter;
    chips.forEach((x) => { const on = x === c; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on); });
    $$(".grid .card").forEach((el) => (el.hidden = f !== "all" && el.dataset.cat !== f));
  }));

  WORKS.forEach((w, n) => {
    const btn = $(".card__shot", w.el), pic = $("img", btn);
    btn.addEventListener("click", () => openViewer(n));
    $("[data-open]", w.el)?.addEventListener("click", () => openViewer(n));
    const live = $("[data-live]", w.el);
    if (live && w.url) { live.href = w.url; live.hidden = false; }
    // Egér fölötte: betöltjük a teljes oldal képét, és lassan végiggörget rajta
    if (finePointer) btn.addEventListener("pointerenter", async () => {
      if (pic.classList.contains("is-long")) return;
      await preload(img(w.id, "long"));
      pic.src = img(w.id, "long");
      pic.classList.add("is-long");
    });
  });
})();

// ---------- Munka-nézegető ----------
const viewer = $("[data-viewer]");
let vIndex = 0;
function openViewer(n) {
  vIndex = (n + WORKS.length) % WORKS.length;
  const w = WORKS[vIndex];
  $("[data-v-meta]").textContent = w.meta.includes(w.kind) ? w.meta : `${w.kind} · ${w.meta}`;
  $("[data-v-title]").textContent = w.name;
  $("[data-v-desc]").textContent = w.desc;
  $("[data-v-url]").textContent = w.url ? w.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : w.host;
  $("[data-v-tags]").innerHTML = "";
  w.tags.forEach((t) => { const li = document.createElement("li"); li.textContent = t; $("[data-v-tags]").append(li); });
  const desk = $("[data-v-desk]"), phone = $("[data-v-phone]");
  desk.src = img(w.id, "long"); desk.alt = `${w.name} weboldala számítógépen (teljes oldal)`;
  phone.src = img(w.id, "mobile"); phone.alt = `${w.name} weboldala telefonon`;
  desk.parentElement.scrollTop = 0;
  phone.parentElement.scrollTop = 0;
  const live = $("[data-v-live]");
  live.hidden = !w.url;
  if (w.url) live.href = w.url;
  viewer.style.setProperty("--accent", w.accent);
  if (!viewer.open) {
    viewer.showModal();
    document.documentElement.style.overflow = "hidden";
  }
}
(() => {
  const close = () => viewer.close();
  viewer.addEventListener("close", () => (document.documentElement.style.overflow = ""));
  $("[data-v-close]").addEventListener("click", close);
  viewer.addEventListener("click", (e) => { if (e.target === viewer) close(); });
  $("[data-v-next]").addEventListener("click", () => openViewer(vIndex + 1));
  $("[data-v-prev]").addEventListener("click", () => openViewer(vIndex - 1));
  viewer.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight") openViewer(vIndex + 1);
    if (e.key === "ArrowLeft") openViewer(vIndex - 1);
  });
  const body = $("[data-v-body]"), tabs = $$("[data-v-tab]");
  tabs.forEach((t) => t.addEventListener("click", () => {
    body.dataset.view = t.dataset.vTab;
    tabs.forEach((x) => x.setAttribute("aria-selected", x === t));
  }));
})();

// ---------- Árkalkulátor ----------
const calc = (() => {
  const inputs = $$(".calc input[data-key]");
  const totalEl = $("[data-total]"), meter = $("[data-meter]"), days = $("[data-days]"), cap = $("[data-cap]");
  let shown = BASE, raf = 0;

  const state = () => {
    const on = inputs.filter((x) => x.checked);
    const sum = BASE + on.reduce((a, x) => a + Number(x.dataset.price), 0);
    return { on, sum, total: Math.min(sum, CAP) };
  };
  const tween = (to) => {
    cancelAnimationFrame(raf);
    const from = shown, t0 = performance.now(), dur = reduce ? 0 : 450;
    const step = (t) => {
      const k = dur ? Math.min(1, (t - t0) / dur) : 1;
      shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      totalEl.textContent = ft(Math.round(shown / 100) * 100);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  const update = () => {
    const { on, sum, total } = state();
    tween(total);
    meter.style.width = `${((total - BASE) / (CAP - BASE)) * 100}%`;
    const keys = on.map((x) => x.dataset.key);
    days.textContent = keys.includes("booking") ? "kb. 2–3 hét" : total >= 105000 ? "kb. 10–14 nap" : total > BASE ? "kb. 1–1,5 hét" : "kb. 1 hét";
    cap.hidden = sum <= CAP;
  };
  inputs.forEach((x) => x.addEventListener("change", update));

  const apply = (preset) => {
    const keys = PRESETS[preset] || [];
    inputs.forEach((x) => (x.checked = keys.includes(x.dataset.key)));
    update();
  };
  // Melyik csomagnak felel meg pontosan a mostani összeállítás (ha valamelyiknek)
  const matchPreset = () => {
    const keys = state().on.map((x) => x.dataset.key).sort().join();
    return Object.keys(PRESETS).find((p) => [...PRESETS[p]].sort().join() === keys) || "";
  };
  const summary = () => {
    const { on, total } = state();
    return {
      items: ["Egyoldalas alap weboldal", ...on.map((x) => x.dataset.label)],
      total,
    };
  };
  update();
  return { apply, matchPreset, summary };
})();

// ---------- Ajánlatkérő (a látogató saját levelezőjében nyílik meg) ----------
(() => {
  const form = $("[data-composer]");
  const plan = $("#f-plan"), sumEl = $("[data-summary]"), copied = $("[data-copied]");
  let custom = null; // a kalkulátorból érkező összeállítás

  const showSummary = () => {
    if (plan.value === "egyedi" && custom) {
      sumEl.hidden = false;
      sumEl.innerHTML = "";
      const b = document.createElement("strong");
      b.textContent = `Összeállítás – ${ft(custom.total)} Ft: `;
      sumEl.append(b, custom.items.join(", "));
    } else sumEl.hidden = true;
  };
  plan.addEventListener("change", showSummary);

  const goContact = () => {
    $("#kapcsolat").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(() => $("#f-name").focus({ preventScroll: true }), reduce ? 0 : 700);
  };

  // „Ezt kérem” a csomagoknál
  $$("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    calc.apply(b.dataset.preset);
    custom = null;
    plan.value = b.dataset.preset;
    showSummary();
    goContact();
  }));
  // „Ezzel kérek ajánlatot” a kalkulátornál
  $("[data-calc-send]").addEventListener("click", () => {
    const p = calc.matchPreset();
    custom = calc.summary();
    plan.value = p || "egyedi";
    showSummary();
    goContact();
  });

  const compose = () => {
    const f = Object.fromEntries(new FormData(form));
    const name = (f.name || "").trim();
    const lines = ["Jó napot!", "", "Weboldal készítésére szeretnék ajánlatot kérni.", ""];
    if (name) lines.push(`Vállalkozás: ${name}`);
    if (f.type) lines.push(`Szakma: ${f.type}`);
    if (plan.value === "egyedi" && custom) {
      lines.push(`Csomag: egyedi összeállítás – ${ft(custom.total)} Ft`);
      custom.items.forEach((t) => lines.push(`  • ${t}`));
    } else lines.push(`Csomag: ${PLAN_NAMES[plan.value] || "még nem döntöttem el"}`);
    if ((f.link || "").trim()) lines.push(`Meglévő oldal: ${f.link.trim()}`);
    if ((f.msg || "").trim()) lines.push("", f.msg.trim());
    lines.push("", "Üdvözlettel:", "");
    return { subject: `Weboldal-ajánlatkérés${name ? ` – ${name}` : ""}`, body: lines.join("\n") };
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { subject, body } = compose();
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  $("[data-copy]").addEventListener("click", async () => {
    const { subject, body } = compose();
    const text = `Címzett: ${SITE.email}\nTárgy: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      copied.textContent = "Szöveg kimásolva.";
    } catch {
      copied.textContent = `Írjon ide: ${SITE.email}`;
    }
    setTimeout(() => (copied.textContent = ""), 5000);
  });
})();

// ---------- Megjelenés görgetésre (csak nagy képernyőn, a CSS dönti el) ----------
(() => {
  const groups = [".pillars li", ".grid .card", ".feature", ".incl__list li", ".plan", ".step", ".faq__list details"];
  const singles = $$(".section .eyebrow, .section .h2, .section .lead, .versus, .filters, .demos__head, .calc, .promise, .composer, .direct");
  const els = [...singles];
  groups.forEach((g) => $$(g).forEach((el, n) => { el.style.setProperty("--d", `${(n % 4) * 0.07}s`); els.push(el); }));
  els.forEach((el) => el.classList.add("rv"));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();

// ---------- Lábléc: mennyit töltött le az oldal ----------
addEventListener("load", () => setTimeout(() => {
  const all = [...performance.getEntriesByType("navigation"), ...performance.getEntriesByType("resource")];
  const bytes = all.reduce((a, e) => a + (e.transferSize || e.encodedBodySize || 0), 0);
  if (bytes > 0) {
    $("[data-weight]").textContent = `Ez az oldal ${ft(Math.round(bytes / 1024))} KB-ot töltött be, követőkód és sütik nélkül.`;
  }
}, 1500));
