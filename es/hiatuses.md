---
layout: tutorial
title: Pausas en ejecuciones
dbFile: data/tx_deathrow_small.db
---

<a name="hiatuses"></a>

## Pausas

Este gráfico muestra las ejecuciones a lo largo del tiempo.<img src="imgs/exno_time.png"> Observa que ha habido varios periodos prolongados sin ejecuciones. Nuestro objetivo es averiguar exactamente cuándo ocurrieron y estudiar sus causas.

Nuestra estrategia es preparar la tabla de modo que cada fila contenga también la fecha de la ejecución anterior. Luego podemos calcular la diferencia entre ambas fechas, ordenarlas en orden descendente y leer las pausas más largas.

<br>
<a name="joins"></a>
## Pensando en JOINs
Ninguna de las técnicas que hemos aprendido hasta ahora es suficiente aquí. Nuestra tabla deseada tiene la misma longitud que la tabla original `executions`, por lo que podemos descartar agregaciones que producen una tabla más pequeña. El capítulo [Beazley](beazley.html) solo enseñó operaciones a nivel de fila que limitan a trabajar con información ya en las filas. Sin embargo, la fecha de la ejecución previa está fuera de una fila, así que tenemos que usar `JOIN` para traer esa información adicional.

Supongamos que la información adicional que queremos existe en una tabla llamada `previous` que tiene dos columnas `(ex_number, last_ex_date)`. Podríamos ejecutar la siguiente consulta para completar nuestra tarea:

    	SELECT
    		last_ex_date AS start,
    		ex_date AS end,
    		ex_date - last_ex_date AS day_difference
    	FROM executions
    	JOIN previous
    		ON executions.ex_number = previous.ex_number
    	ORDER BY day_difference DESC
    	LIMIT 10

El bloque `JOIN` es el foco de esta sección. En lugar de verlo como una línea aislada, a menudo es útil visualizarlo así: <img src="imgs/join_correctview.png"> Esto enfatiza cómo `JOIN` crea una gran tabla combinada que luego se alimenta al bloque `FROM` como cualquier otra tabla.
<a name="disam_cols"></a>

<div class="sideNote">
	<h3>Desambiguar columnas</h3>
	<p>La consulta anterior también es notable porque la cláusula <code>executions.ex_number = previous.ex_number</code> usa el formato <code>&lt;table&gt;.&lt;column&gt;</code> para especificar columnas. Esto solo es necesario porque ambas tablas tienen una columna llamada <code>ex_number</code>.</p>
</div>

<br>
<a name="join_types"></a>
## Tipos de joins
El bloque `JOIN` tiene la forma <code class='codeblock'>&lt;table1&gt; JOIN &lt;table2&gt; ON &lt;clause&gt;</code>. La cláusula funciona igual que en <code class='codeblock'>WHERE &lt;clause&gt;</code>. Es decir, es una expresión que se evalúa como verdadera o falsa y cada vez que una fila de la primera tabla y otra de la segunda coinciden con la cláusula siendo verdadera, las dos se emparejan:
<img src="imgs/join_base.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Pero, ¿qué sucede con las filas que no tienen coincidencias? En este caso, la tabla `previous` no tenía una fila para el número de ejecución 1 porque no hay ejecuciones anteriores.
<img src="imgs/join_unmatched.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

El comando <code>JOIN</code> por defecto realiza lo que se llama un "inner join" en el que las filas no coincidentes se descartan.
<img src="imgs/join_inner.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

Para preservar todas las filas de la tabla izquierda, usamos un <code>LEFT JOIN</code> en lugar del `JOIN` simple. Las partes vacías de la fila se dejan tal cual, lo que significa que se evalúan como <code>NULL</code>.
<img src="imgs/join_left.png" style="width:80%; display:block; margin-left:auto; margin-right:auto">

El <code>RIGHT JOIN</code> se puede usar para preservar filas no coincidentes en la tabla de la derecha, y el <code>OUTER JOIN</code> para preservar filas en ambas.

La sutileza final es el manejo de múltiples coincidencias. Si tenemos una tabla `duplicated_previous` con dos copias de cada fila de `previous`, cada fila de `executions` ahora coincide con dos filas en `duplicated_previous`.
<img src="imgs/join_dup_pre.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">
El join crea suficientes filas de `executions` para que cada fila coincidente de `duplicated_previous` tenga su propia pareja. Así, los joins pueden crear tablas más grandes que sus tablas de origen.
<img src="imgs/join_dup_post.png" style="width:90%; display:block; margin-left:auto; margin-right:auto">

<sql-quiz
	data-title="Marca las afirmaciones verdaderas."
	data-description="Supongamos que tenemos tableA con 3 filas y tableB con 5 filas.">
<sql-quiz-option
		data-value="cartesian_prod"
		data-statement="<code>tableA JOIN tableB ON 1</code> devuelve 15 filas."
		data-hint="La cláusula <code>ON 1</code> es siempre verdadera, así que cada fila de tableA se empareja con cada fila de tableB."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-value="bad_cartesian"
		data-statement="<code>tableA JOIN tableB ON 0</code> devuelve 0 filas."
		data-hint="Por la misma razón por la que <code>ON 1</code> devuelve 15 filas."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-value="left_join_bad"
		data-statement="<code>tableA LEFT JOIN tableB ON 0</code> devuelve 3 filas."
		data-hint="El left join preserva todas las filas de tableA incluso cuando no hay coincidencias en tableB."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-value="outer_join_bad"
		data-statement="<code>tableA OUTER JOIN tableB ON 0</code> devuelve 8 filas."
		data-hint="El outer join preserva todas las filas de tableA y tableB aunque no estén emparejadas."
		data-correct="true"></sql-quiz-option>
<sql-quiz-option
		data-value="outer_join_good"
		data-statement="<code>tableA OUTER JOIN tableB ON 1</code> devuelve 15 filas."
		data-hint="Todas las filas coinciden porque la cláusula es siempre verdadera, así que cualquier join devolverá 15 filas. Las diferencias entre joins solo afectan cómo tratan las filas no emparejadas."
		data-correct="true"></sql-quiz-option>
</sql-quiz>

<br>
<a name="dates"></a>
## Fechas
Tomemos un descanso de los joins y veamos esta línea en nuestra consulta plantilla:

    		ex_date - last_ex_date AS day_difference

Hemos hecho una gran suposición al pedir que se resten fechas. Imagina que eres la computadora recibiendo una línea así: ¿devuelves el número de días entre las fechas? ¿Horas o segundos? Para empeorar las cosas, SQLite no tiene tipos de fecha y hora formales (a diferencia de otros dialectos), así que `ex_date` y `last_ex_date` se tratan como cadenas. Estaríamos intentando hacer `'hello' - 'world'`. ¿Qué significa eso?

Afortunadamente, SQLite tiene funciones para indicar que ciertas cadenas contienen fechas y que deben tratarse como tales.

<sql-exercise
data-question='Consulta la <a href="https://www.sqlite.org/lang_datefunc.html">documentación</a> para arreglar la consulta y que devuelva el número de días entre las fechas.'
data-default-text="SELECT '1993-08-10' - '1989-07-07' AS day_difference"
data-solution="
SELECT JULIANDAY('1993-08-10') - JULIANDAY('1989-07-07') AS day_difference"

> </sql-exercise>

<br>
<a name="self_joins"></a>
## Self Joins
Con lo aprendido sobre fechas, podemos corregir nuestra consulta plantilla:

    	SELECT
    		last_ex_date AS start,
    		ex_date AS end,
    		JULIANDAY(ex_date) - JULIANDAY(last_ex_date)
    			AS day_difference
    	FROM executions
    	JOIN previous
    		ON executions.ex_number = previous.ex_number
    	ORDER BY day_difference DESC
    	LIMIT 5

El siguiente paso es construir la tabla `previous`.
<sql-exercise
	data-question="Escribe una consulta que genere la tabla `previous`."
	data-comment="Recuerda usar alias para formar los nombres de columna <code>(ex_number, last_ex_date)</code>. Pista: en lugar de desplazar fechas hacia atrás, podrías desplazar <code>ex_number</code> hacia adelante."
	data-solution="
SELECT
	ex_number + 1 AS ex_number,
	ex_date AS last_ex_date
FROM executions
WHERE ex_number < 553"></sql-exercise>

Ahora podemos anidar esta consulta en la plantilla anterior:
<sql-exercise
data-question="Anida la consulta que genera `previous` dentro de la plantilla."
data-comment="Observa que usamos un alias de tabla aquí, nombrando el resultado de la consulta anidada como 'previous'."
data-default-text="SELECT
last_ex_date AS start,
ex_date AS end,
JULIANDAY(ex_date) - JULIANDAY(last_ex_date)
AS day_difference
FROM executions
JOIN (<your-query>) previous
ON executions.ex_number = previous.ex_number
ORDER BY day_difference DESC
LIMIT 10"
data-solution="
SELECT
last_ex_date AS start,
ex_date AS end,
JULIANDAY(ex_date) - JULIANDAY(last_ex_date) AS day_difference
FROM executions
JOIN (
SELECT
ex_number + 1 AS ex_number,
ex_date AS last_ex_date
FROM executions
) previous
ON executions.ex_number = previous.ex_number
ORDER BY day_difference DESC
LIMIT 10"

> </sql-exercise>

`previous` se deriva de `executions`, así que en efecto estamos juntando `executions` consigo misma. Esto se llama "self join" y es una técnica poderosa para que filas obtengan información de otras filas de la misma tabla.

Hemos creado `previous` para clarificar su propósito, pero podemos escribir la consulta de forma más elegante haciendo el join directamente con otra copia de `executions`.
<sql-exercise
data-question="Rellena la cláusula <code>JOIN ON</code> para completar una versión más elegante de la consulta anterior."
data-comment="Ten en cuenta que todavía necesitamos dar un alias a una copia para referirnos a ella sin ambigüedad."
data-default-text="SELECT
previous.ex_date AS start,
executions.ex_date AS end,
JULIANDAY(executions.ex_date) - JULIANDAY(previous.ex_date)
AS day_difference
FROM executions
JOIN executions previous
ON <your-clause>
ORDER BY day_difference DESC
LIMIT 10"
data-solution="
SELECT
previous.ex_date AS start,
executions.ex_date AS end,
JULIANDAY(executions.ex_date) - JULIANDAY(previous.ex_date)
AS day_difference
FROM executions
JOIN executions previous
ON executions.ex_number = previous.ex_number + 1
ORDER BY day_difference DESC
LIMIT 10"

> </sql-exercise>

Ahora podemos usar las fechas precisas de las pausas para investigar qué ocurrió en cada periodo. En los años inmediatamente posteriores a la restauración de la pena de muerte hubo largos periodos sin ejecuciones debido al bajo número de condenas y a desafíos legales. Nos centraremos en dos pausas principales desde 1993.

La Pausa 1 fue debida a desafíos legales a la <a href="https://en.wikipedia.org/wiki/Antiterrorism_and_Effective_Death_Penalty_Act_of_1996">Ley Antiterrorismo y Efectiva Pena de Muerte de 1996</a>, aprobada tras los atentados de 1993 y 1995. La ley limitó procesos de apelación con el fin de hacer la pena de muerte más efectiva en ciertos casos.

La Pausa 2 fue causada por una suspensión decretada por la Corte Suprema mientras evaluaba <a href="https://en.wikipedia.org/wiki/Baze_v._Rees">Baze v. Rees</a>, que examinó si la inyección letal violaba la Octava Enmienda. Esto afectó las ejecuciones en todo el país porque muchos estados usaban la misma combinación de fármacos. La Corte Suprema finalmente ratificó la decisión de Kentucky y las ejecuciones en Texas se reanudaron meses después.

<br>
<a name="recap"></a>
## Resumen

La idea central detrás de los `JOIN`s ha sido crear una tabla aumentada porque la original no contenía la información que necesitábamos. Esto permite liberarnos de las limitaciones de una sola tabla y combinar múltiples tablas de maneras complejas. También hemos visto que con esta complejidad extra es importante llevar una contabilidad meticulosa: alias de tablas, renombrar columnas y definir buenas cláusulas `JOIN ON` ayudan a mantener el orden.
