---
layout: pt_br_tutorial
title: Alegações de Inocência
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innocence"></a>

## Possível inocência

Os opositores da pena de morte argumentam que o risco de executar por engano uma pessoa inocente é um preço alto demais a pagar. Neste capítulo, tentaremos estimar quantas pessoas inocentes podem ter sido executadas.

A principal ressalva é que uma alegação de inocência, mesmo feita no leito de morte, não constitui prova de inocência. Além disso, mesmo que o detento esteja dizendo a verdade, há muitas interpretações possíveis para o que significa ser inocente: o detento pode ter sido acusado de assassinar duas pessoas, mas ser inocente da morte de apenas uma; ou pode ter matado o transeunte, mas não o policial. Essas questões não são meras minúcias: no Texas, o assassinato por si só não é suficiente para justificar a pena de morte. O detento precisa ter cometido um [crime passível de pena de morte](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes), como matar um agente de segurança pública ou várias pessoas. Portanto, o detento pode ser inocente em um sentido estritamente jurídico, embora talvez não pelos padrões comuns de moralidade.

Ainda assim, há algo perturbador em alegações de inocência que persistem até a proximidade da execução, quando há pouco a ganhar. Nossa tarefa aqui é descobrir com que frequência isso acontece, calculando a proporção das últimas declarações que contêm uma alegação de inocência.

<br>
<a name="aggregations"></a>
## Funções de agregação
Precisamos calcular dois números para obter essa proporção:

&nbsp;&nbsp;**Numerador**: Número de execuções com alegações de inocência.

&nbsp;&nbsp;**Denominador**: Número total de execuções.

Até agora, cada linha no resultado vinha de uma única linha de entrada. Aqui, porém, tanto o numerador quanto o denominador exigem informações de várias linhas de entrada. Isso nos mostra que precisamos usar uma função de agregação. Agregar significa combinar vários elementos em um todo. Da mesma forma, as funções de agregação <i>recebem várias linhas de dados e as combinam em um único número.</i>

<br>
<a name="count"></a>
## A função COUNT
`COUNT` é provavelmente a função de agregação mais usada. Como o nome sugere, ela conta coisas! Por exemplo, <code class='codeblock'>COUNT(&lt;column&gt;)</code> retorna o número de linhas não nulas da coluna.

<sql-exercise
  data-question="Edite a consulta para descobrir quantos detentos forneceram uma última declaração."
  data-comment="Podemos usar <code>COUNT</code> aqui porque <code>NULL</code> é usado quando não há uma declaração."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

Como você pode perceber, a função `COUNT` está intrinsecamente ligada ao conceito de `NULL`. Vamos fazer uma pequena digressão para aprender sobre `NULL`.
<a name="nulls"></a>

<div class="sideNote">
  <h3>NULLs</h3>
  <p>Em SQL, <code>NULL</code> é o valor de uma entrada vazia. Isso é diferente da string vazia <code>''</code> e do inteiro <code>0</code>, que não são considerados <code>NULL</code>. Para verificar se uma entrada é <code>NULL</code>, use <code>IS</code> e <code>IS NOT</code> em vez de <code>=</code> e <code>!=</code>.</p>

<sql-exercise
    data-question="Verifique que 0 e a string vazia não são considerados NULL."
    data-comment="Lembre-se de que esta é uma condição composta. Ambas as condições <code>IS NOT NULL</code> precisam ser verdadeiras para que a consulta retorne <code>true</code>."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL)"
    ></sql-exercise>

</div>

Com isso, podemos encontrar o denominador da nossa proporção:
<sql-exercise
  data-question="Descubra o número total de execuções no conjunto de dados."
  data-comment="A ideia aqui é escolher uma das colunas que você tem certeza de que não contém <code>NULL</code> e contá-la."
  data-default-text=""
  data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var"></a>
## Variações de COUNT
Até aqui, tudo bem. Mas e se não soubermos quais colunas não contêm `NULL`? Pior ainda, e se nenhuma das colunas estiver livre de `NULL`? Certamente ainda deve haver uma maneira de descobrir o número de linhas da tabela!

A solução é `COUNT(*)`. Isso lembra o `SELECT *`, em que o `*` representa todas as colunas. Na prática, `COUNT(*)` conta as linhas desde que _qualquer uma_ de suas colunas não seja nula. Isso nos ajuda a descobrir o número de linhas das tabelas, pois uma tabela não deveria ter linhas cujas colunas fossem todas nulas.

<sql-exercise
  data-question="Verifique que <code>COUNT(*)</code> produz o mesmo resultado de antes."
  data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Outra variação comum é contar um subconjunto da tabela. Por exemplo, contar as execuções no condado de Harris. Poderíamos executar `SELECT COUNT(*) FROM executions WHERE county='Harris'`, que filtra os dados para um conjunto menor contendo as execuções de Harris e depois conta todas as linhas. Mas e se quisermos descobrir simultaneamente o número de execuções no condado de Bexar?

A solução é usar um bloco `CASE WHEN`, que funciona como uma grande estrutura if-else. Ele possui dois formatos, e o que eu prefiro é:

    CASE
      WHEN <clause> THEN <result>
      WHEN <clause> THEN <result>
      ...
      ELSE <result>
    END

Esta é, reconhecidamente, uma das partes mais complicadas do SQL. Um erro comum é esquecer o comando `END` e a condição `ELSE`, que serve como alternativa caso todas as condições anteriores sejam falsas. Lembre-se também do capítulo anterior que as condições são expressões que podem ser avaliadas como verdadeiras ou falsas. Por isso, é importante pensar no valor booleano do que quer que você coloque ali.

<sql-exercise
  data-question="Esta consulta conta o número de execuções nos condados de Harris e Bexar. Substitua os <code>SUM</code>s por <code>COUNT</code>s e edite os blocos <code>CASE WHEN</code> para que a consulta continue funcionando."
  data-comment="Trocar <code>SUM</code> por <code>COUNT</code> sozinho não é suficiente, porque <code>COUNT</code> também conta o 0, já que 0 não é nulo."
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
## Prática

<sql-exercise
  data-question="Descubra quantos detentos tinham mais de 50 anos no momento da execução."
  data-comment="Isso ilustra que o bloco <code>WHERE</code> filtra os dados antes que a agregação ocorra."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Descubra o número de detentos que se recusaram a fornecer uma última declaração."
  data-comment="Para ganhar pontos extras, tente fazer isso de 3 maneiras:<br> 1) Com um bloco <code>WHERE</code>,<br> 2) Com um bloco <code>COUNT</code> e <code>CASE WHEN</code>,<br> 3) Com duas funções <code>COUNT</code>."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

Vale a pena parar por um momento e pensar nas diferentes maneiras como o computador lidou com essas três consultas. Na versão com `WHERE`, ele primeiro filtrou os dados para uma tabela menor e depois fez a agregação, enquanto nas outras duas precisou percorrer a tabela inteira. Na versão com `COUNT` + `CASE WHEN`, ele precisou percorrê-la apenas uma vez, enquanto a versão com dois `COUNT` fez isso duas vezes. Portanto, embora o resultado fosse idêntico, o desempenho provavelmente foi melhor na primeira versão e pior na terceira.

<sql-exercise
  data-question="Descubra a idade mínima, máxima e média dos detentos no momento da execução."
  data-comment="Use as funções de agregação <code>MIN</code>, <code>MAX</code> e <code>AVG</code>."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>

<div class="sideNote">
  <h3>Consultando a documentação</h3>
  <p>Este livro nunca teve a intenção de ser uma referência abrangente da linguagem SQL. Para isso, você terá que consultar outros recursos online. Isso também é uma habilidade por si só, e vale a pena dominá-la porque você continuará consultando a documentação anos depois de já estar familiarizado com a linguagem.</p>
  <p>A boa notícia é que, com os modelos mentais que você aprenderá neste livro, as consultas à documentação deverão ser rápidas e fáceis, pois você estará apenas verificando detalhes, como se a função se chama <code>AVERAGE</code> ou <code>AVG</code>, em vez de tentar descobrir qual abordagem usar.</p>
  <p>Para consultas à documentação, costumo usar o <a href="https://www.w3schools.com/sql/default.asp">W3 Schools</a>, o Stack Overflow e a <a href="http://sqlite.org">documentação oficial do SQLite</a>.</p>
</div>

<sql-exercise
  data-question="Descubra o comprimento médio (com base na quantidade de caracteres) das últimas declarações no conjunto de dados."
  data-comment='Este exercício ilustra que você pode combinar funções. Consulte a <a href="http://sqlite.org/lang_corefunc.html">documentação</a> para descobrir qual função retorna o número de caracteres de uma string.'
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="Liste todos os condados do conjunto de dados sem duplicações."
  data-comment="Podemos obter entradas únicas usando <code>SELECT DISTINCT</code>. Consulte a <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentação.</a>"
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` não é realmente uma função de agregação porque não retorna um único número e porque opera sobre o resultado da consulta, e não sobre a tabela subjacente. Ainda assim, incluímos aqui porque ele compartilha a característica de operar sobre várias linhas.

<br>
<a name="strange"></a>
## Uma consulta estranha
Antes de encerrarmos, vamos dar uma olhada nesta consulta:<br> `SELECT first_name, COUNT(*) FROM executions`.

Não parece estranho? Se você tem um bom modelo mental de agregações, deveria! `COUNT(*)` está tentando retornar uma única entrada correspondente ao número de linhas da tabela de execuções. `first_name` está tentando retornar uma entrada para cada linha. O computador deveria retornar uma ou várias linhas? Se retornar uma, qual `first_name` deveria escolher? Se retornar várias, deveria repetir o resultado de `COUNT(*)` em todas as linhas? Os formatos dos resultados simplesmente não são compatíveis!

<sql-exercise
  data-question="Vamos tentar mesmo assim e ver o que acontece."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

Na prática, os bancos de dados tentam retornar algo razoável mesmo quando você fornece algo sem sentido. Neste caso, nosso banco de dados escolhe o primeiro nome da última entrada da tabela. Como nossa tabela está em ordem cronológica inversa, a última entrada é Charlie Brooks Jr., a primeira pessoa executada desde que a Suprema Corte suspendeu a proibição da pena de morte. Bancos de dados diferentes tratarão esse caso de maneiras diferentes, então é melhor não depender desse comportamento padrão. Se você sabe que quer a última entrada, deve encontrá-la explicitamente. Muitos dialetos SQL possuem uma função de agregação `LAST`, o que torna isso trivial. Infelizmente, o SQLite não possui essa função, então é necessário usar uma solução alternativa.

<a name="dialects"></a>

<div class="sideNote">
  <h3>Dialetos SQL e bancos de dados</h3>
  <p>Embora tenhamos chamado isto de um livro sobre SQL, se quisermos ser rigorosos, ele é na verdade um livro sobre <i>SQLite</i>. Isso acontece porque SQL é um conceito imaginário, um ideal platônico. Na realidade, existem apenas dialetos que tentam estar em conformidade com as especificações SQL.</p>
  <p>SQL também é pouco especificado, o que significa que algumas funcionalidades não são definidas pelos padrões. Por exemplo, os padrões não dizem se a função que encontra o comprimento de uma string deve se chamar <code>LEN</code> (SQL Server) ou <code>LENGTH</code> (SQLite), nem como identificadores como nomes de tabelas ou colunas devem ser colocados entre aspas (<code>`</code> no MySQL, <code>"</code> no SQLite).</p>
  <p>Para piorar as coisas, até mesmo uma única consulta em um único dialeto pode ser processada de maneiras diferentes, porque os bancos de dados subjacentes podem ter arquiteturas diferentes. Por exemplo, o dialeto PostgreSQL pode ser usado em bancos de dados distribuídos por várias máquinas físicas e em bancos de dados constituídos por um único arquivo. Isso significa que os modelos mentais que desenvolvemos aqui são apenas um apoio. Eles podem não refletir exatamente o que o banco de dados está fazendo.</p>
  <p>Escolhemos o SQLite, que é tanto um dialeto quanto uma implementação, porque ele é um dos bancos de dados mais comuns. Também tentamos nos concentrar nas funcionalidades essenciais e no modelo mental do SQL, em vez das particularidades do SQLite. Com um modelo mental sólido, é fácil alternar entre dialetos SQL e bancos de dados.
  </p>
</div>

<br>
<a name="recap"></a>
## Conclusão e revisão
Vamos usar o que aprendemos até agora para concluir nossa tarefa:
<sql-exercise
  data-question="Descubra a proporção de detentos cujas últimas declarações contêm alegações de inocência."
  data-comment="Para fazer uma divisão decimal, certifique-se de que um dos números seja decimal, multiplicando-o por 1.0. Use <code>LIKE '%innocent%'</code> para encontrar alegações de inocência."
  data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

Este método para encontrar alegações de inocência é reconhecidamente bastante impreciso, pois a inocência pode ser expressa por outros termos, como "não culpado". Ainda assim, suspeito que ele subestime o número real e provavelmente esteja na ordem de grandeza correta. A questão que nos resta, então, é se estamos dispostos a aceitar a possibilidade de que até 5% das pessoas que executamos sejam, na verdade, inocentes. ([Paul Graham não está.](http://paulgraham.com/prop62.html))

Para revisar, passamos de operações linha a linha, na seção anterior, para o uso de funções de agregação em várias linhas do conjunto de dados. Isso abriu caminho para estudarmos o comportamento do sistema como um todo. Na próxima seção, aprenderemos a aplicar funções de agregação a vários subgrupos do conjunto de dados usando o bloco `GROUP BY`.
