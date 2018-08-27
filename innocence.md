---
layout: tutorial
title: Claims of Innocence
---

<a name="possible_innoncence"></a>
## Possible Innocence
Opponents of the death penalty have argued that the risk of mistakenly executing an innocent person is too great a cost to bear. In this tutorial, we attempt to approximate how many innocent people may have been executed.

The main caveat is that a claim of innocence, even if made on one's deathbed, does not constitute innocence. Furthermore, even if the inmate is truthful, there are many interpretations of innocence: The inmate could have been accused of murdering two people but is only innocent of killing one; or he may have killed the bystander but not the cop. These aren't just quibbles though: In Texas, murder alone doesn't warrant the death penalty. The inmate must have committed a [capital crime](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes) like killing a public safety officer or multiple people. Hence the inmate may be innocent in a strict judicial sense, though perhaps not by common standards of morality.

Nevertheless, there is still something unsettling about claims of innocence persisting to the cusp of execution when there is little left to gain. Our task here is to find how frequently this happens by calculating the proportion of last statements where is a claim of innocence.

<br>
<a name="aggregations"></a>
## Aggregations
There are two numbers we need to find:
1. <p>Number of executions with claims of innocence.</p>
2. <p>Number of executions in total.</p>

Until now, each row in the output has come from a single row of input. However, here we have both the numerator and denominator requiring information from multiple rows of input. This tells us we need to use an aggregation function because they <i>take multiple rows of data and combine them into one number.</i>

<br>
<a name="count"></a>
## The COUNT Function
`COUNT` is probably the most widely-used aggregate function. As the name suggests, it counts things! For instance, <code class='codeblock'>COUNT(my_column)</code> returns the number of non-null rows in `my_column`.

<sql-exercise
  data-question="Edit the query to find how many inmates provided last statements."
  data-comment="We can use <code>COUNT</code> here because <code>NULL</code>s are used when there are no statements."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

As you can tell, the `COUNT` function is intrinsically tied to the concept of `NULL`s. Let's make a small digression to learn about `NULL`s.
<div class="sideNote">
  <h3>Nulls</h3>
  <p>In SQL, <code>NULL</code> is the value of an empty entry. This is different from the empty string <code>''</code> and the integer <code>0</code>, both of which  are <i>not</i> considered <code>NULL</code>. To check if an entry is <code>NULL</code>, use <code>IS</code> and <code>IS NOT</code> instead of <code>=</code> and <code>!=</code>.</p>

  <sql-exercise
    data-question="Verify that 0 and the empty string are not considered NULL."
    data-comment="Recall that this is a compound clause. Both of the two <code>IS NOT NULL</code> clauses have to be true for the query to return <code>true</code>."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL) "
    data-solution="SELECT 0 IS NOT NULL AND '' IS NOT NULL "></sql-exercise>
</div>

With this, we can complete part of our task:
<sql-exercise
data-question="Find the total number of executions in the dataset."
data-comment="The idea here is to pick one of the columns that you're confident has no <code>NULL</code>s and count it."
data-default-text=""
data-solution="SELECT COUNT(first_name) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Variations on COUNT
So far so good. But what if we don't know which columns are `NULL`-free? Worse still, what if none of the columns are `NULL`-free? Surely there must still be a way to find the length of the table!

The solution is `COUNT(*)`. This is reminiscent of `SELECT *` where the `*` represents all columns. In practice `COUNT(*)` counts rows as long as *any one* of their columns is non-null. This helps us find table lengths because a table shouldn't have rows that are completely null.

<sql-exercise
data-question="Verify that <code>COUNT(*)</code> gives the same result as before."
data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Another common variation is to count a subset of the table. For instance, counting Harris county executions. We could run `SELECT COUNT(*) FROM executions WHERE county='Harris'` which filters down to a smaller dataset consisting Harris executions and then counts all the rows. But what if we want to simultaneously find the number of Bexar county executions?

The solution is to apply a `CASE WHEN` block which acts as big if-else statement. You start with `CASE` and end with `ELSE <result> END`. In between you can place as many `WHEN <clause> THEN <result>` branches as you want. The `ELSE <result>` serves as catch-all when none of the `WHEN` clauses return true. Recall from the previous tutorial that clauses are expressions that can bevaluated to be true or false. If the `WHEN` clause is `TRUE`, the block will return the result of the corresponding `THEN`.

<sql-exercise
data-question="This query counts the number of Harris and Bexar county executions. Replace <code>SUM</code>s with <code>COUNT</code>s and edit the <code>CASE WHEN</code> blocks so the query still works."
data-comment="Switching <code>SUM</code> for <code>COUNT</code> alone isn't enough because <code>COUNT</code> still counts the 0 since 0 is non-null."
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
## Practice

<sql-exercise
  data-question="Find the number of inmates who have declined to give a last statement."
  data-comment="For bonus points, try to do it in 3 ways:<br> 1) With a <code>WHERE</code> block,<br> 2) With a <code>CASE WHEN</code> block,<br> 3) With two <code>COUNT</code> functions."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

<sql-exercise
  data-question="Find how many inmates where over the age of 50 at execution time."
  data-comment="This illustrates that the <code>WHERE</code> block filters before aggregation occurs."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Find the minimum, maximum and average age of inmates at time of execution."
  data-comment="Use the <code>MIN</code>, <code>MAX</code>, and <code>AVG</code> aggregation functions."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<sql-exercise
  data-question="Find the average length (based on character count) of last statements in the dataset."
  data-comment="You can compose functions together. Use the <code>LENGTH</code> function which returns the number of characters in a string."
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="List all the counties in the dataset without duplication."
  data-comment="We can get unique entries by using <code>SELECT DISTINCT</code>. See <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentation.</a>"
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

<br>
<a name="strange"></a>
## A Strange Query
Before we wrap up, let's take a look at this query:<br> `SELECT first_name, COUNT(*) FROM executions`.

Doesn't it look strange? If you have a good mental model of aggregations, it should! `COUNT(*)` is trying to return a single entry consisting the length of the execution table. `first_name` is trying to return one entry for each row. Should the computer return one or multiple rows? If it returns one, which `first_name` should it pick? If it returns multiple, is it supposed to replicate the `COUNT(*)` result across all the rows? The the shapes of the output just don't match!

<sql-exercise
  data-question="Let's try it anyway and see what happens."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

In practice, databases try to return something sensible even though you pass in nonsense. In this case, our database picks the first name from the last entry in our table. Since our table is in reverse chronological order, the last entry is Charlie Brook's Jr., the first person executed since the Supreme Court lifted the ban on the death penalty. Different databases will handle this case differently so it's best not to count on this behavior. If you know you want the last entry, use the `LAST` aggregation function instead.

<div class="sideNote">
  <h3>SQL Dialects and Databases</h3>
  <p>Although we've called this a SQL tutorial, if we want to be pedantic it really is a <i>SQLite</i> tutorial. This is because SQL is an imaginary concept, a platonic ideal. In reality, there are only dialects that try to conform to the SQL specifications.</p>
  <p>SQL is also under-specified, meaning that some functionality is not specified by the standards. For instance, the standards don't say whether the string length-finding function should be called <code>LEN</code> (SQL Server) or <code>LENGTH</code> (SQLite); or how identifiers like table or column names should be quoted (<code>`</code> in MySQL, <code>"</code> in SQLite).</p>
  <p>To make matters worse, even a single query in a single dialect can be processed differently because the underlying databases can have different architectures. For instance, the PostgreSQL dialect can be used on databases distributed over many different physical machines, and ones consisting a single file. It means that the mental models we develop here are just a crutch. They may not reflect exactly what the database is doing.</p>
  <p>We've picked SQLite, which is both a dialect and implementation, because it's one of the most common databases. We've also tried to focus on the core functionality and mental model of SQL rather than distinctive parts of SQLite. With a robust mental model in place, it's easy to switch between SQL dialects and databases.
  </p>
</div>

<br>
<a name="recap"></a>
## Conclusion and Recap
Let's use what we've learned so far to complete our task:
<sql-exercise
  data-question="Find the proportion of last statements with claims of innocence."
  data-comment="To do decimal division, ensure that one of the numbers is a decimal by multiplying it by 1.0. Use <code>LIKE '%innocent%'</code> to find claims of innocence."
  data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

This method of finding claims of innocence is admittedly rather inaccurate because innocence can be expressed in other terms like "not guilty". Nevertheless, I suspect it underestimates the real number, and is probably of the right order of magnitude. The question we are left with then, is whether we are willing to accept the possibility that up to 5% percent of people we execute are actually innocent. ([Paul Graham is not.](http://paulgraham.com/prop62.html))

To recap, we've moved from row-level operations in the previous section, to using aggregate functions on multiple rows in the dataset. This has opened up an avenue to study system-level behavior. In the next section, we'll learn to apply aggregate functions on multiple subgroups of the dataset using the `GROUP BY` block.
