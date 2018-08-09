---
layout: tutorial
title: The Harris County Tutorial
---

<a name="harris"></a>
<h2>Harris County</h2>
Our task is to find the percentage of all executions that took place in each county.

<a name="aggregations"></a>
<h2>Aggregations</h2>
There are two numbers we need to calculate the percentage: executions in each county, and executions in Texas. Until now, each row in the output has come from a single row of input. However here we have both the numerator and denominator requiring information from multiple rows of input. This is how we know we need an aggregation function.

The functions `COUNT`, `AVG`, `MAX`, `MIN` and `SUM` take multiple rows of data and combine them into one number. `COUNT` takes in columns of any type and returns the number of non-null rows. The others only work on numeric-valued columns. 

<div class="sideNote">
  <h3>Nulls</h3>
  <p>In SQL, <code>NULL</code> is the value of an empty entry. The empty string <code>''</code> and the integer <code>0</code> are <i>not</i> considered <code>NULL</code>. To check if an entry is <code>NULL</code>, use <code>IS</code> and <code>IS NOT</code> instead of <code>=</code> and <code>!=</code>.</p>
</div>  

<sql-exercise
  data-question="Verify that 0 and the empty string are not considered NULL."
  data-comment="Recall that this is a compound clause. If at least one of the two <code>IS NOT NULL</code> clauses were false, the query would return <code>false</code>."
  data-default-text="SELECT 0 IS NOT NULL AND '' IS NOT NULL "
  data-solution="SELECT 0 IS NOT NULL AND '' IS NOT NULL "></sql-exercise>

Recall that `SELECT *` returns all the columns of the table. We can also do `SELECT COUNT(*)` which returns the length of the table. In practice it is probably counting rows with any non-null entries, and it doesn't make sense for a table to have a row filled with nulls. Other aggregate functions don't work on `*`. After all, some of the columns may not be numeric-valued. 

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

As I mentioned in <a href="frontmatter.html#pedagogy">Pedagogy</a>, learning SQL is primarily about learning a mental model of what the computer is doing with your query; and at the risk of belaboring the point, the crucial thing to visualize when thinking about aggregations is the computer taking a stack of rows and returning just *one*. Can you see why the following doesn't make sense? `SELECT first_name, COUNT(*) FROM executions`.

`COUNT(*)` is trying to return a single entry consisting the length of the execution table. `first_name` is trying to return one entry for each row. Should the computer return one or multiple rows? If it returns one, which `first_name` should it pick? If it returns multiple, is it supposed to replicate the `COUNT(*)` result across all the rows?

<sql-exercise
  data-question="See what happens when you run this strange query."
  data-comment="In practice, databases try to return something sensible even though you pass in rubbish. Different databases will handle this case differently so it's best not to write stuff like this in the first place."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"
  data-solution="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

<a name="groupby"></a>
<h2>Group By</h2>
Moving on, let's find the second number: the execution counts by county. The naive way to do this is to run `SELECT COUNT(*) FROM executions WHERE county=<county>` for each county in Texas. Instead, we should use the `GROUP BY` block. Its most basic form is <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> and comes after the `WHERE` block.

<sql-exercise
  data-question="This query pulls the execution counts for each county."
  data-default-text="SELECT COUNT(*) FROM executions GROUP BY county"
  data-solution="SELECT COUNT(*) FROM executions GROUP BY county"></sql-exercise>

At this point, you might be thinking: 'How do I know which count pertains to which county?' The solution is to insert `county` into the select block like so:

<sql-exercise
  data-default-text="SELECT county, COUNT(*) FROM executions GROUP BY county"
  data-solution="SELECT county, COUNT(*) FROM executions GROUP BY county"></sql-exercise>

If you were paying attention earlier, alarm bells would be going off in your head. "Didn't you just tell us not mix aggregated and non-aggregated columns?" The difference here is that we have groups. The computer will gather all the rows with the same values in their grouping column, for example those with county as 'Harris', and run the aggregate funtions. This guarantees no ambiguity about the value of the grouping column it should assign to the group.

"Mark the statements that are true:<br>The query `SELECT county, race, COUNT(*) FROM executions GROUP BY county, race` ..."
"will return as many rows as there are unique combinations of counties and races."
"will have a different value of county for every row it returns."

<sql-exercise
  data-question="Find the average length of inmates' full names based on their race.""
  data-default-text=""
  data-solution="SELECT race, AVG(LEN(first_name) + LEN(last_name)) FROM executions GROUP BY race"></sql-exercise>


Nested Queries

Average 

 f818acb10827a7144200cf0b4c2a876a7dfb3380
