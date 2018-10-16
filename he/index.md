---
layout: he_default
title: Select Star SQL בעברית
---
<div class="index_content">
  <p>זהו ספר אינטרקטיבי שמנסה להיות המקום הטוב ביותר באינטרנט ללמוד SQL. הוא חינמי, נטול פרסומות ואינו דורש הרשמה או הורדה. הוא יעזור לכם ללמוד באמצעות הרצת שאילתות על סט נתונים אמיתי. הוא אינו רק מקור מידע &mdash; הוא מעביר צורת חשיבה המתאימה לכתיבת SQL </p>


  <p>אני מניח שייש לכם ניסיון תכנות מועט או היעדר ידע קודם. מכיוון שיותר ויותר מידע בעולם מאוכסן בבסיסי נתונים, אני צופה שהזמן הזה יניב רווחים רבים!</p>

  <br>
  {% for tutorial in site.data.he_sitemap.contents %}
  <div class="index_section">
    <div class="index_section_title">
      <h3><a href="{{ tutorial.url }}">{{ tutorial.title }}</a></h3>
    </div>
    <p>{{ tutorial.blurb }}</p>
  </div>
  {% endfor %}
</div>
