---
layout: pt_br_default
title: Select Star SQL
---

<div class="index_content">
  <p>Este é um livro interativo que tem como objetivo ser o melhor lugar da internet para aprender SQL. É gratuito, não tem anúncios e não exige cadastro nem downloads. Ele ajuda você a aprender executando consultas sobre um conjunto de dados do mundo real para concluir projetos relevantes. Não é apenas uma página de referência &mdash; ele transmite um modelo mental para escrever SQL.</p>
  <p>É esperado pouco ou nenhum conhecimento de programação. Cada capítulo foi projetado para levar cerca de 30 minutos. À medida que uma parcela cada vez maior dos dados do mundo é armazenada em bancos de dados, acredito que esse tempo será muito bem investido!</p>
  <br>
  {% for tutorial in site.data.pt_br_sitemap.contents %}
  <div class="index_section">
    <div class="index_section_title">
      <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
    </div>
    <p>{{ tutorial.blurb }}</p>
  </div>
  {% endfor %}
</div>
