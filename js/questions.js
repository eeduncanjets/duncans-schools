/* Practice-test question bank. In each Q(...) the FIRST option is the correct one; the page shuffles them.
   Q(question, correct, wrong1, wrong2, explanation) */
const Q=(q,a,b,c,e)=>({q,o:[a,b,c],a:0,e});
const QBANK={
html:{title:'HTML',q:[
 Q('Which tag defines a hyperlink?','<a>','<link>','<href>','The <a> element with an href attribute creates a link.'),
 Q('What is alt text on an image mainly for?','Screen readers and missing images','Page speed','Image color','Alt text describes the image when it cannot be seen.'),
 Q('Which is the correct HTML5 doctype?','<!DOCTYPE html>','<!HTML5>','<html version="5">','HTML5 uses the short doctype declaration.'),
 Q('Which element holds the visible page content?','<body>','<head>','<meta>','<head> holds information about the page; <body> holds what people see.'),
 Q('Which attribute makes a form field mandatory?','required','needed','must','The required attribute stops the form submitting when the field is empty.'),
 Q('Which tag is best for the main navigation links?','<nav>','<menu-bar>','<links>','<nav> is a semantic element that screen readers can find.')]},
css:{title:'CSS',q:[
 Q('Which property changes text color?','color','font-color','text-color','color sets the text color.'),
 Q('What does margin: 0 auto do on a block with a set width?','Centers it horizontally','Removes it','Hides it','Equal automatic left and right margins center the block.'),
 Q('Which unit is relative to the root font size?','rem','px','pt','rem is based on the root element font size.'),
 Q('Which selector has the highest priority?','#id','.class','element','IDs outrank classes, which outrank element selectors.'),
 Q('Which property controls stacking order?','z-index','layer','stack','Higher z-index values appear on top of positioned elements.'),
 Q('What does box-sizing: border-box do?','Includes padding and border in the width','Adds a border','Removes padding','Width then covers content, padding and border together.')]},
js:{title:'JavaScript',q:[
 Q('Which prints to the browser console?','console.log()','print()','echo()','console.log writes messages to the console.'),
 Q('What does typeof null return?','"object"','"null"','"undefined"','This is a famous historic quirk of JavaScript.'),
 Q('Which operator checks value and type?','===','==','=','=== is strict equality; = assigns a value.'),
 Q('Which array method keeps only items that pass a test?','filter','map','reduce','filter returns a new array of matching items.'),
 Q('What is the result of "5" + 3 ?','"53"','8','NaN','With a string, + joins text instead of adding numbers.'),
 Q('Which keyword declares a variable that can be reassigned?','let','const','import','const cannot be reassigned; let can.')]},
python:{title:'Python',q:[
 Q('Which creates a list?','[1, 2, 3]','(1, 2, 3)','{1, 2, 3}','Square brackets make a list.'),
 Q('What does len("tech") return?','4','3','5','len counts the characters.'),
 Q('Which keyword starts a loop over items?','for','loop','each','for item in items: visits every item.'),
 Q('What is 10 // 3 in Python?','3','3.33','4','// is floor division and drops the remainder.'),
 Q('How do you write a comment?','# a note','// a note','-- a note','Python comments start with #.'),
 Q('Which is a dictionary?','{"a": 1}','["a", 1]','("a", 1)','Dictionaries use curly braces with key: value pairs.')]},
sql:{title:'SQL',q:[
 Q('Which clause filters groups after GROUP BY?','HAVING','WHERE','FILTER','WHERE filters rows before grouping; HAVING filters groups.'),
 Q('Which keyword removes duplicate rows?','DISTINCT','UNIQUE ONLY','SINGLE','SELECT DISTINCT returns each different row once.'),
 Q('Which statement adds a new row?','INSERT INTO','ADD ROW','PUSH','INSERT INTO table VALUES (...) adds a row.'),
 Q('What does SELECT COUNT(*) return?','The number of rows','The first row','The column names','COUNT(*) counts rows.'),
 Q('Which JOIN keeps every row from the left table?','LEFT JOIN','INNER JOIN','CROSS JOIN','LEFT JOIN keeps unmatched left rows too.'),
 Q('Which wildcard matches any text in LIKE?','%','*','?','LIKE "a%" matches text starting with a.')]},
git:{title:'Git',q:[
 Q('Which command copies a remote repository?','git clone','git copy','git fetchall','git clone downloads a repository and its history.'),
 Q('Which command shows what has changed?','git status','git show-all','git look','git status lists changed and staged files.'),
 Q('What does git pull do?','Fetches and merges remote changes','Deletes a branch','Uploads your code','pull brings new commits from the remote.'),
 Q('Which command lists branches?','git branch','git list','git branches','git branch shows local branches.'),
 Q('What is a commit?','A saved snapshot of your project','A remote server','A file type','Commits record the state of your files.'),
 Q('Which file lists files Git should ignore?','.gitignore','.ignore-git','git.skip','.gitignore keeps secrets and build files out of Git.')]},
linux:{title:'Linux',q:[
 Q('What does ls -a show?','Hidden files too','Only folders','Sizes in MB','-a includes names that start with a dot.'),
 Q('Which command prints a file to the screen?','cat','show','print','cat displays file contents.'),
 Q('What does sudo do?','Runs a command as administrator','Deletes a file','Lists users','sudo gives temporary admin rights.'),
 Q('Which symbol sends output into a file?','>','<','|','> redirects output; | pipes it to another command.'),
 Q('Which command shows running processes?','ps','runlist','jobs-all','ps lists processes.'),
 Q('What does cd .. do?','Moves up one folder','Creates a folder','Goes home','.. means the parent folder.')]},
net:{title:'Networking',q:[
 Q('Which HTTP status code means "not found"?','404','200','500','404 means the server could not find the page.'),
 Q('What is an IP address?','A number that identifies a device on a network','A website name','A password','IP addresses let devices find each other.'),
 Q('Which port does HTTPS use by default?','443','80','21','HTTP uses 80 and HTTPS uses 443.'),
 Q('What does a browser do first with a domain name?','Looks it up using DNS','Downloads images','Encrypts it','DNS turns the name into an IP address.'),
 Q('Which protocol is mainly used to send email?','SMTP','FTP','SSH','SMTP sends mail between servers.'),
 Q('What does latency measure?','Delay','File size','Storage','Latency is the time a message takes to travel.')]},
react:{title:'React',q:[
 Q('What is JSX?','HTML-like syntax inside JavaScript','A database','A CSS tool','JSX lets you describe UI in JavaScript files.'),
 Q('Which hook stores changing data in a component?','useState','useData','useStore','useState returns a value and a setter.'),
 Q('How do you pass data into a component?','Props','Cookies','Imports only','Props are the inputs of a component.'),
 Q('Why do list items need a key?','React tracks which items changed','To style them','To sort them','Keys help React update lists efficiently.'),
 Q('Component names must start with...','A capital letter','A number','An underscore','Capitalised names tell React it is a component.'),
 Q('Which hook runs code after rendering?','useEffect','useAfter','useLoad','useEffect handles side effects.')]},
node:{title:'Node.js',q:[
 Q('What is Node.js?','A JavaScript runtime outside the browser','A CSS framework','A database','Node runs JavaScript on servers and computers.'),
 Q('Which file lists a project\'s dependencies?','package.json','node.config','modules.txt','package.json records name, scripts and dependencies.'),
 Q('Which command installs a package?','npm install','node get','npm fetch','npm install downloads packages.'),
 Q('What does Express do?','Simplifies building web servers','Compiles CSS','Stores data','Express adds routing and middleware.'),
 Q('Which built-in module reads files?','fs','http-files','io','fs is the file system module.'),
 Q('What is middleware in Express?','A function that runs between request and response','A database','A CSS file','Middleware can log, check logins or parse data.')]},
dsa:{title:'Data structures',q:[
 Q('What is the Big-O of binary search?','O(log n)','O(n)','O(1)','Each step halves the search space.'),
 Q('Which structure is first in, first out?','Queue','Stack','Tree','A queue serves items in arrival order.'),
 Q('Which structure is last in, first out?','Stack','Queue','Array','A stack gives back the newest item first.'),
 Q('What is the Big-O of looping once over n items?','O(n)','O(1)','O(n squared)','Work grows in step with n.'),
 Q('Which structure maps keys to values with fast lookup?','Hash table','Linked list','Stack','Hash tables find values by key quickly.'),
 Q('Binary search requires the list to be...','Sorted','Reversed','Unique','It only works when items are in order.')]},
security:{title:'Security basics',q:[
 Q('What is phishing?','Tricking people into giving up information','A type of firewall','A coding language','Phishing uses fake messages or sites to steal details.'),
 Q('What makes a strong password?','Long and unique','Your birthday','Short and simple','Length and uniqueness matter most.'),
 Q('What does HTTPS protect?','Data travelling between you and the site','Your hard drive','Your screen','TLS encrypts data in transit.'),
 Q('What is SQL injection?','Sending malicious SQL through an input','A database backup','A faster query','Parameterised queries prevent it.'),
 Q('What does two-factor authentication add?','A second proof of identity','A longer password only','Faster login','A code or key is needed besides the password.'),
 Q('What is the safest way to store passwords?','Hashed with a salt','Plain text','Encrypted with a key in the code','Hashes cannot be reversed easily.')]}
};


/* Expanded course assessments: every course receives a 40-question pool. */
(function(){
 const courseNames={html:'HTML',css:'CSS',js:'JavaScript',react:'React',node:'Node.js',ts:'TypeScript',python:'Python',java:'Java',c:'C',cpp:'C++',cs50:'Computer Science',dsa:'Data Structures and Algorithms',leet:'Problem Solving',os:'Operating Systems',net:'Networking',sql:'SQL',pg:'PostgreSQL',data:'Data Science',ml:'Machine Learning',thm:'Cybersecurity',htb:'Ethical Security Labs',git:'Git',linux:'Linux',docker:'Docker',sysdesign:'System Design'};
 const skills=['clear requirements','correct syntax','meaningful names','appropriate data types','safe input validation','explicit conditions','bounded loops','small reusable functions','well-defined inputs','predictable outputs','suitable collections','careful text handling','structured records','specific error handling','reproducible debugging','normal-case tests','boundary-case tests','invalid-input tests','useful documentation','safe file handling','trusted dependencies','stable interfaces','least-privilege access','privacy by design','measured performance','accessible interfaces','responsive layouts','separation of concerns','integration checks','version control','peer review','repeatable deployment','useful monitoring','behaviour-preserving refactoring','empty-value handling','large-input handling','realistic examples','small project milestones','final verification','clear technical explanations'];
 const purpose=s=>({
 'clear requirements':'write down the expected behaviour before implementation','correct syntax':'follow the language or tool grammar exactly','meaningful names':'make the purpose of each value easy to understand','appropriate data types':'choose a representation that matches the value','safe input validation':'check external data before trusting or using it','explicit conditions':'make each decision rule clear and testable','bounded loops':'ensure repetition has a clear stopping condition','small reusable functions':'give each function one focused responsibility','well-defined inputs':'document what data a component accepts','predictable outputs':'return a result that callers can rely on','suitable collections':'choose a structure suited to access and updates','careful text handling':'normalise and validate text before processing','structured records':'keep related fields together with clear meaning','specific error handling':'handle known failures without hiding unexpected ones','reproducible debugging':'create a reliable way to trigger the fault','normal-case tests':'confirm typical valid usage works','boundary-case tests':'check empty, minimum and maximum values','invalid-input tests':'confirm bad input fails safely','useful documentation':'explain setup, assumptions and examples','safe file handling':'check paths and handle read/write errors','trusted dependencies':'use maintained packages from known sources','stable interfaces':'keep contracts between components explicit','least-privilege access':'grant only the permissions required','privacy by design':'collect and retain only necessary information','measured performance':'profile before optimising','accessible interfaces':'support keyboard and assistive technology','responsive layouts':'adapt to different viewport sizes','separation of concerns':'keep unrelated responsibilities independent','integration checks':'verify connected components work together','version control':'record changes so they can be reviewed and recovered','peer review':'ask another person to inspect changes before merging','repeatable deployment':'use documented steps and verify the release','useful monitoring':'capture enough context to diagnose failures','behaviour-preserving refactoring':'improve structure without changing results','empty-value handling':'define what happens when a value is missing','large-input handling':'consider resource use as data grows','realistic examples':'test with scenarios similar to actual use','small project milestones':'split work into achievable steps','final verification':'run checks against the original requirements','clear technical explanations':'describe decisions and trade-offs accurately'
 }[s]||'apply a careful, testable workflow');
 Object.keys(courseNames).forEach(id=>{
  if(!QBANK[id])QBANK[id]={title:courseNames[id],q:[]};
  const bank=QBANK[id].q;
  for(let i=bank.length;i<40;i++){
   const skill=skills[i%skills.length],right=purpose(skill);
   bank.push(Q(`In ${courseNames[id]}, why is ${skill} important?`,right,'It removes the need to test the result','It guarantees that every program is free of defects',`Good ${courseNames[id]} work should ${right}.`));
  }
 });
})();
