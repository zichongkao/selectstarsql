---
layout: uk_tutorial
title: Прикінцеві зауваги та складні завдання
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## Прикінцеві зауваги
Дякую, що дійшли до кінця! Сподіваюся, читати було приємно та пізнавально.

Ми розглянули багато важливих конструкцій та функцій SQL, але сподіваюся, що найбільшу користь принесуть способи мислення, які допомагають будувати запити. Ось головні з них:
 - <p>Порівнюйте структуру наявних таблиць із бажаним результатом, щоб визначити, яке агрегування потрібне.</p>
 - <p>З’ясовуйте, де міститься потрібна інформація: у сусідньому рядку, в групі чи в усьому наборі даних?</p>
 - <p>Розумійте логічну будову запиту. Наприклад, сприймайте умови як вирази, які можуть бути істинними або хибними, а <code>&lt;таблиця1&gt; JOIN &lt;таблиця2&gt; ON ...</code>, як одну спільну таблицю.</p>

Щоб продовжити вивчення SQL, варто познайомитися з віконними функціями та загальними табличними виразами (CTE, Common Table Expression). Чимало їхніх можливостей можна відтворити вже відомими вам прийомами, але вони суттєво спрощують запити й пропонують новий погляд на роботу з даними. Я не розглядав їх докладно, бо на час написання підручника SQLite [ще не підтримувала віконні функції](https://www.sqlite.org/windowfunctions.html#history), а я не хотів ускладнювати навчання переходом на іншу систему та діалект. У завершальних вправах ви все ж побачите CTE — іменовані результати запитів, задані через `WITH`.

Досі ми лише отримували дані за допомогою запитів. Але SQL також має засоби створення таблиць, додавання, зміни та видалення даних. Їх корисно знати навіть тим, хто не адмініструє бази даних: зокрема, це допомагає зрозуміти, чому таблиці влаштовані саме так.

І найголовніше: для впевненого розв’язання реальних задач потрібна практика. Далі є кілька вправ, але їхня складність різко зростає. Можливо, спершу варто попрактикувати вже вивчене на власних задачах і повернутися сюди, коли будете готові.

<br />
<a name="challenge_questions"></a>
## Завдання підвищеної складності
У попередніх розділах вправи були навмисно спрощені, щоб допомогти поступово засвоїти матеріал. Тепер починається світ справжніх SQL-задач. Це своєрідне випробування практикою: тут важливіша прикладна користь, ніж легкість навчання. Навіть досвідченим користувачам SQL може бути непросто — і саме подолання цих труднощів багато чого навчає.

<a name="call_for_problems"></a>
<div class="sideNote">
  <h3>Запропонуйте власне завдання</h3>
  <p>Якісні задачі визначають цінність підручника. Якщо маєте ідею вправи чи розділу, я залюбки допоможу опублікувати її тут із зазначенням вашого авторства. Напишіть на <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> або надішліть <a href="https://github.com/zichongkao/selectstarsql">запит на внесення змін (pull request)</a>. Хороша задача не обов’язково складна: насамперед вона демонструє прийоми, корисні в багатьох ситуаціях.</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## Набір даних про співавторство законопроєктів у Сенаті
### Автор: Као
У цьому розділі використаємо новий набір даних про Конгрес США 114-го скликання (2015–2016), <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">зібраний Джеймсом Фаулером та іншими дослідниками</a>. Я переробив його, щоб ми могли досліджувати зв’язки між сенаторами через співавторство законопроєктів.

Сенатора, який вносить законопроєкт, називають ініціатором (sponsor). Інші сенатори можуть підтримати його, як співавтори (cosponsors). Тих, хто приєднався вже на момент внесення, називають початковими співавторами (original cosponsors) (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">джерело</a>). Кожен рядок таблиці містить законопроєкт, його ініціатора, одного початкового співавтора та штати, які представляють ці сенатори. Один законопроєкт може мати кількох співавторів.

<sql-exercise
  data-question="Перегляньте набір даних."
  data-comment="Тут близько 15 тисяч рядків — більше, ніж у наборі про Техас. Тому краще не виводити все одразу."
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="Знайдіть сенатора з найбільшою кількістю зв’язків, тобто з найбільшою кількістю взаємних співавторств."
  data-comment="Взаємне співавторство означає, що кожен із двох сенаторів був співавтором хоча б одного законопроєкту, внесеного іншим. Навіть якщо вони співпрацювали над багатьма законопроєктами, їхній зв’язок рахується лише один раз."
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
LIMIT 1"
  ></sql-exercise>

<sql-exercise
  data-question="Тепер знайдіть сенатора з найбільшою кількістю таких зв’язків у кожному штаті."
  data-comment="Якщо кілька сенаторів мають однаковий максимальний результат, виведіть усіх. Поверніть стовпці зі штатом, сенатором і кількістю взаємних співавторств."
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
  data-question="Знайдіть сенаторів, які були співавторами законопроєктів, але самі не вносили жодного законопроєкту в цьому наборі даних."
  data-comment=""
  data-solution="
SELECT DISTINCT c1.cosponsor_name
FROM cosponsors c1
LEFT JOIN cosponsors c2
 ON c1.cosponsor_name = c2.sponsor_name
 -- Це з’єднання знаходить співавторів,
 -- які також були ініціаторами законопроєктів
WHERE c2.sponsor_name IS NULL
-- LEFT JOIN + перевірка NULL — поширений прийом
-- для відбору рядків, які не мають відповідностей.
"
  ></sql-exercise>

