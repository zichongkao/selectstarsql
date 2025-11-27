---
layout: tutorial
title: La larga cola
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>

## Colas largas

Las colas largas se refieren a pequeños recuentos que ocurren muchas veces. Cuando las graficamos, forman una delgada franja a la derecha que parece una cola. Indican la presencia de valores atípicos que pueden ser de interés.

En el contexto de las ejecuciones en Texas, la "cola larga" se refiere a un pequeño número de condados que han realizado muchas ejecuciones.

Encontraremos el porcentaje de ejecuciones por condado para identificar los del extremo de la cola.

Como será cada vez más evidente, la forma de las tablas nos indica mucho sobre las operaciones que necesitamos realizar (esto es análogo al análisis dimensional en física). En este caso, podemos ver que los métodos vistos hasta ahora son insuficientes: el capítulo [Beazley](beazley.html) trató operaciones a nivel de fila, pero aquí necesitamos agregar para obtener datos por condado. El capítulo [Claims of Innocence](innocence.html) nos enseñó la agregación, pero esas funciones producirían una sola fila cuando en realidad queremos una fila por condado.

<br>
<a name="groupby"></a>
## El bloque GROUP BY
Aquí es donde entra `GROUP BY`. Nos permite dividir el conjunto de datos y aplicar funciones de agregación dentro de cada grupo, produciendo una fila por grupo. Su forma básica es <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> y va después del bloque `WHERE`.

<sql-exercise
	data-question="Esta consulta obtiene el número de ejecuciones por condado."
	data-default-text="SELECT
	county,
	COUNT(*) AS county_executions
FROM executions
GROUP BY county"></sql-exercise>

Si recuerdas <a href='innocence.html#strange'>Una consulta extraña</a>, te sonarán las alarmas: ¿no aprendimos a no mezclar columnas agregadas y no agregadas? La diferencia aquí es que las columnas por las que agrupar son las únicas permitidas como no agregadas. Todas las filas del grupo comparten el mismo valor en esas columnas, así que no hay ambigüedad.

Quizá también hayas notado el uso de `AS`. Es lo que llamamos "alias". En el bloque `SELECT`, <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> da un alias que podemos referenciar más adelante. Ahorramos reescribir expresiones largas y aclaramos el propósito.

<sql-exercise
	data-question="Esta consulta cuenta ejecuciones con y sin declaración final. Modifícala para desglosarla además por condado."
	data-comment="La cláusula <code>last_statement IS NOT NULL</code> actúa como una variable indicadora donde 1 significa true y 0 false."
	data-default-text="SELECT
	last_statement IS NOT NULL AS has_last_statement,
	COUNT(*)
FROM executions
GROUP BY has_last_statement"
	data-solution="SELECT
	last_statement IS NOT NULL AS has_last_statement,
	county,
	COUNT(*)
FROM executions
GROUP BY has_last_statement, county"
	></sql-exercise>

<br>
<a name="having"></a>
## El bloque HAVING
El siguiente ejercicio ilustra que filtrar con `WHERE` ocurre antes de agrupar y agregar. Esto se refleja en el orden sintáctico: `WHERE` precede siempre a `GROUP BY`.

<sql-exercise
	data-question="Cuenta el número de reclusos de 50 años o más ejecutados en cada condado."
	data-comment="Podrías usar <code>CASE WHEN</code>, pero intenta usar el bloque <code>WHERE</code> aquí."
	data-default-text=""
	data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"
	></sql-exercise>

¿Qué ocurre si queremos filtrar por el resultado de la agregación? No podemos mirar al futuro. Para eso usamos `HAVING`.

<sql-exercise
	data-question="Lista los condados en los que más de 2 reclusos de 50 o más años han sido ejecutados."
	data-comment="Esto construye sobre el ejercicio anterior. Necesitamos un filtro adicional que use el resultado de la agregación, por eso no puede ir en `WHERE`. Mira <a href='https://www.w3schools.com/sql/sql_having.asp'><code>HAVING</code></a>."
	data-default-text=""
	data-solution="
SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(*) > 2"
	></sql-exercise>

<br>
## Práctica
Este quiz está diseñado para desafiar tu comprensión. Lee las explicaciones aunque aciertes.

<sql-quiz
	data-title="Marca las afirmaciones verdaderas."
	data-description="Esta consulta encuentra el número de reclusos por condado y por rango de edad de 10 años. <pre>
SELECT
	county,
	ex_age/10 AS decade_age,
	COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
<sql-quiz-option
		data-value="valid"
		data-statement="La consulta es válida (no lanzará error)."
		data-hint="¿Te desconcertó <code>ex_age/10</code>? Agrupar por columnas transformadas también es válido."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-value="gran"
		data-statement="La consulta devolvería más filas si usáramos <code>ex_age</code> en lugar de <code>ex_age/10</code>."
		data-hint="Recuerda que <code>ex_age/10</code> es división entera que redondea las edades, produciendo menos grupos únicos."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-value="unique_combocc"
		data-statement="La salida tendrá tantas filas como combinaciones únicas de condado y decade_age en el dataset."
		data-hint="Esto es correcto."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-statement="La salida tendrá un grupo ('Bexar', 6) aunque no haya reclusos de Bexar entre 60 y 69."
		data-hint="GROUP BY encuentra combinaciones <i>en el dataset</i>, no todas las combinaciones teóricas."
		data-value="abstract_cartesian"></sql-quiz-option>
<sql-quiz-option
		data-statement="La salida tendrá un valor distinto de county para cada fila."
		data-hint="Eso sería cierto solo si county fuera la única columna de agrupamiento. Aquí podemos tener muchos grupos con el mismo county pero diferente decade_age."
		data-value="one_col_diff"></sql-quiz-option>
<sql-quiz-option
		data-statement="La salida puede tener grupos con conteo 0."
		data-hint="Si no hay filas para ('Bexar', 6), el grupo simplemente no aparece."
		data-value="count_zero"></sql-quiz-option>
<sql-quiz-option
		data-statement="La consulta sería válida aun sin especificar county en SELECT."
		data-hint="Las columnas de agrupamiento no tienen que aparecer en SELECT, sería válido pero confuso."
		data-value="missing_gp_col"
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-statement="Es razonable añadir <code>last_name</code> en SELECT sin agrupar por ella."
		data-hint="Aunque SQLite lo permitiría (ver 'Una consulta extraña'), es mala práctica mezclar columnas no agregadas y no agrupadas."
		data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>

<sql-exercise
	data-question="Lista todos los condados distintos en el dataset."
	data-comment="Lo hicimos antes con <code>SELECT DISTINCT</code>. Ahora usa <code>GROUP BY</code>."
	data-default-text=""
	data-solution="SELECT county FROM executions GROUP BY county"
	></sql-exercise>

<br>
<a name="nested"></a>
## Consultas anidadas
En apariencia podríamos querer algo como:

    	SELECT
    		county,
    		PERCENT_COUNT(*)
    	FROM executions
    	GROUP BY county

¿No sería útil una función así? No existe porque requeriría agregar dentro de grupos (numerador) y en toda la tabla (denominador) a la vez. La solución es usar dos consultas y combinarlas mediante anidamiento.

<sql-exercise
	data-question="Encuentra el nombre del recluso con la declaración más larga (por número de caracteres)."
	data-comment="Escribe la consulta adecuada para anidar en &lt;<code>length-of-longest-last-statement</code>&gt;."
	data-default-text="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
		(<length-of-longest-last-statement>)"
	data-solution="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
		(SELECT MAX(LENGTH(last_statement))
		 FROM executions)"></sql-exercise>

<sql-exercise
	data-question="Inserta la subconsulta <code>&lt;count-of-all-rows&gt;</code> para hallar el porcentaje de ejecuciones por condado."
	data-comment="100.0 es decimal para obtener porcentajes con decimales."
	data-default-text="SELECT
	county,
	100.0 * COUNT(*) / (<count-of-all-rows>)
		AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
	data-solution="SELECT
	county,
	100.0 * COUNT(*) / (SELECT COUNT(*) FROM executions)
		AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
	></sql-exercise>

He añadido silenciosamente un `ORDER BY`. Su formato es <code class="codeblock">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> y puede modificarse con `DESC` para orden descendente.

<br>
<a name="harris"></a>
## Condado Harris
¿Te sorprende que Harris (Houston), Dallas, Bexar y Tarrant sumen cerca del 50% de las ejecuciones en Texas? Parte de la explicación es que la distribución de ejecuciones sigue en parte la distribución poblacional. El censo de Texas de 2010 muestra que esos cuatro condados tenían 10.0M de población, el 40.0% de Texas (25.1M), lo que atenúa la sorpresa.

Sin embargo, Harris destaca: tiene 16.4% de la población pero 23.1% de las ejecuciones, casi 50% más de lo esperado.

Estudios han sugerido varias razones: procesos de enjuiciamiento bien financiados, fiscales con fuerte interés en la pena de muerte, jueces electos y déficits en controles y balances en el sistema judicial local.

<br>
<a name="recap"></a>
## Resumen
En esta sección aprendimos a agregar por grupos y a usar anidamiento para usar la salida de una consulta interna en una externa. Estas técnicas permiten calcular porcentajes y otros indicadores.

<a name="mapreduce"></a>

<div class="sideNote">
	<h3>MapReduce</h3>
	<p>Un apéndice interesante: hemos aprendido a hacer MapReduce en SQL. MapReduce es un paradigma que ve los cálculos como pasos de "map" y "reduce". El capítulo <a href="beazley.html">Beazley</a> fue sobre mapping; este capítulo muestra cómo reducir grupos usando agregación.</p>
</div>

En el siguiente capítulo aprenderemos sobre `JOIN`s que permiten trabajar con múltiples tablas.
