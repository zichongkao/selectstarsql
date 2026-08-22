---
layout: pt_br_tutorial
title: Prefácio
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>

## Motivação

Quando eu trabalhava como cientista de dados na Quora, costumava receber pedidos de recursos para aprender SQL. Tive dificuldade para encontrar algo que eu pudesse recomendar porque acreditava que um bom recurso deveria ser gratuito, não exigir cadastro e se preocupar com pedagogia&mdash;deveria realmente se importar com seus usuários, e não havia nada assim disponível.

Ao superar alguns <a href="#technicals">obstáculos técnicos</a> menores, acredito que o **Select Star SQL** atingiu esse padrão. Minha esperança é que, assim como o <a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> e o <a href='https://beautifulracket.com'>Beautiful Racket</a> fizeram pelo Haskell e pelo Racket, o **Select Star SQL** se torne o melhor lugar da internet para aprender SQL.

<br>
<a name="pedagogy"></a>
## Pedagogia
Estes princípios orientaram a concepção deste projeto:
   - <p><strong>A melhor maneira de aprender programação é praticando.</strong><br>
     Uma grande parte do material consiste em exercícios, e se esforçar para resolvê-los deve ocupar a maior parte do seu tempo.</p>
   - <p><strong>Os exercícios devem ser realistas e substanciais.</strong><br>
     Nas palavras de <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a>: "Você nunca deve deixar [o aprendiz] fazer algo que não seja a coisa real&mdash;mas é preciso se esforçar muito para descobrir o que é a coisa real no contexto de como a mente dele funciona naquele estágio de desenvolvimento."</p>
     <p>Da mesma forma, os exercícios aqui foram projetados para introduzir técnicas de SQL cada vez mais sofisticadas, enquanto exploram o conjunto de dados de maneiras que realmente despertem o interesse das pessoas.</p>
   - <p><strong>Aprender a programar é aprender um modelo mental</strong><br>
     Nosso objetivo aqui não é aprender as regras de como usar <code>GROUP BY</code> ou quando escolher um <code>LEFT JOIN</code> em vez de um <code>INNER JOIN</code>. Sabemos que tivemos sucesso se, depois de escrever uma consulta SQL, você puder fechar os olhos e imaginar o que o computador faria e qual resultado ele produziria. Só então você será capaz de resolver problemas do mundo real com SQL.</p>

<br>
<a name="dataset"></a>
## Conjunto de dados
Nosso conjunto de dados documenta os detentos do corredor da morte do Texas executados desde 1976, quando a Suprema Corte restabeleceu a pena de morte, até o presente. Ele foi extraído do site do <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Departamento de Justiça Criminal do Texas</a> usando métodos automáticos sempre que possível. No entanto, grande parte dos dados anteriores a 1995 está disponível apenas como imagens de documentos físicos, o que exigiu uma extração manual minuciosa.

Os dados brutos estão disponíveis em formato CSV para <a href="../data/tx_deathrow_full.csv">download</a>. Devido à extração manual e à limpeza realizadas, provavelmente se trata do conjunto de dados sobre o corredor da morte do Texas mais completo disponível na internet. Você também pode explorar um subconjunto que preparei para este livro:
<sql-exercise
  data-question="Este é um editor de código interativo. Você pode editar a consulta abaixo."
  data-comment="Shift+Enter é o atalho de teclado para executar a consulta."
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

Por um lado, os dados são simplesmente parte de um livro de programação comum. Por outro, cada linha representa um sofrimento imenso, vidas perdidas e, em alguns casos, uma incrível redenção e aceitação. Durante a preparação deste conjunto de dados, várias das declarações me comoveram profundamente e me fizeram reavaliar minha posição sobre a pena de morte. Espero que, ao examinarmos os dados, você também reflita sobre as questões mais profundas envolvidas.

<br>
<a name="technicals"></a>
## Aspectos técnicos
   - <p><strong>Bancos de dados no lado do cliente</strong>. Um dos desafios para tornar este site gratuito foi evitar pagar por hospedagem web. Mas, para oferecer aos usuários uma experiência prática com um banco de dados (consulte <a href="#pedagogy">Pedagogia</a>), seria necessário hospedar e pagar por um backend adequado. Felizmente, existem bancos de dados que rodam no lado do cliente. Isso me permite usar a hospedagem gratuita de páginas estáticas do <a href="https://pages.github.com">GitHub Pages</a> e fazer com que as páginas executem um banco de dados SQLite no navegador. Alon Zakai e outros tornaram isso possível ao <a href="https://github.com/kripken/sql.js">portar o código C do SQLite para JavaScript usando Emscripten</a>.</p>
   - <p><strong>Matthew Butterick</strong>. Conheci Matthew na <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> e fiquei impressionado com o excelente trabalho que ele fez no <a href="http://beautifulracket.com">Beautiful Racket</a> e no <a href="http://practicaltypography.com">Practical Typography</a>. Como você talvez possa perceber, peguei muitas ideias de design de lá.</p>
   - <p><strong>Jekyll</strong>. Se não fosse pelo <a href="https://jekyllrb.com/">Jekyll</a>, eu teria acabado escrevendo todo o HTML à mão. Ainda bem que existe o Jekyll.</p>
   - <p><strong>Web Components</strong>. Consegui reutilizar bastante código escrevendo os componentes dos exercícios interativos e dos quizzes como <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">tags HTML personalizadas</a>. Pelo que entendo, é uma tecnologia relativamente nova, e espero que o W3C continue incentivando sua adoção mais ampla.</p>

<br>
<a name="contact"></a>
## Créditos e contato
Para correções e sugestões sobre o conteúdo, escreva para mim (Kao) em zichongkao@gmail.com. Você pode saber mais sobre mim no <a href="http://kaomorphism.com">Kaomorphism</a>.

Para correções na tradução em português, escreva para Samuel Capetinga Bomtempo em <a href="mailto:sam.makes.programs@gmail.com">sam.makes.programs@gmail.com</a>.

<a href="https://thepitz.io/">Noam Castel</a> e Jowan Vogel fizeram um trabalho incrível nas traduções para <a href="/he/">hebraico</a> e <a href="/nl">neerlandês</a>. Entre em contato com eles para elogios e sugestões, ou caso tenha interesse em traduzi-lo para outros idiomas.

Muito obrigado a Sonja Lea Heinze, Quinn Batten e <a href="https://nickretallack.com">Nicholas Retallack</a> pelo valioso feedback.
