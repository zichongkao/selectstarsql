---
layout: nl_tutorial
title: Voorwoord
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>
## Aanleiding
Toen ik datawetenschapper was bij Quora, vroegen mensen me vaak om bronnen om SQL te leren. Ik had moeite om iets te vinden waar ik achter kon staan, omdat ik vond dat een goede bron gratis moest zijn, geen registratie mocht vereisen en aandacht moest hebben voor pedagogiek&mdash;het moest echt om de gebruikers geven en er was niets dergelijks te vinden.

Door een aantal kleine <a href="#technicals">technische uitdagingen</a> te overwinnen, geloof ik dat **Select Star SQL** aan deze standaard heeft voldaan. Mijn hoop is dat **Select Star SQL**, net zoals <a href='https://learnyouahaskell.github.io/chapters.html'>Learn You a Haskell for Great Good!</a> en <a href='https://beautifulracket.com'>Beautiful Racket</a> hebben gedaan voor Haskell en Racket, de beste plek op internet wordt om SQL te leren.

<br>
<a name="pedagogy"></a>
## Pedagogiek
Deze principes hebben het ontwerp van dit project gestuurd:
   - <p><strong>Programmeren leert men het beste door te doen.</strong><br>
     Een groot deel van het materiaal bestaat uit oefeningen, en het worstelen met deze oefeningen zou het grootste deel van je tijd in beslag moeten nemen.</p>
   - <p><strong>Oefeningen moeten realistisch en substantieel zijn.</strong><br>
     Om <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a> te citeren: "Je laat [de leerling] nooit iets doen dat niet het echte werk is&mdash;maar je moet je kont uit je broek werken om uit te vinden wat het echte werk is in de context van de manier waarop hun geest werkt op dat ontwikkelingsniveau."</p>
     <p>Evenzo zijn de oefeningen hier ontworpen om steeds geavanceerdere SQL-technieken te introduceren, terwijl de dataset wordt verkend op manieren die mensen daadwerkelijk zouden interesseren.</p>
   - <p><strong>Leren programmeren is een mentaal model leren</strong><br>
     Ons doel hier is niet om de regels te leren voor het gebruik van <code>GROUP BY</code> of wanneer te kiezen voor een <code>LEFT JOIN</code> boven een <code>INNER JOIN</code>. We weten dat we succesvol zijn als je na het schrijven van een SQL-query je ogen kunt sluiten en je kunt voorstellen wat de computer zou doen en wat de uitvoer zou zijn. Alleen dan zul je in staat zijn om echte problemen op te lossen met SQL.</p>

<br>
<a name="dataset"></a>
## Dataset
Onze dataset documenteert terdoodveroordeelden in Texas die sinds 1976, toen het Hooggerechtshof de doodstraf opnieuw invoerde, zijn geëxecuteerd. De dataset is waar mogelijk automatisch geëxtraheerd van de website van de <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Texas Department of Criminal Justice</a>. Veel van de gegevens van vóór 1995 zijn echter alleen beschikbaar als afbeeldingen van fysieke documenten en deze moesten zorgvuldig handmatig worden geëxtraheerd.

De ruwe gegevens zijn beschikbaar als csv voor <a href="../data/tx_deathrow_full.csv">download</a>. Door de handmatige extractie en opschoning die is uitgevoerd, is het waarschijnlijk de meest complete set gegevens over terdoodveroordeelden in Texas op internet. Je kunt ook een subset ervan verkennen die ik voor dit boek heb voorbereid:
<sql-exercise
  data-question="Dit is een interactieve code-editor. Je kunt de query hieronder aanpassen."
  data-comment="Shift+Enter is de sneltoets om de query uit te voeren."
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

Aan de ene kant zijn de gegevens gewoon een onderdeel van een alledaags programmeerboek. Aan de andere kant vertegenwoordigt elke rij immens leed, verloren levens en in sommige gevallen verbazingwekkende verlossing en aanvaarding. Bij het voorbereiden van deze dataset was ik diep geraakt door een aantal van de verklaringen en merkte ik dat ik mijn standpunt over de doodstraf opnieuw ging overwegen. Ik hoop dat jij, terwijl we de gegevens onderzoeken, ook stil zult staan bij de diepere kwesties die hier spelen.

<br>
<a name="technicals"></a>
## Technische details
   - <p><strong>Client-side databases</strong>. Een van de uitdagingen bij het gratis aanbieden van deze site was om niet te hoeven betalen voor webhosting. Maar om gebruikers praktische ervaring met een database te geven (zie <a href="#pedagogy">Pedagogiek</a>), zou je normaal gesproken een echte backend moeten hosten en daarvoor betalen. Gelukkig bestaan er client-side databases. Daardoor kan ik de gratis hosting voor statische pagina's van <a href="https://pages.github.com">Github Pages</a> gebruiken en de pagina's een SQLite-database in je browser laten draaien. Alon Zakai en anderen hebben dit mogelijk gemaakt door <a href="https://github.com/kripken/sql.js">de C-code van SQLite met Emscripten naar Javascript te porten</a>.</p>
   - <p><strong>Matthew Butterick</strong>. Ik heb Matthew ontmoet op de <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> en was diep onder de indruk van het geweldige werk dat hij heeft geleverd met <a href="http://beautifulracket.com">Beautiful Racket</a> en <a href="http://practicaltypography.com">Practical Typography</a>. Zoals je misschien kunt zien, heb ik daar veel ontwerpideeën van overgenomen.</p>
   - <p><strong>Jekyll</strong>. Zonder <a href="https://jekyllrb.com/">Jekyll</a> had ik alle html met de hand moeten schrijven. Godzijdank is er Jekyll.</p>
   - <p><strong>Web Components</strong>. Ik kon veel code hergebruiken door de interactieve oefeningen en quizzen als <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">eigen html-tags</a> te schrijven. Voor zover ik weet is dit een relatief nieuwe ontwikkeling, en ik hoop dat het W3C zich blijft inzetten voor een bredere adoptie.</p>

<br>
<a name="contact"></a>
## Dankwoord en contact
Voor correcties en suggesties kun je mij (Kao) schrijven op zichongkao@gmail.com. Je kunt meer over mij te weten komen op <a href="http://kaomorphism.com">Kaomorphism</a>.

Het boek is genereus vertaald door vrijwilligers. Neem gerust contact met hen op om ze te bedanken of om suggesties voor hun vertalingen te doen, of neem contact met mij op als je interesse hebt om het in een andere taal te vertalen.

- <a href="/es/">Spaans</a>: Daniel René Piedra
- <a href="/fr/">Frans</a>: April Tao
- <a href="/he/">Hebreeuws</a>: <a href="https://thepitz.io/">Noam Castel</a>
- <a href="/it/">Italiaans</a>: Stefano Caglio
- <a href="/nl/">Nederlands</a>: Jowan Vogel
- <a href="/pt-br/">Braziliaans-Portugees</a>: Samuel Capetinga Bomtempo

Veel dank aan Sonja Lea Heinze, Quinn Batten en <a href="https://nickretallack.com">Nicholas Retallack</a> voor hun waardevolle feedback.
