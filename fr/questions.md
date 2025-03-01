---
layout: fr_tutorial
title: Les remarques finales et les questions défi
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## Les remarques finales

Merci d’avoir suivi jusqu’à la fin! J’espère que ce fut une lecture agréable et éclairante.

À ce stade, nous avons couvert la plupart des commandes et fonctions SQL importantes, mais j’espère que les plus grands points seront les techniques et l’heuristique pour penser aux requêtes. Parmi les plus importantes, on peut citer :

 - <p>Comparer la forme des tableaux disponibles avec le résultat souhaité pour décider de l’agrégation à faire.</p>
 - <p>Examiner où se trouve l’information dont nous avons besoin. Est-ce dans une ligne adjacente? Ou un groupe? Ou tout l’ensemble de données ?</p>
 - <p>Interprétation des requêtes dans la bonne structure logique. Par exemple, voir les clauses comme étant essentiellement vrai ou faux; voir <code>&lt;table1&gt; JOIN &lt;table2&gt; ON ...</code> comme une grande table.</p>

D’aller plus loin dans son apprentissage de SQL, il vaut probablement la peine d’examiner les window functions (fonctions de fenêtrage) et les expressions courantes des tables. Vous pouvez reproduire leur comportement avec les techniques que vous avez apprises ici, mais elles facilitent la vie et vous présentent un nouveau paradigme précieux. J’ai omis ces concepts parce qu’[au moment de la rédaction SQLite ne supportait pas les fonctions de fenêtre](https://www.sqlite.org/windowfunctions.html#history), et je voulais éviter la complexité d’une nouvelle base de données et du dialecte SQL.

Jusqu’à présent, nous n’avons appris que la consommation de données (l’exécution). Il existe tout un autre domaine du SQL pour manipuler les données. Ces actions concernent la création de tables, l’insertion et la suppression de données. Comprendre ces concepts peut être utile même si vous n’administrez pas de bases de données, car cela vous aide à comprendre, entre autres choses, pourquoi les tables sont structurées comme elles le sont.

Plus important encore, vous avez besoin de beaucoup de pratique pour devenir efficace sur les problèmes du monde réel. La section suivante présente quelques exercices mais la difficulté augmente fortement. Vous voudrez peut-être aller dans le monde et pratiquer ce que nous avons couvert jusqu’à présent et revenir quand vous serez prêt.

<br />
<a name="challenge_questions"></a>
## Les questions de défi
Les exercices des chapitres précédents ont été conçus pour réduire la complexité afin de créer un environnement propice. Ce chapitre marque la frontière dans le monde sauvage des problèmes SQL. L’idée ici est d’essayer par un baptême du feu – les questions sont optimisées pour l’utilité plutôt que pour la facilité de l’apprentissage. Même les rédacteurs SQL expérimentés peuvent avoir de la difficulté; et il y a beaucoup de valeur dans cette lutte.

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>La participation collective</H3>
  <p>De bons problèmes font ou cassent un tutoriel. Si vous avez une idée pour un nouveau problème ou section, je serais heureux de vous aider à le poster ici avec crédit complet allant à vous. Envoyez-moi un courriel à <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> ou soumettez <a href="https://github.com/zichongkao/selectstarsql">une demande de tirage</a>. 
  Gardez à l'esprit  que les bons problèmes ne sont pas nécessairement difficiles : ils mettent des techniques qui ont de nombreuses applications.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Le coparrainage du Sénat sur le jeu de données
### Par Kao
Dans cette section, nous présentons un nouvel ensemble de données provenant de la 114e session du Congrès (2015-2016) [compilé par James Fowler et d’autres](http://jhfowler.ucsd.edu/cosponsorship.htm). J’ai retravaillé l’ensemble de données pour nous permettre d’étudier les relations entre les sénateurs qui coparrainent.

Le sénateur qui présente le projet de loi est appelé le « parrain ». D’autres sénateurs peuvent manifester leur appui en coparrainant le projet de loi. Les cocommanditaires au moment de l’introduction sont appelés « cocommanditaires originaux » [(source)](https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee). Chaque ligne du tableau indique le projet de loi, le parrain, un coparrain original et les États représentés par les sénateurs. Notez qu’un projet de loi peut être coparrainé par plusieurs personnes.

<sql-exercise
  data-question="Jetez un coup d’œil à l’ensemble de données."
  data-comment="À 15 000 lignes, il est un peu plus grand que le jeu de données du Texas, donc mieux vaut éviter d’imprimer tout."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="Trouvez le sénateur le plus connecté. C’est-à-dire celui qui a les coparrainages les plus mutuels."
  data-comment="Un coparrainage mutuel désigne deux sénateurs qui ont chacun coparrainé un projet de loi parrainé par l’autre. Même si deux sénateurs ont collaboré à de nombreux projets de loi, la relation compte toujours comme un seul."
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
  data-question="Trouvez maintenant le sénateur le plus connecté de chaque État."
  data-comment="Si plusieurs sénateurs sont en tête, afficher les deux. Renvoyez les colonnes correspondant au nombre de l’état, du sénateur et du coparrainage mutuel."
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
  data-question="Trouvez les sénateurs qui ont coparrainé mais n’ont pas parrainé des projets de loi."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
 ON c1.cosponsor_name = c2.sponsor_name
 -- Ce lien identifie les coparrainés
 -- qui ont parrainé des projets de loi
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + NULL est une astuce standard pour exclure
-- les lignes. C’est plus efficace que WHERE ... NOT IN.
"
  ></sql-exercise>

