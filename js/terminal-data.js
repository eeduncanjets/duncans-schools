window.CMD_TRACKS=[
{id:'linux',name:'Linux',host:'learner@dts:~$',tasks:[
{p:'Show the folder you are in.',re:'^pwd$',ex:'pwd',o:'/home/learner'},
{p:'List all files, including hidden ones, in long format.',re:'^ls\\s+(-la|-al|-l\\s+-a|-a\\s+-l)$',ex:'ls -la',o:'drwxr-xr-x 3 learner learner 4096 Nov 16 .\n-rw-r--r-- 1 learner learner  220 Nov 16 .bashrc\n-rw-r--r-- 1 learner learner   42 Nov 16 app.log'},
{p:'Create a folder called notes.',re:'^mkdir\\s+notes$',ex:'mkdir notes',o:''},
{p:'Move into the notes folder.',re:'^cd\\s+notes/?$',ex:'cd notes',o:''},
{p:'Create an empty file called todo.txt.',re:'^touch\\s+todo\\.txt$',ex:'touch todo.txt',o:''},
{p:'Show the contents of todo.txt.',re:'^cat\\s+todo\\.txt$',ex:'cat todo.txt',o:'(the file is empty)'},
{p:'Search app.log for the word error, ignoring case.',re:'^grep\\s+-i\\s+["\']?error["\']?\\s+app\\.log$',ex:'grep -i error app.log',o:'2026-11-16 09:14 ERROR disk almost full'},
{p:'Make script.sh executable.',re:'^chmod\\s+(\\+x|755|u\\+x)\\s+script\\.sh$',ex:'chmod +x script.sh',o:''}]},
{id:'git',name:'Git',host:'learner@dts:project$',tasks:[
{p:'Start a new Git repository here.',re:'^git init$',ex:'git init',o:'Initialized empty Git repository in /home/learner/project/.git/'},
{p:'See which files have changed.',re:'^git status$',ex:'git status',o:'Untracked files:\n  index.html'},
{p:'Stage every change.',re:'^git add\\s+(\\.|-A|--all)$',ex:'git add .',o:''},
{p:'Commit with the message Add homepage.',re:'^git commit\\s+-m\\s+["\']Add homepage["\']$',ex:'git commit -m "Add homepage"',o:'[main a1b2c3d] Add homepage\n 1 file changed'},
{p:'Create and switch to a new branch called feature-login.',re:'^git\\s+(switch\\s+-c|checkout\\s+-b)\\s+feature-login$',ex:'git switch -c feature-login',o:"Switched to a new branch 'feature-login'"},
{p:'Show the history with one line per commit.',re:'^git log\\s+--oneline$',ex:'git log --oneline',o:'a1b2c3d Add homepage'},
{p:'Switch back to the main branch.',re:'^git\\s+(switch|checkout)\\s+main$',ex:'git switch main',o:"Switched to branch 'main'"},
{p:'Merge feature-login into main.',re:'^git merge feature-login$',ex:'git merge feature-login',o:'Fast-forward\n 1 file changed'}]},
{id:'docker',name:'Docker',host:'learner@dts:~$',tasks:[
{p:'Download the nginx image.',re:'^docker pull nginx(:latest)?$',ex:'docker pull nginx',o:'latest: Pulling from library/nginx\nStatus: Downloaded newer image for nginx:latest'},
{p:'Run nginx in the background, mapping host port 8080 to container port 80.',re:'^docker run\\s+((-d\\s+-p\\s+8080:80)|(-p\\s+8080:80\\s+-d))\\s+nginx$',ex:'docker run -d -p 8080:80 nginx',o:'3f9c1e7a2b4d...'},
{p:'List the running containers.',re:'^docker ps$',ex:'docker ps',o:'CONTAINER ID  IMAGE  PORTS                 NAMES\n3f9c1e7a2b4d  nginx  0.0.0.0:8080->80/tcp  web'},
{p:'Show the logs of the container named web.',re:'^docker logs\\s+web$',ex:'docker logs web',o:'/docker-entrypoint.sh: Configuration complete; ready for start up'},
{p:'Stop the container named web.',re:'^docker stop\\s+web$',ex:'docker stop web',o:'web'},
{p:'Build an image tagged myapp:1.0 from the current folder.',re:'^docker build\\s+-t\\s+myapp:1\\.0\\s+\\.$',ex:'docker build -t myapp:1.0 .',o:'Successfully tagged myapp:1.0'},
{p:'List the images on this machine.',re:'^docker images$',ex:'docker images',o:'REPOSITORY  TAG     SIZE\nmyapp       1.0     145MB\nnginx       latest  188MB'},
{p:'Remove the container named web.',re:'^docker rm\\s+web$',ex:'docker rm web',o:'web'}]}];
