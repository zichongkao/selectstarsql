# Select Star SQL

## Todo
- "Check Solution" should have a flag to for order-sensitiveness
- Navigation
  - Create a sitemap page somewhere
- Fix how dates are handled. MIN, MAX shouldn't be lexicographic for dates.
- Add exn_age
- Fix NULLs for last_statement
- Clarify double quotes for SQLite
- Add paragraph for each tutorial into sitemap and then put into index

## Task Ideas
Average Word count of laststatements
Average time on deathrow
proportion of last statements that talk about X

find maximum time between executions
(self join)

SELECT
e2.execution_date AS start_date,
e1.execution_date AS end_date,
DATEDIFF(day, e2.execution_date, e1.execution_date) AS delta
FROM executions e1 JOIN executions e2
ON e1.execution_number = e2.execution_number + 1
ORDER BY delta desc
LIMIT 10
