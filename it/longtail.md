---
layout: it_tutorial
title: La coda lunga
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>
## Code lunghe
Le code lunghe si riferiscono a piccoli numeri di campioni che si verificano un gran numero di volte. Quando li tracciamo, formano un piccolo frammento, che sembra una coda appunto, posizionato molto a destra rispetto al centro di massa. Indicano la presenza di valori anomali che potrebbero interessarci per i loro comportamenti anomali.<img src="../imgs/execution_tail.png"> Nel contesto delle esecuzioni in Texas, la coda lunga si riferisce a un piccolo numero di contee note per aver condotto un gran numero di esecuzioni.

Troviamo la percentuale di esecuzioni per ogni contea in modo da poter individuare quelle in coda.

Come risulterà sempre più evidente, la forma delle tabelle ci può dire molto sulle operazioni che dobbiamo eseguire, in modo analogo a quanto fa l'analisi dimensionale in fisica. In questo caso, possiamo capire che i metodi che abbiamo trattato finora sono inadeguati: il capitolo [Beazley](beazley.html) trattava singole righe di dati, ma è chiaro che dobbiamo fare qualche aggregazione per trovare i dati a livello di contea. Il capitolo [Dichiarazioni di innocenza](innocence.html) ci ha insegnato l'aggregazione, ma quelle funzioni finirebbero per aggregare il set di dati in un'unica riga quando in realtà vogliamo una riga per contea.

<br>
<a name="groupby"></a>
## Il blocco GROUP BY
È qui che entra in gioco il blocco `GROUP BY`: ci consente di suddividere il set di dati e applicare funzioni aggregate all'interno di ciascun gruppo, ottenendo una riga per gruppo. La sua forma più elementare è <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> e si posiziona dopo il blocco `WHERE`.

<sql-exercise
  data-question="Questa query estrae i conteggi delle esecuzioni per contea."
  data-default-text="SELECT
  county,
  COUNT(*) AS county_executions
FROM executions
GROUP BY county"></sql-exercise>

Se ti ricordi il paragrafo <a href='innocence.html#strange'>Una query strana</a>, dovrebbero suonare i campanelli d'allarme della tua testa. Non abbiamo appena imparato a non mescolare colonne aggregate e non aggregate? La differenza qui è che le colonne di raggruppamento sono le uniche colonne che possono essere non aggregate. Dopotutto, tutte le righe di quel gruppo devono avere gli stessi valori su quelle colonne, quindi non c'è ambiguità nel valore che deve essere restituito.

Avrai anche notato l'uso di `AS`: è ciò che noi chiamiamo "alias". Nel blocco`SELECT`, <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> fornisce un alias a cui è possibile fare riferimento più avanti nella query. Questo ci evita di riscrivere espressioni lunghe e ci permette di scrivere in modo più chiero l'espressione.

<sql-exercise
  data-question="Questa query conta le esecuzioni con e senza ultime dichiarazioni. Modificala per suddividerla ulteriormente per contea."
  data-comment="La condizione <code>last_statement IS NOT NULL</code> agisce come un indicatore dove 1 significa vero e 0 falso."
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
## Il blocco HAVING
Il prossimo esercizio illustra che il filtraggio tramite il blocco `WHERE` avviene prima del raggruppamento e dell'aggregazione. Questo si riflette nell'ordine della sintassi poiché il blocco `WHERE` precede sempre il blocco `GROUP BY`.

<sql-exercise
  data-question="Conta il numero di detenuti di età pari o superiore a 50 anni giustiziati in ciascuna contea."
  data-comment="Dovresti essere in grado di farlo utilizzando <code>CASE WHEN</code>; qui prova usando il blocco <code>WHERE</code>."
  data-default-text=""
  data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"
  ></sql-exercise>

Va tutto bene, ma cosa succede se vogliamo filtrare il risultato del raggruppamento e dell'aggregazione? Sicuramente non possiamo fare un salto nel futuro e prendere informazioni da lì. Per risolvere questo problema, usiamo `HAVING`.

<sql-exercise
  data-question="Elencare le contee in cui sono stati giustiziati più di 2 detenuti di età pari o superiore a 50 anni."
  data-comment="Questo esercizio si basa quello precedente. Abbiamo bisogno di un filtro aggiuntivo&mdash;uno che utilizza il risultato dell'aggregazione. Ciò significa che non può esistere nel blocco <code>WHERE</code> perché tali filtri vengono eseguiti prima dell'aggregazione. Cerca il <a href='https://www.w3schools.com/sql/sql_having.asp'>blocco <code>HAVING</code></a>. Puoi considerarlo come un blocco <code>WHERE</code> con post-aggregazione."
  data-default-text=""
  data-solution="SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(*) > 2"
  ></sql-exercise>

<br>
## Pratica
Questo quiz è progettato per mettere alla prova la tua comprensione. Leggi le spiegazioni anche se fai tutto correttamente.

<sql-quiz
  data-title="Segna le affermazioni che sono vere."
  data-description="Questa query trova il numero detenuti da ciascuna contea e per fascie d'età di 10 anni. <pre>
SELECT
  county,
  ex_age/10 AS decade_age,
  COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
  <sql-quiz-option
    data-value="valid"
    data-statement="La query è valida (ovvero non genererà un errore quando eseguita)."
    data-hint="Usare <code>ex_age/10</code> ti ha sconcertato?Può andare bene anche raggruppare secondo le colonne trasformate."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="gran"
    data-statement="La query ritornerebbe più righe se utilizzassimo <code>ex_age</code> invece che <code>ex_age/10</code>."
    data-hint="Ricorda che <code>ex_age/10</code> esegue una divisione intera che approssima tutte le età.In questo modo si genera un numero minore di gruppi."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="L'output avrà tante righe quante sono le combinazioni uniche di contea e decadi all'interno del set di dati."
    data-hint="Questo è corretto."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="L'output avrà un gruppo ('Bexar', 6) anche se nessun detenuto della contea di Bexar era fra i 60 e i 69 anni al momento dell'esecuzione."
    data-hint="Il blocco <code>GROUP BY</code> btrova tutte le combinazioni <i>nel set di dati</i> piuttosto che tutte le possibili combinazioni teoricamente possibili."
    data-value="abstract_cartesian"></sql-quiz-option>
  <sql-quiz-option
    data-statement="L'output avrà un valore diverso di contea per ogni riga restituita."
    data-hint="Questo sarebbe vero solo se <code>county</code> fosse l'unica colonna di raggruppamento. Possiamo avere più gruppi con la stessa contea ma con decadi di età diverse."
    data-value="one_col_diff"></sql-quiz-option>
  <sql-quiz-option
    data-statement="L'output può avere gruppi in cui il conteggio è 0."
    data-hint="Questo è simile alla domanda ('Bexar', 6). Se non ci sono righe con ('Bexar', 6), il gruppo non verrà nemmeno visualizzato."
    data-value="count_zero"></sql-quiz-option>
  <sql-quiz-option
    data-statement="La query è valida anche se non specifichiamo <code>county</code> nel blocco <code>SELECT</code>."
    data-hint="Le colonne di raggruppamento non devono trovarsi per forza nel blocco <code>SELECT</code>. Questo sarebbe valido, ma non avrebbe molto senso perché non sapremmo quali conteggi sono stati eseguiti su quale contea."
    data-value="missing_gp_col"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="È ragionevole aggiungere <code>last_name</code> al blocco <code>SELECT</code> anche senza eseguire un raggruppamento in base ad esso."
    data-hint="Anche se sarebbe un codice valido (in SQLite) per i motivi esposti in <a href='innocence.html#strange'>Una query strana</a>, avere colonne non aggregate e non raggruppate nel blocco <code>SELECT</code> è una pessima scrittura."
    data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>

<sql-exercise
  data-question="Elenca tutte le contee presenti nel set di dati."
  data-comment="Lo abbiamo fatto nel capitolo precedente utilizzando il comando <code>SELECT DISTINCT</code>. Questa volta, scrivi solo il comando <code>SELECT</code> e utilizza <code>GROUP BY</code>."
  data-default-text=""
  data-solution="SELECT county FROM executions GROUP BY county"
  ></sql-exercise>

<br>
<a name="nested"></a>
## Query annidate
Potresti chiederti se non fosse più semplice scrivere semplicemente qualcosa del genere:

    SELECT
      county,
      PERCENT_COUNT(*)
    FROM executions
    GROUP BY county

Le percentuali sono una misura così comune&mdash;non dovrebbe esistere una funzione di questo tipo? Sfortunatamente no, e forse per una buona ragione: una funzione di questo tipo avrebbe bisogno di aggregare i dati sia all'interno dei gruppi (per formare il numeratore) sia su tutto il set di dati (per ottenere il denominatore). Ma ogni query può avere un blocco `GROUP BY` o no. Quindi quello di cui abbiamo veramente bisogno sono due query distinte una che aggrega i dati con un `GROUP BY` e una che li aggrega senza. Possiamo poi combinarele con una tecnica che si chiama "nesting", annidamento in italiano.

Di seguito un esempio di come funziona il nesting. Le parentesi sono importante per identificare i confini fra la query interna e quella esterna:

<sql-exercise
  data-question="Trova nome e cognome del detenuto che ha pronunciato le ultime parole più lunghe, contando i caratteri riportati nel set di dati."
  data-comment="Scrivi una query adeguata da annidare all'interno di &lt;<code>lunghezza-delle-ultime-parole-più-lunghe</code>&gt;."
  data-default-text="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (<lunghezza-delle-ultime-parole-più-lunghe>)"
  data-solution="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (SELECT MAX(LENGTH(last_statement))
     FROM executions)"></sql-exercise>

Per ribadire il concetto, l'annidamento qui è necessario perché nella clausola "WHERE", mentre il computer ispeziona una riga per decidere se la sua ultima istruzione è della lunghezza giusta, non può guardare all'esterno per determinare la lunghezza massima dell'intero set di dati. Dobbiamo trovare la lunghezza massima separatamente e inserirla nella clausola. Adesso applichiamo lo stesso concetto per trovare la percentuale di esecuzioni in ciascuna contea.


<sql-exercise
  data-question="Inserisci la query &lt;<code>conteggio-di-tutte-le-righe</code>&gt; per trovale la percentuale di esecuzioni per ogni contea."
  data-comment="<code>100.0</code> è un decimale in modo che possiamo ottenere percentuali decimali."
  data-default-text="SELECT
  county,
  100.0 * COUNT(*) / (<conteggio-di-tutte-le-righe>)
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

Senza dire nulla ho inserito un blocco `ORDER BY`. Il suo fomrato è <code class="codeblock">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> e può essere modificato aggiungendo `DESC` se non vuoi l'ordinamento ascendente di default.

<br>
<a name="harris"></a>
## Contea di Harris
È sorprendente che le contee di Harris (la contea dove si trova Houston), Dallas, Bexar e Tarrant contano circa il 50% di tutte le esecuzioni del Texas? Forse si, specialmente se partiamo dall'assunto che le esecuzioni dovrebbero essere distribuite uniformemente fra le contee. Ma una approssimazione migliore è che le esecuzioni sono distribuite in linea con la distribuzione di popolazione. Il [Censimento del Texas del 2010](https://www.tsl.texas.gov/ref/abouttx/popcnty12010.html) mostra che queste quattro contee hanno una popolazione di 10 milioni di persone, che corrisponde al 40.0% della popolazione del Texas (25.1 milioni). Questo rende il dato iniziale meno sorprendente.

Ma analizzando ulteriormente questa coda, si capisce che la contea di Harris contribuisce per la maggior parte di questa variazione. Ha solo il 16.4% della popolazione ma il 23.1% delle esecuzioni: almeno il 50% in più di quello che ci si aspetterebbe.

Molti studi hanno esaminato i motivi per cui la contea di Harris è stata così prolifica e sono stati suggeriti diversi fattori:
 - <p>I procedimenti giudiziari  <a href="https://web.archive.org/web/20191227235319/https://www.citylab.com/equity/2014/09/one-texas-county-is-responsible-for-most-of-the-executions-in-the-entire-us/380705/">sono stati ben organizzati e finanziati</a>, mentre le difese sono state finanziate dai tribunali e scarsamente incentivate. <a href="http://www.houstonlawreview.org/wp-content/uploads/2018/05/3-Steiker-896.pdf">(fonte, si veda a pag. 49)</a>
 - <p>Il procuratore distrettuale di lunga data lo era <a href="https://www.chron.com/news/houston-texas/article/Former-DA-ran-powerful-death-penalty-machine-1833545.php">determinato e molto favorevole alla pena di morte</a>.
 - <p>In Texas i giudici vengono eletti e la popolazione sostiene la pena di morte. <a href="https://priceonomics.com/why-has-texas-executed-so-many-inmates/">(fonte)</a>
 - <p>I controlli e gli equilibri nel sistema giudiziario della contea di Harris non hanno funzionato. <a href="https://houstonlawreview.org/article/3874-the-problem-of-rubber-stamping-in-state-capital-habeas-proceedings-a-harris-county-case-study">(fonte, si veda pag. 929)</a></p>

<br>
<a name="recap"></a>
## In sintesi
In questa sezione abbiamo imparato ad aggregare gruppi e ad utilizzare l'annidamento per utilizzare l'output di una query più interna in una query esterna. Queste tecniche hanno il vantaggio molto pratico di permetterci di calcolare le percentuali.

<a name="mapreduce"></a>
<div class="sideNote">
  <h3>MapReduce</h3>
  <p>Un'aggiunta interessante è che in realtà abbiamo appena imparato aa utilizzare MapReduce in SQL. MapReduce è un famoso paradigma di programmazione dove i calcoli avvengono in fasi di "mappa" e "riduci". Puoi imparare di più riguardo MapReduce <a href="https://stackoverflow.com/questions/28982/simple-explanation-of-mapreduce">a questo link</a>.</p>
  <p>Il capitolo <a href="beazley.html">Beazley</a> è stato tutto sulla mappatura in quanto ci ha mostrato come mappare / eseguire varie operazioni su tutte le righe. Per esempio, <code>SELECT LENGTH(last_statement) FROM executions</code> mappa la funzione di lunghezza su tutte le righe. Questo capitolo ci ha mostrato come ridurre vari gruppi di dati utilizzando le funzioni di aggregazione e il capitolo <a href="innocence.html">Possibile innocenza</a> era semplicemente un caso speciale in cui l'intera tabella è un gruppop.</p>
</div>

Nel prossimo capitolo impareremo ad utilizzare i `JOIN` che ci permetteranno di lavorare con più tabelle.
