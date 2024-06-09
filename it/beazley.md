---
layout: it_tutorial
title: Le ultime parole di Beazley
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>
## Il caso Beazley
Nel 1994, Napoleon Beazley ha sparato all'imprenditore sessantatreenne John Luttig all'interno del suo garage mentre cercava di rubargli la macchina di famiglia. Grazie al fatto che avesse poco meno di diciotto anni al momento dell'omicidio, il caso di Beazley ha scatenato un acceso dibattito sulla pena di morte per i minorenni. Tre anni dopo l'esecuzione di Beazley, la Corte Suprema ha proibito l'esecuzione di trasgressori che abbiamo meno di diciotto anni al momento del fatto. ([Roper v Simmons, 2005](https://it.wikipedia.org/wiki/Roper_contro_Simmons)).

Il caso ha fatto clamore anche perché la vittima era il padre del giudice federale John Michael Luttig. Durante gli appelli alla Corte Suprema, tre dei nove giudici si sono ritirati a causa dei loro legami personali con il giudice Luttig, lasciandone solo sei a rivedere il caso.

Napoleon Beazley fece un ultima appassionata dichiarazione sostenendo che un approccio "occhio per occhio" non è un fondamento di giustizia. Il nostro compito è quello di recuperare questa dichiarazione del database.

<br>
<a name="first"></a>
## Una prima query SQL
<sql-exercise
  data-question="Esegui questa query per trovare le prime 3 righe della tabella 'executions'."
  data-comment="Visualizzare qualche riga è un buon modo per individuare le colonne di una tabella. Cerca di ricordare i nomi delle colonne per utilizzarli in seguito."
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

La query SQL può apparire come una normale frase, ma dovresti vederla com tre mattoncini Lego:
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
Come per i Lego, ciascun mattoncino ha una una forma fissa e i diversi mattoncini devono  essere posizionati in modi precisi per adattarsi.

<br>
<a name="select"></a>
## Il blocco SELECT 
Il blocco `SELECT` specifica quali colonne desideri recevere come output della query. Il suo formato è <code class='codeblock'>SELECT &lt;colonna&gt;, &lt;colonna&gt;, ...</code>. Ogni colonna indicata deve essere separata da una virgola ma lo spazio dopo la virgola è opzionale. TL'asterisco (`*`) è un carattere speciale che significa che vogliamo tutte le colonne contenute nella tabella.

<sql-exercise
  data-question="Nell'editor del codice qui sotto, modifica la query per selezionare la colonna last_statement oltre le colonne già presenti."
  data-comment="Dopo averlo fatto, premi Maiusc+Invio per eseguire la query."
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>
<div class="sideNote">
  <h3>Commenti SQL</h3>
  <p>Cliccando su "Show Solution" nell'editor viene visualizzata la soluzione preceduta dai caratteri <code>/*</code>. Il contenuto fra <code>/*</code> e <code>*/</code> è considerato un commento e non viene eseguito come codice. Questo è utile per nascondere temporaneamente il codice che non vogliamo eseguire. Per eseguire la soluzione, semplicemente cancella o commenta il tuo codice e togli il commento della soluzione.</p>
  <p>I caratteri <code>--</code> sono ancora un altro modo di identificare i commenti. Vengono usati per definire il resto di una singola riga come commento. Quando si desidera commentare più righe, i caratteri <code>/* ... */</code> sono più convenienti da usare rispetto all'anteporre <code>--</code> ad ogni riga.</p>
</div>

<br>
<a name="from"></a>
## Il blocco FROM
Il blocco <code>FROM</code> specifica la tabella da cui estraiamo i dati. Il suo formato + <code class="codeblock">FROM &lt;tabella&gt;</code>. Viene sempre scritto dopo il blocco <code>SELECT</code>.

<sql-exercise
  data-question="Esegui la query fornita e osserva l'errore che genera. and observe the error it produces. Correggi la query."
  data-comment="Rendi un'abitudine il fatto di esaminare i messaggi di errore quando qualcosa va storto. Evita il debug istintivo o per prova ed errore."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

Nel prossimo esempio, osserva che non abbiamo bisogno del blocco `FROM` se non utilizziamo nulla da una tabella.

<sql-exercise
  data-question="Modifica la query per dividere 50 e 51 per 2."
  data-comment="SQL supporta tutte le operazioni aritmetiche usuali."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

Non è strano che `51 / 2` restituisce `25` piuttosto che `25.5`? Questo succede perché SQL esegue una divisione intera. Per eseguire una divisione decimale, almeno uno degli operandi deve essere un decimale, per esempio `51.0 / 2`. Un trucchetto comune è di moltiplicare uno dei numero per `1.0` in modo da convertirlo in numero decimale. Questa soluzione sarà utile nei capitoli successivi.

<a name="capitalization"></a>
<div class="sideNote">
  <h3>Maiuscole</h3>
  <p>Anche se abbiamo scritto in maiuscolo <code>SELECT</code>, <code>FROM</code> e <code>LIMIT</code>, i comandi SQL non fanno distizione fra maiuscole e minuscole: non sono case-sensitive. Puoi notare che l'editor del codice li riconosce e li formatta come comandi a prescindere da lettere maiuscole e minuscole. Tuttavia, io consciglio di scriverli in maiuscolo in modo da differenziarli da nomi di colonne, tabelle e variabili.</p>
  <p>Anche i nomi di colonne, tabelle e variabili non sono case-sensitive in questa versione di SQL, anche se lo sono in molte altre versioni. Per andare sul sicuro, raccomando sempre di considerarli case-sensitive.</p>
</div>

<a name="whitespace"></a>
<div class="sideNote">
  <h3>Spazi bianchi</h3>
  <p>Il termine spazi bianchi si riferisce a spazi, tabulazioni, interruzioni di riga e altri caratteri che sono riprodotti come spazi vuoti sulla pagina. Come per le maiuscole, SQL non è molto attento agli spazi fintanto che non si possono confondere, unire, due parole in una. Questo significa che è necessario lasciare almeno un carattere di spazio attorno ad ogni comando — non importa quale o quanti ne utilizzi. A meno che non sia una query molto breve, io preferisco mettere ogni comando su una nuova riga per migliorarne la leggibilità.</p>

<sql-exercise
  data-question="Verifica che pasticciando con le maiuscole e gli spazi non crea problemi alla query."
  data-comment="Karla Tucker è stata la prima donna giustiziata in Texas dai tempi della guerra civile. Venne sottoposta alla pena capitale per aver ucciso due persone durante una rapina nel 1983."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>
</div>

<br>
<a name="where"></a>
## Il blocco WHERE
Il blocco `WHERE` ci permette di filtrare la tabella per cercare delle righe che rispettino certe condizioni. Il suo formato è <code class='codeblock'>WHERE &lt;condizione&gt;</code> e viene sempre scritto dopo il blocco `FROM`. In questo caso, la condizione si riferisce a una dichiarazione Booleana che il computer può valutare per scoprire se è vera o falsa come <code>ex_number = 145</code>. Puoi immaginare che il computer scorra ogni riga della tabella per controllare se la condizione è vera e, se lo è, restituisce la riga, o meglio le colonne selezionate con il blocco `SELECT`, in output.

<sql-exercise
  data-question="Trova nome, cognome e età (ex_age) dei detenuti con una età minore o uguale a 25 anni al momento dell'esecuzione."
  data-comment="Poiché in media i detenuti trascorrono nel braccio della morte 10.26 anni, solo 6 detenuti così giovani sono stati giustiziati in Texas dal 1976."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

È chiaro come possiamo utulizzare gli operatori aritmetici come `<` e `<=` per costruire le condizioni. Esiste anche una collezione di operatori su stringhe per lavorare su di esse.

La più potente fra queste è probabilmente <code>LIKE</code>. Permette di utilizzare caratteri jolly come `%` e `_` per combinare vari caratteri. Per esempio, `first_name LIKE '%roy'` darà risposta vera per le righe in cui il nome è 'roy', 'Troy' e 'Deroy' ma non 'royman'. Il carattere jolly `_` corrisponderà ad un singolo carattere quindi `first_name LIKE '_roy'` troverà solo 'Troy'.

<sql-exercise
    data-question="Modifica la query per trovare come risultato Raymond Landry."
    data-comment="Potresti pensare che sia un compito semplice dato che conosciamo già il suo nome e cognome. Tuttavia i set di dati sono raramente così ben definiti. Usa l'operatore LIKE così che tu non debba conoscere esattamente il nome esatto per trovare la riga corretta."
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
  <h3>Virgolette</h3>
  <p>In SQL, le stringhe sono identificate da virgolette singole. L'apice inverso (backticks in inglese, <code>`</code>) può essere utilizzato per dare i nome delle colonne e delle tabelle. Questo risulta comodo quando il nome di una colonna o di una tabella è lo stesso di una parola chiave in SQL keyword e quando vi è uno spazo al loro interno. È possibile avere un database con una tabella chiamata 'where' e una colonna 'from'. (Chi sarebbe così crudele da fare questo?!). Dovresti scrivere <code>SELECT `from` FROM `where` WHERE ...</code>. Questo è un altro esempio che ci fa capire perché usare le maiuscole nei comandi SQL ci può aiutare.</p>
</div>

Come hai visto nell'esercizio precedente, si possono realizzare condizioni complesse utilizzando operatori Booleani come `NOT`, `AND` e `OR`. SQL dà precedenza a `NOT` poi a `AND` e finalmente a `OR`. Ma se, come me, sei troppo pigro per ricordarti l'ordine delle precedenze, puoi sempre utilizzare le parentesi per chiarire l'ordine delle operazioni che desideri.

<sql-exercise
    data-question="Inserisci un paio di parentesi in modo tale che questa istruzione resitutisca come risultato 0."
    data-comment="Qui riteniamo che 1 significa vero e 0 significa falso."
    data-default-text="SELECT 0 AND 0 OR 1"
    data-solution="SELECT 0 AND (0 OR 1)"
    ></sql-exercise>

Facciamo un breve quiz per consolidare la tua comprensione.

<sql-quiz
  data-title="Seleziona i blocchi <code>WHERE</code> corretti."
  data-description="Questa domanda è difficile. Anche se indovini correttamente, leggi le spiegazioni per comprendere il ragionamento.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> e <code>0</code> sono le istruzioni Booleane più semplici. Questo blocco garantisce che nessuna riga verrà resitituita."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="L'operatore <code>==</code> verifica l'uguaglianza in molti linguaggi di programmazione; tuttavia il linguaggio SQL utilizza <code>=</code>."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="In una istruzione possono essere utilizzati più nomi di colonne."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="L'operatore 'maggiore o uguale a' è <code>>=</code>. L'ordine dei simboli corrisponde a ciò che dici in italiano."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="SQL può valutare la verità di quasi qualsiasi oggetto. La colonna 'ex_age' è piena di interi. La regola per gli interi è che il valore 0 corrisponde a falso e qualsiasi altro valore corrisponde a vero, quindi solo le righe con valori diversi da zero verranno considerate come risultato della query."
    data-correct="true"
    ></sql-quiz-option>
   <sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="Va bene utilizzare più di un carattere jolly. Ma la richiesta deve seguire l'operatore LIKE."
    ></sql-quiz-option>
    </sql-quiz>

Ora hai a disposizione gli strumenti che ti servono per completare il nostro progetto.
<sql-exercise
  data-question="Trova le ultime parole di Napoleon Beazley."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

Non è sorprendente quanto sia profondo ed eloquente Beazley? Ricorda che aveva solo 25 anni quando rilasciò questa dichiarazione e si trovava in prigione da quando ne aveva 18.

<br>
<a name="#recap"></a>
## Riassunto
Lo scopo di questo capitolo è quello di introdurre il semplice ma potente <code class="codeblock">SELECT &lt;colonna&gt; FROM &lt;tabella&gt; WHERE &lt;condizione&gt;</code>. Ci permette di filtrare una tabella in modo che il computer controlli riga per riga e scelga quelle per le quali la condizione in `WHERE` è vera. Abbiamo anche imparato anche come comporre condizioni abbastanza complesse che possono operare su colonne composte da stringhe, numeri e valori Booleani.

Fino ad ora abbiamo operato a livello di riga, cosa che ci limita aa esaminare i singoli dati puntuali. Nel prossimo capitoli ci focalizzaremo sulle aggregazioni che ci permetteranno di studiare i fenomeni a livello di sistema.