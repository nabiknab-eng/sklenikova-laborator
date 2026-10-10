# Skleníkový efekt – interaktivní fyzikální laboratoř

[Spustit laboratoř online](https://nabiknab-eng.github.io/sklenikova-laborator/) · [Zdrojový repozitář](https://github.com/nabiknab-eng/sklenikova-laborator)

Česká statická aplikace se šesti počítanými experimenty. Zvláštní pozornost věnuje izotermii a inverzi: znaménko změny OLR i nové rovnovážné teploty vyplývá z radiačního přenosu.

## Spuštění

1. Rozbalte celý projekt do jedné složky.
2. Otevřete `index.html` v běžném moderním prohlížeči.

Není potřeba backend, instalace balíčků ani připojení k internetu. Složka `data/` i ostatní JavaScriptové soubory musí zůstat vedle HTML. Kompletní spektrální data jsou přibalená; první otevření tedy načítá asi 11 MB lokálních souborů.

Aplikace je navržená pro spuštění přes `file://`. Web Worker používá Blob, takže nepotřebuje načítat moduly přes HTTP. Pokud prohlížeč Worker omezí, aplikace použije stejné výpočty v hlavním vlákně. Export PNG, SVG a CSV používá pouze prohlížeč. Přímé otevření přes `file://` nešlo v náhledovém prohlížeči této kontroly ověřit, protože jeho bezpečnostní politika tento protokol blokuje. Funkce byly ověřeny přes místní HTTP; alternativní serverový postup je níže.

Volitelný lokální server:

```sh
python3 -m http.server 8000
```

Potom otevřete `http://localhost:8000/`.

## Jak začít

Aplikace se otevře na nové úvodní stránce. Vysvětluje základní pojmy a všech šest experimentů, jejich ovladače, čtení jednotlivých grafů, konkrétní pokusy a meze závěrů. Odkaz „Vysvětlení experimentu“ vrací z výpočtu přímo na odpovídající článek. Úvod lze kdykoli otevřít prvním bodem navigace nebo logem.

- **2 – Přidávání CO₂:** porovnejte 1× a 2×; klikněte na spektrum pro příspěvky jednotlivých výšek.
- **3 – Teplotní profil:** zkuste běžný pokles, plnou izotermii (oba gradienty 0) a kladný gradient. ΔOLR se vždy počítá při shodných teplotách proti 1× CO₂.
- **4 – Izotermická atmosféra:** klikněte na „Stejné teploty“. S absorpcí se mění jednotlivé příspěvky, ale jejich součet zůstane stejný.
- **6 – Rovnováha:** zvolte „Plná izotermie“ nebo „Inverze“, pak „Porovnat 1× → 2× CO₂“. V izotermii s posunem profilu je změna Ts nulová; v předepsané inverzi může být záporná.

Tlačítko „Uložit aktuální referenci“ uloží všechny parametry daného experimentu. „Výchozí stav“ resetuje parametry i referenci. Nastavení a reference jsou v paměti aktuální stránky, nepřenášejí se automaticky mezi experimenty a nepřetrvají obnovení stránky.

Grafy mají hodnoty pod kurzorem, po dotyku nebo při ovládání šipkami po zaměření grafu. Teplotní a příspěvkový profil mají výšku v metrech na y; na x je teplota v kelvinech, resp. hustota příspěvku. Jejich kurzor vybírá výšku, šipky nahoru/dolů postupují po vrstvách a Home/End vybírají nejnižší/nejvyšší vzorek. U ostatních grafů použijte šipky vlevo/vpravo. Konvence a primární zdroje jsou v `GRAPH_CONVENTIONS.md`. Spektrální grafy mají synchronizovaný kurzor a společné volby rozsahu. Exportujte samostatné grafy tlačítky SVG, PNG nebo CSV. Odkazy na vědecké zdroje se při kliknutí otevírají na internetu; samotná aplikace je nepotřebuje.

Volba „Rychlé“ používá 20 vzorků na interval, „Jemné“ 50 a „Plné“ všech 200 původních bodů. „Plné“ označuje spektrální vzorkování, ne přesnost skutečného zemského klimatu. Zůstává vrstvový a předepsaný model absorpce do výšky.

## Fyzikální rozsah

Planckův zákon a šedý izotermický experiment jsou přímo založené na uvedených fyzikálních rovnicích. Spektrální experimenty používají skutečné optické tloušťky z Oxfordského atlasu (RFM, HITRAN 2012) a výslovně zjednodušený model jejich rozdělení do výšky. Koncentrace se uvádějí jako násobky původního sloupce, protože zdrojové hlavičky neposkytují bezpečný převod na ppm.

Model nepřepočítává absorpci při změně teploty a tlaku a neřeší oblaka, konvekci nebo vodní zpětnou vazbu. Rovnovážné Ts jsou výsledky zvoleného uzávěru, nikoli předpověď klimatu Země. Podrobnosti: `PHYSICS.md`.

## Testy

Je potřeba Node.js 18 nebo novější, bez externích balíčků:

```sh
node tests/physics.test.cjs
node tests/review-checks.cjs
node tests/recheck-boundary.cjs
```

Testy znovu vytvoří `tests/results.json`, `tests/review-results.json` a `tests/recheck-boundary-results.json`. Hlavní sada má 26 kontrol; dodatečné sady ověřují přenos jinou úhlovou integrací a numerické kořeny na hranicích intervalu. Jejich výsledky a skutečně provedená kontrola prohlížeče jsou v `VALIDATION.md`. Samostatná kritická kontrola modelu je v `REVIEW.md`.

## GitHub Pages

Nahrajte obsah této složky do kořene repozitáře (nebo do zvoleného adresáře `docs/`) a zapněte GitHub Pages pro danou větev a adresář. Nic se nesestavuje. Cesty jsou relativní, takže aplikace funguje i pod `/nazev-repozitare/`.

## Soubory

- `index.html`, `styles.css`, `app.js`: úvodní průvodce a rozhraní experimentů;
- `physics.js`: výpočetní jádro;
- `calculations.js`: šest experimentů;
- `charts.js`: SVG grafy, kurzor, dotyk a export;
- `data/atlas.js`, `data/PROVENANCE.json`: úplná vstupní spektrální data a původ;
- `PHYSICS.md`: rovnice, předpoklady, numerika a zdroje;
- `GRAPH_CONVENTIONS.md`: orientace os, jednotky a primární webové zdroje;
- `VALIDATION.md`: výsledky původní i opakované kontroly;
- `REVIEW.md`, `RECHECK.md`: samostatná původní a opakovaná oponentura, opravené nálezy;
- `tests/`: automatické testy a strojový protokol.

Původní veřejná data jsou připsána Oxford EODG a HITRAN. Nevydáváme je za vlastní spektroskopickou databázi ani za nově udělenou datovou licenci. Nový kód je samostatný a bez externích JavaScriptových knihoven.
