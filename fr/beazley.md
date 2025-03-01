---
layout: fr_tutorial
title: Les dernières paroles de Beazley
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>
## Le cas de Beazley
En 1994, Napoleon Beazley a abattu John Luttig, un homme d’affaires de 63 ans, dans son garage alors qu’il tentait de voler la voiture de la famille de Luttig. L’affaire de Beazley a déclenché un débat féroce sur la peine de mort pour les délinquants juvéniles parce qu’il était presque âgé de 18 ans au moment des faits. 3 ans après l'exécution de Beazley, la Cour suprême a interdit l'exécution des délinquants âgés de moins de 18 ans au moment des faits ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons)).

Cette affaire a également été marquée par le fait que la victime était le père d’un juge fédéral, John Michael Luttig. Lors des recours devant la Cour suprême, trois des neuf juges se sont récusés en raison de leurs liens personnels avec le juge Luttig, de sorte qu’il n’en restait plus que six pour examiner l’affaire.

Napoleon Beazley a fait des derniers mots passionnément dans lesquels il affirmait qu’œil pour œil ne constituait pas la justice. Notre tâche est de retrouver ces mots dans la base de données. 

<br>
<a name="first"></a>
## Une première requête SQL
<sql-exercise
  data-question="Exécutez cette requête pour trouver les premières lignes de la table ‘exécutions’."
  data-comment="L'affichage de quelques lignes est un bon moyen de découvrir les colonnes d'une table. Essayez de vous souvenir du nom des colonnes pour une utilisation ultérieure."
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

De droite à gauche, les colonnes sont :
- first_name (prénom)
- last_name (nom)
- ex_number (numéro d'exécution)
- ex_age (âge à son exécution)
- ex_date (date de l'exécution)
- last_statement (les dernières paroles)

La requête SQL peut ressembler une phrase mundane mais il faut que vous voyez comme trois blocs de Lego :
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
Comme pour les Lego, chaque bloc a un format fixe et les différents blocs doivent s’emboiter d’une certaine manière.

<br>
<a name="select"></a>
## Le bloc SELECT
Le bloc `SELECT` indique les colonnes que vous souhaitez afficher. Son format est <code class='codeblock'>SELECT &lt;column&gt;, &lt;column&gt;, ...</code>. Each column must be separated by a comma, but the space following the comma is optional. Chaque colonne doit être séparée par une virgule, mais l’espace suivant la virgule est facultatif. L’étoile (c.-à-d. *) est un caractère spécial qui signifie que nous voulons toutes les colonnes sur la table.

<sql-exercise
  data-question="Dans l’éditeur de code ci-dessous, réviser la requête pour sélectionner la colonne last_statement en plus des colonnes existantes."
  data-comment="Une fois que vous avez terminé, vous pouvez appuyer sur Maj+Entrée pour exécuter la requête."
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>
<div class="sideNote">
  <h3>Commentaires SQL</h3>
  <p>
    Notez que le fait de cliquer sur « Show Solution » affiche la solution dans l’éditeur précédé de <code>/*</code>. Le contenu entre <code>/*</code> et <code>*/</code> est pris comme commentaire et n’est pas exécuté en tant que code. C’est utile pour cacher temporairement le code que nous ne voulons pas exécuter. Pour exécuter la solution, supprimez ou commentez simplement votre code et décommentez la solution.
  </p>
  <p>
    `--` est une autre façon d’indiquer les commentaires. Il sert à marquer le reste d’une ligne comme commentaire. Lorsque nous avons plusieurs lignes que nous voulons commenter, `*/` est plus pratique que de préfixer `--` à chaque ligne.
  </p>
</div>

<br>
<a name="from"></a>
## Le bloc FROM
Le bloc <code>FROM</code> (litt. « de ») indique la table à laquelle on fait appel. Son format est <code class="codeblock">FROM &lt;table&gt;</code>. Il vient toujours après le bloc <code>SELECT</code>.

<sql-exercise
  data-question="Exécuter la requête et observer l’erreur qu’elle produit. Corriger la requête."
  data-comment="Prenez l’habitude d’examiner les messages d’erreur lorsque quelque chose ne va pas. Évitez le débogage par instinct ou par essais et erreurs."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

Dans l’exemple suivant, notez que nous n’avons pas besoin du bloc `FROM` block  si nous n’utilisons rien d’une table.

<sql-exercise
  data-question="Modifier la requête pour diviser 50 et 51 par 2."
  data-comment="SQL prend en charge toutes les opérations arithmétiques habituelles."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

Ne trouvez-vous pas étrange que `51 / 2` donne `25` au lieu de `25.5`? C’est parce que SQL fait la division en nombres entiers. Pour effectuer la division décimale, au moins un des opérandes doit être une décimale, par exemple `51.0 / 2`. Une astuce courante consiste à multiplier un nombre par `1.0` pour le convertir en décimal. Cela sera utile dans les chapitres suivants.

<a name="capitalization"></a>
<div class="sideNote">
  <h3>Les majuscules</h3>
  <p>Même si nous avons mis en majuscule <code>SELECT</code>, <code>FROM</code> et <code>LIMIT</code>, les commandes SQL ne sont pas sensibles à la casse. Ça se voit que l’éditeur de code les reconnaît et les formats comme une commande, peu importe la majuscule. Néanmoins, je recommande de les mettre en majuscule pour les différencier des noms de colonnes, des noms de table et des variables.</p>
  <p>Les noms de colonnes, les noms de tables et les variables ne sont pas sensibles à la casse dans cette version de SQL, bien qu’elles le soient dans beaucoup d’autres versions. Pour être sûr, je recommande de toujours supposer qu’ils sont sensibles à la casse.</p>
</div>

<a name="whitespace"></a>
<div class="sideNote">
  <h3>Des trous à compléter</h3>
  <p>Les espaces font référence aux espaces, tabulations, sauts de ligne et autres caractères qui sont rendus comme des espaces vides sur une page. Comme avec la majuscule, SQL n’est pas très sensible aux espaces tant que vous ne réduisez pas deux mots en un. Cela signifie qu’il suffit d’avoir au moins un caractère en blanc autour de chaque commande, peu importe laquelle ou combien vous utilisez. A moins que ce soit une courte requête, je préfère mettre chaque commande sur une nouvelle ligne pour améliorer la lisibilité.</p>

<sql-exercise
  data-question="Vérifier que la majuscule et les espaces donnent toujours une requête valide."
  data-comment="Karla Tucker est la premiere femme executed au Texas depuis la guerre civil américaine. On l’a mis à mort pour avoir tué deux personnes lors d’un vol de 1983."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>
</div>

<br>
<a name="where"></a>
## Le bloc WHERE
Le bloc `WHERE` (litt. « où ») nous permet de filtrer la table pour les lignes qui répondent à certaines conditions. Son format est <code class='codeblock'>WHERE &lt;clause&gt;</code> et il va toujours après le bloc `FROM`. Ici, une clause fait référence à une instruction booléen que l’ordinateur peut évaluer comme vrai ou faux comme <code>ex_number = 145</code>. Vous pouvez imaginer que l’ordinateur va passer par chaque ligne dans la table en vérifiant si la clause est vraie, et si oui, retourner la ligne.

<sql-exercise
  data-question="Trouvez le prénom et le nom ainsi que l’âge (ex_age) des détenus de 25 ans ou moins au moment de l’exécution."
  data-comment="Comme le temps moyen que les détenus passent dans le couloir de la mort avant l’exécution est de 10,26 ans, seulement 6 détenus de ce jeune ont été exécutés au Texas depuis 1976."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

Il est clair que nous pouvons utiliser des opérateurs arithmétiques comme `<` et `<=` pour construire des clauses. Il existe également une collection d’opérateurs de chaîne pour travailler avec des chaînes.

Le plus puissant est probablement `LIKE`. Il nous permet d’utiliser des caractères de remplacement tels que `%` et `_` pour correspondre à divers caractères. Par exemple, `first_name LIKE '%roy'` renvoie `true` pour les lignes avec les prénoms « roy », « Troy » et « Deroy » mais pas « royman ». Le caractère générique `_` correspond à un seul caractère, de sorte que `first_name LIKE '_roy'` ne correspond qu’à « Troy ».

<sql-exercise
    data-question="Modifiez la requête pour trouver le résultat de Raymond Landry."
    data-comment="Vous pourriez penser que ce serait facile puisque nous connaissons déjà son prénom et son nom de famille. Mais les ensembles de données sont rarement aussi propres. Utilisez l’opérateur LIKE pour ne pas avoir à connaître son nom parfaitement pour trouver la ligne."
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
  <h3>Les guillemets</h3>
  <p>En SQL, les chaînes sont indiquées par des guillemets simples. Les backticks ou les apostrophes inversées (c.-à-d. <code>`</code>) peuvent être utilisées pour indiquer les noms de colonnes et de tables. Ceci est utile lorsque le nom de la colonne ou de la table est identique à un mot-clé SQL et lorsqu’ils ont un espace. Il est possible d’avoir une base de données avec une table nommée « where » et une colonne nommée « from ». (Qui serait si cruel de faire cela?!) Vous devez faire <code>SELECT `from` FROM `where` WHERE ...</code>. Voici un autre exemple où la capitalisation des commandes SQL nous aide.</p>
</div>

Comme vous l’avez vu dans l’exercice précédent, les clauses complexes peuvent être composées de clauses simples en utilisant des opérateurs booléens tels que `NOT`, `AND` et `OR`. SQL donne la priorité à `NOT` puis `AND` et enfin `OR`. Mais si, comme moi, vous êtes trop paresseux pour vous souvenir de l’ordre des priorités, vous pouvez utiliser les parenthèses pour préciser l’ordre que vous voulez.

<sql-exercise
  data-question="Insérez une paire de parenthèses pour que cette instruction renvoie 0."
  data-comment="Ici, nous nous basons sur le fait que 1 signifie vrai et 0 signifie faux."
  data-default-text="SELECT 0 AND 0 OR 1"
  data-solution="SELECT 0 AND (0 OR 1)"
  ></sql-exercise>

Passons un quiz rapide pour renforcer votre compréhension.

<sql-quiz
  data-title="Sélectionnez les blocs <code>WHERE</code> avec des clauses valides."
  data-description="Ceux-ci sont difficiles. Même si vous avez deviné correctement, lisez les explications pour comprendre le raisonnement.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> et <code>0</code> sont les instructions booléennes les plus basiques. Ce bloc garantit qu’aucune ligne ne sera retournée."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="L’opérateur <code>==</code> vérifie l’égalité dans de nombreux autres langages de programmation mais SQL utilise <code>=</code>."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="Plusieurs noms de colonnes peuvent être utilisés dans une clause."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="L’opérateur 'supérieur ou égal à' est <code>>=</code>. L’ordre des symboles correspond à ce que vous diriez (et en anglais aussi)."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="SQL peut évaluer la valeur de vérité de presque n’importe quoi. La colonne 'ex_age' est remplie d’entiers. La règle pour les entiers est 0 est false et tout le reste est vrai, donc seules les lignes avec des âges différents de zéro seront retournées."
    data-correct="true"
    ></sql-quiz-option>
   <sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="Plus d’un caractère de remplacement est acceptable. Mais le motif doit venir après l’opérateur LIKE."
    ></sql-quiz-option>
    </sql-quiz>

Vous avez maintenant les outils nécessaires pour mener à bien notre projet.

<sql-exercise
  data-question="Trouvez les dernières paroles de Napoléon Beazley."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

N’est-il pas étonnant de voir à quel point Beazley est profond et éloquent? Rappelons-nous qu’il n’avait que 25 ans lorsqu’il a fait ces derniers mots et qu’il était en prison depuis l’âge de 18 ans.

<br>
<a name="#recap"></a>
## Récapitulatif
Le but de ce chapitre était d’introduire le <code class="codeblock">SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;clause&gt;</code>. Il nous permet de filtrer une table en faisant aller l’ordinateur ligne par ligne et choisir ceux pour lesquels la clause `WHERE` est vraie. Nous avons aussi appris à assembler des clauses assez complexes qui peuvent fonctionner sur des colonnes de chaîne, numériques et booléennes.

Jusqu’à présent, nous avons opéré au niveau des lignes, ce qui nous a limités à l’examen de points de données individuels. Dans le prochain chapitre, nous nous concentrerons sur les agrégations qui nous permettront d’étudier les phénomènes au niveau du système.
