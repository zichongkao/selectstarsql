---
layout: es_tutorial
title: Información general
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>

## Motivación

Cuando trabajaba como científico de datos en Quora, solían pedirme recursos para aprender SQL. Me costaba encontrar algo en lo que realmente pudiera confiar porque un buen recurso debía ser gratuito, no requerir registro y cuidar la pedagogía; tenía que importarle sinceramente a sus usuarios y no había nada así disponible.

Al superar algunos pequeños <a href="#technicals">obstáculos técnicos</a>, creo que **Select Star SQL** cumple ese estándar. Mi esperanza es que, como hicieron <a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> y <a href='https://beautifulracket.com'>Beautiful Racket</a> para Haskell y Racket, **Select Star SQL** se convierta en el mejor lugar en Internet para aprender SQL.

<br>
<a name="pedagogy"></a>
## Pedagogía
Estos principios han guiado el diseño de este proyecto:
   - <p><strong>Programar se aprende mejor haciendo.</strong><br>
     Una gran parte del material consiste en ejercicios, y esforzarse con ellos debería ocupar la mayor parte de tu tiempo.</p>
   - <p><strong>Los ejercicios deben ser realistas y sustanciales.</strong><br>
     Como dijo <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a>: "Nunca permites que el aprendiz haga algo que no sea lo real; pero tienes que esforzarte mucho para averiguar cuál es la cosa real en el contexto del nivel de desarrollo de su mente."</p>
   - <p><strong>Aprender a programar es aprender un modelo mental.</strong><br>
     Nuestro objetivo no es aprender las reglas de <code>GROUP BY</code> o cuándo elegir un <code>LEFT JOIN</code> sobre un <code>INNER JOIN</code>. Sabemos que hemos tenido éxito si, después de escribir una consulta SQL, puedes imaginar lo que la computadora hará y qué salida producirá. Solo entonces podrás resolver problemas reales con SQL.</p>

<br>
<a name="dataset"></a>
## Conjunto de datos
Nuestro conjunto de datos documenta a los reclusos ejecutados en Texas desde 1976 hasta la actualidad. Se extrajo del sitio de la <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Texas Department of Criminal Justice</a> usando medios automáticos cuando fue posible. Sin embargo, muchos datos previos a 1995 solo estaban disponibles como imágenes y requirieron una extracción manual laboriosa.

Los datos crudos están disponibles como csv para <a href="data/tx_deathrow_full.csv">descarga</a>. Debido a la extracción y limpieza manual, probablemente sea el conjunto de datos de ejecuciones de Texas más completo en Internet. También puedes explorar un subconjunto preparado para este libro:
<sql-exercise
  data-question="Este es un editor de código interactivo. Puedes editar la consulta abajo."
  data-comment="Shift+Enter ejecuta la consulta."
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

<br>
<a name="technicals"></a>
## Aspectos técnicos
  - <p><strong>Bases de datos del lado cliente</strong>. Uno de los desafíos para mantener el sitio gratuito fue evitar pagar por alojamiento con backend. Para ofrecer una experiencia práctica con una base de datos (ver <a href="#pedagogy">Pedagogía</a>), sería necesario alojar y pagar por un backend. Afortunadamente existen bases de datos del lado cliente. Esto me permite usar el alojamiento estático gratuito de Github Pages y ejecutar una base de datos SQLite en tu navegador. Alon Zakai y otros lo hicieron posible <a href="https://github.com/kripken/sql.js">portando el código C de SQLite a Javascript con Emscripten</a>.</p>
  - <p><strong>Matthew Butterick</strong>. Conocí a Matthew en la <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> y quedé impresionado por su trabajo en <a href="http://beautifulracket.com">Beautiful Racket</a> y <a href="http://practicaltypography.com">Practical Typography</a>. Como quizás notes, tomé muchas ideas de diseño de allí.</p>
  - <p><strong>Jekyll</strong>. Si no fuera por <a href="https://jekyllrb.com/">Jekyll</a>, habría terminado escribiendo todo el HTML a mano. Menos mal por Jekyll.</p>
  - <p><strong>Web Components</strong>. Pude reutilizar mucho código escribiendo los ejercicios interactivos y los componentes de cuestionario como etiquetas HTML personalizadas (<a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">Web Components</a>). Es un desarrollo relativamente nuevo y espero que el W3C fomente su adopción.</p>

<br>
<a name="contact"></a>
## Créditos y Contacto
Para correcciones y sugerencias, escríbeme (Kao) a zichongkao@gmail.com. Puedes encontrar más sobre mí en <a href="http://kaomorphism.com">Kaomorphism</a>.

Muchas gracias a Noam Castel y Jowan Vogel por sus traducciones al hebreo y neerlandés, respectivamente, y a todos los que han ayudado con comentarios y revisiones.
