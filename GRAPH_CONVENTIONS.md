# Konvence atmosférických grafů a jejich použití v laboratoři

Ověřeno na primárních odborných a výukových webech 10. října 2026. Neexistuje jedna povinná orientace všech fyzikálních grafů. U vertikálního profilu je však obvyklé zachovat výšku či tlak jako svislou souřadnici a zobrazovanou vlastnost jako vodorovnou.

## Teplota jako funkce výšky

[NOAA JetStream: Layers of the Atmosphere](https://www.noaa.gov/jetstream/atmosphere/layers-of-atmosphere) obsahuje výukový graf „Average temperature profile for the lower layers of the atmosphere“ s výškou svisle a teplotou vodorovně. Obrázek NOAA JetStream byl při této kontrole také skutečně otevřen v prohlížeči: jeho osy jsou Temperature / °C vodorovně a km svisle (s doplňkovou stupnicí mil). Laboratoř zachovává tuto orientaci a používá SI kelviny a metry. Další výukový materiál je [NOAA Global Monitoring Laboratory](https://gml.noaa.gov/outreach/lesson_plans/Teacher%20Background%20Information-%20The%20Earth%27s%20Atmosphere.pdf); jeho obrázky nebyly v této kontrole vizuálně ověřeny.

Profesionální radiosondáž se často zobrazuje ve Skew‑T / log‑p diagramu. [Dokumentace NCAR RadioSonde](https://www.image.ucar.edu/Software/RadioSonde/skewt.axis.shtml) jej popisuje jako standardní osu interpretace sondáží: tlak tvoří svislou souřadnici, izobary jsou vodorovné a izotermy zešikmené. Takový diagram má vlastní geometrii; nelze jej zaměňovat s jednoduchým pravoúhlým grafem T proti z.

**Použití v laboratoři:** teplotní profil experimentu 3 má x = T / K a y = z / m. Výška roste zdola nahoru od 0 do 50 000 m. Aktuální tropopauza je vodorovná přerušovaná čára. Ve stoupajícím směru znamená posun křivky doleva ochlazování a doprava oteplování; svislý úsek znamená konstantní teplotu.

Tento výukový graf není Skew‑T a nepotřebuje nepodloženě přiřazovat tlakový profil. Zůstává u modelové geometrické výšky v SI. Záměna os nemění teplotní funkci T(z), modelové vrstvy ani přenos záření.

## Vertikální příspěvkový profil

Graf rozložení atmosférického příspěvku v experimentu 2 má rovněž y = z / m. Na x je Cj,κ/Δz v W m⁻³ (m⁻¹)⁻¹. Tato volba zachovává prostorovou interpretaci vrstev. Vykreslené hodnoty leží ve středech vrstev; součet jejich příspěvků Cj,κ rekonstruuje atmosférickou část spektrálního toku. Plocha pod spojnicí středů není přesným diskrétním součtem.

Největší vodorovná hodnota je největší příspěvek na jednotku výšky ve zvoleném spektrálním intervalu. Není to jediná emisní hladina. Přímý povrchový příspěvek v z = 0 je hraniční člen; není zahrnut do křivky atmosférických vrstev a je uveden nad grafem.

## Spektra a spektrálně závislé výšky

[Oxfordský Atmospheric Infrared Spectrum Atlas](https://eodg.atm.ox.ac.uk/ATLAS/zenith-absorption) zobrazuje spektrální souřadnici vodorovně a optickou tloušťku či absorpci svisle. Výslovně rozlišuje bezrozměrnou absorpci A a optickou tloušťku τ = −ln(1 − A) a nabízí logaritmickou svislou stupnici. [Dokumentace RFM](https://eodg.atm.ox.ac.uk/RFM/sum/rfm_flags.html) odděluje výstupy optické tloušťky, zářivosti a tokových výpočtů přes prostorový úhel.

**Použití v laboratoři:** spektra mají x = κ / m⁻¹. Svisle je konkrétně označená spektrální exitance Mκ, tok Fκ, rozdíl ΔFκ nebo log₁₀(1 + τ). Optická tloušťka není tok a zářivost jednoho směru není hemisférický tok. Laboratoř počítá a označuje hemisférický tok; nepřebírá jednotku směrové zářivosti sr⁻¹.

Graf průměrné výšky příspěvku **podle vlnočtu** zůstává x = κ / m⁻¹ a y = z / m. To má konkrétní důvod: každý bod představuje jiný spektrální interval a sdílí kurzor se spektrem. Je to jiný typ grafu než vertikální profil při jediném vybraném vlnočtu. Pás 10–90 % vyjadřuje rozložení tokových příspěvků včetně povrchu.

Laboratoř používá SI vlnočet κ = 1/λ, nikoli úhlový vlnočet 2π/λ. V odborných spektrech se často používají cm⁻¹; platí 1 cm⁻¹ = 100 m⁻¹. Hodnota λ v µm v tooltipu je pouze převod souřadnice. Nedělá z Fκ hustotu Fλ: pro převod hustoty je nutný Jacobian Fλ = Fκ/λ², pokud je λ v metrech. Polohy maxim obou hustot se proto liší.

## Kurzor, klávesnice a export

Teplota i velikost příspěvku mohou s výškou měnit směr. Stejná vodorovná hodnota tak může náležet více vrstvám. Proto oba vertikální profily vybírají bod **podle výšky y**, s vodorovným kurzorem. Šipky nahoru/dolů postupují po výškách; Home/End vybírají nejnižší/nejvyšší dostupný vzorek. Tooltip udává výšku a hodnoty jednotlivých křivek při této výšce.

CSV profilu je tabulka `Výška z / m; Aktuální profil [K]; Reference [K]`, případně výška a hustota příspěvku. Je seřazená podle výšky. Nepoužívá vyhledávání podle nemonotónní teploty. SVG a PNG zachovávají stejné osy jako obrazovka.

Ostatní grafy vybírají bod podle své vodorovné souřadnice. Energetická bilance má povrchovou teplotu na x a tok na y; šedá vrstva má optickou tloušťku na x a OLR na y; závislost na množství CO₂ má násobek sloupce na x a ΔOLR na y.
