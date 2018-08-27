---
layout: tutorial
title: Execution Hiatuses
---

<a name="hiatuses"></a>
## Hiatuses
This graph shows executions over time.<img src="executionno_time.png"> Notice the periods when no executions occur. Our goal is to figure out when they were and research their causes.

Our strategy is to get the table into a state where each row also contains the date of the execution before it. We can then find the time difference between the two dates, order them in descending order, and read off the longest hiatuses.

<br>
<a name="reading_joins"></a>
## Reading JOINs
None of the techniques we've learned so far are adequate here. Our desired table has the same length as the original `executions` table, so we can rule out aggregations which produce a smaller table. On the other hand, the [Beazley](beazley.html) tutorial taught us row operations which only allow us to transform information already in the rows. Since the date of the previous execution lies outside a row, we have to use `JOIN` to bring in the additional information.

Let's suppose the additional information we want exists in a table called `previous` which has two columns `(ex_no, previous_ex_date)`. We would be able to run the following query and be done:

    SELECT
      previous_ex_date AS start,
      ex_date AS end,
      ex_date - previous_ex_date AS time_delta
    FROM executions
    JOIN previous ON executions.ex_no = previous.ex_no
    ORDER BY time_delta DESC

The `JOIN <table> ON <clause>` block is the focus of this section but instead of reading it like this:
<img src="join_wrongmm.png">
Try this instead:
<img src="join_correctmm.png">
It emphasizes how `JOIN` creates a big combined table which is then fed into the `FROM` block just like any other table.

<br>
<a name="join_mechanics">
## Mechanics of a JOIN
Now that we know `JOIN`s are all about forming a big combined table, we want to form a mental model of how this happens.

The clause works the same way as in `WHERE <clause>`. That is, it is a statement that evaluates to true or false, and anytime a row from the first and second tables line up with the clause being true, the two rows are matched.

<div class="sideNote">
  <h3>Left, Right and Outer Joins</h3>
  <p>In <code>JOIN</code>s, the rows that are matched are returned. But what happens to the rows that have no partners in the other table? The <code>JOIN</code> command defaults to performing an inner join in which unmatched rows are dropped. The <code>OUTER JOIN</code> preserves unmatched rows from both tables. The <code>LEFT JOIN</code> and <code>RIGHT JOIN</code> preserve unmatched rows in the left and right tables respectively. Columns of the unmatched rows that should have been filled by the other table are padded with <code>NULL</code>s.</p>
</div>
If we look more closely at the clause `executions.ex_no = previous.ex_no`, we'll notice that it is format `<table>.<column>` to specify columns, this is because each of the tables has a column of the same name. In general you can use this format throughout the query, but most of the time there's no confusion so it's not necessary.

<sql-quiz
  data-title="Mark the true statements."
  data-description="Suppose we have tableA with 3 rows and tableB with 5 rows.">
  <sql-quiz-option
    data-value="cartesian_prod"
    data-statement="<code>tableA JOIN tableB ON 1</code> returns 15 rows."
    data-hint="The <code>&lt;clause&gt;</code> always returns true, so every row of tableA is matched against every row of tableB."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="bad_cartesian"
    data-statement="<code>tableA JOIN tableB ON 0</code> returns 0 rows."
    data-hint="For the same reason that <code>ON 1</code> returns 15 rows."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value=""
    data-statement=""
    data-hint=""></sql-quiz-option>
</sql-quiz>

<br>
<a name="self_join"></a>
## Self Joins

<br>
<a name="dates"></a>
## Dates

<br>
<a name="recap"></a>
## Recap
