---
layout: es_tutorial
title: Comentarios finales y preguntas de desafío
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>

## Comentarios finales

¡Gracias por llegar hasta aquí! Espero que haya sido una lectura agradable y reveladora.

Hemos cubierto la mayoría de los comandos y funciones importantes de SQL, pero espero que las lecciones principales sean las técnicas y heurísticas para pensar en consultas.

Algunas de las principales fueron:

- <p>Comparar la forma de las tablas disponibles con el resultado deseado para decidir qué agregación realizar.</p>
- <p>Examinar dónde reside la información que necesitamos. ¿Está en una fila adyacente? ¿En un grupo? ¿En todo el conjunto de datos?</p>
- <p>Interpretar las consultas en la estructura lógica correcta. Por ejemplo, ver cláusulas como esencialmente verdaderas o falsas; ver <code>&lt;table1&gt; JOIN &lt;table2&gt; ON ...</code> como una gran tabla combinada.</p>

Mirando hacia adelante, para completar tu educación en SQL, probablemente valga la pena estudiar funciones de ventana y expresiones de tabla comunes (CTE). Puedes replicar su comportamiento con las técnicas aprendidas, pero facilitan muchas tareas y aportan un nuevo paradigma. No las incluí porque en el momento de escribir esto SQLite [no soportaba funciones de ventana](https://www.sqlite.org/windowfunctions.html#history) y quería evitar la complejidad de un nuevo dialecto.

Hasta ahora solo hemos aprendido a consumir datos (consultas). Existe otra área completa de SQL dedicada a manipular datos: crear tablas, insertar y borrar. Entender estos conceptos puede ser útil incluso si no administras bases de datos, porque ayuda a entender por qué las tablas están estructuradas como están.

Lo más importante es que necesitas mucha práctica para ser eficaz en problemas del mundo real. La siguiente sección ofrece ejercicios, pero la dificultad aumenta bruscamente. Puede que quieras practicar fuera y volver cuando te sientas listo.

<br />
<a name="challenge_questions"></a>
## Preguntas de desafío
Los ejercicios de los capítulos previos fueron diseñados para reducir la complejidad y crear un entorno de aprendizaje. Este capítulo marca la frontera hacia el mundo salvaje de problemas de SQL. Aquí la idea es poner a prueba: las preguntas están optimizadas para utilidad más que por facilidad. Incluso escritores experimentados de SQL pueden tener dificultades; y hay mucho valor en esa lucha.

<a name="call_for_problems"></a>

<div class="sideNote">
  <H3>Llamado para problemas</H3>
  <p>Los buenos problemas hacen o deshacen un tutorial. Si tienes una idea para un nuevo problema o sección, estaré encantado de ayudarte a publicarlo con crédito completo para ti. Envíame un correo a <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> o presenta un <a href="https://github.com/zichongkao/selectstarsql">pull request</a>. Recuerda que los buenos problemas no tienen por qué ser difíciles: muestran técnicas con amplia aplicabilidad.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Conjunto de cosponsorship del Senado
### Autor: Kao
En esta sección introducimos un nuevo conjunto de datos de la 114ª sesión del Congreso (2015-2016) <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">compilado por James Fowler y otros</a>. Reestructuré el dataset para permitir estudiar relaciones de cosponsoring entre senadores.

El senador que presenta un proyecto se llama "sponsor". Otros senadores pueden apoyar presentándose como cosponsors. Los cosponsors al momento de la introducción se llaman "original cosponsors". Cada fila muestra el proyecto, el sponsor, un cosponsor original y los estados que representan. Puede haber múltiples cosponsors por proyecto.

<sql-exercise
  data-question="Echa un vistazo al dataset."
  data-comment="Con 15K filas es algo más grande que el dataset de Texas, así que evita imprimir todo."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
></sql-exercise>

<sql-exercise
  data-question="Encuentra el senador más 'conectado', es decir, el que tiene más cosponsorizaciones mutuas."
  data-comment="Una cosponsorización mutua se da cuando dos senadores han cosponsorizado proyectos del otro. Aunque un par haya cooperado en muchos proyectos, la relación cuenta solo una vez."
  data-solution="
WITH mutuals AS (
  SELECT DISTINCT
    c1.sponsor_name AS senator,
    c2.sponsor_name AS senator2
  FROM cosponsors c1
  JOIN cosponsors c2
    ON c1.sponsor_name = c2.cosponsor_name
    AND c2.sponsor_name = c1.cosponsor_name
)

SELECT senator, COUNT(\*) AS mutual_count
FROM mutuals
GROUP BY senator
ORDER BY mutual_count DESC
LIMIT 1" ></sql-exercise>

<sql-exercise
  data-question="Ahora encuentra el senador más conectado por estado."
  data-comment="Si varios empatan en el primer puesto, muestra ambos. Devuelve columnas: estado, senador y número de cosponsorizaciones mutuas."
  data-solution="
WITH mutual_counts AS (
  SELECT
    senator, state, COUNT(\*) AS mutual_count
  FROM (
    SELECT DISTINCT
      c1.sponsor_name AS senator,
      c1.sponsor_state AS state,
      c2.sponsor_name AS senator2
    FROM cosponsors c1
    JOIN cosponsors c2
      ON c1.sponsor_name = c2.cosponsor_name
      AND c2.sponsor_name = c1.cosponsor_name
  )
  GROUP BY senator, state
),

state_max AS (
  SELECT
    state,
    MAX(mutual_count) AS max_mutual_count
  FROM mutual_counts
  GROUP BY state
)

SELECT
  mutual_counts.state,
  mutual_counts.senator,
  mutual_counts.mutual_count
FROM mutual_counts
JOIN state_max
  ON mutual_counts.state = state_max.state
  AND mutual_counts.mutual_count = state_max.max_mutual_count
"></sql-exercise>

<sql-exercise
  data-question="Encuentra los senadores que cosponsorearon pero no fueron sponsors."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
  ON c1.cosponsor_name = c2.sponsor_name
  -- This join identifies cosponsors
  -- who have sponsored bills
WHERE c2.sponsor_name IS NULL
  -- LEFT JOIN + NULL is a standard trick for excluding
  -- rows. It's more efficient than WHERE ... NOT IN.
"></sql-exercise>
