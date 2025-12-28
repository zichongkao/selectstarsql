---
layout: default
title: Select Star SQL (Español)
---

<div class="index_content">
  <p>Este es un libro interactivo que pretende ser el mejor lugar en Internet para aprender SQL. Es gratuito, sin anuncios y no requiere registro ni descargas. Te ayuda a aprender ejecutando consultas contra un conjunto de datos real para completar proyectos relevantes. No es una mera página de referencia: transmite un modelo mental para escribir SQL.</p>
  <p>No se espera conocimiento previo de programación. Cada capítulo está diseñado para tomar alrededor de 30 minutos. A medida que más datos del mundo se almacenan en bases de datos, ¡este tiempo pagará grandes dividendos!</p>
  <br>
  {% for tutorial in site.data.sitemap.contents %}
  <div class="index_section">
    <div class="index_section_title">
      <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
    </div>
    <p>{{ tutorial.blurb }}</p>
  </div>
  {% endfor %}
</div>
