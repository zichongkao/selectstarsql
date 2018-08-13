---
layout: tutorial
title: Front Matter
---

<a name="impetus"></a>
## Impetus
When I was a data scientist at Quora, I used to have people ask me for resources for learning SQL. I struggled to find something I could stand behind because I felt that a good resource had to be free, not require registration, and care about pedagogy &mdash; it had to genuinely care about its users and there was nothing like that around.

By overcoming some minor <a href="#technicals">technical hurdles</a>, I believe that **Select Star SQL** has met this standard. My hope is that like <a href='http://learnyouahaskell.com/chapters'>Learn You a Haskell for Great Good!</a> and <a href='https://beautifulracket.com'>Beautiful Racket</a> have done for Haskell and Racket, **Select Star SQL** will become the best place on the internet for learning SQL.

<br>
<a name="pedagogy"></a>
## Pedagogy
These principles have guided the design of this tutorial:
   - <p><strong>Programming is best learnt by doing.</strong><br>
     A high proportion of the material consists of exercises, and struggling with them should occupy most of your time.</p>
   - <p><strong>Exercises should be realistic and substantial.</strong><br>
     To quote <a href="https://www.fastcompany.com/40435064/what-alan-kay-thinks-about-the-iphone-and-technology-now">Alan Kay</a>: "You never let [the learner] do something that isn’t the real thing&mdash;but you have to work your ass off to figure out what the real thing is in the context of the way their minds are working at that developmental level."</p>
     <p>Likewise, the exercises here have been designed to introduce increasingly sophisticated SQL techniques while exploring the dataset in ways that people would actually be interested in.</p>
   - <p><strong>Learning to program is learning a mental model</strong><br>
     Our goal here isn't to learn the rules for how to use <code>GROUP BY</code> or when to pick a <code>LEFT JOIN</code> over an <code>INNER JOIN</code>. We know we've been successful if after writing a SQL query, you can close your eyes and imagine what the computer would do and what output it would give. Only then will you be able to solve real world problems with SQL.

<br>
<a name="dataset"></a>
## Dataset
Our dataset documents Texas death row inmates executed from 1976, when the Supreme Court reinstated the death penalty, to the present. It was extracted from the <a href='https://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html'>Texas Department of Criminal Justice</a> website using automatic means where possible. However, much of the pre-1995 data is only available as images of physical documents and these required painstaking manual extraction.

The raw data is available as a csv for <a href="data/dataset.csv">download</a>. It is probably the most complete set of Texas death row data on the internet.

On one level, the data is simply a part of a mundane programming tutorial. On another, each row represents immense suffering, lives lost, and in some cases redemption and acceptance. In preparing for this dataset, I was deeply moved by a number of the statements and found myself re-evaluting my position on capital punishment. I hope that as we examine the data, you too will contemplate the deeper issues at play.

<br>
<a name="technicals"></a>
## Technicals
   - <p><strong>Client-side Databases</strong>. One of the challenges of making this site free was to avoid paying for web hosting. But to give users a hands-on experience with a database (see <a href="#pedagogy">Pedagogy</a>), one would have to host and pay for a proper backend. Thankfully, client-side databases exist. This allows me to use <a href="https://pages.github.com">Github Pages'</a> free static page hosting and have the pages run a SQLite database on the user's browser. Alon Zakai and others made this possible by <a href="https://github.com/kripken/sql.js">porting the SQLite C code into Javascript using Emscripten</a>.</p>
   - <p><strong>Matthew Butterick</strong>. I met Matthew at the <a href="https://summer-school.racket-lang.org/2018/">Racket Summer School</a> and was blown away by the great work he's done on <a href="http://beautifulracket.com">Beautiful Racket</a> and <a href="http://practicaltypography.com">Practical Typography</a>. As you can tell, I borrowed a ton of design ideas from there.</p>
   - <p><strong>Jekyll</strong>. If not for <a href="https://jekyllrb.com/">Jekyll</a>, I would have ended up writing all the html by hand. Thank goodness for it.</p>
   - <p><strong>Web Components</strong>. I was able to reuse a lot of code by writing the exercise and quiz components as <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">custom html tags</a>. It's a relatively new development as I understand, and I hope that W3C continues to push for broader adoption.</p>

<br>
<a name="contact"></a>
## Contact
For corrections and suggestions, please write me (Kao) at zichongkao@gmail.com.

You can find out more about me at <a href="http://kaomorphism.com">Kaomorphism</a>.
