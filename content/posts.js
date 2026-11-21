const POSTS=[
{slug:'learn-programming-in-6-months',title:'How to learn programming in 6 months: a realistic plan',desc:'A month-by-month plan that takes you from zero to building real projects, using free resources.',date:'2026-10-18',read:4,body:`
<p>You do not need a degree or expensive software to learn programming. With about six hours a week and a clear order of topics, six months is enough to build real projects. Here is a plan that works for most beginners.</p>
<h2>The plan</h2>
<ol>
<li><strong>Month 1:</strong> learn <a href="/courses/html">HTML</a>, <a href="/courses/css">CSS</a> and the basics of <a href="/courses/js">JavaScript</a>. Build a personal page.</li>
<li><strong>Month 2:</strong> go deeper into JavaScript. Make a to-do app and a small calculator.</li>
<li><strong>Month 3:</strong> learn <a href="/courses/git">Git and GitHub</a> and publish your projects online.</li>
<li><strong>Month 4:</strong> pick <a href="/courses/python">Python</a> or a framework such as React. Practice problems on the <a href="/challenges">coding challenges</a> page each week.</li>
<li><strong>Month 5:</strong> learn <a href="/courses/sql">SQL</a> and build an app that stores data.</li>
<li><strong>Month 6:</strong> build one bigger project, write about it, and start applying for internships or freelance work.</li>
</ol>
<h2>Habits that matter more than talent</h2>
<ul>
<li>Write code every day, even for 20 minutes.</li>
<li>Build small things instead of only watching tutorials.</li>
<li>Stay with one resource until you finish it. Hopping between courses is the most common way to stall.</li>
<li>Ask for help early, and read other people's code on GitHub.</li>
</ul>
<p>Ready to begin? <a href="/lessons/html-1">Start the first HTML lesson</a>. It runs right in your browser.</p>`},
{slug:'html-css-javascript-explained',title:'HTML, CSS and JavaScript: what each one does',desc:'A plain-language explanation of the three core web technologies, with examples you can try.',date:'2026-10-18',read:3,body:`
<p>Every website you visit is built from three languages that work together. Think of a house.</p>
<h2>HTML is the structure</h2>
<p>HTML describes what is on the page: headings, paragraphs, links, images and forms. It is the walls and rooms of the house. Try it in the <a href="/lessons/html-1">first HTML lesson</a>.</p>
<h2>CSS is the style</h2>
<p>CSS controls how things look: colors, spacing, fonts and layout. It is the paint, furniture and decoration. Learn it in <a href="/lessons/css-1">CSS selectors and color</a>.</p>
<h2>JavaScript is the behaviour</h2>
<p>JavaScript makes the page react: menus that open, buttons that count, forms that check your input. It is the electricity and plumbing. Start with <a href="/lessons/js-1">variables and output</a>.</p>
<h2>How to learn them</h2>
<p>Learn them in this order: <strong>HTML, then CSS, then JavaScript</strong>. After each lesson, change the code and see what happens. Breaking things on purpose is a great way to learn.</p>`},
{slug:'python-or-javascript-first',title:'Python or JavaScript first? How to choose',desc:'Both are great first languages. Here is how to pick based on what you want to build.',date:'2026-10-18',read:3,body:`
<p>This is the most common beginner question, and the honest answer is that either one is a good choice. Pick based on your goal.</p>
<h2>Choose JavaScript if you want to build websites</h2>
<p>JavaScript runs in every browser, so you can see your results instantly. If you want to make websites and web apps, learn <a href="/courses/html">HTML</a>, <a href="/courses/css">CSS</a> and <a href="/courses/js">JavaScript</a> together.</p>
<h2>Choose Python if you want data, automation or AI</h2>
<p>Python reads almost like English, which makes it gentle for beginners. It is the main language for data science, machine learning and automating boring tasks. Start with <a href="/courses/python">Python programming</a>.</p>
<h2>Not sure? Try both for a week</h2>
<p>Spend a few days on each using the <a href="/playground">playground</a>, then continue with whichever one you enjoy more. The ideas you learn, such as variables, loops and functions, carry over to every other language.</p>`},
{slug:'debugging-for-beginners',title:'Debugging for beginners: a 6-step routine',desc:'A calm, repeatable way to find and fix bugs in your code, plus the most common mistakes beginners make.',date:'2026-10-18',read:4,body:`
<p>Every programmer writes bugs. What separates beginners from confident developers is not fewer bugs, it is a routine for finding them. Here is one you can use today.</p>
<h2>The routine</h2>
<ol>
<li><strong>Read the error message.</strong> Start at the last line. It usually names the problem and the line number.</li>
<li><strong>Reproduce it.</strong> Find the smallest input that breaks your code every time.</li>
<li><strong>Isolate it.</strong> Comment out parts until the bug disappears. The last part you removed is the suspect.</li>
<li><strong>Look at the values.</strong> Print variables with <code>console.log</code> or <code>print</code> and compare them with what you expected.</li>
<li><strong>Change one thing at a time.</strong> If you change five things, you will not know which one fixed it.</li>
<li><strong>Explain it out loud.</strong> Describing the code line by line to a friend, or a rubber duck, often reveals the mistake.</li>
</ol>
<h2>Common beginner bugs</h2>
<ul><li>A typo in a name, or a missing bracket or quote.</li><li>An off-by-one mistake, such as starting a loop at 1 instead of 0.</li><li>Using the wrong operator, like <code>&gt;</code> instead of <code>&gt;=</code>.</li><li>Forgetting to <code>return</code> a value, or returning too early.</li></ul>
<p>Practice on purpose: our <a href="/challenges">debug challenges</a> give you broken code to repair, with instant feedback.</p>`},
{slug:'how-to-prepare-for-coding-tests',title:'How to prepare for coding tests and interviews',desc:'A simple plan for exams and interviews: what to practice, how often, and how to think out loud.',date:'2026-10-18',read:4,body:`
<p>Coding tests reward practice more than talent. A few weeks of steady, focused work can change your results a lot.</p>
<h2>A weekly plan</h2>
<ul>
<li><strong>Two short quizzes</strong> on the <a href="/practice">practice tests</a> page. Review every wrong answer.</li>
<li><strong>Three small problems</strong> from the <a href="/challenges">challenges</a>. Aim to solve them without looking up the answer.</li>
<li><strong>One topic revision</strong> from the <a href="/courses/dsa">data structures course</a>.</li>
</ul>
<h2>During the test</h2>
<ol><li>Read the question twice and restate it in your own words.</li><li>Try a tiny example by hand first.</li><li>Write a simple solution that works, then improve it.</li><li>Test with edge cases: an empty list, one item, negative numbers.</li><li>Say your thinking out loud in interviews. Interviewers want to see how you reason.</li></ol>
<p>Stuck on a concept? The <a href="/cheatsheets">cheat sheets</a> are a fast refresher.</p>`},
{slug:'learn-react-after-javascript',title:'Should you learn React before JavaScript?',desc:'Why a few weeks of JavaScript first makes React much easier, and exactly which skills to have before you start.',date:'2026-10-18',read:3,body:`
<p>Many beginners jump straight into React because job ads mention it. It almost always goes better if you learn core JavaScript first. React is JavaScript, so gaps show up everywhere.</p>
<h2>What to know before React</h2>
<ul><li>Functions and arrow functions.</li><li>Arrays, especially <code>map</code> and <code>filter</code>.</li><li>Objects and destructuring.</li><li>Events and how the DOM works.</li></ul>
<h2>Ready?</h2>
<p>If those feel comfortable, start the <a href="/courses/react">React course</a>. Each lesson runs live in your browser, from your first component to forms and state. If something feels shaky, revisit <a href="/courses/js">JavaScript essentials</a> first. It is time well spent.</p>`},
{slug:'security-habits-for-beginner-developers',title:'Seven security habits every beginner developer needs',desc:'Simple habits that protect your users, your accounts and your projects from the most common attacks.',date:'2026-10-18',read:4,body:`
<p>Security is not only for experts. A few habits will protect you and your users from most everyday problems.</p>
<ol>
<li><strong>Never commit secrets.</strong> Keep API keys and passwords out of your code and your Git history. Use environment variables.</li>
<li><strong>Use strong, unique passwords</strong> and a password manager.</li>
<li><strong>Turn on two-factor authentication</strong> for GitHub and your email.</li>
<li><strong>Never trust user input.</strong> Use parameterised queries to prevent SQL injection.</li>
<li><strong>Hash passwords.</strong> Never store them as plain text.</li>
<li><strong>Use HTTPS</strong> everywhere so data is encrypted in transit.</li>
<li><strong>Keep dependencies updated.</strong> Old packages often contain known flaws.</li>
</ol>
<p>Want to go deeper? Try the beginner-friendly rooms in our <a href="/courses/thm">cybersecurity basics course</a>, and test yourself in the security <a href="/practice">practice quiz</a>.</p>`}

];
