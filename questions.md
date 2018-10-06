---
layout: tutorial
title: Challenge Questions
dbFile: data/114_congress_small.db
---

The exercises in the previous chapters were designed to reduce complexity to create a nurturing environment. This chapter marks the boundary into the wild untamed world of SQL problems. The idea here is trial-by-fire &mdash; the questions are optimized for utility rather than ease of learning. Even experienced SQL writers may struggle; and there is much value in this struggle.

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>Call for Problems</H3>
  <p>Good problems make or break a tutorial. If you have an idea for a new problem or section, I'd love to help you post it up here with full credit going to you. Email me at <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> or submit a <a href="https://github.com/zichongkao/selectstarsql">pull request</a>. Remember that good problems aren't necessary hard &mdash; they showcase a technique that has wide-ranging applications.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Senate Cosponsorship Dataset
### Authored by: Kao
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
GROUP BY senator
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

