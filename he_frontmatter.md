---
layout: he_tutorial
title: העניינים שלפני
dbFile: data/tx_deathrow_small.db
---

<a name="impetus"></a>
## התמריץ
כשהיייתי איש נתונים (data scientist) ב-Quora, אנשים נהגו לשאול אותי בנוגע למשאבים ללימוד SQL. התאמצתי למצוא משהו שארגיש נח להמליץ עלייו, מפני שלהבנתי מקור טוב צריך להיות חינמי, ללא צורך בהרשמה ולקחת בחשבון את הפדגוגיה המתאימה&mdash; הוא צריך לדאוג למשתמשים שלו ולא היה שום דבר כזה בסביבה.

אנ מאמין ש **Select Star SQL** עומד ביעדים הללו, בזכות התמודדות עם כמה <a href="#technicals">מכשולים טכניים</a>. אני מקווה שבדומה למה ש<a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> ו-<a href='https://beautifulracket.com'>Beautiful Racket</a>עשו עבור Haskell ו-Racket,<br>**Select Star SQL** יהפך למקום הטוב ביותר באינטרנט ללמוד בו SQL.

<br>
<a name="pedagogy"></a>
## הפדגוגיה
אלו העקרונות שהנחו את העיצוב של הפרוייקט:

- <p><strong>הדרך הטובה ביותר ללמוד תכנות היא עשייה.</strong><br>

     חלק גדול כולל תרגילים. המאמץ להתמודד איתם אומר לדרוש את רוב הזמן.</p>

- <p><strong>התרגילים צריכים להיות מציאותיים וממשיים.</strong><br>
    כמו שאמר <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">אלן קיי (Alan Kay)</a>: "לעולם לא תתנו [למי שלומד/ת] לעשות משהו שהוא לא הדבר האמיתי&mdash; אבל תהיו חייבים לקרוע ת’תחת כדי להבין מהו הדבר הממשי בהקשר של דרך החשיבה שלהם בשלב ההתפתחות בו הם נמצאים.”</p>
    <p>בדומה, התרגילים כאן עוצבו כדי להציג רמת תחכום עולה של טכניקות SQL תוך כדי חקר של סט הנתונים בדרכים שבהן אנשים יעשו בפועל.</p>

- <p><strong>לימוד תכנות הן לימוד של צורת חשיבה.</strong><br>
המטרה שלנו כאן היא לא ללמד אתכם את הכללים לשימוש ב- <code>GROUP BY</code> או מתי להעדיף <code>LEFT JOIN</code> על פני <code>INNER JOIN</code>. נדע שעמדנו ביעד שלנו אם אחרי שכתבתם שאילתת SQL תוכלו לעצום את העיניים ולדמיין מה המחשב עושה ומה התוצאה שהוא עומד להציג. רק אז תהיו מסוגלים להשתמש ב-SQL כדי לפתור בעיות בעולם האמיתי.

<br>
<a name="dataset"></a>
## סט הנתונים
סט הנתונים שלנו מתעד את הנידונים למוות בטקסס שהוצאו להורג משנת 1976, השנה בה החזיר בית המשפט העליון האמריקני את עונש המוות לתוקפו, ועד להווה. המידע חולץ מאתר <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'> מחלקת המשפט הפלילי בטקסס (Texas Department of Criminal Justice) </a> באמצעים אוטומטיים, כשניתן היה. עם זאת, חלק גדול מהמידע עד לשנת 1995 זמין רק כצילומים של מסמכים מודפסים, מה שדרש חילוץ נתונים ידני ומייסר.

המידע הגולמי זמין כקובץ csv <a href="data/tx_deathrow_full.csv"> להורדה</a>. בזכות חילוץ הנתונים הידני וניקוי הנתונים, מדובר כנראה בסט הנתונים השלם ביותר בנושא עונש המוות באינטרנט. אתם יכולים לחקור גם את החלק ממנו שהוכן עבור הספר הזה <sql-exercise
  data-question="זהו עורך קוד אינטרקטיבי. תוכלו לערוך את השאילתה שלמטה."
  data-comment="Shift+Enter הוא קיצור המקלדת להרצת השאילתה"
  data-default-text="SELECT *
FROM executions
LIMIT 3"></sql-exercise>

במובן מסויים, המידע הוא סתם עוד חלק משעמם בספר תכנות. במובן אחר, כל שורה מייצגת סבל עצום, אובדן חיים ובכמה מקרים קבלה ונחמה. בהכנת סט הנתונים הזה התרגשתי מאוד ממספר ההצהרות שלפני ההוצאה להורג ומצאתי את עצמי בוחן מחדש את עמדתי ביחס לעונש המוות. אני מקווה שכשנבחן את הנתונים תהרהרו גם אתם לעומק בנושא.
<br>
<a name="technicals"></a>

## העניינים הטכניים
- <p><strong>בסיס נתונים בצד לקוח (Client-Side Databases</strong>. אחד האתגרים בליצור את האתר הזה כאתר בחינם היה ההמנעות מתשלום עבור אירוח (web hosting). אולם, כדי לאפשר למשתמשים התנסות מעשית עם בסיס נתונים (ראו <a href="#pedagogy">הפדגוגיה</a>), יש צורך לארח ולשלם על צד שרת מתאים. למרבה השמחה, יש דבר כזה בסיסי נתונים בצד לקוח. זה איפשר לי להשתמש בשירות אירוח העמודים הסטטיים החינמי של<a href="https://pages.github.com">Github Pages </a>ולבנות את הדפים באתר כך שיריצו בסיס נתונים של SQLite על הדפדפן שלכם. אלון זקאי (Alon Zakai) ואחרים הפכו את זה לאפשר כש<a href="https://github.com/kripken/sql.js">העבירו את הקוד של SQLite C ל-Javascript באמצעות Emscripten</a>.</p>


- <p> פגשתי את <strong>(Matthew Butterick) מתיו בוטריק</strong> ב-<a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> ופשוט התפוצצתי מהעבודה הנהדרת שהוא עשה ב-<a href="http://beautifulracket.com">Beautiful Racket</a> וב- <a href="http://practicaltypography.com">Practical Typography</a>. כמו שבטח שמתם לב, אימצתי הרבה רעיונות עיצוביים משם.</p>

- <p><strong>Jekyll</strong>. אלמלא <a href="https://jekyllrb.com/">Jekyll</a>, הייתי חייב לכתוב את כל ה-html של האתר הזה בצורה ידנית. תודה לאל על Jekyll.</p>

- <p>התאפשר לי לעשות שימוש חוזר בהרבה מהקוד בכך שכתבתי רכיבים של תרגול ובוחן כמו <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components"> תגיות html מותאמות (custom html tags) </a>. עד כמה שאני מבין זהו פיתוח חדיש יחסית ואני מקווה שה-W3C ימשיך לעודד לאימוץ רחב יותר שלו.</p>

<br>
<a name="contact"></a>
## צרו קשר
- לתיקונים והצעות, כתבו לי (Kao) ב-[zichongkao@gmail.com](zichongkao@gmail.com).
ניתן ללמוד עלי פרטים נוספים ב-<a href="http://kaomorphism.com">Kaomorphism</a>.

- לתייקונים והצעות בנוגע לתרגום בעברית ניתן ליצור קשר עם נעם קסטל
[noam@thepitz.io](noamoss@pitz.io) או ב [@pitz_the בטוויטר](http://twitter.com/pitz_the).
