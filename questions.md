---
layout: tutorial
title: Challenge Questions
dbFile: data/114_congress_small.db
---

This chapter contains a list of challenging questions. Less support is provided than in preceding chapters to help you become more independent. But don't worry! You already know how to look up documentation and debug error messages; and your mental model is complete enough to make educated guesses. All the best and try to have fun!

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
  data-question="Find the most networked senator. In this case, the one with the most mutual cosponsorships."
  data-comment="A mutual cosponsorship refers to two senators who have each cosponsored a bill sponsored by the other. Even if a pair of senators have cooperated on many bills, the relationship still counts as one."
  data-solution="
SELECT senator1, count(*) AS mutual_cosponsorships
FROM (
  SELECT DISTINCT
    c1.sponsor_name AS senator1,
    c2.sponsor_name AS senator2
  FROM cosponsors c1
  JOIN cosponsors c2
    ON c1.sponsor_name = c2.cosponsor_name
    AND c2.sponsor_name = c1.cosponsor_name
  )
GROUP BY senator1
ORDER BY mutual_cosponsorships DESC
LIMIT 1 "
  ></sql-exercise>
