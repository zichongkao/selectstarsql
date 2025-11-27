---
layout: tutorial
title: Reclamaciones de inocencia
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innocence"></a>

## Posible inocencia

Los opositores a la pena de muerte han argumentado que el riesgo de ejecutar por error a una persona inocente es un costo demasiado grande. En este capítulo intentamos aproximar cuántas personas inocentes pueden haber sido ejecutadas.

La principal salvedad es que una declaración de inocencia, incluso hecha en lecho de muerte, no constituye inocencia. Además, incluso si el recluso dice la verdad, hay muchas interpretaciones de inocencia: el recluso puede haber sido acusado de matar a dos personas pero ser inocente de matar a una sola; o puede haber matado al transeúnte pero no al agente. En Texas, el asesinato por sí solo no siempre conlleva la pena de muerte; debe tratarse de un delito capital, por lo que la situación puede ser compleja.

No obstante, sigue siendo inquietante que las declaraciones de inocencia persistan hasta el umbral de la ejecución cuando casi no queda nada por ganar. Nuestra tarea aquí es calcular con qué frecuencia ocurre esto calculando la proporción de declaraciones finales que contienen una reclamación de inocencia.

<br>
<a name="aggregations"></a>
## Funciones de agregación
Hay dos números que necesitamos para calcular la proporción:

	**Numerador**: Número de ejecuciones con reclamaciones de inocencia.

	**Denominador**: Número total de ejecuciones.

Hasta ahora, cada fila en la salida provenía de una sola fila de entrada. Sin embargo, aquí tanto el numerador como el denominador requieren información de múltiples filas. Esto nos dice que necesitamos usar una función de agregación. Agregar significa combinar múltiples elementos en un todo; de forma similar, las funciones de agregación toman varias filas y las combinan en un solo número.


<br>
<a name="count"></a>
## La función COUNT
`COUNT` es probablemente la función de agregación más utilizada. Como su nombre indica, cuenta cosas. Por ejemplo, <code class='codeblock'>COUNT(&lt;column&gt;)</code> devuelve el número de filas no nulas en la columna.

<sql-exercise
	data-question="Edita la consulta para encontrar cuántos reclusos ofrecieron una declaración final."
	data-comment="Podemos usar <code>COUNT</code> aquí porque se usan <code>NULL</code>s cuando no hay declaración."
	data-default-text="SELECT COUNT(first_name) FROM executions"
	data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

Como puedes ver, la función `COUNT` está ligada al concepto de `NULL`. Hagamos una pequeña digresión para aprender sobre `NULL`s.
<a name="nulls"></a>
<div class="sideNote">
	<h3>Nulos</h3>
	<p>En SQL, <code>NULL</code> es el valor de una entrada vacía. Esto es diferente de la cadena vacía <code>''</code> y del entero <code>0</code>, ambos no considerados <code>NULL</code>. Para comprobar si una entrada es <code>NULL</code>, usa <code>IS</code> y <code>IS NOT</code> en lugar de <code>=</code> y <code>!=</code>.</p>

	<sql-exercise
		data-question="Verifica que 0 y la cadena vacía no se consideran NULL."
		data-comment="Recuerda que esto es una cláusula compuesta. Ambas condiciones <code>IS NOT NULL</code> deben ser verdaderas para que la consulta devuelva <code>true</code>."
		data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL) "
		></sql-exercise>
</div>

Con esto, podemos encontrar el denominador de nuestra proporción:
<sql-exercise
	data-question="Encuentra el número total de ejecuciones en el conjunto de datos."
	data-comment="La idea es elegir una columna que confiablemente no tenga <code>NULL</code>s y contarla."
	data-default-text=""
	data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Variaciones de COUNT
Hasta ahora todo bien. Pero ¿y si no sabemos qué columnas están libres de `NULL`? ¿O si ninguna lo está? ¿Cómo obtener la longitud de la tabla?

La solución es `COUNT(*)`. Esto recuerda a `SELECT *` donde `*` representa todas las columnas. En la práctica `COUNT(*)` cuenta filas siempre que *alguna* de sus columnas no sea nula. Esto ayuda a obtener la longitud de la tabla porque no debería haber filas completamente nulas.

<sql-exercise
	data-question="Verifica que <code>COUNT(*)</code> da el mismo resultado que antes."
	data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Otra variación común es contar un subconjunto de la tabla. Por ejemplo, contar ejecuciones del condado Harris: `SELECT COUNT(*) FROM executions WHERE county='Harris'`. Pero ¿qué si queremos simultáneamente contar las ejecuciones del condado Bexar?

La solución es usar `CASE WHEN`, que actúa como un gran if-else. Tiene el formato:

		CASE
				WHEN <clause> THEN <result>
				WHEN <clause> THEN <result>
				...
				ELSE <result>
		END

Es una parte algo tosca de SQL; un error común es olvidar el `END` o la cláusula `ELSE`.

<sql-exercise
	data-question="Esta consulta cuenta las ejecuciones de Harris y Bexar. Sustituye los `SUM` por `COUNT` y ajusta los `CASE WHEN` para que funcione correctamente."
	data-comment="Cambiar solo `SUM` por `COUNT` no basta porque `COUNT` cuenta ceros ya que 0 no es nulo."
	data-default-text="SELECT
		SUM(CASE WHEN county='Harris' THEN 1
				ELSE 0 END),
		SUM(CASE WHEN county='Bexar' THEN 1
				ELSE 0 END)
FROM executions"
	data-solution="SELECT
		COUNT(CASE WHEN county='Harris' THEN 1
				ELSE NULL END),
		COUNT(CASE WHEN county='Bexar' THEN 1
				ELSE NULL END)
FROM executions"></sql-exercise>

<br>
## Práctica

<sql-exercise
	data-question="Encuentra cuántos reclusos tenían más de 50 años en el momento de la ejecución."
	data-comment="Esto ilustra que el bloque <code>WHERE</code> filtra antes de la agregación."
	data-default-text=""
	data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
	data-question="Encuentra el número de reclusos que declinaron dar una declaración final."
	data-comment="Para puntos extra, hazlo de 3 maneras: 1) con un bloque <code>WHERE</code>, 2) con <code>COUNT</code> + <code>CASE WHEN</code>, 3) con dos <code>COUNT</code>."
	data-default-text=""
	data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

Es útil pensar en cómo el motor ejecuta estas consultas: la versión con `WHERE` filtra primero y luego agrega, la versión `COUNT`+`CASE WHEN` recorre una vez, y la versión de doble `COUNT` lo recorre dos veces. Así que la primera suele ser la más eficiente.

<sql-exercise
	data-question="Encuentra la edad mínima, máxima y promedio de los reclusos al momento de la ejecución."
	data-comment="Usa las funciones de agregación <code>MIN</code>, <code>MAX</code> y <code>AVG</code>."
	data-default-text="SELECT ex_age FROM executions"
	data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>
<div class="sideNote">
	<h3>Buscar documentación</h3>
	<p>Este libro no pretende ser una referencia exhaustiva de SQL. Para eso tendrás que mirar otros recursos en línea. Es una habilidad importante porque seguirás consultando documentación incluso después de familiarizarte con el lenguaje.</p>
	<p>Con los modelos mentales que enseñamos aquí, las búsquedas deberían ser rápidas: normalmente solo comprobarás detalles como si la función se llama <code>AVERAGE</code> o <code>AVG</code>, en lugar de elegir un enfoque desde cero.</p>
	<p>Para búsquedas suelo usar <a href="https://www.w3schools.com/sql/default.asp">W3Schools</a>, Stack Overflow y la documentación oficial de <a href="http://sqlite.org">SQLite</a>.</p>
</div>

<sql-exercise
	data-question="Encuentra la longitud media (número de caracteres) de las declaraciones finales en el conjunto de datos."
	data-comment='Este ejercicio muestra que puedes componer funciones. Consulta la <a href="http://sqlite.org/lang_corefunc.html">documentación</a> para saber qué función devuelve el número de caracteres en una cadena.'
	data-default-text=""
	data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
	data-question="Lista todos los condados en el conjunto de datos sin duplicados."
	data-comment="Podemos obtener entradas únicas usando <code>SELECT DISTINCT</code>."
	data-default-text=""
	data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` no es estrictamente una función de agregación porque no devuelve un único número y opera sobre la salida de la consulta. Sin embargo, lo incluimos porque comparte la característica de operar sobre múltiples filas.

<br>
<a name="strange"></a>
## Una consulta extraña
Antes de terminar, veamos esta consulta: `SELECT first_name, COUNT(*) FROM executions`.

¿No parece extraña? Si tienes un buen modelo mental de agregaciones, ¡debería! `COUNT(*)` intenta devolver un único número (la longitud de la tabla) mientras que `first_name` intenta devolver un valor por fila. ¿Debería la computadora devolver uno o muchos resultados? Si devuelve uno, ¿qué `first_name` elige? Si devuelve muchos, ¿debe replicar el `COUNT(*)` en cada fila? Las formas no coinciden.

<sql-exercise
	data-question="Probémosla y veamos qué pasa."
	data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

En la práctica, las bases de datos tratan de devolver algo razonable. En nuestro caso, la base de datos elige el nombre correspondiente a la última fila de la tabla. Dado que la tabla está en orden cronológico inverso, la última fila es Charlie Brooks Jr. Las diferentes bases de datos pueden comportarse distinto, así que no conviene confiar en este comportamiento implícito.

<a name="dialects"></a>
<div class="sideNote">
	<h3>Dialectos de SQL y bases de datos</h3>
	<p>Aunque llamamos a esto un libro sobre SQL, en realidad es un libro sobre <i>SQLite</i>. SQL es una idea general; en la práctica existen dialectos que implementan distintas partes del estándar.</p>
	<p>El estándar no especifica todo: por ejemplo, no dicta si la función de longitud se llama <code>LEN</code> (SQL Server) o <code>LENGTH</code> (SQLite), ni cómo se deben citar identificadores. Por eso hay diferencias entre sistemas.</p>
	<p>Hemos elegido SQLite porque es común y porque podemos ejecutar una base de datos en el cliente del navegador para esta página interactiva. Nos centramos en la funcionalidad central y en los modelos mentales, que son transferibles entre dialectos.</p>
</div>

<br>
<a name="recap"></a>
## Conclusión y resumen
Usemos lo aprendido para completar nuestra tarea:
<sql-exercise
	data-question="Encuentra la proporción de reclusos que hacen reclamaciones de inocencia en su última declaración."
	data-comment="Para obtener división decimal, asegura que uno de los números sea decimal multiplicando por 1.0. Usa <code>LIKE '%innocent%'</code> para encontrar reclamaciones de inocencia." 
	data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
		THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

Este método es impreciso porque la inocencia puede expresarse de otras formas como "not guilty". Aun así, probablemente subestima el número real y da una estimación aproximada. La pregunta que queda es si estamos dispuestos a aceptar la posibilidad de que hasta un 5% de las personas ejecutadas sean inocentes. ([Paul Graham no está dispuesto.](http://paulgraham.com/prop62.html))

Para recapitular, hemos pasado de operaciones a nivel de fila a funciones de agregación sobre múltiples filas. Esto abre la posibilidad de estudiar comportamientos a nivel de sistema. En el siguiente capítulo aprenderemos a aplicar agregaciones por subgrupos usando `GROUP BY`.

