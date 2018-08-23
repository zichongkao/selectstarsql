---
layout: tutorial
title: Execution Hiatuses
---

<a name="hiatuses"></a>
## Hiatuses
This graph shows executions over time.<img src="executionno_time.png"> Notice the periods when no executions occur. Our goal is to figure out when they were and research their causes.

Our strategy is to get the table into a state where each row also contains the date of the execution before it. We can then find the time difference between the two dates, order the them in descending order, and read off the longest hiatuses.

<br>
<a name="join"></a>
## The JOIN ON Block
Think about the shape of our desired table. It has the same length as the original `executions` table, so we can rule out aggregations which produce a smaller table. On the other hand, the [Beazley](beazley.html) tutorial only taught us how to use information already in the row. Since the date of the previous execution lies outside a row, we have to use `JOIN` to bring in the additional information.

Let's call the additional table we want to tag on "previous". It would only need two columns `(ex_no, previous_ex_date)` and would allow us to complete our project this way:

    SELECT
      previous_ex_date AS start,
      ex_date AS end,
      ex_date - previous_ex_date AS time_delta
    FROM executions
    JOIN previous ON executions.ex_no = previous.ex_no
    ORDER BY time_delta DESC

The `JOIN <table> ON <clause>` block is the object of this section. Instead of reading it in isolation, think of it as living in the `FROM` block. That is, `FROM <big-joined-table>` where `<big-joined-table>` is `executions JOIN previous ON <clause>`. This explains why `JOIN`s always come after `FROM`, and encourages the visualization of the big joined table, which is a good mental model.

The clause works the same way as in `WHERE <clause>`. That is, it is a statement that evaluates to true or false, and anytime a row from the first and second tables line up with the clause being true, the two rows are matched.

<div class="sideNote">
  <h3>Left, Right and Outer Joins</h3>
  <p>In <code>JOIN</code>s, the rows that are matched are returned. But what happens to the rows that have no partners in the other table? The <code>JOIN</code> command defaults to performing an inner join in which unmatched rows are dropped. The <code>OUTER JOIN</code> preserves unmatched rows from both tables. The <code>LEFT JOIN</code> and <code>RIGHT JOIN</code> preserve unmatched rows in the left and right tables respectively.</p>
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
