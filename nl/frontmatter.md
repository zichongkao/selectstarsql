---
layout: nl_tutorial
title: Front Matter
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>
## Impetus
Toen ik datawetenschapper was bij Quora, vroegen mensen me vaak om bronnen om SQL te leren. Ik had moeite om iets te vinden waar ik achter kon staan, omdat ik vond dat een goede bron gratis moest zijn, geen registratie mocht vereisen en aandacht moest hebben voor pedagogiek&mdash;het moest echt om de gebruikers geven en er was niets dergelijks te vinden.

Door een aantal kleine <a href="#technicals">technische uitdagingen</a> te overwinnen, geloof ik dat **Select Star SQL** aan deze standaard heeft voldaan. Mijn hoop is dat **Select Star SQL**, net zoals <a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> en <a href='https://beautifulracket.com'>Beautiful Racket</a> hebben gedaan voor Haskell en Racket, de beste plek op internet wordt om SQL te leren.

<br>
<a name="pedagogy"></a>
## Pedagogiek
Deze principes hebben geleid tot het ontwerp van dit project:
   - <p><strong>Programmeren leert men het beste door te doen.</strong><br>
     Een groot deel van het materiaal bestaat uit oefeningen, en het worstelen met deze oefeningen zou het grootste deel van je tijd in beslag moeten nemen.</p>
   - <p><strong>Oefeningen moeten realistisch en substantieel zijn.</strong><br>
     Om <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a> te citeren: "Je laat [de leerling] nooit iets doen dat niet het echte ding is - maar je moet je kont uit je broek werken om uit te vinden wat het echte ding is in de context van de manier waarop hun geest werkt op dat ontwikkelingsniveau."</p>
     <p>Evenzo zijn de oefeningen hier ontworpen om steeds geavanceerdere SQL-technieken te introduceren, terwijl de dataset wordt verkend op manieren die mensen daadwerkelijk zouden interesseren.</p>
   - <p><strong>Leren programmeren is een mentaal model leren</strong><br>
     Ons doel hier is niet om de regels te leren voor het gebruik van <code>GROUP BY</code> of wanneer te kiezen voor een <code>LEFT JOIN</code> boven een <code>INNER JOIN</code>. We weten dat we succesvol zijn als je na het schrijven van een SQL-query je ogen kunt sluiten en je kunt voorstellen wat de computer zou doen en wat de uitvoer zou zijn. Alleen dan zul je in staat zijn om echte problemen op te lossen met SQL.</p>

<br>
<a name="dataset"></a>
## Dataset
Onze dataset documenteert terdoodveroordeelden in Texas die sinds 1976, toen het Hooggerechtshof de doodstraf opnieuw invoerde, zijn geëxecuteerd. De dataset is waar mogelijk automatisch geëxtraheerd van de website van de <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Texas Department of Criminal Justice</a>. Veel van de gegevens van vóór 1995 zijn echter alleen beschikbaar als afbeeldingen van fysieke documenten en deze moesten zorgvuldig handmatig worden geëxtraheerd.

De ruwe gegevens zijn beschikbaar als csv voor <a href="data/tx_deathrow_full.csv">download</a>. Door de handmatige extractie en opschoning die is uitgevoerd, is het waarschijnlijk de meest complete set gegevens over terdoodveroordeelden in Texas op internet. Je kunt ook een subset ervan verkennen die ik voor dit boek heb voorbereid:
<sql-exercise
  data-question="This is an interactive code editor. You can edit query below."
  data-comment="Shift+Enter is the keyboard shortcut for running the query."
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

Aan de ene kant is de dataset gewoon een onderdeel van een alledaags programmeringsboek. Aan de andere kant vertegenwoordigt elke rij immense ellende, verloren levens en in sommige gevallen verbazingwekkende verlossing en acceptatie. Bij het voorbereiden van deze dataset was ik diep ontroerd door een aantal van de uitspraken en ben ik mijn positie over de doodstraf aan het her.

<br>
<a name="technicals"></a>
## Technicals
   - <p><strong>Client-side Databases</strong>. One of the challenges of making this site free was to avoid paying for web hosting. But to give users a hands-on experience with a database (see <a href="#pedagogy">Pedagogy</a>), one would have to host and pay for a proper backend. Thankfully, client-side databases exist. This allows me to use <a href="https://pages.github.com">Github Pages'</a> free static page hosting and have the pages run a SQLite database on your browser. Alon Zakai and others made this possible by <a href="https://github.com/kripken/sql.js">porting the SQLite C code into Javascript using Emscripten</a>.</p>
   - <p><strong>Matthew Butterick</strong>. I met Matthew at the <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> and was blown away by the great work he's done on <a href="http://beautifulracket.com">Beautiful Racket</a> and <a href="http://practicaltypography.com">Practical Typography</a>. As you can perhaps tell, I borrowed many design ideas from there.</p>
   - <p><strong>Jekyll</strong>. If not for <a href="https://jekyllrb.com/">Jekyll</a>, I would have ended up writing all the html by hand. Thank goodness for Jekyll.</p>
   - <p><strong>Web Components</strong>. I was able to reuse a lot of code by writing the interactive exercise and quiz components as <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">custom html tags</a>. It's a relatively new development as I understand, and I hope that W3C continues to push for broader adoption.</p>

<br>
<a name="contact"></a>
## Credits and Contact
For corrections and suggestions, please write me (Kao) at zichongkao@gmail.com. You can find out more about me at <a href="http://kaomorphism.com">Kaomorphism</a>.

<a href="https://thepitz.io/">Noam Castel</a> and Jowan Vogel did an amazing job on the <a href="/he/">Hebrew</a> and <a href="/nl">Dutch</a> translations. Please reach out to them for kudos and suggestions, or if you are interested translating it into other languages.

Much thanks to Sonja Lea Heinze, Quinn Batten, and <a href="https://nickretallack.com">Nicholas Retallack</a> for providing valuable feedback.