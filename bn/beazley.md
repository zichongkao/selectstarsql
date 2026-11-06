---
layout: bn_tutorial
title: বিজলির শেষ জবানবন্দি
dbFile: data/tx_deathrow_small.db
---

<a name="beazley_case"></a>
## বিজলি মামলা
১৯৯৪ সালে, নেপোলিয়ন বিজলি (Napoleon Beazley) জন লুটিগ (John Luttig) নামের এক ৬৩ বছর বয়সী ব্যবসায়ীর পারিবারিক গাড়ি চুরির চেষ্টার সময় তাঁর নিজস্ব গ্যারেজে তাঁকে গুলি করে হত্যা করেন। হত্যাকাণ্ডের সময় বিজলির বয়স ১৮ বছর হতে সামান্য কিছু দিন বাকি থাকায়, এই বিজলি মামলাটি অপ্রাপ্তবয়স্ক বা কিশোর অপরাধীদের মৃত্যুদণ্ড দেওয়ার প্রশ্নে এক তীব্র বিতর্কের জন্ম দেয়। বিজলির মৃত্যুদণ্ড কার্যকর হওয়ার ৩ বছর পর, মার্কিন সুপ্রিম কোর্ট অপরাধ সংঘটনের সময় ১৮ বছরের কম বয়সী অপরাধীদের মৃত্যুদণ্ড নিষিদ্ধ ঘোষণা করে ([Roper v Simmons, 2005](https://en.wikipedia.org/wiki/Roper_v._Simmons))।

মামলাটি আরেকটি কারণেও বিশেষভাবে আলোচিত ছিল; নিহত জন লুটিগ ছিলেন ফেডারেল বিচারপতি জন মাইকেল লুটিগের (John Michael Luttig) পিতা। সুপ্রিম কোর্টে আপিল চলাকালে, নয়জন বিচারপতির মধ্যে তিনজন বিচারপতি লুটিগের সাথে ব্যক্তিগত সম্পর্কের কারণে মামলাটি পরিচালনা থেকে নিজেদের প্রত্যাহার (recuse) করে নেন, ফলে মাত্র ছয়জন বিচারপতি মামলাটি পর্যালোচনার দায়িত্বে থাকেন।

নেপোলিয়ন বিজলি মৃত্যুদণ্ড কার্যকরের পূর্বে এক আবেগঘন শেষ জবানবন্দি দেন, যেখানে তিনি যুক্তি তুলে ধরেন যে "চোখের বদলে চোখ" কখনো প্রকৃত ন্যায়বিচার হতে পারে না। আমাদের লক্ষ্য হলো ডেটাবেজ থেকে তাঁর সেই শেষ জবানবন্দিটি খুঁজে বের করা।

<br>
<a name="first"></a>
## প্রথম এসকিউএল কুয়েরি
<sql-exercise
  data-question="'executions' টেবিলের প্রথম ৩টি সারি দেখার জন্য এই কুয়েরিটি চালান।"
  data-en-question="Run this query to find the first 3 rows of the 'executions' table."
  data-comment="টেবিলটিতে কী কী কলাম রয়েছে তা জানার জন্য প্রথম কয়েকটি সারি দেখে নেওয়া একটি চমৎকার উপায়। পরবর্তী ব্যবহারের সুবিধার্থে কলামগুলোর নাম মনে রাখার চেষ্টা করুন।"
  data-default-text="SELECT * FROM executions LIMIT 3"></sql-exercise>

এসকিউএল (SQL) কুয়েরিটি দেখতে সাধারণ কোনো ইংরেজি বাক্যের মতো মনে হতে পারে, তবে এটিকে লেগো (Lego) ব্লকের মতো তিনটি পৃথক ব্লকের সমন্বয় হিসেবে ভাবা উচিত:
<code class='codeblock'>SELECT *</code>
<code class='codeblock'>FROM executions</code>
<code class='codeblock'>LIMIT 3</code>.
লেগো ব্লকের মতোই প্রতিটি ব্লকের একটি নির্দিষ্ট গঠন রয়েছে এবং এই বিভিন্ন ব্লককে নির্দিষ্ট নিয়মে একটির সাথে অন্যটিকে জুড়তে হয়।

<br>
<a name="select"></a>
## SELECT ব্লক
`SELECT` ব্লকটি নির্দিষ্ট করে যে ফলাফলে আপনি কোন কোন কলাম দেখতে চান। এর সাধারণ গঠন হলো <code class='codeblock'>SELECT &lt;column&gt;, &lt;column&gt;, ...</code>। প্রতিটি কলামের নাম কমা (,) দিয়ে আলাদা করতে হয়, তবে কমার পরের ফাঁকা জায়গাটি (space) ঐচ্ছিক। তারকা চিহ্নটি (অর্থাৎ `*`) একটি বিশেষ অক্ষর যা নির্দেশ করে যে আমরা টেবিলের সমস্ত কলাম দেখতে চাই।

<sql-exercise
  data-question="নিচের কোড এডিটরে বিদ্যমান কলামগুলোর পাশাপাশি last_statement কলামটি নির্বাচন করতে কুয়েরিটি সংশোধন করুন।"
  data-en-question="In the code editor below, revise the query to select the last_statement column in addition to the existing columns."
  data-comment="কোড লেখা শেষ হলে, কুয়েরিটি চালাতে Shift+Enter চাপতে পারেন।"
  data-default-text="SELECT first_name, last_name
FROM executions
LIMIT 3"
  data-solution="SELECT first_name, last_name, last_statement FROM executions LIMIT 3"></sql-exercise>

<a name="comments"></a>
<div class="sideNote">
  <h3>এসকিউএল কমেন্ট</h3>
  <p>খেয়াল করুন, "সমাধান দেখুন" বোতামে ক্লিক করলে এডিটরে সমাধানটি প্রদর্শিত হয় এবং তার শুরুতে <code>/*</code> থাকে। <code>/*</code> এবং <code>*/</code>-এর মধ্যবর্তী অংশকে কমেন্ট বা মন্তব্য হিসেবে গণ্য করা হয় এবং তা কোড হিসেবে কার্যকর হয় না। যে কোডটুকু আমরা সাময়িকভাবে চালাতে চাই না তা নিষ্ক্রিয় রাখার জন্য এটি বেশ কার্যকর। সমাধানটি চালাতে চাইলে, শুধু আপনার কোডটি মুছে ফেলুন অথবা কমেন্ট করে দিন এবং সমাধানের কমেন্টটুকু তুলে নিন (uncomment করুন)।</p>
  <p>কমেন্ট লেখার আরেকটি উপায় হলো <code>--</code>। এটি কোনো লাইনের বাকি অংশকে কমেন্ট হিসেবে চিহ্নিত করতে ব্যবহৃত হয়। যখন আমাদের একাধিক লাইন কমেন্ট করার প্রয়োজন হয়, তখন প্রতিটি লাইনের শুরুতে <code>--</code> যোগ করার চেয়ে <code>/* ... */</code> ব্যবহার করা বেশি সুবিধাজনক।</p>
</div>

<br>
<a name="from"></a>
## FROM ব্লক
<code>FROM</code> ব্লকটি নির্দিষ্ট করে যে আমরা কোন টেবিল থেকে তথ্য অনুসন্ধান (query) করছি। এর গঠন হলো <code class="codeblock">FROM &lt;table&gt;</code>। এটি সর্বদা <code>SELECT</code> ব্লকের পরে বসে।

<sql-exercise
  data-question="প্রদত্ত কুয়েরিটি চালান এবং এটি যে ত্রুটি (error) প্রদর্শন করে তা পর্যবেক্ষণ করুন। এরপর কুয়েরিটি ঠিক করুন।"
  data-en-question="Run the given query and observe the error it produces. Fix the query."
  data-comment="কোনো কিছু ভুল হলে ত্রুটির বার্তা (error message) ভালো করে দেখার অভ্যাস গড়ে তুলুন। নিছক অনুমানের ওপর ভিত্তি করে কোড ঠিক করার চেষ্টা এড়িয়ে চলুন।"
  data-default-text="SELECT first_name FROM execution LIMIT 3"
  data-solution="SELECT first_name FROM executions LIMIT 3"></sql-exercise>

পরবর্তী উদাহরণটিতে লক্ষ্য করুন, কোনো টেবিলের তথ্য ব্যবহার না করলে আমাদের `FROM` ব্লকের কোনো প্রয়োজন হয় না।

<sql-exercise
  data-question="৫০ এবং ৫১-কে ২ দিয়ে ভাগ করতে কুয়েরিটি পরিবর্তন করুন।"
  data-en-question="Modify the query to divide 50 and 51 by 2."
  data-comment="এসকিউএল সমস্ত প্রচলিত গাণিতিক ক্রিয়া সমর্থন করে।"
  data-default-text="SELECT 50 + 2, 51 * 2"
  data-solution="SELECT 50 / 2, 51 / 2"></sql-exercise>

`51 / 2` এর ফলাফল `25.5` না হয়ে `25` হওয়া কি অদ্ভুত মনে হচ্ছে না? এর কারণ এসকিউএল এখানে পূর্ণসংখ্যার ভাগ (integer division) সম্পন্ন করছে। দশমিকের ভাগ করতে হলে অন্তত একটি সংখ্যাকে দশমিক হতে হবে, যেমন `51.0 / 2`। কোনো সংখ্যাকে দশমিকে রূপান্তর করার একটি প্রচলিত কৌশল হলো সেটিকে `1.0` দিয়ে গুণ করা। পরবর্তী অধ্যায়গুলোতে এই কৌশলটি আমাদের কাজে লাগবে।

<a name="capitalization"></a>
<div class="sideNote">
  <h3>ক্যাপিটালাইজেশন বা বড় হাতের অক্ষর</h3>
  <p>যদিও আমরা <code>SELECT</code>, <code>FROM</code> এবং <code>LIMIT</code> বড় হাতের অক্ষরে (capitalize করে) লিখেছি, তবে এসকিউএল কমান্ডগুলো কেস-সেন্সিটিভ (case-sensitive) নয় অর্থাৎ বড় বা ছোট হাতের অক্ষরে কোনো পার্থক্য নেই। আপনি দেখতে পাবেন, কোড এডিটর এগুলোকে শনাক্ত করতে পারে এবং যেকোনো আকারের অক্ষরে লিখলেও সেগুলোকে কমান্ড হিসেবেই ফরম্যাট করে। তা সত্ত্বেও, কলামের নাম, টেবিলের নাম ও ভ্যারিয়েবল থেকে আলাদা করে চেনার সুবিধার জন্য এসকিউএল কিওয়ার্ডগুলোকে বড় হাতের অক্ষরে লেখার পরামর্শ দেওয়া হয়।</p>
  <p>এসকিউএল-এর এই সংস্করণে কলামের নাম, টেবিলের নাম ও ভ্যারিয়েবলগুলোও কেস-সেন্সিটিভ নয়, যদিও অন্যান্য অনেক সংস্করণে এগুলো কেস-সেন্সিটিভ হয়ে থাকে। তাই নিরাপদ থাকতে সবসময় সেগুলোকে কেস-সেন্সিটিভ হিসেবে ধরে নেওয়াই উত্তম অভ্যাস।</p>
</div>

<a name="whitespace"></a>
<div class="sideNote">
  <h3>হোয়াইটস্পেস বা ফাঁকা জায়গা</h3>
  <p>হোয়াইটস্পেস বলতে স্পেস (space), ট্যাব (tab), লাইনব্রেক (linebreak) এবং পৃষ্ঠায় খালি স্থান তৈরি করে এমন অক্ষরগুলোকে বোঝায়। অক্ষরের আকারের মতো এসকিউএল হোয়াইটস্পেসের ক্ষেত্রেও খুব একটা সংবেদনশীল নয়, যদি না আপনি দুটি ভিন্ন শব্দকে জোড়া লাগিয়ে দেন। এর মানে হলো প্রতিটি কমান্ডের চারপাশে অন্তত একটি ফাঁকা অক্ষর থাকলেই চলে — আপনি কোনটি ব্যবহার করছেন বা কতটা ফাঁকা রাখছেন তা বড় বিষয় নয়। তবে সংক্ষিপ্ত কুয়েরি ছাড়া অন্যান্য ক্ষেত্রে পাঠযোগ্যতা বজায় রাখতে প্রতিটি কমান্ডকে নতুন লাইনে লেখাই ভালো উপায়।</p>

<sql-exercise
  data-question="অক্ষরের আকার (capitalization) এবং ফাঁকা জায়গা (whitespace) এলোমেলো করলেও যে কুয়েরিটি সঠিকভাবে কাজ করে তা যাচাই করুন।"
  data-en-question="Verify that messing up capitalization and whitespace still gives a valid query."
  data-comment="কার্লা টাকার (Karla Tucker) ছিলেন গৃহযুদ্ধের পর টেক্সাসে মৃত্যুদণ্ড কার্যকর হওয়া প্রথম নারী। ১৯৮৩ সালের একটি ডাকাতির ঘটনায় দুজনকে হত্যার দায়ে তাঁকে মৃত্যুদণ্ড দেওয়া হয়েছিল।"
  data-default-text="   SeLeCt   first_name,last_name
  fRoM      executions
           WhErE ex_number = 145"></sql-exercise>
</div>

<br>
<a name="where"></a>
## WHERE ব্লক
`WHERE` ব্লক আমাদের নির্দিষ্ট শর্ত পূরণকারী সারিগুলোকে ফিল্টার বা বাছাই করার সুযোগ দেয়। এর গঠন হলো <code class='codeblock'>WHERE &lt;clause&gt;</code> এবং এটি সর্বদা `FROM` ব্লকের পরে বসে। এখানে ক্লজ (clause) বলতে একটি বুলিয়ান স্টেটমেন্টকে বোঝায় যা কম্পিউটার সত্য (true) বা মিথ্যা (false) হিসেবে মূল্যায়ন করতে পারে, যেমন <code>ex_number = 145</code>। আপনি কল্পনা করতে পারেন যে কম্পিউটার টেবিলের প্রতিটি সারির মধ্য দিয়ে যাবে এবং পরীক্ষা করে দেখবে ক্লজটি সত্য কি না; আর সত্য হলে সেই সারিটিকে ফলাফলে প্রদান করবে।

<sql-exercise
  data-question="মৃত্যুদণ্ড কার্যকরের সময় যাদের বয়স ২৫ বছর বা তার কম ছিল এমন আসামিদের প্রথম নাম, শেষ নাম এবং বয়স (ex_age) খুঁজে বের করুন।"
  data-en-question="Find the first and last names and ages (ex_age) of inmates who were 25 or younger at the time of execution."
  data-comment="মৃত্যুদণ্ড কার্যকরের আগে আসামিরা গড়ে ১০.২৬ বছর কারাগারে মৃত্যু সারিতে (death row) কাটায়। ফলে ১৯৭৬ সালের পর থেকে টেক্সাসে এত অল্প বয়সে মৃত্যুদণ্ড কার্যকর হওয়া আসামির সংখ্যা মাত্র ৬ জন।"
  data-default-text=""
  data-solution="SELECT first_name, last_name, ex_age
FROM executions WHERE ex_age <= 25"></sql-exercise>

শর্ত বা ক্লজ তৈরির ক্ষেত্রে গাণিতিক অপারেটর যেমন `<` এবং `<=` কীভাবে ব্যবহার করতে হয় তা স্পষ্ট। এছাড়াও টেক্সট বা স্ট্রিং (string) নিয়ে কাজ করার জন্য বেশ কিছু স্ট্রিং অপারেটর রয়েছে।

এদের মধ্যে সবচেয়ে শক্তিশালী হলো <code>LIKE</code>। এটি আমাদের ওয়াইল্ডকার্ড (wildcard) যেমন `%` এবং `_` ব্যবহার করে বিভিন্ন অক্ষরের প্যাটার্ন মেলাতে সাহায্য করে। উদাহরণস্বরূপ, `first_name LIKE '%roy'` সেই সমস্ত সারির ক্ষেত্রে সত্য (true) হবে যেগুলোর প্রথম নাম 'roy', 'Troy' কিংবা 'Deroy', কিন্তু 'royman'-এর ক্ষেত্রে সত্য হবে না। আবার `_` ওয়াইল্ডকার্ডটি কেবল একটিমাত্র অক্ষরের সাথে মেলে, তাই `first_name LIKE '_roy'` কেবলমাত্র 'Troy'-এর সাথেই মিলবে।

<sql-exercise
    data-question="রেমন্ড ল্যান্ড্রির (Raymond Landry) তথ্য পাওয়ার জন্য কুয়েরিটি পরিবর্তন করুন।"
    data-en-question="Modify the query to find the result for Raymond Landry."
    data-comment="আপনার মনে হতে পারে যে এটি খুবই সহজ, কারণ আমরা ইতিমধ্যেই তাঁর প্রথম এবং শেষ নাম জানি। কিন্তু বাস্তব জীবনের ডেটাসেট কদাচিৎ এত নিখুঁত থাকে। LIKE অপারেটরটি ব্যবহার করুন যাতে তাঁর নামের বানান হুবহু না জেনেও সারিটি খুঁজে পাওয়া যায়।"
    data-default-text="SELECT first_name, last_name, ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name = 'Landry'"
    data-solution="SELECT first_name, last_name, ex_number
FROM executions
WHERE first_name = 'Raymond'
  AND last_name LIKE '%Landry%'"></sql-exercise>

<a name="quotes"></a>
<div class="sideNote">
  <h3>কোটেশন বা উদ্ধৃতি চিহ্ন</h3>
  <p>এসকিউএল-এ টেক্সট বা স্ট্রিং চিহ্নিত করতে একক উদ্ধৃতি চিহ্ন বা সিঙ্গেল কোট (single quote) ব্যবহৃত হয়। কলাম বা টেবিলের নাম নির্দেশ করতে ব্যাকটিক (অর্থাৎ <code>`</code>) ব্যবহার করা যেতে পারে। যখন কোনো কলাম বা টেবিলের নাম এসকিউএল-এর নিজস্ব কোনো কিওয়ার্ডের সমান হয়ে যায় কিংবা নামের মধ্যে ফাঁকা জায়গা থাকে, তখন ব্যাকটিক বিশেষভাবে কাজে আসে। কোনো ডেটাবেজে 'where' নামে টেবিল এবং 'from' নামে কলাম থাকা সম্পূর্ণ সম্ভব। (এমন বিভ্রান্তিকর কাজ কে-ই বা করতে যাবে?!) সেক্ষেত্রে আপনাকে লিখতে হবে <code>SELECT `from` FROM `where` WHERE ...</code>। এসকিউএল কমান্ডগুলোকে কেন বড় হাতের অক্ষরে লেখা উচিত, এটি তার আরেকটি উপযুক্ত প্রমাণ।</p>
</div>

আগের অনুশীলনে যেমনটি দেখেছেন, বুলিয়ান অপারেটর যেমন `NOT`, `AND` এবং `OR` ব্যবহার করে একাধিক সাধারণ শর্তকে যুক্ত করে জটিল ক্লজ তৈরি করা যায়। এসকিউএল মূল্যায়নের ক্ষেত্রে সবচেয়ে বেশি অগ্রাধিকার দেয় `NOT`-কে, তারপর `AND` এবং সবশেষে `OR`। তবে আমার মতো আপনিও যদি অগ্রাধিকারের এই ক্রম মনে রাখতে অলসতা বোধ করেন, তবে প্রথম বন্ধনী (parenthesis) ব্যবহার করে আপনার কাঙ্ক্ষিত ক্রমটি সুনির্দিষ্ট করে দিতে পারেন।

<sql-exercise
  data-question="এই স্টেটমেন্টটি যেন ০ প্রদান করে সেজন্য এক জোড়া প্রথম বন্ধনী যুক্ত করুন।"
  data-en-question="Insert a pair of parentheses so that this statement returns 0."
  data-comment="এখানে আমরা এই তথ্যের ওপর নির্ভর করছি যে ১ মানে সত্য (true) এবং ০ মানে মিথ্যা (false)।"
  data-default-text="SELECT 0 AND 0 OR 1"
  data-solution="SELECT 0 AND (0 OR 1)"
  ></sql-exercise>

আপনার বোঝাপড়া পাকাপোক্ত করতে এবার একটি দ্রুত কুইজে অংশ নেওয়া যাক।

<sql-quiz
  data-title="সঠিক ক্লজযুক্ত <code>WHERE</code> ব্লকগুলো নির্বাচন করুন।"
  data-en-title="Select the <code>WHERE</code> blocks with valid clauses."
  data-description="এগুলো কিছুটা সূক্ষ্ম ও বিভ্রান্তিকর হতে পারে। আপনি সঠিকভাবে অনুমান করতে পারলেও এর পেছনের কারণটি বুঝতে প্রতিটি ব্যাখ্যা ভালো করে পড়ুন।"
  data-en-description="These are tricky. Even if you've guessed correctly, read the explanations to understand the reasoning.">
  <sql-quiz-option
    data-value="bool_literal"
    data-statement="WHERE 0"
    data-hint="<code>1</code> এবং <code>0</code> হলো সবচেয়ে মৌলিক বুলিয়ান স্টেটমেন্ট। এই ব্লকটি নিশ্চিত করে যে কোনো সারিই পাওয়া যাবে না।"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="python_equal"
    data-statement="WHERE ex_age == 62"
    data-hint="অন্যান্য অনেক প্রোগ্রামিং ভাষায় <code>==</code> অপারেটর দিয়ে সমতা যাচাই করা হলেও এসকিউএল-এ কেবল <code>=</code> ব্যবহৃত হয়।"
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="column_comparison"
    data-statement="WHERE ex_number < ex_age"
    data-hint="একটি শর্ত বা ক্লজে একাধিক কলামের নাম ব্যবহার করা যেতে পারে।"
    data-correct="true"></sql-quiz-option>
  <sql-quiz-option
    data-value="greaterthan_orequal"
    data-statement="WHERE ex_age => 62"
    data-hint="'বড় অথবা সমান' অপারেটরটি হলো <code>>=</code>। চিহ্নের ক্রমটি ইংরেজিতে উচ্চারণের ক্রমের সাথে মেলে।"
    ></sql-quiz-option>
  <sql-quiz-option
    data-value="int_column"
    data-statement="WHERE ex_age"
    data-hint="এসকিউএল প্রায় যেকোনো মানের সত্যতা বা মিথ্যাত্ব মূল্যায়ন করতে পারে। 'ex_age' কলামটিতে পূর্ণসংখ্যা রয়েছে। পূর্ণসংখ্যার ক্ষেত্রে নিয়ম হলো ০ মিথ্যা এবং অন্য সবকিছুই সত্য; ফলে কেবল শূন্য নয় এমন বয়সের সারিগুলোই প্রদর্শিত হবে।"
    data-correct="true"
    ></sql-quiz-option>
   <sql-quiz-option
    data-value="like_order"
    data-statement="WHERE '%obert%' LIKE first_name"
    data-hint="একাধিক ওয়াইল্ডকার্ড ব্যবহার করা কোনো সমস্যা নয়। তবে প্যাটার্নটিকে অবশ্যই LIKE অপারেটরের পরে বসাতে হবে।"
    ></sql-quiz-option>
    </sql-quiz>

এখন আমাদের মূল কাজটি সম্পন্ন করার জন্য প্রয়োজনীয় সমস্ত হাতিয়ার আপনার কাছে রয়েছে।
<sql-exercise
  data-question="নেপোলিয়ন বিজলির শেষ জবানবন্দিটি খুঁজে বের করুন।"
  data-en-question="Find Napoleon Beazley's last statement."
  data-default-text=""
  data-solution="SELECT last_statement
FROM executions
WHERE first_name = 'Napoleon'
  AND last_name = 'Beazley'"></sql-exercise>

বিজলির বক্তব্য কতটা গভীর এবং প্রাঞ্জল ছিল তা ভেবে কি অবাক লাগে না? মনে রাখবেন, এই জবানবন্দি দেওয়ার সময় তাঁর বয়স ছিল মাত্র ২৫ বছর এবং ১৮ বছর বয়স থেকেই তিনি কারাগারে বন্দি ছিলেন।

<br>
<a name="#recap"></a>
## সারসংক্ষেপ
এই অধ্যায়ের মূল উদ্দেশ্য ছিল অত্যন্ত মৌলিক অথচ শক্তিশালী গঠন <code class="codeblock">SELECT &lt;column&gt; FROM &lt;table&gt; WHERE &lt;clause&gt;</code>-এর সাথে পরিচয় করিয়ে দেওয়া। এটি কম্পিউটারকে সারির পর সারি পরীক্ষা করিয়ে যেগুলোর জন্য `WHERE` ক্লজটি সত্য হয় কেবল সেগুলোকে বাছাই করে নেওয়ার মাধ্যমে একটি টেবিল ফিল্টার করার সুবিধা দেয়। এছাড়া আমরা শিখেছি কীভাবে বেশ জটিল শর্ত তৈরি করে টেক্সট বা স্ট্রিং, সংখ্যা এবং বুলিয়ান মানসম্পন্ন কলামগুলোর ওপর কাজ করা যায়।

এ পর্যন্ত আমরা সারি-পর্যায়ে (row-level) কাজ করেছি, যা আমাদের কেবল একক উপাত্ত বিন্দুগুলো দেখার মধ্যেই সীমাবদ্ধ রেখেছে। পরবর্তী অধ্যায়ে আমরা এগ্রিগেশন (aggregations) বা সামগ্রিক হিসাবের ওপর জোর দেব, যা আমাদের বৃহৎ ও পদ্ধতিগত বিষয়াদি বিশ্লেষণ করতে সহায়তা করবে।
