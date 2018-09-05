---
layout: tutorial
title: Challenge Questions
dbFile: data/114_congress_small.db
---

This chapter contains a list of challenging questions. Less support is provided than before to help you become more independent. But don't worry! You already know how to look up documentation and debug error messages; and your mental model is complete enough to make educated guesses.

<a name="dataset"></a>
## Dataset
In this section, we introduce a new dataset from the 114th session of Congress (2015-2016) <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">compiled by James Fowler and others</a>. I reworked the dataset to allow us to study cosponsoring relationships between senators.

The senator who introduces the bill is called the "sponsor". Other senators can show their support by cosponsoring the bill. Cosponsors at the time of introduction are called "original cosponsors" (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">Source</a>). Each row of the table shows the bill, the sponsor, an original cosponsor, and the states the senators represent. Note that there can be multiple cosponsors of a bill.

<sql-exercise
  data-question="Have a look at the dataset."
  data-comment="At 15K rows, it's a little larger than the Texas dataset so best to avoid printing everything out."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="Find the most networked senator. That is, the one with the most mutual cosponsorships."
  data-comment="A mutual cosponsorship refers to two senators who have each cosponsored a bill sponsored by the other. Even if a pair of senators have cooperated on many bills, the relationship still counts as one."
  data-solution="
WITH mutuals AS (
  SELECT DISTINCT
    c1.sponsor_name AS senator,
    c2.sponsor_name AS senator2
  FROM cosponsors c1
  JOIN cosponsors c2
    ON c1.sponsor_name = c2.cosponsor_name
    AND c2.sponsor_name = c1.cosponsor_name
)

SELECT senator, COUNT(*) AS mutual_count
FROM mutuals
GROUP BY senator1
ORDER BY mutual_count DESC
LIMIT 1 "
  ></sql-exercise>

<sql-exercise
  data-question="Now find the most networked senator from each state."
  data-comment="If multiple senators tie for top, show both. Return columns corresponding to state, senator and mutual cosponsorship count."
  data-solution="
WITH mutual_counts AS (
  SELECT
    senator, state, COUNT(*) AS mutual_count
  FROM (
    SELECT DISTINCT
      c1.sponsor_name AS senator,
      c1.sponsor_state AS state,
      c2.sponsor_name AS senator2
    FROM cosponsors c1
    JOIN cosponsors c2
      ON c1.sponsor_name = c2.cosponsor_name
      AND c2.sponsor_name = c1.cosponsor_name
    )
  GROUP BY senator, state
),

state_max AS (
  SELECT
    state,
    MAX(mutual_count) AS max_mutual_count
  FROM mutual_counts
  GROUP BY state
)

SELECT
  mutual_counts.state,
  mutual_counts.senator,
  mutual_counts.mutual_count
FROM mutual_counts
JOIN state_max
  ON mutual_counts.state = state_max.state
  AND mutual_counts.mutual_count = state_max.max_mutual_count
"
  ></sql-exercise>

<sql-exercise
  data-question="Find the senators who cosponsored but didn't sponsor bills."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
 ON c1.cosponsor_name = c2.sponsor_name
 -- This join identifies cosponsors
 -- who have sponsored bills
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + NULL is a standard trick for excluding
-- rows. It's more efficient than WHERE ... NOT IN.
"
  ></sql-exercise>

