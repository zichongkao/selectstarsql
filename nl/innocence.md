---
layout: nl_tutorial
title: Beweringen van onschuld
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innocence"></a>
## Mogelijke onschuld
Tegenstanders van de doodstraf hebben aangevoerd dat het risico om per ongeluk een onschuldig persoon te executeren een te hoge prijs is. In dit hoofdstuk proberen we bij benadering vast te stellen hoeveel onschuldige mensen er mogelijk zijn geëxecuteerd.

Het belangrijkste voorbehoud is dat een bewering van onschuld, zelfs als deze op iemands sterfbed wordt gedaan, nog geen onschuld bewijst. Bovendien, zelfs als de gevangene de waarheid spreekt, zijn er vele interpretaties van onschuld: de gevangene kan beschuldigd zijn van de moord op twee mensen, maar slechts onschuldig zijn aan de moord op één van hen; of hij kan de omstander hebben gedood maar niet de agent. Dit zijn echter niet alleen maar spitsvondigheden: in Texas rechtvaardigt moord alleen niet de doodstraf. De gevangene moet een [halsmisdaad](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes) hebben begaan, zoals het doden van een politieagent of van meerdere mensen. De gevangene kan dus onschuldig zijn in strikt juridische zin, maar misschien niet volgens de gangbare morele normen.

Toch blijft er iets verontrustends aan beweringen van onschuld die volgehouden worden tot vlak voor de executie, wanneer er weinig meer te winnen valt. Onze taak hier is om uit te zoeken hoe vaak dit gebeurt, door te berekenen in welk deel van de laatste verklaringen onschuld wordt geclaimd.

<br>
<a name="aggregations"></a>
## Aggregatiefuncties
We hebben twee getallen nodig om de verhouding te berekenen:

&nbsp;&nbsp;**Teller**: het aantal executies met een bewering van onschuld.

&nbsp;&nbsp;**Noemer**: het totale aantal executies.

Tot nu toe kwam elke rij in de uitvoer voort uit een enkele rij van de invoer. Hier hebben we echter voor zowel de teller als de noemer informatie nodig uit meerdere invoerrijen. Dit vertelt ons dat we een aggregatiefunctie moeten gebruiken. "Aggregeren" betekent meerdere elementen samenvoegen tot een geheel. Op dezelfde manier <i>nemen aggregatiefuncties meerdere rijen gegevens en combineren ze die tot één getal.</i>


<br>
<a name="count"></a>
## De COUNT-functie
`COUNT` is waarschijnlijk de meest gebruikte aggregatiefunctie. Zoals de naam al zegt, telt deze functie dingen! <code class='codeblock'>COUNT(&lt;kolom&gt;)</code> geeft bijvoorbeeld het aantal rijen in de kolom terug die niet `NULL` zijn.

<sql-exercise
  data-question="Pas de query aan om te bepalen hoeveel gevangenen een laatste verklaring hebben afgelegd."
  data-comment="We kunnen hier <code>COUNT</code> gebruiken, omdat <code>NULL</code> wordt gebruikt wanneer er geen verklaring is."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

Zoals je ziet, is de `COUNT`-functie onlosmakelijk verbonden met het concept `NULL`. Laten we een kleine uitstap maken om meer te leren over `NULL`.
<a name="nulls"></a>
<div class="sideNote">
  <h3>NULL-waarden</h3>
  <p>In SQL is <code>NULL</code> de waarde van een leeg veld. Dit is iets anders dan de lege tekenreeks <code>''</code> en het gehele getal <code>0</code>, die allebei <i>niet</i> als <code>NULL</code> worden beschouwd. Om te controleren of een veld <code>NULL</code> is, gebruik je <code>IS</code> en <code>IS NOT</code> in plaats van <code>=</code> en <code>!=</code>.</p>

  <sql-exercise
    data-question="Controleer dat 0 en de lege tekenreeks niet als NULL worden beschouwd."
    data-comment="Bedenk dat dit een samengestelde voorwaarde is. Beide <code>IS NOT NULL</code>-voorwaarden moeten waar zijn om de query <code>true</code> te laten teruggeven."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL)"
    ></sql-exercise>
</div>

Hiermee kunnen we de noemer van onze verhouding vinden:
<sql-exercise
  data-question="Bepaal het totale aantal executies in de dataset."
  data-comment="Het idee is om een kolom te kiezen waarvan je zeker weet dat er geen <code>NULL</code>-waarden in staan, en die te tellen."
  data-default-text=""
  data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Variaties op COUNT
Tot zover gaat alles goed. Maar wat als we niet weten welke kolommen vrij zijn van `NULL`? Erger nog, wat als geen enkele kolom vrij is van `NULL`? Er moet toch een manier zijn om de lengte van de tabel te bepalen!

De oplossing is `COUNT(*)`. Dit doet denken aan `SELECT *`, waarbij de `*` voor alle kolommen staat. In de praktijk telt `COUNT(*)` rijen zolang *ten minste één* van hun kolommen niet `NULL` is. Zo kunnen we de lengte van een tabel bepalen, want een tabel hoort geen rijen te bevatten die volledig `NULL` zijn.

<sql-exercise
  data-question="Controleer dat <code>COUNT(*)</code> hetzelfde resultaat geeft als hiervoor."
  data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Een andere veelvoorkomende variatie is het tellen van een deel van de tabel, bijvoorbeeld het aantal executies in Harris County. We zouden `SELECT COUNT(*) FROM executions WHERE county='Harris'` kunnen uitvoeren. Die query filtert de gegevens eerst tot een kleinere dataset met alleen de executies in Harris en telt vervolgens alle rijen. Maar wat als we tegelijkertijd het aantal executies in Bexar County willen bepalen?

De oplossing is een `CASE WHEN`-blok, dat werkt als één grote if-else-opdracht. Het heeft twee vormen, en degene die ik prettig vind is:

    CASE
      WHEN <clause> THEN <result>
      WHEN <clause> THEN <result>
      ...
      ELSE <result>
    END

Dit is toegegeven een van de wat onhandigere onderdelen van SQL. Een veelgemaakte fout is het vergeten van het `END`-commando en van de `ELSE`-voorwaarde, die als vangnet dient voor het geval alle voorgaande voorwaarden onwaar zijn. Bedenk ook uit het vorige hoofdstuk dat voorwaarden expressies zijn die als waar of onwaar geëvalueerd kunnen worden. Het is dus belangrijk om na te denken over de booleaanse waarde van alles wat je erin stopt.

<sql-exercise
  data-question="Deze query telt het aantal executies in Harris County en in Bexar County. Vervang de <code>SUM</code>s door <code>COUNT</code>s en pas de <code>CASE WHEN</code>-blokken aan zodat de query nog steeds werkt."
  data-comment="Alleen <code>SUM</code> vervangen door <code>COUNT</code> is niet genoeg, omdat <code>COUNT</code> de 0 nog steeds meetelt: 0 is immers niet <code>NULL</code>."
  data-default-text="SELECT
  SUM(CASE WHEN county='Harris' THEN 1
    ELSE 0 END),
  SUM(CASE WHEN county='Bexar' THEN 1
    ELSE 0 END)
FROM executions"
  data-solution="SELECT
  COUNT(CASE WHEN county='Harris' THEN 1
    ELSE NULL END),
  COUNT(CASE WHEN county='Bexar' THEN 1
    ELSE NULL END)
FROM executions"></sql-exercise>

<br>
## Oefenen

<sql-exercise
  data-question="Bepaal hoeveel gevangenen ouder dan 50 waren op het moment van executie."
  data-comment="Dit laat zien dat het <code>WHERE</code>-blok filtert voordat de aggregatie plaatsvindt."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Bepaal het aantal gevangenen dat geweigerd heeft een laatste verklaring af te leggen."
  data-comment="Probeer het voor bonuspunten op 3 manieren:<br> 1) Met een <code>WHERE</code>-blok,<br> 2) Met een <code>COUNT</code>- en <code>CASE WHEN</code>-blok,<br> 3) Met twee <code>COUNT</code>-functies."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

Het is de moeite waard om even een stap terug te doen en na te denken over de verschillende manieren waarop de computer deze drie queries heeft afgehandeld. In de `WHERE`-versie filterde hij eerst tot een kleine tabel en aggregeerde hij daarna, terwijl hij in de andere twee de volledige tabel moest doorlopen. In de versie met `COUNT` + `CASE WHEN` hoefde hij de tabel maar één keer te doorlopen, terwijl de versie met twee keer `COUNT` hem twee keer liet doorlopen. Hoewel de uitvoer dus identiek was, waren de prestaties waarschijnlijk het best bij de eerste en het slechtst bij de derde versie.

<sql-exercise
  data-question="Bepaal de minimale, maximale en gemiddelde leeftijd van gevangenen op het moment van executie."
  data-comment="Gebruik de aggregatiefuncties <code>MIN</code>, <code>MAX</code> en <code>AVG</code>."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>
<div class="sideNote">
  <h3>Documentatie opzoeken</h3>
  <p>Dit boek is nooit bedoeld als een allesomvattend naslagwerk voor de SQL-taal. Daarvoor zul je andere online bronnen moeten raadplegen. Dat is een vaardigheid op zich, en een die het waard is om onder de knie te krijgen, want je zult nog jaren nadat je vertrouwd bent geraakt met de taal documentatie blijven opzoeken.</p>
  <p>Het goede nieuws is dat opzoeken met de mentale modellen die je in dit boek leert snel en pijnloos zou moeten gaan, omdat je alleen nog details controleert, zoals of de functie <code>AVERAGE</code> of <code>AVG</code> heet, in plaats van uit te zoeken welke aanpak je moet kiezen.</p>
  <p>Om dingen op te zoeken gebruik ik vaak <a href="https://www.w3schools.com/sql/default.asp">W3 Schools</a>, Stack Overflow en de <a href="http://sqlite.org">officiële SQLite-documentatie</a>.</p>
</div>

<sql-exercise
  data-question="Bepaal de gemiddelde lengte (in aantal tekens) van de laatste verklaringen in de dataset."
  data-comment='Deze oefening laat zien dat je functies kunt combineren. Zoek in de <a href="http://sqlite.org/lang_corefunc.html">documentatie</a> op welke functie het aantal tekens in een tekenreeks teruggeeft.'
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="Geef een lijst van alle counties in de dataset, zonder dubbele waarden."
  data-comment="We kunnen unieke waarden krijgen met <code>SELECT DISTINCT</code>. Zie de <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentatie.</a>"
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` is eigenlijk geen aggregatiefunctie, omdat het geen enkel getal teruggeeft en omdat het werkt op de uitvoer van de query in plaats van op de onderliggende tabel. Toch heb ik het hier opgenomen, omdat het een gemeenschappelijk kenmerk deelt: het werkt op meerdere rijen.

<br>
<a name="strange"></a>
## Een vreemde query
Laten we, voordat we afsluiten, eens kijken naar deze query:<br> `SELECT first_name, COUNT(*) FROM executions`.

Ziet die er niet vreemd uit? Als je een goed mentaal model van aggregaties hebt, zou dat zo moeten zijn! `COUNT(*)` probeert één enkele waarde terug te geven: de lengte van de tabel executions. `first_name` probeert voor elke rij één waarde terug te geven. Moet de computer dan één of meerdere rijen teruggeven? Als hij er één teruggeeft, welke `first_name` moet hij dan kiezen? Als hij er meerdere teruggeeft, moet hij het resultaat van `COUNT(*)` dan over alle rijen herhalen? De vormen van de uitvoer passen gewoon niet bij elkaar!

<sql-exercise
  data-question="Laten we het toch proberen en kijken wat er gebeurt."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

In de praktijk proberen databases iets zinnigs terug te geven, zelfs als je er onzin in stopt. In dit geval kiest onze database de voornaam uit de laatste rij van onze tabel. Omdat onze tabel in omgekeerde chronologische volgorde staat, is de laatste rij die van Charlie Brooks Jr., de eerste persoon die werd geëxecuteerd nadat het Hooggerechtshof het verbod op de doodstraf had opgeheven. Verschillende databases gaan hier verschillend mee om, dus je kunt beter niet op hun standaardgedrag vertrouwen. Als je weet dat je de laatste rij wilt, moet je die expliciet opzoeken. Veel SQL-dialecten hebben een aggregatiefunctie `LAST` die dit eenvoudig maakt. Helaas heeft SQLite die niet, dus is er een omweg nodig.

<a name="dialects"></a>
<div class="sideNote">
  <h3>SQL-dialecten en databases</h3>
  <p>Hoewel we dit een boek over SQL hebben genoemd, is het, als we muggenzifterig willen zijn, eigenlijk een boek over <i>SQLite</i>. Dit komt doordat SQL een denkbeeldig concept is, een platonisch ideaal. In werkelijkheid bestaan er alleen dialecten die proberen te voldoen aan de SQL-specificaties.</p>
  <p>SQL is bovendien onvolledig gespecificeerd, wat betekent dat sommige functionaliteit niet door de standaarden wordt vastgelegd. De standaarden zeggen bijvoorbeeld niet of de functie die de lengte van een tekenreeks bepaalt <code>LEN</code> (SQL Server) of <code>LENGTH</code> (SQLite) moet heten, of hoe identifiers zoals tabel- of kolomnamen tussen aanhalingstekens moeten worden gezet (<code>`</code> in MySQL, <code>"</code> in SQLite).</p>
  <p>Om het nog erger te maken, kan zelfs één enkele query in één enkel dialect verschillend worden verwerkt, omdat de onderliggende databases verschillende architecturen kunnen hebben. Het PostgreSQL-dialect kan bijvoorbeeld worden gebruikt op databases die verspreid zijn over veel verschillende fysieke machines, maar ook op databases die uit één enkel bestand bestaan. Dit betekent dat de mentale modellen die we hier ontwikkelen slechts een hulpmiddel zijn. Ze weerspiegelen misschien niet precies wat de database doet.</p>
  <p>We hebben gekozen voor SQLite, dat zowel een dialect als een implementatie is, omdat het een van de meest gebruikte databases is. We hebben ook geprobeerd ons te richten op de kernfunctionaliteit en het mentale model van SQL in plaats van op specifieke eigenaardigheden van SQLite. Met een robuust mentaal model is het eenvoudig om te wisselen tussen SQL-dialecten en databases.
  </p>
</div>

<br>
<a name="recap"></a>
## Conclusie en samenvatting
Laten we wat we tot nu toe hebben geleerd gebruiken om onze taak te voltooien:
<sql-exercise
  data-question="Bepaal welk deel van de gevangenen in hun laatste verklaring beweert onschuldig te zijn."
  data-comment="Om een decimale deling uit te voeren, zorg je ervoor dat een van de getallen een decimaal getal is door het met 1.0 te vermenigvuldigen. Gebruik <code>LIKE '%innocent%'</code> om beweringen van onschuld te vinden."
  data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

Deze methode om beweringen van onschuld te vinden is toegegeven nogal onnauwkeurig, omdat onschuld ook in andere bewoordingen kan worden uitgedrukt, zoals "not guilty" (niet schuldig). Toch vermoed ik dat ze het werkelijke aantal eerder onderschat, en dat ze waarschijnlijk wel de juiste orde van grootte geeft. De vraag waarmee we dan blijven zitten, is of we bereid zijn de mogelijkheid te accepteren dat tot wel 5% van de mensen die we executeren in werkelijkheid onschuldig is. ([Paul Graham is daar niet toe bereid.](http://paulgraham.com/prop62.html))

Samengevat zijn we overgestapt van bewerkingen op rijniveau in het vorige hoofdstuk naar het gebruik van aggregatiefuncties op meerdere rijen in de dataset. Dit heeft een nieuwe weg geopend om gedrag op systeemniveau te bestuderen. In het volgende hoofdstuk leren we hoe we aggregatiefuncties kunnen toepassen op meerdere subgroepen van de dataset met behulp van het `GROUP BY`-blok.
