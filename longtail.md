---
layout: tutorial
title: The Long Tail
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>
## Long Tails
Long tails refer to small numbers of samples which occur a large number of times. When we plot these out, they form a small sliver far to the right of the center of mass which looks like a tail. They indicate the presence of outliers whose unusual behaviors may be of interest to us.<img src="imgs/execution_tail.png"> In the context of executions in Texas, the long tail refers to a small number of counties which have been known to conduct a large number of executions.

Let's find the percentage of executions from each county so that we can pick out the ones in the tail.

As will become increasingly evident, the shape of the tables tell us a lot about the operations we need to perform. (This is analogous to dimensional analysis in physics.) In this case, we can discern that the methods we've covered so far are inadequate: The [Beazley](beazley.html) chapter dealt with individual rows of data, but it's clear that we need to do some aggregation to find county-level data. The [Claims of Innocence](innocence.html) chapter taught us aggregation, but those functions would end up aggregating the dataset into one row when we really want one row per county.

<br>
<a name="groupby"></a>
## The GROUP BY Block
This is where the `GROUP BY` block comes in. It allows us to split up the dataset and apply aggregate functions within each group, resulting in one row per group. Its most basic form is <code class="codeblock">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> and comes after the `WHERE` block.

<sql-exercise
  data-question="This query pulls the execution counts per county."
  data-default-text="SELECT
  county,
  COUNT(*) AS county_executions
FROM executions
GROUP BY county"></sql-exercise>

If you recall <a href='innocence.html#strange'>A Strange Query</a>, alarm bells would be going off in your head. Didn't we just learn not to mix aggregated and non-aggregated columns? The difference here is that grouping columns are the only columns allowed to be non-aggregate. After all, all the rows in that group must have the same values on those columns so there's no ambiguity in the value that should be returned.

You may have also noticed our use of `AS`. It's what we call "aliasing". In the `SELECT` block, <code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code> provides an alias that can be referred to later in the query. This saves us from rewriting long expressions, and allows us to clarify the purpose of the expression.

<sql-exercise
  data-question="This query counts the executions with and without last statements. Modify it to further break it down by county."
  data-comment="The clause <code>last_statement IS NOT NULL</code> acts as an indicator variable where 1 means true and 0 means false."
  data-default-text="SELECT
  last_statement IS NOT NULL AS has_last_statement,
  COUNT(*)
FROM executions
GROUP BY has_last_statement"
  data-solution="SELECT
  last_statement IS NOT NULL AS has_last_statement,
  county,
  COUNT(*)
FROM executions
GROUP BY has_last_statement, county"
  ></sql-exercise>

<br>
<a name="having"></a>
## The HAVING Block
This next exercise illustrates that filtering via the `WHERE` block happens before grouping and aggregation. This is reflected in the order of syntax since the `WHERE` block always precedes the `GROUP BY` block.

<sql-exercise
  data-question="Count the number of inmates aged 50 or older that were executed in each county."
  data-comment="You should be able to do this using <code>CASE WHEN</code>, but try using the <code>WHERE</code> block here."
  data-default-text=""
  data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"
  ></sql-exercise>

This is all good but what happens if we want to filter on the result of the grouping and aggregation? Surely we can't jump forward into the future and grab information from there. To solve this problem, we use `HAVING`.

<sql-exercise
  data-question="List the counties in which more than 2 inmates aged 50 or older have been executed."
  data-comment="This builds on the previous exercise. We need an additional filter&mdash;one that uses the result of the aggregation. This means it cannot exist in the <code>WHERE</code> block because those filters are run before aggregation. Look up the <a href='https://www.w3schools.com/sql/sql_having.asp'><code>HAVING</code> block</a>. You can think of it as a post-aggregation <code>WHERE</code> block."
  data-default-text=""
  data-solution="
SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(*) > 2"
  ></sql-exercise>

<br>
## Practice
This quiz is designed to challenge your understanding. Read the explanations even if you get everything correct.

<sql-quiz
  data-title="Mark the statements that are true."
  data-description="This query finds the number of inmates from each county and 10 year age range. <pre>
SELECT
  county,
  ex_age/10 AS decade_age,
  COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
  <sql-quiz-option
    data-value="valid"
    data-statement="The query is valid (ie. won't throw an error when run)."
    data-hint="Were you thrown off by <code>ex_age/10</code>? Grouping by transformed columns is fine too."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="gran"
    data-statement="The query would return more rows if we were to use <code>ex_age</code> instead of <code>ex_age/10</code>."
    data-hint="Remember that <code>ex_age/10</code> does integer division which rounds all the ages. This produces fewer unique groups."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="The output will have as many rows as there are unique combinations of counties and decade_ages in the dataset."
    data-hint="This is correct."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The output will have a group ('Bexar', 6) even though no Bexar county inmates were between 60 and 69 at execution time."
    data-hint="The <code>GROUP BY</code> block finds all combinations <i>in the dataset</i> rather than all theoretically possible combinations."
    data-value="abstract_cartesian"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The output will have a different value of county for every row it returns."
    data-hint="This would be true only if <code>county</code> were the only grouping column. Here, we can have many groups with the same county but different decade_ages."
    data-value="one_col_diff"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The output can have groups where the count is 0."
    data-hint="This is similar to the ('Bexar', 6) question. If there are no rows with ('Bexar', 6), the group won't even show up."
    data-value="count_zero"></sql-quiz-option>
  <sql-quiz-option
    data-statement="The query would be valid even if we don't specify <code>county</code> in the <code>SELECT</code> block."
    data-hint="The grouping columns don't necessarily have to be in the <code>SELECT</code> block. It would be valid, but not make much sense because we wouldn't know which counts are for which county."
    data-value="missing_gp_col"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="It is reasonable to add <code>last_name</code> to the <code>SELECT</code> block even without grouping by it."
    data-hint="Even though it would be valid (in SQLite) for the reasons set forth in <a href='innocence.html#strange'>A Strange Query</a>, it is poor form to have non-aggregate, non-grouping columns in the <code>SELECT</code> block."
    data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>

<sql-exercise
  data-question="List all the distinct counties in the dataset."
  data-comment="We did this in the previous chapter using the <code>SELECT DISTINCT</code> command. This time, stick with vanilla <code>SELECT</code> and use <code>GROUP BY</code>."
  data-default-text=""
  data-solution="SELECT county FROM executions GROUP BY county"
  ></sql-exercise>

<br>
<a name="nested"></a>
## Nested Queries
Now, you may ask, wouldn't we be done if we could just run something like this?

    SELECT
      county,
      PERCENT_COUNT(*)
    FROM executions
    GROUP BY county

Percentages are such a common metric&mdash;shouldn't such a function exist? Unfortunately not, and perhaps for good reason: Such a function would need to aggregate both within the groups (to get the numerator) and throughout the dataset (to get the denominator). But each query either has a `GROUP BY` block or doesn't. So what we really need are two separate queries, one which aggregates with a `GROUP BY` and another that aggregates without. We can then combine them using a technique called "nesting".

Here's an example of how nesting works. The parentheses are important for demarcating the boundary between the inner query and the outer one:

<sql-exercise
  data-question="Find the first and last name of the inmate with the longest last statement (by character count)."
  data-comment="Write in a suitable query to nest in &lt;<code>length-of-longest-last-statement</code>&gt;."
  data-default-text="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (<length-of-longest-last-statement>)"
  data-solution="SELECT first_name, last_name
FROM executions
WHERE LENGTH(last_statement) =
    (SELECT MAX(LENGTH(last_statement))
     FROM executions)"></sql-exercise>

To reiterate, nesting is necessary here because in the `WHERE` clause, as the computer is inspecting a row to decide if its last statement is the right length, it can't look outside to figure out the maximum length across the entire dataset. We have to find the maximum length  separately and feed it into the clause. Now let's apply the same concept to find the percentage of executions from each county.

<sql-exercise
  data-question="Insert the &lt;<code>count-of-all-rows</code>&gt; query to find the percentage of executions from each county."
  data-comment="<code>100.0</code> is a decimal so we can get decimal percentages."
  data-default-text="SELECT
  county,
  100.0 * COUNT(*) / (<count-of-all-rows>)
    AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
  data-solution="SELECT
  county,
  100.0 * COUNT(*) / (SELECT COUNT(*) FROM executions)
    AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
  ></sql-exercise>

I've quietly slipped in an `ORDER BY` block. Its format is <code class="codeblock">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> and it can be modified by appending `DESC` if you don't want the default ascending order.

<br>
<a name="harris"></a>
## Harris County
Is it surprising that Harris (home to the city of Houston), Dallas, Bexar and Tarrant account for about 50% of all executions in Texas? Perhaps it is, especially if we start from the assumption that executions should be distributed evenly across counties. But a better first approximation is that executions are distributed in line with the population distribution. The [2010 Texas Census](https://www.tsl.texas.gov/ref/abouttx/popcnty12010.html) shows that the 4 counties had a population of 10.0M which is 40.0% the population of Texas (25.1M). This makes the finding slightly less surprising.

But breaking this tail down further, we realize that Harris county accounts for most of the delta. It only has 16.4% of the population, but 23.1% of the executions. That's almost 50% more than it's supposed to have.

Numerous studies have examined why Harris county has been so prolific and several factors have been suggested:
 - <p>Prosecutions have been <a href="https://web.archive.org/web/20191227235319/https://www.citylab.com/equity/2014/09/one-texas-county-is-responsible-for-most-of-the-executions-in-the-entire-us/380705/">organized and well-financed</a>, while defenses have been court-financed and poorly-incentivized. <a href="https://houstonlawreview.org/article/3874.pdf">(Source, see p49)</a>
 - <p>The long-time district attorney was <a href="https://www.chron.com/news/houston-texas/article/Former-DA-ran-powerful-death-penalty-machine-1833545.php">determined and enthusiastic about the death penalty</a>.
 - <p>Judges in Texas are elected, and the population has supported the death penalty. <a href="https://priceonomics.com/why-has-texas-executed-so-many-inmates/">(Source)</a>
 - <p>Checks and balances in the Harris county judicial system have not worked. <a href="https://houstonlawreview.org/article/3874-the-problem-of-rubber-stamping-in-state-capital-habeas-proceedings-a-harris-county-case-study">(Source, see p929)</a></p>

<br>
<a name="recap"></a>
## Recap
In this section, we've learned to aggregate over groups and to use nesting to use the output of an inner query in an outer one. These techniques have the very practical benefit of allowing us to calculate percentages.

<a name="mapreduce"></a>
<div class="sideNote">
  <h3>MapReduce</h3>
  <p>An interesting addendum is that we've actually just learned to do MapReduce in SQL. MapReduce is a famous programming paradigm which views computations as occurring in a "map" and "reduce" step. You can learn more about MapReduce <a href="https://stackoverflow.com/questions/28982/simple-explanation-of-mapreduce">here</a>.</p>
  <p>The <a href="beazley.html">Beazley</a> chapter was all about mapping because it showed us how to map various operations out to all the rows. For example, <code>SELECT LENGTH(last_statement) FROM executions</code> maps the length function out to all the rows. This chapter showed us how to reduce various groups of data using aggregation functions; and the previous <a href="innocence.html">Claims of Innocence</a> chapter was just a special case in which the entire table is one group.</p>
</div>

In the next chapter, we'll learn about `JOIN`s which will enable us to work with multiple tables.
