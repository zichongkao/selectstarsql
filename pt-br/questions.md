---
layout: pt_br_tutorial
title: Considerações Finais e Questões Desafio
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>

## Considerações Finais

Obrigado por chegar até o fim! Espero que tenha sido uma leitura agradável e esclarecedora.

Neste ponto, cobrimos a maioria dos comandos e funções SQL importantes, mas espero que os maiores aprendizados sejam as técnicas e heurísticas para pensar sobre consultas. Algumas das principais foram:

- <p>Comparar o formato das tabelas disponíveis com o resultado desejado para decidir que agregação fazer.</p>
- <p>Examinar onde estão as informações de que precisamos. Elas estão em uma linha adjacente? Ou em um grupo? Ou em todo o conjunto de dados?</p>
- <p>Interpretar consultas dentro da estrutura lógica correta. Por exemplo, visualizar cláusulas como essencialmente verdadeiras ou falsas; visualizar <code>&lt;table1&gt; JOIN &lt;table2&gt; ON ...</code> como uma grande tabela.</p>

Para completar sua formação em SQL, provavelmente vale a pena estudar funções de janela e expressões de tabela comuns. Você pode reproduzir o comportamento delas com as técnicas que aprendeu aqui, mas elas tornam a vida muito mais fácil e apresentam um novo paradigma valioso. Omiti esses conceitos porque, no momento da escrita, o SQLite [não suportava funções de janela](https://www.sqlite.org/windowfunctions.html#history), e eu queria evitar a complexidade de um novo banco de dados e dialeto SQL.

Até agora, também aprendemos apenas sobre o consumo de dados (consultas). Existe toda uma outra área do SQL para manipulação de dados. Ela envolve ações como criação de tabelas e inserção e exclusão de dados. Compreender esses conceitos pode ser útil mesmo que você não administre bancos de dados, porque isso ajuda a entender, entre outras coisas, por que as tabelas são estruturadas da maneira que são.

Mais importante ainda, você ainda precisa de muita prática para se tornar eficaz em problemas do mundo real. A próxima seção oferece alguns exercícios, mas a dificuldade aumenta acentuadamente. Talvez você queira sair pelo mundo e praticar o que cobrimos até agora e voltar quando estiver pronto.

<br />
<a name="challenge_questions"></a>
## Questões Desafio
Os exercícios dos capítulos anteriores foram projetados para reduzir a complexidade e criar um ambiente acolhedor. Este capítulo marca a fronteira para o mundo selvagem e indomado dos problemas de SQL. A ideia aqui é aprender na prática&mdash;as questões são otimizadas para utilidade em vez de facilidade de aprendizado. Até mesmo quem tem experiência escrevendo SQL pode ter dificuldades; e há muito valor nessa dificuldade.

<a name="call_for_problems"></a>

<div class="sideNote">
  <H3>Convite para Problemas</H3>
  <p>A qualidade dos problemas define um tutorial. Se você tiver uma ideia para um novo problema ou seção, eu adoraria ajudar a publicá-la aqui com todo o crédito para você. Envie um e-mail para <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> ou envie um <a href="https://github.com/zichongkao/selectstarsql">pull request</a>. Lembre-se de que bons problemas não são necessariamente difíceis&mdash;eles apresentam técnicas que têm aplicações abrangentes.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Conjunto de Dados de Coautoria no Senado
### Autoria: Kao
Nesta seção, apresentamos um novo conjunto de dados da 114ª sessão do Congresso (2015-2016) <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">compilado por James Fowler e outros</a>. Eu reformulei o conjunto de dados para permitir que estudássemos as relações de coautoria entre senadores.

O senador que apresenta o projeto de lei é chamado de "patrocinador". Outros senadores podem demonstrar seu apoio tornando-se coautores do projeto. Os coautores no momento da apresentação são chamados de "coautores originais" (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">Fonte</a>). Cada linha da tabela mostra o projeto de lei, o patrocinador, um coautor original e os estados que os senadores representam. Observe que pode haver vários coautores de um projeto de lei.

<sql-exercise
data-question="Dê uma olhada no conjunto de dados."
data-comment="Com 15 mil linhas, ele é um pouco maior que o conjunto de dados do Texas, então é melhor evitar imprimir tudo."
data-default-text="SELECT * FROM cosponsors LIMIT 3"

></sql-exercise>

<sql-exercise
data-question="Encontre o senador mais conectado. Ou seja, aquele com o maior número de coautorias mútuas."
data-comment="Uma coautoria mútua se refere a dois senadores que tenham sido coautores de um projeto de lei patrocinado pelo outro. Mesmo que um par de senadores tenha colaborado em muitos projetos de lei, a relação ainda conta como uma."
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
LIMIT 1"

></sql-exercise>

<sql-exercise
data-question="Agora encontre o senador mais conectado de cada estado."
data-comment="Se vários senadores empatarem no primeiro lugar, mostre ambos. Retorne colunas correspondentes ao estado, senador e contagem de coautorias mútuas."
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
data-question="Encontre os senadores que foram coautores, mas não patrocinaram projetos de lei."
data-comment=""
data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
ON c1.cosponsor_name = c2.sponsor_name
-- This join identifies cosponsors
-- who have sponsored bills
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + NULL is a standard trick for excluding
-- rows. It's more efficient than WHERE ... NOT IN.
"

></sql-exercise>
