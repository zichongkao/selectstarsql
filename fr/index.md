---
layout: fr_default
title: Select Star SQL
---
<div class="index_content">
  <p>Ceci est un livre interactif qui vise à être le meilleur endroit sur internet pour apprendre SQL. C'est gratuit, sans publicité et ne nécessite pas d'inscription ou téléchargements. Ça vous enseigne en exécution des requêtes avec un jeu de réel données pour compléter des projets de conséquent. Il vous permet d'apprendre (de vous expérimenter) en lançant des requêtes sur les données principales du jeu, afin de compléter des projets conséquents. Ce n’est pas une simple page de référence — il s'agit de transmettre un modèle mental pour écrire en SQL.</p>
  <p>Je m'attends à peu ou pas de connaissances en programmation. Chaque chapitre est conçu pour durer environ 30 minutes. Étant donné que de plus en plus de données mondiales vont  être archivées dans des bases de données, je m'attends à ce que cela soit profitable sur le long terme !</p>
  <br>
  {% for tutorial in site.data.fr_sitemap.contents %}
  <div class="index_section">
    <div class="index_section_title">
      <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
    </div>
    <p>{{ tutorial.blurb }}</p>
  </div>
  {% endfor %}
</div>
