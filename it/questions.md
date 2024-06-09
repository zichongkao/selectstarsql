---
layout: it_tutorial
title: Osservazioni finali e domande sfidanti
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## Osservazioni finali
Grazie per essere rimasto fino alla fine! Spero sia stata una lettura piacevole e illuminante.

Arrivati a questo punto, abbiamo coperto la maggior parte dei più importanti comandi e funzioni di SQL, ma spero che gli insegnamenti più importanti riguardino le tecniche e le modalità per pensare alle query. Alcune delle più importanti sono:
 - <p>confrontare le dimensioni delle tabelle disponibili con il risultato desiderato per decidere quali aggregazioni eseguire.</p>
 - <p>Esaminare dove sono posizionate le informazioni di cui abbiamo bisogno. In una riga adiacente? In un gruppo? O in un intero dataset?</p>
 - <p>Interpretare le query con la corretta struttura logica. Per esempio, vedere le condizioni come vero o falso; vedere <code>&lt;tabella1&gt; JOIN &lt;tabella2&gt; ON ...</code> come una grande tabella.</p>

Procedendo, per completare la tua formazione in SQL, probabilmente vale la pena dare uno sguardo alle funzioni finestra e alle più comuni espressioni di tabella. Puoi replicare il loro comportamento con le tecniche che hai imparato qui, tuttavia ti renderanno la vita decisamente più semplice e ti introdurranno ad un nuovo e prezioso paradigmo. Ho omesso questi concetti in quanto, quando ho scritto questo documento, SQLite [non supportava le funzioni finestra](https://www.sqlite.org/windowfunctions.html#history) e desiderato evitare la complessità di un nuovo database e un altro dialetto SQL.

Fino ad ora abbiamo imparato solo a consumare dati (eseguire query). C'è una intera altra branca di SQL per manipolare i dati: si occupa di azioni quali la creazione delle tabelle, l'inserimento o la cancellazione dei dati. Comprendere questi concetti può essere utile anche se non dovrai amministrare database in quanto ti aiutano a capire, fra le altre cose, perché le tabelle sono strutturate nel modo in cui lo sono.

Ancora più importante, hai ancora bisogno di molta pratica per essere efficace sui problemi del mondo reale. La prossima sezione ti fornirà alcuni esercizi ma la difficoltà aumenterà bruscamente. Potresti volere uscire nel mondo reale e mettere in pratica quanto abbiamo trattato finora e tornare quando sarai pronto.

<br />
<a name="challenge_questions"></a>
## Domande di sfida
Gli esercizi nei precedenti capitoli erano pernsati per ridurre la complessità così da creare un ambiente stimolante. Questo capitolo segna il confine con il selvaggio mondo dei problemi SQL. L'idea è quella della prova del fuoco: le domande sono ottimizzate per l'utilità piuttosto che per la facilità di apprendimento. Anche i programmatori SQL esperti potrebbero avere delle difficoltà. C’è molto valore in questa lotta.

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>Chiamata per i problemi</H3>
  <p>I buoni problemi creano o distruggono un tutorial. Se hai un'idea per un nuovo problema o una sezione, mi piacerebbe aiutarti a pubblicarla qui, dandoti tutto il merito. Mandami una email a <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> o invia una <a href="https://github.com/zichongkao/selectstarsql">pull request</a>. Ricorda che i buoni problemi non sono necessariamenti difficili&mdash;mostrano tecniche che hanno applicazioni ad ampio raggio.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Set di dati sulla cosponsorizzazione del Senato
### Autore: Kao
In questa sezione, introduciamo un nuovo dataset dalla 114a sessione dle Congresso (2015-2016) <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">refatta da James Fowler e altri</a>. Ho rielaborato il dataset per permetterci di studiare le relazioni di cosponsorizzazione tra senatori.

Il senatore che presenta il disegno di legge si chiama lo "sponsor". Altri senatori possono mostrare il loro sostegno cosponsorizzando il disegno di legge. I cosponsor al momento della proposta del disegno di legge sono chiamati "cosponsor originario" (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">fonte</a>). Ciascuna riga della tabella riporta il disegno di legge, lo sponsor, un cosponsor originario e gli stati rappresentati dai senatori. Ricorda presente che possono esserci più cosponsor di una disegno di legge.

<sql-exercise
  data-question="Guarda questo dataset."
  data-comment="Con 15K righe, è un po' più grande del dataset del Texas dataset quindi è meglio non stampare tutto."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="Trova il senatore con più connessioni, cioè quello con il maggior numero di co-ponsorizzazioni reciproche."
  data-comment="Una cosponsorizzazione reciproca si riferisce a due senatori che hanno ciascuno cosponsorizzato un disegno di legge sponsorizzato dall'altro. Anche se una coppia di senatori ha collaborato a molti progetti di legge, il rapporto conta comunque come uno solo."
  data-solution="
WITH mutuals AS (
  SELECT DISTINCT
    c1.sponsor_name AS senator,
    c2.sponsor_name AS senator2
  FROM cosponsors c1
  JOIN cosponsors c2
    ON c1.sponsor_name = c2.cosponsor_name
    AND c2.sponsor_name = c1.cosponsor_name
)

SELECT senator, COUNT(*) AS mutual_count
FROM mutuals
GROUP BY senator
ORDER BY mutual_count DESC
LIMIT 1 "
  ></sql-exercise>

<sql-exercise
  data-question="Ora trova il senatore con più connessioni per ciascuno stato."
  data-comment="Se ci sono più senatori in parità, mostrali tutti. Restituisci le colonne corrispondenti al conteggio di stato, senatore e cosponsorizzazione reciproca."
  data-solution="
WITH mutual_counts AS (
  SELECT
    senator, state, COUNT(*) AS mutual_count
  FROM (
    SELECT DISTINCT
      c1.sponsor_name AS senator,
      c1.sponsor_state AS state,
      c2.sponsor_name AS senator2
    FROM cosponsors c1
    JOIN cosponsors c2
      ON c1.sponsor_name = c2.cosponsor_name
      AND c2.sponsor_name = c1.cosponsor_name
    )
  GROUP BY senator, state
),

state_max AS (
  SELECT
    state,
    MAX(mutual_count) AS max_mutual_count
  FROM mutual_counts
  GROUP BY state
)

SELECT
  mutual_counts.state,
  mutual_counts.senator,
  mutual_counts.mutual_count
FROM mutual_counts
JOIN state_max
  ON mutual_counts.state = state_max.state
  AND mutual_counts.mutual_count = state_max.max_mutual_count
"
  ></sql-exercise>

<sql-exercise
  data-question="Trova i senatori che hanno cosponsorizzato ma non hanno sponsorizzato alcun progetto di legge."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
 ON c1.cosponsor_name = c2.sponsor_name
 -- Questa join identifica i cosponsor
 -- che hanno sponsorizzato dei disegni di legge
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + NULL è un trucchetto per escludere delle
-- righe. È più efficiente di WHERE ... NOT IN.
"
  ></sql-exercise>

