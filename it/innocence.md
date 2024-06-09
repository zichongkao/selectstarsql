---
layout: it_tutorial
title: Dichiarazioni di innocenza
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innoncence"></a>
## Possibile innocenza
Chi si oppone alla pena di morte sostiene che il rischio di giustiziare per errore un innocente è un costo troppo elevato da sostenere. In questo capitolo cercheremo di capire approssimativamente quante persone innocenti potrebbero essere state giustiziate.

Il principale indizio è che una dichiarazione di innocenza, anche se fatta sul letto di morte, non costituisce innocenza. Inoltre, anche se il detenuto stesse dicendo la verità, ci possono essere molte interpretazioni dell' innocenza: potrebbe essere stato accusato di due omicidi ma potrebbe essere innicente riguardo solo ad uno; oppure potrebbe avere ucciso un passante ma non il poliziotto. Questi non sono solo cavilli: in Texas, il solo omicidio non garantisce la pena capitale. Il detenuto potrebbe aver commesso un [crimine capitale](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes) come l'uccisione di un pubblico ufficiale di sicurezza o più persone. Quindi il detenuto può essere innocente in senso prettamente giuridico, anche se forse non secondo i comuni standard di moralità.

Tuttavia, c'è ancora qualcosa di inquitante nelle dichiarazioni di innocenza rilasciate al momento dell'esecuzione, quando le cose possono cambiare ben poco. Il nostro compito è di trovare quanto frequentemente accade calcolando la proporzione delle ultime dichiarazioni dove vi è una dichiarazione di innocenza.

<br>
<a name="aggregations"></a>
## Funzioni aggregate
Ci sono due numeri che abbiamo bisogno per calcolare questa proporzione:

&nbsp;&nbsp;**Numeratore**: il numero di esecuzioni con dichiarazione di innocenza.

&nbsp;&nbsp;**Denominatore**: il numero totale di esecuzioni.

Fino ad ora, ogni riga ricevuta come risposta alle interrogazioni proviene da una singola riga del database di input. Qui, invece, abbiamo sia il numeratore che il denominatore richiedono informazioni da più righe di input. Questo ci dice che abbiamo bisogno di utilizzare una funzione aggregata. "Aggregare" significa combinare più elementi in uno unico. In modo simile, le funzioni aggregate functions <i>prendono più righe di dati e le combinano per ottenere un unico numero.</i>


<br>
<a name="count"></a>
## La funzione COUNT
`COUNT` è probabilmente la funzione aggregata maggiormente utilizzata. Come suggerisce il nome, questa funzione conta le cose! Per esempio, <code class='codeblock'>COUNT(&lt;colonna&gt;)</code> restituisce il numero di righe non nulle nella colonna.

<sql-exercise
  data-question="Modifica la query per trovare quanti detenuti hanno rilasciato un'ultima dichiarazione."
  data-comment="Possiamo usare <code>COUNT</code> in quanto vi sono i <code>NULL</code> quanod non c'è alcuna dichiarazione."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

Come puoi intuire, la funzione `COUNT` è intrinsecamente legata al concetto di `NULL`. Facciamo una piccola digressione per capire cosa sono i valori `NULL`.
<a name="nulls"></a>
<div class="sideNote">
  <h3>Null</h3>
  <p>In SQL, <code>NULL</code> è il valore di un campo vuoto. Questo è differente dalla stringa vuota <code>''</code> e dal valore intero <code>0</code>, entrambi i quali <i>non</i> sono considerati <code>NULL</code>. Per verificare se un campo è <code>NULL</code>, usa <code>IS</code> e <code>IS NOT</code> invece di <code>=</code> e <code>!=</code>.</p>

  <sql-exercise
    data-question="Verifica che 0 e la stringa vuota non sono considerati NULL."
    data-comment="Ricorda che questa è una condizione composta. Entrambe le due condizioni <code>IS NOT NULL</code> devono essere vere affiché la query restituica <code>true</code>."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL) "
    ></sql-exercise>
</div>

Grazie a questo, possiamo trovare il denominatore della nostra proporzione:
<sql-exercise
data-question="Trova il numero totale di esecuzioni nel nostro dataset."
data-comment="Qui l'idea è di scegliere una delle colonne che sei sicuro non abbiano valori <code>NULL</code> e contarli."
data-default-text=""
data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Variazioni di COUNT
Per ora tutto bene. Ma cosa facciamo se non sappiamo quale colonna non contiene vaalori `NULL`? Ancora peggio, cosa facciamo se in tutte le colonne sono presenti valori `NULL`? Di sicuro ci deve essere un modo per trovare la lunghezza di una tabella!

La soluzionè è `COUNT(*)`. Ricorda `SELECT *` dove il simbolo `*` rappresenta tutte le colonne. In pratica, `COUNT(*)` counta le righe purché *almeno una* delle loro colonne non contenga valori `NULL` (ovvero, se una riga contiene tutti valori `NULL` non viene conteggiata). Questo ci aiuta a trovare quanto è lunga una tabella perché una tabella non dovrebbe avere righe con tutti i valori `NULL`.

<sql-exercise
data-question="Verifica che <code>COUNT(*)</code> restituisce lo stesso risultato della funzione precedente."
data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Un'altra variazione comune è quella di utilizzare un sottoinsieme della tabella. Ad esempio, si possono considerare solo le esecuzioni della contea di Harris. Dovremmo eseguire la query `SELECT COUNT(*) FROM executions WHERE county='Harris'` che filtra un insieme di dati più piccolo che consiste nelle esecuzioni  della contea di Harris e quindi ne conta le righe. Ma cosa fare se volessimo, allo stesso tempo, trovare il numero delle esecuzioni nella contea di Bexar?

La soluzione è di applicare un blocco `CASE WHEN` che agisce come una grande condizione if-else (se-allora). Possiede due forme e qeulla che preferisco è:

    CASE
        WHEN <condizione> THEN <risultato>
        WHEN <condizione> THEN <risultato>
        ...
        ELSE <risultato>
    END

Questa è di sicuro una delle parti meno eleganti di SQL. Un errore comune è quello di non scrivere il comando `END` e la condizione `ELSE` che viene eseguita nel caso in cui tutte le precedenti condizioni siano false. Ricorda anche, dal precedente capitolo, che le condizioni sono espressioni che possono essere valutate come vere o false. Questo rende importante pensare al valore booleano che risulta da qualunque cosa tu inserisca lì dentro.

<sql-exercise
data-question="Questa query cconta il numero delle esecuzioni delle contee di Harris e Bexar. Sostituisci le somme <code>SUM</code> con i c onteggi <code>COUNT</code> e modifica i blocchi <code>CASE WHEN</code> in modo che la query funzioni ugualmente."
data-comment="Il solo riscrivere i <code>SUM</code> come <code>COUNT</code> non è sufficiente perche i <code>COUNT</code> conteggiano gli 0 dato che 0 è un valore non null."
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
## Allentai

<sql-exercise
  data-question="Trova quanti detenuti avevano più di 50 anni al momento dell'esecuzione."
  data-comment="Questo mostra che il blocco <code>WHERE</code> crea un filtro prima che avvenga l'aggregazione dei dati."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Trova quanti detenuti hanno declinato la possibilità di pronunciare le loro ultime parole."
  data-comment="Come punto bonus, prova a farlo in tre modi diversi:<br> 1) con il blocco <code>WHERE</code>,<br> 2) Con un blocco <code>COUNT</code> e uno <code>CASE WHEN</code>,<br> 3) Con due funzioni <code>COUNT</code>."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

Vale la pena fare un passo indietro e pensare ai diversi modi in cui il computer ha gestito queste tre query. La versione con il  `WHERE` filtra i dati per creare una tabella più piccola mentre negli altri due modi deve verificare lungo tutta la tabella. Nella versione con `COUNT` + `CASE WHEN`, deve scorrere i dati solo una volta, mentre la versione con il doppio `COUNT` lo deve fare due volte. Quindi, anche se i risultati sono identici, il costo computazionale è probabilmente migliore nella prima vesrione e peggiore nella terza.

<sql-exercise
  data-question="Trova l'età minima, massima e media dei detenuti al momento dell'esecuzione."
  data-comment="Usa le funzioni aggregate <code>MIN</code>, <code>MAX</code> e <code>AVG</code>."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>
<div class="sideNote">
  <h3>Ricerca della documentazione</h3>
  <p>Questo libro non è stato pensato per essere in alcun modo una una guida completa per il linguaggio SQL. Per questo motivo, dovrai cercare altre risorse online. Di per sé, questa è una abilità che è bene padroneggiare perché dovrai cercare informazioni anche per anni dopo aver raggiunto una certa familiarità con il linguaggio.</p>
  <p>La buona notizia è che con il modello mentale che imparerai in questo libro, perché la ricerca sarà veloce e indolore in quanto dovrai solo controllare i dettagli, per esempio se la funzione è chiamata <code>AVERAGE</code> o <code>AVG</code> invece di capire quale approccio adottare.</p>
  <p>Per le mie ricerche spesso uso <a href="https://www.w3schools.com/sql/default.asp">W3 Schools</a>, Stack Overflow e la <a href="http://sqlite.org">documentazione ufficiale di SQLite</a>.</p>
</div>

<sql-exercise
  data-question="Trova la lunghezza media (basata sul conteggio dei caratteri) delle ultime dichiarazioni incluse nel set di dati."
  data-comment='Questo esercizio illustra che puoi comporre (nidificare) le funzioni. Cerca nella <a href="http://sqlite.org/lang_corefunc.html">documentazione</a> per capire quale funzione restituisce il numero di caratteri in una stringa.'
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="Elenca tutte le contee nel set di dati senza duplicazioni."
  data-comment="Possiamo ottenere valori non duplicati usando <code>SELECT DISTINCT</code>. Si veda la <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentazione</a>."
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` in realtà non è una funzione aggregata perché non restituisce un solo risultato e perché opera sull'output della query piuttosto che sulla tabella sottostante. Tuttavia, l'ho incluso qui perché condivide in comune la caratteristica di operare su più righe.

<br>
<a name="strange"></a>
## Una query strana
Prima di concludere, proviamo a guardare questa query:<br> `SELECT first_name, COUNT(*) FROM executions`.

Non è strana? Se possiedi un buon modello mentale di aggregazione, dovrebbe! `COUNT(*)` cerca di restituire un solo valore che consiste nella lunghezza della tabella delle esecuzioni. `first_name` cerca di restituire un valore per ogni riga. Il computer restituirà una o più righe? Se ne restituisce una, quale `first_name` dovrebbe scegliere? Se ne restituisce più di una, dovrebbe replicare il risultato `COUNT(*)` su tutte le righe? Le forme dell'output semplicmente non corrispondono!

<sql-exercise
  data-question="Proviamo comunque e vediamo cosa succede."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

In practica, il database cerca di restituire qualcosa di sensato anche se gli chiedi cose senza senso. In questo caso, il nostro database prende il nome (first name) dall'ultima riga della nostra tabella. Poichè la tabella è in ordine cronologico inverso, l'ultima riga riguarda Charlie Brooks Jr., la prima persona giustiziata da quando la Corte Suprema ha revocato il divieto della pena di morte. Database differenti avrebbero gestito questa query diversamente quindi è meglio non fare affidamento sul loro comportamento predefinito. Se sai di voler estrarre l'ultima riga, dovrai trovarla esplicitamente. Molti dialetti SQL hanno la funzione aggregata `LAST` che rende questa operazione banale. Sfortunatamente non è il caso di SQLite, quindi dobbiamo trovare una soluzione alternativa.

<a name="dialects"></a>
<div class="sideNote">
  <h3>Dialetti SQL e database</h3>
  <p>Anche se abbiamo detto che è un libro su SQL, se vogliamo essere puntigliosi in realtà è un libro su <i>SQLite</i>. Questo perché SQL un concetto immaginario, un ideale platonico. In realtà esistono soltanto dialetti che cercano di rispettare le specifiche SQL.</p>
  <p>Per di più, SQL è sottospecificato, il che significa che alcune funzionalità non sono specificate dagli standard. Per esempio, gli standard non dicono se la funzione che trova la lunghezza di una stringa si dovrebbe chiamare <code>LEN</code> (come nel linguaggio SQL Server) o <code>LENGTH</code> (SQLite); o di come dovrebbero essere racchiusi tra virgolette gli identificatori di nomi per tabelle o colonne (<code>`</code> in MySQL, <code>"</code> in SQLite).</p>
  <p>Per peggiorare ulteriormente le cose, anche una singola query in un dato dialetto può essere eseguita in modo diverso in quanto il database sottostante può avere differenti architetture. Per esempio, il dialetto PostgreSQL può essere utilizzato sia su database fisicamente distribuiti su più macchine, sia su database racchiusi in un singolo file. Questo significa che i modelli mentali che vogliamo sviluppare qui sono solo un aiuto, un supporto. Potrebbero non riflettere esattamente ciò che sta facendo realmente il database.</p>
  <p>Abbiamo scelto SQLite, che è sia un dialetto sia una implementazione, perché è uno dei database più utilizzati. Abbiamo cercato di concentrarci sulle funzionalità principali e il modello mentale di SQL piuttosto sulle parti specifiche di SQLite. Grazie ad un robusto modello mentale è facile passare tra i dialetti SQL e i database.
  </p>
</div>

<br>
<a name="recap"></a>
## Conclusioni e riepilogo
Utilizziamo quanto abbiamo imparato fino ad ora per copletare il nostro compito:
<sql-exercise
  data-question="Trova il rapporto di detenuti con affermazioni di innocenza nelle loro ultime dichiarazioni."
  data-comment="Per eseguire una divisione decimale, assicurati che uno dei numeri sia un decimale multiplicandolo per 1.0. Usa <code>LIKE '%innocent%'</code> per trovare le affermazioni di innocenza."
  data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

Questo metodo per trovare le affermazioni di innocenza è di sicuro piuttosto impreciso: l’innocenza può essere espressa utilizzando altri termini come "non colpevole". Tuttavia sospetto che sottostimi il numero corretto anche se probabilmente è dell'ordine di grandezza corretto. La domanda che ci rimane, quindi, è se vogliamo accettare la possibilità che fino al 5% percento delle persone che noi giustiziamo sono, in realtà, innocenti. ([Paul Graham non lo accetta.](http://paulgraham.com/prop62.html))

Per riassumere, ci siamo spostati da operazioni a livello di riga nel precedente capitolo a funzioni utilizzate per aggregare più righe di un insieme di dati. Questo ha aperto la strada a studiare il comportamento a livello di sistema. Nella prossima sezione impareremo ad applicare le funzioni aggregate a più sottoinsiemi del set di dati utilizzando il blocco `GROUP BY`.
