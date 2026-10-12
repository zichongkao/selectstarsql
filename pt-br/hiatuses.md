---
layout: pt_br_tutorial
title: Intervalos sem Execuções
dbFile: data/tx_deathrow_small.db
---

<a name="hiatuses"></a>

## Intervalos sem Execuções

Este gráfico mostra as execuções ao longo do tempo.<img src="/imgs/exno_time.png"> Observe que houve vários períodos prolongados em que nenhuma execução ocorreu. Nosso objetivo é descobrir exatamente quando eles aconteceram e pesquisar suas causas.

Nossa estratégia é colocar a tabela em um estado no qual cada linha também contenha a data da execução anterior. Podemos então encontrar a diferença de tempo entre as duas datas, ordená-las em ordem decrescente e identificar os maiores intervalos sem execuções.

<br>
<a name="joins"></a>
## Pensando em JOINs
Nenhuma das técnicas que aprendemos até agora é adequada aqui. Nossa tabela desejada tem o mesmo tamanho da tabela original `executions`, então podemos descartar as agregações, que produzem uma tabela menor. O capítulo [Beazley](beazley.html) ensinou apenas operações sobre linhas, o que nos limita a trabalhar com informações já presentes nas linhas. No entanto, a data da execução anterior está fora de uma linha, então precisamos usar `JOIN` para trazer as informações adicionais.

Vamos supor que as informações adicionais que queremos existam em uma tabela chamada `previous`, que tenha duas colunas `(ex_number, last_ex_date)`. Poderíamos executar a seguinte consulta para concluir nossa tarefa:

    SELECT
      last_ex_date AS start,
      ex_date AS end,
      ex_date - last_ex_date AS day_difference
    FROM executions
    JOIN previous
      ON executions.ex_number = previous.ex_number
    ORDER BY day_difference DESC
    LIMIT 10

O bloco `JOIN` é o foco desta seção. Em vez de vê-lo como uma linha isolada, muitas vezes é útil visualizá-lo assim: <img src="/imgs/join_correctview.png"> Isso enfatiza como `JOIN` cria uma grande tabela combinada que é então passada para o bloco `FROM`, assim como qualquer outra tabela.

<a name="disam_cols"></a>

<div class="sideNote">
  <h3>Desambiguando Colunas</h3>
  <p>A consulta acima também é notável porque a cláusula <code>executions.ex_number = previous.ex_number</code> usa o formato <code>&lt;table&gt;.&lt;column&gt;</code> para especificar colunas. Isso só é necessário aqui porque ambas as tabelas têm uma coluna chamada <code>ex_number</code>.</p>
</div>

<br>
<a name="join_types"></a>
## Tipos de JOINs
O bloco `JOIN` assume a forma <code class='codeblock'>&lt;table1&gt; JOIN &lt;table2&gt; ON &lt;clause&gt;</code>. A cláusula funciona da mesma forma que em <code class='codeblock'>WHERE &lt;clause&gt;</code>. Ou seja, é uma expressão que resulta em verdadeiro ou falso e, sempre que uma linha da primeira tabela e outra da segunda se alinham com a cláusula sendo verdadeira, as duas são combinadas:

<img src="/imgs/join_base.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Mas o que acontece com as linhas que não têm correspondências? Nesse caso, a tabela `previous` não tinha uma linha para a execução de número 1 porque não existem execuções anteriores a ela.

<img src="/imgs/join_unmatched.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

O comando <code>JOIN</code> por padrão realiza o que é chamado de "inner join", no qual as linhas sem correspondência são descartadas.

<img src="/imgs/join_inner.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Para preservar todas as linhas da tabela da esquerda, usamos um <code>LEFT JOIN</code> no lugar do `JOIN` comum. As partes vazias da linha permanecem como estão, o que significa que elas resultam em <code>NULL</code>.

<img src="/imgs/join_left.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

O <code>RIGHT JOIN</code> pode ser usado para preservar linhas sem correspondência na tabela da direita, e o <code>OUTER JOIN</code> pode ser usado para preservar linhas sem correspondência em ambas.

A sutileza final é lidar com múltiplas correspondências. Digamos que temos uma tabela `duplicated_previous` que contém duas cópias de cada linha da tabela `previous`. Agora, cada linha de `executions` corresponde a duas linhas em `duplicated_previous`.

<img src="/imgs/join_dup_pre.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">

O JOIN cria linhas suficientes de `executions` para que cada linha correspondente de `duplicated_previous` tenha sua própria parceira. Dessa forma, JOINs podem criar tabelas maiores do que suas tabelas constituintes.

<img src="/imgs/join_dup_post.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">

<sql-quiz
  data-title="Marque as afirmações verdadeiras."
  data-description="Suponha que temos a tabela tableA com 3 linhas e a tabela tableB com 5 linhas.">
<sql-quiz-option
    data-value="cartesian_prod"
    data-statement="<code>tableA JOIN tableB ON 1</code> retorna 15 linhas."
    data-hint="A cláusula <code>ON 1</code> é sempre verdadeira, então cada linha de tableA é combinada com cada linha de tableB."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="bad_cartesian"
    data-statement="<code>tableA JOIN tableB ON 0</code> retorna 0 linhas."
    data-hint="Pelo mesmo motivo que <code>ON 1</code> retorna 15 linhas."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="left_join_bad"
    data-statement="<code>tableA LEFT JOIN tableB ON 0</code> retorna 3 linhas."
    data-hint="O left join preserva todas as linhas de tableA mesmo que nenhuma linha de tableB corresponda."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="outer_join_bad"
    data-statement="<code>tableA OUTER JOIN tableB ON 0</code> retorna 8 linhas."
    data-hint="O outer join preserva todas as linhas de tableA e tableB mesmo que nenhuma delas seja pareada."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="outer_join_good"
    data-statement="<code>tableA OUTER JOIN tableB ON 1</code> retorna 15 linhas."
    data-hint="Todas as linhas de tableA correspondem a todas as linhas de tableB por causa da cláusula <code>on 1</code>, então qualquer join retornará 15 linhas. Os diferentes joins só diferem na forma como lidam com linhas sem correspondência."
    data-correct="true"></sql-quiz-option>
</sql-quiz>

<br>
<a name="dates"></a>
## Datas
Vamos fazer uma pausa nos joins por um momento e olhar para esta linha em nossa consulta modelo:

      ex_date - last_ex_date AS day_difference

Fizemos uma grande suposição de que podemos subtrair datas umas das outras. Mas imagine que você é o computador recebendo uma linha como essa. Você retorna o número de dias entre as datas? Por que não horas ou segundos? Para piorar as coisas, o SQLite na verdade não possui tipos de data ou hora (ao contrário da maioria dos outros dialetos SQL), então as colunas `ex_date` e `last_ex_date` parecem strings comuns para você. Na prática, estão pedindo que você faça `'hello' - 'world'`. Mas o que isso significa?

Felizmente, o SQLite contém várias funções para dizer ao computador: "Ei, essas strings que estou passando para você na verdade contêm datas ou horários. Aja com elas como você agiria com uma data."

<sql-exercise
data-question='Consulte <a href="https://www.sqlite.org/lang_datefunc.html">a documentação</a> para corrigir a consulta de modo que ela retorne o número de dias entre as datas.'
data-default-text="SELECT '1993-08-10' - '1989-07-07' AS day_difference"
data-solution="
SELECT JULIANDAY('1993-08-10') - JULIANDAY('1989-07-07') AS day_difference"

></sql-exercise>

<br>
<a name="self_joins"></a>
## Auto-junções
Com o que aprendemos sobre datas, podemos corrigir nossa consulta modelo:

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

O próximo passo é criar a tabela `previous`.

<sql-exercise
  data-question="Escreva uma consulta para produzir a tabela <code>previous</code>."
  data-comment="Lembre-se de usar aliases para formar os nomes das colunas<code>(ex_number, last_ex_date)</code>. Dica: em vez de retroceder as datas, você poderia avançar o <code>ex_number</code>!"
  data-solution="
SELECT
  ex_number + 1 AS ex_number,
  ex_date AS last_ex_date
FROM executions
WHERE ex_number < 553"></sql-exercise>

Agora podemos aninhar essa consulta em nossa consulta modelo acima:

<sql-exercise
data-question="Aninhe a consulta que gera a tabela <code>previous</code> na consulta modelo."
data-comment='Observe que estamos usando um alias de tabela aqui, nomeando o resultado da consulta aninhada como "previous".'
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

`previous` é derivada de `executions`, então estamos efetivamente fazendo um JOIN de `executions` com ela mesma. Isso é chamado de "self join" e é uma técnica poderosa para permitir que as linhas obtenham informações de outras partes da mesma tabela.

Criamos a tabela `previous` para deixar claro o propósito que ela desempenha. Mas podemos escrever a consulta de forma mais elegante fazendo um JOIN da tabela `executions` diretamente com ela mesma.

<sql-exercise
data-question="Preencha a cláusula <code>JOIN ON</code> para completar uma versão mais elegante da consulta anterior."
data-comment="Observe que ainda precisamos dar um alias a uma das cópias para garantir que possamos nos referir a ela sem ambiguidade."
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

Agora podemos usar as datas precisas dos intervalos sem execuções para pesquisar o que aconteceu durante cada período. Nos anos imediatamente após o fim da proibição da pena capital, houve longos períodos sem execuções devido ao baixo número de sentenças de morte, juntamente com contestações jurídicas à nova decisão. Assim, excluímos os intervalos anteriores a 1993 e nos concentramos em dois grandes intervalos desde então.<img src="/imgs/exno_time_annotated.png">

O Intervalo 1 ocorreu devido a contestações jurídicas à <a href="https://en.wikipedia.org/wiki/Antiterrorism_and_Effective_Death_Penalty_Act_of_1996">Lei Antiterrorismo e de Pena de Morte Efetiva de 1996</a>, criada em resposta aos atentados de 1993 ao World Trade Center e de 1995 em Oklahoma City. A lei limitou o processo de apelação para tornar a pena de morte mais eficaz, especialmente em casos de terrorismo (<a href="https://deathpenaltyinfo.org/documents/1996YearEndRpt.pdf">Fonte</a>).

O Intervalo 2 foi causado por uma suspensão determinada pela Suprema Corte enquanto ela analisava o caso <a href="https://en.wikipedia.org/wiki/Baze_v._Rees">Baze v. Rees</a>, que examinava se a injeção letal viola a Oitava Emenda, que proíbe "punição cruel e incomum". Isso afetou as execuções em toda a América porque a maioria dos estados usava o mesmo coquetel de medicamentos que Kentucky. A Suprema Corte acabou confirmando a decisão do tribunal de Kentucky, e as execuções no Texas foram retomadas alguns meses depois.

<br>

<a name="recap"></a>

## Recapitulação

A ideia central por trás dos `JOIN`s foi criar uma tabela ampliada porque a original não continha as informações de que precisávamos. Esse é um conceito poderoso porque nos liberta das limitações de uma única tabela e nos permite combinar várias tabelas de maneiras potencialmente complexas. Também vimos que, com essa complexidade adicional, manter um controle meticuloso se torna importante. Dar aliases às tabelas, renomear colunas e definir boas cláusulas `JOIN ON` são técnicas que nos ajudam a manter tudo organizado.
