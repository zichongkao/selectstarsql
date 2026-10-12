---
layout: nl_default
title: Select Star SQL
---
<div class="index_content">
  <p>Dit is een interactief boek dat de beste plek op internet wil zijn om SQL te leren. Het is gratis, bevat geen advertenties en vereist geen registratie of downloads. Je leert door queries uit te voeren op een echte dataset en zo projecten van betekenis af te ronden. Het is niet zomaar een naslagwerk &mdash; het brengt je een mentaal model bij voor het schrijven van SQL.</p>
  <p>Je hebt weinig tot geen programmeerkennis nodig. Elk hoofdstuk kost ongeveer 30 minuten. Nu steeds meer van 's werelds gegevens in databases worden opgeslagen, verwacht ik dat deze tijd zich ruimschoots zal terugbetalen!</p>
  <br>
  {% for tutorial in site.data.nl_sitemap.contents %}
  <div class="index_section">
    <div class="index_section_title">
      <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
    </div>
    <p>{{ tutorial.blurb }}</p>
  </div>
  {% endfor %}
</div>
