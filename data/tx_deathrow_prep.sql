-- This file can be run via  $ sqlite3; .read tx_deathrow_prep.sql

.mode csv
.import tx_deathrow_full.csv tx_deathrow_full

CREATE TABLE executions AS
  SELECT
    "First Name" AS first_name,
    "Last Name" AS last_name,
    CAST("Execution" AS INT) AS ex_number,
    CAST("Age at Execution" AS INT) AS ex_age,
    "Execution Date" AS ex_date,
    "County" AS county,
    NULLIF("Last Statement", '') AS last_statement
  FROM tx_deathrow_full;

DROP TABLE tx_deathrow_full;

.save tx_deathrow_small.db
