# Kritické posouzení a pedagogická rozhodnutí

Výchozí stav: skutečná verze 1 se šesti experimenty. Datum: 10. října 2026. Přepracování je místní; na GitHub nebylo nahráno. Verze 1 a dosavadní verze 2 zůstávají zachované.

## A. Co funguje a co překáží

| Experiment | Co se má student naučit | Posouzení verze 1 | Rozhodnutí a přínos |
|---|---|---|---|
| 1. Povrch bez atmosféry | Vyšší teplota mění spektrum i jeho integrál; příjem se vyrovná výdeji. | Oba grafy jsou správné a mají odlišný účel. Uložená reference se při změně albeda neukazuje v bilančním grafu. | Zachovat oba grafy. Přidat referenční příjem a možnost nastavit průsečík; oddělit změnu ASR od změny tepelného spektra. |
| 2. CO₂ | Změna sloupce mění spektrální přenos; absorpce i vlastní emise jsou nezbytné. | Změna o jednotky W m⁻² se v absolutním spektru obtížně hledá. Příspěvkový profil ukazuje pouze jeden stav, takže nelze přímo porovnat výšky. | Přepínat tentýž graf mezi tokem a rozdílem. Jedním tlačítkem připravit kontrolované 1× → 2×; porovnat příspěvky obou stavů v témže profilu. Souhrnné výšky ponechat jako volitelný další pohled. |
| 3. Teplotní profil | Znaménko změny OLR závisí na teplotním profilu. | Orientace os, reference i závislost na sloupci CO₂ jsou správné. Jednotlivé gradientové předvolby nevždy obnovují celý běžný profil po izotermii. | Zachovat oba grafy a výpočty; přidat tři úplné profilové předvolby s popisem jejich podmínek. |
| 4. Šedá izotermická vrstva | Zeslabený povrchový příspěvek a vlastní emise dohromady určují tok. | Správný a silný mezní experiment. Celkový tok je ale zobrazen dvakrát, ve dvou po sobě jdoucích grafech. | Zobrazit oba příspěvky, jejich součet a referenční součet v jediném grafu. Tři teplotní předvolby ukážou pokles, invarianci i růst. |
| 5. Překryv plynů | Optické tloušťky se sčítají, změny toku obecně ne. | Výpočty čtyř stavů jsou správné. Číselné poklesy nemají snadno dostupné základní čtyři toky. První logaritmický graf je obtížnější než otázka o účinku CO₂. | Připravit zdvojnásobení CO₂ s vodou a bez vody. Tok/rozdíl přepínat v jednom grafu, optickou tloušťku ponechat volitelnou. Zpřístupnit tabulku čtyř stavů; nepřidávat nový obecný klimatický model. |
| 6. Rovnováha | Změna toku při stejných teplotách není totéž co změna rovnovážné teploty; pravidlo změny profilu je další předpoklad. | Správné kořeny, izotermie i inverze. Student však musí sám propojit počáteční nerovnováhu s posunem průsečíku. | Přidat tři přímo počítané kroky: rovnováha při 1×, změna bilance při jejích teplotách, nová rovnováha. Označit oba body v grafu N a umožnit přiblížení okolí průsečíků. Bez převzatého forcingu nebo předepsané citlivosti. |

Společný nedostatek: dlouhý úvod a pět opakovaných výkladových bloků u každého experimentu odkládají samotný pokus. Přepracování používá krátkou otázku, konkrétní pokus, číselné pozorování a volitelné vysvětlení. Odborný matematický panel zůstává oddělený. Jde o pedagogickou hypotézu podloženou rozborem rozhraní, nikoli o prokázaný výsledek testování na třídě studentů.

## B. Kritika doporučeného dokumentu

[Doporučený dokument](https://docs.google.com/document/d/1cnhSwlSKx5LbNtJd--jV4gesBJjwLfn24ijDF2Favr4/edit?usp=sharing) byl přečten včetně obrázků a rovnic všech devíti stran. Není odbornou autoritou ani závazným seznamem úprav.

| Tvrzení nebo návrh | Fyzikální posouzení | Použití |
|---|---|---|
| Sluneční tok klesá jako 1/r², disk zachytí výkon a celá koule vyzařuje. | Správně pro bodovou geometrii a izotermický model. Úvodní Slunce jako černé těleso je aproximace; referenční S není přesná univerzální konstanta. | Faktor 1/4 byl již ve verzi 1 správně vysvětlen. Nový astronomický experiment není potřeba. |
| Albedo sníží ASR; vyjde přibližně 255 K. | Správně za zadaného A, S a infračervené emisivity 1. Sluneční odrazivost není tepelná emisivita. | Zachováno v experimentu 1. Pozorovaná proměnlivost albeda patří jen k volitelnému vysvětlení jeho ovladače. |
| Průhledný vzduch bez absorpce, emise a výměny tepla má ve všech výškách 255 K. | Nesprávně. Jeho energetická rovnice má nulové radiační členy; neurčuje Ta ani její profil. Zadaný libovolný počáteční stav se takovým mechanismem nevyrovná s povrchem. | Výslovně odmítnuto. Stačí stručné upozornění v experimentu 1; není nutné přidávat dvě časové bilance. |
| CO₂ pohlcuje a vyzařuje v pásmech, zejména kolem 15 µm. | Správný mechanismus za LTE; vlastní emise je dána teplotou. Nejde o nutně okamžité opětovné vyzáření stejného pohlceného fotonu. | Využito v interpretaci spektra a příspěvků; přepínač rozdílu a volba pásma přinášejí konkrétní pozorování. |
| Dodatečný účinek bývá výrazný v křídlech silného pásma. | Podmíněně správně; rozložení závisí na profilu, překryvu a spektroskopii. Není pravidlem pro každou teplotní strukturu. | Student to zkoumá v rozdílovém spektru. Nevkládáme předem nakreslený průběh ani univerzální tvrzení o nulovém účinku středu. |
| Změna OLR při stejných teplotách je počáteční radiační zásah. | Při pevném ASR je změna dlouhovlnné bilance −ΔOLR. To není totéž co celkové IRF se zahrnutím krátkovlnných změn ani ERF s rychlými přizpůsobeními. | Využito jako dva odlišné kroky experimentu 6. |
| 3,7 W m⁻² a 5,35 ln(C/C₀). | Literární aproximace stratosféricky přizpůsobeného působení, nikoli základní zákon či univerzální okamžitý výsledek tohoto sloupce. Logaritmus vyžaduje kladné C i C₀. | Jen odborný kontext v matematickém panelu; žádná kalibrace modelu, žádné použití při 0× CO₂. |
| Obrázek na straně 6 předepisuje 280 → 560 ppm, OLR 239 → 235 a uniformní oteplení o 3 K. | Čísla nejsou odvozena z představeného spektrálního výpočtu. Zobrazené 3 K nesouhlasí s následnou přibližně 1,15 K Planckovou odezvou bez dalších vazeb. Uniformní posun profilu vyžaduje vlastní výpočet derivace OLR. Absolutní ppm nelze bezpečně odvodit z našeho atlasu. | Nepřevzato. Použity skutečně počítané teploty a toky, sloupce zůstávají v násobcích. |
| dF/dT = 4σT³ při Te ≈ 255 K, přibližně 3,8 W m⁻² K⁻¹. | Derivace černotělesného vztahu je správná. Derivace podle efektivní teploty ale sama neurčuje odezvu podle povrchové Ts v atmosféře. | Vztah už pokrývá experiment 1. Nepřevádíme jím univerzálně F na změnu Ts. |
| Literární Planck −3,22, voda + gradient +1,30, povrchové albedo +0,35 a oblaka +0,42. | Hodnoty odpovídají centrálním hodnocením AR6, tab. 7.10. Jsou diagnostické parametry, nikoli konstanty ani výsledky našeho modelu. Sčítat lze odpovídající parametry, ne univerzální teplotní bloky. | Samostatný experiment s jejich zapínáním není potřebný pro šest otázek této laboratoře. Verze 2 ho uchovává jako archivní alternativu. |
| Zvýšení CO₂ vždy dává kladný forcing a obnovení bilance vyžaduje změnu teplot. | Pro zde povolené předepsané profily neplatí univerzálně: izotermie dává nulovou dlouhovlnnou změnu, inverze může dát zápornou. Bilanci může změnit také ASR; teplotní změna není jediná matematická možnost. | Výklad odpovídá vypočtenému znaménku; mezní případy verze 1 zachované. |

Zdroje k ověření: [Oxfordský atlas](https://eodg.atm.ox.ac.uk/ATLAS/), [RFM: výstupy a toková integrace](https://eodg.atm.ox.ac.uk/RFM/sum/rfm_flags.html), [Penn State: absorpce a vlastní emise](https://courses.ems.psu.edu/meteo300/node/784), [NIST: Planckův zákon](https://nvlpubs.nist.gov/nistpubs/jres/106/1/j61man.pdf), [IPCC AR6, kap. 7 a tab. 7.10](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-7/).

## Co vědomě nepřidáváme

Sedmý a osmý experiment z verze 2, rozsáhlou úvodní klimatologii, tabulku předem zvolených oteplení ani animaci fotonů. První dvě rozšiřují téma a odvádějí pozornost od konkrétních grafů; další by zaměnily předpoklady za výsledky nebo naznačovaly nesprávný mikroskopický mechanismus. Výška příspěvku zůstává rozložením, nikoli jednou fyzickou emisní hladinou. Výpočetní jádro, spektrální data a logická návaznost verze 1 se zachovávají.

## D. Závěrečná oponentura

Výsledky závěrečného průchodu z hlediska studenta a fyzika a rozsah provedených numerických i browserových kontrol jsou uvedeny v [VALIDATION.md](VALIDATION.md). Jde o oddělený kontrolní průchod autora, nikoli o posudek jiného nezávislého člověka.
