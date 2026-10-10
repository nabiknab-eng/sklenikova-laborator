# Skleníkový efekt – přepracování verze 1

Šest interaktivních experimentů vycházejících ze skutečné verze 1. Toto přepracování nahrazuje předchozí veřejnou aplikaci. Historie předchozích commitů zůstává dostupná v GitHubu.

**[Otevřít laboratoř](https://nabiknab-eng.github.io/sklenikova-laborator/)**

## Spuštění

Pro spuštění stačí veřejná stránka. Pro místní kopii stáhněte celý repozitář; soubor `index.html` a ostatní soubory včetně `data/` musí zůstat pohromadě. V jeho kořenové složce spusťte lokální server:

```sh
python3 -m http.server 8000
```

Otevřete `http://localhost:8000/`. Aplikace nemá backend, sestavovací krok ani externí JavaScriptové knihovny. Spektrální data zabírají přibližně 11 MB. Výpočet běží ve Web Workeru z Blobu; při jeho nedostupnosti používá stejné jádro v hlavním vlákně. Přímé otevření `file://` nebylo v kontrolním prohlížeči ověřeno, protože jej jeho bezpečnostní politika nepovoluje; zdrojová a samostatná HTML varianta byly ověřeny přes místní HTTP.

## Výukový postup

Vyberte otázku v úvodu. Každý experiment nabídne konkrétní pokus, grafy a krátké pozorování vypočteného výsledku. Podrobnější fyzikální vysvětlení i matematický model jsou dostupné po rozbalení.

1. **Povrch:** měňte teplotu, najděte průsečík příjmu a výdeje. Změňte albedo a odlište změnu ASR od změny tepelného spektra při pevném Ts.
2. **CO₂:** připravte 1× → 2×, přepínejte absolutní a rozdílové spektrum. Vyberte střed pásma, křídlo nebo okno; porovnejte příspěvky obou stavů.
3. **Profil:** vyzkoušejte běžný pokles, plnou izotermii a inverzi. Sledujte znaménko změny OLR při stejných teplotách.
4. **Šedá vrstva:** zvolte chladnější, stejně teplou a teplejší atmosféru. Měňte τ a pozorujte oba příspěvky i jejich součet v jediném grafu.
5. **Překryv:** porovnejte zdvojnásobení CO₂ s vodou a bez vody. Doplňková tabulka vysvětluje čtyři stavy pro výpočet společných a izolovaných poklesů; jde o jiné porovnání než rozdíl proti uložené referenci.
6. **Rovnováha:** projděte původní rovnováhu, změnu bilance při stejných teplotách a novou rovnováhu. Bilanční graf lze přiblížit k oběma průsečíkům. Porovnejte posun celého profilu s pevnou atmosférou.

Reference se ukládá pro každý experiment zvlášť tlačítkem „Uložit aktuální referenci“. Tlačítka kontrolovaného porovnání nastaví původní CO₂ na 1×, aktuální na 2× a ostatní podmínky zachovají. „Výchozí stav“ obnoví parametry i referenci. Obnovení stránky uložená nastavení vymaže.

Hodnoty grafu zobrazíte kurzorem, dotykem nebo šipkami. U výškových profilů vybíráte výšku šipkami nahoru/dolů, u ostatních grafů souřadnici x šipkami vlevo/vpravo. Home/End vybírají krajní vzorek. Na spektru potvrdí Enter nebo mezerník volbu vlnočtu; u bilančních grafů volbu teploty. Escape skryje hodnoty. Teplotní profil má T / K na x a z / m na y. Výška roste vzhůru.

Grafy nabízejí místní export SVG, PNG a CSV. Kontrolní prohlížeč neposkytl při pokusu o CSV událost stažení; skutečné uložení exportu na disk proto není touto kontrolou potvrzené.

## Co model znamená

Planckův zákon, absorpce a vlastní emise určují výsledky. Optické tloušťky pocházejí z Oxfordského atlasu (RFM, HITRAN 2012). Rozdělení sloupcové absorpce do výšky je předepsaný model s 50 vrstvami. Molekulové koeficienty se při změně teploty a tlaku nepřepočítávají. Násobek 1× znamená původní sloupec atlasu; bezpečný převod na absolutní ppm metadata nedokládají.

Neřeší se bilance každé atmosférické vrstvy, konvekce, proudění, vývoj oblaků, vodní cyklus ani oceán. Hledané Ts jsou radiační rovnováhy při zvoleném pravidlu změny profilu, nikoli klimatická předpověď. Výsledky nejsou kalibrované na 3,7 W m⁻² ani na předem zvolené oteplení.

„Plné“ vzorkování používá všech 200 původních bodů každého intervalu grafu; neznamená plný klimatický model.

## Dokumentace a kontrola

- [POSOUZENI.md](POSOUZENI.md): rozbor verze 1 a doporučeného dokumentu, důvody změn i odmítnutých návrhů.
- [PHYSICS.md](PHYSICS.md): rovnice, jednotky, numerika a meze modelu.
- [GRAPH_CONVENTIONS.md](GRAPH_CONVENTIONS.md): osy grafů a ověřené primární zdroje.
- [VALIDATION.md](VALIDATION.md): výsledky aktuálních numerických a prohlížečových kontrol, skutečný rozsah oponentury.
- `archiv/`: původní posudky a validace verze 1, zřetelně oddělené od nových kontrol.

Testy potřebují Node.js, bez externích balíčků:

```sh
node tests/physics.test.cjs
node tests/teaching.test.cjs
node tests/review-checks.cjs
```

Protokoly se zapisují do `tests/results.json`, `tests/teaching-results.json` a `tests/review-results.json`. Ve zdrojích zůstává také původní kontrola hranic kořenů `tests/recheck-boundary.cjs`.

## GitHub Pages

GitHub Pages zveřejňuje kořen větve `main`. Vstupní stránkou je `index.html`; nic se nesestavuje. Aktualizace z 10. října 2026 nahrazuje předchozí aplikaci i její zastaralé snímky. Obsah nynějšího rozhraní včetně rozbalovacích vysvětlivek zůstává shodný s dokončeným místním přepracováním.

`physics.js` a `data/` jsou zachované z verze 1. `calculations.js` přidává diagnostická porovnání nad týmž jádrem. `teaching.js` obsahuje vysvětlení podle aktuálních výsledků, `charts.js` grafy a `app.js` ovládání.

Veřejná spektrální data jsou připsána Oxford EODG a HITRAN. Nevydáváme je za vlastní spektroskopii ani za nově udělenou datovou licenci.
