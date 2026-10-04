# Sipos Hunor – webkészítés (saját weboldal)

Egyoldalas bemutatkozó és értékesítő oldal: egyedi weboldalak kisvállalkozásoknak, fix áron (70 000 – 150 000 Ft).
Nincs szükség build lépésre: a `public/` mappa bármilyen statikus tárhelyen kiszolgálható (Cloudflare Workers, Netlify, GitHub Pages) –
ugyanúgy, mint az ügyféloldalak.

## ⚠️ Élesítés előtt – ezeket nézd át

1. **Telefonszám** – `public/script.js`, `SITE.phone` (most `null`, ezért nem látszik). Kisvállalkozók szívesebben telefonálnak:
   ha megadod, megjelenik a Kapcsolatnál és telefonon az alsó sávban is (Hívás gomb).
2. **Domain** – az oldal a `https://siposhunor.hu/` címet feltételezi. Ha más lesz, írd át itt:
   `public/index.html` (`og:image`, `og:url`, `canonical`, `application/ld+json`), `public/robots.txt`, `public/sitemap.xml`.
3. **A Meggie Virágbolt élő címe** – az `index.html`-ben a kiemelt munkánál (`<article class="card feature" data-id="meggie" …>`)
   írd a `data-url=""`-be az élő oldal címét. Ekkor megjelenik az „Élő oldal” gomb, a böngészőablak tetején pedig a valódi cím.
4. **Mintaoldalak** – a másik kilenc oldal „Mintaoldal” címkét kapott, és a szekció kiírja, hogy saját kezdeményezésre, nyilvános
   adatok alapján készültek, nem megrendelésre. Valódi vállalkozások nevét viselik: ha valamelyik vállalkozás kéri, vedd ki
   (az `<article>` törlésével; a szűrő-gombok számát – `<sup>2</sup>` – is igazítsd hozzá). Ha később megrendelés lesz belőle,
   írd át a `data-kind`-ot „Átadott munka”-ra, és tedd át a kiemelt részbe.
5. **Üzleti feltételek** – ezeket én javasoltam, döntsd el, vállalod-e (mind az `index.html`-ben):
   - „Kockázatmentes kezdés: az első változatot díjmentesen elkészítem. Ha nem tetszik, nem tartozik semmivel.” (Folyamat)
   - Fizetés: 50% a munka elején, 50% élesítéskor (GYIK)
   - Átadás után 30 napig ingyenes kisebb javítások (GYIK)
   - „24 órán belül válaszolok” (Kapcsolat)
   - Plafon: a kalkulátor tételeiért legfeljebb 150 000 Ft (`CAP` a `script.js`-ben)
   - Módosítási körök: Alap 1, Kirakat 2, Prémium 3
6. **Adózás** – az árak mellett most nincs „bruttó / alanyi adómentes” megjegyzés. Ha vállalkozóként számlázol,
   írd a `pricing__note` sorba, hogy pl. „Az árak alanyi adómentesek” – ez a könyvelődtől függ.
7. **Felirat a nyitóképen** – `SITE.status` („Most is vállalok új munkát”). Lehet konkrét is, pl. „Novemberben még 2 szabad hely”
   – de csak ha igaz. `null` = elrejti.

## Fájlok

- `public/` – maga a weboldal (ez kerül ki a netre):
  - `index.html` – az oldal szerkezete és minden szövege, a munkák adatai, a csomagok és a GYIK
  - `styles.css` – megjelenés (színek, betűk, méretek a `:root` változókban)
  - `script.js` – elérhetőségek (`SITE`), csomagok (`PRESETS`), a nyitókép élő bemutatója, munka-nézegető, árkalkulátor, ajánlatkérő
  - `404.html` – „Ez az oldal még nem készült el.” – a nem létező címekhez (ez is elad: „ha nincs még weboldala…”)
  - `_headers` – biztonsági és gyorsítótár-beállítások a Cloudflare-nek
  - `assets/work/` – a referencia-képek (`<id>-hero.webp` nyitókép, `<id>-long.webp` teljes oldal számítógépen, `<id>-mobile.webp` telefonon)
  - `assets/` – ikonok, megosztási kép (`og.jpg`) és betűtípusok
  - `robots.txt`, `sitemap.xml` – a keresőknek
- `wrangler.jsonc` – Cloudflare-beállítás (a `public/` mappát teszi ki, a 404-oldallal együtt)
- `tools/shots.js` – újrafotózza a referencia-oldalakat (lásd lent)
- `tools/images.js` – újragyártja a megosztási képet és az iPhone-ikont

## Megjelenés

- Tinta-fekete és csont színű szekciók váltakoznak, **egyetlen kiemelőszín: neon-lime** (`--lime`) – minden ügyféloldaltól eltér,
  így a referenciák színei nem ütik egymást, és a lime mindig a teendőt jelzi (gombok, kiemelések)
- Betűk saját tárhelyről (SIL Open Font License): **Archivo** széles, vastag változata (címek), **Instrument Serif** dőlt
  (a kiemelt szavak, pl. „*ügyfelet hoz.*”), **Geist** (szöveg) és **Geist Mono** (címkék, számok).
  Az Archivo le van karcsúsítva (csak a használt vastagságok és a magyar ékezetek): 176 KB helyett 50 KB
- Logó: lime négyzet, benne egy parancssor-jel `>_` – „aki kódot ír”
- Megszólítás: magázó, egyszerű és szakmai hangnem, szakszavak nélkül

## Szekciók – és miért ezek

Az oldal egyetlen kérdésre felel minél gyorsabban: *„Megéri-e nekem, hogy ő csinálja a weboldalamat?”*

- **Nyitókép** – az első képernyőn ott van minden lényeg: mit csinálsz (weboldal, ami ügyfelet hoz), mennyiért (70 000 Ft-tól,
  fix ár), mennyi idő alatt (7–14 nap), mi a csapda máshol (havidíj – nálad 0 Ft). Mellette **élő bemutató**: a saját munkáid
  egy telefonban és egy böngészőablakban (a Meggie Virágbolttal indul, mindegyiknél ott a címke: „Átadott munka” vagy
  „Mintaoldal”), a telefonban az oldal magától legörget, a háttér fénye felveszi az adott oldal színét,
  aztán jön a következő. Ujjal lapozható, egérrel megdől, rákattintva megnyílik a teljes oldal. Nem állítás, hanem bizonyíték.
- **Szalag** – a szolgáltatás fő jellemzői úsznak (egyedi tervezés, fix ár, nincs havidíj…)
- **(00) Szemlélet** – a vevő telefonról, néhány másodperc alatt dönt, és négy alapelv. Alatta **összehasonlítás**:
  sablonos weboldal-építő vs. ügynökség vs. te – a valódi alternatívák, amiken a vevő gondolkodik. Telefonon kártyákká alakul
- **(01) Munkák** – elöl, kiemelve az **átadott munka** (Meggie Virágbolt): nagy kép, leírás, mit tartalmaz. Alatta a
  **mintaoldalak** szakmák szerint szűrhetően, egyértelmű „Mintaoldal” címkével. Egérrel fölé állva a kártyán végiggörget a
  teljes oldal; kattintásra a **nézegető** mutatja telefonon és számítógépen is (telefonon lapokkal vált)
- **(02) Mit kap** – 12 dolog, ami minden oldalban benne van (élő nyitvatartás, hívás/útvonal, szövegírás, nincs sütisáv…).
  Ezek az ügyféloldalaid valódi tudása – a READMEékből gyűjtöttem össze
- **(03) Árak** – három csomag (Alap 70e, **Kirakat 110e – legnépszerűbb**, Prémium 150e). A középső kiemelése a döntést
  könnyíti. Alatta **árkalkulátor**: a tételek kipipálásával élőben számolja a végösszeget és az átfutást, 150 000 Ft-nál megáll
  („ennél többet nem kérek”). A „Ezt kérem” / „Ezzel kérek ajánlatot” gomb kitölti az ajánlatkérőt
- **(04) Folyamat** – négy lépés napokkal, és a kockázatmentes kezdés („az első változat díjmentes”)
- **(05) Kérdések** – a kilenc leggyakoribb ellenvetés megválaszolva (havidíj, mi kell tőlem, kié az oldal, Google, webshop…)
- **(06) Kapcsolat** – ajánlatkérő, ami a látogató **saját levelezőjében** nyit meg egy előre megírt levelet (vállalkozás neve,
  szakma, csomag vagy a kalkulátor összeállítása, meglévő oldal, üzenet). Van „Szöveg másolása” gomb is (Messengerre).
  Az oldal semmit nem küld és nem tárol – ezért nem kell adatkezelési tájékoztató és sütisáv
- **Lábléc** – óriási név, amin átsuhan a lime fény, és élőben kiírja, hány KB-ot töltött le az oldal („kézzel készült”)
- Telefonon alul megjelenik a **Munkák / (Hívás) / Ajánlatot kérek** sáv – de csak a nyitókép gombjai után, és a Kapcsolatnál eltűnik

Telefonra optimalizálva 320 px-től: nincs vízszintes görgetés, minden gomb legalább 44 px, telefonon nem úsznak be a szövegek
(azonnal látszanak), a nézegető teljes képernyős. Aki kikapcsolta az animációkat (`prefers-reduced-motion`), annak minden áll.

## Tartalom szerkesztése

- **Elérhetőségek**: `public/script.js` eleje, `SITE` (név, e-mail, telefon, státusz-felirat)
- **Árak**: a csomagkártyák az `index.html`-ben (`<section id="arak">`); a kalkulátor tételeinek ára a `data-price`-ban;
  a csomagok tartalma a `script.js` `PRESETS` részében (melyik tétel melyik csomagban van). Ha a csomagárat módosítod,
  a `PLAN_NAMES`-ben és a `<select id="f-plan">`-ben is írd át, valamint az `application/ld+json`-ban
- **Új munka**: másolj le egy `<article class="card">`-ot, írd át az adatait (`data-id`, `data-cat`, `data-accent` = a színe,
  `data-name`, `data-host`, `data-sig` = egy rövid mondat a nyitóképre), tegyél be három képet az `assets/work/`-be
  (`<id>-hero.webp`, `<id>-long.webp`, `<id>-mobile.webp`) – a nyitókép bemutatója és a nézegető magától felveszi
- A `styles.css` és a `script.js` hivatkozásában verziószám van (`?v=1`): módosítás után növeld, hogy a telefonok biztosan
  az új változatot töltsék le

## Referencia-képek frissítése

A képek az ügyféloldalak helyi példányáról készülnek (Playwright + ImageMagick kell hozzá). Indítsd el az oldalakat
a `tools/shots.js` `SITES` részében megadott címeken, pl. a szomszédos mappákból:

```sh
python3 -m http.server 8801 -d ../Zenith-Detailing/public &
python3 -m http.server 8802 -d ../Penge-GLC-autoszerviz/public &
# … (a Lashes a foglalórendszer miatt: cd ../Lashes-by-Tordai-M-nika && npx wrangler dev --port 8790)
node tools/shots.js            # mind
node tools/shots.js zenith     # csak egy
node tools/images.js           # megosztási kép és iPhone-ikon újragyártása
```

## Élesítés (Cloudflare)

Ugyanúgy, mint az ügyféloldalaknál: a Cloudflare-ben a Workers & Pages alatt kösd össze ezt a repót (a `main` ágról minden
feltöltés után magától frissül), vagy parancssorból: `npx wrangler deploy`. Utána a Custom Domains résznél add hozzá a domaint.

## Helyi megtekintés

```sh
python3 -m http.server 8000 -d public
# majd: http://localhost:8000
```
