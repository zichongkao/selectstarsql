---
layout: tutorial
title: The Long Tail
---

<a name="long_tail"></a>
<h2>Long Tails</h2>
Long tails refer to a small number of samples which occur a large number of times. When we plot these out, they form a small sliver far to the right of the center of mass which looks like a tail. Long tails indicate the presence of outliers whose unique behaviors may be of interest to us. In Texas, several counties have been known to account for most of the executions. Let's find the percentage of executions from each county so that we know which counties to look into.

<a name="aggregations"></a>
<h2>Aggregations</h2>
There are two numbers we need to calculate such a percentage: executions in each county, and executions in Texas. Until now, each row in the output has come from a single row of input. However here we have both the numerator and denominator requiring information from multiple rows of input. This is the most important characteristic of aggregation functions: <i>They take multiple rows of data and combine them into one number.</i>

`AVG`, `MAX`, `MIN` and `SUM` are aggregate functions that work on numeric-valued columns.

<sql-exercise
  data-question="Find the dates of the earliest and latest executions in the dataset."
  data-comment="Use the <code>MIN</code> and <code>MAX</code> functions."
  data-default-text="SELECT execution_date FROM executions"
  data-solution="SELECT MIN(execution_date), MAX(execution_date) FROM executions"></sql-exercise>

<a name="count"></a>
<h2>The COUNT Function</h2>
The length of our table is a basic and important piece of information. It informs us how much optimization we need when designing queries. For instance, we could run `SELECT * FROM my_table` if `my_table` is only 10 rows. But what if it had 10 million rows? Such a query might well hang your computer. Enter the `COUNT` function. It is an aggregate function that takes in any type of column and returns the number of non-null rows.

<div class="sideNote">
  <h3>Nulls</h3>
  <p>In SQL, <code>NULL</code> is the value of an empty entry. The empty string <code>''</code> and the integer <code>0</code> are <i>not</i> considered <code>NULL</code>. To check if an entry is <code>NULL</code>, use <code>IS</code> and <code>IS NOT</code> instead of <code>=</code> and <code>!=</code>.</p>

  <sql-exercise
    data-question="Verify that 0 and the empty string are not considered NULL."
    data-comment="Recall that this is a compound clause. Both of the two <code>IS NOT NULL</code> clauses have to be true for the query to return <code>true</code>."
    data-default-text="SELECT 0 IS NOT NULL AND '' IS NOT NULL "
    data-solution="SELECT 0 IS NOT NULL AND '' IS NOT NULL "></sql-exercise>
</div>

At this point, our best solution for finding table length is `COUNT(my_column)`. But what if `my_column` has `NULL`s in it? Worse still, what if all the columns have some indeterminate number of `NULL`s? The solution is `COUNT(*)`. This is reminiscent of `SELECT *` where the `*` represents all columns. In practice `COUNT(*)` counts rows as long as *any one* of their columns is non-null. This helps us find table length because a table shouldn't have rows that are completely null. Note that other aggregate functions don't work on `*`. After all, some of the columns may not be numeric-valued.

<sql-exercise
  data-question="Find the total number of executions in the dataset."
  data-comment="This will give us the denominator of our percentage."
  data-default-text=""
  data-solution="SELECT COUNT(*) FROM executions"></sql-exercise>

Let's do a few more exercises.

<sql-exercise
  data-question="Find the number of inmates who have declined to give a last statement."
  data-comment="They have <code>NULL</code> entries in their last_statement column. For bonus points, do it without a <code>WHERE</code> block."
  data-default-text=""
  data-solution="SELECT COUNT(*) - COUNT(last_statement) FROM executions"></sql-exercise>

<sql-exercise
  data-question="Find the length of the longest last statement."
  data-comment="The <code>LEN</code> function returns the length of a string."
  data-default-text=""
  data-solution="SELECT MAX(LEN(last_statement)) FROM executions"></sql-exercise>

<sql-exercise
  data-question="Find the first and last_name of the the inmate with the longest last statement."
  data-comment="Aggregate functions aren't confined to the <code>SELECT</code> block. Here you may have to use them in the <code>WHERE</code> block."
  data-default-text=""
  data-solution="SELECT first_name, last_name FROM executions WHERE LEN(last_statement) = MAX(LEN(last_statement))"></sql-exercise>

As I mentioned in <a href="frontmatter.html#pedagogy">Pedagogy</a>, learning SQL is primarily about learning a mental model of what the computer is doing with your query; and at the risk of belaboring the point, the crucial thing about aggregations is that the computer takes a stack of rows and returning just *one*. Can you see why the following doesn't make sense? `SELECT first_name, COUNT(*) FROM executions`.

`COUNT(*)` is trying to return a single entry consisting the length of the execution table. `first_name` is trying to return one entry for each row. Should the computer return one or multiple rows? If it returns one, which `first_name` should it pick? If it returns multiple, is it supposed to replicate the `COUNT(*)` result across all the rows?

<sql-exercise
  data-question="See what happens when you run this strange query."
  data-comment="In practice, databases try to return something sensible even though you pass in rubbish. Different databases will handle this case differently so it's best not to write stuff like this in the first place."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"
  data-solution="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

<a name="groupby"></a>
<h2>The GROUP BY Block</h2>
Moving on, let's find the second number: the execution counts by county. The naive way to do this is to run `SELECT COUNT(*) FROM executions WHERE county=<county>` for each of the 254 counties in Texas. A better way would be to use the `GROUP BY` block. Its most basic form is <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> and comes after the `WHERE` block.

<sql-exercise
  data-question="This query pulls the execution counts for each county."
  data-default-text="SELECT COUNT(*) FROM executions GROUP BY county"
  data-solution="SELECT COUNT(*) FROM executions GROUP BY county"></sql-exercise>

At this point, you might be thinking: 'How do I know which count pertains to which county?' The solution is to insert `county` into the select block like so:

<sql-exercise
  data-default-text="SELECT county, COUNT(*) FROM executions GROUP BY county"
  data-solution="SELECT county, COUNT(*) FROM executions GROUP BY county"></sql-exercise>

If you were paying attention earlier, alarm bells would be going off in your head. "Didn't we just learn not to mix aggregated and non-aggregated columns?" The difference here is that we have groups. The computer will gather all the rows with the same values in their grouping column, for example those with county as 'Harris', and run the aggregate functions. This guarantees no ambiguity about the value of the grouping column it should assign to the group.

<sql-quiz
  data-title="Mark the statements that are true:<br>The query <code>SELECT county, race, COUNT(*) FROM executions GROUP BY county, race</code> ...">
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="will return as many rows as there are unique combinations of counties and races."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="will have a different value of county for every row it returns."
    data-value="one_col_diff">"</sql-quiz-option>
</sql-quiz>

<sql-exercise
  data-question="Find the average length of inmates' full names based on their race.""
  data-default-text=""
  data-solution="SELECT race, AVG(LEN(first_name) + LEN(last_name)) FROM executions GROUP BY race"></sql-exercise>


Nested Queries

Average 

 f818acb10827a7144200cf0b4c2a876a7dfb3380
