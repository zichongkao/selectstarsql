# Select Star SQL

## Todo
- "Check Solution" should have a flag to for order-sensitiveness
- When data-solution is not defined, the exercise shouldn't output correct/incorrect
- Datatable printout has grey blob at bottom left corner
- Add codemirror hints
- Navigation
  - Create a sitemap page somewhere!
- Error messages
  - Intercept when output is null and give better error msg than "Cannot convert undefined or null to object"
  - Fix grammar of "table doesnt exists" error
- Shift+enter automatically runs the focused cell
- Length of columns with nulls should return null rather than undefined. Same with Min and Max.

## Task Ideas
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
