---
layout: nl_tutorial
title: Beazley's Last Statement
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>
## De zaak Beazley
In 1994 schoot Napoleon Beazley de 63-jarige zakenman John Luttig dood in zijn garage terwijl hij probeerde de auto van zijn gezin te stelen. Omdat hij op het moment van de moord nog net geen 18 jaar oud was, ontketende de zaak Beazley een heftig debat over de doodstraf voor minderjarige delinquenten. 3 jaar nadat Beazley was geëxecuteerd, verbood het Hooggerechtshof de executie van delinquenten die onder de 18 waren op het moment van hun misdrijf ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons)).

De zaak was ook opmerkelijk omdat het slachtoffer de vader was van federale rechter John Michael Luttig. Tijdens de beroepen bij het Hooggerechtshof wisselden drie van de negen rechters zich recuus vanwege hun persoonlijke banden met rechter Luttig, waardoor er nog maar zes overbleven om de zaak te behandelen.

Napoleon Beazley hield een gepassioneerde laatste verklaring waarin hij betoogde dat oog om oog geen rechtvaardiging vormt voor gerechtigheid. Onze taak is om zijn verklaring uit de database op te halen.

<br>
<a name="first"></a>
## Een eerste SQL-query
<sql-exercise
  data-question="Voer deze query uit om de eerste 3 rijen van de tabel 'executions' op te halen."
  data-comment="Het bekijken van een paar rijen is een goede manier om de kolommen van een tabel te achterhalen. Probeer de kolomnamen te onthouden voor later gebruik."
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

De SQL-query kan eruit zien als een gewone zin, maar je moet het zien als drie Lego-blokjes:
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
Net als bij Lego heeft elk blokje een vaste opmaak en moeten de verschillende blokjes op een bepaalde manier in elkaar passen.

<br>
<a name="select"></a>
## Het SELECT-blok
Het `SELECT`-blok specificeert welke kolommen je wilt uitvoer. De opmaak is <code class='codeblock'>SELECT &lt;column&gt;, &lt;column&gt;, ...</code>. Elke kolom moet worden gescheiden door een komma, maar de spatie na de komma is optioneel. De ster (d.w.z. `*`) is een speciaal karakter dat aangeeft dat we alle kolommen in de tabel willen.

<sql-exercise
  data-question="Pas in de onderstaande code-editor de query aan om de kolom `last_statement` toe te voegen aan de bestaande kolommen."
  data-comment="Zodra je klaar bent, kun je op Shift+Enter drukken om de query uit te voeren."
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>
<div class="sideNote">
  <h3>SQL-opmerkingen</h3>
  <p>Merk op dat bij het klikken op "Show Solution" de oplossing in de editor wordt weergegeven voorafgegaan door <code>/*</code>. De inhoud tussen <code>/*</code> en <code>*/</code> wordt als opmerking behandeld en wordt niet als code uitgevoerd. Dit is handig om tijdelijk code te verbergen die we niet willen uitvoeren. Om de oplossing uit te voeren, verwijder je gewoon je code of maak je er een opmerking van en haal je de opmerking uit de oplossing.</p>
  <p><code>--</code> is een andere manier om opmerkingen aan te geven. Het wordt gebruikt om de rest van een enkele regel als opmerking te markeren. Wanneer we meerdere regels willen opmerken, is <code>/* ... */</code> handiger dan <code>--</code> voorafgaand aan elke regel te plaatsen.</p>
</div>

<br>
<a name="from"></a>
## Het FROM Blok
Het <code>FROM</code> blok geeft aan vanuit welke tabel we een query uitvoeren. De indeling is <code class="codeblock">FROM &lt;tabel&gt;</code>. Het komt altijd na het <code>SELECT</code> blok.

<sql-exercise
  data-questtion="Voer de gegeven query uit en observeer de fout die wordt gegenereerd. Corrigeer de query."
  data-comment="Het is een goede gewoonte om foutmeldingen te bekijken wanneer er iets misgaat. Vermijd het oplossen van problemen op gevoel of door trial-and-error."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

In het volgende voorbeeld, merk op dat we het `FROM` blok niet nodig hebben als we niets uit een tabel gebruiken.

<sql-exercise
  data-question="Pas de query aan om 50 en 51 te delen door 2."
  data-comment="SQL ondersteunt alle gebruikelijke rekenkundige bewerkingen."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

Is het niet vreemd dat `51 / 2` resulteert in `25` in plaats van `25,5`? Dit komt doordat SQL gehele deling uitvoert. Om decimale deling uit te voeren, moet ten minste een van de operanden een decimaal getal zijn, bijvoorbeeld `51.0 / 2`. Een veelvoorkomend trucje is om een getal te vermenigvuldigen met `1.0` om het om te zetten naar een decimaal getal. Dit zal later in de hoofdstukken van pas komen.

<a name="capitalization"></a>
<div class="sideNote">
  <h3>Hoofdletters</h3>
  <p>Hoewel we <code>SELECT</code>, <code>FROM</code> en <code>LIMIT</code> in hoofdletters hebben geschreven, zijn SQL-commando's niet hoofdlettergevoelig. Je kunt zien dat de code-editor ze herkent en opmaakt als een commando, ongeacht de hoofdlettergebruik. Desalniettemin raad ik aan SQL-commandos altijd in Hoofdletters te schrijven om ze te onderscheiden van kolomnamen, tabelnamen en variabelen.</p>
  <p>Kolomnamen, tabelnamen en variabelen zijn ook niet hoofdlettergevoelig in deze versie van SQL, hoewel ze in veel andere versies hoofdlettergevoelig zijn. Voor de zekerheid raad ik aan altijd aan te nemen dat ze hoofdlettergevoelig zijn.</p>
</div>

<a name="whitespace"></a>
<div class="sideNote">
  <h3>Witruimte</h3>
  <p>Witruimte verwijst naar spaties, tabs, regelafbrekingen en andere tekens die op een pagina als lege ruimte worden weergegeven. Net als met hoofdletters is SQL niet erg gevoelig voor witruimte, zolang je niet twee woorden aan elkaar plakt. Dit betekent dat er gewoon minstens één witruimtekarakter rond elk commando moet zijn - het maakt niet uit welke of hoeveel je er gebruikt. Tenzij het een korte query is, geef ik er de voorkeur aan om elk commando op een nieuwe regel te zetten voor een betere leesbaarheid.</p>

<sql-exercise
  data-question="Controleer of fouten maken in hoofdletters en witruimte nog steeds een geldige query oplevert."
  data-comment="Karla Tucker was de eerste vrouw die werd geëxecuteerd in Texas sinds de Burgeroorlog. Ze werd ter dood gebracht voor het doden van twee mensen tijdens een overval in 1983."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
        WhErE ex_number = 145"></sql-exercise>
</div>

<br>
<a name="where"></a>
## Het WHERE Blok
Het `WHERE` blok stelt ons in staat om de tabel te filteren op rijen die aan bepaalde voorwaarden voldoen. De indeling is <code class='codeblock'>WHERE &lt;voorwaarde&gt;</code> en het komt altijd na het `FROM` blok. Hier verwijst een voorwaarde naar een booleaanse verklaring die de computer kan evalueren als waar of onwaar, zoals <code>ex_number = 145</code>. Je kunt je voorstellen dat de computer door elke rij in de tabel gaat en controleert of de voorwaarde waar is, en zo ja, de rij retourneert.

<sql-exercise
  data-question="Vind de voornaam, achternaam en leeftijd (ex_age) van gevangenen van 25 jaar of jonger op het moment van executie."
  data-comment="Omdat de gemiddelde tijd die gevangenen op death row doorbrengen vóór de executie 10,26 jaar is, zijn er sinds 1976 slechts 6 gevangenen zo jong geëxecuteerd in Texas."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

Het is duidelijk hoe we rekenkundige operatoren zoals `<` en `<=` kunnen gebruiken om voorwaarden te formuleren. Er zijn ook een aantal string-operatoren om met tekst te werken.

De krachtigste hiervan is waarschijnlijk <code>LIKE</code>. Hiermee kunnen we wildcards zoals `%`` en `_` gebruiken om verschillende tekens te matchen. Bijvoorbeeld, `first_name LIKE '%roy'` zal waar zijn voor rijen met voornamen 'roy', 'Troy' en 'Deroy', maar niet voor 'royman'. Het jokerteken `_` zal slechts één teken matchen, dus `first_name LIKE '_roy'` zal alleen overeenkomen met 'Troy'.

<sql-exercise
  data-question="Pas de query aan om het resultaat voor Raymond Landry te vinden."
  data-comment="Je zou denken dat dit gemakkelijk zou zijn omdat we zijn voornaam en achternaam al kennen. Maar datasets zijn zelden zo schoon. Gebruik de LIKE-operator zodat je zijn naam niet perfect hoeft te weten om de rij te vinden."
  data-default-text="SELECT first_name, last_name, ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name = 'Landry'"
  data-solution="SELECT first_name, last_name, ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name LIKE '%Landry%'"></sql-exercise>

<a name="quotes"></a>
<div class="sideNote">
  <h3>Aanhalingstekens</h3>
  <p>In SQL worden tekstwaarden aangegeven met enkele aanhalingstekens. Backticks (dwz <code>`</code>) kunnen worden gebruikt om kolom- en tabelnamen aan te geven. Dit is handig wanneer de kolom- of tabelnaam hetzelfde is als een SQL-sleutelwoord en wanneer ze een spatie bevatten. Het is mogelijk om een database te hebben met een tabel genaamd 'where' en een kolom genaamd 'from'. (Wie zou zo gemeen zijn om dit te doen?!) Je zou dan <code>SELECT `from` FROM `where` WHERE ...</code> moeten doen. Dit is een ander voorbeeld waarom het kapitaliseren van SQL-commando's helpt.</p>
</div>

Zoals je hebt gezien in de vorige oefening, kunnen complexe voorwaarden worden samengesteld uit eenvoudige voorwaarden met behulp van booleaanse operatoren zoals `NOT`, `AND` en `OR`. SQL geeft de meeste prioriteit aan `NOT`, dan `AND` en tenslotte `OR`. Maar als je, net als ik, te lui bent om de volgorde van prioriteit te onthouden, kun je haakjes gebruiken om de gewenste volgorde te verduidelijken.

<sql-exercise
  data-question="Voeg een paar haakjes toe zodat deze verklaring 0 retourneert."
  data-comment="Hier vertrouwen we op het feit dat 1 waar betekent en 0 onwaar betekent."
  data-default-text="SELECT 0 AND 0 OR 1"
  data-solution="SELECT 0 AND (0 OR 1)"
  ></sql-exercise>

Laten we een snelle quiz doen om je begrip te verankeren.

<sql-quiz
  data-title="Selecteer de <code>WHERE</code> blokken met geldige voorwaarden."
  data-description="Dit zijn lastige. Zelfs als je het juist hebt geraden, lees dan de uitleg om de redenering te begrijpen.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> en <code>0</code> zijn de meest elementaire booleaanse verklaringen. Dit blok garandeert dat er geen rijen worden geretourneerd."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="De <code>==</code> operator controleert gelijkheid in veel andere programmeertalen, maar SQL gebruikt <code>=</code>."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="Meerdere kolomnamen kunnen worden gebruikt in een voorwaarde."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="De 'groter dan of gelijk aan' operator is <code>>=</code>. De volgorde van de symbolen komt overeen met wat je in het Engels zou zeggen."
  ></sql-quiz-option>
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="SQL kan de waarheidswaarde van bijna alles evalueren. De 'ex_age' kolom is gevuld met gehele getallen. De regel voor gehele getallen is 0 is onwaar en alles wat niet 0 is, is waar, dus alleen rijen met niet-nul leeftijden worden geretourneerd."
    data-correct="true"
  ></sql-quiz-option>
  <sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="Meer dan één jokerteken is prima. Maar het patroon moet na de LIKE-operator komen."
    ></sql-quiz-option>
</sql-quiz>

Nu heb je de tools die je nodig hebt om ons project af te ronden.
<sql-exercise
  data-question="Vind de laatste verklaring van Napoleon Beazley."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

Is het niet verbazingwekkend hoe diepzinnig en welbespraakt Beazley is? Bedenk dat hij slechts 25 jaar oud was toen hij de verklaring maakte en sinds zijn 18e in de gevangenis zat.

<br>
<a name="#recap"></a>
## Samenvatting
Het doel van dit hoofdstuk is om de basis maar krachtige <code class="codeblock">SELECT &lt;kolom&gt; FROM &lt;tabel&gt; WHERE &lt;voorwaarde&gt;</code> te introduceren. Hiermee kunnen we een tabel filteren door de computer rij voor rij te laten gaan en de rijen te selecteren waarvoor de `WHERE` clausule waar is. We hebben ook geleerd hoe we vrij complexe voorwaarden kunnen opstellen die kunnen werken op kolommen met tekst, numerieke en booleaanse waarden.

Tot nu toe hebben we op het niveau van de rij geopereerd, wat ons beperkte tot het bekijken van individuele gegevenspunten. In het volgende hoofdstuk zullen we ons richten op aggregaties, waarmee we fenomenen op systeemniveau kunnen bestuderen.