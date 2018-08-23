---
layout: tutorial
title: Execution Hiatuses
---

<a name="hiatuses"></a>
## Hiatuses
This graph shows executions over time.<img src="executionno_time.png"> The features we want to study are the periods when no executions occur. Our goal is to figure out when they were and research their causes.

Our strategy is to get the table into a state where each row also contains the date of the execution before it. We can then find the time difference between the two dates, order the them in descending order, and read off the longest hiatuses.

<br>
<a name="joins"></a>
## JOINs
We can rule out aggregations straight off the bat because the table we want should be the same length as the original. But from the [Beazley](beazley.html) tutorial, none of the row operations we learned allows us to reach out to other rows and grab information.

The solution is to bring in another table that contains the previous execution's date and join it on to our main table. The other table, call it "previous", would have columns `(ex_no, previous_ex_no, previous_ex_date)`. We could then get our desired results by running:

    SELECT
      previous_ex_date AS start,
      ex_date AS end,
      ex_date - previous_ex_date AS time_delta
    FROM executions
    JOIN previous ON executions.ex_no = previous.ex_no
    ORDER BY time_delta DESC

Several parts of this query are new. For one, don't read the `JOIN <table> ON <clause>` block in isolation, you should read it as `FROM <table>` where `<table>` is created out of `executions JOIN previous ON <clause>`. This explains why `JOIN`s always come after `FROM`. It also encourages the visualization of the big joined table, which is a good mental model.

The clause works the same way as in `WHERE <clause>`. That is, it is a statement that evaluates to true or false, and anytime a row from the first and second tables line up and the clause is true, the two rows are matched.

If we look more closely at the clause `executions.ex_no = previous.ex_no`, we'll notice that it is format `<table>.<column>` to specify columns, this is because each of the tables has a column of the same name. In general you can use this format throughout the query, but most of the time there's no confusion so it's not necessary.


<br>
<a name="dates"></a>
## Dates

<br>
<a name="recap"></a>
## Recap
