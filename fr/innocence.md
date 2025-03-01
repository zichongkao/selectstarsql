---
layout: fr_tutorial
title: Les prétentions d’innocence
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innocence"></a>
## L'innocence possible
Opponents of the death penalty have argued that the risk of mistakenly executing an innocent person is too great a cost to bear. In this chapter, we attempt to approximate how many innocent people may have been executed.

Les opposants à la peine de mort ont fait valoir que le risque d’exécution par erreur d’une personne innocente est trop pour être supporté. Dans ce chapitre, nous essayons de déterminer approximativement le nombre d’innocents qui ont été exécutés. La principale mise en garde est qu’une affirmation d’innocence, même si elle est faite au seuil de mort, ne constitue pas l’innocence. De plus, même si le détenu est véridique, il existe de nombreuses interprétations de l’innocence : on aurait accusé le détenu d’avoir tué deux personnes mais n’en a tué qu’une seule; ou il aurait pu tuer le spectateur mais pas le policier. Ce ne sont pas seulement des caprices : au Texas, le meurtre seul ne justifie pas la peine de mort. Le détenu doit avoir commis un [capital crime](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes) comme le meurtre d’un agent de la sécurité publique ou de plusieurs personnes. Par conséquent, le détenu peut être innocent au sens strict du droit, mais peut-être pas selon les normes morales courantes.

Néanmoins, il y a encore quelque chose d’inquiétant à propos des allégations d’innocence persistant jusqu’au seuil de l’exécution alors qu’il reste peu à gagner. Notre tâche ici est de déterminer la fréquence de cette situation en calculant la proportion des dernières paroles pour lesquelles il y a une allégation d’innocence.

<br>
<a name="aggregations"></a>
## Les fonctions d'agrégation
Il y a deux chiffres dont nous avons besoin pour calculer la proportion :

&nbsp;&nbsp;**Numérateur** : Nombre d’exécutions avec allégation d’innocence.

&nbsp;&nbsp;**Dénominateur** : Nombre d’exécutions au total.

Jusqu’à présent, chaque ligne de la sortie provenait d’une seule ligne d’entrée. Cependant, nous avons ici le numérateur et le dénominateur qui nécessitent des informations provenant de plusieurs lignes d’entrée. Cela nous indique que nous devons utiliser une fonction d’agrégation. À « agréger » signifie combiner plusieurs éléments en un tout. De même, les fonctions d’agrégation <i>prennent plusieurs lignes de données et les combinent en un seul nombre.</i>


<br>
<a name="count"></a>
## La fonction COUNT
`COUNT` (litt. « compter ») est probablement la fonction d’agrégation la plus utilisée. Comme son nom l’indique, elle compte les choses ! Par exemple, <code class='codeblock'>COUNT(&lt;column&gt;)</code> renvoie le nombre de lignes non nulles dans la colonne.

<sql-exercise
  data-question="Modifier la requête pour trouver le nombre de détenus ayant fourni les derniers relevés."
  data-comment="Nous pouvons utiliser <code>COUNT</code> ici parce que les NULL sont utilisés quand il n’y a pas d’instructions."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

Comme vous pouvez le constater, la fonction `COUNT` est intrinsèquement liée au concept de NULL. Faisons une petite digression pour en apprendre davantage sur les `NULL`s.

<a name="nulls"></a>
<div class="sideNote">
  <h3>Les NULLs</h3>
  <p>En SQL, <code>NULL</code> est la valeur d’une entrée vide. Ceci est différent de la chaîne vide <code>''</code> et du nombre <code>0</code>, qui ne sont <i>pas</i> considérés comme <code>NULL</code>. Pour vérifier si une entrée est <code>NULL</code>, utilisez <code>IS</code> (litt. « est ») et <code>IS NOT</code> (litt. « n'est pas ») à la place de <code>=</code> et <code>!=</code>.</p>
  <sql-exercise
    data-question="Vérifiez que 0 et la chaîne vide ne sont pas considérés comme NULL."
    data-comment="Rappelez-vous qu’il s’agit d’une clause composée. Les deux clauses  <code>IS NOT NULL</code> doivent être vraies pour que la requête renvoie <code>true</code>."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL) "
    >
  </sql-exercise>
</div>

Avec cela, nous pouvons trouver le dénominateur de notre proportion :
<sql-exercise
  data-question="Trouvez le nombre total d’exécutions dans l’ensemble de données."
  data-comment="L’idée ici est de choisir une des colonnes dont vous êtes sûr qu’elle n’a pas des <code>NULL</code> et de la compter."
  data-default-text=""
  data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Les variations de COUNT
Jusque là tout va bien. Mais que se passe-t-il si nous ne savons pas quelles colonnes sont sans des `NULL`s? Pire encore, qu’arrive-t-il si aucune des colonnes n’est sans NULL? Il doit bien y avoir un moyen de trouver la longueur de la table !

La solution est `COUNT(*)`. Cela rappelle `SELECT *` où le `*` représente toutes les colonnes. En pratique, `COUNT(*)` compte les lignes tant qu’**une** de ses colonnes est non-null. Cela nous aide à trouver les longueurs de table car une table ne devrait pas avoir de lignes qui sont remplies des nulls.

<sql-exercise
  data-question="Vérifier que <code>COUNT(*)</code> donne le même résultat qu’avant."
  data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Une autre variation courante consiste à compter un sous-ensemble du table. Par exemple, le comptage des exécutions dans le comté de Harris. Nous pourrions exécuter `SELECT COUNT(*) FROM executions WHERE county='Harris'` qui filtre vers le bas pour un plus petit ensemble de données composé d’exécutions Harris et compte ensuite toutes les lignes. Mais si nous voulons trouver simultanément le nombre d’exécutions dans le comté de Bexar ?

La solution est d’appliquer un bloc `CASE WHEN` qui agit comme une grande instruction if-else. Il a deux formats et celui que j’aime est :

    CASE
        WHEN <clause> THEN <result>
        WHEN <clause> THEN <result>
        ...
        ELSE <result>
    END

C’est certes l’une des parties les plus maladroites de SQL. Une erreur courante est de rater la commande `END` (litt. « finir ») et la condition `ELSE` (litt. « autrement ») qui sont les fourre-tout dans le cas où toutes les clauses précédentes sont fausses. Rappelez-vous également du chapitre précédent que les clauses sont des expressions qui peuvent être évaluées comme étant vraies ou fausses. Cela rend important de penser à la valeur booléenne de ce que vous y mettez.


<sql-exercise
  data-question="Cette requête compte le nombre d’exécutions des comtés de Harris et de Bexar. Remplacer les <code>SUM</code>s par des <code>COUNT</code>s et modifier les blocs <code>CASE WHEN</code> pour que la requête fonctionne toujours."
  data-comment="Changer  <code>SUM</code> pour <code>COUNT</code> n’est pas suffisant car <code>COUNT</code> compte toujours le 0 puisque 0 est non-null."
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
## Pratiquer

<sql-exercise
  data-question="Déterminer combien de détenus avaient plus de 50 ans au moment de l’exécution."
  data-comment="Cela illustre que le bloc <code>WHERE</code> filtre avant l’agrégation."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Trouver le nombre de détenus qui ont refusé de faire les dernières paroles."
  data-comment="Pour aller plus loin, essayez de le faire de 3 façons :<br> 
  1) Avec un bloc <code>WHERE</code><br> 
  2) Avec les blocs <code>COUNT</code> et <code>CASE WHEN</code><br> 
  3) Avec deux fonctions <code>COUNT</code>."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

Il est utile de prendre du recul et de réfléchir aux différentes façons dont l’ordinateur a traité ces trois requêtes. La version `WHERE` a filtré vers une petite table avant de l’agréger, tandis que dans les deux autres instructions, elle devait regarder la table complète. Dans la version `COUNT + CASE` WHEN, il n’a dû passer qu’une seule fois, alors que la version double `COUNT` l’a fait passer deux fois. Donc même si la sortie était identique, les performances étaient probablement meilleures dans la première version et pires dans la troisième.

<sql-exercise
  data-question="Déterminer l’âge minimum, maximum et moyen des détenus au moment de l’exécution."
  data-comment="Utiliser les fonctions d’agrégation <code>MIN</code>, <code>MAX</code>, and <code>AVG</code>."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>
<div class="sideNote">
  <h3>Recherche de documentation</h3>
  <p>On n’a pas conçu ce livre pour être une référence complète du langage SQL. Pour cela, vous devrez chercher d’autres ressources en ligne. C’est une compétence en soi, et qui vaut la peine d’être maîtrisée parce que vous allez chercher de la documentation des années après avoir acquis une familiarité avec la langue.</p>
  <p>La bonne nouvelle est qu’avec les modèles mentaux que vous apprendrez dans ce livre, les recherches devraient être rapides et sans peine car vous ne ferez que vérifier des détails comme si la fonction s’appelle <code>AVERAGE</code> ou <code>AVG</code> au lieu de déterminer quelle approche prendre.</p>
  <p>Pour les recherches, j’utilise souvent <a href="https://www.w3schools.com/sql/default.asp">W3 Schools</a>, Stack Overflow et la documentation officielle <a href="http://sqlite.org">SQLite</a>.</p>
</div>

<sql-exercise
  data-question="Trouver la longueur moyenne de la phrase (basée sur le nombre de caractères) des dernières instructions dans le jeu de données."
  data-comment='Cet exercice illustre que vous pouvez composer des fonctions. Consultez la <a href="http://sqlite.org/lang_corefunc.html">documentation</a> pour déterminer quelle fonction renvoie le nombre de caractères dans une chaîne.'
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="Énumérer tous les comtés dans l’ensemble de données sans duplication."
  data-comment="Nous pouvons obtenir des entrées uniques en utilisant <code>SELECT DISTINCT</code>. Voir la <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentation.</a>"
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` n’est pas vraiment une fonction d’agrégation car elle ne renvoie pas un seul nombre et parce qu’elle fonctionne sur la sortie de la requête plutôt que sur la table sous-jacente. Néanmoins, je l’ai inclus ici parce qu’il partage une caractéristique commune de fonctionnement sur plusieurs lignes.

<br>
<a name="strange"></a>
## Une requête bizarre
Avant de conclure, jetons un coup d’œil à cette requête :<br> `SELECT first_name, COUNT(*) FROM executions`.

Ça fait bizarre n'est-ce pas ? Si vous avez un bon modèle mental d'agrégation, ça devrait ! `COUNT(*)` tente de renvoyer une seule entrée correspondant à la longueur de la table d’exécution. La colonne `first_name` essaie de renvoyer une entrée pour chaque ligne. Est-ce que l’ordinateur doit renvoyer une ou plusieurs lignes? S’il en renvoie une, quel `first_name` doit‐il choisir? Si elle renvoie plusieurs, est-ce qu’elle doit répliquer le résultat `COUNT(*)` sur toutes les lignes? Les formes de la sortie ne correspondent pas !

<sql-exercise
  data-question="Essayons quand même et voyons ce qui se passe."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

En pratique, les bases de données essaient de renvoyer quelque chose de sensé même si vous passez dans le non-sens. Dans ce cas, notre base de données choisit le premier prénom (first name) à partir de la dernière entrée de notre table. Puisque notre tableau est en ordre chronologique inverse, la dernière entrée est Charlie Brooks Jr., la première personne exécutée depuis que la Cour suprême a levé l’interdiction de la peine de mort. Différentes bases de données traiteront ce cas différemment, il est donc préférable de ne pas compter sur leur comportement par défaut. Si vous savez que vous voulez la dernière entrée, il faut que vous la trouviez explicite. Beaucoup de dialectes SQL ont une fonction d’agrégation `LAST` (litt. « dernière ») qui rend ceci trivial. Malheureusement SQLite ne le fait pas, donc une solution de contournement est nécessaire.

<a name="dialects"></a>
<div class="sideNote">
  <h3>Les dialectes SQL et les bases de données</h3>
  <p>Bien que nous ayons appelé cela un livre sur SQL, si nous voulons être pédants c’est vraiment un livre sur <i>SQLite</i>. En effet, le SQL est un concept imaginaire : un idéal platonique. En réalité, il n’existe que des dialectes qui tentent de se conformer aux spécifications du SQL.</p>
  <p>SQL est également sous-spécifié, c’est-à-dire que certaines fonctionnalités ne sont pas spécifiées par les normes. Par exemple, les normes ne disent pas si la fonction de recherche de longueur de chaîne doit être appelée <code>LEN</code> (SQL Server) ou <code>LENGTH</code> (SQLite); ni comment des identificateurs comme les noms de table ou de colonne doivent être mis en guillemets (<code>`</code> dans MySQL, <code>"</code> dans SQLite)</p>
  <p>Pour aggraver les choses, même une seule requête dans un seul dialecte peut être traitée différemment parce que les bases de données sous-jacentes peuvent avoir des architectures différentes. Par exemple, le dialecte PostgreSQL peut être utilisé sur des bases de données distribuées sur plusieurs machines physiques différentes, et celles qui ne sont constituées que d’un seul fichier. Cela signifie que les modèles mentaux que nous développons ici ne sont qu’une béquille. Ils peuvent ne pas refléter exactement ce que fait la base de données.</p>
  <p>Nous avons choisi SQLite, qui est à la fois un dialecte et une implémentation, car c’est l’une des bases de données les plus courantes. Nous avons également essayé de nous concentrer sur les fonctionnalités de base et le modèle mental de SQL plutôt que sur des parties distinctes de SQLite. Avec un modèle mental robuste en place, il est facile de basculer entre les dialectes SQL et les bases de données.</p>
</div>

<br>
<a name="recap"></a>
## Les conclusions et le résumé
Utilisons ce que nous avons appris jusqu’à présent pour accomplir notre tâche :
<sql-exercise
  data-question="Déterminer la proportion de détenus qui ont affirmé être innocents dans leurs dernières paroles."
  data-comment="Pour effectuer la division décimale, assurez-vous que l’un des nombres est une décimale en le multipliant par 1.0. Utilisez <code>LIKE '%innocent%'</code> pour trouver les allégations d’innocence."
  data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

Cette méthode de détermination des allégations d’innocence est certes plutôt inexacte, car l’innocence peut être exprimée en d’autres termes comme « non coupable ». Néanmoins, je soupçonne qu’il sous-estime le nombre réel et est probablement de l’ordre de grandeur. La question qui nous reste alors est de savoir si nous sommes prêts à accepter la possibilité que jusqu’à 5 % des personnes que nous exécutons soient en fait innocentes. ([Paul Graham refuse de le faire.](http://paulgraham.com/prop62.html))

Pour résumer, nous sommes passés des opérations au niveau de la ligne dans la section précédente à l’utilisation de fonctions d’agrégation sur plusieurs lignes dans le jeu de données. Cela a ouvert une voie pour étudier le comportement au niveau du système. Dans la section suivante, nous allons apprendre à appliquer des fonctions d’agrégation sur plusieurs sous-groupes de l’ensemble de données en utilisant le bloc `GROUP BY`.