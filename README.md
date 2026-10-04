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

- Irány: **prémium, letisztult termékoldal** (az Apple „Pro” oldalainak mintájára). A nyitókép és a munkák **fekete
  színpadon** állnak, a nagy címek **ezüstös átmenettel**; utána világos, levegős szekciók (fehér és `#f5f5f7`), a végén
  újra fekete ajánlatkérő. Kék „pirula” gombok, 30 px-es lekerekítésű csempék. A színt a munkák képei adják
- **Mozgás**, visszafogottan: betöltéskor beúszik a nyitókép; a laptop mögötti halvány fény felveszi a bemutatott oldal
  színét; görgetésre a blokkok finoman beúsznak (csak ahol a böngésző tudja – a tartalom enélkül is látszik); a
  „Szemlélet” résznél a telefon helyben marad, és a képernyője lépésenként vált. Aki kikapcsolta az animációkat, annak minden áll
- **Betű:** iPhone-on és Macen a rendszer saját betűje (SF Pro) jelenik meg, minden más eszközön a hozzá legközelebb álló
  **Inter** (saját tárhelyről, SIL Open Font License, a használt vastagságokra és a magyar ékezetekre karcsúsítva: 42 KB)
- Minden szín a `styles.css` elején, a `:root` változókban van (világos felületek és a „sötét színpad” külön csoportban)
- Név: **Webzone Stúdió**, rövid változata **Webzo** (domain). Logó: sötét, ezüstös átmenetű lekerekített négyzet, benne
  vékony „W”. A jel az `index.html` alján (`#mark`), a `404.html`-ben, az `assets/favicon.svg`-ben és a `tools/images.js`-ben van
- Megszólítás: magázó, egyszerű és szakmai hangnem, szakszavak nélkül

## Szekciók – és miért ezek

Az oldal egyetlen kérdésre felel minél gyorsabban: *„Megéri-e nekem, hogy ő csinálja a weboldalamat?”*

- **Nyitókép** (fekete) – cím, egy mondat, ajánlatkérés. Alatta **élő bemutató**: a munkáid egy laptopon és egy iPhone-on
  (a Meggie Virágbolttal indul, „Átadott munka” / „Mintaoldal” címkével), a telefonban az oldal magától legörget, aztán jön
  a következő. Pontsorral, nyilakkal, ujjal lapozható, rákattintva megnyílik a teljes oldal, egy gombbal megállítható.
  Alatta **kulcsszámok**: 70–150 ezer Ft fix ár, 0 Ft havidíj, ingyenes első változat
- **Munkák** (fekete) – nagy csempén az **átadott munka** (Meggie Virágbolt). Alatta a **mintaoldalak** vízszintes
  galériában (ujjal húzható, nyilakkal lapozható, kártyánként megáll), szakmák szerint szűrhetően. Egérrel fölé állva a
  kártyán végiggörget a teljes oldal; kattintásra a **nézegető** mutatja telefonon és számítógépen is
- **Szemlélet** – helyben maradó telefon, mellette négy alapelv (áttekinthető, egy érintéssel hívható, gyors, egyedi);
  görgetés közben a telefon képernyője mindig az adott elvhez illő munkát mutatja
- **Mit kap** – fekete kiemelőcsempe **élő nyitvatartás-példával** (mintanyitvatartás: H–P 9–18, Szo 9–13, budapesti idő
  szerint mutatja, hogy „Nyitva” vagy „Zárva”, és meddig / mikor nyit – a `script.js` `DEMO_HOURS` részében), alatta
  ikonrács: 8 dolog, ami minden oldalban benne van
- **Árak** – „Melyik csomag illik Önhöz?”: három oszlop (Alap 70e, **Kirakat 110e – legnépszerűbb**, Prémium 150e), a sorok
  egy vonalban. Alatta **konfigurátor-szerű árkalkulátor** (150 000 Ft-nál megáll), és **összehasonlítás**: weboldal-építő
  vs. ügynökség vs. Webzone Stúdió (telefonon soronként kártyák). Az „Ezt választom” / „Ajánlatot kérek erre” gomb kitölti
  az ajánlatkérőt
- **Folyamat** – négy számozott lépés (ez valódi sorrend), alatta a kockázatmentes kezdés
- **Kérdések** – a nyolc leggyakoribb ellenvetés megválaszolva (havidíj, mi kell tőlem, kié az oldal, Google, webshop…)
- **Kapcsolat** (fekete) – ajánlatkérő, ami a látogató **saját levelezőjében** nyit meg egy előre megírt levelet
  (vállalkozás neve, szakma, csomag vagy a kalkulátor összeállítása, meglévő oldal, üzenet). Van „Szöveg másolása” gomb is.
  Az oldal semmit nem küld és nem tárol – ezért nem kell adatkezelési tájékoztató és sütisáv
- **Lábléc** – apró szürke megjegyzések, menü, és a lenyitható impresszum (ha ki van töltve)
- Telefonon alul megjelenik a **Munkák / (Hívás) / Ajánlatot kérek** sáv – de csak a nyitókép gombjai után, és a Kapcsolatnál eltűnik

Telefonra optimalizálva 320 px-től: nincs vízszintes görgetés (a galéria saját sávjában görget), a gombok legalább 44 px
magasak, a nézegető teljes képernyős.

## Tartalom szerkesztése

- **Elérhetőségek**: `public/script.js` eleje, `SITE` (név, e-mail, telefon, státusz-felirat)
- **Árak**: a csomagkártyák az `index.html`-ben (`<section id="arak">`); a kalkulátor tételeinek ára a `data-price`-ban;
  a csomagok tartalma a `script.js` `PRESETS` részében (melyik tétel melyik csomagban van). Ha a csomagárat módosítod,
  a `PLAN_NAMES`-ben és a `<select id="f-plan">`-ben is írd át, valamint az `application/ld+json`-ban
- **Új munka**: másolj le egy `<article class="card">`-ot (a mintaoldalak galériájában), írd át az adatait (`data-id`, `data-cat`, `data-accent` = a színe,
  `data-name`, `data-host`, `data-sig` = egy rövid mondat a nyitóképre), tegyél be három képet az `assets/work/`-be
  (`<id>-hero.webp`, `<id>-long.webp`, `<id>-mobile.webp`) – a nyitókép bemutatója és a nézegető magától felveszi
- A `styles.css` és a `script.js` hivatkozásában verziószám van (most `?v=8`): módosítás után növeld, hogy a telefonok biztosan
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
