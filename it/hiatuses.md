---
layout: it_tutorial
title: Interruzioni dell'esecuzione
dbFile: data/tx_deathrow_small.db
---

<a name="hiatuses"></a>
## Interruzioni
Questo grafico mostra le esecuzioni nel tempo.<img src="../imgs/exno_time.png"> Puoi notare che ci sono stati diversi lunghi periodi in cui non hanno avuto luogo esecuzioni. Il nostro obiettivo è capire esattamente quando si sono verificati e ricercarne le cause.

La nostra strategia è portare la tabella in uno stato in cui ogni riga contiene anche la data di esecuzione precedente. Possiamo quindi trovare la differenza tra le due date, ordinarle in ordine decrescente e leggere le pause più lunghe.

<br>
<a name="joins"></a>
## Pensando ai Join (unioni)
Nessuna delle tecniche che abbiamo imparato finora è adeguata in questo caso. La tabella desiderata ha la stessa lunghezza della tabella `executions`, quindi possiamo escludere aggregazioni che producono una tabella più piccola. Il capitolo [Beazley](beazley.html) ci ha insegnato solo le operazioni sulle righe che ci limitano a lavorare con le informazioni già presenti nelle righe. Poiché la data dell'esecuzione precedente si trova all'esterno di una determinata riga, dobbiamo utilizzare "JOIN" per inserire informazioni aggiuntive.

Supponiamo che le informazioni aggiuntive che vogliamo siano in una tabella chiamata `previous` che ha due colonne `(ex_number, last_ex_date)`. Saremmo in grado di eseguire la seguente query per completare la nostra attività:

    SELECT
      last_ex_date AS start,
      ex_date AS end,
      ex_date - last_ex_date AS day_difference
    FROM executions
    JOIN previous
      ON executions.ex_number = previous.ex_number
    ORDER BY day_difference DESC
    LIMIT 10

In questa sezione ci soffermeremo sul blocco `JOIN`. Invece di vederla come una riga di codice a sé stante, spesso è utile vederla in questo modo: <img src="../imgs/join_correctview.png"> Così si enfaticca come `JOIN` crea una grande tabella combinata che viene poi inserita nel blocco `FROM` esattamente come qualsiasi altra tabella.
<a name="disam_cols"></a>
<div class="sideNote">
  <h3>Discernere le colonne</h3>
  <p>La precedente query è notevole perché la condizione <code>executions.ex_number = previous.ex_number</code> utilizza il formato <code>&lt;table&gt;.&lt;column&gt;</code> per specificare le colonne. Questo è necessario solo qui perché entrambe le tabelle hanno una colonna chiamata  <code>ex_number</code>.</p>
</div>

<br>
<a name="join_types">
## Tipi di Join (unione)
Il blocco `JOIN` prende la forma di  <code class='codeblock'>&lt;tabella1&gt; JOIN &lt;tabella&gt; ON &lt;condizione&gt;</code>. La condizione funziona allo stesso modo che in <code class='codeblock'>WHERE &lt;condizione&gt;</code>. Si tratta di una istruzione che dà come risultato vero o falso e ogni volta che una riga della prima tabella e un'altra della seconda rendono vera la condizione, le due righe vengono unite:
<img src="../imgs/join_base.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Ma cosa succede alle righe che non hanno corrispondenze? In questo caso, la tabella `previous` non ha una riga per l'esecuzione numero 1 perché non ci sono esecuzioni precedenti ad essa.
<img src="../imgs/join_unmatched.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Il comando <code>JOIN</code> per impostazione predefinita esegue quello che viene chiamato "inner join": eliminate le righe vengono eliminate.
<img src="../imgs/join_inner.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Per preservare tutte le righe della tabella di sinistra, usiamo un <code>LEFT JOIN</code> al posto del comune <code>JOIN</code>. Le parti vuote della riga vengono lasciate intatte: saranno valutate come valori <code>NULL</code>.
<img src="../imgs/join_left.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Il <code>RIGHT JOIN</code> può essere usato per preservare le righe senza corrispondenza nella tabella di destra, e <code>OUTER JOIN</code> per preservare le righe senza corrispondenza di entrambe le tabelle.

L'ultima sottigliezza gestisce più casi. Pensiamo di avere una tabella `duplicated_previous` che contine due copie di ciascuna riga della tabella `previous`. Ciascuna riga di `executions` ora corrisponde a due righe in `duplicated_previous`.
<img src="../imgs/join_dup_pre.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">
Il join crea abbastanza righe di `executions` in modo che ogni riga corrispondente di `duplicated_previous` abbia il proprio partner. In questo modo, i join possono creare tabelle che sono più grandi dei loro costituenti.
<img src="../imgs/join_dup_post.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">

<sql-quiz
  data-title="Segna le affermazioni vere."
  data-description="Supponi di avere una tabella A con 3 righe e una tabella B con 5 righe.">
<sql-quiz-option
    data-value="cartesian_prod"
    data-statement="<code>tableA JOIN tableB ON 1</code> ritorna 15 righe."
    data-hint="La condizione <code>ON 1</code> è sempre vera, quindi ogni riga della tabella A confrontata con ogni riga della tabella B."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="bad_cartesian"
    data-statement="<code>tableA JOIN tableB ON 0</code> ritorna 0 righe."
    data-hint="Per la stessa ragione per cui <code>ON 1</code> ritorna 15 righe."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="left_join_bad"
    data-statement="<code>tableA LEFT JOIN tableB ON 0</code> ritorna 3 righe."
    data-hint="La left join preserva tutte le righe della tabella A anche se non corrisponde con alcuna riga della tabella B."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="outer_join_bad"
    data-statement="<code>tableA OUTER JOIN tableB ON 0</code> ritorna 8 righe."
    data-hint="L'outer join preserva tutte le righe della tabella A e della tabella B anche se nessuna è appaiata."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="outer_join_good"
    data-statement="<code>tableA OUTER JOIN tableB ON 1</code> ritorna 15 righe."
    data-hint="Tutte le righe della tabella A corrispondono a tutte le righe della tabella B a causa della condizione<code>ON 1</code> quindi qualsiasi join ritornerà 15 righe. I diversi join differiranno solo nel modo in cui gestiranno le righe senza corrispondenza."
    data-correct="true"></sql-quiz-option>
</sql-quiz>

<br>
<a name="dates"></a>
## Date
Prendiamoci una pausa dai join e osserviamo questa riga nel nostro modello di query:

      ex_date - last_ex_date AS day_difference

Abbiamo dato per scontato che possiamo sottrarre le date l'una dall'altra. Ma immagina di essere il computer che riceve una riga come questa. Restituirai il numero di giorni tra le date? Perché non le ore o i secondi? A peggiorare le cose, SQLite in realtà non ha tipi di data o ora (a differenza della maggior parte degli altri dialetti SQL) quindi le colonne `ex_date` e `last_ex_date` ti appaiono come normali stringhe. È come se ti venisse chiesto di fare `'hello' - 'world'`. Cosa significa?

Fortunatamente, SQLite contiene una serie di funzioni per dire al computer: "Ehi, queste stringhe che ti sto passando contengono effettivamente date o ore. Agisci su di loro come faresti con una data."

<sql-exercise
 data-question='Consulta <a href="https://www.sqlite.org/lang_datefunc.html">la documentazione</a> per correggere la query in modo che restituisca il numero di giorni tra le date.'
 data-default-text="SELECT '1993-08-10' - '1989-07-07' AS day_difference"
 data-solution="
SELECT JULIANDAY('1993-08-10') - JULIANDAY('1989-07-07') AS day_difference"
></sql-exercise>

<br>
<a name="self_joins"></a>
## Self Join
Con ciò che abbiamo imparato sulle date, possiamo correggere la nostra query modello:

    SELECT
      last_ex_date AS start,
      ex_date AS end,
      JULIANDAY(ex_date) - JULIANDAY(last_ex_date)
        AS day_difference
    FROM executions
    JOIN previous
      ON executions.ex_number = previous.ex_number
    ORDER BY day_difference DESC
    LIMIT 5

Il prossimo passo è costruire la tabella `previous`.
<sql-exercise
  data-question="Scrivi una query che produca la tabella <code>previous</code>."
  data-comment="Ricordati di utilizzare gli alias per formare i nomi delle colonne <code>(ex_number, last_ex_date)</code>. Suggerimento: invece di spostare le date indietro, potresti spostare <code>ex_number</code> in avanti!"
  data-solution="
SELECT
  ex_number + 1 AS ex_number,
  ex_date AS last_ex_date
FROM executions
WHERE ex_number < 553"></sql-exercise>

Ora possiamo annidare questa query all'interno del modello sopra:
<sql-exercise
data-question="Annida la query che crea la tabella <code>previous</code> nel template."
data-comment='Nota che qui stiamo utilizzando un alias di tabella, denominando il risultato della query nidificata "previous".'
data-default-text="SELECT
last_ex_date AS start,
ex_date AS end,
JULIANDAY(ex_date) - JULIANDAY(last_ex_date)
AS day_difference
FROM executions
JOIN (<your-query>) previous
ON executions.ex_number = previous.ex_number
ORDER BY day_difference DESC
LIMIT 10"
data-solution="
SELECT
last_ex_date AS start,
ex_date AS end,
JULIANDAY(ex_date) - JULIANDAY(last_ex_date) AS day_difference
FROM executions
JOIN (
SELECT
ex_number + 1 AS ex_number,
ex_date AS last_ex_date
FROM executions
) previous
ON executions.ex_number = previous.ex_number
ORDER BY day_difference DESC
LIMIT 10"
></sql-exercise>

`previous` è derivata da `executions`, quindi stiamo eseguendo un join di `executions` su sé stessa. Questo viene chiamato "self join" ed è una potente tecnica per consentire alle righe di ottenere informazioni da altre parti della stessa tabella.

Abbiamo creato la tabella `previous` per chiarire a cosa serve. Tuttavia possiamo anche scrivere la query in modo più eleganteeseguendo il join della tabella `executions` direttamente su sé stessa.
<sql-exercise
  data-question="Riempi la condizione <code>JOIN ON</code> per completare una versione più elegante della query precedente."
  data-comment="Tieni presente che dobbiamo ancora fornire un alias a una copia per assicurarci di potervi fare riferimento in modo inequivocabile."
  data-default-text="SELECT
  previous.ex_date AS start,
  executions.ex_date AS end,
  JULIANDAY(executions.ex_date) - JULIANDAY(previous.ex_date)
    AS day_difference
FROM executions
JOIN executions previous
  ON <your-clause>
ORDER BY day_difference DESC
LIMIT 10"
  data-solution="
SELECT
  previous.ex_date AS start,
  executions.ex_date AS end,
  JULIANDAY(executions.ex_date) - JULIANDAY(previous.ex_date)
    AS day_difference
FROM executions
JOIN executions previous
  ON executions.ex_number = previous.ex_number + 1
ORDER BY day_difference DESC
LIMIT 10"
></sql-exercise>

Ora possiamo utilizzare le date precise delle interruzioni per ricercare cosa è successo in ciascun periodo. Negli anni immediatamente successivi alla revoca del divieto della pena capitale, si sono verificati lunghi periodi senza esecuzioni a causa del basso numero di condanne a morte, oltre alle sfide legali contro la nuova legge. Escludiamo quindi gli intervalli precedenti al 1993 e ci concentriamo sulle due principali interruzioni successive.<img src="../imgs/exno_time_annotated.png">

La prima pausa è dovuta a contestazioni legali al <a href="https://en.wikipedia.org/wiki/Antiterrorism_and_Effective_Death_Penalty_Act_of_1996">Antiterrorism and Effective Death Penalty Act del 1996</a> creato in risposta agli attentati del World Trade Center del 1993 e a Oklahoma City del 1995. La legge ha limitato il processo di appello per rendere la pena di morte più efficace soprattutto per i casi di terrorismo (<a href="https://deathpenaltyinfo.org/documents/1996YearEndRpt.pdf">Source</a>).

La seconda pausa è stata causata da una sospensione emanata dalla Corte Suprema mentre valutava la sentenza <a href="https://en.wikipedia.org/wiki/Baze_v._Rees">Baze v. Rees</a> che ha esaminato se l'iniezione letale viola l'ottavo emendamento che proibisce "punizioni crudeli e insolite". Questo ha influenzato le esecuzioni in tutta l'America perché la maggior parte degli stati utilizzava lo stesso cocktail di farmaci del Kentucky. La Corte Suprema alla fine confermò la decisione del tribunale del Kentucky e le esecuzioni in Texas ripresero pochi mesi dopo.

<br>
<a name="recap"></a>
## Riepilogo

L'idea dietro i `JOIN` è stata quella di creare una tabella aumentata perché l'originale non conteneva le informazioni di cui avevamo bisogno. Questo concetto è potente perché ci libera dalle limitazioni di una singola tabella e ci consente di combinare più tabelle in modi potenzialmente complessi. Abbiamo anche visto che con questa complessità aggiuntiva, una verifica meticolosa diventa importante. Creare alias di tabelle, ridenominare le colonne e definire buone condizioni di `JOIN ON` sono tutte tecniche che ci aiutano a mantenere l'ordine.
