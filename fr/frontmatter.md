---
layout: fr_tutorial
title: Preface
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>
## Impulsion
Quand j'étais data scientist à Quora, on m’a demandé des ressources pour apprendre SQL. J’ai eu du mal à trouver quelque chose que je supportais parce que j’ai pensé qu’une bonne ressource devrait être gratuite, ne nécessite pas d’inscription et se soucie de pédagogie—elle devrait sincèrement se soucier de ses utilisateurs et ça n’existait pas. 

En surmontant quelques <a href="#technicals">obstacles techniques</a> mineurs, je crois que **Select Star SQL** a atteint ce standard. J'espère que comme <a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> et <a href='https://beautifulracket.com'>Beautiful Racket</a> ont fait pour Haskell et Racket, **Select Star SQL** deviendra le meilleur endroit sur internet pour l’apprentissage de SQL.

<br>
<a name="pedagogy"></a>
## Pédagogie
Ces principes ont guidé la conception de ce projet :
   - <p><strong>La meilleure façon d’apprendre la programmation est en programmant.</strong><br> Une grande proportion de ces matériaux construit des exercices et ils devraient occuper la plupart de votre temps.</p>
   - <p><strong>Les exercices devraient être réalistes et substantifs.</strong><br>
     Pour citer Alan Kay <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a> : « Vous ne laissez jamais [l’apprenant] faire quelque chose qui n’est pas authentique—mais vous devrez trimer pour comprendre quelles sont les choses authentiques dans le contexte de sa compréhension à ce niveau d’apprentissage. »</p>
     <p>De même, on a dessiné les exercices à introduire les techniques de plus en plus sophistiqués et en même temps explore l’ensemble de données d’une manière qui intéresse réellement les gens.</p>
   - <p><strong>Apprendre la programmation, c’est apprendre un modèle mental.</strong><br>
     but n’est pas d'apprendre les règles sur l’utilisation de <code>GROUP BY</code> ou quand choisir un <code>LEFT JOIN</code> sur un <code>INNER JOIN</code>. Nous savons que nous avons réussi si après vous pouvez fermer les yeux et imaginer ce que l’ordinateur fait et quelle sortie il donnerait. Alors seulement vous pouvez résoudre les problèmes pratiques avec SQL.</p>

<br>
<a name="dataset"></a>
## Jeu de données
Notre jeu de donnees documentent les détenus du couloir de la mort au Texas de 1976 (quand lorsque la Cour suprême a reinstaté la peine capitale) au present. On l’a extrait du site de <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Texas Department of Criminal Justice</a> utilisant des moyens automatiques lorsque cela est possible. Cependant, une grande partie des données antérieures à 1995 est seulement disponible comme les images de documents physiques ceux qui ont nécessité une extraction manuelle minutieuse.

Les données brutes sont disponibles en format csv à <a href="data/tx_deathrow_full.csv">télécharger</a>. En raison de l’extraction manuelle et du nettoyage qui a été fait, c’est probablement le plus complet ensemble de données sur les condamnés à mort au Texas sur internet. Vous pouvez également explorer un sous-ensemble de ce que j’ai préparé pour ce livre :
<sql-exercise
  data-question="Ceci est un éditeur de code interactif. Vous pouvez éditer la requête ci-dessous."
  data-comment="Maj+Entrée est le raccourci clavier pour l'exécution de la requête."
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

D’une part, les données sont simplement une partie d’un manuel de programmation banal. Sur un autre, chaque ligne représente une immense souffrance, des vies perdues et dans certains cas une rédemption et une acceptation étonnantes. En préparant ce jeu de données, certaines d'énoncé m’a ému profondément et je me trouvais à réévaluer ma position sur la peine capitale. J’espère que vous aussi réfléchirez à des questions plus profondes en jeu pendant notre examen des données.

<br>
<a name="technicals"></a>
## Aspects techniques
   - <p><strong>Les jeux de données client-side</strong>. L’un des défis pendant la réalisation de ce site était l'évitement de player pour l’hébergement web. En général, on devrait l'héberger et payer pour un back-end pour donner aux utilisateurs une expérience pratique avec une base de données (voir <a href="#pedagogy">Pédagogie</a>). Heureusement, il existe des bases de données client-side. Ils me permettent d’utiliser l’hébergement de pages statiques gratuit sur <a href="https://pages.github.com">Github Pages</a> où les pages exécutent la base de données SQLite sur votre navigateur. Alon Zakai et d’autres ont rendu cela possible en portant le code SQLite C dans Javascript avec <a href="https://github.com/kripken/sql.js">Emscripten</a>.</p>
   - <p><strong>Matthew Butterick</strong>. J’ai rencontré Matthew à <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> et j’ai été très impressionné par le travail qu’il a fait sur <a href="http://beautifulracket.com">Beautiful Racket</a> et <a href="http://practicaltypography.com">Practical Typography</a>. Peut-être que ça se voit que j’ai emprunté beaucoup d'idées de conception de lui.</p>
   - <p><strong>Jekyll</strong>. Si ce n’était pas pour <a href="https://jekyllrb.com/">Jekyll</a>, j’aurais fait tout le html à la main. Dieu merci pour Jekyll.</p>
   - <p><strong>Web Components</strong>. Je pourrais réutiliser beaucoup de code en écrivant les exercices et les composant des quiz en tant que <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">balises html personnalisées</a>. Il s’agit d’un développement relativement nouveau à ma connaissance et j'espère que le W3C continuera de pousser pour l’adoption plus large.</p>

<br>
<a name="contact"></a>
## Crédits et contacts
Pour les corrections et suggestions, s'il vous plaît écrivez-moi (Kao) à zichongkao@gmail.com. Vous pouvez en apprendre plus sur moi à <a href="http://kaomorphism.com">Kaomorphism</a>.

<a href="https://thepitz.io/">Noam Castel</a> et Jowan Vogel ont fait un travail remarquable sur les traductions en <a href="/he/">hébreu </a> et en <a href="/nl">néerlandais</a> translations. Veuillez communiquer avec eux pour donner des compliments et des suggestions, ou si vous êtes intéressé à le traduire dans d’autres langues.

Beaucoup de remerciements à Sonja Lea Heinze, Quinn Batten et <a href="https://nickretallack.com">Nicholas Retallack</a> pour leur précieux retour d’information.
