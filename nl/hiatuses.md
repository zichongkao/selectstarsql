---
layout: nl_tutorial
title: Execution Hiatuses
dbFile: data/tx_deathrow_small.db
---

<a name="hiatuses"></a>
## Hiatussen
Deze grafiek toont de executies in de tijd.![](../imgs/exno_time.png) Merk op dat er verschillende lange periodes zijn geweest waarin geen executies plaatsvonden. Ons doel is om uit te zoeken wanneer dat precies was en de oorzaken te achterhalen.

Onze strategie is om de tabel in een staat te krijgen waar elke rij ook de datum van de executie ervoor bevat. We kunnen dan het tijdsverschil tussen de twee data vinden, ze ordenen in aflopende volgorde en de langste hiaten aflezen.

<br>
<a name="joins"></a>
## Denken over Joins
Geen van de technieken die we tot nu toe hebben geleerd zijn hier afdoende. Onze gewenste tabel heeft dezelfde lengte als de originele `executions` tabel, dus we kunnen aggregaties uitsluiten die een kleinere tabel opleveren. Het [Beazley](beazley.html) hoofdstuk leerde ons alleen rij operaties die ons beperken tot het werken met informatie die al in de rijen staat. De datum van de vorige uitvoering ligt echter buiten een rij, dus we moeten `JOIN` gebruiken om de extra informatie binnen te halen.

Laten we aannemen dat de extra informatie die we willen hebben, bestaat in een tabel met de naam `previous` die twee kolommen heeft `(ex_number, last_ex_date)`. We zouden de volgende query kunnen uitvoeren om onze taak te voltooien:

    SELECT
      last_ex_date AS start,
      ex_date AS end,
      ex_date - last_ex_date AS day_difference
    FROM executions
    JOIN previous
      ON executions.ex_number = previous.ex_number
    ORDER BY day_difference DESC
    LIMIT 10

Het `JOIN` blok is de focus van deze sectie. In plaats van het te bekijken als een regel op zichzelf, is het vaak handig om er zo naar te kijken: ![](../imgs/join_correctview.png) Dit benadrukt hoe `JOIN` een grote gecombineerde tabel creëert die vervolgens wordt ingevoerd in het `FROM`-blok, net als elke andere tabel.
<a name="disam-cols"></a>
<div class="sideNote">
  <h3>Kolommen Desambigueren</h3>
  <p>De bovenstaande query is ook opmerkelijk omdat de clausule <code>executions.ex_number = previous.ex_number</code> het formaat <code>&lt;table&gt;.&lt;column&gt;</code> gebruikt om kolommen te specificeren. Dit is hier alleen nodig omdat beide tabellen een kolom met de naam <code>ex_number</code> hebben.</p>
</div>

<br>
<a name="join_types">
## Soorten Verbindingen
Het blok `JOIN` heeft de vorm <code class="codeblock">&lt;table1&gt; JOIN &lt;table2&gt; ON &lt;clause&gt;</code>. De clausule werkt op dezelfde manier als in <code class="codeblock">WHERE &lt;clausule&gt;</code>. Dat wil zeggen, het is een instructie die evalueert naar waar of onwaar, en elke keer dat een rij uit de eerste tabel en een rij uit de tweede op een rij staan waarbij de clausule waar is, worden de twee aan elkaar gekoppeld:
<img src="../imgs/join_base.png" style="width:80%; display:block; margin-left:auto; margin-right:auto"/>

Maar wat gebeurt er met rijen die niet overeenkomen? In dit geval had de `vorige` tabel geen rij voor uitvoering nummer 1 omdat er geen eerdere uitvoeringen zijn.
<img src="../imgs/join_unmatched.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Het `JOIN` commando voert standaard een zogenaamde "inner join" uit, waarbij niet-gematchte rijen worden verwijderd.
<img src="../imgs/join_inner.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Om alle rijen van de linkertabel te behouden, gebruiken we een `LEFT JOIN` in plaats van de vanilla `JOIN`. De lege delen van de rij worden met rust gelaten, wat betekent dat ze evalueren naar <code>NULL</code>.
<img src="../imgs/join_left.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

De <code>RIGHT JOIN</code> kan worden gebruikt om niet-gematchte rijen in de rechtertabel te behouden en de `OUTER JOIN` kan worden gebruikt om niet-gematchte rijen in beide tabellen te behouden.

De laatste subtiliteit is het omgaan met meerdere matches. Stel dat we een `duplicated_previous` tabel hebben die twee kopieën bevat van elke rij van de `previous` tabel. Elke rij van `executions` komt nu overeen met twee rijen in `duplicated_previous`.
<img src="../imgs/join_dup_pre.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">
De join maakt genoeg rijen van `executions` zodat elke overeenkomende rij van `duplicated_previous` zijn eigen partner krijgt. Op deze manier kunnen joins tabellen maken die groter zijn dan hun bestanddelen.
<img src="../imgs/join_dup_post.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">

<sql-quiz
  data-title="Mark the true statements."
  data-description="Suppose we have tableA with 3 rows and tableB with 5 rows.">
  <sql-quiz-option
    data-value="cartesian_prod"
    data-statement="<code>tableA JOIN tableB ON 1</code> returns 15 rows."
    data-hint="The <code>ON 1</code> clause is always true, so every row of tableA is matched against every row of tableB."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="bad_cartesian"
    data-statement="<code>tableA JOIN tableB ON 0</code> returns 0 rows."
    data-hint="For the same reason that <code>ON 1</code> returns 15 rows."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="left_join_bad"
    data-statement="<code>tableA LEFT JOIN tableB ON 0</code> returns 3 rows."
    data-hint="The left join preserves all the rows of tableA even though no rows of tableB match."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="outer_join_bad"
    data-statement="<code>tableA OUTER JOIN tableB ON 0</code> returns 8 rows."
    data-hint="The outer join preserves all the rows of tableA and tableB even though none of them are paired."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="outer_join_good"
    data-statement="<code>tableA OUTER JOIN tableB ON 1</code> returns 15 rows."
    data-hint="All the rows of tableA match all of the rows of tableB because of the <code>on 1</code> clause, so any join will return 15 rows. The different joins only differ in how they handle unmatched rows."
    data-correct="true"></sql-quiz-option>
</sql-quiz>


<br>
<a name="dates"></a>
## Data
Laten we even afstand nemen van joins en kijken naar deze regel in onze template query:

      ex_date - last_ex_date AS day_difference

We hebben een grote aanname gedaan dat we datums van elkaar kunnen aftrekken. Maar stel je voor dat jij de computer bent die een regel als deze ontvangt. Geef je dan het aantal dagen tussen de datums terug? Waarom geen uren of seconden? Om het nog erger te maken, SQLite heeft eigenlijk geen datum- of tijdtypes (in tegenstelling tot de meeste andere SQL dialecten) dus de kolommen `ex_date` en `last_ex_date` zien er voor jou uit als gewone strings. Je wordt in feite gevraagd om `'hallo' - 'wereld'` te doen. Wat betekent dat eigenlijk?

Gelukkig bevat SQLite een heleboel functies om de computer te vertellen: "Hé, deze strings die ik doorgeef bevatten eigenlijk datums of tijden. Gebruik ze als een datum."

<sql-exercise 
  data-question='Zoek in [de documentatie](https://www.sqlite.org/lang_datefunc.html) om de query zo te maken dat deze het aantal dagen tussen de datums teruggeeft.' 
  data-default-text="SELECT '1993-08-10' - '1989-07-07' AS day_difference"
  data-solution="
SELECT JULIANDAY('1993-08-10') - JULIANDAY('1989-07-07') AS day_difference"
></sql-exercise>

<br>
<a name="self_joins"></a>
## Zelf Verbinden
Met wat we geleerd hebben over datums, kunnen we onze sjabloonquery corrigeren:

    SELECT
      last_ex_date AS start,
      ex_date AS end,
      JULIANDAY(ex_date) - JULIANDAY(last_ex_date)
        AS day_difference
    FROM executions
    JOIN previous
      ON executions.ex_number = previous.ex_number
    ORDER BY day_difference DESC
    LIMIT 5

De volgende stap is het uitbouwen van de `previous` tabel.
<sql-exercise
  data-question="Write a query to produce the <code>previous</code> table."
  data-comment="Remember to use aliases to form the column names<code>(ex_number, last_ex_date)</code>. Hint: Instead of shifting dates back, you could shift <code>ex_number</code> forward!"
  data-solution="
SELECT
  ex_number + 1 AS ex_number,
  ex_date AS last_ex_date
FROM executions
WHERE ex_number < 553"></sql-exercise>

Nu kunnen we deze query nesten in ons sjabloon hierboven: 
<sql-exercise
  data-question="Nest de query die de `previous` tabel genereert in het sjabloon."
  data-comment='Merk op dat we hier een tabel alias gebruiken, door het resultaat van de geneste query "previous" te noemen.'
  data-default-text="SELECT
  last_ex_date AS start,
  ex_date AS end,
  JULIANDAY(ex_date) - JULIANDAY(last_ex_date)
    AS day_difference
FROM executions
JOIN (<your-query>) previous
  ON executions.ex_number = previous.ex_number
ORDER BY day_difference DESC
LIMIT 10"
  data-solution="
SELECT
   last_ex_date AS start,
   ex_date AS end,
   JULIANDAY(ex_date) - JULIANDAY(last_ex_date) AS day_difference
FROM executions
JOIN (
    SELECT
      ex_number + 1 AS ex_number,
      ex_date AS last_ex_date
    FROM executions
  ) previous
  ON executions.ex_number = previous.ex_number
 ORDER BY day_difference DESC
 LIMIT 10"
></sql-exercise>

`previous` is afgeleid van `executions`, dus we voegen effectief `executions` aan zichzelf toe. Dit wordt een "self join" genoemd en is een krachtige techniek om rijen informatie te laten halen uit andere delen van dezelfde tabel.

We hebben de `previous` tabel gemaakt om te verduidelijken welk doel hij dient. Maar we kunnen de query eleganter schrijven door de `executions` tabel direct aan zichzelf te koppelen. 
<sql-exercise
  data-question="Vul de `JOIN ON` clausule in om een elegantere versie van de vorige query te voltooien."
  data-comment="Merk op dat we nog steeds één kopie een alias moeten geven om ervoor te zorgen dat we er ondubbelzinnig naar kunnen verwijzen."
  data-default-text="SELECT
  previous.ex_date AS start,
  executions.ex_date AS end,
  JULIANDAY(executions.ex_date) - JULIANDAY(previous.ex_date)
    AS day_difference
FROM executions
JOIN executions previous
  ON <your-clause>
ORDER BY day_difference DESC
LIMIT 10"
  data-solution="
SELECT
  previous.ex_date AS start,
  executions.ex_date AS end,
  JULIANDAY(executions.ex_date) - JULIANDAY(previous.ex_date)
    AS day_difference
FROM executions
JOIN executions previous
  ON executions.ex_number = previous.ex_number + 1
ORDER BY day_difference DESC
LIMIT 10"
></sql-exercise>

We kunnen nu de precieze data van de onderbrekingen gebruiken om te onderzoeken wat er in elke periode is gebeurd. In de jaren direct nadat het verbod op de doodstraf werd opgeheven, waren er lange perioden zonder executies vanwege het lage aantal doodvonnissen, in combinatie met juridische uitdagingen tegen de nieuwe uitspraak. We sluiten daarom onderbrekingen vóór 1993 uit en richten ons op twee grote onderbrekingen sindsdien.![](../imgs/exno_time_annotated.png)

Hiaat 1 was het gevolg van juridische uitdagingen tegen de [Antiterrorism and Effective Death Penalty Act van 1996](https://en.wikipedia.org/wiki/Antiterrorism_and_Effective_Death_Penalty_Act_of\_1996), gecreëerd als reactie op de bomaanslagen op het World Trade Center in 1993 en Oklahoma City in 1995. De wet beperkte het beroepsproces om de doodstraf effectiever te maken, vooral voor terrorismezaken([Bron](https://deathpenaltyinfo.org/documents/1996YearEndRpt.pdf)).

Hiatus 2 werd veroorzaakt door een schorsing door het Hooggerechtshof terwijl het zich boog over [Baze v. Rees](https://en.wikipedia.org/wiki/Baze_v.\_Rees), waarin onderzocht werd of dodelijke injecties in strijd zijn met het Achtste Amendement dat "wrede en ongebruikelijke straffen" verbiedt. Dit had gevolgen voor executies in heel Amerika omdat de meeste staten dezelfde cocktail van medicijnen gebruikten als Kentucky. Het Hooggerechtshof bevestigde uiteindelijk de beslissing van de rechtbank in Kentucky en een paar maanden later werden de executies in Texas hervat.

<br>
<a name="recap"></a>
## Recapitulatie

Het grote idee achter `JOIN`s is om een uitgebreide tabel te maken omdat de originele tabel niet de informatie bevat die we nodig hebben. Dit is een krachtig concept omdat het ons bevrijdt van de beperkingen van een enkele tabel en ons in staat stelt om meerdere tabellen te combineren op potentieel complexe manieren. We hebben ook gezien dat met deze extra complexiteit een nauwgezette boekhouding belangrijk wordt. Aliassen van tabellen, hernoemen van kolommen en het definiëren van goede `JOIN ON` clausules zijn allemaal technieken die ons helpen orde te bewaren.