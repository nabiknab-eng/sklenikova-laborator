# Samostatná kritická kontrola fyzikálního modelu

Datum: 9. října 2026. Kontrolu provedla oddělená agentní revize, která neimplementovala původní výpočetní modul. Jde o odbornou kontrolu rovnic, implementace a interpretace; nejde o certifikaci člověkem ani o nezávislé měření atmosféry.

## Závěr a rozsah

V implementovaných rovnicích Planckova zákona, hemisférického přenosu, šedé atmosféry a definované TOA bilance nebyla zjištěna závažná fyzikální chyba. Výsledky izotermie a předepsané inverze jsou důsledkem přenosové rovnice a zvoleného pravidla změny teplotního profilu. Znaménko změny OLR není vloženo předem.

Kontrola našla dvě drobné chyby výukového rozhraní. Obě byly během revize opraveny; opravy byly ověřeny v konečném zdrojovém souboru. Samostatný atmosférický teplotní parametr u pevné atmosféry byl navíc ověřen numericky. V kontrolovaném rozsahu nezůstává otevřený nález vyžadující opravu rovnic nebo znamének.

Čtené soubory: `physics.js`, `calculations.js`, `PHYSICS.md`, relevantní výukové texty a dynamické vysvětlení v `app.js`, `data/PROVENANCE.json`, `tests/physics.test.cjs` a skutečný výstup `tests/results.json`. Dodatečné kontroly jsou reprodukovatelné v `tests/review-checks.cjs`; jejich číselné výsledky jsou v `tests/review-results.json`.

## Nálezy a jejich opravy

### P3 — nulová změna toku byla zaměněna za stejnou teplotu

Původní karta experimentu 3 interpretovala malou nezápornou změnu OLR jako „shodná teplota: tok se nemění“. Nulový integrální rozdíl však může vzniknout také kompenzací částí neizotermického profilu. Naopak izotermický profil při Ts = 288 K dává při změně CO₂ 1× → 2× numerický rozdíl přibližně −2,10 × 10⁻¹² W m⁻²; původní prostý test znaménka jej mohl označit jako pokles toku.

Konkrétní reprodukce kompenzace: Ts = 288 K, tropopauza 11 000 m, Γ = −0,003582885373136399 K m⁻¹, Γs = +0,001 K m⁻¹ a ostatní plyny 1×. Teploty jsou 288 K na povrchu, 248,5883 K na tropopauze a 287,5883 K ve výšce 50 000 m. ΔOLR při zdvojnásobení vychází 1,71 × 10⁻¹³ W m⁻² při rychlém vzorkování. Profil přitom není izotermický. Hodnota konkrétního gradientu je numericky nalezená kompenzace pro tuto volbu vzorkování; nejde o univerzální fyzikální konstantu.

**Opraveno:** karta nyní při |ΔOLR| < 10⁻⁷ W m⁻² uvádí neutrálně „tok se nemění“. Příčina se neurčuje z nulového integrálního rozdílu. Experiment 2 rovněž správně označuje nulový rozdíl proti referenci jako nezměněný tok. Tato tolerance mění jen slovní vysvětlení; nemění přenos ani vyčíslený výsledek.

### P3 — analytická rovnováha mohla být mimo graf a ovladač

Experiment 1 dovoluje S = 600 W m⁻² a A = 0,80. Pak ASR = 30 W m⁻² a Te = 151,6622098 K. Původní graf bilance začínal na 200 K a ovladač povrchu na 220 K. Karta Te byla správná, ale student nemohl rovnováhu nalézt průsečíkem zobrazených křivek ani nastavit ovladačem.

**Opraveno:** experiment 1 nyní používá ovladač i graf bilance 120–380 K. Rozsah zahrnuje analytické rovnováhy pro všechny dostupné kombinace S = 600–1800 W m⁻² a A = 0,05–0,80. Kontrola se týká tohoto explicitně dostupného rozsahu; nevyžaduje neomezené ovladače.

## Rovnice a rozměry

- Planckova funkce pro SI vlnočet κ = 1/λ je správně Bκ = 2hc²κ³ / [exp(hcκ/kT) − 1]. Nejde o úhlový vlnočet. Jednotka Bκ je W m⁻² sr⁻¹ (m⁻¹)⁻¹. Faktor π v Mκ = πBκ správně převádí izotropní zářivost na hemisférickou exitanci.
- σ = 2π⁵k⁴/(15h³c²) správně používá definující SI konstanty. ASR = S(1 − A)/4 správně zachycuje poměr osvětleného disku a plochy celé koule. Te = (ASR/σ)¼ je v experimentu 1 analytická rovnovážná teplota uniformního povrchu; obecná efektivní vyzařovací teplota se definuje z OLR.
- Optická tloušťka je bezrozměrná. Převod cm⁻¹ na m⁻¹ mění spektrální souřadnici faktorem 100, nikoli samotnou τ. Multiplikace sloupcové τ násobkem plynu odpovídá uvedenému modelu s pevnými absorpčními koeficienty.
- Pro optickou souřadnici rostoucí shora dolů a vzestupný směr μ > 0 má rovnice μ dIκ/dτκ = Iκ − Bκ správné znaménko. Rekurence homogenní vrstvy zahrnuje přenos vstupujícího záření i vlastní emisi.
- Q(τ) = 2∫₀¹ μ exp(−τ/μ)dμ = 2E₃(τ) je správná hemisférická propustnost. Vrstvové váhy Q(τnad) − Q(τnad + Δτ) a povrchová váha Q(τcelkem) jsou nezáporné a jejich součet je jedna. Tok je tedy konvexní kombinací Planckových exitancí předepsaných teplot.
- Šedá vrstva OLR = σTa⁴ + (σTs⁴ − σTa⁴)Q(τ) je správné analytické řešení uvedených předpokladů. Při Ts = Ta je tok nezávislý na τ; při chladnější atmosféře s τ klesá, při teplejší roste.
- N = ASR − OLR používá konzistentní znaménka. Při pevném ASR platí ΔN = −ΔOLR. Záporné ΔOLR se v dokumentaci nezaměňuje za již uskutečněnou teplotní odezvu.

Dokumentované jednotky příspěvků Cj,κ a hustoty Cj,κ/Δz jsou správné. Průměrná výška i kvantily zahrnují povrchový hraniční člen v z = 0. Nejde o geometrickou výšku všech fotonů jednoho vlnočtu ani o jedinou emisní hladinu. Binové a vrstvové výsledky jsou přiznaně diskrétní.

## Nezávislé numerické kontroly

### Přímý průchod vrstev podél jednotlivých paprsků

Revizní skript nově a samostatně implementuje přenos přes každou vrstvu od povrchu k vrcholu atmosféry. Pro každý směr počítá Iven = Idovnitř exp(−Δτ/μ) + B(T)(1 − exp(−Δτ/μ)). Poté integruje 2048 středových úhlových bodů s vahou 2μ. Tento postup nepoužívá `transmission`, `transmissionExact`, E₁ ani E₃ z aplikace a kontroluje i pořadí vrstev a emisní členy.

Bylo ověřeno pět spektrálních intervalů se středy 40 100, 66 700, 100 100, 140 100 a 220 100 m⁻¹, vždy pro běžný profil, plnou izotermii a inverzi. Použity jsou stejné zdrojové spektrální vzorky a stejná explicitní binová aproximace Planckovy funkce jako v aplikaci. Maximum relativní odchylky proti aplikaci v těchto 15 případech je **2,9614 × 10⁻⁷**. Přímý úhlový integrál má vlastní diskrétní chybu, takže rozdíl není samostatným přesným měřením chyby tabulky Q. Výsledek potvrzuje správnost hlavní přenosové implementace v kontrolovaných případech.

### Spektrální vzorkování i pro netypické profily

Dodatečně bylo porovnáno rychlých 20 a všech 200 původních bodů v intervalu:

| Profil | Rozsah teplot vrstev a povrchu / K | OLR při 20 bodech / W m⁻² | OLR při 200 bodech / W m⁻² | ΔOLR 1× → 2× při 200 bodech / W m⁻² |
|---|---:|---:|---:|---:|
| Ts 220 K, Γ −0,009, zt 15 000 m, Γs 0 | 85–220 | 45,23754 | 45,23822 | −1,49401 |
| Ts 340 K, Γ +0,004, zt 15 000 m, Γs +0,003 | 340–503,5 | 1175,02717 | 1174,97951 | +26,58638 |
| Výchozí profil | 217–288 | 257,13619 | 257,14499 | −1,87446 |
| Ts 220 K, Γ −0,009, zt 8000 m, Γs +0,003 | 149,5–272,5 | 85,82727 | 85,83813 | +3,00706 |

Gradienty v tabulce jsou v K m⁻¹. V těchto čtyřech případech je největší rozdíl absolutního OLR 0,04766 W m⁻² a rozdíl ΔOLR 0,003776 W m⁻². Poslední příklad správně ukazuje, že troposférický pokles s výraznou stratosférickou inverzí nemusí dát stejný znak celkového účinku jako výchozí profil.

Tyto výsledky ověřují konkrétní zkoušené stavy. Nejde o záruku chyby pro libovolné nové parametry. Teploty 85 K nebo přes 500 K jsou výukové mezní experimenty s pevnou absorpcí a nerealistickým profilem; malá numerická odchylka nezvyšuje jejich věrnost skutečné atmosféře. Rozhraní experimentu 3 extrémní teploty označuje.

### Pevná atmosféra má skutečně nezávislý teplotní základ

Při atmosférické základně 288 K a výchozích gradientech dává hledání s aktuálním povrchem 235 K i 300 K shodný kořen **275,9900713 K**. Po nastavení povrchu na tento kořen a ponechání stejné základny je N = −5,2822 × 10⁻⁶ W m⁻². Tlačítko nastavení rovnováhy tedy nemusí nechtěně přenastavit pevnou atmosféru.

### Integrita spektrálních dat

SHA256 všech čtyř dekódovaných lokálních float32 polí přesně odpovídají manifestu `data/PROVENANCE.json`. Tato kontrola dokládá integritu přibalených polí vůči jejich deklarovaným otiskům. Web Oxfordského atlasu byl při revizi samostatně přečten a potvrzuje výpočet RFM, HITRAN 2012, absorberové profily US Standard Atmosphere a význam zenitové optické tloušťky. [Oxford EODG: Atmospheric Infrared Spectrum Atlas](https://eodg.atm.ox.ac.uk/ATLAS/).

Původní automatická sada kontroluje mimo jiné Planckův integrál, analytické úhlové řešení proti Gaussově kvadratuře, mezní stavy, příspěvkové váhy, izotermii, inverzi, kořeny i spektrální a vertikální konvergenci. Její skutečné výsledky jsou v `tests/results.json`. Dodatečná revizní sada prošla vlastními tvrzeními o shodě paprskového přenosu, integritě dat, konkrétních krajních profilech a nezávislosti pevné atmosféry.

## Kdy opravdu vychází nižší rovnovážná povrchová teplota

Při **posunu celého profilu** jsou teploty Tj(Ts) = Ts + pevný offset. Se stejnou absorpcí mají pevné nezáporné váhy a všechny Planckovy funkce rostou s Ts. OLR(Ts) proto roste. Jestliže přidání CO₂ při stejné Ts v předepsané inverzi zvýší OLR, kořen pro stejné ASR musí ležet při nižší Ts, pokud oba kořeny existují v hledaném intervalu.

Výchozí inverze Γ = +0,003 K m⁻¹, Γs = 0 při Ts = 288 K dává při rychlém vzorkování změnu OLR **+2,71228 W m⁻²**. Pro stejný předepsaný tvar profilu a ASR = 238,175 W m⁻² jsou modelové rovnováhy **236,24641 K při 1×** a **235,76516 K při 2× CO₂**. Rozdíl je **−0,48125 K**. Jde o vypočtenou změnu kořene definované bilance. V plné izotermii při tomto posunu je naopak OLR = σTs⁴ a kořen **254,57814 K** nezávisí na CO₂.

Tyto dvě situace mají v laboratoři své legitimní místo. U pevného teplotního profilu v experimentech 2 a 3 se přímo počítá změna toku. Nižší rovnovážná Ts se prokazuje až uzávěrem experimentu 6. U pevné atmosféry závisí reakce také na jejím nezávislém teplotním základu a nemusí mít univerzální znaménko.

## Energetická konzistence a přetrvávající omezení modelu

Přenos správně zahrnuje absorpci i vlastní emisi a respektuje uvedené mezní identity. Nevyžaduje však energetickou rovnováhu jednotlivých vrstev. Pevné teploty se mohou udržovat nezobrazenými neradiačními či vynucujícími toky. Kořen TOA bilance je nutná radiační podmínka celkové rovnováhy tohoto modelu; sám neprokazuje realizovatelnou povrchovou a atmosférickou energetickou rovnováhu. Tato mez je ve fyzikální dokumentaci a v pokročilé části experimentu 6 výslovně uvedena.

Převzatá sloupcová τ jsou skutečná spektroskopická data. Jejich zvolená separace do výšky není výpočet výškově závislých čar při novém tlaku a teplotě. Model nezískává skutečné příspěvkové funkce Země jen tím, že používá celé zdrojové spektrum. Společné spektrální body správně zachovávají překryv plynů; výška jejich příspěvků zůstává závislá na zvolených škálových výškách. To je přiznané omezení, nikoli skrytá chyba rovnice.

Absorpce není přepočítávána s teplotou, tlakem nebo vodním cyklem. Nejsou řešeny oblaky, konvekce, hydrologie ani stratosférické přizpůsobení. Absolutní koncentrace původního sloupce nejsou bezpečně určené, takže UI správně používá násobky sloupce. Plné spektrální vzorkování zachovává binovou Planckovu aproximaci a zvolenou vertikální diskretizaci.

Výchozí −ΔOLR přibližně 1,88 W m⁻² je okamžitá dlouhovlnná změna bilance tohoto sloupce. Klasický vztah 5,35 ln(C/C₀) a hodnota přibližně 3,7 W m⁻² mají jinou konvenci: zahrnují stratosférické přizpůsobení a při odvození příslušného odhadu i krátkovlnný účinek. Kontrola potvrzuje, že aplikace tuto hodnotu nepoužívá jako kalibraci ani svůj okamžitý výpočet neoznačuje za její reprodukci. [IPCC TAR, CO₂ a konvence působení](https://archive.ipcc.ch/ipccreports/tar/wg1/219.htm), [IPCC TAR, zjednodušené vztahy a koeficienty](https://archive.ipcc.ch/ipccreports/tar/wg1/222.htm).

Revize neposkytuje empirickou validaci přesnosti modelu pro skutečnou Zemskou atmosféru. Pro dané transparentně popsané předpoklady je matematický výpočet konzistentní a interpretace izotermie, inverze i modelového ochlazení je po uvedených opravách věcně správná.

## Reprodukce dodatečných kontrol

V adresáři projektu:

```sh
node tests/review-checks.cjs
```

Příkaz zapíše skutečné číselné výsledky do `tests/review-results.json` a při nesplněném kontrolním tvrzení skončí chybou. Při této revizi byl úspěšně spuštěn přibaleným Node.js runtime; nevyžaduje instalaci balíčků ani externí síť.

## Opakovaná revize 10. října 2026

Po přidání nové úvodní stránky byl výpočet, texty i grafy znovu nezávisle přečten. Zpráva [RECHECK.md](RECHECK.md) podrobně uvádí nalezenou a opravenou chybu přesných kořenů na mřížce, následnou toleranci 10⁻⁹ W m⁻² i čtyři zapracovaná textová zpřesnění. Úvod všech šesti experimentů byl porovnán s konkrétními ovladači, veličinami, rovnicemi a omezeními. Nezůstává otevřený věcný nález v rozsahu této revize.

Hlavní sada nyní prochází 26/26. Nová samostatná sonda porovnala 148 izotermických toků s analytickým σT⁴, zkontrolovala 12 kořenů na mřížce a 8 stavů mimo interval. Původní přenosová kontrola byla opakována a znovu prošla. Browserový průchod a webové konvence jsou doloženy v [VALIDATION.md](VALIDATION.md) a [GRAPH_CONVENTIONS.md](GRAPH_CONVENTIONS.md).
