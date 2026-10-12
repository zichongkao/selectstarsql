---
layout: nl_tutorial
title: Slotopmerkingen en uitdagingsvragen
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## Slotopmerkingen
Bedankt dat je het tot het einde hebt volgehouden! Ik hoop dat het aangenaam en verhelderend was om te lezen.

We hebben nu de meeste belangrijke SQL-commando's en -functies behandeld, maar ik hoop dat je vooral de technieken en vuistregels om over queries na te denken zult onthouden. Enkele van de belangrijkste waren:
 - <p>De vorm van de beschikbare tabellen vergelijken met het gewenste resultaat om te bepalen welke aggregatie nodig is.</p>
 - <p>Nagaan waar de informatie die we nodig hebben zich bevindt. Zit die in een aangrenzende rij? In een groep? Of in de hele dataset?</p>
 - <p>Queries interpreteren in de juiste logische structuur. Bijvoorbeeld voorwaarden zien als in wezen waar of onwaar; <code>&lt;tabel1&gt; JOIN &lt;tabel2&gt; ON ...</code> zien als één grote tabel.</p>

Als je je SQL-opleiding wilt afronden, is het waarschijnlijk de moeite waard om je te verdiepen in windowfuncties en common table expressions. Je kunt hun gedrag nabootsen met technieken die je hier hebt geleerd, maar ze maken het leven een stuk eenvoudiger en laten je kennismaken met een waardevol nieuw paradigma. Ik heb deze concepten weggelaten omdat SQLite op het moment van schrijven [nog geen windowfuncties ondersteunde](https://www.sqlite.org/windowfunctions.html#history), en ik de complexiteit van een nieuwe database en een nieuw SQL-dialect wilde vermijden.

Tot nu toe hebben we ook alleen geleerd hoe je gegevens opvraagt (querying). Er is een heel ander deel van SQL voor het bewerken van gegevens. Dat gaat over handelingen zoals het aanmaken van tabellen en het invoegen en verwijderen van gegevens. Deze concepten begrijpen kan nuttig zijn, ook als je zelf geen databases beheert, omdat het je onder andere helpt te begrijpen waarom tabellen zijn opgebouwd zoals ze zijn.

Het belangrijkste is dat je nog veel oefening nodig hebt om echte problemen effectief te kunnen aanpakken. Het volgende gedeelte bevat een aantal oefeningen, maar de moeilijkheidsgraad neemt sterk toe. Misschien wil je eerst de wereld in om te oefenen met wat we tot nu toe hebben behandeld, en terugkomen als je er klaar voor bent.

<br />
<a name="challenge_questions"></a>
## Uitdagingsvragen
De oefeningen in de vorige hoofdstukken waren bedoeld om de complexiteit te beperken en zo een veilige leeromgeving te creëren. Dit hoofdstuk markeert de grens naar de wilde, ongetemde wereld van SQL-problemen. Het idee is een vuurdoop&mdash;de vragen zijn gekozen op hun praktisch nut in plaats van op leergemak. Zelfs ervaren SQL-schrijvers kunnen ermee worstelen; en juist in die worsteling zit veel waarde.

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>Oproep voor problemen</H3>
  <p>Goede problemen maken of breken een tutorial. Als je een idee hebt voor een nieuw probleem of een nieuw gedeelte, help ik je graag om het hier te plaatsen, met alle eer voor jou. Stuur me een e-mail op <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> of dien een <a href="https://github.com/zichongkao/selectstarsql">pull request</a> in. Onthoud dat goede problemen niet per se moeilijk zijn&mdash;ze laten technieken zien die breed toepasbaar zijn.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Dataset over cosponsorschap in de Senaat
### Geschreven door: Kao
In dit gedeelte introduceren we een nieuwe dataset over de 114e zitting van het Congres (2015-2016), <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">samengesteld door James Fowler en anderen</a>. Ik heb de dataset bewerkt zodat we de cosponsorrelaties tussen senatoren kunnen bestuderen.

De senator die een wetsvoorstel indient, wordt de "sponsor" genoemd. Andere senatoren kunnen hun steun betuigen door het wetsvoorstel te cosponsoren. Cosponsors op het moment van indiening worden "original cosponsors" genoemd (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">Bron</a>). Elke rij van de tabel toont het wetsvoorstel, de sponsor, een original cosponsor en de staten die de senatoren vertegenwoordigen. Merk op dat een wetsvoorstel meerdere cosponsors kan hebben.

<sql-exercise
  data-question="Bekijk de dataset."
  data-comment="Met 15K rijen is deze dataset iets groter dan de dataset over Texas, dus je kunt beter niet alles laten weergeven."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="Vind de senator met het grootste netwerk, dat wil zeggen degene met de meeste wederzijdse cosponsorschappen."
  data-comment="Er is sprake van wederzijds cosponsorschap als twee senatoren elk een wetsvoorstel hebben gecosponsord dat door de ander is ingediend. Ook als twee senatoren aan veel wetsvoorstellen hebben samengewerkt, telt de relatie nog steeds als één."
  data-solution="
WITH mutuals AS (
  SELECT DISTINCT
    c1.sponsor_name AS senator,
    c2.sponsor_name AS senator2
  FROM cosponsors c1
  JOIN cosponsors c2
    ON c1.sponsor_name = c2.cosponsor_name
    AND c2.sponsor_name = c1.cosponsor_name
)

SELECT senator, COUNT(*) AS mutual_count
FROM mutuals
GROUP BY senator
ORDER BY mutual_count DESC
LIMIT 1"
  ></sql-exercise>

<sql-exercise
  data-question="Vind nu per staat de senator met het grootste netwerk."
  data-comment="Als meerdere senatoren gedeeld eerste zijn, toon ze dan allemaal. Geef kolommen terug voor de staat, de senator en het aantal wederzijdse cosponsorschappen."
  data-solution="
WITH mutual_counts AS (
  SELECT
    senator, state, COUNT(*) AS mutual_count
  FROM (
    SELECT DISTINCT
      c1.sponsor_name AS senator,
      c1.sponsor_state AS state,
      c2.sponsor_name AS senator2
    FROM cosponsors c1
    JOIN cosponsors c2
      ON c1.sponsor_name = c2.cosponsor_name
      AND c2.sponsor_name = c1.cosponsor_name
    )
  GROUP BY senator, state
),

state_max AS (
  SELECT
    state,
    MAX(mutual_count) AS max_mutual_count
  FROM mutual_counts
  GROUP BY state
)

SELECT
  mutual_counts.state,
  mutual_counts.senator,
  mutual_counts.mutual_count
FROM mutual_counts
JOIN state_max
  ON mutual_counts.state = state_max.state
  AND mutual_counts.mutual_count = state_max.max_mutual_count
"
  ></sql-exercise>

<sql-exercise
  data-question="Vind de senatoren die wel wetsvoorstellen hebben gecosponsord, maar zelf nooit een wetsvoorstel hebben ingediend."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
 ON c1.cosponsor_name = c2.sponsor_name
 -- This join identifies cosponsors
 -- who have sponsored bills
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + NULL is a standard trick for excluding
-- rows. It's more efficient than WHERE ... NOT IN.
"
  ></sql-exercise>
