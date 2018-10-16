---
layout: he_tutorial
title: המלים האחרונות של ביזלי
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>
## המקרה של ביזלי (Beazley's case)
בשנת 1994 ירה נפוליאון בג'ון לוטיג, איש עסקים בן 63, במוסך הביתי שלו תוך כדי ניסיון לגנוב את רכב המשפחה. מכיוון שהוא היה בן פחות מ-18 בזמן הרצח, עורר המקרה של ביזלי ויכוח בנוגע לעונש המוות לעבריינים צעירים. שלוש שנים לאחר הוצאתו להורג של ביזלי, בית המשפט העליון אסר על הוצאתם להורג של עבריינים שהיו בני פחות מ-18 בזמן ביצוע העבירה ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons)).

המקרה הזה ראוי לציון גם מפני שהקורבן היה אביו של השופט הפדראלי ג'ון מייקל לוטיג. במסגרת הדיון בבית המשפט העליון, שלושה מתוך תשעה שופטים פסלו את עצמם בשל קשריהם האישיים עם השופט לוטיג, והותירו שישה שופטים בלבד לדון במקרה.

נפוליאון ביזלי טען בדברים הנלהבים שנשא לפני הוצאתו להורג כי העקרון של עין תחת עין אינו בסיס לצדק. המשימה שלנו היא לאחזר (retrieve) את הדברים שלו מתוך בסיס הנתונים.

<br>
<a name="first"></a>
## שאילתת SQL ראשונה
<sql-exercise
  data-question="
  הריצו את השאילתה כדי לאתר את 3 השורות הראשונות של הטבלה הנקראת 'executions'"

  data-comment="הצגה של כמה שורות היא דרך נוחה לגלות מהם הטורים בטבלה. נסו לזכור את שמות הטורים לשימוש בהמשך."

  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

שאילתת ה-SQL עשויה להיראות כמשפט רגיל, אבל כדאי שתסתכלו עליה כעל שלוש לבנים, או שלושה בלוקים:

<code class='codeblock'>SELECT * </code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.<br>
כמו בלגו, לכל לבנה יש מבנה קבוע והלבנים השונות צריכות להתחבר בדרך כזו או אחרת.

<br>
<a name="select"></a>
## בלוק ה-SELECT
בלוק ה-`SELECT` מפרט אילו טורים אתם רוצים שייכללו בפלט. המבנה שלו הוא <br><code class='codeblock' dir="ltr">SELECT &lt;column&gt;, &lt;column&gt;,... </code>. כל טור צריך להיות מפורד על ידי פסיק, אבל הרווח שאחרי הפסיק אינו הכרחי. סימן הכוכב (`*`) הוא תו מיוחד שמסמן שאנחנו רוצים את כל הטורים שבטבלה.


<sql-exercise
  data-question="שנו את השאילתה בעורך הקוד כדי לבחור את הטורים first_name, last_name ו-last_statement."
  data-comment="כשתסיימו, ניתן ללחוץ על Shift+Enter כדי להריץ את השאילתה."
  data-default-text="SELECT first_name, last_name FROM executions LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>
<div class="sideNote">
  <h3>הערות ב-SQL</h3>

  <p>שימו לב שלחיצה על "הצגת פתרון" מציגה בעורך הקוד את הפתרון כשלפני מופיעים הסימנים `*/`. התוכן שמופיע בין <code>*/</code> לבין <code>/*</code> נחשב כהערות ולא יופעל כחלק מהקוד. זוהי דרך נוחה למנוע באופן זמני הרצה של קוד שאיננו מעוניינים שיופעל. כדי להריץ את הפתרון שלנו, עליכם פשוט למחוק או לסמן כהערה את הקוד שלכם ולהסיר את סימני ההערה מסביב לפתרון שהצגנו לכם.</p><p>הרצף <code>--</code> הוא דרך נוספת לסמן טקסט כהערה. הוא משמש לסמן את המשך השורה כהערה. כאשר יש לנו כמה שורות רצופות שברצוננו לסמן כהערה השימוש ב-<code>/* ... */</code> יהיה נח יותר מאשר להוסיף <code>--</code> בתחילת כל שורה.</p>


</div>
<br>
<a name="from"></a>

## בלוק ה-FROM
בלוק ה-<code>FROM</code> מפרט מאיזו טבלה אנחנו מבצעים את השאילתה. המבנה של הבלוק הוא <code class="codeblock">&lt;שם_טבלה&gt; FROM </code>. הוא תמיד יופיע אחר בלוק ה-<code>SELECT</code>


<sql-exercise
  data-question="הריצו את השאילתה המוצגת וראו את הודעת השגיאה שהיא מעלה. תקנו את השאילתה."
  data-comment="תתרגלו לבחון הודעות שגיאה כאשר משהו משתבש ונסו להמנע מתיקון (debug) על בסיס תחושת בטן או ניסוי וטעייה."
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

אנחנו לא צריכים את בלוק ה-`FROM` אם איננו משתמשים בפריט כלשהוא מטבלה.


<sql-exercise
  data-question="שנו את השאילתה כך שתחלק את המספר 50 ואת המספר 51 ב-2."
  data-comment="SQL תומכת בכל פעולות החשבונאיות הרגילות."
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

האם זה לא מוזר ש- `51/2` מציג `25` במקום `25.5`? זה קורה מפני ש-SQL מבצעת חלוקה בין מספרים שלמים (integers). על מנת לבצע חלוקה בין מספרים עשרוניים (decimals), לפחות אחד מן הגורמים (operands) חייב להיות מספר עשרוני, למשל `51.0/2`. זה טריק מקובל להכפיל את אחד המספרים ב-`1.0` כדי להמיר אותו למספר עשרוני.


<a name="capitalization"></a>
<div class="sideNote">
  <h3>אותיות אנגליות גדולות (Capitalization)</h3>
<p>למרות שכתבתנו את המלים <code>SELECT</code>, <code>FROM</code> ו-<code>LIMIT</code> באותיות אנגליות גדולות, פקודות SQL אינן רגישות להבדלים בין אותיות גדולות וקטנות (case-insensitive). תוכלו לראות שעורך הקוד מכיר אותן ומתייחס אליהן כפקודות במנותק מצורת האותיות. למרות זאת, אני ממליץ לרשום את פקודות ה-SQL באותיות גדולות (capitalized) כדי להבדיל ביניהן לבין שמות הטורים, שמות הטבלאות ושמות משתנים.</p>

  <p>שמות טורים, שמות טבלאות ושמות משתנים גם כן אינם רגישים להבדלים בין אותיות קטנות לגדולות בגרסה הזו של SQL, אבל הם כן case-sensitive בגרסאות רבות אחרות. כדי לעבוד בצורה בטוחה, אני ממליץ תמיד לניח שישנה רגישות להבדלים בין אותיות קטנות לגדולות.</p>
</div>

<a name="whitespace"></a>
<div class="sideNote">
  <h3>רווחים</h3>
<p>הכוונה ברווחים היא לרווח, טאבם, שבירת שורה ותווים אחרים שמוצגים בעמוד כמרווח ריק. בדומה לאותיות אנגליות גדולות/קטנות (Capitalization), SQL אינה רגישה מאוד לרווחים, כל עוד לא תאחדו שתי מלים נפרדות למילה אחת. המשמעות היא שחייב להיות לפחות תו אחד של רווח משני הצדדים של כל פקודה – לא משנה איזה מן התווים המייצגים מרווח ריק ובכמה תווים כאלו תשתמשו. למעט שאילתות קצרות, אני מעדיף לשים כל פקודה בשורה חדשה כדי להקל את הקריאה של השאילתה.</p>

<sql-exercise
  data-question="ודאו שערבוב אותיות קטנות וגדולות ורווחים אינם פוגעים בתקינות של השאילתה."
data-comment="קרלה טוקר (Karla Tucker) היתה האישה הראשונה שהוצאה להורג בטקסס מאז מלחמת האזרחים. היא הורשעה בהרג במהלך שוד ב-1983."
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>
</div>

<br>
<a name="where"></a>
## בלוק ה-WHERE
<p>בלוק ה-`WHERE` מאפשר לנו לסנן את השורות שעומדות בתנאים מסויימים מתוך הטבלה. המבנה של הבלוק הוא <code class='codeblock' dir="ltr">WHERE &lt;clause&gt;</code> והוא תמיד יופיע אחרי בלוק ה-`FROM`. כאן, הפסקה מייצרת ביטוי בוליאני (Boolean statement) שהמחשב יכול לחשב כאמת או שקר, כמו <code>ex_number = 145</code>. אתם יכולים לדמיין איך המחשב עובר שורה אחרי שורה בטבלה ויבדוק אם הביטוי בפסקה אמיתי, ואם כן, יוסיף את השורה.</p>


<sql-exercise
  data-question="מצאו את השם הפרטי ושם המשפחה של נדונים למוות בגיל 25 או צעירים יותר בעת ההוצאה להורג."
  data-comment="בגלל שזמן המאסר הממוצע שנדונים למוות ישבו בכלא לפני ההוצאה להורג הוא 10.26 שנים, רק שישה נדונים למוות בגיל צעיר שכזה הוצאו להורג בטקסס מאז שנת 1976."
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

די ברור איך אנחנו יכולים להשתמש באופרטרים אריתמטיים כמו `<` ו-`=>` בבניית הפסקאות. יש גם אוסף של תווים שמשמשים כאופרטורים לעבודה עם מחרוזות תווים.

הדוגמה החזקה ביותר מתוך לה היא כנראה <code>LIKE</code>. היא מאפשרת לנו להשתמש בתווים כלליים (wildcards) כמו `%` ו-`_` כדי לנסות למצוא התאמה עם תווים שונים. לדוגמה, `first_name LIKE '%roy'` יחזיר תוצאת אמת לשורות שבהן השם הפרטי הוא ‘roy’,’Troy’ ו-’Deroy’, אבל לא ‘royman’. התו הכללי `_` ישווה ויהיה תואם לתו בודד, כך ש-`first_name LIKE `_roy` יהיה תואם רק ל-`Troy`.


<sql-exercise
    data-question="מצאו את מספר ההוצאה להורג של ריימונד לנדרי (Raymond Landry)."
    data-comment="יתכן שתחשבו שזה קל, מכיוון שאנחנו כבר יודעים את השם הפרטי ושם המשפחה שלו, אבל אוספי נתונים מגיעים נקיים ומסודרים רק לעתים רחוקות. השתמשו באופרטור LIKE כך שלא תצטרכו לדעת את השם שלו באופן מושלם כדי לאתר את השורה."
    data-default-text="SELECT ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name = 'Landry'"
    data-solution="SELECT ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name LIKE '%Landry%'"></sql-exercise>

<a name="quotes"></a>
<div class="sideNote">
  <h3>מרכאות</h3>
<p>ב-SQL, מחרוזות תווים מסומנות במרכאות בודדות (‘). מרכאה בודדת חרות (Backticks, <code>`</code>) משמשת כדי לסמן שמות של טורים ושל טבלאות. זה שימושי כאשר שם של טור הוא שם של טבלה זהים לאחת ממלות המפתח של SQL או כאשר יש בתוכם רווח. יתכן מצב שבו בסיס נתונים כולל טבלה בשם ‘where’ וטור שנקרא ‘from’. (מי יכול להיות אכזרי כל כך ולעשות דבר כזה?!) במקרה כזה תצטרכו לכתוב <code>SELECT `from` FROM `where` WHERE ...</code>. <br>זוהי עוד דוגמה שממחישה מדוע שמירה על כתיבה באותיות גדולות (capitalization) של פקודות SQL יכולה לעזור.</p>
</div>

כמו שראיתם בתרגילים הקודמים, פסקאות מורכבות יכולות להיווצר מחיבור של פסקאות פשוטות באמצעות אופרטורים בוליאנים כמו `NOT` (לא), `AND` (ו-) ו-`OR` (או). SQL מעניקה קדימות ל-`NOT` ואז ל-`AND` ולבסוף ל-`OR`. אבל אם אתם, כמוני, עצלנים מידי בכדי לזכור את סדר הקדימויות, תוכלו להשתמש בסוגריים כדי להבהיר את הסדר הרצוי.


<sql-exercise
    data-question="הכניסו זוג סוגריים כדי שההצהרה הזו תחזיר 0."
    data-comment="אנחנו מסתמכים כאן על העובדה שהמשמעות של 1 היא אמת והמשמעות של 0 היא שקר."
    data-default-text="SELECT 0 AND 0 OR 1"
    data-solution="SELECT 0 AND (0 OR 1)"
    ></sql-exercise>

בואו נבצע בוחן קטן כדי לקבע את ההבנה שלכם.

<sql-quiz
  data-title="בחרו את כל הבלוקים <code>WHERE</code> עם הפסקאות התקינות."
  data-description="אלה שאלות טריקיות. גם אם נחשתם נכון, קראו את הרמזים כדי להבין מה הסיבה לתשובה הנכונה.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="code>1</code> ו-<code>0</code> הם ההצהרות הבוליאניות הכי בסיסיות. הבלוק הזה מבטיח ששום שורות לא יוחזרו."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="האופרטור <code>==</code> בודק שוויון בהרבה שפות תכנות אחרות, אבל ב-SQL משתמשים ב-<code>=</code>."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="כמה שמות טורים יכולים לשמש בפסקה אחת."
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="האופרטור לסימון ‘גדול מ.. או שווה ל..’ הוא <code>=</code>. הסדר של הסמלים תואם לאופן שבו הייתם רושמים את הדברים באנגלית או בעברית."
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="SQL יכולה להעריך כאמת כמעט כל דבר. הטור ‘ex_age’ מלא במספרים שלמים (integers). הכלל למספרים שלמים הוא ש-0 הוא שקר (false) וכל ערך אחר שווה לאמת (true), כך שרק שורות עם ערך שאינו 0 יוחזרו."
    data-correct="true"
    ></sql-quiz-option>
   <sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="אין בעיה להשתמש ביותר מתו כללי (wildcard) אחד, אבל התבנית חייבת להגיע אחר האופרטור LIKE."
    ></sql-quiz-option>
    </sql-quiz>

כעת נמצאים בידיכם הכלים הדרושים לכם כדי להשלים את הפרוייקט שלנו.

<sql-exercise
  data-question="מצאו את מלותיו האחרונות של נפוליאון ביזלי."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

זה לא מדהים עד כמה עמוק ורב עוצמה ביזלי? זכרו שהוא רק בן 25 בזמן שהשמיע את המלים הללו ושהה בכלא מאז שהיה בן 18.

<br>
<a name="#recap"></a>
## לסיכום
המטרה של הפרק הזה היתה להציג את המקטע הבסיסי אך העוצמתי  <code class="codeblock">SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;clause&gt;</code>. הוא מאפשר לנו לסנן טבלה על ידי כך שהמחשב עובר שורה אחר שורה ובוחר את השורות עבורן פסקת ה-`WHERE` נכונה.למדנו גם איך לחבר חד כמה פסקות מורכבות יחסית שניתן להפעיל על תווים, מספרים וטורים עם ערכים בוליאנים (אמת/שקר).

עד כה פעלנו רק ברמת השורה הבודדת, מה שהגביל אותנו לחיפוש ואיתור של נקודות מידע בודדות ונפרדות. בפרק הבא נתרכז בצבירות (aggregations) שיאפשרו לנו להבין תופעות ברמה המערכתית.
