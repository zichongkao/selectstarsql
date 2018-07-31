---
layout: tutorial
---
<div id="nav">
  <ul class="siblinks">
    <li><a href="#beazley_case">1. The Beazley Case</a></li>
    <li><a href="#first">2. A First SQL Query</a></li>
    <li><a href="#select">3. The SELECT Block</a></li>
    <li><a href="#from">4. The FROM Block</a></li>
    <li><a href="#where">5. The WHERE Block</a></li>
  </ul>
</div>

<a name="beazley_case"></a>
<h2>The Beazley Case</h2>
In 1994, Napolean Beazley shot 63-year-old businessman John Luttig in his garage while trying to steal his family's car. The Beazley case ignited a fierce debate over the death penalty for juvenile offenders because he was just shy of 18 years old at the time of the murder. In 2005, 3 years after Beazley was executed, the Supreme Court prohibited the execution of offenders under 18 at the time of their offense.

The case was also notable because the victim was the father of a federal judge John Michael Luttig. During the appeals to the Supreme court, three of the nine justices recused themselves because of their personal ties to Judge Luttig, leaving only six to review the case.

Napolean Beazley made an impassionate last statement arguing that an eye for an eye does not constitute justice. Our task is to retrieve his statement from the database.

<br>
<a name="first"></a>
<h2>A First SQL Query</h2>
<sql-exercise
  data-question="Run this query to find the first 3 rows of the 'executions' table."
  data-comment="Viewing a few rows is a good way to find out the columns of a table."
  data-default-text="SELECT * FROM executions LIMIT 3"
  data-solution="SELECT * FROM executions LIMIT 3"></sql-exercise>

The SQL query may look like an ordinary sentence, but you should view it as three *Lego blocks*:
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
As with Lego, each block has a fixed format and the different blocks have to fit together in particular ways.

<br>
<a name="select"></a>
<h2>The SELECT Block</h2>
The `SELECT` block specifies which columns you want to output. Its format is <code class='codeblock'>SELECT &lt;column_name&gt;, &lt;column_name&gt;, ...</code>. Each column must be separated by a comma, but the space following the comma is optional. The star (ie. `*`) is a special character that signifies we want all the columns in the table.

<sql-exercise
  data-question="Edit the query to select first_name, last_name and last_statement columns."
  data-default-text="SELECT first_name, last_name FROM executions LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>
  
<div class="sideNote">
  <h3>SQL Comments</h3>
  <p>Notice that clicking "Show Solution" appends the solution to the editor preceded by two dashes. The two dashes indicate that the rest of the line is a comment and shouldn't be run as code. It is useful for temporarily hiding code you don't want to run. To run the solution, simply comment out your code and uncomment the solution.</p>
</div>

<br>
<a name="from"></a>
<h2>The FROM Block</h2>
The <code>FROM</code> block specifies which table we're querying from. It's format is <code class="codeblock">FROM &lt;table_name&gt;</code>. It always comes *after* the <code>SELECT</code> block.

<sql-exercise
  data-question="Run the given query and observe the error it produces. Fix the query."
  data-comment="Make it a habit to examine error messages when something goes wrong. Avoid debugging by gut feel or trial and error."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>
  
We don’t need the `FROM` block if we not using anything from a table.

<sql-exercise
  data-question="Modify the query to calculate the product and sum of 7843 and 730."
  data-comment="SQL supports all the usual arithmetic operations."
  data-default-text="SELECT 432 - 19, 5 / 2"
  data-solution="SELECT 7843 * 730, 7843 + 730"></sql-exercise>
  
<div class="sideNote">
  <h3>Capitalization</h3>
  <p>Even though we’ve capitalized <code>SELECT</code>, <code>FROM</code> and <code>LIMIT</code>, SQL commands are not case-sensitive. Nevertheless, I recommend capitalizing them to differentiate them from column names, table names and variables. Note that column names, table names and variables <i>are</i> case-sensitive though!</p>
</div>

<div class="sideNote">
  <h3>Whitespace</h3>
  <p>Whitespace refers to spaces, tabs, linebreaks and other characters that are rendered as empty space on a page. As with capitalization, SQL isn't very sensitive to whitespace as long as you don't smush two words into one. This means that there just needs to be at least one whitespace character around each command — it doesn't matter which one or how many you use. Unless it's a short query, I prefer putting each command on a new line to improve readability.</p>
</div>

<sql-exercise
  data-question="Verify that messing up capitalization and whitespace still gives a valid query."
  data-comment="Karla Tucker was the first woman executed in Texas since the Civil War. She was put to death for killing two people during a 1983 robbery."
  data-default-text="   SeLeCt   first_name,last_name 
  fRoM      executions   
           WhErE execution_number = 145"
  data-solution="SELECT first_name, last_name FROM executions WHERE execution_number = 145"></sql-exercise>

<br>
<a name="where"></a>
<h2>The WHERE Block</h2>
The `WHERE` block allows us to filter the table for rows that meet certain conditions. Its format is <code class='codeblock'>WHERE &lt;clause&gt;</code> and it always goes after the `FROM` block. Here, a clause refers to a logical operation that the computer can evaluate to be true or false like <code>execution_number = 145</code>. You can imagine that the computer will go through each row in the table checking if the clause is true, and if so, return the row.

<sql-exercise
  data-question="Find the first and last names and ages of inmates 25 or younger at time of execution."
  data-comment="Because the average time inmates spend on death row prior to execution is 10.26 years, only 6 inmates this young have been executed in Texas."
  data-default-text=""
  data-solution="SELECT first_name, last_name, age FROM executions WHERE age <= 25"></sql-exercise>



<sql-quiz
  data-title="Select the <code>WHERE</code> blocks with valid clauses."
  data-description="These are tricky. Even if you've guessed correctly, read the hints to understand the reasoning.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE false"
    data-hint="<code>true</code> and <code>false</code> are the most basic logical clauses. This block guarantees that no rows will be returned."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE age == 62"
    data-hint="The <code>==</code> operator checks equality in many other programming languages but SQL uses <code>=</code>."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE execution_number < age"
    data-hint="Multiple column names may be used in a clause."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE age => 62"
    data-hint="The 'greater than or equal to' operator is <code>>=</code>. The order of the symbols matches what you would say in English."
    ></sql-quiz-option>    
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE age"
    data-hint="SQL can evaluate the truth-value of almost anything. The 'age' column is filled with integers. The rule for integers is 0 is false and everything else is true, so only rows with non-zero ages will be returned."
    data-correct="true"
    ></sql-quiz-option>
    </sql-quiz>

Now you have the tools you need to complete our project.
<sql-exercise
  data-question="Find Napolean Beazley's last statement."
  data-comment=""
  data-default-text=""
  data-solution="SELECT last_statement FROM executions WHERE first_name = 'Napoleon' AND last_name = 'Beazley'"></sql-exercise>

