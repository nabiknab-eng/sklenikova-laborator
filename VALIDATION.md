# Kontrola přepracování verze 1

Datum: 10. října 2026. Zdrojový základ: skutečná zachovaná verze 1. Numerické a prohlížečové kontroly uvedené níže proběhly před publikováním na místní kopii. Přepracování je od 10. října 2026 publikováno na GitHub Pages. Tato kontrola neslibuje shodu s úplným klimatickým modelem ani dokázané zlepšení výsledků studentů ve třídě.

## Numerické výsledky

Hlavní sada: **26/26 úspěšných kontrol** v `tests/results.json`. Sada porovnání a nových výukových diagnostik: **10/10** v `tests/teaching-results.json`. Dodatečná kontrola `tests/review-checks.cjs` prošla: znovu ověřuje původ dat, radiační přenos jinou úhlovou metodou, extrémní nastavení, izotermii, neizotermickou kompenzaci a pevný atmosférický profil.

Nové diagnostiky ověřují:

- integrál rozdílového spektra proti ΔOLR, včetně průhledného zbytku;
- rekonstrukci vybraných spektrálních toků součtem povrchu a všech vrstev v obou stavech;
- čtyři explicitní toky pro překryv CO₂ a vody proti samostatným výpočtům;
- rozdíl toků při totožných teplotách a následné hledání kořene, bez dosazené klimatické citlivosti;
- nulový rozdíl při shodném sloupci a nulovou izotermickou odezvu;
- zápornou počáteční změnu bilance a ochlazení v předepsané inverzi;
- skutečně pevnou atmosféru při změně samotné povrchové teploty;
- chybějící původní kořen bez náhradního smyšleného řešení;
- přiblížený graf s přímo počítanými toky a oběma přesnými kořeny;
- bitovou shodu jádra a atlasu s verzí 1.

Přenos byl nezávisle na součtu hemisférických vah zkontrolován rekurencí zářivosti jednotlivými vrstvami a následnou integrací přes 2048 úhlových vzorků, pro tři profily a pět spektrálních intervalů. Jedná se o jinou kontrolní numerickou metodu stejného modelu, nikoli o nezávislé spektrální nebo klimatické měření. Hodnoty jsou v `tests/review-results.json`.

Pro výchozí ASR = 238,175 W m⁻², pevné sloupce ostatních plynů a posun celého profilu:

| Profil | Ts při 1× / K | Změna N při původních teplotách / W m⁻² | Nová Ts při 2× / K | Změna Ts / K |
|---|---:|---:|---:|---:|
| Běžný pokles | 283,19607 | +1,78143 | 283,66066 | +0,46459 |
| Plná izotermie | 254,57814 | přibližně 0 (7,7 × 10⁻¹³) | 254,57814 | 0 |
| Inverze | 236,24641 | −1,75221 | 235,76516 | −0,48125 |

Změna N se počítá jako OLR₁ₓ(T₀) − OLR₂ₓ(T₀). Reziduum hledání původního kořene se proto nestane falešným působením při shodných stavech. Kořeny mají teplotní toleranci 10⁻⁵ K a v uvedených případech absolutní bilanční reziduum pod 2 × 10⁻⁵ W m⁻². Zelený bod N = 0 je grafické označení tohoto numericky hledaného kořene; surová data uchovávají reziduum.

Při pevné Ts = 288 K je změna OLR pro běžný profil −1,878 W m⁻² a pro zvolenou inverzi +2,712 W m⁻². To je jiné porovnání než tabulka začínající ve vlastní rovnováze. Bez vody v experimentu 5 dává kontrolované zdvojnásobení −3,098 W m⁻², s původní vodou −1,878 W m⁻². Nejde o univerzální parametry Země.

## Kontrola v prohlížeči

Zdrojová aplikace i výsledné samostatné HTML byly spuštěny přes místní HTTP. V samostatném HTML bylo znovu vyzkoušeno porovnání CO₂, uložení reference a reset i výpočet nové rovnováhy a její nastavení. Záznam čtených výsledků je v `tests/browser-rework.json`. Provedené kontroly:

| Oblast | Skutečně vyzkoušené chování |
|---|---|
| Úvod | Šest otázek, vstupy do experimentů, úvodní odlišení radiačního a klimatického modelu. |
| Experiment 1 | Nastavení průsečíku; změna A z 0,300 na 0,297 při pevném Ts zvyšuje N o 1,02 W m⁻², referenční ASR zůstává. |
| Experiment 2 | Kontrolované 1× → 2×, absolutní/rozdílové zobrazení, výběr křídla a dalšího vlnočtu klávesami Home, šipka, Enter; současné profily obou stavů. Rozbalení vážených výšek vykreslí dvě křivky. |
| Experiment 3 | Běžný pokles, plná izotermie a inverze; správná znaménka a oba gradienty obnovené úplnými předvolbami. Výška na y v metrech, T na x. |
| Experiment 4 | Při Ta = Ts zůstává OLR 390,1 W m⁻² i při změně τ z 1 na 5, zatímco příspěvky se mění. Chladnější a teplejší předvolby dávají očekávaný směr součtu. |
| Experiment 5 | Zdvojnásobení s vodou a bez vody, správná reference, čtyřstavová tabulka a pět křivek optických tlouštěk po rozbalení. |
| Experiment 6 | Tři kroky pro běžný profil, izotermii a inverzi; pevná atmosféra s vlastním ovladačem; nastavení nalezené rovnováhy; přepnutí celého rozsahu a přiblížení. |
| Vrstvy výkladu | Krátké aktuální pozorování, samostatně rozbalitelná fyzika a matematický panel. |
| Rozměry | Šířky 805 a 1280 px; mobil 390 × 844 px. Úvod a experimenty 2, 3 a 6 mají šířku dokumentu rovnou šířce viewportu. Na mobilu se navigace posouvá uvnitř vlastního pruhu. |

Nálezy odstraněné během závěrečného průchodu:

1. Synchronizovaný kurzor volal dosud nevykreslený sbalený graf. Volání se nyní vynechá a otevřený doplňkový graf se vykreslí při události rozbalení. Klávesnicový výběr a následné rozbalení byly znovu vyzkoušeny, bez nové chyby konzole.
2. Velmi malé příspěvky se zaokrouhlovaly na nulu. Používá se vědecký zápis.
3. Karta dalšího zdvojnásobení neodlišovala 1× → 2× od 2× → 4×. Nyní uvádí aktuální násobky.
4. Nové body rovnováhy v celém intervalu 200–380 K splývaly. Přiblížený graf používá další přímo počítané toky v okolí kořenů; původní celý rozsah zůstává dostupný.
5. Pro izotermickou předvolbu byla příliš obecná poznámka o nulové změně. Vysvětlení nyní výslovně odkazuje na stejné teploty; u případné neizotermické kompenzace nadále nevyvozuje izotermii.
6. Po změně souborů se v náhledovém prohlížeči použily starší skripty z cache. Zdrojové HTML nyní odkazuje na soubory s otiskem jejich obsahu v URL.

Při závěrečné kontrole opraveného zdrojového rozhraní nebyly zachyceny nové chyby JavaScriptu. Snímky skutečných náhledů jsou v `previews/`. Přímé spuštění `file://` nebylo kontrolním prohlížečem dostupné. Pokus o CSV export nedal událost stažení; skutečné uložení SVG/PNG/CSV na disk se tímto protokolem nepotvrzuje. Tlačítka a místní exportní mechanismus jsou zachované.

## Závěrečný průchod z pohledu studenta a fyzika

Z hlediska studenta má každý zásah viditelný protějšek: rozdílové spektrum proti skutečné referenci, oba výškové příspěvky, součet obou částí šedého toku nebo posun průsečíku. Souhrnné a obtížnější grafy nepředcházejí hlavní otázce. Podrobnosti jsou volitelné. Snížilo se opakování obecného výkladu.

Z hlediska fyzika jsou oddělené předepsané teploty a energetická rovnováha, změna dlouhovlnné bilance a teplotní odezva, TOA bilance a rovnováha jednotlivých vrstev. Koeficienty absorpce, sloupcové násobky a model rozdělení do výšky mají popsané meze. Nezavádí se univerzální kladné působení pro inverzní profily. Nulové ΔOLR samo o sobě není důkaz izotermie.

Jde o oddělený závěrečný průchod autora, ne o posudek jiného člověka. Přínos pro porozumění je odborně a pedagogicky odůvodněný, nebyl ale měřen na skutečné třídě. Vhodným dalším ověřením je nechat studenty před a po pokusu vysvětlit rozdíl mezi absorpcí a unikající emisí a předpovědět znaménko u neznámého profilu.

Samostatné HTML, vazby dokumentace, ZIP a zachování všech souborů v1 jsou kontrolovány při balení; strojový výsledek je v `tests/package-checks.json`.
