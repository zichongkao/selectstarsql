---
layout: he_tutorial
title: שאלות אתגר
dbFile: data/114_congress_small.db
---

הפרק הזה כולל רשימה של שאלות מתאגרות. הוא כולל פחות הכוונה מאשר החלקים הקודמים על מנת לסיע לכם להפוך לעצמאים יותר, אבל אל חשש! אתם כבר יודעים איך לחפש דוקומנטציה ואיך להתמודד ולדבג (debug) הודעות שגיאה; והדגם החשיבתי שלכם מספיק מוכן כדי לבצע ניחושים מושכלים.


<a name="dataset"></a>
## סט הנתונים
בפרק הזה אנחנו מציגים סט נתונים חדש מהמושב ה-114 של הקונגרס (2015-2016) <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">שנערך על ידי ג’ימס פאולר (James Folwer) ואחרים</a>. התאמתי את סט הנתונים כדי לאפשר לנו לחקור שיתופי פעולה של סנאטורים.

הסטור שמציג הצעת חוק נקרא "יוזם" (“sponsot”). סנטורים אחרים יכולים להראות את תמיכתם בהצעה באמצעות הצטרפות ליוזמה. שותפות ביוזמת חקיקה בזמן הצגתה נקראת "הצטרפות ליוזמה במקור" (original cosponsors)  (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">מקור</a>).
כל שורה בטבלה מציגה את הצעת החקיקה, היוזם/יוזמת, מצטרפ/ת ליוזמה במקור והמדינות שהסנטור/ת מייצג/ת. שימו לב שיכולים להיות כמה מצטרפים ליוזמה במקור.


<sql-exercise
  data-question="סקרו את הנתונים."
  data-comment="עם 15 אלף שורות, מדובר בסט יותר ארוך מסט הנתונים של טקסס, ולכן כדאי להמנע מהדפסה של הכל בבת אחת."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="מצאו את הסנטור/ית המקושרים ביותר. כלומר, הסנטור/ית עם הכי הרבה יוזמות חקיקה משותפות."
  data-comment="הכוונה ביוזמה משותפת היא לשני סנטורים שכל אחד מהם הצטרף ליוזמה במקור של האחר. גם אם צמד סנטורים שיתפו פעולה בהרבה הצעות חקיקה, הקשר ביניהם יספר פעם אחת בלבד.”"
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
LIMIT 1 "></sql-exercise>

<sql-exercise
  data-question="עכשיו, מצאו את הסנטור/ית הכי מקושרים מכל מדינה."
  data-comment="אם כמה סנטורים מחזיקים במספר זהה בראש הדירוג, הציגו את שניהם. החזירו את הטורים התואמים למדינה (state), סנטור (senator) ומספר שותפויות (mutual cosponsorship)."
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
  data-question="מצאו את הסנטורים שהצטרפו ליוזמות חקיקה אך לא יזמו בעצמם אף הצעה."
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
