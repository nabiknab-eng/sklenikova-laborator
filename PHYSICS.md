# Fyzikální dokumentace laboratoře

## 1. Co je zákon, co je aproximace a co je model

Aplikace má šest skutečně počítaných experimentů. Experimenty 1 a 4 používají analytické vztahy. Experimenty 2, 3, 5 a 6 spojují převzaté skutečné spektrální optické tloušťky s **vlastním, zjednodušeným rozdělením absorpce do výšky**. Nejsou plnohodnotným novým výpočtem HITRAN line-by-line při každém novém tlaku a teplotě. Uživatelské rozhraní to uvádí u výsledků a v rozbalovacích panelech.

| Úroveň | Co laboratoř používá |
|---|---|
| Fyzikální zákon | Planckovo spektrum, integrál Stefanova–Boltzmannova zákona, přenos bez rozptylu v LTE, integrace přes hemisféru |
| Numerická aproximace | Homogenní vrstvy, vzorkování skutečné spektrální mřížky, binové Planckovy funkce, interpolace exponenciálního integrálu, bisekce |
| Zjednodušený model | Černý povrch; předepsané teploty; exponenciální vertikální distribuce pevné sloupcové absorpce; bez oblaků, konvekce a cirkulace |
| Převzatý podrobný výpočet | Oxfordský atlas: sloupcové optické tloušťky z RFM v.01MAY17, HITRAN 2012 a absorberových profilů US Standard Atmosphere |
| Empirická parametrizace | Myhre 5,35 ln(C/C₀) je uvedeno pouze pro odborné srovnání. Není součástí výpočtu ani kalibrace. |

**Výsledky pro inverzi i izotermii jsou legitimní výsledky přenosové rovnice za předepsaných podmínek. Nejsou tvrzením, že se reálná zemská atmosféra do takového profilu samovolně přizpůsobí.**

## 2. SI, spektrální souřadnice a konstanty

Výpočet používá SI vlnočet κ = 1/λ v m⁻¹, nikoli úhlový vlnočet 2π/λ. Při převodu z databáze platí κ [m⁻¹] = 100 × κ [cm⁻¹]. Sloupcová optická tloušťka τ je bezrozměrná a převodem vlnočtu se sama nemění.

Definující SI konstanty:

- h = 6,62607015 × 10⁻³⁴ J s;
- c = 299792458 m s⁻¹;
- k = 1,380649 × 10⁻²³ J K⁻¹;
- σ = 2π⁵k⁴/(15h³c²) = 5,670374419… × 10⁻⁸ W m⁻² K⁻⁴.

Zdroj: [NIST, Fundamental Physical Constants](https://physics.nist.gov/cuu/Constants/index.html). σ se v kódu odvozuje z h, c a k, nepřevzala se zaokrouhlená hodnota.

Planckova **spektrální zářivost** pro vlnočet je

\[
 B_\kappa(T)=\frac{2hc^2\kappa^3}{\exp(hc\kappa/kT)-1}.
\]

Jednotka je W m⁻² sr⁻¹ (m⁻¹)⁻¹. Změna spektrální souřadnice vyžaduje Jacobian: Bλ = Bκ / λ² pro λ v metrech. Číselné hodnoty per µm a per m⁻¹ nejsou zaměnitelné.

Pro izotropní černý povrch je **spektrální exitance**

\[
 M_\kappa=\int_{2\pi}B_\kappa\cos\theta\,d\Omega=\pi B_\kappa.
\]

Jednotka Mκ a spektrálního hemisférického toku Fκ je W m⁻² (m⁻¹)⁻¹. Jejich integrace přes dκ dává W m⁻². Zářivost není totéž co tok; „intenzita“ se nepoužívá jako neupřesněný souhrnný název.

## 3. Experiment 1: Planck a sluneční bilance

Substituce x = hcκ/(kT) a integrál ∫₀∞ x³/(exp x − 1) dx = π⁴/15 dávají

\[
 M(T)=\int_0^\infty\pi B_\kappa(T)\,d\kappa=\sigma T^4.
\]

Numerika používá `expm1`, aby neztratila přesnost při malém x. Pro x > 700 se funkce nahradí nulou; tok je v tomto oboru zanedbatelný. Rozhraní ukazuje výsek spektra, ale karta toku používá celý analytický integrál. Nejde o numerickou integraci pouze viditelného výseku grafu.

Globálně průměrované absorbované sluneční záření je

\[
 ASR=S(1-A)/4.
\]

Faktor 1/4 je poměr osvětleného disku πR² a celé plochy 4πR². A je bolometrické planetární sluneční albedo. Vynecháváme vnitřní teplo planety, časové a zeměpisné rozložení záření a změny albeda s teplotou.

Rovnovážná teplota jednotného, infračerveně černého povrchu bez atmosféry je

\[
 T_e=[ASR/\sigma]^{1/4}.
\]

Pro S = 1361 W m⁻² a A = 0,30 vychází ASR = 238,175 W m⁻² a Te = 254,57814 K. Volba S je referenční vstup, nikoli živě aktualizované měření.

Efektivní vyzařovací teplota planety je definice Teff = (OLR/σ)¼. Obecně neudává teplotu povrchu ani jediné vrstvy. V tomto jediném izotermickém experimentu bez atmosféry se při rovnováze rovná Ts. Pro nerovnoměrně teplý povrch je průměrný tok σ⟨T⁴⟩, nikoli σ⟨T⟩⁴. Černý povrch v tepelném oboru může mít nenulové sluneční albedo; dokonale černé těleso ve všech oborech by mělo A = 0.

Odvození spektra a konstant: [NIST, Planck's law](https://nvlpubs.nist.gov/nistpubs/jres/106/1/j61man.pdf).

## 4. Spektrální data: skutečný původ a skutečné omezení

Zdroj: [Atmospheric Infrared Spectrum Atlas, Oxford EODG](https://eodg.atm.ox.ac.uk/ATLAS/), autoři Oliver King a Anu Dudhia. [Původní veřejný archiv](https://eodg.atm.ox.ac.uk/ATLAS/data_files/zip/opt.zip) byl stažen 9. října 2026.

Atlas výslovně uvádí RFM, HITRAN 2012 a absorberové profily US Standard Atmosphere. Hlavičky souborů uvádějí RFM v.01MAY17 a vertikální zenitovou dráhu s airmass = 1,000. Vybrány jsou `opt_co2.opt`, `opt_h2o.opt`, `opt_ch4.opt`, `opt_n2o.opt`.

Každý soubor obsahuje 500 000 nezáporných optických tlouštěk na společné mřížce 0,01–5000 cm⁻¹ s krokem 0,01 cm⁻¹, tedy 1–500 000 m⁻¹ s krokem 1 m⁻¹. Prohlížeč načítá všechna původní čísla, převedená na float32, v lokálním `data/atlas.js`; plné spektrální vzorkování je dostupné bez dalšího stahování. Nejde o graf vytvořený z fotografií nebo odhadnutých Gaussových pásem.

Kontrolní otisky archivu, původních souborů i převedených polí, hlavičky a datum jsou v [data/PROVENANCE.json](data/PROVENANCE.json). Převod float32 mění poslední desetinná místa, nikoli významné spektrální struktury. Optické tloušťky nejsou absorpční průřezy na molekulu a nejsou emisním spektrem atlasu.

**Referenční absolutní koncentrace nejsou bezpečně určeny přibalenými hlavičkami.** Rozhraní proto uvádí násobek původního sloupce, nikoli smyšlené ppm. Faktor ag = 2 je dvojnásobná absorpce původního sloupce při pevných koeficientech. Má význam zdvojnásobení množství absorbéru ve zvolené linearizaci; nemění tlakové rozšíření, vlastní rozšíření vodní páry, izotopové zastoupení ani tlak a teplotu původního spektroskopického výpočtu.

Soubory nedokládají úplnou konfiguraci vodního kontinua ani dalších nastavení RFM. Převzaté optické tloušťky používáme tak, jak byly publikovány; samostatný model kontinua MT_CKD se nepřidává. Neprohlašujeme dataset za nejnovější HITRAN ani za spektroskopicky validovaný výpočet všech nových stavů.

Odborné zdroje: [RFM](https://eodg.atm.ox.ac.uk/RFM/), [HITRAN2012, Rothman et al. 2013](https://doi.org/10.1016/j.jqsrt.2013.07.002), [HITRAN HAPI](https://hitran.org/hapi/). Aktuální HAPI přístup vyžaduje uživatelský API klíč. Použití veřejného atlasu umožňuje funkční samostatnou aplikaci bez uživatelského účtu.

## 5. Zjednodušené rozdělení absorpce do výšky

Z vrcholových sloupcových dat nelze rekonstruovat skutečné jednotlivé atmosférické vrstvy. Laboratoř tuto chybějící informaci nenahrazuje tvrzením o přesném modelu. Předepisuje normalizované vertikální rozdělení:

\[
 \Delta\tau_{g,\kappa,j}=a_g\tau^0_{g,\kappa}
 \frac{\exp(-z_j/H_g)-\exp(-z_{j+1}/H_g)}{1-\exp(-Z/H_g)}.
\]

Z = 50 000 m; Hg = 7000 m pro CO₂, CH₄ a N₂O; Hg = 2000 m pro H₂O. Hodnoty Hg jsou **zvolené parametry výukového modelu**, nikoli odvozené spektroskopické konstanty. Normalizace zachovává celou zdrojovou sloupcovou τ i po omezení modelu na 50 km. Výchozích 50 vrstev je po 1000 m.

Ve vrstvě je teplota konstantní a rovná teplotě v jejím středu. Celková τ ve vrstvě je součet všech plynů. Suché plyny mají shodné předepsané rozdělení, což umožňuje jejich součet před vrstvovým výpočtem. H₂O má samostatné rozdělení.

Tato separace ignoruje spektrálně i výškově odlišné tlakové rozšíření čar, změny obsazení hladin s teplotou a skutečné profilem závislé koeficienty. Proto modelová **výška příspěvku není přesnou HITRAN emisní výškou Země**. Inverze a silné změny teploty se mají interpretovat jako myšlenkové experimenty s pevnou absorpcí. I běžný profil je aproximace, ne klimatická referenční atmosféra s garantovanou přesností.

Mimo zdrojový obor nad κ = 500 000 m⁻¹ předpokládáme průhlednost. Přímý povrchový zbytek se přidá jako σTs⁴ minus binový integrál Planckova spektra; případná záporná chyba zaokrouhlení se nahradí nulou. Při 288 K je zbytek asi 1,5 × 10⁻⁵ W m⁻², takže závěry tepelných experimentů neovlivňuje. Při extrémně vysokých teplotách by tento předpoklad potřeboval přehodnotit.

## 6. Přenos záření s atmosférickou emisí

Předpokládáme rovinné rovnoběžné vrstvy, žádný rozptyl, lokální termodynamickou rovnováhu (LTE), černý povrch a nulové záření přicházející shora. V LTE zdrojová funkce při absorpci a emisi splňuje Kirchhoffův zákon a rovná se Bκ(T). Při rozptylu nebo non-LTE je tato formulace nedostatečná.

Pro vzestupný směr μ = cos θ > 0 a optickou souřadnici rostoucí shora dolů platí Schwarzschildova rovnice

\[
 \mu\frac{dI_\kappa}{d\tau_\kappa}=I_\kappa-B_\kappa(T).
\]

Přenos skrz jednu homogenní vrstvu:

\[
 I_\mathrm{ven}=I_\mathrm{dovnitř}e^{-\Delta\tau/\mu}
 +B_\kappa(T_j)(1-e^{-\Delta\tau/\mu}).
\]

Atmosférická emise se vždy počítá. Zvýšení absorpce se nijak nepřevádí na předem naprogramovaný pokles OLR.

Po sečtení vrstev a integraci hemisférického toku Fκ = 2π∫₀¹ Iκ μ dμ získáme

\[
 Q(\tau)=2\int_0^1\mu e^{-\tau/\mu}d\mu=2E_3(\tau),
 \qquad E_3(x)=\int_1^\infty e^{-xt}t^{-3}dt,
\]

\[
 F_\kappa=M_\kappa(T_s)Q(\tau_\mathrm{tot})+
 \sum_j M_\kappa(T_j)[Q(\tau_{\mathrm{above},j})-Q(\tau_{\mathrm{above},j}+\Delta\tau_j)].
\]

Váhy wj v hranatých závorkách a ws = Q(τtot) jsou nezáporné. Telescopický součet je ws + Σwj = 1. Je-li povrch a celý sloupec izotermický, Fκ = Mκ(T) bez ohledu na absorpci. Nulová absorpce dává povrchový tok. Nekonečná absorpce homogenní horní vrstvy dává emisi této vrstvy. Toto jsou testované identity.

Odchozí tok leží spektrálně mezi nejmenší a největší Planckovou exitancí předepsaných teplot, protože je jejich konvexní kombinací. Součet nezáporných emisních příspěvků přesně rekonstruuje Fκ. **To nezaručuje energetickou rovnováhu každé vrstvy:** její teplota je vynucená a udržení může vyžadovat jiné toky. Laboratoř není samoorganizující se radiativně konvektivní atmosféra.

### Numerické vyhodnocení Q

Pro x ≤ 1 se používá konvergentní řada pro E₁(x), pro x > 1 řetězový zlomek. Rekurence nEₙ₊₁ = exp(−x) − xEₙ dává E₃. Pro x > 8 se E₃ počítá přímo řetězovým zlomkem, aby se omezilo odečítání podobných čísel. Při τ > 60 se Q nahradí nulou, chyba je zanedbatelná.

Šedý experiment používá toto přímé vyhodnocení. Spektrální výpočty používají tabulku 6000 hodnot od 10⁻⁷ do 60, lineárně interpolovanou v log τ; pod 10⁻⁷ platí Q ≈ 1 − 2τ. V provedeném testu byla maximální absolutní chyba interpolace 3,4 × 10⁻⁷. Integrace přes úhly se porovnává s nezávislou 256bodovou Gaussovou kvadraturou. Nepoužívá se exp(−τ) ani jediný difuzní paprsek jako přesný tok.

## 7. Spektrální a vertikální numerika

Zdrojovou mřížku rozdělíme na 2500 intervalů šířky 200 m⁻¹ (2 cm⁻¹). V každém intervalu se použije 20, 50 nebo všech 200 společných bodů všech čtyř plynů. Rychlé vzorky jsou rovnoměrně stratifikované, nikoli náhodné. Jsou tedy opakovatelné, ale nevyjadřují statistický odhad chyby pro libovolný stav.

**Přenosová funkce se vyhodnotí před průměrováním.** Nepočítá se Q(průměr τ); počítají se průměrné váhy z jednotlivých Q(τκ). Společné původní spektrální body zachovávají korelaci překryvu různých plynů. V grafu τ se zobrazuje průměr τ pouze pro čitelnost.

Planckova funkce každé vrstvy se v intervalu aproximuje integrálním průměrem podle Simpsonova pravidla:

\[
 \overline M_b(T)\approx[M(a)+4M(a+\Delta\kappa/2)+M(a+\Delta\kappa)]/6.
\]

Tok se počítá jako součin tohoto průměru a průměrných příspěvkových vah. To zanedbává jemnou korelaci změny Planckovy funkce s absorpcí uvnitř 200 m⁻¹. Planckova funkce je v tomto měřítku hladká, ale jde o **explicitní numerickou aproximaci**, i ve volbě všech 200 spektrálních bodů. „Plné“ znamená plné vzorkování zdrojové τ, ne odstranění vrstvové či binové aproximace.

OLR = Δκ Σb F̄b + průhledný zbytek. Pro porovnání rychlých voleb se mění počet vzorků, nikoli šířka grafických intervalů. Vertikální konvergence se kontroluje na 25, 50 a 100 vrstvách. Výsledky jsou v VALIDATION.md. Kontrola konvergence nemění fyzikální omezení vstupního modelu.

## 8. Experiment 2: příspěvky a výška emise

Povrchový příspěvek Cs,κ = Mκ(Ts)ws je samostatný hraniční člen v z = 0. Atmosférické příspěvky Cj,κ = Mκ(Tj)wj mají jednotku W m⁻² (m⁻¹)⁻¹.

Zobrazená příspěvková hustota je Cj,κ/Δzj v W m⁻³ (m⁻¹)⁻¹. Hodnoty leží ve středech vrstev. Fyzikálně správný integrál diskrétních vrstev je součet Cj,κ, nikoli plocha pod libovolnou interpolací křivky mezi středy.

Průměrná výška příspěvku je

\[
 \bar z_\kappa=\frac{\sum_j z_j C_{j,\kappa}}{C_{s,\kappa}+\sum_j C_{j,\kappa}}.
\]

Rozsah 10–90 % se počítá z kumulativních příspěvků včetně povrchu a je diskrétní na úrovni vrstev. Oba krajní kvantily mohou být 0, pokud převažuje povrch. Každý grafický spektrální interval obsahuje různé čáry a různé výšky; ani průměr ani kvantily nejsou jedinou skutečnou emisní hladinou.

Reference ukládá **celé nastavení**. Když uživatel změní teploty, rozdíl proti uložené referenci není izolovaným účinkem CO₂. UI to oznámí. Samostatná karta „zdvojnásobení aktuálního CO₂“ vždy počítá dvě koncentrace při shodných teplotách.

## 9. Experiment 3: teplotní profil, izotermie a inverze

Předepsaný spojitý profil:

\[
 T(z)=T_s+\Gamma\min(z,z_t)+\Gamma_s\max(0,z-z_t).
\]

Výchozí Ts = 288 K, Γ = −0,0065 K m⁻¹, zt = 11 000 m a Γs = +0,001 K m⁻¹. Nad tropopauzou má model mírný růst teploty. Znaménka a teploty se neořezávají, aby výsledek odpovídal očekávanému závěru. Nekladná absolutní teplota je chyba; velmi nízké nebo vysoké modelové teploty jsou označené jako extrémní myšlenkový experiment.

−0,009 K m⁻¹ je blízko suchému adiabatickému gradientu; −0,0065 K m⁻¹ je běžná referenční troposférická hodnota, nikoli zákon o každém sloupci. −0,003 K m⁻¹ představuje slabší pokles. Γ = Γs = 0 vytváří celý izotermický sloupec se stejnou teplotou jako povrch. Inverzní předvolba má Γ = +0,003 K m⁻¹ a Γs = 0. Lokální inverze jsou reálné, zde jde o rozšířenou vynucenou inverzi.

Pokud s výškou teplota klesá, posun příspěvkových vah k chladnějším vrstvám může OLR snížit. V plné izotermii Ts = Ta se OLR nemění. V předepsané inverzi může více CO₂ vážit teplejší vrstvy a OLR zvýšit. Je-li nad troposférou jiný gradient, mohou různé spektrální části reagovat rozdílně. Znaménko se vždy odvozuje z výpočtu.

Dolní graf počítá ΔOLR(C) = OLR(C) − OLR(1×) **při stejném profilu** pro každý bod. Referenční křivka má vlastní uložený profil a vlastní referenci 1×; netvrdí, že byly teploty mezi křivkami shodné.

V tomto experimentu je Ts vynucená, a proto nelze samotný růst OLR nazvat již uskutečněným ochlazením povrchu. Ochlazení v nové modelové rovnováze se zkoumá v experimentu 6.

## 10. Experiment 4: analytická izotermická šedá vrstva

τ je zde konstantní pro všechny tepelné vlnové délky. Ta nemusí být rovná Ts. Integrace výrazu I(μ) = Bs exp(−τ/μ) + Ba[1 − exp(−τ/μ)] dává

\[
 OLR=\sigma T_a^4+(\sigma T_s^4-\sigma T_a^4)2E_3(\tau).
\]

Povrchový příspěvek je σTs⁴Q a atmosférický σTa⁴(1 − Q). Při τ = 0 jde vše z povrchu; při τ → ∞ vše z izotermické atmosféry. Je-li Ta = Ts, součet je vždy σT⁴. Ta < Ts vede ke klesání OLR s τ; Ta > Ts k růstu. To je analytické objasnění, proč samotná absorpce neurčuje změnu toku.

Tento experiment neukazuje spektrum žádného skutečného plynu. Nejde o „šedý CO₂“ s kalibrovaným klimatickým působením. Je matematicky přesným řešením uvedených předpokladů s numerickým vyhodnocením E₃.

## 11. Experiment 5: překryv plynů

Optické tloušťky se při nezávislé absorpci na společném bodu mřížky sčítají: τκ = Σg ag τg,κ. Propustnost se násobí: exp(−Στg/μ) = Πg exp(−τg/μ). Tok závisí nelineárně na τ i na teplotách emitujících vrstev; změny toků se obecně nesčítají.

Graf první osy zobrazuje log₁₀(1 + průměr τ) pro každý plyn a součet. Tato bezrozměrná transformace řeší rozsah mnoha řádů a zahrnuje nulu. Nedosazuje se do radiačního přenosu. Spektrální rozdíl je Faktuální − Freference. Jeho integrál je ΔOLR, s příslušným povrchovým zbytkem mimo atlas.

Pro explicitní srovnání CO₂ a H₂O se počítají čtyři atmosféry, se stejnými teplotami a stejným CH₄ a N₂O:

- F₀: CO₂ = H₂O = 0;
- Fc: aktuální CO₂ a H₂O = 0;
- Fw: CO₂ = 0 a aktuální H₂O;
- Fcw: aktuální oba plyny.

Společný pokles = F₀ − Fcw. Součet izolovaných poklesů = (F₀ − Fc) + (F₀ − Fw). Rozdíl mezi nimi je míra nesčítatelnosti pro toto přesně definované srovnání. Při jiných teplotách a profilech se může znaménko lišit. Není to univerzální „radiační působení každého plynu“.

## 12. Experiment 6: rovnovážná teplota a uzávěr

N = ASR − OLR. Kladné N znamená přírůstek energie systému, záporné úbytek. Kořen N(Ts) = 0 je TOA rovnováha v modelu.

V obou uzávěrech zůstávají sloupce plynů, jejich absorpce, rozdělení do výšky, gradienty, tropopauza, S a albedo pevné. **Vodní pára nemá automatickou teplotní zpětnou vazbu.** CH₄ a N₂O jsou 1×. Nemodelujeme oblaka.

1. **Posun celého profilu**: T(z; Ts) = Ts + Γ min(z,zt) + Γs max(0,z−zt). Povrch i všechny vrstvy se s Ts mění o stejný počet kelvinů.
2. **Pevná atmosféra**: T(z) = Ta₀ + Γ min(z,zt) + Γs max(0,z−zt), kde Ta₀ je samostatný ovladač „Základna pevného profilu“. Povrch se mění nezávisle. Změna Ts ani tlačítko nastavení rovnováhy neposunou tento atmosférický profil.

Při posunu profilu a Γ = Γs = 0 má vždy celý sloupec teplotu Ts. OLR = σTs⁴ a rovnovážná Ts = Te bez ohledu na množství CO₂. To je skutečně nulová změna modelové rovnovážné teploty.

Při předepsané inverzi může zvýšení CO₂ zvýšit OLR při každé stejné Ts. Pokud OLR současně roste s Ts, k dosažení stejného ASR stačí nižší Ts. Laboratoř pak opravdu nalézá **nižší rovnovážnou povrchovou teplotu**. Nejde jen o přeznačení znaménka toku. Udržení vynucené inverze ani povrchové a vrstvové energetické bilance se však samostatně neřeší. Výsledek tedy není univerzální tvrzení „CO₂ ochlazuje Zemi“.

Karty ukazují aktuální N a nalezenou Ts. Další vysvětlení porovnává kořen pro aktuální CO₂ s kořenem pro 1× CO₂ při stejném aktuálním uzávěru a ostatních podmínkách. Předvolba „Porovnat 1× → 2× CO₂“ nastaví i uloženou grafickou referenci na stejný profil. Uložená volná reference může jinak zahrnovat více změn.

Kořeny se hledají v 200–380 K, nejprve v krocích 5 K, potom bisekcí na interval < 10⁻⁵ K. Bod mřížky s |N| ≤ 10⁻⁹ W m⁻² je přijat jako kořen, aby numerické zaokrouhlení a zanedbatelná Planckova kvadratura neztratily řešení na hranici. Sousední bisekce se v tom případě vynechá; všechny kořeny jsou jedinečné a mají dopočítané reziduum i dOLR/dTs. Tato tolerance odpovídá při 200 K asi 5,5 × 10⁻¹⁰ K a je hluboko pod ukončovací přesností bisekce. Pro zde implementované uzávěry je OLR rostoucí: derivace Planckovy funkce podle T je kladná, váhy jsou pevné a nezáporné a teploty buď rostou s Ts, nebo jsou pevné. Žádná interpolace grafu není použita jako náhrada radiačního výpočtu kořene. Chybějící kořen je označen jako nenalezený v daném rozsahu.

Lokální stabilita pro jednoduchou bilanci C dTs/dt = N se při C > 0 a pevném ASR pozná podle dOLR/dTs > 0. Aplikace nepočítá časový vývoj ani skutečnou tepelnou kapacitu. Neřeší vnitřní bilanci vrstev, povrchovou energetickou bilanci, konvekci ani hydrologický cyklus. Nulové N samo neznamená realizovatelnou úplnou klimatickou rovnováhu.

## 13. ΔOLR, působení, nerovnováha a zpětné vazby

- OLR > 0 označuje velikost odchozího dlouhovlnného toku.
- ΔOLR = OLRnový − OLRreference je změna tohoto toku.
- Při pevném ASR je ΔN = −ΔOLR; lze ji nazvat okamžitou dlouhovlnnou změnou bilance tohoto modelu.
- Celkové okamžité radiativní působení by zahrnovalo i krátkovlnné změny, které nepočítáme.
- SARF je působení po stratosférickém přizpůsobení. ERF zahrnuje další rychlé úpravy při pevné povrchové teplotě. Ani jedno model neřeší.
- Teplotní odezva při uzávěru experimentu 6 není efektivní klimatická citlivost Země. Chybějí klimatické zpětné vazby vody, oblaků, ledu a změn profilů.

Myhre et al. (1998): ΔF ≈ 5,35 ln(C/C₀) W m⁻², tedy 3,708 W m⁻² pro zdvojnásobení. Je to literární zjednodušený vztah s konvencí po stratosférickém přizpůsobení. Výsledek se **nepoužívá ke kalibraci** místních optických tlouštěk, škálových výšek ani OLR.

Náš výchozí výpočet má pevný profil, jasnou oblohu, zjednodušené rozdělení absorpce a neověřené absolutní zdrojové koncentrace. Okamžitá změna −ΔOLR vychází přibližně 1,88 W m⁻². Je správného řádu, ale není reprodukcí globálního klimatického působení. Test řádové velikosti není spektroskopická validace.

Zdroje: [Myhre et al., 1998](https://doi.org/10.1029/98GL01908), [IPCC TAR, definice působení](https://archive.ipcc.ch/ipccreports/tar/wg1/219.htm), [IPCC AR6 WG I, kapitola 7](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-7/).

## 14. Reprodukovatelnost a kontrola

Výpočetní modul `physics.js` nemá závislost na DOM. `calculations.js` provádí šest experimentů nad týmž modulem. Web používá Web Worker z lokálního Blobu; při jeho nedostupnosti se stejný výpočet provede v hlavním vlákně. SVG grafy a exporty nemění výsledky modelu.

Automatické testy jsou v `tests/physics.test.cjs`; přesné výsledky v `tests/results.json`. Metodika, skutečné hodnoty a omezení validace jsou v [VALIDATION.md](VALIDATION.md). Samostatná kritická oponentura kontroluje rovnice, rozměry, numeriku a interpretaci; její závěry a reprodukovatelné dodatečné kontroly jsou v archiv/REVIEW.md a tests/review-checks.cjs.

## 15. Zobrazení výškových profilů

Teplotní profil má x = T / K, y = z / m. Příspěvkový profil má na x Cj,κ/Δzj a na y výšku. Výška roste vzhůru. Kurzor a CSV jsou seřazené podle výšky, protože T(z) i příspěvek mohou být nemonotónní. Spektrální graf výšek podle κ má jiný účel a zachovává spektrální souřadnici na x. Odůvodnění, jednotky a ověřené primární webové zdroje: [GRAPH_CONVENTIONS.md](GRAPH_CONVENTIONS.md).

## 16. Diagnostická porovnání v přepracování

`physics.js`, atlas i jeho metadata jsou bitově shodné s verzí 1. Nová zobrazení používají stejné toky, žádný předepsaný forcing nebo citlivost.

Rozdílové spektrum je ΔFκ = Fκ,aktuální − Fκ,reference. Integrace přes všechny intervaly a rozdíl příslušných průhledných zbytků dají přesně ΔOLR. Křivka v omezeném rozsahu není celý integrál. U přesné izotermie se rozsah y nezvětšuje až na numerický šum; surová data se přitom nevynulují.

Obě příspěvkové křivky zobrazují Cj,κ / Δzj. Součet Cj,κ přes vrstvy plus povrchový člen rekonstruuje spektrální tok. Povrch se neřadí do hustoty atmosférických vrstev. Tooltip u vrstvy uvádí i aktuální a referenční teplotu.

Experiment 5 zveřejňuje čtyři toky při shodném aktuálním profilu a ostatních plynech: F₀ bez CO₂ a vody, Fc jen s aktuálním CO₂, Fw jen s aktuální vodou a Fcw s oběma. Společný pokles je F₀ − Fcw, součet izolovaných poklesů (F₀ − Fc) + (F₀ − Fw). Tato diagnostika se nesmí zaměnit s rozdílem aktuálního spektra proti referenci.

Experiment 6 nejprve při aktuálním ASR a uzávěru hledá T₀ pro 1× CO₂. Změna N₀ = OLR₁ₓ(T₀) − OLRnové(T₀) porovnává stejné teploty. Následuje nezávislé hledání T₁ pro nový sloupec; ΔTs = T₁ − T₀. Bilanční reziduum T₀ se nepřidává k N₀. Přiblížený graf počítá 31 pravidelných teplot v okolí obou kořenů a přidává samotné kořeny; není zvětšením interpolace původní mřížky po 5 K. Teploty vrstev v každém bodě respektují zvolený uzávěr. Jeho oranžový bod obsahuje skutečné N nového sloupce při T₀, zelený bod značí numerický kořen jako N = 0.

Všechny tyto vztahy ověřují `tests/teaching.test.cjs`. Aktuální rozbor je v [POSOUZENI.md](POSOUZENI.md), původní posudek v [archiv/REVIEW.md](archiv/REVIEW.md).
