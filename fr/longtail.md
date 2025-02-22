---
layout: fr_tutorial
title: La longue traîne
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>
## Les longues traînes
Les longues traînes se rapportent à un petit nombre d’échantillons qui se produisent un grand nombre de fois. Lorsque nous les traçons, ils forment une petite bande à droite du centre de masse qui ressemble à une queue. Ils indiquent la présence de cas exceptionnels dont les comportements inhabituels peuvent nous intéresser. 
<img src="/imgs/execution_tail.png"> 
Dans le contexte des exécutions au Texas, la longue traîne fait référence à un petit nombre de comtés qui ont été connus pour effectuer un grand nombre d’exécutions.

Trouvons le pourcentage d’exécutions de chaque comté pour pouvoir choisir ceux qui sont dans la traîne.

Comme on le voit de plus en plus, la forme des tableaux nous en dit beaucoup sur les opérations que nous devons effectuer. (Cela est analogue à l’analyse dimensionnelle en physique.) Dans ce cas, nous pouvons constater que les méthodes que nous avons décrites jusqu’à présent sont inadéquates : le chapitre de [Beazley](beazley.html) traitait des lignes individuelles de données, mais il est clair que nous devons faire une certaine agrégation pour trouver des données au niveau du comté. Le chapitre [Les prétentions d’innocence](innocence.html) nous a appris l’agrégation, mais ces fonctions finiraient par regrouper l’ensemble de données dans une seule ligne alors que nous voulons vraiment une ligne par comté.

<br>
<a name="groupby"></a>
## Le bloc GROUP BY
C’est là que le bloc `GROUP BY` « litt. grouper par » entre en jeu. Il nous permet de diviser l’ensemble de données et d’appliquer des fonctions agrégées à l’intérieur de chaque groupe, ce qui donne une ligne par groupe. Sa forme la plus basique est <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> et vient après le bloc `WHERE`.

<sql-exercise
  data-question="Cette requête extrait les comptes d’exécution par comté."
  data-default-text="SELECT
  county,
  COUNT(*) AS county_executions
FROM executions
GROUP BY county"></sql-exercise>

Si vous vous souvenez d'<a href='innocence.html#strange'>Une requête bizarre</a>, la sonnette d’alarme est tirée. Ne venons-nous pas d’apprendre à ne pas mélanger les colonnes agrégées et non agrégées? La différence ici est que les colonnes de regroupement sont les seules colonnes autorisées à être non agrégées. Après tout, toutes les lignes de ce groupe doivent avoir les mêmes valeurs sur ces colonnes afin qu’il n’y ait aucune ambiguïté dans la valeur qui doit être retournée.

Peut-être que vous avez aussi remarqué notre utilisation de `AS`. C’est ce que nous appelons « aliasing ». Dans le bloc `SELECT`, <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> fournit un alias auquel on peut faire référence plus tard dans la requête. Cela nous évite de réécrire des expressions longues, et nous permet de clarifier le but de l’expression.

<sql-exercise
  data-question="Cette requête compte les exécutions avec et sans les dernières instructions. Modifiez-la pour la diviser davantage par comté."
  data-comment="La clause <code>last_statement IS NOT NULL</code> agit comme une variable indicateur où 1 signifie vrai et 0 signifie faux."
  data-default-text="SELECT
  last_statement IS NOT NULL AS has_last_statement,
  COUNT(*)
FROM executions
GROUP BY has_last_statement"
  data-solution="SELECT
  last_statement IS NOT NULL AS has_last_statement,
  county,
  COUNT(*)
FROM executions
GROUP BY has_last_statement, county"
  ></sql-exercise>

<br>
<a name="having"></a>
## Le bloc HAVING
L’exercice ci-dessous illustre le filtrage par le bloc `WHERE` s’est passé avant le regroupement et l’agrégation. Ceci est reflété dans l’ordre de la syntaxe puisque le bloc `WHERE` précède toujours le bloc `GROUP BY`.

<sql-exercise
  data-question="Compter le nombre de détenus âgés de 50 ans ou plus qui ont été exécutés dans chaque comté."
  data-comment="Vous devriez pouvoir le faire en utilisant <code>CASE WHEN</code>, , mais essayez d’utiliser le bloc <code>WHERE</code> block ici."
  data-default-text=""
  data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"
  ></sql-exercise>

Tout cela est bien, mais que se passe-t-il si nous voulons filtrer sur le résultat du regroupement et de l’agrégation ? Nous ne pouvons certainement pas sauter dans le futur et y puiser des informations. Pour résoudre ce problème, nous utilisons `HAVING` (« litt. ayant »).

<sql-exercise
  data-question="Énumérer les comtés où plus de deux détenus âgés de 50 ans ou plus ont été exécutés."
  data-comment="Cela s’appuie sur l’exercice précédent. Nous avons besoin d’un filtre supplémentaire — l’un qui utilise le résultat de l’agrégation. Cela signifie qu’il ne peut pas exister dans le bloc <code>WHERE</code> parce que ces filtres sont exécutés avant l’agrégation. Recherchez le bloc <a href='https://www.w3schools.com/sql/sql_having.asp'><code>HAVING</code></a>.Vous pouvez le considérer comme un bloc <code>WHERE</code> post-agrégation."
  data-default-text=""
  data-solution="
SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(*) > 2"
  ></sql-exercise>

<br>
## Pratiquer
Ce quiz est conçu pour remettre en question votre compréhension. Lisez les explications même si vous avez tout compris.

<sql-quiz
  data-title="Sélectionnez les déclarations qui sont vraies."
  data-description="Cette requête indique le nombre de détenus de chaque comté et la tranche d’âge de 10 ans. <pre>
SELECT
  county,
  ex_age/10 AS decade_age,
  COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
  <sql-quiz-option
    data-value="valid"
    data-statement="La requête est valide (c.-à-d. ne lancera pas d’erreur lors de l’exécution)."
    data-hint="Le <code>ex_age/10</code> vous a mis dedans ? Le regroupement par colonnes transformées est également acceptable."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="gran"
    data-statement="La requête renverrait plus de lignes si nous utilisions <code>ex_age</code> au lieu de <code>ex_age/10</code>."
    data-hint="Rappelez-vous que <code>ex_age/10</code> fait une division en nombres entiers qui arrondit tous les âges. Cela produit moins de groupes uniques."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="La sortie aura autant de lignes qu’il y a des combinaisons uniques de comtés et d’âges dans l’ensemble de données."
    data-hint="Cela est exact."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="La sortie aura un groupe ('Bexar', 6) même si aucun détenu du comté de Bexar n’était entre 60 et 69 au moment de l’exécution."
    data-hint="Le bloc <code>GROUP BY</code> trouve toutes les combinaisons dans <i>l’ensemble de données</i> plutôt que toutes les combinaisons théoriquement possibles."
    data-value="abstract_cartesian"></sql-quiz-option>
  <sql-quiz-option
    data-statement="La sortie aura une valeur de county différente pour chaque ligne qu’elle renvoie."
    data-hint="Cela ne serait vrai que si <code>county</code> était la seule colonne de regroupement decade_ages."
    data-value="one_col_diff"></sql-quiz-option>
  <sql-quiz-option
    data-statement="La sortie peut avoir des groupes dont le nombre est 0."
    data-hint="Cette question est semblable à la question ('Bexar', 6). S’il n’y a pas de lignes avec ('Bexar', 6), le groupe ne se montrera même pas."
    data-value="count_zero"></sql-quiz-option>
  <sql-quiz-option
    data-statement="La requête serait valide même si nous ne spécifions pas <code>county</code> dans le bloc <code>SELECT</code>."
    data-hint="Les colonnes de regroupement ne doivent pas nécessairement se trouver dans le bloc <code>SELECT</code>. Ce serait valide, mais cela n’a pas beaucoup de sens parce que nous ne saurions pas quels comptes sont pour quel comté."
    data-value="missing_gp_col"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="Il est raisonnable d’ajouter <code>last_name</code> au bloc <code>SELECT</code> même sans le grouper."
    data-hint="Même si elle serait valide (dans SQLite) pour les raisons énoncées dans <a href='innocence.html#strange'>Une requête bizarre</a>, il est mal en forme d’avoir des colonnes non agrégées et non groupées dans le bloc <code>SELECT</code>."
    data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>

<sql-exercise
  data-question="Énumérer tous les comtés distincts dans l’ensemble de données."
  data-comment="Nous avons fait cela dans le chapitre précédent en utilisant la commande <code>SELECT DISTINCT</code>. Cette fois, restez avec <code>SELECT</code> et utilisez <code>GROUP BY</code>."
  data-default-text=""
  data-solution="SELECT county FROM executions GROUP BY county"
  ></sql-exercise>

<br>
<a name="nested"></a>
## Les requêtes imbriquées
Maintenant, vous pouvez demander, ne serions-nous pas fini si nous pouvions simplement exécuter quelque chose comme ceci?

    SELECT
      county,
      PERCENT_COUNT(*)
    FROM executions
    GROUP BY county

Les pourcentages sont une mesure si commune qu’une telle fonction ne devrait pas exister? Malheureusement non, et peut-être pour une bonne raison : Une telle fonction devrait agréger à la fois dans les groupes (pour obtenir le numérateur) et dans tout l’ensemble de données (pour obtenir le dénominateur). Mais chaque requête a un bloc `GROUP BY` ou pas. Donc ce dont nous avons vraiment besoin, c’est de deux requêtes séparées, l’une qui s’agrège avec `GROUP BY` et l’autre qui s’agrège sans GROUP BY. Nous pouvons ensuite les combiner en utilisant une technique appelée « imbrication ».

Voici un exemple de fonctionnement de l'imbrication . Les parenthèses sont importantes pour délimiter la frontière entre la requête interne et la requête externe :

<sql-exercise
  data-question="Trouver le prénom et le nom du détenu dont les dernières paroles sont les plus longues (par nombre de caractères)."
  data-comment="Écrire dans une requête appropriée pour imbriquer dans &lt;<code>length-of-longest-last-statement</code>(« la longueur de la plus longue dernières paroles »)&gt;."
  data-default-text="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (<length-of-longest-last-statement>)"
  data-solution="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (SELECT MAX(LENGTH(last_statement))
     FROM executions)"></sql-exercise>

Pour répéter, l’imbrication est nécessaire ici parce que dans la clause `WHERE`, comme l’ordinateur inspecte une ligne pour décider si sa dernière instruction est de la bonne longueur, il ne peut pas regarder à l’extérieur pour déterminer la longueur maximale sur tout le jeu de données. Nous devons trouver la longueur maximale séparément et l’intégrer dans la clause. Appliquons maintenant le même concept pour trouver le pourcentage d’exécutions de chaque comté.

<sql-exercise
  data-question="Insérer la requête &lt;<code>count-of-all-rows</code>&gt; pour trouver le pourcentage d’exécutions de chaque comté."
  data-comment="<code>100.0</code> est une décimale, nous pouvons donc obtenir des pourcentages décimaux."
  data-default-text="SELECT
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

J’ai ajouté discrètement un bloc `ORDER BY`. Son format est <code class="codeblock">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> et il peut être modifié en ajoutant `DESC` si vous ne voulez pas l’ordre croissant par défaut.

<br>
<a name="harris"></a>
## Le comté de Harris

Est-ce surprenant que Harris (qui abrite la ville de Houston), Dallas, Bexar et Tarrant représentent environ 50% de toutes les exécutions au Texas? Peut-être que oui, surtout si nous partons de l’hypothèse que les exécutions devraient être réparties uniformément entre les comtés. Mais une meilleure première approximation est que les exécutions sont distribuées en fonction de la répartition de la population. Le [recensement du Texas de 2010](https://www.tsl.texas.gov/ref/abouttx/popcnty12010.html) montre que les 4 comtés avaient une population de 10,0 M soit 40,0% de la population du Texas (25,1 M). Cela rend la constatation un peu moins surprenante.

Mais en réduisant encore la queue, nous réalisons que le comté de Harris représente la majeure partie du delta. Il ne compte que 16,4 % de la population, mais 23,1 % des exécutions, soit près de 50 % de plus qu’il n’est censé le faire.

De nombreuses études ont examiné les raisons pour lesquelles le comté de Harris a été si prolifique et plusieurs facteurs ont été suggérés :
 - <p>Les poursuites ont été <a href="https://web.archive.org/web/20191227235319/https://www.citylab.com/equity/2014/09/one-texas-county-is-responsible-for-most-of-the-executions-in-the-entire-us/380705/">organisées et bien financées</a>, tandis que les défenses ont été financées par les tribunaux et mal encouragées. <a href="https://houstonlawreview.org/article/3874.pdf">(Source, voir p.49)</a>
 - <p>Le vieux procureur de district était <a href="https://www.chron.com/news/houston-texas/article/Former-DA-ran-powerful-death-penalty-machine-1833545.php">déterminé et enthousiaste à l’idée d’appliquer la peine de mort</a>.
 - <p>Les juges au Texas sont élus et la population a soutenu la peine de mort. <a href="https://priceonomics.com/why-has-texas-executed-so-many-inmates/">(Source)</a>
 - <p>Les freins et contrepoids du système judiciaire du comté de Harris n’ont pas fonctionné. <a href="https://houstonlawreview.org/article/3874-the-problem-of-rubber-stamping-in-state-capital-habeas-proceedings-a-harris-county-case-study">(Source, voir p. 929)</a></p>

<br>
<a name="recap"></a>
## En résumé
Dans cette section, nous avons appris à regrouper des groupes et à utiliser l’imbrication pour utiliser la sortie d’une requête interne dans une requête externe. Ces techniques ont l’avantage très pratique de nous permettre de calculer des pourcentages.

<a name="mapreduce"></a>
<div class="sideNote">
  <h3>Le MapReduce</h3>
  <p>Un ajout intéressant est que nous venons d’apprendre à faire MapReduce en SQL. MapReduce est un célèbre paradigme de programmation qui considère les calculs comme se produisant dans une étape de mapper et réduire. Vous pouvez en apprendre plus sur le MapReduce <a href="https://stackoverflow.com/questions/28982/simple-explanation-of-mapreduce">ici</a>.</p>
  <p>Le chapitre de <a href="beazley.html">Beazley</a> était entièrement consacré au mapping, car il nous montrait comment mapper diverses opérations sur toutes les lignes. Par exemple, <code>SELECT LENGTH(last_statement) FROM executions</code> met la fonction de longueur en correspondance avec toutes les lignes. Ce chapitre nous a montré comment réduire divers groupes de données en utilisant des fonctions d’agrégation; et le chapitre précédent <a href="innocence.html">Les prétentions d’innocence</a> était juste un cas spécial dans lequel la table entière est un groupe.</p>
</div>

Dans le prochain chapitre, nous découvrirons les `JOIN`s (« joints ») qui nous permettront de travailler avec plusieurs tables.
