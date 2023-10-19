---
layout: nl_tutorial
title: Closing Remarks and Challenge Questions
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## Slotopmerkingen
Bedankt voor het blijven hangen tot het einde! Ik hoop dat het aangenaam en verhelderend was om te lezen.

Op dit punt hebben we de meeste belangrijke SQL-commando's en -functies behandeld, maar ik hoop dat je vooral de technieken en heuristieken voor het bedenken van queries hebt geleerd. Enkele van de belangrijkste waren:
- <p>De vorm van beschikbare tabellen vergelijken met het gewenste resultaat om te beslissen welke aggregatie we moeten doen.</p>
- <p>Onderzoeken waar de informatie die we nodig hebben zich bevindt. Zit het in een aangrenzende rij? Of in een groep? Of in de hele dataset?</p>
- <p>Queries interpreteren in de juiste logische structuur. Bijvoorbeeld, clausules zien als in wezen waar of onwaar; <code>&lt;table1&gt; JOIN &lt;table2&gt; ON ...</code> zien als een grote tabel.</p>

Vooruitkijkend is het, om je SQL-opleiding af te ronden, waarschijnlijk de moeite waard om je te verdiepen in windowfuncties en algemene tabeluitdrukkingen. Je kunt hun gedrag repliceren met technieken die je hier hebt geleerd, maar ze maken het leven een stuk eenvoudiger en introduceren je in een waardevol nieuw paradigma. Ik heb deze concepten weggelaten omdat op het moment van schrijven SQLite nog geen [windowfuncties ondersteunde](https://www.sqlite.org/windowfunctions.html#history) en ik de complexiteit van een nieuwe database en SQL-dialect wilde vermijden.

Tot nu toe hebben we ook alleen maar geleerd over het consumeren van gegevens (query's). Er is een heel ander gebied van SQL voor het manipuleren van gegevens. Deze gaan over acties zoals het aanmaken van tabellen en het invoegen en verwijderen van gegevens. Het begrijpen van deze concepten kan nuttig zijn, zelfs als je geen databases beheert, omdat het je onder andere helpt te begrijpen waarom tabellen zijn gestructureerd zoals ze zijn.

Het belangrijkste is dat je nog steeds veel oefening nodig hebt om effectief te worden in echte wereldproblemen. Het volgende hoofdstuk geeft een aantal oefeningen, maar de moeilijkheidsgraad neemt sterk toe. Je zou de wereld in kunnen gaan en oefenen wat we tot nu toe behandeld hebben en terugkomen als je er klaar voor bent.

<br/>
<a name="challenge_questions"></a>
## Uitdagingsvragen
De oefeningen in de vorige hoofdstukken waren bedoeld om de complexiteit te verminderen en een stimulerende omgeving te creëren. Dit hoofdstuk markeert de grens naar de wilde, ongetemde wereld van SQL problemen. Het idee hier is trial-by-fire&mdash;de vragen zijn geoptimaliseerd voor bruikbaarheid in plaats van leergemak. Zelfs ervaren SQL schrijvers kunnen worstelen; en er zit veel waarde in deze worsteling.

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>Oproep voor Problemen</H3>
  <p>Goede problemen maken of breken een tutorial. Als je een idee hebt voor een nieuw probleem of een nieuwe sectie, dan help ik je graag om het hier te plaatsen met volledige eer voor jou. Stuur een e-mail naar <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> of dien een <a href="https://github.com/zichongkao/selectstarsql">pull-verzoek</a> in. Onthoud dat goede problemen niet per se moeilijk zijn&mdash;ze laten technieken zien die brede toepassingen hebben.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Senaat Cosponsorschap Dataset
### Geschreven door: Kao
In dit gedeelte introduceren we een nieuwe dataset van de 114e sessie van het Congres (2015-2016) <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">, samengesteld door James Fowler en anderen</a>. Ik heb de dataset bewerkt zodat we de cosponsorrelaties tussen senatoren kunnen bestuderen.

De senator die het wetsvoorstel indient, wordt de "sponsor" genoemd. Andere senatoren kunnen hun steun betuigen door het wetsvoorstel te steunen. Cosponsors op het moment van de introductie worden "oorspronkelijke cosponsors" genoemd([Bron](https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee)). Elke rij van de tabel toont het wetsvoorstel, de sponsor, een oorspronkelijke mede-indiener en de staten die de senatoren vertegenwoordigen. Merk op dat er meerdere mede-indieners van een wetsvoorstel kunnen zijn.

<sql-exercise
  data-question="Kijk eens naar de dataset."
  data-comment="Met 15K rijen is het een beetje groter dan de Texas dataset, dus het beste is om niet alles uit te printen."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
></sql-exercise>

<sql-exercise
  data-question="Vind de senator met het meeste netwerk. Dat wil zeggen, degene met de meeste wederzijdse cosponsorschappen."
  data-comment="Een wederzijdse cosponsorschap verwijst naar twee senatoren die elk een wetsvoorstel van de ander hebben gesponsord. Zelfs als een paar senatoren hebben samengewerkt aan veel wetsvoorstellen, telt de relatie nog steeds als één." data-solution="
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
  data-question="Vind nu de senator met het meeste netwerk uit elke staat."
  data-comment="Als er meerdere senatoren gelijk staan, toon ze dan allebei. Geef kolommen die overeenkomen met de staat, senator en het aantal wederzijdse sponsorschappen."
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
    staat,
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
  data-question="Vind de senatoren die wetsvoorstellen sponsorden maar niet sponsorden."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
  ON c1.cosponsor_name = c2.sponsor_name
  -- Deze join identificeert cosponsors
  -- die wetsvoorstellen hebben gesponsord
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + NULL is een standaard truc om
-- rijen uit te sluiten. Het is efficiënter dan WHERE ... NOT IN.
"
  ></sql-exercise>
