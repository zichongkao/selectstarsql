---
layout: tutorial
title: Challenge Questions
---

This chapter contains a list of challenging questions. Try to have fun with them. Your mental model should be complete enough to figure them out, but many will still be a struggle because being effective is alot about knowing all the little tricks, and mental models do not encompass these.

<a name="date_time"></a>
## Dates and Times
This is a good reference for date and time functions: <a href="https://www.sqlite.org/lang_datefunc.html">SQLite.org</a>

<sql-exercise
  data-question='Find the number of execution on each day of the week.'
  data-comment="Days of the week should be integers between 0 and 6 where Sunday is 0, Monday is 1 and so on."
  data-solution="SELECT
  (JULIANDAY(ex_date) - JULIANDAY(ex_date, 'weekday 0', '-7 days')) % 7
  -- 'weekday 0' pushes the date until the next sunday, unless its already a Sunday.
  -- the modulo 7 is necessary because '-7 days' brings sundays a week back.
    AS day_of_week,
  COUNT(*)
FROM executions
GROUP BY day_of_week"
></sql-exercise>

