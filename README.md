# Webzone Stúdió (Webzo) – webkészítés (saját weboldal)

Egyoldalas bemutatkozó és értékesítő oldal: egyedi weboldalak kisvállalkozásoknak, fix áron (70 000 – 150 000 Ft).
Nincs szükség build lépésre: a `public/` mappa bármilyen statikus tárhelyen kiszolgálható (Cloudflare Workers, Netlify, GitHub Pages) –
ugyanúgy, mint az ügyféloldalak.

## ⚠️ Élesítés előtt – ezeket nézd át

1. **E-mail cím** – az oldalon most a `siposhunor1112@gmail.com` szerepel, ami a nevedet tartalmazza. Ha megvan a domain,
   érdemes egy céges címet létrehozni (pl. `hello@webzo.hu`), és átírni a `public/script.js` `SITE.email` sorában,
   az `index.html`-ben (Kapcsolat, `application/ld+json`) is.
2. **Impresszum** – a magyar jogszabályok szerint egy szolgáltatást kínáló weboldalon kötelező (szolgáltató neve, székhely,
   adószám, nyilvántartási szám, elérhetőség, tárhelyszolgáltató). Töltsd ki a `public/script.js` `LEGAL` részét: amint a
   `name` nem üres, a láblécben megjelenik egy lenyitható „Impresszum”. A tárhelyszolgáltató (Cloudflare) adatai már benne vannak.
3. **Telefonszám** – `public/script.js`, `SITE.phone` (most `null`, ezért nem látszik). Kisvállalkozók szívesebben telefonálnak:
   ha megadod, megjelenik a Kapcsolatnál és telefonon az alsó sávban is (Hívás gomb).
4. **Domain** – az oldal a `https://webzo.hu/` címet feltételezi (foglald le a domain.hu-n, ha még szabad; másik lehetőség: webzonestudio.hu). Ha más lesz, írd át itt:
   `public/index.html` (`og:image`, `og:url`, `canonical`, `application/ld+json`), `public/robots.txt`, `public/sitemap.xml`.
5. **A Meggie Virágbolt élő címe** – az `index.html`-ben a kiemelt munkánál (`<article class="card feature" data-id="meggie" …>`)
   írd a `data-url=""`-be az élő oldal címét. Ekkor megjelenik az „Élő oldal” gomb, a böngészőablak tetején pedig a valódi cím.
6. **Mintaoldalak** – a másik kilenc oldal „Mintaoldal” címkét kapott, és a szekció kiírja, hogy saját kezdeményezésre, nyilvános
   adatok alapján készültek, nem megrendelésre. Valódi vállalkozások nevét viselik: ha valamelyik vállalkozás kéri, vedd ki
   (az `<article>` törlésével; a szűrő-gombok számát – `<sup>2</sup>` – is igazítsd hozzá). Ha később megrendelés lesz belőle,
   írd át a `data-kind`-ot „Átadott munka”-ra, és tedd át a kiemelt részbe.
7. **Üzleti feltételek** – ezeket én javasoltam, döntsd el, vállalod-e (mind az `index.html`-ben):
   - „Kockázatmentes kezdés: az első változatot díjmentesen elkészítem. Ha nem tetszik, nem tartozik semmivel.” (Folyamat)
   - Fizetés: 50% a munka elején, 50% élesítéskor (GYIK)
   - „24 órán belül válaszolok” (Kapcsolat)
   - Plafon: a kalkulátor tételeiért legfeljebb 150 000 Ft (`CAP` a `script.js`-ben)
8. **Adózás** – az árak mellett most nincs „bruttó / alanyi adómentes” megjegyzés. Ha vállalkozóként számlázol,
   írd a `pricing__note` sorba, hogy pl. „Az árak alanyi adómentesek” – ez a könyvelődtől függ.
9. **Felirat a nyitóképen** – `SITE.status` („Most is vállalok új munkát”). Lehet konkrét is, pl. „Novemberben még 2 szabad hely”
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

- Koncepció: **kirakat és cégtábla**. Világos, hűvös papírfehér alap, tintakék szöveg, és **egyetlen kiemelőszín:
  zománctábla-kobaltkék** (`--cobalt`) – a gombok, a kiemelt csomag és a „Webzone Stúdió” oszlop is ilyen. A kék minden
  ügyféloldal színétől eltér, így a referenciák színei nem ütik egymást
- A merész pont egy helyen van: a nyitóképen az „**ügyfelet hoz.**” egy kobaltkék cégtáblán áll (belső fehér szegély, két
  csavar, kicsit megdöntve). Ugyanez a tábla a logó, a szekciócímkék apró jele és a 404-es oldal száma is
- **Sötét mód**: ha a látogató telefonja/gépe sötét módban van, az oldal is sötét („éjszakai utca”). Minden szín
  a `styles.css` elején lévő `:root` változókban van, a sötét változat közvetlenül alatta
- Betűk saját tárhelyről (SIL Open Font License): **Bricolage Grotesque** (címek, keskeny–normál szélességgel) és
  **Figtree** (szöveg). Mindkettő le van karcsúsítva a használt vastagságokra és a magyar ékezetekre: összesen kb. 80 KB
- Név: **Webzone Stúdió**, rövid változata **Webzo** (domain). Logó: kobaltkék zománctábla, rajta vonalas „W”.
  A jel az `index.html` alján (`#mark`), a `404.html`-ben, az `assets/favicon.svg`-ben és a `tools/images.js`-ben van
- Megszólítás: magázó, egyszerű és szakmai hangnem, szakszavak nélkül

## Szekciók – és miért ezek

Az oldal egyetlen kérdésre felel minél gyorsabban: *„Megéri-e nekem, hogy ő csinálja a weboldalamat?”*

- **Nyitókép** – az első képernyőn ott van minden lényeg: mit csinálsz (weboldal, ami ügyfelet hoz), mennyiért (70 000 Ft-tól,
  fix ár), mi a csapda máshol (havidíj – nálad 0 Ft), és hogy az első változat ingyenes. Mellette **élő bemutató**: a saját munkáid
  egy telefonban és egy böngészőablakban (a Meggie Virágbolttal indul, mindegyiknél ott a címke: „Átadott munka” vagy
  „Mintaoldal”), a telefonban az oldal magától legörget, a háttér fénye felveszi az adott oldal színét,
  aztán jön a következő. Ujjal lapozható, egérrel megdől, rákattintva (vagy Enterrel) megnyílik a teljes oldal, és egy gombbal
  megállítható. Nem állítás, hanem bizonyíték.
- **Szemlélet** – a vevő telefonról, néhány másodperc alatt dönt, és négy alapelv. Alatta **összehasonlítás**:
  sablonos weboldal-építő vs. ügynökség vs. te – a valódi alternatívák, amiken a vevő gondolkodik. Telefonon kártyákká alakul
- **Munkák** – elöl, kiemelve az **átadott munka** (Meggie Virágbolt): nagy kép, leírás, mit tartalmaz. Alatta a
  **mintaoldalak** szakmák szerint szűrhetően, egyértelmű „Mintaoldal” címkével. Egérrel fölé állva a kártyán végiggörget a
  teljes oldal; a kártyák tetején böngészősáv a címmel, a címke előtt az oldal saját színe; kattintásra a **nézegető** mutatja telefonon és számítógépen is (telefonon lapokkal vált)
- **Mit kap** – 8 dolog, ami minden oldalban benne van (élő nyitvatartás, hívás/útvonal, szövegírás, nincs sütisáv…).
  Ezek az ügyféloldalaid valódi tudása – a READMEékből gyűjtöttem össze. Mellette egy **élő ajtótábla**: egy
  mintanyitvatartással (H–P 9–18, Szo 9–13) valós időben, budapesti idő szerint mutatja, hogy „Nyitva” vagy „Zárva”, és meddig /
  mikor nyit – ugyanúgy, ahogy az ügyféloldalakon működik. A mintaidőpontok a `script.js` `DEMO_HOURS` részében vannak
- **Árak** – három csomag (Alap 70e, **Kirakat 110e – legnépszerűbb**, Prémium 150e), átfutási idő és módosítási körök nélkül. A középső kiemelése a döntést
  könnyíti. Alatta **árkalkulátor**: a tételek kipipálásával élőben számolja a végösszeget, 150 000 Ft-nál megáll
  („ennél többet nem kérek”). A „Ezt kérem” / „Ezzel kérek ajánlatot” gomb kitölti az ajánlatkérőt
- **Folyamat** – négy számozott lépés (ez valódi sorrend), és a kockázatmentes kezdés („az első változat díjmentes”)
- **Kérdések** – a nyolc leggyakoribb ellenvetés megválaszolva (havidíj, mi kell tőlem, kié az oldal, Google, webshop…)
- **Kapcsolat** – ajánlatkérő, ami a látogató **saját levelezőjében** nyit meg egy előre megírt levelet (vállalkozás neve,
  szakma, csomag vagy a kalkulátor összeállítása, meglévő oldal, üzenet). Van „Szöveg másolása” gomb is (Messengerre).
  Az oldal semmit nem küld és nem tárol – ezért nem kell adatkezelési tájékoztató és sütisáv
- **Lábléc** – logó, menü, és a lenyitható impresszum (ha ki van töltve)
- Telefonon alul megjelenik a **Munkák / (Hívás) / Ajánlatot kérek** sáv – de csak a nyitókép gombjai után, és a Kapcsolatnál eltűnik

Telefonra optimalizálva 320 px-től: nincs vízszintes görgetés, minden gomb legalább 44 px, a szövegek nem úsznak be
(betöltéskor azonnal látszanak), a nézegető teljes képernyős. Aki kikapcsolta az animációkat (`prefers-reduced-motion`), annak minden áll.

## Tartalom szerkesztése

- **Elérhetőségek**: `public/script.js` eleje, `SITE` (név, e-mail, telefon, státusz-felirat)
- **Árak**: a csomagkártyák az `index.html`-ben (`<section id="arak">`); a kalkulátor tételeinek ára a `data-price`-ban;
  a csomagok tartalma a `script.js` `PRESETS` részében (melyik tétel melyik csomagban van). Ha a csomagárat módosítod,
  a `PLAN_NAMES`-ben és a `<select id="f-plan">`-ben is írd át, valamint az `application/ld+json`-ban
- **Új munka**: másolj le egy `<article class="card">`-ot, írd át az adatait (`data-id`, `data-cat`, `data-accent` = a színe,
  `data-name`, `data-host`, `data-sig` = egy rövid mondat a nyitóképre), tegyél be három képet az `assets/work/`-be
  (`<id>-hero.webp`, `<id>-long.webp`, `<id>-mobile.webp`) – a nyitókép bemutatója és a nézegető magától felveszi
- A `styles.css` és a `script.js` hivatkozásában verziószám van (most `?v=6`): módosítás után növeld, hogy a telefonok biztosan
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
