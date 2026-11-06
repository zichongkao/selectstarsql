---
layout: bn_tutorial
title: সমাপনী মন্তব্য ও চ্যালেঞ্জ প্রশ্ন
dbFile: data/114_congress_small.db
---

<a name="closing_remarks"></a>
## সমাপনী মন্তব্য
শেষ পর্যন্ত আমাদের সাথে থাকার জন্য আন্তরিক ধন্যবাদ! আশা করি পুরো বিষয়টি আপনার জন্য উপভোগ্য এবং জ্ঞানগর্ভ একটি অভিজ্ঞতা ছিল।

এই পর্যায়ে আমরা বেশিরভাগ গুরুত্বপূর্ণ এসকিউএল (SQL) কমান্ড এবং ফাংশন আলোচনা করেছি। তবে আমি আশা করি এখান থেকে পাওয়া সবচেয়ে বড় অর্জন হবে কুয়েরি নিয়ে চিন্তা করার কৌশল এবং হিউরিস্টিকস (heuristics)। এর মধ্যে প্রধান কয়েকটি হলো:
 - <p>কোন এগ্রিগেশনটি প্রয়োগ করতে হবে তা নির্ধারণের জন্য বিদ্যমান টেবিলগুলোর আকারের সাথে কাঙ্ক্ষিত ফলাফলের তুলনা করা।</p>
 - <p>আমাদের প্রয়োজনীয় তথ্যটি ঠিক কোথায় অবস্থান করছে তা পরীক্ষা করে দেখা—এটি কি কোনো সংলগ্ন সারিতে রয়েছে? নাকি কোনো গ্রুপে? নাকি সমগ্র ডেটাসেট জুড়ে?</p>
 - <p>সঠিক যৌক্তিক কাঠামোর মাধ্যমে কুয়েরি ব্যাখ্যা করা। উদাহরণস্বরূপ, বিভিন্ন ক্লজকে মূলত সত্য (true) বা মিথ্যা (false) হিসেবে দেখা; এবং <code>&lt;table1&gt; JOIN &lt;table2&gt; ON ...</code>-কে একটি বিশাল যৌথ টেবিল হিসেবে বিবেচনা করা।</p>

ভবিষ্যতের কথা ভাবলে, আপনার এসকিউএল শিক্ষাকে সম্পূর্ণ করতে উইন্ডো ফাংশন (window functions) এবং কমন টেবিল এক্সপ্রেশন (common table expressions বা CTE) নিয়ে জানা নিশ্চয়ই অত্যন্ত সার্থক হবে। আপনি এখানে শেখা বিভিন্ন কৌশলের সাহায্যেও সেগুলোর কার্যকারিতা তৈরি করতে পারেন, তবে এগুলো কাজকে অনেক বেশি সহজ করে তোলে এবং আপনাকে একটি মূল্যবান নতুন প্যারাডাইমের সাথে পরিচয় করিয়ে দেয়। আমি এই ধারণাগুলো এই টিউটোরিয়ালে অন্তর্ভুক্ত করিনি কারণ এটি লেখার সময়ে SQLite-এ [উইন্ডো ফাংশনের সমর্থন ছিল না](https://www.sqlite.org/windowfunctions.html#history), এবং আমি একটি নতুন ডেটাবেজ ও নতুন এসকিউএল ডায়ালেক্টের জটিলতা এড়াতে চেয়েছিলাম।

এ পর্যন্ত আমরা কেবল ডেটা পড়ার ও ব্যবহার করার (কুয়েরি করার) বিষয়টি শিখেছি। তবে উপাত্ত পরিবর্তন ও পরিচালনার (manipulating data) জন্যও এসকিউএল-এর সম্পূর্ণ একটি পৃথক ক্ষেত্র রয়েছে। সেগুলো টেবিল তৈরি (table creation), ডেটা সন্নিবেশ (data insertion) এবং ডেটা মুছে ফেলার (deletion) মতো কাজগুলো নিয়ে পরিচালিত হয়। আপনি যদি ডেটাবেজ অ্যাডমিনিস্ট্রেটর নাও হন, তবুও এই ধারণাগুলো বোঝা অত্যন্ত কার্যকর হতে পারে—কারণ অন্যান্য সুবিধার পাশাপাশি এটি আপনাকে বুঝতে সাহায্য করে কেন বিভিন্ন টেবিলকে নির্দিষ্ট উপায়ে গঠন করা হয়।

সবচেয়ে বড় কথা হলো, বাস্তব জগতের বিভিন্ন সমস্যায় পারদর্শী হয়ে উঠতে আপনার এখনও প্রচুর অনুশীলনের প্রয়োজন। পরবর্তী বিভাগে কিছু অনুশীলনী প্রদান করা হয়েছে, তবে সেগুলোর কাঠিন্যের মাত্রা বেশ উল্লেখযোগ্যভাবে বেশি। আপনি চাইলে বাস্তব জীবনে এ পর্যন্ত শেখা বিষয়গুলো নিয়ে অনুশীলন করে দেখতে পারেন এবং পুরোপুরি প্রস্তুত হলে এখানে ফিরে আসতে পারেন।

<br />
<a name="challenge_questions"></a>
## চ্যালেঞ্জ প্রশ্নসমূহ
পূর্ববর্তী অধ্যায়গুলোর অনুশীলনী এমনভাবে নকশা করা হয়েছিল যাতে জটিলতা কমিয়ে একটি সহজ ও শিক্ষণবান্ধব পরিবেশ তৈরি করা যায়। কিন্তু এই অধ্যায়টি আপনাকে এসকিউএল সমস্যার এক উন্মুক্ত ও বাঁধনহারা জগতে প্রবেশ করায়। এখানকার মূল ভাবনা হলো কঠিন পরীক্ষার মধ্য দিয়ে যাওয়া (trial-by-fire)&mdash;প্রশ্নগুলো শেখার সহজতার চেয়ে বাস্তবমুখী উপযোগিতার দিকে নজর রেখে প্রস্তুত করা হয়েছে। এমনকি অভিজ্ঞ এসকিউএল লেখকরাও এখানে সমস্যার মুখে পড়তে পারেন; আর এই চ্যালেঞ্জের মধ্যেই লুকিয়ে আছে আসল সার্থকতা।

<a name="call_for_problems"></a>
<div class="sideNote">
  <H3>নতুন সমস্যার আহ্বান</H3>
  <p>একটি টিউটোরিয়াল কতটা কার্যকর হবে তা বহুলাংশে নির্ভর করে ভালো অনুশীলনী সমস্যার ওপর। আপনার কাছে যদি কোনো নতুন সমস্যা বা অধ্যায়ের আইডিয়া থাকে, তবে আপনার পূর্ণ কৃতিত্বসহ এখানে প্রকাশ করতে সাহায্য করতে পেরে আমি আনন্দিত হব। আমাকে <a href="mailto:zichongkao+web@gmail.com">zichongkao@gmail.com</a> ঠিকানায় ইমেইল করুন অথবা একটি <a href="https://github.com/zichongkao/selectstarsql">পুল রিকোয়েস্ট (pull request)</a> জমা দিন। মনে রাখবেন, ভালো সমস্যা মানেই যে সেটি খুব কঠিন হতে হবে তা নয়—বরং সেগুলো এমন কৌশল তুলে ধরে যার বাস্তবমুখী বিস্তৃত প্রয়োগ রয়েছে।</p>
</div>

<br />
<a name="senate_cosponsorship"></a>
## সিনেট কো-স্পন্সরশিপ ডেটাসেট
### লেখক: কাও (Kao)
এই বিভাগে আমরা মার্কিন কংগ্রেসের ১১৪তম অধিবেশনের (২০১৫-২০১৬) একটি নতুন ডেটাসেটের সাথে পরিচিত হব, যা <a href="http://jhfowler.ucsd.edu/cosponsorship.htm">জেমস ফাউলার (James Fowler) এবং অন্যান্যদের দ্বারা সংকলিত</a> হয়েছিল। সিনেটরদের মধ্যকার পারস্পরিক সহ-পৃষ্ঠপোষকতার (cosponsoring) সম্পর্ক বিশ্লেষণের উপযোগী করতে আমি এই ডেটাসেটটিকে কিছুটা পুনর্গঠন করেছি।

যিনি কোনো বিল উত্থাপন করেন সেই সিনেটরকে বলা হয় "স্পন্সর" (sponsor)। অন্যান্য সিনেটররা সেই বিলে সহ-পৃষ্ঠপোষকতা (cosponsoring) করে তাঁদের সমর্থন জানাতে পারেন। বিল উত্থাপনের সময় যাঁরা সহ-পৃষ্ঠপোষক থাকেন তাঁদের বলা হয় "মূল সহ-পৃষ্ঠপোষক" বা "original cosponsors" (<a href="https://www.congress.gov/resources/display/content/How+Our+Laws+Are+Made+-+Learn+About+the+Legislative+Process#HowOurLawsAreMade-LearnAbouttheLegislativeProcess-IntroductionandReferraltoCommittee">উৎস</a>)। টেবিলের প্রতিটি সারি নির্দিষ্ট বিল, তার স্পন্সর, একজন মূল সহ-পৃষ্ঠপোষক এবং সেই সিনেটররা যেসব অঙ্গরাজ্যের প্রতিনিধিত্ব করেন তা প্রদর্শন করে। মনে রাখবেন, একটি বিলে একাধিক সহ-পৃষ্ঠপোষক থাকতে পারেন।

<sql-exercise
  data-question="ডেটাসেটটি এক নজরে দেখে নিন।"
  data-en-question="Have a look at the dataset."
  data-comment="১৫ হাজার (15K) সারির এই ডেটাসেটটি টেক্সাসের ডেটাসেটের তুলনায় কিছুটা বড়, তাই একবারে সমস্ত ডেটা প্রিন্ট করা এড়িয়ে চলাই ভালো।"
  data-default-text="SELECT * FROM cosponsors LIMIT 3"
  ></sql-exercise>

<sql-exercise
  data-question="সবচেয়ে বেশি পারস্পরিক নেটওয়ার্কযুক্ত সিনেটরকে খুঁজে বের করুন। অর্থাৎ, যাঁর পারস্পরিক সহ-পৃষ্ঠপোষকতা (mutual cosponsorship) সবচেয়ে বেশি।"
  data-en-question="Find the most networked senator. That is, the one with the most mutual cosponsorships."
  data-comment="পারস্পরিক সহ-পৃষ্ঠপোষকতা (mutual cosponsorship) বলতে এমন দুজন সিনেটরকে বোঝায় যাঁরা একে অপরের উত্থাপিত বিলে সহ-পৃষ্ঠপোষক হিসেবে স্বাক্ষর করেছেন। এই দুই সিনেটর একাধিক বিলে একসাথে কাজ করলেও, তাঁদের পারস্পরিক সম্পর্কটিকে একটি হিসেবেই গণনা করা হবে।"
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
  data-question="এবার প্রতিটি অঙ্গরাজ্য থেকে সবচেয়ে বেশি নেটওয়ার্কযুক্ত সিনেটরকে খুঁজে বের করুন।"
  data-en-question="Now find the most networked senator from each state."
  data-comment="যদি একাধিক সিনেটর যৌথভাবে শীর্ষে থাকেন, তবে উভয়কেই প্রদর্শন করুন। অঙ্গরাজ্য (state), সিনেটর (senator) এবং পারস্পরিক সহ-পৃষ্ঠপোষকতার সংখ্যা (mutual cosponsorship count)-এর সাথে সঙ্গতিপূর্ণ কলামগুলো ফলাফল হিসেবে প্রদর্শন করুন।"
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
  data-question="যেসব সিনেটর অন্যান্যদের বিলে সহ-পৃষ্ঠপোষকতা করেছেন কিন্তু নিজেরা কোনো বিল উত্থাপন (sponsor) করেননি, তাঁদের খুঁজে বের করুন।"
  data-en-question="Find the senators who cosponsored bills but didn't sponsor any bills themselves."
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
