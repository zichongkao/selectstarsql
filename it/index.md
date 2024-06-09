---
layout: it_default
title: Select Star SQL
---

<div class="index_content">
  <p>Questo è un libro interattivo che vuole essere il miglior luogo in internet dove imparare SQL. È gratuito, senza alcuna pubblicità e non richiede né registrazione né download. Ti aiuta ad imparare mentre scrivi query interrogando dati reali e, di conseguenza, completando i progetti assegnati. Non è una semplice pagina di riferimento &mdash; trasmette un modello mentale per scrivere in SQL.</p>
  <p>Mi aspetto poca o nessuna conoscenza di programmazione. Ciascun capitolo è progettato per essere completato in circa 30 minuti. Poiché la maggior parte dei dati mondiali viene archiviata nei database, mi aspetto che questo tempo offrirà i suoi ricchi frutti!</p>
  <br>
  {% for tutorial in site.data.it_sitemap.contents %}
  <div class="index_section">
    <div class="index_section_title">
      <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
    </div>
    <p>{{ tutorial.blurb }}</p>
  </div>
  {% endfor %}
</div>
