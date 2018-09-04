---
layout: default
title: Select Star SQL
---
<div class="index_content">
  <p>This is an interactive book which aims to be the best place on the internet for learning SQL. It is free of charge, free of ads and doesn't require registration or downloads. It helps you learn by running queries against a real-world dataset to complete projects of consequence. It is not a mere reference page &mdash; it conveys a mental model for writing SQL.</p>
  <p>I expect little to no coding knowledge. Each chapter is designed to take about 30 minutes. As more of the world's data is stored in databases, I expect that this time will pay rich dividends!</p>
  <div class="warning" style="display:none;border-style:solid;border-color:red;padding:0.5em"><p>It looks like you're on a browser that we don't support. This means that the interactive components of this book won't appear for you. If you're on <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements">FireFox</a>, you can fix things by going to about:config, searching for dom.webcomponents.customelements.enabled and turning it on. Alternatively, you could try another browser. Apologies!</p></div>
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
