---
layout: tutorial
title: Claims of Innocence
dbFile: data/tx_deathrow_small.db
---

<a name="possible_innocence"></a>
## Possible Innocence
Opponents of the death penalty have argued that the risk of mistakenly executing an innocent person is too great a cost to bear. In this chapter, we attempt to approximate how many innocent people may have been executed.

The main caveat is that a claim of innocence, even if made on one's deathbed, does not constitute innocence. Furthermore, even if the inmate is truthful, there are many interpretations of innocence: The inmate could have been accused of murdering two people but is only innocent of killing one; or he may have killed the bystander but not the cop. These aren't just quibbles though: In Texas, murder alone doesn't warrant the death penalty. The inmate must have committed a [capital crime](https://en.wikipedia.org/wiki/Capital_punishment_in_Texas#Capital_crimes) like killing a public safety officer or multiple people. Hence the inmate may be innocent in a strict judicial sense, though perhaps not by common standards of morality.

Nevertheless, there is still something unsettling about claims of innocence persisting to the cusp of execution when there is little left to gain. Our task here is to find how frequently this happens by calculating the proportion of last statements where there is a claim of innocence.

<br>
<a name="aggregations"></a>
## Aggregate Functions
There are two numbers we need to calculate the proportion:

&nbsp;&nbsp;**Numerator**: Number of executions with claims of innocence.

&nbsp;&nbsp;**Denominator**: Number of executions in total.

Until now, each row in the output has come from a single row of input. However, here we have both the numerator and denominator requiring information from multiple rows of input. This tells us we need to use an aggregate function. To "aggregate" means to combine multiple elements into a whole. Similarly, aggregation functions <i>take multiple rows of data and combine them into one number.</i>


<br>
<a name="count"></a>
## The COUNT Function
`COUNT` is probably the most widely-used aggregate function. As the name suggests, it counts things! For instance, <code class='codeblock'>COUNT(&lt;column&gt;)</code> returns the number of non-null rows in the column.

<sql-exercise
  data-question="Edit the query to find how many inmates provided last statements."
  data-comment="We can use <code>COUNT</code> here because <code>NULL</code>s are used when there are no statements."
  data-default-text="SELECT COUNT(first_name) FROM executions"
  data-solution="SELECT COUNT(last_statement) FROM executions"></sql-exercise>

As you can tell, the `COUNT` function is intrinsically tied to the concept of `NULL`s. Let's make a small digression to learn about `NULL`s.
<a name="nulls"></a>
<div class="sideNote">
  <h3>Nulls</h3>
  <p>In SQL, <code>NULL</code> is the value of an empty entry. This is different from the empty string <code>''</code> and the integer <code>0</code>, both of which  are <i>not</i> considered <code>NULL</code>. To check if an entry is <code>NULL</code>, use <code>IS</code> and <code>IS NOT</code> instead of <code>=</code> and <code>!=</code>.</p>

  <sql-exercise
    data-question="Verify that 0 and the empty string are not considered NULL."
    data-comment="Recall that this is a compound clause. Both of the two <code>IS NOT NULL</code> clauses have to be true for the query to return <code>true</code>."
    data-default-text="SELECT (0 IS NOT NULL) AND ('' IS NOT NULL) "
    ></sql-exercise>
</div>

With this, we can find the denominator for our proportion:
<sql-exercise
  data-question="Find the total number of executions in the dataset."
  data-comment="The idea here is to pick one of the columns that you're confident has no <code>NULL</code>s and count it."
  data-default-text=""
  data-solution="SELECT COUNT(ex_number) FROM executions"></sql-exercise>

<br>
<a name="count_var">
## Variations on COUNT
So far so good. But what if we don't know which columns are `NULL`-free? Worse still, what if none of the columns are `NULL`-free? Surely there must still be a way to find the length of the table!

The solution is `COUNT(*)`. This is reminiscent of `SELECT *` where the `*` represents all columns. In practice `COUNT(*)` counts rows as long as *any one* of their columns is non-null. This helps us find table lengths because a table shouldn't have rows that are completely null.

<sql-exercise
  data-question="Verify that <code>COUNT(*)</code> gives the same result as before."
  data-default-text="SELECT COUNT(*) FROM executions"></sql-exercise>

Another common variation is to count a subset of the table. For instance, counting Harris county executions. We could run `SELECT COUNT(*) FROM executions WHERE county='Harris'` which filters down to a smaller dataset consisting of Harris executions and then counts all the rows. But what if we want to simultaneously find the number of Bexar county executions?

The solution is to apply a `CASE WHEN` block which acts as a big if-else statement. It has two formats and the one I like is:

    CASE
        WHEN <clause> THEN <result>
        WHEN <clause> THEN <result>
        ...
        ELSE <result>
    END

This is admittedly one of the clunkier parts of SQL. A common mistake is to miss out the `END` command and the `ELSE` condition which is a catchall in case all the prior clauses are false. Also recall from the previous chapter that clauses are expressions that can be evaluated to be true or false. This makes it important to think about the boolean value of whatever you stuff in there.

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
  data-question="Find how many inmates were over the age of 50 at execution time."
  data-comment="This illustrates that the <code>WHERE</code> block filters before aggregation occurs."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE ex_age > 50'></sql-exercise>

<sql-exercise
  data-question="Find the number of inmates who have declined to give a last statement."
  data-comment="For bonus points, try to do it in 3 ways:<br> 1) With a <code>WHERE</code> block,<br> 2) With a <code>COUNT</code> and <code>CASE WHEN</code> block,<br> 3) With two <code>COUNT</code> functions."
  data-default-text=""
  data-solution='SELECT COUNT(*) FROM executions WHERE last_statement IS NULL
SELECT COUNT(CASE WHEN last_statement IS NULL THEN 1 ELSE NULL END) FROM executions
SELECT COUNT(*) - COUNT(last_statement) FROM executions'></sql-exercise>

It is worthwhile to step back and think about the different ways the computer handled these three queries. The `WHERE` version had it filter down to a small table first before aggregating while in the other two, it had to look through the full table. In the `COUNT` + `CASE WHEN` version, it only had to go through once, while the double `COUNT` version made it go through twice. So even though the output was identical, the performance was probably best in the first and worst in the third version.

<sql-exercise
  data-question="Find the minimum, maximum and average age of inmates at the time of execution."
  data-comment="Use the <code>MIN</code>, <code>MAX</code>, and <code>AVG</code> aggregate functions."
  data-default-text="SELECT ex_age FROM executions"
  data-solution='SELECT MIN(ex_age), MAX(ex_age), AVG(ex_age) FROM executions'></sql-exercise>

<a name="documentation"></a>
<div class="sideNote">
  <h3>Looking Up Documentation</h3>
  <p>This book was never intended to be a comprehensive reference for the SQL language. For that, you will have to look up other online resources. This is a skill in itself, and one that is worth mastering because you will be looking up documentation years after you've achieved familiarity with the language.</p>
  <p>The good news is that with the mental models you will learn in this book, lookups should be quick and painless because you will just be checking details like whether the function is called <code>AVERAGE</code> or <code>AVG</code> instead of figuring out what approach to take.</p>
  <p>For lookups, I often use <a href="https://www.w3schools.com/sql/default.asp">W3 Schools</a>, Stack Overflow and the <a href="http://sqlite.org">official SQLite documentation</a>.</p>
</div>

<sql-exercise
  data-question="Find the average length (based on character count) of last statements in the dataset."
  data-comment='This exercise illustrates that you can compose functions. Look up the <a href="http://sqlite.org/lang_corefunc.html">documentation</a> to figure out which function which returns the number of characters in a string.'
  data-default-text=""
  data-solution='SELECT AVG(LENGTH(last_statement)) FROM executions'></sql-exercise>

<sql-exercise
  data-question="List all the counties in the dataset without duplication."
  data-comment="We can get unique entries by using <code>SELECT DISTINCT</code>. See <a href='https://www.w3schools.com/sql/sql_distinct.asp'>documentation.</a>"
  data-default-text=""
  data-solution='SELECT DISTINCT county FROM executions'></sql-exercise>

`SELECT DISTINCT` isn't really an aggregate function because it doesn't return a single number and because it operates on the output of the query rather than the underlying table. Nevertheless, I've included it here because it shares a common characteristic of operating on multiple rows.

<br>
<a name="strange"></a>
## A Strange Query
Before we wrap up, let's take a look at this query:<br> `SELECT first_name, COUNT(*) FROM executions`.

Doesn't it look strange? If you have a good mental model of aggregations, it should! `COUNT(*)` is trying to return a single entry consisting the length of the execution table. `first_name` is trying to return one entry for each row. Should the computer return one or multiple rows? If it returns one, which `first_name` should it pick? If it returns multiple, is it supposed to replicate the `COUNT(*)` result across all the rows? The shapes of the output just don't match!

<sql-exercise
  data-question="Let's try it anyway and see what happens."
  data-default-text="SELECT first_name, COUNT(*) FROM executions"></sql-exercise>

In practice, databases try to return something sensible even though you pass in nonsense. In this case, our database picks the first name from the last entry in our table. Since our table is in reverse chronological order, the last entry is Charlie Brooks Jr., the first person executed since the Supreme Court lifted the ban on the death penalty. Different databases will handle this case differently so it's best not to count on their default behavior. If you know you want the last entry, you should explicitly find it. Many SQL dialects have a `LAST` aggregate function which makes this trivial. Unfortunately SQLite doesn't, so a workaround is necessary.

<a name="dialects"></a>
<div class="sideNote">
  <h3>SQL Dialects and Databases</h3>
  <p>Although we've called this a book about SQL, if we want to be pedantic it really is a book about <i>SQLite</i>. This is because SQL is an imaginary concept, a platonic ideal. In reality, there are only dialects that try to conform to the SQL specifications.</p>
  <p>SQL is also under-specified, meaning that some functionality is not specified by the standards. For instance, the standards don't say whether the string length-finding function should be called <code>LEN</code> (SQL Server) or <code>LENGTH</code> (SQLite); or how identifiers like table or column names should be quoted (<code>`</code> in MySQL, <code>"</code> in SQLite).</p>
  <p>To make matters worse, even a single query in a single dialect can be processed differently because the underlying databases can have different architectures. For instance, the PostgreSQL dialect can be used on databases distributed over many different physical machines, and ones consisting a single file. It means that the mental models we develop here are just a crutch. They may not reflect exactly what the database is doing.</p>
  <p>We've picked SQLite, which is both a dialect and an implementation, because it's one of the most common databases. We've also tried to focus on the core functionality and mental model of SQL rather than distinctive parts of SQLite. With a robust mental model in place, it's easy to switch between SQL dialects and databases.
  </p>
</div>

<br>
<a name="recap"></a>
## Conclusion and Recap
Let's use what we've learned so far to complete our task:
<sql-exercise
  data-question="Find the proportion of inmates with claims of innocence in their last statements."
  data-comment="To do decimal division, ensure that one of the numbers is a decimal by multiplying it by 1.0. Use <code>LIKE '%innocent%'</code> to find claims of innocence."
  data-solution="SELECT
1.0 * COUNT(CASE WHEN last_statement LIKE '%innocent%'
    THEN 1 ELSE NULL END) / COUNT(*)
FROM executions"
></sql-exercise>

This method of finding claims of innocence is admittedly rather inaccurate because innocence can be expressed in other terms like "not guilty". Nevertheless, I suspect it underestimates the real number, and is probably of the right order of magnitude. The question we are left with then, is whether we are willing to accept the possibility that up to 5% percent of people we execute are actually innocent. ([Paul Graham is not willing to.](http://paulgraham.com/prop62.html))

To recap, we've moved from row-level operations in the previous section, to using aggregate functions on multiple rows in the dataset. This has opened up an avenue to study system-level behavior. In the next section, we'll learn to apply aggregate functions on multiple subgroups of the dataset using the `GROUP BY` block.
