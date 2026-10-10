# Provedená fyzikální, numerická a uživatelská kontrola

První kontrola: 9. října 2026; úplná opakovaná kontrola a nová úvodní stránka: 10. října 2026. Kontrolována je přibalená implementace, její lokální spektrální data a výuková interpretace. **Aktuální hlavní sada prošla 26 z 26 testů.** Prošla také dodatečná sada samostatného oponenta. Níže uvádíme skutečně naměřené výsledky, nikoli plánované testy.

Strojové protokoly: [`tests/results.json`](tests/results.json), [`tests/review-results.json`](tests/review-results.json), [`tests/browser-checks.json`](tests/browser-checks.json) (původní UI kontrola), [`tests/recheck-browser.json`](tests/recheck-browser.json) (opakovaná UI kontrola) a [`tests/recheck-boundary-results.json`](tests/recheck-boundary-results.json). Rozbor samostatné agentní oponentury a opravených nálezů: [`REVIEW.md`](REVIEW.md). Rovnice, zdrojová data a úplné předpoklady: [`PHYSICS.md`](PHYSICS.md).

## 1. Co tato kontrola prokazuje

Testy kontrolují matematickou implementaci zvoleného modelu: Planckův zákon, hemisférický přenos přes vrstvy v LTE bez rozptylu, příspěvkové váhy, spektrální překryv a kořeny definované TOA bilance. Kontrolují konzistentní znaménka, mezní případy a vybrané numerické konvergence.

**Nejde o empirickou validaci přesnosti vůči skutečné zemské atmosféře.** Oxfordský atlas poskytuje skutečné sloupcové optické tloušťky vypočtené pomocí RFM a HITRAN 2012. Jejich zvolená separace do výšky, pevné absorpční koeficienty při změně teploty a předepsané teplotní profily jsou výslovná omezení. Použití všech původních spektrálních bodů tato omezení neodstraní. Kořen TOA bilance sám nezajišťuje povrchovou ani vrstvovou energetickou rovnováhu.

## 2. Planckův integrál a energetická bilance

Nezávislá numerická Simpsonova integrace Planckova spektra byla porovnána s analytickým σT⁴. σ se v implementaci odvozuje z definujících konstant h, c a k. Integrál v tomto testu má samostatnou jemnou mřížku; není to pouze součet hodnot grafu aplikace.

| T / K | Numerický tok / W m⁻² | σT⁴ / W m⁻² | Relativní chyba |
|---:|---:|---:|---:|
| 150 | 28,70627049717 | 28,70627049712 | 1,60 × 10⁻¹² |
| 255 | 239,75764181939 | 239,75764181901 | 1,59 × 10⁻¹² |
| 288 | 390,10515355517 | 390,10515355455 | 1,59 × 10⁻¹² |
| 350 | 850,91056128022 | 850,91056127886 | 1,60 × 10⁻¹² |
| 600 | 7348,80524727475 | 7348,80524726302 | 1,60 × 10⁻¹² |

Pro S = 1361 W m⁻² a A = 0,30 vychází ASR = 238,175 W m⁻² a Te = **254,578140 K**, tedy přibližně 255 K. Při S = 600 W m⁻² a A = 0,80 je ASR = 30 W m⁻² a Te = 151,662210 K. Po opravě rozsahu experimentu 1 leží tento průsečík uvnitř grafu i ovladače 120–380 K.

## 3. Úhlová integrace a příspěvkové váhy

Analytická hemisférická propustnost Q(τ) = 2E₃(τ) byla porovnána s nezávislou 256bodovou Gaussovou úhlovou kvadraturou pro τ = 0; 10⁻⁶; 0,001; 0,01; 0,1; 1; 2; 8; 10 a 30. Největší absolutní rozdíl byl **3,36 × 10⁻¹²**. Nejde o model jediného vertikálního paprsku exp(−τ).

Interpolovaná tabulka Q používaná pro rychlý spektrální výpočet měla v kontrolní mřížce největší absolutní odchylku **3,39474 × 10⁻⁷** proti přímému vyhodnocení exponenciálního integrálu. Byla ověřena její nezápornost a monotónnost. Největší chyba součtu povrchové a vrstvových přenosových vah od jedné byla **7,77 × 10⁻¹⁶**. Součet emisních příspěvků navíc rekonstruoval výsledný spektrální tok.

Samostatný oponent implementoval jinou přenosovou cestu: rekurenci zářivosti od povrchu přes každou vrstvu pro 2048 úhlových směrů, následovanou integrací s vahou 2μ. Nepoužil Q, E₁ ani E₃ aplikace. Pět spektrálních intervalů pro každý ze tří profilů — běžný, izotermický a inverzní — dalo největší relativní rozdíl **2,96137 × 10⁻⁷**. Tento test sdílí vstupní data a binovou Planckovu aproximaci, má vlastní úhlovou diskretizační chybu a není nezávislou klimatickou simulací.

## 4. Mezní případy

| Kontrola | Skutečně ověřený výsledek |
|---|---|
| Nulová optická tloušťka | OLR = σTs⁴; atmosférický příspěvek je nulový. |
| Neprůhledná šedá vrstva | OLR se blíží σTa⁴. |
| Neprůhledný vrstvený sloupec | Spektrální tok se blíží emisi horní vrstvy. |
| Šedá vrstva s Ts = Ta | Celkový OLR nezávisí na τ; oba dílčí příspěvky se mění. |
| Spektrální sloupec s Tj = Ts | OLR nezávisí na množství CO₂. |
| Chladnější šedá atmosféra | Zvýšení τ snižuje OLR. |
| Teplejší šedá atmosféra | Zvýšení τ zvyšuje OLR. |
| Předepsaná teplotní inverze | Zdvojnásobení CO₂ může zvýšit OLR. |

Oponent navíc ověřil, že nulová **integrální** změna OLR může nastat kompenzací neizotermických částí profilu. Rozhraní proto neurčuje shodnost teplot pouze ze znaménka nebo nulovosti ΔOLR. Numerické zbytky v plné izotermii jsou řádově 10⁻¹¹ W m⁻²; slovní vysvětlení používá toleranci 10⁻⁷ W m⁻² a vyčíslená změna je po zaokrouhlení 0,00.

## 5. CO₂ a znaménková konvence

Výchozí profil: Ts = 288 K, Γ = −0,0065 K m⁻¹, tropopauza 11 000 m, Γs = +0,001 K m⁻¹, 50 vrstev do 50 000 m. Všechny plyny začínají na 1× původního sloupce atlasu. Zdvojnásobení znamená změnu CO₂ na 2× při ostatních nezměněných parametrech; zdrojová metadata neposkytují spolehlivý převod na absolutní ppm.

Při rychlém vzorkování vychází OLR **257,136193 → 255,258248 W m⁻²**. Tedy ΔOLR = **−1,877945 W m⁻²** a při pevném ASR ΔN = −ΔOLR = **+1,877945 W m⁻²**. Při plném spektrálním vzorkování je ΔOLR −1,874461 W m⁻².

Pro inverzi Γ = +0,003 K m⁻¹ a Γs = 0 při stejné Ts = 288 K vychází OLR **493,961915 → 496,674194 W m⁻²**, tedy ΔOLR = **+2,712280 W m⁻²**. Zvýšení odvodu energie vzniká z výpočtu vlastního záření teplejších vrstev.

Tyto hodnoty představují okamžitou dlouhovlnnou změnu tohoto modelu při předepsaných teplotách. Neobsahují krátkovlnnou odezvu ani přizpůsobení stratosféry. Klasický literární odhad přibližně 3,7 W m⁻² má jinou konvenci a **není reprodukován ani použit jako kalibrační cíl**. Rozdíl mezi konvencemi nevysvětluje ani neodstraňuje omezení našeho vertikálního modelu. Kontext a zdroje jsou v PHYSICS.md a REVIEW.md.

## 6. Spektrální překryv

Při výchozím profilu je společný pokles toku po přidání CO₂ a H₂O **124,405763 W m⁻²**, zatímco součet jejich dvou izolovaných poklesů je **137,170296 W m⁻²**. Rozdíl je −12,764533 W m⁻². V každém ze čtyř porovnávaných stavů zůstávají CH₄ a N₂O stejné.

Absorpce se sčítají na původních společných spektrálních souřadnicích; nelineární přenos se počítá před průměrováním do grafu. Výsledek dokládá nesčitatelnost změn toku, nikoli nesčitatelnost optických tlouštěk.

## 7. Rovnováha, izotermie a modelové ochlazení

ASR = 238,175 W m⁻². Kořeny hledáme v intervalu Ts = 200–380 K, nejprve mřížkou po 5 K a pak půlením intervalu do teplotní šířky 10⁻⁵ K. V následující tabulce je rychlé vzorkování 20 bodů a 50 vrstev.

| Podmínka hledání | Ts při 1× CO₂ / K | Ts při 2× CO₂ / K | Změna / K |
|---|---:|---:|---:|
| Posun celého plně izotermického profilu s povrchem | 254,578137 | 254,578137 | 0 |
| Posun celého předepsaného inverzního profilu s povrchem | 236,246409 | 235,765157 | −0,481253 |

U běžného profilu s posunem je při 1× rovnováha Ts = 283,196073 K, reziduum N = +1,48143 × 10⁻⁵ W m⁻² a dOLR/dTs = 3,84445 W m⁻² K⁻¹. Se **samostatně pevnou atmosférickou základnou 288 K** vychází místo toho Ts = 275,990071 K, reziduum −5,28224 × 10⁻⁶ W m⁻² a dOLR/dTs = 1,46854 W m⁻² K⁻¹. Pevný atmosférický základ je skutečně nezávislý na aktuální Ts; změna aktuálního povrchu ze 235 na 300 K tento kořen nemění.

Izotermie a inverze tak nejsou jen poznámkou o znaménku OLR. Experiment 6 skutečně počítá nulovou nebo zápornou změnu kořene Ts pod jasně definovanou uzávěrovou podmínkou. Sloupce plynů, absorpce a vodní pára zůstávají pevné. Samovolný vznik a udržení předepsané inverze se neřeší.

Test bez kořene (ASR = 0) potvrzuje, že aplikace vrací prázdný seznam kořenů; teplotu mimo hledaný interval neextrapoluje a neprezentuje neexistenci v intervalu jako důkaz neexistence všude.

## 8. Numerická konvergence

Výchozí profil, 50 vrstev; interval grafu 200 m⁻¹:

| Vzorků na interval | OLR / W m⁻² | ΔOLR při 1× → 2× CO₂ / W m⁻² |
|---:|---:|---:|
| 20 | 257,136193 | −1,877945 |
| 50 | 257,142237 | −1,875680 |
| 200, všechny původní body | 257,144988 | −1,874461 |

Rozdíl 20 proti 200 bodům je 0,008795 W m⁻² v OLR a 0,003484 W m⁻² v ΔOLR. Oponent vyzkoušel i tři další extrémní profily. Ve čtyřech zkoušených profilech činí největší rozdíl OLR 0,047657 W m⁻² a rozdíl ΔOLR 0,003776 W m⁻². Nejde o zaručenou chybu pro libovolné parametry.

Plné spektrální vzorkování, stejný výchozí profil:

| Počet vrstev | OLR / W m⁻² | ΔOLR při 1× → 2× CO₂ / W m⁻² |
|---:|---:|---:|
| 25 | 256,753564 | −1,870197 |
| 50 | 257,144988 | −1,874461 |
| 100 | 257,172714 | −1,874787 |

Rozdíl 50 proti 100 vrstvám je 0,027726 W m⁻² v OLR a 0,000326 W m⁻² v ΔOLR. Tato kontrola mění jen diskretizaci, nikoli zvolený exponenciální model absorpce do výšky. Jeho fyzikální nejistotu tabulka nekvantifikuje. Zůstává také aproximace hladké Planckovy funkce uvnitř spektrálního intervalu.

Zdrojová data mají pro každý ze čtyř plynů 500 000 konečných nezáporných hodnot. Oponent ověřil shodu SHA256 všech čtyř dekódovaných float32 polí s manifestem. Při Ts = 288 K je přidaný průhledný tok mimo horní hranici atlasu 0,000015009 W m⁻².

## 9. Původní kontrola prohlížeče 9. října 2026

Aplikace byla načtena v náhledovém prohlížeči Codex přes server na místním rozhraní. Ovládání bylo zkoušeno přes skutečné UI, výsledky byly čteny z vykreslených karet a grafů. Záznam obsahuje i dřívější pozorování před opravou číselného vstupu a zaokrouhlení; nahrazené pozorování je označeno.

- Načtení všech šesti experimentů, jejich karet a grafů.
- Změna CO₂, číselný vstup i předvolby, uložení reference a reset.
- Synchronizovaný spektrální kurzor; klávesový Home na omezeném rozsahu zobrazil ve dvou grafech stejný vlnočet 45 100 m⁻¹.
- Spektrální rozsahy, příspěvkové zobrazení a graf CO₂ v celém dostupném rozsahu 0–8×.
- Izotermická a inverzní předvolba; nulová i záporná změna rovnovážné Ts.
- Nastavení nalezeného kořene do ovladače povrchu; bilance se následně zobrazila jako vyrovnaná. Rovněž pro pevnou atmosféru.
- Šedý experiment Ts = Ta = 288 K, τ = 1 a 12: konstantní součet a proměnlivé dílčí příspěvky. Číselný vstup τ = 12 po opravě reaguje ihned.
- Nízká analytická rovnováha Te = 151,7 K uvnitř rozsahu experimentu 1.
- Volba plného spektrálního vzorkování a skutečný přepočet v prohlížeči.
- Rozbalovací matematické vysvětlení a dialog o modelu a zdrojích.
- Vizuální kontrola desktopu, tabletu 800 × 1000 a úzkého rozhraní 390 × 844. U obou úzkých šířek se šířka dokumentu rovná šířce viewportu; stránka nepřetéká vodorovně. Navigace mezi experimenty se na úzkém displeji posouvá.

Export skutečně vytvořil SVG (11 139 bytů, validní XML), PNG (97 212 bytů, 1294 × 700 pixelů) a CSV (183 909 bytů, 2501 řádků včetně hlavičky) jednoho spektrálního grafu. PNG byl otevřen a vizuálně ověřen, SVG mělo rozměry 647 × 350. Toto je ověření konkrétního exportu, nikoli plošný test všech kombinací grafů a parametrů. Při závěrečném čtení prohlížeč nehlásil konzolové chyby ani varování.

Snímky skutečné aplikace jsou v [`previews/`](previews/), včetně [`inverze.jpg`](previews/inverze.jpg).

**Neověřená cesta:** přímé otevření `index.html` přes `file://` bezpečnostní politika náhledového prohlížeče odmítla. Aplikace je pro tuto cestu navržena (lokální klasické skripty, Blob Worker a záložní hlavní vlákno), její provedení v běžném externím prohlížeči ale touto kontrolou není doloženo. Ověřena je lokální HTTP cesta; jednoduchý postup uvádí README. Nebyla provedena matice Chrome/Safari/Firefox ani test na fyzickém tabletu. GitHub Pages nebyl publikován.

## 10. Reprodukce

V kořeni rozbaleného projektu, Node.js 18 nebo novější, bez balíčků a sítě:

```sh
node tests/physics.test.cjs
node tests/review-checks.cjs
node tests/recheck-boundary.cjs
```

První příkaz zapíše hlavní protokol, druhý protokol dodatečné přenosové oponentury a třetí protokol hraniční numerické sondy. Nesplnění kontrolního tvrzení ukončí příkaz chybou. Protokol prohlížeče popisuje provedenou interaktivní kontrolu; uvedené dva příkazy ji automaticky neopakují.

Po závěrečných změnách byl znovu úspěšně spuštěn hlavní i oponentní test a kontrola syntaxe všech čtyř ručně psaných JavaScriptových modulů. Oponentem nalezené chyby interpretace nulového rozdílu a příliš úzkého rozsahu experimentu 1 byly opraveny; při závěrečné kontrole nezůstal otevřený nález vyžadující opravu rovnic nebo znamének.

## 11. Opakovaná kontrola 10. října 2026

Nová výchozí úvodní stránka vysvětluje všech šest experimentů, ovladače, veličiny, jejich grafy, navržené pokusy i meze závěrů. Samostatný oponent porovnal její text s výpočtem a skutečnými ovladači. Opraveny byly čtyři drobné nepřesnosti formulací a dvě úzce související chyby detekce přesného kořene na výpočetní mřížce. Celá nová revize je v [RECHECK.md](RECHECK.md).

### Numerika

- Hlavní sada znovu prošla **26/26** včetně jedinečnosti kořene, jeho derivace a odolnosti analytické izotermické rovnováhy na hranicích vůči numerickému zbytku.
- Opakovaná přenosová oponentní sada prošla. Největší relativní rozdíl proti samostatné paprskové úhlové integraci zůstává 2,96137 × 10⁻⁷.
- Samostatná hraniční sonda prošla: 148 srovnání s analytickým σT⁴, 12 kořenů při T = 200, 225, 380 K a 8 stavů se vstupním tokem o 10⁻⁵ W m⁻² pod či nad hledaným intervalem.
- Největší odchylka izotermického toku od σT⁴ na mřížce je 4,43748 × 10⁻¹⁰ W m⁻². Nová tolerance |N| ≤ 10⁻⁹ W m⁻² ji pokrývá a při 200 K odpovídá pouze 5,51 × 10⁻¹⁰ K. Kořen skutečně mimo interval se v testovaných případech nevrací.
- Kontrola syntaxe všech čtyř vlastních JavaScriptových modulů prošla.

### Rozhraní a grafy

Aktuální browserový protokol má **19 úspěšných pozorování z 19**. Obsahuje výchozí úvod, cílený návrat do článku, otevření jednotlivých experimentů, jejich grafy, zachování nastavení a reference při cestě přes úvod, reset a kontrolu konzole. Navíc byly skutečně otevřeny odborné pozadí a dialog o modelu.

Teplotní profil má x = T / K a y = z / m; příspěvkový profil má x = Cj,κ/Δz a y = z / m. Bylo ověřeno, že teplota 255,5 K může být správně vybrána zvlášť v 5 000 i 50 000 m. Kurzor nepovažuje nemonotónní teplotu za jednoznačnou souřadnici. Home a End fungují také u příspěvkového profilu (500 a 49 500 m), izotermie se vykresluje jako svislá čára. Spektrální synchronizace po omezení na pásmo CO₂ stále zobrazuje v obou grafech 45 100 m⁻¹.

V browseru byly znovu potvrzeny: nulová změna izotermické rovnováhy při 2× CO₂ (254,58 K), nižší rovnováha při předepsané inverzi (235,77 K; změna −0,481 K), nastavení nalezené rovnováhy a vyrovnaná následná bilance. Krajní izotermický případ při CO₂ = 2×, A = 0,75 a S = 1451,6158513182636 W m⁻² po opravě ukazuje T = 200,000 K a konečnou derivaci 1,815 W m⁻² K⁻¹.

Úvod a profil byly vizuálně zkontrolovány na běžném desktopu, tabletu 800 × 1000 a úzkém viewportu 390 × 844. V tabletové a mobilní kontrole se šířka dokumentu rovná šířce viewportu; nevzniká vodorovné přetékání. Desktopová navigace zůstává dostupná i u spodních článků dlouhého průvodce. U mobilního teplotního profilu jsou čitelné jednotlivé značky 220, 240, 260 a 280 K. Při posledním čtení konzole nebyla chyba ani varování.

### Export a webové konvence

Export teplotního profilu vytvořil CSV o 1688 bytech se 102 řádky včetně hlavičky. Všech 101 bodů výšky 0–50 000 m a obou teplotních řad bylo porovnáno s předepsaným T(z); hodnoty i jednotky odpovídají. SVG má 5791 bytů, validní XML a rozměry 647 × 350. PNG má 76 374 bytů a 1294 × 700 pixelů; byl skutečně otevřen a vizuálně přečten. Příspěvkový CSV má hlavičku s m a W m⁻³ (m⁻¹)⁻¹ a 50 nezáporných hodnot vrstev ve výškách 500–49 500 m. Ukázky jsou přibaleny v `previews/profil-export.*` a `previews/prispevky-export.csv`.

Primární webové zdroje a jejich použití jsou v [GRAPH_CONVENTIONS.md](GRAPH_CONVENTIONS.md). Obrázek NOAA JetStream byl otevřen přímo v browseru a vizuálně potvrzuje teplotu vodorovně a výšku svisle. Dokumentace NCAR odlišuje profesionální Skew‑T/log‑p s tlakovou souřadnicí. Oxfordský atlas a RFM pomáhají odlišit absorpci, optickou tloušťku, zářivost a hemisférický tok. Ke konečné aplikaci patří snímky `previews/uvod-desktop.jpg`, `uvod-rovnovaha.jpg` a nové tabletové a mobilní náhledy úvodu i profilu.

Opakování rozšiřuje důkazy o implementaci a výukové interpretaci zvoleného modelu. Nepřidává empirickou validaci atmosféry ani nové klimatické procesy. Neověřená přímá cesta `file://`, matice externích prohlížečů a skutečný fyzický tablet zůstávají vymezeny v oddílu 9.
