---
layout: it_tutorial
title: Prefazione
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>
## Impeto
Quando lavoravo come data scientist in Quora, capitava spesso che la gente mi chiedesse delle risorse per imparare SQL. Faticavo a trovare qualcosa di valido perché sentivo che una buona risorsa dovesse essere gratuita, non richiedere registrazione e prendere in considerazione la pedagogia &mdash; avrebbe dovuto preoccuparsi in modo genuino dei propri utenti &mdash; e non c'era nulla di simile in giro.

Superando alcuni piccoli <a href="#technicals">ostacoli tecnici</a>, spero che **Select Star SQL** ha raggiunto questi standard. La mia speranza è che come <a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> e <a href='https://beautifulracket.com'>Beautiful Racket</a> hanno fatto per Haskell e Racket, **Select Star SQL** diventerà il miglior luogo in internet per imparare SQL.

<br>
<a name="pedagogy"></a>
## Pedagogia
Questi sono i principi che hanno guidato la creazione di questo progetto:
   - <p><strong>La programmazione si impara meglio facendola.</strong><br>
     Buona parte del materiale consiste di esercizi, sforzarsi di risolverli dovrebbe occupare la maggior parte del tuo tempo.</p>
   - <p><strong>Gli esercizi dovrebbero essere realistici Exercises should be realistic and concreti.</strong><br>
     Per citare <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a>: "Non lasciare mai che [lo studente] faccia qualcosa che non sia reale &mdash; ma tu devi lavorare sodo per capire che cosa sia reale nel contesto del modo in cui le loro menti lavorano a quel livello di sviluppo."</p>
     <p>Allo stesso modo, gli esercizi proposti sono stati progettati per introdurre tecniche SQL sempre più sofisticate mentre si esplorano set di dati in modi a cui le persone possano essere realmente essere interessate.</p>
   - <p><strong>Imparare a programmare è imparare un modello mentale.</strong><br>
     Il nostro obiettivo non è imparare le regole su come utilizzare <code>GROUP BY</code> o quando scegliere <code>LEFT JOIN</code> rispetto a <code>INNER JOIN</code>. Sappiamo di avere avuto successo se, dopo aver scritto una query (interrogazione) SQL, tu potrai chiudere gli occhi ed immaginare ciò che farà il computer e quali risultati dovrebbe fornirti. Solo allora sarai in grado di risolvere problemi del mondo reale utilizzando SQL.

<br>
<a name="dataset"></a>
## Dataset
Il nostro set di dati documenta i detenuti del braccio della morte in Texas giustiziati dal 1976, quando la Corte Suprema ripristinò la pena di morte, ad oggi. È stato estratto dal sito del <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Dipartimento di Giustizia Penale del Texas</a> utilizzando sistemi automatici dove possibile. Tuttavia, molti dati precedenti al 1995 sono disponibili solo come immagini di documenti fisici e questo ha comportato un'accurata estrazione manuale.

I dati grezzi sono disponibili in formato csv per il <a href="../data/tx_deathrow_full.csv">download</a>. Grazie all'estrazione manuale e alla pulizia che è stata svolta, è probabilmente il set di dati più completo in internet riguardante i bracci della morte in Texas. Puoi anche esplorare un suo sottoinsieme che ho preparato per questo libro:
<sql-exercise
  data-question="Questo è un editor del codice interattivo. Puoi modificare la ricerca riportata qui sotto."
  data-comment="Maiusc+Invio è la scorciatoia da tastiera per eseguire la query."
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

Da un lato, i dati sono semplicemente una parte di un banale libro sulla programmazione. Dall'altro, ogni riga rappresenta una sofferenza immensa, vite perse e, in alcuni casi, incredibili storie di redenzione e accettazione. Mentre preparavo questo dataset, sono stato profondamente colpito da diverse dichiarazioni e mi sono ritrovato a rivalutare la mia posizione riguardo la pena capitale. Mi auguro che, mentre esamineremo i dati, anche tu contemplerai le più profonde questioni in gioco.

<br>
<a name="technicals"></a>
## Aspetti tecnici
   - <p><strong>Database client-side</strong>. Una delle sfide di rendere questo sito libero è stata quella di evitare di pagare l'hosting web. Ma per dare agli utenti un'esperienza pratica con un database (leggi <a href="#pedagogy">Pedagogia</a>), si avrebbe dovuto hostare il sito e pagare per un backend adeguato. Per fortuna, esistono i database client-side. Questo mi ha permesso di utilizzare <a href="https://pages.github.com">Github Pages'</a> come host gratuito di pagine statiche ed eseguire un database SQLite sulle pagine nel tuo browser. Alon Zakai e altri l'hanno reso possibile creando la <a href="https://github.com/kripken/sql.js">trasposizione del codice SQLite C in Javascript utilizzando Emscripten</a>.</p>
   - <p><strong>Matthew Butterick</strong>. Ho incontrato Matthew al <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> e sono rimasto stupefatto dall'ottimo lavoro che ha fatto su <a href="http://beautifulracket.com">Beautiful Racket</a> e <a href="http://practicaltypography.com">Practical Typography</a>. Come forse puoi intuire, ho preso in prestito da li molte idee sul design.</p>
   - <p><strong>Jekyll</strong>. Se non fosse per <a href="https://jekyllrb.com/">Jekyll</a>, sarei finito a scrivere tutto il codice html a mano. Grazie al cielo c'è Jekyll.</p>
   - <p><strong>Componenti web</strong>. Sono stato in grado di riutilizzare buona parte del codice scrivendo i componenti degli esercizi interattivi e dei quiz come <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">tag html personalizzati</a>. Si tratta di uno sviluppo relativamente nuovo, a quanto ne ho capito, e spero che il W3C continui ad adoperarsi per un'adozione più ampia.</p>

<br>
<a name="contact"></a>
## Crediti e contatti
Per correzioni e suggerimenti, scrivi a me (Kao) alla mail zichongkao@gmail.com. Puoi trovare maggiori informazioni su di me su <a href="http://kaomorphism.com">Kaomorphism</a>.

<a href="https://thepitz.io/">Noam Castel</a> ha fatto un incredibile lavoro sulla <a href="/he/">traduzione ebraica</a>. Per favore, contattalo per complimentarti e per suggerimenti sulla versione ebraica, o se sei interessato ad una traduzione in un'altra lingua.

Molte grazie a Sonja Lea Heinze, Quinn Batten e <a href="https://nickretallack.com">Nicholas Retallack</a> per i loro preziosi riscontri.
