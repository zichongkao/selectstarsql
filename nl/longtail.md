---
layout: nl_tutorial
title: The Long Tail
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>
## Lange staart
Lange staarten verwijzen naar kleine aantallen monsters die een groot aantal keren voorkomen. Wanneer we deze uitzetten, vormen ze een kleine strook ver rechts van het massamiddelpunt die eruitziet als een staart. Ze duiden op de aanwezigheid van uitschieters waarvan het ongewone gedrag interessant voor ons kan zijn.![](../imgs/execution_tail.png) In de context van Texas executies verwijst de lange staart naar een klein aantal counties waarvan bekend is dat ze een groot aantal executies uitvoeren.

Laten we het percentage executies van elke provincie vinden, zodat we de executies in de staart eruit kunnen pikken.

Zoals steeds duidelijker zal worden, vertelt de vorm van de tabellen ons veel over de bewerkingen die we moeten uitvoeren. (Dit is analoog aan de dimensionale analyse in de natuurkunde.) In dit geval kunnen we vaststellen dat de methoden die we tot nu toe behandeld hebben, ontoereikend zijn: Het [Beazley](beazley.html) hoofdstuk ging over individuele rijen gegevens, maar het is duidelijk dat we moeten aggregeren om gegevens op county-niveau te vinden. Het [Claims of Innocence](innocence.html) hoofdstuk leerde ons aggregatie, maar die functies zouden uiteindelijk de dataset aggregeren tot één rij, terwijl we eigenlijk één rij per county willen.

<br>
<a name="groupby"></a>
## Het GROUP BY blok
Hier komt het `GROUP BY` blok om de hoek kijken. Hiermee kunnen we de dataset opsplitsen en aggregatiefuncties toepassen binnen elke groep, wat resulteert in één rij per groep. De meest eenvoudige vorm is <code class="codeblock">GROUP BY &lt;kolom&gt;, &lt;kolom&gt;, ...</code> en komt na het blok `WHERE`.

<sql-exercise
  data-question="This query pulls the execution counts per county."
  data-default-text="SELECT
  county,
  COUNT(*) AS county_executions
FROM executions
GROUP BY county"></sql-exercise>

Als je je [A Strange Query](innocence.html#strange) herinnert, gaan er alarmbellen af in je hoofd. Hadden we net niet geleerd om geaggregeerde en niet-geaggregeerde kolommen niet te mixen? Het verschil hier is dat groeperingskolommen de enige kolommen zijn die niet-geaggregeerd mogen zijn. Immers, alle rijen in die groep moeten dezelfde waarden hebben op die kolommen, zodat er geen dubbelzinnigheid is in de waarde die moet worden geretourneerd.

Je hebt misschien ook ons gebruik van `AS` opgemerkt. Dit noemen we "aliasing". In het `SELECT`-blok geeft <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> een alias waarnaar later in de query kan worden verwezen. Dit bespaart ons het herschrijven van lange expressies en stelt ons in staat om het doel van de expressie te verduidelijken.

<sql-exercise 
  data-question="Deze query telt de uitvoeringen met en zonder laatste verklaringen. Wijzig het om het verder uit te splitsen per provincie." 
  data-comment="De clausule `last_statement IS NOT NULL` werkt als een indicatorvariabele waarbij 1 waar betekent en 0 onwaar." 
  data-default-text="SELECT
  last_statement IS NOT NULL AS has_last_statement,
  COUNT(*)
FROM executions
GROUP BY has_last_statement" 
  data-solution="SELECT
  last_statement IS NOT NULL AS has_last_statement, county,
  COUNT(*)
FROM executions
GROUP BY has_last_statement, county"
  ></sql-exercise>

<br>
<a name="having"></a>
## Het blok HAVING
De volgende oefening illustreert dat filteren via het `WAAR` blok gebeurt vóór groeperen en aggregeren. Dit wordt weerspiegeld in de volgorde van de syntax aangezien het `WAAR` blok altijd voorafgaat aan het `GROEPEN BY` blok.

<sql-exercise 
  data-question="Tel het aantal gevangenen van 50 jaar of ouder die zijn geëxecuteerd in elke county." data-comment="Je zou dit moeten kunnen doen met <code>CASE WHEN</code>, maar probeer hier het <code>WHERE<code> blok te gebruiken." data-default-text=""
  data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"
  ></sql-exercise>

Dit is allemaal goed en wel, maar wat gebeurt er als we willen filteren op het resultaat van het groeperen en aggregeren? We kunnen toch niet vooruit springen in de toekomst en daar informatie vandaan halen. Om dit probleem op te lossen, gebruiken we `HAVING`.

<sql-exercise 
  data-question="Maak een lijst van de provincies waarin meer dan 2 gedetineerden van 50 jaar of ouder zijn geëxecuteerd."
  data-comment="Dit bouwt voort op de vorige oefening. We hebben een extra filter nodig-een die het resultaat van de aggregatie gebruikt. Dit betekent dat het niet kan bestaan in het <code>WHERE</code> blok omdat die filters worden uitgevoerd vóór de aggregatie. Zoek het <a href='https://www.w3schools.com/sql/sql_having.asp'><code>HAVING</code> blok</a> op. Je kunt het zien als een post-aggregatie <code>WHERE</code> blok." data-default-text=""
  data-solution="SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(\*) > 2"
  ></sql-exercise>

<br>
## Praktijk
Deze quiz is ontworpen om je begrip uit te dagen. Lees de uitleg, zelfs als je alles juist hebt.

<sql-quiz
  data-title="Mark the statements that are true."
  data-description="This query finds the number of inmates from each county and 10 year age range. <pre>
SELECT
  county,
  ex_age/10 AS decade_age,
  COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
  <sql-quiz-option
    data-value="valid"
    data-statement="The query is valid (ie. won't throw an error when run)."
    data-hint="Were you thrown off by <code>ex_age/10</code>? Grouping by transformed columns is fine too."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="gran"
    data-statement="The query would return more rows if we were to use <code>ex_age</code> instead of <code>ex_age/10</code>."
    data-hint="Remember that <code>ex_age/10</code> does integer division which rounds all the ages. This produces fewer unique groups."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="The output will have as many rows as there are unique combinations of counties and decade_ages in the dataset."
    data-hint="This is correct."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The output will have a group ('Bexar', 6) even though no Bexar county inmates were between 60 and 69 at execution time."
    data-hint="The <code>GROUP BY</code> block finds all combinations <i>in the dataset</i> rather than all theoretically possible combinations."
    data-value="abstract_cartesian"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The output will have a different value of county for every row it returns."
    data-hint="This would be true only if <code>county</code> were the only grouping column. Here, we can have many groups with the same county but different decade_ages."
    data-value="one_col_diff"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The output can have groups where the count is 0."
    data-hint="This is similar to the ('Bexar', 6) question. If there are no rows with ('Bexar', 6), the group won't even show up."
    data-value="count_zero"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The query would be valid even if we don't specify <code>county</code> in the <code>SELECT</code> block."
    data-hint="The grouping columns don't necessarily have to be in the <code>SELECT</code> block. It would be valid, but not make much sense because we wouldn't know which counts are for which county."
    data-value="missing_gp_col"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="It is reasonable to add <code>last_name</code> to the <code>SELECT</code> block even without grouping by it."
    data-hint="Even though it would be valid (in SQLite) for the reasons set forth in <a href='innocence.html#strange'>A Strange Query</a>, it is poor form to have non-aggregate, non-grouping columns in the <code>SELECT</code> block."
    data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>

<sql-exercise 
  data-question="Maak een lijst van alle afzonderlijke provincies in de dataset."
  data-comment="We hebben dit in het vorige hoofdstuk gedaan met het <code>SELECT DISTINCT</code> commando. Houd het deze keer bij vanille <code>SELECT</code> en gebruik <code>GROUP BY</code>."
  data-default-text=""
  data-solution="SELECT county FROM executions GROUP BY county"
></sql-exercise>

<br>
<a name="nested"></a>
## Geneste Queries
Nu vraag je je misschien af: zouden we niet klaar zijn als we gewoon zoiets als dit konden uitvoeren?

    SELECT
      county,
      PERCENT_COUNT(*)
    FROM executions
    GROUP BY county

Percentages zijn zo'n veelgebruikte metriek&mdash;zou zo'n functie niet moeten bestaan? Helaas niet, en misschien met een goede reden: Zo'n functie zou moeten aggregeren, zowel binnen de groepen (om de teller te krijgen) als in de hele dataset (om de noemer te krijgen). Maar elke query heeft of een `GROUP BY` blok of niet. Dus wat we echt nodig hebben zijn twee aparte queries, een die aggregeert met een `GROUP BY` en een andere die aggregeert zonder. We kunnen ze dan combineren met een techniek die "nesting" heet.

Hier is een voorbeeld van hoe nesten werkt. De haakjes zijn belangrijk om de grens aan te geven tussen de binnenste query en de buitenste:

<sql-exercise
  data-question="Find the first and last name of the inmate with the longest last statement (by character count)."
  data-comment="Write in a suitable query to nest in &lt;<code>length-of-longest-last-statement</code>&gt;."
  data-default-text="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (<length-of-longest-last-statement>)"
  data-solution="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (SELECT MAX(LENGTH(last_statement))
     FROM executions)"></sql-exercise>

Nogmaals, nesting is hier nodig omdat in de `WHERE`-clausule, wanneer de computer een rij inspecteert om te beslissen of de laatste uitspraak de juiste lengte heeft, hij niet naar buiten kan kijken om de maximale lengte voor de hele dataset te achterhalen. We moeten de maximale lengte afzonderlijk vinden en deze in de clausule invoeren. Laten we nu hetzelfde concept toepassen om het percentage executies uit elke provincie te vinden.

<sql-exercise
  data-question="Voeg de &lt;<code>count-of-all-rows</code>&gt;query in om het percentage executies van elke county te vinden."
  data-comment="<code>100.0</code> is een decimaal getal, dus we kunnen decimale percentages krijgen." data-default-text="SELECT
  county,
  100.0 * COUNT(*) / (<count-of-all-rows>)
    AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
  data-solution="SELECT
  county,
  100.0 * COUNT(*) / (SELECT COUNT(*) FROM executions)
   AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
  ></sql-exercise>

Ik heb stilletjes een `ORDER BY` blok toegevoegd. Het formaat is <code class="codeblock">ORDER BY &lt;kolom&gt;, &lt;kolom&gt;, ...</code> en het kan worden aangepast door `DESC` toe te voegen als je de standaard oplopende volgorde niet wilt.

<br>
<a name="harris"></a>
## Provincie Harris
Is het verrassend dat Harris (de stad Houston), Dallas, Bexar en Tarrant goed zijn voor ongeveer 50% van alle executies in Texas? Misschien wel, vooral als we uitgaan van de veronderstelling dat executies gelijk verdeeld moeten zijn over de counties. Maar een betere eerste benadering is dat executies worden verdeeld in lijn met de bevolkingsverdeling. De [2010 Texas Census] (https://www.tsl.texas.gov/ref/abouttx/popcnty12010.html) laat zien dat de 4 county's een bevolking hadden van 10,0 miljoen, wat 40,0% is van de bevolking van Texas (25,1 miljoen). Dit maakt de bevinding iets minder verrassend.

Maar door deze staart verder uit te splitsen, realiseren we ons dat de county Harris verantwoordelijk is voor het grootste deel van de delta. Het heeft slechts 16,4% van de bevolking, maar 23,1% van de executies. Dat is bijna 50% meer dan het zou moeten hebben.

Talloze studies hebben onderzocht waarom Harris County zo productief is en er zijn verschillende factoren naar voren gebracht:
- <p>Vervolgingen zijn [georganiseerd en goed gefinancierd](https://web.archive.org/web/20191227235319/https://www.citylab.com/equity/2014/09/one-texas-county-is-responsible-for-most-of-the-executions-in-the-entire-us/380705/), terwijl de verdediging door de rechtbank wordt gefinancierd en slecht wordt gestimuleerd. [(Bron, zie p49)](http://www.houstonlawreview.org/wp-content/uploads/2018/05/3-Steiker-896.pdf)</p>
- <p>De officier van justitie die er al lang zat, was [vastbesloten en enthousiast over de doodstraf](https://www.chron.com/news/houston-texas/article/Former-DA-ran-powerful-death-penalty-machine-1833545.php).</p>
- <p>Rechters in Texas worden gekozen en de bevolking steunt de doodstraf. [(Bron)](https://priceonomics.com/why-has-texas-executed-so-many-inmates/)</p>
- <p>Checks and balances in het rechtssysteem van Harris County hebben niet gewerkt. [(Bron, zie p929)](https://houstonlawreview.org/article/3874-the-problem-of-rubber-stamping-in-state-capital-habeas-proceedings-a-harris-county-case-study)</p>

<br>
<a name="recap"></a>
## Samenvatting
In dit gedeelte hebben we geleerd om te aggregeren over groepen en om nesting te gebruiken om de uitvoer van een binnenquery te gebruiken in een buitenquery. Deze technieken hebben het zeer praktische voordeel dat ze ons in staat stellen percentages te berekenen.

<a name="mapreduce"></a>
<div class="sideNote">
  <h3>MapReduce</h3>
  <p>Een interessante toevoeging is dat we eigenlijk net hebben geleerd om MapReduce te doen in SQL. MapReduce is een bekend programmeerparadigma dat berekeningen ziet als uitgevoerd in een "map" en "reduce" stap. Je kunt <a href="https://stackoverflow.com/questions/28982/simple-explanation-of-mapreduce">hier</a> meer leren over MapReduce.</p>
  <p>Het <a href="beazley.html">Beazley</a> hoofdstuk ging helemaal over mapping omdat het ons liet zien hoe we verschillende operaties konden mappen naar alle rijen. Bijvoorbeeld, <code>SELECT LENGTH(last_statement) FROM executions</code> mapt de lengte functie uit naar alle rijen. Dit hoofdstuk liet ons zien hoe we verschillende groepen gegevens kunnen verkleinen met aggregatiefuncties; en het vorige <a href="innocence.html">Claims of Innocence</a> hoofdstuk was slechts een speciaal geval waarin de hele tabel één groep is.</p>
</div>

In het volgende hoofdstuk leren we over `JOIN's` waarmee we met meerdere tabellen kunnen werken.