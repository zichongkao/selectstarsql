---
layout: nl_tutorial
title: Claims of Innocence
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innocence"></a>
## Mogelijke onschuld
Tegenstanders van de doodstraf hebben geargumenteerd dat het risico van het per ongeluk executeren van een onschuldig persoon een te grote kostenpost is om te dragen. In dit hoofdstuk proberen we bij benadering vast te stellen hoeveel onschuldige mensen er geëxecuteerd zijn.

Het belangrijkste voorbehoud is dat een bewering van onschuld, zelfs als deze op iemands sterfbed wordt gedaan, geen onschuld inhoudt. Bovendien, zelfs als de gevangene de waarheid spreekt, zijn er vele interpretaties van onschuld: De gevangene kan beschuldigd zijn van de moord op twee mensen maar is slechts onschuldig aan de moord op één; of hij kan de omstander hebben gedood maar niet de agent. Dit zijn echter niet alleen maar spitsvondigheden: in Texas rechtvaardigt moord alleen niet de doodstraf. De gevangene moet een [halsmisdaad](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes) begaan hebben, zoals het doden van een veiligheidsagent of meerdere mensen. De gevangene kan dus onschuldig zijn in strikte juridische zin, maar misschien niet volgens de gangbare morele normen.

<br>
<a name="aggregations"></a>
## Geaggregeerde functies
We hebben twee getallen nodig om de verhouding te berekenen:

&nbsp;&nbsp;**Numerator**: Number of executions with claims of innocence.

&nbsp;&nbsp;**Denominator**: Number of executions in total.

Tot nu toe is elke rij in de uitvoer afkomstig van een enkele rij invoer. Hier hebben we echter voor zowel de teller als de noemer informatie nodig uit meerdere invoerrijen. Dit vertelt ons dat we een aggregaatfunctie moeten gebruiken. "Samenvoegen" betekent meerdere elementen combineren tot een geheel. Op dezelfde manier *nemen* aggregatiefuncties *meerdere rijen gegevens en combineren deze tot één getal.*

<br>
<a name="count"></a>
## De COUNT-functie
`COUNT` is waarschijnlijk de meest gebruikte aggregatiefunctie. Zoals de naam al zegt, telt deze functie dingen! <code class="codeblock">COUNT(&lt;kolom&gt;)</code> geeft bijvoorbeeld het aantal niet-nul rijen in de kolom.<br>

<sql-exercise
  data-question="Edit the query to find how many inmates provided last statements."
  data-comment="We can use <code>COUNT</code> here because <code>NULL</code>s are used when there are no statements."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

Zoals je kunt zien, is de `COUNT-functie` intrinsiek verbonden met het concept van `NULLs`. Laten we een kleine uitweiding maken om meer te leren over `NULLs`.
<a name="nulls"></a>
<div class="sideNote">
  <h3>Nullen</h3>
  <p>In SQL is <code>NULL</code> de waarde van een lege invoer. Dit is anders dan de lege tekenreeks <code>''</code> en het gehele getal <code>0</code>, die beide <i>niet</i> als <code>NULL</code> worden beschouwd. Om te controleren of een invoer <code>NULL</code> is, gebruik je <code>IS</code> en <code>IS NOT</code> in plaats van <code>=</code> en <code>!=</code>.</p>

  <sql-exercise
    data-question="Verify that 0 and the empty string are not considered NULL."
    data-comment="Recall that this is a compound clause. Both of the two <code>IS NOT NULL</code> clauses have to be true for the query to return <code>true</code>."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL) "
    ></sql-exercise>
</div>

Hiermee kunnen we de noemer voor onze verhouding vinden:
<sql-exercise
  data-question="Find the total number of executions in the dataset."
  data-comment="The idea here is to pick one of the columns that you're confident has no <code>NULL</code>s and count it."
  data-default-text=""
  data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Variaties op COUNT
Tot zover alles goed. Maar wat als we niet weten welke kolommen `NULL`-vrij zijn? Erger nog, wat als geen van de kolommen `NULL`-vrij is? Er moet toch een manier zijn om de lengte van de tabel te vinden!

The solution is `COUNT(*)`. This is reminiscent of `SELECT *` where the `*` represents all columns. In practice `COUNT(*)` counts rows as long as *any one* of their columns is non-null. This helps us find table lengths because a table shouldn't have rows that are completely null.

<sql-exercise
  data-question="Verify that <code>COUNT(*)</code> gives the same result as before."
  data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Another common variation is to count a subset of the table. For instance, counting Harris county executions. We could run `SELECT COUNT(*) FROM executions WHERE county='Harris'` which filters down to a smaller dataset consisting of Harris executions and then counts all the rows. But what if we want to simultaneously find the number of Bexar county executions?

The solution is to apply a `CASE WHEN` block which acts as a big if-else statement. It has two formats and the one I like is:

    CASE
        WHEN <clause> THEN <result>
        WHEN <clause> THEN <result>
        ...
        ELSE <result>
    END

This is admittedly one of the clunkier parts of SQL. A common mistake is to miss out the `END` command and the `ELSE` condition which is a catchall in case all the prior clauses are false. Also recall from the previous chapter that clauses are expressions that can be evaluated to be true or false. This makes it important to think about the boolean value of whatever you stuff in there.

<sql-exercise
  data-question="This query counts the number of Harris and Bexar county executions. Replace <code>SUM</code>s with <code>COUNT</code>s and edit the <code>CASE WHEN</code> blocks so the query still works."
  data-comment="Switching <code>SUM</code> for <code>COUNT</code> alone isn't enough because <code>COUNT</code> still counts the 0 since 0 is non-null."
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
## Praktijk

<sql-exercise
  data-question="Find how many inmates were over the age of 50 at execution time."
  data-comment="This illustrates that the <code>WHERE</code> block filters before aggregation occurs."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Find the number of inmates who have declined to give a last statement."
  data-comment="For bonus points, try to do it in 3 ways:<br> 1) With a <code>WHERE</code> block,<br> 2) With a <code>COUNT</code> and <code>CASE WHEN</code> block,<br> 3) With two <code>COUNT</code> functions."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

It is worthwhile to step back and think about the different ways the computer handled these three queries. The `WHERE` version had it filter down to a small table first before aggregating while in the other two, it had to look through the full table. In the `COUNT` + `CASE WHEN` version, it only had to go through once, while the double `COUNT` version made it go through twice. So even though the output was identical, the performance was probably best in the first and worst in the third version.


<sql-exercise
  data-question="Find the minimum, maximum and average age of inmates at the time of execution."
  data-comment="Use the <code>MIN</code>, <code>MAX</code>, and <code>AVG</code> aggregate functions."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>
<div class="sideNote">
  <h3>Documentatie opzoeken</h3>
  <p>Dit boek is nooit bedoeld als een allesomvattende referentie voor de SQL taal. Daarvoor zult u andere online bronnen moeten opzoeken. Dit is een vaardigheid op zich, die het waard is om onder de knie te krijgen omdat u jaren nadat u bekend bent met de taal nog documentatie zult opzoeken.</p>
  <p>Het goede nieuws is dat met de mentale modellen die je in dit boek leert, opzoekingen snel en pijnloos zouden moeten zijn, omdat je alleen details controleert zoals of de functie <code>AVERAGE</code> of <code>AVG</code> heet in plaats van uit te zoeken welke aanpak je moet kiezen.</p>
  <p>Voor opzoekingen gebruik ik vaak <a href="https://www.w3schools.com/sql/default.asp">W3 Schools</a>, Stack Overflow en de <a href="http://sqlite.org">officiële SQLite documentatie</a>.</p>
</div>

<sql-exercise
  data-question="Find the average length (based on character count) of last statements in the dataset."
  data-comment='This exercise illustrates that you can compose functions. Look up the <a href="http://sqlite.org/lang_corefunc.html">documentation</a> to figure out which function which returns the number of characters in a string.'
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="List all the counties in the dataset without duplication."
  data-comment="We can get unique entries by using <code>SELECT DISTINCT</code>. See <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentation.</a>"
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` isn't really an aggregate function because it doesn't return a single number and because it operates on the output of the query rather than the underlying table. Nevertheless, I've included it here because it shares a common characteristic of operating on multiple rows.



<br>
<a name="strange"></a>
## Een vreemde query
Laten we, voordat we afsluiten, eens kijken naar deze query:<br> `SELECT first_name, COUNT(*) FROM executions`.

Doesn't it look strange? If you have a good mental model of aggregations, it should! `COUNT(*)` is trying to return a single entry consisting the length of the execution table. `first_name` is trying to return one entry for each row. Should the computer return one or multiple rows? If it returns one, which `first_name` should it pick? If it returns multiple, is it supposed to replicate the `COUNT(*)` result across all the rows? The shapes of the output just don't match!

<sql-exercise
  data-question="Let's try it anyway and see what happens."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

In practice, databases try to return something sensible even though you pass in nonsense. In this case, our database picks the first name from the last entry in our table. Since our table is in reverse chronological order, the last entry is Charlie Brooks Jr., the first person executed since the Supreme Court lifted the ban on the death penalty. Different databases will handle this case differently so it's best not to count on their default behavior. If you know you want the last entry, you should explicitly find it. Many SQL dialects have a `LAST` aggregate function which makes this trivial. Unfortunately SQLite doesn't, so a workaround is necessary.

<a name="dialects"></a>
<div class="sideNote">
  <h3>SQL Dialecten en Databases</h3>
  <p>Hoewel we dit een boek over SQL hebben genoemd, is het eigenlijk een boek over <i>SQLite</i>. Dit komt omdat SQL een denkbeeldig concept is, een platonisch ideaal. In werkelijkheid zijn er alleen dialecten die proberen te voldoen aan de SQL specificaties.</p>
  <p>SQL is ook ondergespecificeerd, wat betekent dat sommige functionaliteit niet gespecificeerd wordt door de standaarden. De standaarden zeggen bijvoorbeeld niet of de functie voor het vinden van de lengte van een string <code>LEN</code> (SQL Server) of <code>LENGTH</code> (SQLite) moet heten; of hoe identifiers zoals tabel- of kolomnamen moeten worden aangehaald<code>(`</code> in MySQL, <code>"</code> in SQLite).</p>
  <p>Om het nog erger te maken, zelfs een enkele query in een enkel dialect kan verschillend verwerkt worden omdat de onderliggende databases verschillende architecturen kunnen hebben. Het PostgreSQL dialect kan bijvoorbeeld gebruikt worden op databases die verdeeld zijn over veel verschillende fysieke machines, en databases die bestaan uit een enkel bestand. Dit betekent dat de mentale modellen die we hier ontwikkelen slechts een hulpmiddel zijn. Ze weerspiegelen misschien niet precies wat de database doet.</p>
  <p>We hebben SQLite gekozen, wat zowel een dialect als een implementatie is, omdat het een van de meest gebruikte databases is. We hebben ook geprobeerd ons te richten op de kernfunctionaliteit en het mentale model van SQL in plaats van op onderscheidende onderdelen van SQLite. Met een robuust mentaal model is het eenvoudig om te wisselen tussen SQL-dialecten en -databases.
  </p>
</div>

<br>
<a name="recap"></a>
## Conclusie en samenvatting
Laten we wat we tot nu toe geleerd hebben gebruiken om onze taak te voltooien:
<sql-exercise data-question="Find the proportion of inmates with claims of innocence in their last statements." data-comment="To do decimal division, ensure that one of the numbers is a decimal by multiplying it by 1.0. Use <code>LIKE '%innocent%'</code> to find claims of innocence." data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"></sql-exercise>

Deze methode voor het vinden van onschuldclaims is weliswaar nogal onnauwkeurig omdat onschuld kan worden uitgedrukt in andere termen zoals "niet schuldig". Desondanks vermoed ik dat het echte aantal onderschat wordt en waarschijnlijk van de juiste orde van grootte is. De vraag waar we dan nog mee zitten is of we bereid zijn om de mogelijkheid te accepteren dat tot 5% procent van de mensen die we executeren daadwerkelijk onschuldig is. ([Paul Graham is dat niet.](http://paulgraham.com/prop62.html))

To recap, we've moved from row-level operations in the previous section, to using aggregate functions on multiple rows in the dataset. This has opened up an avenue to study system-level behavior. In the next section, we'll learn to apply aggregate functions on multiple subgroups of the dataset using the `GROUP BY` block.
