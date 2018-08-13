-- This file can be run via  $ sqlite3; .read prepare_dataset.sql

.mode csv
.import fulldataset.csv fulldataset

CREATE TABLE executions AS
  SELECT
    "First Name" AS first_name,
    "Last Name" AS last_name,
    CAST("Execution Number" AS INT) AS exn_no,
    "Execution Date" AS exn_date,
    "County" AS county,
    "Last Statement" AS last_statement
  FROM fulldataset;

DROP TABLE fulldataset;

.save processed_dataset.db
