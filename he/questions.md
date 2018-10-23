---
layout: he_tutorial
title:  הערות לסיום ושאלות אתגר
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## הערות לסיום
תודה שנשארתם בסביבה עד לסיום! אני מקווה שהקריאה היתה חוויה מלמדת ומאיריה.

עד כה כיסנו את רוב פקודות ופונקציות ה-SQL החשובות, אבל אנ מקווה שהתוצרים הגדולים ביותר של הקריאה הזו יהיו הטכניקות והתובנות בנוגע לחשיבה על שאילתות. כמה מהן:
- <p> השוואת הצורה של הטבלאות הזמינות עם התוצאות הרצויות כדי להחליט מה האגירה (aggregation) אמורה לעשות.</p>
- <p>בחינה איפה יושב המידע שדרוש לנו. האם הוא נמצא בשורה סמוכה? או אולי בקבוצה של שורות? או אולי בכל סט הנתונים?</p>
- <p>פירוש של שאילתות על פי המבנה הלוגי הנכון. למשל, לראות פסקאות בשאילתה באופן מהותי ככבעלות ערך אמת (true) או שקר (false); להסתכל על <br><code dir="ltr">&lt;table1&gt; JOIN &lt;table2&gt; ON ...</code> כטבלה אחת גדולה.</p>

במבט קדימה, במטרה להשלים את השכלת ה-SQL שלכם, כדאי יהיה להסתכל על פונקציות חלון (window functions) וביטויים טבלאיים נפוצים (common table expression). תוכלו לשחזר את ההתנהגות שלהם עם הטכניקות שלמדתם עד כה, אבל הם יעשו לכם את החיים לקלים ותר ויציגו בפניכם פרדיגמה חדשה ורבת ערך. לא כללתי את המושגים האלה מפני ש-SQLite לא תומכה בפונקציות חלון ומשום שרציתי להמנע מהוספת מורכבות של סט נתונים חדש ודיאלקט SQL נוסף.

עד עכישיו למדנו רק איך לצרוך נתונים (בשאילתות). ישנו תחום שלהם של SQL שנוגע לשינוי מידע. התחום הזה מתמודד עם פעולות כמו יצרת טבלה, הוספת מידע ומחיקה. הבנת המושגים הללו יכולה להיות שמושיות אפילו אם אינכם מנהלי בסיס נתונם, מפני שהיא תעזור לכם להבין, בין השאר, מדוע טבלאות נבנו בצורה בה נבנו.

והכי חשוב, אתם עדן צריכים להתאמן הרבה כדי להתמודד ביעילות עם בעיות בעולם האמיתי. החלק הבא יכלול כמה תרגילים, אבל הקושי שלהן עולה בצורה חדה. יתכן שתרצו לצאת לעולם ולהתאמן על מה שכיסינו עד כה ולחזור כשאתם מוכנים.



<br />
<a name="challenge_questions"></a>
## שאלות אתגר
התרגילים בפרקים הקודמים עוצבו כדי להפחית את המורכבות וליצור סביבה תומכת. הפרק הזה מסמן את הגבול והמעבר אל תוך העולם הפראי של בעיות SQL. הרעיון כאן הוא "לנסות על חי"&mdash; השאלות מוכוונות תועלת ולא לרמת למיידה. גם כותבי SQL מנוסים עשויים להתקשות בהן; ויש ערך רב בהתמודדות עם הקושי הזה.

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>הזמנה להצגת אתגרים</H3>
  <p>אתגרים טובים יכולים להפוך הדרכה לטובה, או להרוס אותה. אם יש לכם רעיון לאתגר חדש או לפרק חדש, אשמח לעזור לכם לפרסם אותה פה, עם קרדיט מלא. שלחו לי מייל ל:
Good problems make or break a tutorial. If you have an idea for a new problem or section, I'd love <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> או שלחו <a href="https://github.com/zichongkao/selectstarsql">pull request</a>. זכרו שאתגרים טובים אינם בהכרח קשים; הם מציגים טכניקות בעלות אפשרויות יישום רחבות.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
##  סט נתוני שותפויות החקיקה בסנאט
### מחבר: Kao

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
