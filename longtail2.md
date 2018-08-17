---
layout: tutorial
title: The Long Tail II
---

<a name="previously"></a>
## Previously
In Part I, we set out to understand the long tail of counties with unusually high numbers of executions. We sought the percentage of executions per county and managed to find the denominator, the total number of executions, by applying aggregation functions to the whole dataset.

In this part, we find the numerator, the execution counts of each county, by applying aggregate functions to subsets of the dataset. We then combine the two via nested queries, and provide research which accounts for the state of the most egregious counties.

<br>
<a name="groupby"></a>
## The GROUP BY Block
The `GROUP BY` block allows us to split the dataset into groups and apply aggregate functions within each group. This results in one row per group, instead of one row overall as we get when aggregating across the entire dataset. Its most basic form is <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> and comes after the `WHERE` block.

<sql-exercise
  data-question="This query pulls the execution counts for each county."
  data-comment="Isn't it much better than running 254 individual queries?!"
  data-default-text="SELECT COUNT(*)
FROM executions
GROUP BY county"></sql-exercise>

At this point, you might be thinking: "How do I know which count pertains to which county?" The solution is to insert `county` into the `SELECT` block:

<sql-exercise
  data-default-text="SELECT county, COUNT(*)
FROM executions
GROUP BY county"
  ></sql-exercise>

If you recall <a href='longtail.html#strange'>A Strange Query</a>, alarm bells would be going off in your head. Didn't we just learn not to mix aggregated and non-aggregated columns? The difference here is that grouping columns are the only columns allowed to be non-aggregate. After all, all the rows in that group must have the same values on those columns so there's no ambiguity in the values they should take.

<sql-quiz
  data-title="Mark the statements that are true."
  data-description=" The query <code>SELECT county, race, COUNT(*) FROM executions GROUP BY county, race</code>">
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="will return as many rows as there are unique combinations of counties and races in the dataset."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="will return a group ('Bexar', 'Hispanic') even if no Hispanic inmates were executed in Bexar county."
    data-hint="The <code>GROUP BY</code> block finds all combinations <i>in the dataset</i> rather than all theoretically possible combinations."
    data-value="abstract_cartesian"></sql-quiz-option>
  <sql-quiz-option
    data-statement="will have a different value of county for every row it returns."
    data-hint="This would be true only if <code>county</code> were the only grouping column. Here, we can have many groups with the same county but different races."
    data-value="one_col_diff"></sql-quiz-option>
</sql-quiz>

Now you may ask, wouldn't we be done if we could just run something like `SELECT county, PROPORTION_OF_ROWS(*) FROM executions GROUP BY county`? Proportions are such a common metric &mdash; shouldn't such a function exist? Unfortunately not, and perhaps for good reason: Such a function would need to aggregate both within the group and throughout dataset to get the numerators and denominator respectively. The fact that this isn't possible solidifies our mental model a little more: `GROUP BY` really does split the dataset into groups and only runs functions within the groups.

<br>
<a name="nested"></a>
## Nested Queries
So we can't run `SELECT county, PROPORTION_OF_ROWS(*) FROM executions GROUP BY county` directly. But perhaps we can work off of it. We know we want something like `SELECT county, COUNT(*)/<count_of_all_rows> FROM executions GROUP BY county`. We also already have the query for `<count_of_all_rows>`.

The final step is to simply stuff the query in using parentheses:

<sql-exercise
  data-question="Insert the <code>count_of_all_rows</code> query to find the proportion of executions from each county."
  data-comment="The <code>1.0 *</code> is necessary so that we do decimal-based division."
  data-default-text="SELECT
    county,
    1.0 * COUNT(*) / (<count_of_all_rows>)
        AS proportion
FROM executions
GROUP BY county
ORDER BY proportion DESC"
  data-solution="SELECT
    county,
    1.0 * COUNT(*) / (SELECT COUNT(*) FROM executions)
        AS proportion
FROM executions
GROUP BY county
ORDER BY proportion DESC"
  ></sql-exercise>

I've also quietly slipped in two additional SQL features. The <code class="codeblock">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> block orders the output and can be modified by appending `DESC` if you don't want the default ascending order.

The second feature is called aliasing. In the `SELECT` block, you can use <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> to provide an alias that you can use later in the query. This saved me from having to type the whole `COUNT(*) / (SELECT ... )` shebang in the `ORDER BY` block. You can see that it also changed the heading of the column in the output table.

<sql-exercise
  data-question="Find the first and last_name of the the inmate with the longest last state    ment."
  data-comment="Aggregate functions aren't confined to the <code>SELECT</code> block. Here     you may have to use them in the <code>WHERE</code> block."
  data-default-text=""
  data-solution="SELECT first_name, last_name FROM executions WHERE LEN(last_statement) = M    AX(LEN(last_statement))"></sql-exercise>

<br>
<a name="recap"></a>
## Recap
