---
layout: tutorial
title: Beazley's Last Statement
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>
## The Beazley Case
In 1994, Napoleon Beazley shot 63-year-old businessman John Luttig in his garage while trying to steal his family's car. Because he was just shy of 18 years old at the time of the murder, the Beazley case ignited a fierce debate over the death penalty for juvenile offenders. 3 years after Beazley was executed, the Supreme Court prohibited the execution of offenders under 18 at the time of their offense ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons)).

The case was also notable because the victim was the father of a federal judge John Michael Luttig. During the appeals to the Supreme court, three of the nine justices recused themselves because of their personal ties to Judge Luttig, leaving only six to review the case.

Napoleon Beazley made an impassioned last statement arguing that an eye for an eye does not constitute justice. Our task is to retrieve his statement from the database.

<br>
<a name="first"></a>
## A First SQL Query
<sql-exercise
  data-question="Run this query to find the first 3 rows of the 'executions' table."
  data-comment="Viewing a few rows is a good way to find out the columns of a table. Try to remember the column names for later use."
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

The SQL query may look like an ordinary sentence, but you should view it as three Lego blocks:
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
As with Lego, each block has a fixed format and the different blocks have to fit together in particular ways.

<br>
<a name="select"></a>
## The SELECT Block
The `SELECT` block specifies which columns you want to output. Its format is <code class='codeblock'>SELECT &lt;column&gt;, &lt;column&gt;, ...</code>. Each column must be separated by a comma, but the space following the comma is optional. The star (ie. `*`) is a special character that signifies we want all the columns in the table.

<sql-exercise
  data-question="In the code editor below, revise the query to select the last_statement column in addition to the existing columns."
  data-comment="Once you're done, you can hit Shift+Enter to run the query."
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>
<div class="sideNote">
  <h3>SQL Comments</h3>
  <p>Notice that clicking "Show Solution" displays the solution in the editor preceded by <code>/*</code>. The contents between <code>/*</code> and <code>*/</code> are taken as comments and aren't run as code. This is useful for temporarily hiding code we don't want to run. To run the solution, simply delete or comment out your code and uncomment the solution.</p>
  <p><code>--</code> is another way of indicating comments. It is used to mark the rest of a single line as a comment. When we have multiple lines we want to comment out, <code>/* ... */</code> is more convenient than prepending <code>--</code> to each line.</p>
</div>

<br>
<a name="from"></a>
## The FROM Block
The <code>FROM</code> block specifies which table we're querying from. Its format is <code class="codeblock">FROM &lt;table&gt;</code>. It always comes after the <code>SELECT</code> block.

<sql-exercise
  data-question="Run the given query and observe the error it produces. Fix the query."
  data-comment="Make it a habit to examine error messages when something goes wrong. Avoid debugging by gut feel or trial and error."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

In the next example, observe that we don’t need the `FROM` block if we're not using anything from a table.

<sql-exercise
  data-question="Modify the query to divide 50 and 51 by 2."
  data-comment="SQL supports all the usual arithmetic operations."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

Isn't it strange that `51 / 2` gives `25` rather than `25.5`? This is because SQL is doing integer division. To do decimal division, at least one of the operands must be a decimal, for instance `51.0 / 2`. A common trick is to multiply one number by `1.0` to convert it into a decimal. This will come in useful in the later chapters.

<a name="capitalization"></a>
<div class="sideNote">
  <h3>Capitalization</h3>
  <p>Even though we’ve capitalized <code>SELECT</code>, <code>FROM</code> and <code>LIMIT</code>, SQL commands are not case-sensitive. You can see that the code editor recognizes them and formats them as a command no matter the capitalization. Nevertheless, I recommend capitalizing them to differentiate them from column names, table names and variables.</p>
  <p>Column names, table names and variables are also not case-sensitive in this version of SQL, though they are case-sensitive in many other versions. To be on the safe side, I recommend always assuming they are case-sensitive.</p>
</div>

<a name="whitespace"></a>
<div class="sideNote">
  <h3>Whitespace</h3>
  <p>Whitespace refers to spaces, tabs, linebreaks and other characters that are rendered as empty space on a page. As with capitalization, SQL isn't very sensitive to whitespace as long as you don't smush two words into one. This means that there just needs to be at least one whitespace character around each command — it doesn't matter which one or how many you use. Unless it's a short query, I prefer putting each command on a new line to improve readability.</p>

<sql-exercise
  data-question="Verify that messing up capitalization and whitespace still gives a valid query."
  data-comment="Karla Tucker was the first woman executed in Texas since the Civil War. She was put to death for killing two people during a 1983 robbery."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>
</div>

<br>
<a name="where"></a>
## The WHERE Block
The `WHERE` block allows us to filter the table for rows that meet certain conditions. Its format is <code class='codeblock'>WHERE &lt;clause&gt;</code> and it always goes after the `FROM` block. Here, a clause refers to a Boolean statement that the computer can evaluate to be true or false like <code>ex_number = 145</code>. You can imagine that the computer will go through each row in the table checking if the clause is true, and if so, return the row.

<sql-exercise
  data-question="Find the first and last names and ages (ex_age) of inmates 25 or younger at time of execution."
  data-comment="Because the average time inmates spend on death row prior to execution is 10.26 years, only 6 inmates this young have been executed in Texas since 1976."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

It's clear how we can use arithmetic operators like `<` and `<=` to build clauses. There are also a collection of string operators to work with strings.

The most powerful of these is probably <code>LIKE</code>. It allows us to use wildcards such as `%` and `_` to match various characters. For instance, `first_name LIKE '%roy'` will return true for rows with first names 'roy', 'Troy', and 'Deroy' but not 'royman'. The wildcard `_` will match a single character so `first_name LIKE '_roy'` will only match 'Troy'.

<sql-exercise
    data-question="Modify the query to find the result for Raymond Landry."
    data-comment="You might think this would be easy since we already know his first and last name. But datasets are rarely so clean. Use the LIKE operator so you don't have to know his name perfectly to find the row."
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
  <h3>Quotes</h3>
  <p>In SQL, strings are denoted by single quotes. Backticks (ie <code>`</code>) can be used to denote column and table names. This is useful when the column or table name is the same as a SQL keyword and when they have a space in them. It's possible to have a database with a table named 'where' and a column named 'from'. (Who would be so cruel as to do this?!) You would have to do <code>SELECT `from` FROM `where` WHERE ...</code>. This is another example why capitalization of SQL commands helps.</p>
</div>

As you've seen in the previous exercise, complex clauses can be made out of simple ones using Boolean operators like `NOT`, `AND` and `OR`. SQL gives most precedence to `NOT` and then `AND` and finally `OR`. But if, like me, you're too lazy to remember the order of precedence, you can use parenthesis to clarify the order you want.

<sql-exercise
  data-question="Insert a pair of parenthesis so that this statement returns 0."
  data-comment="Here we're relying on the fact that 1 means true and 0 means false."
  data-default-text="SELECT 0 AND 0 OR 1"
  data-solution="SELECT 0 AND (0 OR 1)"
  ></sql-exercise>

Let's take a quick quiz to cement your understanding.

<sql-quiz
  data-title="Select the <code>WHERE</code> blocks with valid clauses."
  data-description="These are tricky. Even if you've guessed correctly, read the explanations to understand the reasoning.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> and <code>0</code> are the most basic Boolean statements. This block guarantees that no rows will be returned."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="The <code>==</code> operator checks equality in many other programming languages but SQL uses <code>=</code>."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="Multiple column names may be used in a clause."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="The 'greater than or equal to' operator is <code>>=</code>. The order of the symbols matches what you would say in English."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="SQL can evaluate the truth-value of almost anything. The 'ex_age' column is filled with integers. The rule for integers is 0 is false and everything else is true, so only rows with non-zero ages will be returned."
    data-correct="true"
    ></sql-quiz-option>
   <sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="More than one wildcard is fine. But the pattern has to come after the LIKE operator."
    ></sql-quiz-option>
    </sql-quiz>

Now you have the tools you need to complete our project.
<sql-exercise
  data-question="Find Napoleon Beazley's last statement."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

Isn't it amazing how profound and eloquent Beazley is? Recall that he was only 25 when he made the statement and had been in prison since he was 18.

<br>
<a name="#recap"></a>
## Recap
The point of this chapter has been to introduce the basic but powerful <code class="codeblock">SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;clause&gt;</code>. It allows us to filter a table by having the computer go row by row and pick out those for which the `WHERE` clause is true. We've also learned how to put together fairly complex clauses that can operate on string, numeric and boolean-valued columns.

Up till now, we've been operating at the row-level which has limited us to looking at individual data points. In the next chapter, we'll focus on aggregations which will allow us to study system-level phenomena.
