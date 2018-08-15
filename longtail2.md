---
layout: tutorial
title: The Long Tail II
---

<br>
<a name="groupby"></a>
## The GROUP BY Block
Moving on, let's find the second number: the execution counts by county. The naive way to do this is to run `SELECT COUNT(*) FROM executions WHERE county=<county>` for each of the 254 counties in Texas. A better way would be to use the `GROUP BY` block. Its most basic form     is <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> and comes a    fter the `WHERE` block.

<sql-exercise
  data-question="This query pulls the execution counts for each county."
  data-default-text="SELECT COUNT(*) FROM executions GROUP BY county"></sql-exercise>

At this point, you might be thinking: "How do I know which count pertains to which county?"     The solution is to insert `county` into the `SELECT` block:

<sql-exercise
  data-default-text="SELECT county, COUNT(*) FROM executions GROUP BY county"></sql-exercis    e>

If you were paying attention earlier, alarm bells would be going off in your head. "Didn't     we just learn not to mix aggregated and non-aggregated columns?" The difference here is tha    t we have groups. The computer will gather all the rows with the same values in their group    ing column, for example those with county as "Harris", and run the aggregate functions. Thi    s guarantees no ambiguity about the value of the grouping column it should assign to the gr    oup.

<sql-quiz
  data-title="Mark the statements that are true:<br>The query <code>SELECT county, race, CO    UNT(*) FROM executions GROUP BY county, race</code> ...">
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="will return as many rows as there are unique combinations of counties a    nd races."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="will have a different value of county for every row it returns."
    data-value="one_col_diff">"</sql-quiz-option>
</sql-quiz>

<sql-exercise
  data-question="Find the average length of inmates' full names based on their race.""
  data-default-text=""
  data-solution="SELECT race, AVG(LEN(first_name) + LEN(last_name)) FROM executions GROUP B    Y race"></sql-exercise>


Nested Queries

<sql-exercise
  data-question="Find the first and last_name of the the inmate with the longest last state    ment."
  data-comment="Aggregate functions aren't confined to the <code>SELECT</code> block. Here     you may have to use them in the <code>WHERE</code> block."
  data-default-text=""
  data-solution="SELECT first_name, last_name FROM executions WHERE LEN(last_statement) = M    AX(LEN(last_statement))"></sql-exercise>

Average~

