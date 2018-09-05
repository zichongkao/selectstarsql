-- This file can be run via  $ sqlite3; .read 114_congress_prep.sql

.mode csv
.import 114_congress_full.csv congress_full

CREATE TABLE cosponsors AS
  SELECT DISTINCT
    sponsor.bill_number AS bill_number,
    sponsor.name AS sponsor_name,
    sponsor.state AS sponsor_state,
    cosponsor.name AS cosponsor_name,
    cosponsor.state AS cosponsor_state
  FROM congress_full sponsor
  JOIN congress_full cosponsor
    ON sponsor.bill_number = cosponsor.bill_number
    AND sponsor.sponsor = 'TRUE'
    AND cosponsor.original_cosponsor = 'TRUE'
    AND sponsor.bill_number LIKE 's%'
    AND cosponsor.bill_number LIKE 's%'
;

DROP TABLE congress_full;

.save 114_congress_small.db
