---
layout: default
title: Select Star SQL
---
<div class="index_content">
  <p>This site aims to be the best place on the internet for learning SQL.<br>It is free of charge, free of ads and doesn't require registration or downloads. It is interactive and focuses on developing a mental model of SQL. It takes you through substantial projects on a real-world dataset.</p>
  <p>I expect that you know a little about coding, perhaps having written Excel formulas or HTML before. Each tutorial is designed to take about 30 minutes. As more of the world's data is stored in databases, my guess is that these couple of hours will pay rich dividends in future!</p>
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
