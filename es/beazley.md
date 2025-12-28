---
layout: es_tutorial
title: La última declaración de Beazley
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>

## El caso Beazley

En 1994, Napoleon Beazley disparó al empresario de 63 años John Luttig en su garaje mientras intentaba robar el coche de su familia. Como tenía poco menos de 18 años en el momento del asesinato, el caso Beazley encendió un intenso debate sobre la pena de muerte para delincuentes juveniles. Tres años después de la ejecución de Beazley, la Corte Suprema prohibió la ejecución de delincuentes menores de 18 años en el momento del hecho ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons)).

El caso también fue notable porque la víctima era el padre de un juez federal, John Michael Luttig. Durante las apelaciones ante la Corte Suprema, tres de los nueve jueces se recusaron debido a sus vínculos personales con el juez Luttig, dejando solo seis para revisar el caso.

Napoleon Beazley pronunció una apasionada declaración final argumentando que ojo por ojo no constituye justicia. Nuestra tarea es recuperar su declaración de la base de datos.

<br>
<a name="first"></a>
## Una primera consulta SQL
<sql-exercise
  data-question="Ejecuta esta consulta para obtener las primeras 3 filas de la tabla 'executions'."
  data-comment="Ver unas pocas filas es una buena forma de conocer las columnas de una tabla. Trata de recordar los nombres de las columnas para usarlos después."
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

El query SQL puede parecer una oración, pero debes verlo como tres bloques de Lego:
<code class='codeblock'>SELECT \*</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
Como con Lego, cada bloque tiene un formato fijo y los diferentes bloques deben encajar entre sí de maneras particulares.

<br>
<a name="select"></a>
## El bloque SELECT
El bloque `SELECT` especifica qué columnas quieres mostrar. Su formato es <code class='codeblock'>SELECT &lt;column&gt;, &lt;column&gt;, ...</code>. Cada columna debe separarse por una coma, aunque el espacio después de la coma es opcional. El asterisco (es decir, `*`) es un carácter especial que indica que queremos todas las columnas de la tabla.

<sql-exercise
  data-question="En el editor de código abajo, modifica la consulta para seleccionar la columna last_statement además de las columnas existentes."
  data-comment="Una vez que termines, puedes presionar Shift+Enter para ejecutar la consulta."
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>

<div class="sideNote">
  <h3>Comentarios en SQL</h3>
  <p>Fíjate que al hacer clic en "Mostrar solución" se muestra la solución en el editor precedida por <code>/*</code>. El contenido entre <code>/*</code> y <code>*/</code> se toma como comentario y no se ejecuta como código. Esto es útil para ocultar temporalmente código que no queremos ejecutar. Para ejecutar la solución, simplemente borra o comenta tu código y descomenta la solución.</p>
  <p><code>--</code> es otra forma de indicar comentarios. Se usa para marcar el resto de una sola línea como comentario. Cuando tenemos múltiples líneas que queremos comentar, <code>/* ... */</code> es más conveniente que anteponer <code>--</code> a cada línea.</p>
</div>

<br>
<a name="from"></a>
## El bloque FROM
El bloque <code>FROM</code> especifica de qué tabla estamos consultando. Su formato es <code class="codeblock">FROM &lt;table&gt;</code>. Siempre aparece después del bloque <code>SELECT</code>.

<sql-exercise
  data-question="Ejecuta la consulta dada y observa el error que produce. Corrige la consulta."
  data-comment="Es una buena práctica examinar los mensajes de error cuando algo sale mal. Evita depurar por intuición."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

En el siguiente ejemplo, observa que no necesitamos el bloque `FROM` si no usamos nada de una tabla.

<sql-exercise
  data-question="Modifica la consulta para dividir 50 y 51 entre 2."
  data-comment="SQL soporta las operaciones aritméticas habituales."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

No es extraño que `51 / 2` dé `25` en lugar de `25.5`. Esto se debe a que SQL está haciendo una división entera. Para obtener división decimal, al menos uno de los operandos debe ser decimal, por ejemplo `51.0 / 2`. Un truco común es multiplicar un número por `1.0` para convertirlo en decimal. Esto será útil en capítulos posteriores.

<a name="capitalization"></a>

<div class="sideNote">
  <h3>Mayúsculas</h3>
  <p>Aunque hemos puesto en mayúscula <code>SELECT</code>, <code>FROM</code> y <code>LIMIT</code>, los comandos SQL no distinguen mayúsculas de minúsculas. Puedes ver que el editor los reconoce y los formatea como comando sin importar la capitalización. Aun así, recomiendo capitalizarlos para diferenciarlos de nombres de columnas, tablas y variables.</p>
  <p>Los nombres de columnas, tablas y variables tampoco distinguen mayúsculas en esta versión de SQL, aunque sí lo hacen en muchas otras variantes. Para estar seguro, recomiendo asumir que sí distinguen.</p>
</div>

<a name="whitespace"></a>

<div class="sideNote">
  <h3>Espacios en blanco</h3>
  <p>Los espacios en blanco se refieren a espacios, tabulaciones, saltos de línea y otros caracteres que se muestran como espacio vacío. Al igual que con la capitalización, SQL no es muy sensible a los espacios siempre que no juntes dos palabras. Esto significa que basta con al menos un caracter de espacio alrededor de cada comando. A menos que la consulta sea corta, prefiero poner cada comando en una línea nueva para mejorar la legibilidad.</p>

<sql-exercise
  data-question="Verifica que alterar la capitalización y los espacios sigue dando una consulta válida."
  data-comment="Karla Tucker fue la primera mujer ejecutada en Texas desde la Guerra Civil. Fue ejecutada por matar a dos personas durante un robo en 1983."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>

</div>

<br>
<a name="where"></a>
## El bloque WHERE
El bloque `WHERE` nos permite filtrar la tabla para filas que cumplan ciertas condiciones. Su formato es <code class='codeblock'>WHERE &lt;clause&gt;</code> y siempre va después del bloque `FROM`. Aquí, una cláusula se refiere a una expresión booleana que la computadora puede evaluar como verdadera o falsa, por ejemplo <code>ex_number = 145</code>. Puedes imaginar que la computadora inspecciona cada fila comprobando si la cláusula es verdadera y, si lo es, devuelve la fila.

<sql-exercise
  data-question="Encuentra los nombres y apellidos y las edades (ex_age) de los presos de 25 años o menos en el momento de la ejecución."
  data-comment="Debido a que el tiempo promedio que los reclusos pasan en el corredor de la muerte antes de la ejecución es 10.26 años, solo 6 presos tan jóvenes han sido ejecutados en Texas desde 1976."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

Es claro cómo podemos usar operadores aritméticos como `<` y `<=` para construir cláusulas. También existen operadores de cadena. El más potente probablemente sea <code>LIKE</code>, que permite comodines como `%` y `_` para casar patrones.

<sql-exercise
    data-question="Modifica la consulta para encontrar el resultado de Raymond Landry."
    data-comment="Puede parecer fácil ya que conocemos su nombre, pero los datos rara vez están tan limpios. Usa LIKE para no necesitar el nombre exacto."
    data-default-text="SELECT first_name, last_name, ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name = 'Landry'"
    data-solution="SELECT first_name, last_name, ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name LIKE '%Landry%'"></sql-exercise>

<a name="quotes"></a>

<div class="sideNote">
  <h3>Comillas</h3>
  <p>En SQL, las cadenas se denotan con comillas simples. Las comillas invertidas (ie <code>`</code>) pueden usarse para indicar nombres de columnas y tablas. Esto es útil cuando el nombre es igual a una palabra reservada o contiene espacios. Por ejemplo, podrías tener una tabla llamada 'where' y una columna llamada 'from'. Entonces tendrías que usar <code>SELECT `from` FROM `where` WHERE ...</code>. Esto es otra razón para capitalizar los comandos SQL.</p>
</div>

Como has visto en el ejercicio anterior, las cláusulas complejas pueden construirse a partir de cláusulas simples usando operadores booleanos como `NOT`, `AND` y `OR`. SQL da más precedencia a `NOT`, luego a `AND` y finalmente a `OR`. Pero si, como yo, eres demasiado perezoso para recordar el orden de precedencia, puedes usar paréntesis para aclarar el orden que deseas.

<sql-exercise
data-question="Inserta un par de paréntesis para que esta sentencia devuelva 0."
data-comment="Aquí nos apoyamos en el hecho de que 1 significa true y 0 significa false."
data-default-text="SELECT 0 AND 0 OR 1"
data-solution="SELECT 0 AND (0 OR 1)"

> </sql-exercise>

Hagamos un breve cuestionario para afianzar lo aprendido.

<sql-quiz
  data-title="Selecciona los bloques <code>WHERE</code> con cláusulas válidas."
  data-description="Estos son tramposos. Aunque hayas acertado, lee las explicaciones para entender el razonamiento.">
<sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> y <code>0</code> son las declaraciones booleanas más básicas. Este bloque garantiza que no se devolverán filas."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="El operador <code>==</code> comprueba igualdad en muchos otros lenguajes, pero SQL usa <code>=</code>."
    ></sql-quiz-option>
<sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="Se pueden usar varios nombres de columna en una cláusula."
    data-correct="true"></sql-quiz-option>
<sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="El operador 'mayor o igual' es <code>>=</code>. El orden de los símbolos coincide con lo que dirías en inglés."
    ></sql-quiz-option>
<sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="SQL puede evaluar el valor booleano de casi cualquier cosa. La columna 'ex_age' está llena de enteros. La regla para enteros es que 0 es false y todo lo demás es true, así que solo se devolverán filas con edades no nulas."
    data-correct="true"
    ></sql-quiz-option>
<sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="Más de un comodín está bien. Pero el patrón tiene que ir después del operador LIKE."
    ></sql-quiz-option>
</sql-quiz>

Ahora tienes las herramientas necesarias para completar nuestro proyecto.
<sql-exercise
  data-question="Encuentra la última declaración de Napoleon Beazley."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

¿No es asombroso lo profundo y elocuente que es Beazley? Recuerda que tenía solo 25 años cuando hizo la declaración y había estado en prisión desde los 18.

<br>
<a name="#recap"></a>
## Resumen
El objetivo de este capítulo ha sido introducir la forma básica pero poderosa <code class="codeblock">SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;clause&gt;</code>. Permite filtrar una tabla haciendo que la computadora inspeccione fila por fila y seleccione aquellas para las cuales la cláusula `WHERE` es verdadera. También hemos aprendido a construir cláusulas relativamente complejas que pueden operar sobre columnas de tipo cadena, numéricas y booleanas.

Hasta ahora, hemos estado operando a nivel de fila, lo que limita a observar puntos de datos individuales. En el siguiente capítulo nos centraremos en agregaciones que nos permitirán estudiar fenómenos a nivel de sistema.
