---
layout: pt_br_tutorial
title: A Cauda Longa
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>

## Caudas Longas

Caudas longas se referem a pequenos números de amostras que ocorrem um grande número de vezes. Quando representamos esses dados graficamente, eles formam uma pequena faixa bem à direita do centro de massa que se parece com uma cauda. Elas indicam a presença de valores discrepantes cujo comportamento incomum pode ser de nosso interesse.<img src="/imgs/execution_tail.png"> No contexto das execuções no Texas, a cauda longa se refere a um pequeno número de condados que são conhecidos por realizar um grande número de execuções.

Vamos encontrar a porcentagem de execuções de cada condado para que possamos identificar aquelas que estão na cauda.

Como ficará cada vez mais evidente, o formato das tabelas nos diz muito sobre as operações que precisamos realizar. (Isso é análogo à análise dimensional na física.) Neste caso, podemos perceber que os métodos que cobrimos até agora são inadequados: o capítulo [Beazley](beazley.html) lidou com linhas individuais de dados, mas está claro que precisamos fazer alguma agregação para encontrar dados por condado. O capítulo [Alegações de Inocência](innocence.html) nos ensinou agregação, mas essas funções acabariam agregando o conjunto de dados em uma única linha quando, na verdade, queremos uma linha por condado.

<br>
<a name="groupby"></a>
## O Bloco GROUP BY
É aqui que entra o bloco `GROUP BY`. Ele nos permite dividir o conjunto de dados e aplicar funções de agregação dentro de cada grupo, resultando em uma linha por grupo. Sua forma mais básica é <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> e vem depois do bloco `WHERE`.

<sql-exercise
  data-question="Esta consulta obtém as contagens de execuções por condado."
  data-default-text="SELECT
  county,
  COUNT(*) AS county_executions
FROM executions
GROUP BY county"></sql-exercise>

Se você se lembra de <a href='innocence.html#strange'>Uma Consulta Estranha</a>, sinais de alerta estariam aparecendo na sua cabeça. Nós não acabamos de aprender a não misturar colunas agregadas e não agregadas? A diferença aqui é que as colunas de agrupamento são as únicas colunas permitidas para não serem agregadas. Afinal, todas as linhas nesse grupo devem ter os mesmos valores nessas colunas, então não há ambiguidade no valor que deve ser retornado.

Você também pode ter notado nosso uso de `AS`. É o que chamamos de "aliasing" (criação de apelidos). No bloco `SELECT`, <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> fornece um apelido que pode ser consultado posteriormente na consulta. Isso nos poupa de reescrever expressões longas e permite esclarecer o propósito da expressão.

<sql-exercise
data-question="Esta consulta conta as execuções com e sem declarações finais. Modifique-a para dividir ainda mais os dados por condado."
data-comment="A cláusula <code>last_statement IS NOT NULL</code> funciona como uma variável indicadora, onde 1 significa verdadeiro e 0 significa falso."
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
## O Bloco HAVING
Este próximo exercício ilustra que a filtragem pelo bloco `WHERE` acontece antes do agrupamento e da agregação. Isso é refletido na ordem da sintaxe, já que o bloco `WHERE` sempre precede o bloco `GROUP BY`.

<sql-exercise
data-question="Conte o número de detentos com 50 anos ou mais que foram executados em cada condado."
data-comment="Você deve conseguir fazer isso usando <code>CASE WHEN</code>, mas tente usar o bloco <code>WHERE</code> aqui."
data-default-text=""
data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"

></sql-exercise>

Tudo isso está correto, mas o que acontece se quisermos filtrar o resultado do agrupamento e da agregação? Certamente não podemos avançar no futuro e pegar informações de lá. Para resolver esse problema, usamos `HAVING`.

<sql-exercise
data-question="Liste os condados nos quais mais de 2 detentos com 50 anos ou mais foram executados."
data-comment="Isso é uma continuação do exercício anterior. Precisamos de um filtro adicional — um que use o resultado da agregação. Isso significa que ele não pode existir no bloco <code>WHERE</code>, porque esses filtros são executados antes da agregação. Consulte o <a href='https://www.w3schools.com/sql/sql_having.asp'><code>bloco HAVING</code></a>. Você pode pensar nele como um bloco <code>WHERE</code> pós-agregação."
data-default-text=""
data-solution="
SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(*) > 2"

></sql-exercise>

<br>
## Prática
Este questionário foi criado para desafiar sua compreensão. Leia as explicações mesmo se você acertar tudo.

<sql-quiz
  data-title="Marque as afirmações que são verdadeiras."
  data-description="Esta consulta encontra o número de detentos de cada condado e faixa etária de 10 anos. <pre>
SELECT
  county,
  ex_age/10 AS decade_age,
  COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
<sql-quiz-option
    data-value="valid"
    data-statement="A consulta é válida (ou seja, não causará um erro quando executada)."
    data-hint="Você ficou confuso com <code>ex_age/10</code>? Agrupar por colunas transformadas também é permitido."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="gran"
    data-statement="A consulta retornaria mais linhas se usássemos <code>ex_age</code> em vez de <code>ex_age/10</code>."
    data-hint="Lembre-se de que <code>ex_age/10</code> faz uma divisão inteira que arredonda todas as idades. Isso produz menos grupos únicos."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="unique_combocc"
    data-statement="A saída terá tantas linhas quanto existirem combinações únicas de condados e decade_ages no conjunto de dados."
    data-hint="Isso está correto."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-statement="A saída terá um grupo ('Bexar', 6) mesmo que nenhum detento do condado de Bexar tivesse entre 60 e 69 anos no momento da execução."
    data-hint="O bloco <code>GROUP BY</code> encontra todas as combinações <i>no conjunto de dados</i>, em vez de todas as combinações teoricamente possíveis."
    data-value="abstract_cartesian"></sql-quiz-option>
<sql-quiz-option
    data-statement="A saída terá um valor diferente de county para cada linha retornada."
    data-hint="Isso seria verdade apenas se <code>county</code> fosse a única coluna de agrupamento. Aqui, podemos ter muitos grupos com o mesmo county, mas com decade_ages diferentes."
    data-value="one_col_diff"></sql-quiz-option>
<sql-quiz-option
    data-statement="A saída pode ter grupos onde a contagem é 0."
    data-hint="Isso é semelhante à pergunta sobre ('Bexar', 6). Se não houver linhas com ('Bexar', 6), o grupo nem aparecerá."
    data-value="count_zero"></sql-quiz-option>
<sql-quiz-option
    data-statement="A consulta seria válida mesmo sem especificar <code>county</code> no bloco <code>SELECT</code>."
    data-hint="As colunas de agrupamento não precisam necessariamente estar no bloco <code>SELECT</code>. Seria válido, mas não faria muito sentido porque não saberíamos quais contagens correspondem a qual condado."
    data-value="missing_gp_col"
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-statement="É razoável adicionar <code>last_name</code> ao bloco <code>SELECT</code> mesmo sem agrupá-lo."
    data-hint="Mesmo que isso fosse válido (no SQLite) pelos motivos apresentados em <a href='innocence.html#strange'>Uma Consulta Estranha</a>, é uma prática ruim ter colunas não agregadas e que não são de agrupamento no bloco <code>SELECT</code>."
    data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>

<sql-exercise
data-question="Liste todos os condados distintos no conjunto de dados."
data-comment="Fizemos isso no capítulo anterior usando o comando <code>SELECT DISTINCT</code>. Desta vez, use o <code>SELECT</code> comum e utilize <code>GROUP BY</code>."
data-default-text=""
data-solution="SELECT county FROM executions GROUP BY county"

></sql-exercise>

<br>
<a name="nested"></a>
## Consultas Aninhadas
Agora, você pode perguntar: não teríamos terminado se pudéssemos simplesmente executar algo assim?

    SELECT
      county,
      PERCENT_COUNT(*)
    FROM executions
    GROUP BY county

Porcentagens são uma métrica tão comum — uma função assim não deveria existir? Infelizmente não, e talvez por uma boa razão: uma função assim precisaria agregar tanto dentro dos grupos (para obter o numerador) quanto em todo o conjunto de dados (para obter o denominador). Mas cada consulta ou tem um bloco `GROUP BY` ou não tem. Então o que realmente precisamos são duas consultas separadas, uma que agrega com um `GROUP BY` e outra que agrega sem ele. Podemos então combiná-las usando uma técnica chamada "aninhamento".

Aqui está um exemplo de como o aninhamento funciona. Os parênteses são importantes para demarcar o limite entre a consulta interna e a externa:

<sql-exercise
  data-question="Encontre o primeiro e o último nome do detento com a declaração final mais longa (por quantidade de caracteres)."
  data-comment="Escreva uma consulta adequada para aninhar em &lt;<code>length-of-longest-last-statement</code>&gt;."
  data-default-text="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (<length-of-longest-last-statement>)"
  data-solution="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (SELECT MAX(LENGTH(last_statement))
     FROM executions)"></sql-exercise>

Repetindo, o aninhamento é necessário aqui porque, na cláusula `WHERE`, enquanto o computador inspeciona uma linha para decidir se sua declaração final tem o tamanho correto, ele não pode olhar para fora para descobrir o tamanho máximo em todo o conjunto de dados. Precisamos encontrar o tamanho máximo separadamente e alimentá-lo na cláusula. Agora vamos aplicar o mesmo conceito para encontrar a porcentagem de execuções de cada condado.

<sql-exercise
data-question="Insira a consulta &lt;<code>count-of-all-rows</code>&gt; para encontrar a porcentagem de execuções de cada condado."
data-comment="<code>100.0</code> é um decimal, então podemos obter porcentagens decimais."
data-default-text="SELECT
county,
100.0 * COUNT(*) / (<count-of-all-rows>)
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

Eu inseri silenciosamente um bloco `ORDER BY`. Seu formato é <code class="codeblock">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> e ele pode ser modificado adicionando `DESC` se você não quiser a ordem crescente padrão.

<br>
<a name="harris"></a>
## Condado de Harris
É surpreendente que Harris (lar da cidade de Houston), Dallas, Bexar e Tarrant representem cerca de 50% de todas as execuções no Texas? Talvez seja, especialmente se começarmos com a suposição de que as execuções deveriam ser distribuídas igualmente entre os condados. Mas uma primeira aproximação melhor é que as execuções são distribuídas de acordo com a distribuição populacional. O [Censo do Texas de 2010](https://www.tsl.texas.gov/ref/abouttx/popcnty12010.html) mostra que os 4 condados tinham uma população de 10,0 milhões, o que representa 40,0% da população do Texas (25,1 milhões). Isso torna a descoberta um pouco menos surpreendente.

Mas ao dividir essa cauda ainda mais, percebemos que o condado de Harris representa a maior parte da diferença. Ele tem apenas 16,4% da população, mas 23,1% das execuções. Isso é quase 50% a mais do que deveria ter.

Vários estudos examinaram por que o condado de Harris foi tão prolífico e vários fatores foram sugeridos:

- <p>Os processos judiciais foram <a href="https://web.archive.org/web/20191227235319/https://www.citylab.com/equity/2014/09/one-texas-county-is-responsible-for-most-of-the-executions-in-the-entire-us/380705/">organizados e bem financiados</a>, enquanto as defesas foram financiadas pelo tribunal e tiveram poucos incentivos. <a href="https://houstonlawreview.org/article/3874.pdf">(Fonte, veja p49)</a>
- <p>O promotor distrital de longa data era <a href="https://www.chron.com/news/houston-texas/article/Former-DA-ran-powerful-death-penalty-machine-1833545.php">determinado e entusiasmado com a pena de morte</a>.
- <p>Juízes no Texas são eleitos, e a população apoiava a pena de morte. <a href="https://priceonomics.com/why-has-texas-executed-so-many-inmates/">(Fonte)</a>
- <p>Os mecanismos de controle e equilíbrio no sistema judicial do condado de Harris não funcionaram. <a href="https://houstonlawreview.org/article/3874-the-problem-of-rubber-stamping-in-state-capital-habeas-proceedings-a-harris-county-case-study">(Fonte, veja p929)</a></p>

<br>
<a name="recap"></a>
## Recapitulação
Nesta seção, aprendemos a agregar sobre grupos e a usar aninhamento para utilizar a saída de uma consulta interna em uma consulta externa. Essas técnicas têm o benefício muito prático de permitir o cálculo de porcentagens.

<a name="mapreduce"></a>

<div class="sideNote">
  <h3>MapReduce</h3>
  <p>Um adendo interessante é que acabamos de aprender a fazer MapReduce em SQL. MapReduce é um famoso paradigma de programação que vê os cálculos como ocorrendo em uma etapa de "map" e uma etapa de "reduce". Você pode aprender mais sobre MapReduce <a href="https://stackoverflow.com/questions/28982/simple-explanation-of-mapreduce">aqui</a>.</p>
  <p>O capítulo <a href="beazley.html">Beazley</a> era todo sobre mapeamento porque mostrou como mapear várias operações para todas as linhas. Por exemplo, <code>SELECT LENGTH(last_statement) FROM executions</code> mapeia a função de tamanho para todas as linhas. Este capítulo mostrou como reduzir vários grupos de dados usando funções de agregação; e o capítulo anterior <a href="innocence.html">Alegações de Inocência</a> era apenas um caso especial no qual a tabela inteira é um grupo.</p>
</div>

No próximo capítulo, aprenderemos sobre `JOIN`s, que permitirão trabalhar com múltiplas tabelas.
