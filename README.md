# Select Star SQL

## Todo
- Fix how dates are handled. MIN, MAX shouldn't be lexicographic for dates.
- Clarify double quotes for SQLite
- Fix case when block
- comment multiline solutions using multiline comments
- "Check Solution" should have a flag to for order-sensitiveness
- Navigation
  - Create a sitemap page somewhere
- sideNote about documentation

## Task Ideas
Average Word(not char) count of laststatements
Average time on deathrow

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
