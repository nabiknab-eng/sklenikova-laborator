# Opakovaná samostatná fyzikální kontrola

Datum: 10. října 2026. Zpráva samostatného agentního oponenta; nejde o certifikaci člověkem ani o empirickou validaci klimatu.

## Rozsah a stav

Opakovaně přečteny výpočetní rovnice a implementace v `physics.js` a `calculations.js`, aktuální výukové texty a definice os v `app.js`, grafová knihovna `charts.js` a dokumenty PHYSICS, VALIDATION a REVIEW. Provedeny nové numerické sondy přesných kořenů na hledací mřížce a integrálu zobrazeného výseku Planckova spektra. Hlavní i nezávislá sada byly znovu spuštěny; protokoly této opakované kontroly jsou v `work/recheck-main-results.json` a `work/recheck-review-results.json`, aby revize nepřepisovala současně aktualizované distribuční protokoly.

Browser nebyl použit. Nová úvodní stránka `index.html`, `section#intro`, byla následně přečtena celá: obecné vysvětlení, čtyři položky slovníčku, všech šest článků, pokusy, návod ke grafům a popis omezení. Byla porovnána s konkrétními ovladači, výpočty a karty jednotlivých experimentů. Rovněž byl přečten celý nový dokument `GRAPH_CONVENTIONS.md` a ověřena aktuální implementace změněných os a výběru podle výšky. Skutečný browserový průchod provádí implementátor.

## Nový konkrétní nález P3 — přesný kořen na mřížce

Původní algoritmus `P.balance` vracel kořen přesně na dolním kraji 200 K bez položky `dOLR`. Přesný vnitřní kořen mohl být vrácen dvakrát, jednou jako bisekční odhad a podruhé jako přesný bod mřížky bez derivace. Kořen a znaménka bilance byly fyzikálně správné; chyba byla v úplnosti a jedinečnosti struktury výsledku a zobrazení derivace.

Reprodukce, plná izotermie, ostatní plyny 1×:

- A = 0,75, S = 1451,6158513182636 W m⁻²: ASR = 90,72599070739147 W m⁻²; vracel se `{T:200,residual:0}` bez derivace.
- A = 0,50, S = 1162,603955133328 W m⁻²: ASR = 145,325494391666 W m⁻²; vracely se teploty 224,99999523162842 K a 225 K.

Obě kombinace S/A leží uvnitř dostupných rozsahů číselných ovladačů. Příčinou byla větev pro `fa === 0` s jinou strukturou výsledku a současné zpracování `fb === 0` bisekcí.

**Implementátor chybu opravil:** všechny kořeny nyní procházejí společnou funkcí `addRoot`, která dopočítá reziduum i derivaci a zabrání duplikaci; přesné body mřížky jsou zpracovány samostatně a bisekce se používá pouze na opačná znaménka. Byl doplněn hlavní regresní test pro 200, 225 a 380 K. Zdrojová oprava je věcně správná a opakovaná hlavní sada prošla **25 z 25 testů**. Přesné kořeny nyní mají jediný záznam a derivace 1,81451982; 2,58356435 a 12,44579141 W m⁻² K⁻¹. Dodatečná revizní sada rovněž prošla; přímý paprskový přenos má stejné maximum relativní odchylky 2,96137 × 10⁻⁷ jako při předchozí kontrole. Výsledek pro 380 K používá S = 4978,316562 W m⁻², takže kontroluje výpočetní modul mimo rozsah slunečního ovladače, nikoli dostupný stav UI.

## Opětovně potvrzené vlastnosti modelu

1. Planckova spektrální zářivost pro SI vlnočet, faktor π při hemisférické integraci a odvození σ mají správné vztahy i jednotky. Δκ je v m⁻¹, τ bezrozměrná. Nepřevádí se pouze osa grafu bez převodu spektrální hustoty.
2. Atmosférická vlastní emise je v každé vrstvě přítomna. Pořadí vrstev, znaménko optické souřadnice, přenosové váhy Q(τnad) − Q(τnad + Δτ) a integrace přes směry jsou konzistentní.
3. V plné izotermii zahrnující povrch je OLR nezávislý na absorpci. Izotermická atmosféra s jinou teplotou než povrch tuto nulovou odezvu obecně nemá; experiment 4 to správně rozlišuje.
4. Inverze může zvýšit OLR při stejných teplotách. Teplota povrchu se v experimentech 2 a 3 sama nemění; skutečně nižší kořen Ts se počítá až v experimentu 6 při definovaném pravidle změny profilu.
5. Při posunu předepsané inverze vychází změna kořene 1× → 2× CO₂ −0,48125267 K; výchozí pevný běžný profil dává ΔOLR −1,87794534 W m⁻². Tyto hodnoty se při opakovaném spuštění nezměnily.
6. N = ASR − OLR a ΔN = −ΔOLR při pevném ASR mají správná znaménka. Kořen TOA bilance není samostatné řešení povrchové a vrstvové energetické bilance, které aplikace nepočítá.
7. Spektrální překryv se počítá na společných původních vzorcích. Optické tloušťky se sčítají; izolované změny toku se obecně nesčítají. Reference ukládá celé nastavení a její změna může zahrnovat více parametrů; UI to u relevantního srovnání oznamuje.
8. Pevná atmosféra má nezávislý základní teplotní parametr. Změna povrchu mezi 235 a 300 K nemění nalezený kořen 275,9900713 K; po nastavení tohoto povrchu zůstává bilance vyrovnaná v numerické toleranci.

Základní testy a dodatečný přímý paprskový přenos opět potvrzují implementaci konkrétního modelu. Neprokazují fyzikální věrnost separovatelného vertikálního rozdělení absorpce skutečné zemské atmosféře. Tento rozdíl je v PHYSICS, VALIDATION i REVIEW správně vysvětlen. Ani husté spektrální vzorkování neopravuje chybějící výškově a teplotně závislou spektroskopii.

## Doporučená drobná zpřesnění výukového textu

- Základní vysvětlení experimentu 1 má výslovně uvádět „plocha pod **celým** spektrem“. Graf obsahuje pouze 250–300 000 m⁻¹, zatímco karta toku používá celý analytický integrál. Při Ts = 380 K je numerický integrál zobrazeného výseku 1178,257385 W m⁻² a celý tok 1182,350183 W m⁻²; rozdíl je 0,3462 %. Současný pokročilý panel a podtitul grafu už hovoří správně o celém spektru.
- U příspěvkové funkce doporučeno explicitně uvést „součet příspěvků všech vrstev dává atmosférickou část Fκ“. Spojnice středů vrstev je způsob zobrazení hodnot Cj/Δz, její běžný geometrický integrál není přesně diskrétní součet Cj. PHYSICS.md už tento rozdíl správně dokumentuje.
- V popularizačním úvodu nepřisuzovat nulový integrální rozdíl automaticky izotermii: i neizotermické spektrální části se mohou kompenzovat. Původní chyba této interpretace je již opravena.

První dvě doporučení byla zapracována do aktuálního `app.js`: základní výklad experimentu 1 uvádí celé spektrum, pokročilý výklad příspěvků v experimentu 2 uvádí součet Cj a výslovně odlišuje plochu pod spojnicí středů. Nový úvod tyto veličiny rovněž správně rozlišuje.

## Podmínky správného otočení profilových grafů

Graf vertikální teploty je vhodné zobrazit s T na vodorovné ose a z na svislé ose rostoucí vzhůru. Výška příspěvku v experimentu 2 už je svisle, proti vlnočtu vodorovně. Příspěvkový profil lze obdobně zobrazit jako Cj/Δz vodorovně a z svisle.

Při této změně je nutné zachovat pořadí bodů podle výšky. T(z) i příspěvková hustota mohou být ne-monotónní. Bod pro tooltip proto nesmí být hledán binárně podle teploty nebo příspěvku; vhodné je vybírat podle seřazené výšky nebo podle vzdálenosti kurzoru v rovině grafu. Jedna teplota může odpovídat více výškám. Referenční profil musí být zobrazen se stejnými souřadnicemi a export musí zachovat smysl hodnot a jednotek.

Praktické očekávané tvary: při plné izotermii je teplotní profil svislá čára; při troposférickém ochlazování se směrem vzhůru posouvá doleva; při inverzi doprava. Kladný stratosférický gradient vytváří v horní části zlom směrem doprava. Γ je stále dT/dz; výměna grafických os nemění jeho definici ani znaménko.

Aktuálně upravené zdroje `app.js` a `charts.js` už tyto podmínky splňují na úrovni implementace: profil má x = T, y = z, příspěvková funkce x = Cj/Δz, y = z; oba používají rozsah výšky 0–50 000 m a `cursorAxis:'y'`. Tooltip a svislé klávesové šipky vybírají podle seřazeného y. CSV uvádí výšku a odpovídající horizontální hodnoty. Výběr tak nevyžaduje monotónní T(z) nebo C(z). Toto je kontrola kódu a jednotek; skutečný browserový průchod nyní provádí implementátor.

Primární zdroje pro orientaci:

- [NOAA JetStream, Layers of the Atmosphere](https://www.noaa.gov/jetstream/atmosphere/layers-of-atmosphere), obrázek „Average temperature profile for the lower layers of the atmosphere“ na konci stránky; přímý [obrázek profilu](https://www.noaa.gov/sites/default/files/styles/default_width_428/public/2023-05/atmprofile.jpg?itok=8BQ5be-7).
- [NASA, archivní atmosférické modely](https://ntrs.nasa.gov/api/citations/19730021605/downloads/19730021605.pdf), Figure 2.1 na PDF straně 17 (tištěná strana 9): digitální text explicitně uvádí výšku na svislé stupnici a Temperature/K na vodorovné. Požadovaný webový screenshot PDF selhal s cache miss; není tedy tvrzeno, že byl obrázek touto cestou vizuálně otevřen.

Starý odkaz `NASAAirPoster.pdf` se při této kontrole přesměroval na hlavní stránku NASA Earth; doporučeno použít přímý současný NOAA zdroj nebo stabilní NASA archiv.

## Fyzikální podmínky pro novou úvodní stránku

- Popsat energii přicházející od Slunce a odcházející jako tepelné záření; neuvádět, že atmosféra záření pouze blokuje nebo trvale uvězňuje.
- Popsat absorpci a vlastní vyzařování plynu v různých směrech. Nezaměňovat tepelnou emisi za prosté odrážení téhož fotonu zpět k povrchu.
- Zdůraznit, že o změně OLR rozhodují teploty vrstev i absorpce, a zachovat legitimní případy izotermie a předepsané inverze.
- Vysvětlit, které veličiny se při srovnání drží pevné, a oddělit změnu toku od teplotní odezvy. Nulová bilance TOA sama neurčuje Ts bez pravidla změny atmosféry.
- U ideální hodnoty kolem 255 K zachovat předpoklad pevného albeda a uniformní teploty; její porovnání s reálnými 288 K není prognóza skutečné Země po odebrání atmosféry a změně oblačnosti, albeda či rozložení teplot.
- Neuvádět vodní teplotní zpětnou vazbu jako mechanismus, který tato laboratoř sama počítá; sloupec vody je zde pevný.
- Při uvádění maxima spektra rozlišit hustotu podle vlnočtu a podle vlnové délky. Při 288 K je maximum Mκ kolem 56 500 m⁻¹ (přepočtená λ přibližně 17,7 µm), zatímco maximum Mλ je kolem 10,1 µm. Obecná kvalitativní věta o posunu ke kratším vlnovým délkám při oteplení je správná pro obě souřadnice. Převod hustoty vyžaduje Jacobian.

## Konkrétní konečná revize úvodní stránky

### Potvrzené interpretace

| Text | Výsledek kontroly proti modelu a UI |
|---|---|
| Obecné vysvětlení a slovníček | Rozlišuje příjem a výdej, tok a teplotu, svislý sloupec a ppm. Absorpce je spojena s vlastní emisí, nikoli s odrážením nebo trvalým uvězněním záření. Tokové jednotky jsou správné. |
| Článek 1 | Správně vymezuje ideální černý tepelný povrch, konečný rozsah grafu a celý analytický tok. Neslučuje maximum podle κ s maximem podle λ. Hodnota kolem 255 K je přiřazena výchozí idealizaci, nikoli prognóze skutečné Země bez atmosféry. |
| Článek 2 | Správně definuje ΔOLR jako aktuální minus reference, upozorňuje na změnu více parametrů a odlišuje spektrálně závislou výšku od svislého profilu při vybraném spektrálním intervalu. Výškový model je označen jako zjednodušení. |
| Článek 3 | Nulový účinek spojuje s plnou izotermií včetně stejné Ts. Inverze může OLR zvýšit, což vyplývá z přenosu. Správně a výslovně uvádí, že karta zdvojnásobení vždy porovnává 1× → 2×, zatímco karta aktuálního OLR respektuje násobek ovladače a dolní graf počítá všechny své body proti 1×. |
| Článek 4 | Správně odlišuje izotermickou atmosféru od stejně teplého povrchu, šedou τ od molekulového spektra a hemisférický tok od jediného paprsku. Mezní případy odpovídají analytickému vztahu. |
| Článek 5 | Správně rozlišuje sčítání τ a nesčítání změn toku. Transformace log₁₀(1 + τ) není vydávána za procento absorpce. Čtyři porovnávané stavy odpovídají `calculations.js`. Ruční změna vody je odlišena od automatické zpětné vazby. |
| Článek 6 | Správně definuje obě pravidla změny atmosféry, konstantní sloupce v průběhu hledání i podmíněnost výsledku. Nižší Ts při předepsané inverzi je interpretována jako nový kořen definované bilance, nikoli jako výsledek samotného pevného profilu nebo obecná předpověď pro Zemi. |
| Čtení grafů a omezení | Výška je u vertikálních profilů svislá, ve spektrálním grafu průměrných výšek zůstává vodorovně κ. Návrat do výchozího stavu opravdu resetuje nastavení i referenci daného experimentu. Výukový text rozlišuje skutečná sloupcová data od vlastního rozdělení do výšky a neřešenou vrstvovou/povrchovou bilanci. |

V textu nebyla nalezena zavádějící popularizační analogie. Předepsanou atmosféru nevysvětluje jako zrcadlo ani jako bariéru, která by zablokovala všechnu energii. Všechny klíčové fyzikální interpretace odpovídají současnému modelu a UI.

### Čtyři malé konkrétní textové nálezy P3 — následně zapracované

1. V článku 3 věta „Tropopauza je zde zadaná výška, v níž se mění gradient“ neplatí při Γ = Γs, zejména při plné izotermii. Přesný návrh: „Tropopauza je zde zadaná výška oddělující dolní a horní část profilu, pro něž nastavujeme gradient zvlášť.“ Vodorovná čára může tuto výšku správně označovat i bez změny sklonu.
2. Pokus článku 3 „Zvolte gradient 0: oba gradienty se nastaví na nulu“ platí při kliknutí na předvolbu 0, nikoli při ručním přepsání pouze čísla Γ na nulu. Přesný návrh: „Klikněte na předvolbu 0: oba gradienty se nastaví na nulu.“
3. Pokus článku 6 se ptá po inverzi, zda se Ts změnila „opačným směrem“, ačkoli předchozí pokus je plná izotermie s nulovou změnou. Nulová změna nemá směr. Přesný návrh: „Zopakujte s předvolbou Inverze. Je při 2× rovnovážná Ts nižší než při 1×?“
4. Po změně os příspěvkového profilu může „vrchol křivky“ znamenat nejvyšší místo na výškové ose. Maximum příspěvku je ovšem maximum vodorovné hodnoty, nikoli maximální výška. V `GRAPH_CONVENTIONS.md` i v popisku grafu doporučeno: „Největší vodorovná hodnota označuje největší příspěvek na jednotku výšky ve zvoleném spektrálním intervalu. Není to jediná emisní hladina.“

Tyto nálezy se týkají přesnosti instrukcí a jejich čtení; neodhalují další chybu výpočtu.

Následnou přímou kontrolou `index.html`, `app.js` a `GRAPH_CONVENTIONS.md` byly všechny čtyři úpravy potvrzeny jako zapracované. Text o tropopauze nyní výslovně zahrnuje stejný gradient, pokus žádá kliknutí na předvolbu „0“, inverzní pokus se přímo ptá na nižší Ts při 2× CO₂ a příspěvkové maximum je definováno vodorovnou hodnotou. Tyto nálezy jsou uzavřené.

### GRAPH_CONVENTIONS.md

Matematické definice, jednotky, rozdělení typů grafů, výklad izotermie/inverze i popis výběru podle výšky a CSV odpovídají aktuálnímu zdroji. Vztah Fλ = Fκ/λ² při λ v metrech je správný a dokument výslovně uvádí, že převod λ v tooltipu neprovádí změnu spektrální hustoty. Skew‑T/log‑p je správně odlišen od používaného pravoúhlého grafu T/z. NCAR dokumentace byla otevřena a potvrzuje vodorovné izobary, zešikmené izotermy a použití pro sondáže. Oxfordský atlas a RFM Flags byly znovu otevřeny; rozlišují absorpci, optickou tloušťku, zářivost a prostorově integrované tokové výpočty. NOAA GML PDF je dostupný primární dokument; běžný textový výstup nástroje z něj neposkytl obsah obrázku a nebyl zde proveden nový browserový průchod. Vizuální ověření zdrojových grafů je součástí kontroly implementátora.

Po zapracování slovního zpřesnění maxima příspěvku nebyla v konvencích nalezena věcná chyba. Závěr se týká matematické implementace a její výukové interpretace; nepředstavuje novou validaci modelu vůči měřenému klimatu.

## Konečný doplněk — tolerance kořene na hranici intervalu

Implementátor při browserovém průchodu nalezl další hraniční numerický případ: plná izotermie, CO₂ = 2×, A = 0,75 a S = 1451,6158513182636 W m⁻² vracely bez tolerance žádný kořen. Při 1× je pro tyto vstupy kořen přesně na 200 K; nepatrně jiné pořadí a váhy sčítání při 2× dávají na hranici záporné reziduum −3,16902 × 10⁻¹² W m⁻² a oba krajní body už mají stejné znaménko. Matematický kořen tím nepřestal existovat; šlo o numerickou detekci na uzavřeném hledaném intervalu.

Aktuální `physics.js` přidává tokovou toleranci 10⁻⁹ W m⁻² při posouzení kořene přímo na mřížce. Sousední bisekce se provádí pouze tehdy, pokud jsou oba konce mimo tuto toleranci a mají opačná znaménka. Tento postup správně zachovává jedinečný kořen, jeho reziduum a derivaci. Tolerance současně výslovně znamená, že bilance do 10⁻⁹ W m⁻² je pro účel nalezení tohoto kořene považována za nulu; nejde o tvrzení bitově přesné matematické rovnosti.

**Přiměřenost byla nezávisle ověřena:** při všech 37 bodech mřížky 200–380 K po 5 K a CO₂ = 0, 1, 2, 8 (celkem 148 srovnání) je největší odchylka izotermického OLR od analytického σT⁴ **4,43748 × 10⁻¹⁰ W m⁻²** při 200 K a CO₂ = 2×. Tuto hodnotu tolerance pokrývá. Rozdíl vůči analytickému toku zahrnuje také zanedbatelnou Simpsonovu kvadraturu spektra, nejen rozdíl sčítání při změně CO₂; při 200 K je numericky integrovaný povrchový tok nepatrně vyšší než σT⁴ a ořez transparentního zbytku na nezápornou hodnotu jej nesnižuje. Nemá to významný vliv na výukový výsledek.

V přepočtu pomocí dOLR/dT = 4σT³ odpovídá tolerance při 200 K teplotě **5,51110 × 10⁻¹⁰ K** a při 380 K **8,03484 × 10⁻¹¹ K**. Je tedy hluboko pod ukončovací přesností bisekce 10⁻⁵ K i pod přesností zobrazovaných údajů. Největší zjištěná odchylka toku má ekvivalentní teplotu 2,44554 × 10⁻¹⁰ K.

Reprodukovatelná sonda je v `tests/recheck-boundary.cjs`, výsledky v `tests/recheck-boundary-results.json`. Kromě 148 srovnání potvrdila:

- všech 12 analytických kořenů T = 200, 225, 380 K při CO₂ = 0, 1, 2, 8 má právě jeden záznam, správnou derivaci a reziduum uvnitř 10⁻⁹ W m⁻²;
- všech osm případů ASR o 10⁻⁵ W m⁻² pod dolní nebo nad horní hranicí (oba konce × čtyři sloupce CO₂) správně nevrací kořen;
- původní browserová reprodukce nyní vrací jediný kořen T = 200 K, reziduum −3,16902 × 10⁻¹² W m⁻² a dOLR/dTs = 1,81451981857 W m⁻² K⁻¹.

Znovu spuštěná hlavní sada včetně nové regresní kontroly prošla **26 z 26 testů**. Výstup byl přesměrován do `work/recheck-main-results.json`; distribuční protokoly tato kontrola nezměnila. Předchozí samostatná přenosová revize zůstává platná, protože nová úprava mění pouze detekci kořene a nemění přenos ani spektroskopická data. Konečný stav: čtyři drobné textové nálezy jsou zapracované, hraniční numerická chyba je opravená a ověřená, další otevřená věcná chyba v tomto rozsahu kontroly nebyla nalezena. Browserová a vizuální kontrola zůstává v kompetenci implementátora.

## Distribuční a vizuální doplněk implementátora

Zpráva výše zachovává průběh samostatné revize a rozlišuje kontrolu zdroje od browserové kontroly. Implementátor po opravách znovu spustil distribuční hlavní sadu 26/26, přenosovou oponentní sadu a přibalenou hraniční sondu. Jejich aktuální protokoly jsou v `tests/results.json`, `tests/review-results.json` a `tests/recheck-boundary-results.json`. Skutečná browserová kontrola je v `tests/recheck-browser.json` a `VALIDATION.md`. Teplotní obrázek NOAA JetStream byl také otevřen a vizuálně přečten: x je teplota, y výška.
