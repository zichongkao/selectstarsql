---
layout: pt_br_tutorial
title: Última declaração de Beazley
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>

## O caso Beazley

Em 1994, Napoleon Beazley atirou no empresário John Luttig, de 63 anos, em sua garagem enquanto tentava roubar o carro da família. Como ele tinha pouco menos de 18 anos na época do assassinato, o caso Beazley provocou um intenso debate sobre a pena de morte para infratores juvenis. Três anos após a execução de Beazley, a Suprema Corte proibiu a execução de infratores que tivessem menos de 18 anos na época do crime ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons)).

O caso também foi notável porque a vítima era pai do juiz federal John Michael Luttig. Durante os recursos apresentados à Suprema Corte, três dos nove ministros se declararam impedidos devido aos seus vínculos pessoais com o juiz Luttig, deixando apenas seis para analisar o caso.

Napoleon Beazley fez uma declaração final emocionada, argumentando que olho por olho não constitui justiça. Nossa tarefa é recuperar sua declaração do banco de dados.

<br>
<a name="first"></a>
## Uma primeira consulta SQL
<sql-exercise
  data-question="Execute esta consulta para encontrar as 3 primeiras linhas da tabela 'executions'."
  data-comment="Visualizar algumas linhas é uma boa maneira de descobrir as colunas de uma tabela. Tente memorizar os nomes das colunas para usá-los posteriormente."
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

Da esquerda para a direita, as colunas são:
- first_name (primeiro nome)
- last_name (sobrenome)
- ex_number (número da execução)
- ex_age (idade na execução)
- ex_date (data da execução)
- last_statement (última declaração)

A consulta SQL pode parecer uma frase comum, mas você deve enxergá-la como três blocos de Lego:
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
Assim como no Lego, cada bloco tem um formato fixo e os diferentes blocos precisam se encaixar de determinadas maneiras.

<br>
<a name="select"></a>
## O bloco SELECT
O bloco `SELECT` especifica quais colunas você deseja exibir. Seu formato é <code class='codeblock'>SELECT &lt;column&gt;, &lt;column&gt;, ...</code>. Cada coluna deve ser separada por uma vírgula, mas o espaço após a vírgula é opcional. O asterisco (isto é, `*`) é um caractere especial que significa que queremos todas as colunas da tabela.

<sql-exercise
  data-question="No editor de código abaixo, altere a consulta para selecionar a coluna last_statement além das colunas existentes."
  data-comment="Quando terminar, pressione Shift+Enter para executar a consulta."
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>

<div class="sideNote">
  <h3>Comentários em SQL</h3>
  <p>Observe que, ao clicar em "Show Solution", a solução é exibida no editor precedida por <code>/*</code>. O conteúdo entre <code>/*</code> e <code>*/</code> é tratado como comentário e não é executado como código. Isso é útil para ocultar temporariamente um código que não queremos executar. Para executar a solução, basta apagar ou comentar seu código e remover o comentário da solução.</p>
  <p><code>--</code> é outra forma de indicar comentários. Ele marca o restante de uma única linha como comentário. Quando queremos comentar várias linhas, <code>/* ... */</code> é mais conveniente do que adicionar <code>--</code> no início de cada uma delas.</p>
</div>

<br>
<a name="from"></a>
## O bloco FROM
O bloco <code>FROM</code> especifica em qual tabela estamos fazendo a consulta. Seu formato é <code class="codeblock">FROM &lt;table&gt;</code>. Ele sempre vem depois do bloco <code>SELECT</code>.

<sql-exercise
  data-question="Execute a consulta fornecida e observe o erro produzido. Corrija a consulta."
  data-comment="Crie o hábito de examinar as mensagens de erro quando algo dá errado. Evite depurar com base em intuição ou por tentativa e erro."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

No próximo exemplo, observe que não precisamos do bloco `FROM` se não estivermos usando nada de uma tabela.

<sql-exercise
  data-question="Modifique a consulta para dividir 50 e 51 por 2."
  data-comment="SQL oferece suporte a todas as operações aritméticas usuais."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

Não é estranho que `51 / 2` resulte em `25` em vez de `25.5`? Isso acontece porque o SQL está fazendo uma divisão inteira. Para fazer uma divisão decimal, pelo menos um dos operandos deve ser decimal, por exemplo, `51.0 / 2`. Um truque comum é multiplicar um dos números por `1.0` para convertê-lo em decimal. Isso será útil nos capítulos seguintes.

<a name="capitalization"></a>

<div class="sideNote">
  <h3>Uso de maiúsculas e minúsculas</h3>
  <p>Embora tenhamos escrito <code>SELECT</code>, <code>FROM</code> e <code>LIMIT</code> em letras maiúsculas, os comandos SQL não diferenciam maiúsculas de minúsculas. Você pode ver que o editor de código os reconhece e os formata como comandos independentemente de como são escritos. Ainda assim, recomendo escrevê-los em letras maiúsculas para diferenciá-los dos nomes de colunas, tabelas e variáveis.</p>
  <p>Os nomes de colunas, tabelas e variáveis também não diferenciam maiúsculas de minúsculas nesta versão do SQL, embora diferenciem em muitas outras versões. Para garantir segurança, recomendo sempre presumir que diferenciam.</p>
</div>

<a name="whitespace"></a>

<div class="sideNote">
  <h3>Espaços em branco</h3>
  <p>Espaços em branco são espaços, tabulações, quebras de linha e outros caracteres que aparecem como espaço vazio na página. Assim como acontece com maiúsculas e minúsculas, o SQL não é muito sensível a espaços em branco, desde que você não junte duas palavras em uma só. Isso significa que basta haver pelo menos um caractere de espaço em branco ao redor de cada comando — não importa qual seja ou quantos você use. A menos que seja uma consulta curta, prefiro colocar cada comando em uma nova linha para melhorar a legibilidade.</p>

<sql-exercise
  data-question="Verifique se alterar maiúsculas/minúsculas e espaços em branco ainda produz uma consulta válida."
  data-comment="Karla Tucker foi a primeira mulher executada no Texas desde a Guerra Civil. Ela foi condenada à morte por matar duas pessoas durante um assalto em 1983."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>

</div>

<br>
<a name="where"></a>
## O bloco WHERE
O bloco `WHERE` permite filtrar a tabela pelas linhas que atendem a determinadas condições. Seu formato é <code class='codeblock'>WHERE &lt;clause&gt;</code> e ele sempre vem depois do bloco `FROM`. Aqui, uma cláusula é uma expressão booleana que o computador pode avaliar como verdadeira ou falsa, como <code>ex_number = 145</code>. Você pode imaginar que o computador percorrerá cada linha da tabela, verificando se a cláusula é verdadeira e, se for, retornará a linha.

<sql-exercise
  data-question="Encontre os nomes e as idades (ex_age) dos detentos que tinham 25 anos ou menos no momento da execução."
  data-comment="Como o tempo médio que os detentos passam no corredor da morte antes da execução é de 10,26 anos, apenas 6 detentos dessa idade foram executados no Texas desde 1976."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

É fácil ver como podemos usar operadores aritméticos como `<` e `<=` para construir cláusulas. Também existem vários operadores de strings para trabalhar com textos.

O mais poderoso deles provavelmente é o <code>LIKE</code>. Ele permite usar curingas como `%` e `_` para corresponder a diferentes caracteres. Por exemplo, `first_name LIKE '%roy'` retornará verdadeiro para linhas cujos primeiros nomes sejam 'roy', 'Troy' e 'Deroy', mas não 'royman'. O curinga `_` corresponde a um único caractere, então `first_name LIKE '_roy'` corresponderá apenas a 'Troy'.

<sql-exercise
    data-question="Modifique a consulta para encontrar o resultado de Raymond Landry."
    data-comment="Você pode pensar que isso seria fácil, já que já sabemos seu nome e sobrenome. Mas conjuntos de dados raramente são tão organizados. Use o operador LIKE para que você não precise conhecer o nome dele perfeitamente para encontrar a linha."
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
  <h3>Aspas</h3>
  <p>Em SQL, strings são delimitadas por aspas simples. Crases (isto é, <code>`</code>) podem ser usadas para delimitar nomes de colunas e tabelas. Isso é útil quando o nome da coluna ou tabela é igual a uma palavra-chave do SQL ou contém espaços. É possível ter um banco de dados com uma tabela chamada 'where' e uma coluna chamada 'from'. (Quem seria tão cruel a ponto de fazer isso?!) Nesse caso, você teria que usar <code>SELECT `from` FROM `where` WHERE ...</code>. Este é outro exemplo de por que escrever os comandos SQL em letras maiúsculas ajuda.</p>
</div>

Como você viu no exercício anterior, cláusulas complexas podem ser construídas a partir de cláusulas simples usando operadores booleanos como `NOT`, `AND` e `OR`. O SQL dá maior precedência a `NOT`, depois a `AND` e, por fim, a `OR`. Mas se, como eu, você for preguiçoso demais para lembrar a ordem de precedência, pode usar parênteses para deixar clara a ordem desejada.

<sql-exercise
data-question="Insira um par de parênteses para que esta expressão retorne 0."
data-comment="Aqui estamos contando com o fato de que 1 significa verdadeiro e 0 significa falso."
data-default-text="SELECT 0 AND 0 OR 1"
data-solution="SELECT 0 AND (0 OR 1)"
></sql-exercise>

Vamos fazer um teste rápido para consolidar seu entendimento.

<sql-quiz
  data-title="Selecione os blocos <code>WHERE</code> que contêm cláusulas válidas."
  data-description="Esses são complicados. Mesmo que você tenha acertado, leia as explicações para entender o raciocínio.">
<sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> e <code>0</code> são as expressões booleanas mais básicas. Este bloco garante que nenhuma linha será retornada."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="O operador <code>==</code> verifica igualdade em muitas outras linguagens de programação, mas o SQL usa <code>=</code>."
    ></sql-quiz-option>
<sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="Vários nomes de colunas podem ser usados em uma cláusula."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="O operador 'maior ou igual a' é <code>>=</code>, não <code>=></code>. A ordem dos símbolos corresponde à forma como dizemos isso em português."
    ></sql-quiz-option>
<sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="O SQL pode avaliar o valor lógico de praticamente qualquer coisa. A coluna 'ex_age' contém inteiros. Para inteiros, 0 significa falso e qualquer outro valor significa verdadeiro, portanto apenas linhas com idades diferentes de zero serão retornadas."
    data-correct="true"
    ></sql-quiz-option>
<sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="Não há problema em usar mais de um curinga. Mas o padrão precisa vir depois do operador LIKE."
    ></sql-quiz-option>
</sql-quiz>

Agora você tem as ferramentas necessárias para concluir nosso projeto.
<sql-exercise
  data-question="Encontre a última declaração de Napoleon Beazley."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

Não é incrível como Beazley é profundo e eloquente? Lembre-se de que ele tinha apenas 25 anos quando fez a declaração e estava preso desde os 18.

<br>
<a name="recap"></a>
## Recapitulação
O objetivo deste capítulo foi apresentar a estrutura básica, mas poderosa, <code class="codeblock">SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;clause&gt;</code>. Ela nos permite filtrar uma tabela fazendo com que o computador percorra as linhas uma a uma e selecione aquelas para as quais a cláusula `WHERE` é verdadeira. Também aprendemos a construir cláusulas razoavelmente complexas que podem operar sobre colunas com valores de texto, numéricos e booleanos.

Até agora, trabalhamos no nível das linhas, o que nos limitou à análise de pontos de dados individuais. No próximo capítulo, vamos nos concentrar em agregações, que nos permitirão estudar fenômenos do sistema como um todo.
