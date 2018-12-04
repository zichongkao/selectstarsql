---
layout: he_tutorial
title: הזנב הארוך
dbFile: data/tx_deathrow_small.db
---

<a name="long_tail"></a>
## זנבות ארוכים
הכוונה בזנבות ארוכים היא למספר קטן של דגימות שמתרחשות מספר רב של פעמים. כאשר אנחנו מציגים אותם בגרף, הם נפרסים לרצועה דקה מימין למרכז, בצורה שמזכירה זנב.  זנבות ארוכים מסמנים את קיומם של קצוות עם התנהגות לא רגילה שעשויה לעניין אותנו. <img src="imgs/he_execution_tail.png">בהקשר של הוצאות להורג בטקסס, משמעות הזנב הארוך היא מספר קטן של מחוזות שמוכרים ככאלה שביצעו מספר גדול של הוצאות להורג.

בואו נמצא את אחוז ההוצאות להורג בכל מחוז כך שנוכל לאסוף את אלו שבזנב.

כפי שילך ויתברר, הצורה של הטבלאות מספרת לנו הרבה על הפעולות שאנחנו נדרשים לבצע (בדומה לניתוח מימדיי בפיסיקה). במקרה הזה, אנחנו יכולים להבחין שהשיטחות שכיסינו עד כה לא מתאימות: הפרק על [ביזלי](beazley.html) עסק בשורות בודדות של נתונים, אבל זה ברור שאנחנו צריכים סוג של אגירה כדי למצוא מידע ברמת המחוז. הפרק שעסק ב[טענות לחפות מפשע](innocence.html) לימד אותנו פונקציות אגירה, אבל הפונקציות הללו מסכמם סט נתוניםי שלהם לתוך שורה, בזמן שמה שאנחנו באמת צריכים הוא שורה אחת מסכמת לכל מחוז.

<br>
<a name="groupby"></a>
## בלוק ה-GROUP BY
כאן נכנס לתמונה בלוק ה-`GROUP BY`. הוא מאפשר לנו לפצל את סט הנתונים ולהפעיל פונקציות אגירה (aggregate functions) על כל קבוצה, ולתוצאה עם שורה עבור כל קבוצה. המבנה הבסיסי ביותר של הבלוק הוא <code class="codeblock" dir="ltr">GROUP BY &lt;column&gt;, &lt;column&gt;, ...</code> והוא מופיע אחרי בלוק ה-`WHERE`.


  <sql-exercise
    data-question="השאילתה הזו מושכת את מספר ההוצאות להורג לפי מחוז."
    data-default-text="SELECT
    county,
    COUNT(*) AS county_executions
    FROM executions
    GROUP BY county"></sql-exercise>

אם אתם זוכרים את ה<a href='innocence.html#strange'>שאילתה המוזרה</a>, פעמוני אזהרה אמורים לצלצל בראשכם. האם לא למדנו בדיוק עכשיו לא לערב בין טורים עם אגירה וטורים ללא אגירה? ההבדל כאן הוא שטורים של קבוצות הם הטורים היחידים שמותר להם להיות ללא אגירה (non-aggregate). אחרי הכל, לכל השורות באותה הקבוצה חיייבם להיות אותם הערכים בטורים אלו, כך שלא יכול להיות שיוחזרו ערכים שונים עבורן.

יתכן שגם שמתם לב לשימוש שלנו ב-`AS`. זה מה שאנחנו מכנים "הענקת כינוי" (aliasing). בבלוק ה-`SELECT`, <span dir="ltr"><code class="codeblock">&lt;expression&gt; AS &lt;alias&gt;</code></span> מספק כינוי, בו ניתן להשתמש מאוחר יותר בשאילתה, מה שחוסך מאיתנו את הצורך לכתוב את אותו ביטוי ארוך פעם נוספת, ויכול להבהיר את הכוונה של הביטוי.

<sql-exercise
  data-question="שנו את השאילתה כדי למצוא את מספר ההוצאות להורג מכל מחוז שכוללות הצהרה אחרונה של הנדונים למוות, ואת מספר ההוצאות להורג שאינן כוללות הצהרה אחרונה."
  data-default-text="SELECT
  county,
  COUNT(*)
FROM executions
GROUP BY county"
  data-solution="SELECT
  county,
  last_statement IS NOT NULL AS has_last_statement,
  COUNT(*)
FROM executions
GROUP BY county, has_last_statement"></sql-exercise>

<br>
<a name="having"></a>
## בלוק ה-Having
התרגיל הבא מדגים שסינון באמצעות בלוק `WHERE` מתרחש לפני הסידור בקבוצות והאגירה. זה מתבטא בסדר של הפקודה. אחרי הכל, בלוק ה-`WHERE` תמיד מקדים את בלוק ה-`GROUP BY`.

<sql-exercise
  data-question="ספרו את מספר הנדונים למוות שהיו בני 50 או יותר בכל מחוז."
  data-comment="אתם אמורים להיות מסוגלים לעשות זאת בעזרת <code>CASE WHEN</code>, אבל נסו להשתמש בבלוק ה-<code>WHERE</code>."
  data-default-text=""
  data-solution="SELECT county, COUNT(*)
FROM executions
WHERE ex_age >= 50
GROUP BY county"
></sql-exercise>

זה בסדר גמור, אבל מה קורה אם אנחנו רוצים לסנן את התוצאה של החיבור לקבוצות והאגירה? אנחנו הרי לא יכולםי לקפוץ קדימה לתוך העתיד ולמשוך משם את המידע. כדי לפתור בעיות שכאלה, אנחנו משתמשים ב-`HAVING`.

<sql-exercise
  data-question="צרו רשימה של כל המוזות בהם הוצאו להורג 2 או יותר נדונים למוות בגילאים 50 ומעלה."
  data-comment="השאילתה הזו מבוססת על הרגיל הקודם. אנחנו צריכם מסנן נוסף &mdash; כזה שמשמש בתוצאה של הפונקציה האוגרת (aggregation). הכוונה הייא שהמסנן הנוסף לא יכול להיות בתוך בלוק ה-<code>WHERE</code> מפני שהמסננים רציים לפני פעולת האגירה. חפשו את ה<a href='https://www.w3schools.com/sql/sql_having.asp'>בלוק <code>HAVING</code>. </a> זהו בלוק <code>WHERE</code> שמבוצע לאחר האגירה (post-aggregation)."
  data-default-text=""
  data-solution="SELECT county
FROM executions
WHERE ex_age >= 50
GROUP BY county
HAVING COUNT(*) > 2"
  ></sql-exercise>

<sql-quiz
  data-title="סמנו את ההצהרות הנכונות."
  data-description="השאילתה הזו מוצאת את מספר הנדונים למוות מכל מחוז בטווח של 10 שנים. <pre>
SELECT
  county,
  ex_age/10 AS decade_age,
  COUNT(*)
FROM executions
GROUP BY county, decade_age</pre>">
  <sql-quiz-option
    data-value="valid"
    data-statement="השאילתה תקינה (כלומר, לא תוצג הודעת שגיאה כשנריץ אותה)."
    data-hint="האם נזרקתם לשגיאה על ידי <code>ex_age/10</code>? יצירת קבוצות באמצעות המרה של טורים היא גם בסדר."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="gran"
    data-statement="השאילתה תחזיר יותר שורות אם נשתמר ב-<code>ex_age</code> במקום ב-<code>ex_age/10</code>."    data-hint="זכרו ש-<code>ex_age/10</code> מבצעת חלוקת מספרים שלמים שמעגלת את כל הגילאים ולכן מייצרת פחות קבוצות ייחודיות."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="unique_combocc"
    data-statement="הפלט יכלול מספר שורות זהה למספר הצירופים הייחודיים בין מחוזות ו-decade_ages בסט הנתונים."
    data-hint="זה נכון."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="הפלט יכלול את הקבוצה <span dir=”ltr”> (`Bexar`, 6)</span>, למרות שלא היו נדונים למוות במחוז בקסר (Bexar) שהיו בגילאים 60-69 בעת ביצוע ההוצאה להורג."
    data-hint="בלוק הקוד <code>GROUP BY</code> מוצא את כל הצירופים <i>בסט הנתונים</i> ולא את כל הצירופים האפשריים תיאורטית."
    data-value="abstract_cartesian"></sql-quiz-option>
  <sql-quiz-option
    data-statement="הפלט יכלול ערך (שם) שונה של מחוז עבור כל שורה שתחזיר כפלט."
    data-hint="זה יכול היה להיות נכון רק אם <code>county</code> (מחוז) היה הטור היחיד שמאוגד בקבוצות. כאן, יש לנו קבוצות רבות עבור אותו המחוז, אבל קבוצות גיל (decade_ages) שונות."
    data-value="one_col_diff"></sql-quiz-option>
  <sql-quiz-option
    data-statement="השאילתה תהיה תקינה גם אם לא נפרט מחוז (<code>county</code>) בבלוק ה-<code>SELECT</code>.”
    data-hint="הטורים שמקובצים בקבוצות לא חייבים להיות בבלוק ה-<code>SELECT</code>."
    data-value="missing_gp_col"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-statement="יהיה הגיוני להוסיף שם משפחה (<code>last_name</code>) לבלוק ה-<code>SELECT</code> גם ללא סידור בקבוצות (grouping)."
    data-hint="למרות שזו תהיה שאילתה תקינה (ב-SQLite) מהסיבות שפורטו ב<a href='innocence.html#strange'>שאילתה המוזרה</a>, הכללה של טורים ללא-אגירה וקבוצות בבלוק ה-<code>SELECT</code>. היא לא מעשה מוצלח."
    data-value="extra_gp_col"></sql-quiz-option>
</sql-quiz>


  <sql-exercise
    data-question="צרו רשימה עם כל שמות המחוזות היחודיים בסט הנתונים."
    data-comment="עשינו זאת בפרק הקודם כשהתמשנו בפקודת ה-<code>SELECT DISTINCT</code>. הפעם, נדבוק ב-<code>SELECT</code> בסיסי ונשתמש ב-<code>GROUP BY</code>."
    data-default-text=""
    data-solution="SELECT county FROM executions GROUP BY county"
    ></sql-exercise>

<br>
<a name="nested"></a>
## שאילתות מקוננות (nested queries)
עכשיו, יתכן ואתם שואלים, זה לא היינו כבר מסיימים את זה לו יכולנו פשוט להריץ משהו כזה?

    SELECT
      county,
      PERCENT_COUNT(*)
    FROM executions
    GROUP BY county

אחוזים הם מדד כל כך מקובל &mdash;יכול להיות שיש כבר פונקציה שמחשבת אותם? למרבה הצער, לא, ואולי מסיבה טובה: פונקציה שכזו היתה צריכה לאגור את בתוך כל אחת מהקבוצות וגם לאורך סט הנתונים כולו כדי להגיע למונה (numerator) ולמכנה (demoniator) על מנת לחשב את האחוזים. אבל לכל אחת מהשאילתות יש או אין בלוק `GROUP BY`. אז מה שאנחנו באמת צריכים זה שתי שאילתות נפרדות, אחת שתאגור ותחשב בעזרת `GROUP BY` ואחרת שתאתגור ותמנה ללא בלוק ה-`GROUP BY`. אז נוכל לאחד ביניהן בעזרת טכניקה שנקראת "קינון", או "יצירת קינים" (nesting).

הנה דוגמה לאיך עובדת שיטת הקינים. הסוגריים חשובות כדי לסמן את הגבול בין השאילתה הפנימית והשאילתה החיצונית:


  <sql-exercise
    data-question="מצאו את השם הפרטי ושם המשפחה של הנדון למוות עם ההצהרה (שלפני ההוצאה להורג) הארכה ביותר (על פי מספר התווים)."
    data-comment="כתבו שאילה מתאימה לקינון בתוך &lt;<code>length-of-longest-last-statement</code>&gt"
    data-default-text="SELECT first_name, last_name
      FROM executions
      WHERE LENGTH(last_statement) =
      (<length-of-longest-last-statement>)"
      data-solution="SELECT first_name, last_name
      FROM executions
      WHERE LENGTH(last_statement) =
        (SELECT MAX(LENGTH(last_statement))
         FROM executions)"></sql-exercise>


כדאי לחזור ולהדגיש, הכנסה של שאילתה לתוך קן הכרחית במקרה הזה מפני שבפסקת ה-`WHERE`, בזמן שהמחשב בודק כל שורה כדי להחליט אם עמודת ההצהרה האחרונה שלה היא באורך הנכון, הוא אינו יכול להסתכל החוצה ולברר מה האורך המקסימלי עבור כל סט הנתונים אנחנו צריכים למצוא דרך למצוא את האורך המקסימלי בנפרד ולהזין אותו לתוך הפסקה. עכשיו, בואו ניישם את אותה שיטה כדי למצוא את אחוז ההוצאות להורג בכל אחד מהמחוזות.

<sql-exercise
  data-question="הכניסו את השאילתה &lt;<code>count-of-all-rows</code>&gt; כדי למצוא את אחוז ההוצאות מכל מחוז."
  data-comment="<code>100.0 </code>הוא מספר עשרוני כדי נוכל לקבל את התוצאה באחוזים עם שבר עשרוני."
  data-default-text="SELECT
  county,
  100.0 * COUNT(*) / (<count-of-all-rows>)
    AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
  data-solution="SELECT
  county,
  100.0 * COUNT(*) / (SELECT COUNT(*) FROM executions)
    AS percentage
FROM executions
GROUP BY county
ORDER BY percentage DESC"
  ></sql-exercise>

בשקט הגנבתי פנימה בלוק ‘ORDER BY’. המבנה שלו הוא <br><code class="codeblock" dir="rtl">ORDER BY &lt;column&gt;, &lt;column&gt;, ...</code> וניתן לשנות אותו באמצעות הוספת `DESC` אם רוצים שהתוצאות יהיו מסודרות בסדר יורד ולא בסדר עולה, שהוא ברירת המחדל.

<br>

<a name="harris"></a>
## מחוז האריס (Harris)
האם זה מפתיע שמחוז האריס (Harris, Houston) דאלס (Dallas), בקסר (Bexar) וטרנט (Tarrant) מונים כ-50% מסך ההוצאות להורג בטקסס? אולי זה מפתיע, במיוחד אם נקודת ההנחה שלנו היא שהוצאו להורג אמורות להתחלק בצורה שווה בין מחוזות. אבל הערכה ראשונית מוצלחת יותר תהיה שההוצאות להורג מתחלקות בין המחוזות על פי יחסיות פזור האוכלוסיה. [מפקד האוכלוסין של טקסס בשנת 2010](https://www.tsl.texas.gov/ref/abouttx/popcnty12010.html) מראה שבארבעת המחוזות היו יותר מ-19 מליון תושבים, היוו 40% מהאוכלוסיה של טקסס (25.1 מליון איש). הנתון הזה הופך את הממצא לקצת פחות מפתיע.

אבל אם נתמקד בזנב הזה נבין שמחוז האריס (Harris) אחראי למרבית ההפרש. במחוז מתגוררת רק 16.4% מן האוכלוסיה, אבל מתבצעות בו 23.1% מההוצאות להורג. זה כמעט 50% יותר מאשר השיעור שניתן היה לצפות לו.

מחקרים רבים בחנו מדוע מחוז האריס (Harris) כה רווי בהוצאות להורג, והצביעו על הגורמים הבאים:

- <p>התביעות <a href="https://www.citylab.com/equity/2014/09/one-texas-county-is-responsible-for-most-of-the-executions-in-the-entire-us/380705/">נהנו מארגון ומימון</a>, בעוד ההגנות המשפטיות מומנו על ידי בית המשפטי עם בתמריצים נמוכים. <a href="http://www.houstonlawreview.org/wp-content/uploads/2018/05/3-Steiker-896.pdf">(מקור, ראו עמ’ 49)</a>.</p>

- <p> התובע המחוזי, שכיהן תקופה ארוכה, <a href="https://www.chron.com/news/houston-texas/article/Former-DA-ran-powerful-death-penalty-machine-1833545.php">היה נחוש ונלהב בנוגע לעונש המוות</a>.</p>

- <p>שופטים בטקסס עומדים לבחירות והאוכלוסיה תמכה בעונש מוות. <a href="https://priceonomics.com/why-has-texas-executed-so-many-inmates/">(מקור)</a>.</p>

- <p>מערכת האיזונים והבלמים במערכת המשפטית במחוז האריס (Harris) לא עבדה. <a href="https://houstonlawreview.org/article/3874-the-problem-of-rubber-stamping-in-state-capital-habeas-proceedings-a-harris-county-case-study">(מקור, ראו עמ’ 929)</a>.</p>


<br>
<a name="recap"></a>
## סיכום
בפרק זה למדנו כיצד לבצע אגירה בתוך קבוצות ואיך להיעזר בקינון (nesting) כדי להשתמש בפלט של שאילתה פנימית במסגרת שאילתה חיצונית. לטכניקות האלו מאפשרות לנו לחשב אחוזים.


<a name="mapreduce"></a>
<div class="sideNote">
  <h3>MapReduce</h3>
  <p>תוספת מעניינת היא שלמעשה כרגע למדנו לבצע MapReduce ב-SQL.<br>MapReduce היא פרדיגמה תכנותית מפורסמת שרואה את פעולות החישוב כמתרחשות בצעדים של "מיפוי" (map) ו"צמצום" (reduce). תוכלו ללמוד <a href="https://stackoverflow.com/questions/28982/simple-explanation-of-mapreduce">כאן</a> על MapReduce.</p>
  <p>ה<a href="beazley.html">פרק על ביזלי</a> עסק כולו במיפוי (mappping) מפני שהוא הראה לנו כיצד למפות פעולות שונות על כל השורות. למשל, <code>SELECT LENGTH(last_statement) FROM executions</code> ממפה את פונקצית האורך (LENGTH) על פני כל השורות. הפרק הזה הראה לנו כיצד לצמצם (Reduce) חלק מקבוצות הנתונים בעזרת פונקציות אוגרות (aggregation functions); והפרק הקודם <a href="innocence.html">טענות לחפות מפשע</a> היה מקרה ייחודיי שבו כל הטבלה שימשה כקבוצה אחת. </p>
</div>


בפרק הבא נלמד על `JOIN` אשר יאפשר לנו לעבוד עם כמה טבלאות.
