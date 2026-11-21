# Duncan's Tech Schools

A static learning site: HTML, CSS and JavaScript only. No framework, no server.

## Rebuild after editing content
Edit `js/data.js` (courses, programmes, library), `js/lessons.js` / `js/lessons-extra.js` (lessons),
`js/challenges.js` (challenges) or `content/posts.js` (blog), then run:

    node build.js

This regenerates every course, lesson and blog page, `sitemap.xml`, `robots.txt`, `_headers`,
`manifest.webmanifest` and the offline worker `sw.js`. For a custom domain:

    SITE_URL=https://yourdomain.com node build.js

## Deploy (Netlify)
For a simple static update, open the extracted project folder and drag that folder onto your existing site at https://app.netlify.com (Deploys). This keeps the same site URL.

Important: manual drag-and-drop deploys publish static files only; they do not reliably build Netlify Functions. To enable the real AI endpoint, connect this project to GitHub or deploy with the Netlify CLI so `netlify/functions/assistant.js` is deployed. Keep the publish directory as `.` and functions directory as `netlify/functions`.
Turn on form detection in Netlify (Forms) so the newsletter and contact forms work.

## Preview locally
Use a local server (not file://): `npx serve`

## Optional features (switch on when ready)

### Sign in and sign up (Supabase, free tier)
1. Create a project at https://supabase.com. Open **SQL Editor**, paste `supabase/schema.sql`, press Run.
2. In **Authentication -> URL Configuration** set the Site URL to your site and add `https://YOUR-SITE/account` as a redirect URL.
3. In **Project Settings -> API** copy the Project URL and the publishable/anon public key into `js/config.js`. The current project values are already present in this package; do not replace them unless you are changing Supabase projects.
4. In **Authentication -> Providers -> Google**, enable Google and enter the Google OAuth Client ID and Client Secret from Google Cloud Console. Keep the client secret inside Supabase only; never put it in this website's JavaScript.
5. In Google Cloud Console, create an OAuth 2.0 Web application client. Add your live site to **Authorized JavaScript origins** (`https://duncans-tech-schools.netlify.app`) and add the Supabase callback URL shown on the Supabase Google provider page to **Authorized redirect URIs** (usually `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`).
6. In Supabase **Authentication -> URL Configuration**, set the Site URL to `https://duncans-tech-schools.netlify.app` and add `https://duncans-tech-schools.netlify.app/account` to Redirect URLs.
7. Redeploy this folder and test Google sign-in with a real Google account. The Google button and OAuth redirect code are included, but Google sign-in will not complete until the provider credentials and redirect URLs are configured in the Supabase and Google dashboards.

### AI study helper (Netlify Function)
The chat button works without setup using a built-in helper that searches the site. For real AI answers:
1. Deploy from GitHub (or the Netlify CLI) so the `netlify/functions` folder is built.
2. In Netlify -> Site configuration -> Environment variables add `ANTHROPIC_API_KEY` with your key from https://console.anthropic.com.
3. Optional: add `ANTHROPIC_MODEL` to choose a different model.
The key stays on the server. Usage is billed to your Anthropic account, so consider setting a spending limit there.

### Content you can edit
`js/questions.js` (practice test questions), `js/challenges.js` (challenges, including debug ones), `js/lessons.js` and `js/lessons-extra.js` (lessons), `content/posts.js` (blog). Run `node build.js` after changes.


## Brand and release notes
The public brand is **Duncan's Tech Schools**. The generated site currently includes 1,000 lesson pages across 25 courses, plus the LC-3 learning centre and other learner tools. After changing source content or branding in source files, run `node build.js` before deploying.


## Netlify forms setup (newsletter and contact)

Both forms use Netlify Forms. In the Netlify dashboard, open **Forms** and make sure form detection is enabled (Site configuration / Forms settings; labels can vary). Then deploy this folder again. After the deployment, submit one test newsletter subscription and one test contact message and check the **Forms** area for entries. To receive contact submissions by email, add a form notification in Netlify's form notification settings. A successful browser message means the request was accepted; confirm it appears in Netlify Forms before relying on it.

## New learning tools (November 2026)

- **LC-3 Assembly Lab**: open `/lc3` for a browser-based LC-3 assembler and simulator with an assembly editor, run/step controls, R0–R7 register display, PC/condition codes, memory viewer, console output, and `.asm` import/export. The supported instruction/directive set and current limitations are listed on the lab page. The simulator is a learning implementation, not a complete operating-system environment.
- **Technology Academy**: open `/academy` for learning tracks across programming, web, computer science, AI/data, cybersecurity, hardware, design, and careers.
- **Study planner**: set a weekly study target; it is stored locally in the browser.
- **Portfolio starter**: draft and download a Markdown project entry for a GitHub portfolio.
- Existing features retained: lessons, coding challenges, practice tests, dashboard, browser-saved progress, downloadable course completion certificates, Study Pal assistant, and WhatsApp contact shortcut.

### Deployment

Deploy the contents of this folder to Netlify (the folder containing `index.html`, `netlify.toml`, `academy.html`, and `lc3.html`). The new pages use the site's existing static hosting setup and do not require a build command. After deployment, test `/academy` and `/lc3` on the live domain and hard-refresh once so the updated service worker/assets load.

### Important service configuration

Study plans and portfolio drafts are device-local. Existing login, AI assistant, and any cross-device or teacher/admin workflows depend on their respective Supabase/Netlify environment configuration. Google sign-in requires the OAuth setup described in `GOOGLE-OAUTH-SETUP.txt`. This package does not include private API keys or claim that third-party authentication, cloud sync, public certificate verification, live classrooms, or moderated community features are configured.


## LC-3 Learning Centre additions

This package includes a handbook-aligned LC-3 learning area:

- `/lc3-academy` — learning-centre overview and local progress summary
- `/lc3-guide` — 40 structured lessons with worked assembly examples
- `/lc3` — interactive assembler, run/step simulator, register and memory views, and rule-based Check & Correct helper
- `/lc3-challenges` — 40 debugging challenges with hints, solutions and completion tracking
- `/lc3-practice` — 40-question auto-marked quiz, answer explanations and coding practice tasks

Lesson and challenge completion and the latest quiz score are stored in the student's browser using local storage. They are not presented as cloud-synchronised records. The Check & Correct feature applies a limited set of deterministic source fixes (including missing .ORIG/.END directives, simple label underscore normalisation and unquoted .STRINGZ text), then assembles and runs with the bundled lab; it is not an AI code reviewer and students should inspect all changes.

The learning content is based on the supplied `LC3 INSTRUCTION HANDBOOK.pdf` topics: architecture, registers, memory, assembly syntax, operate instructions, data movement, control instructions, traps and exercises.

### Deploying the updated site

Extract the ZIP and deploy the contents of `duncans-tech-schools-deploy` to Netlify (not the outer parent folder). The new clean routes are configured in `_redirects`. After deployment, test `/lc3-academy`, `/lc3-guide`, `/lc3-challenges`, `/lc3-practice` and `/lc3`.


## Learner experience upgrades (November 2026)

- Dashboard focus timer with 15, 25, 40, 50 and 60-minute sessions. Completed sessions add to a rolling seven-day study target.
- Editable weekly study target (60–3,000 minutes), with progress stored locally and included in optional signed-in progress sync.
- Progress backup export and safe merge-import for lessons, challenges, practice results, streak days, focus sessions and certificate name. Import keeps existing progress and merges records rather than blindly replacing them.
- Corrected the homepage FAQ so certificate availability and the non-accredited nature of completion certificates are explained accurately.
- No teacher or administrator dashboard has been added.

## Career Studio upgrade (November 2026)

The new `/career-studio` area adds a career-focused learner workspace:

- Six skill roadmaps: frontend, backend, full-stack, data & AI, cybersecurity, and software engineering.
- Skill checklists with progress saved locally and direct links into relevant lessons and practice areas.
- A 12-card Computer Science Essentials spaced-review deck. Cards use simple Again / Hard / Good / Easy scheduling to bring due concepts back over time.
- A project planner for problem statements, categories, feature lists and project status.
- JSON backup/merge import and a Markdown portfolio-plan export.

Career Studio is a learner-only feature. It does not add teacher or administrator dashboards. Its data is stored in the current browser; it is not automatically synchronised between devices or accounts.

### Public Speaking Academy AI setup
The AI speaking coach and AI storyboard generator run as Netlify Functions. Deploy through a Git-connected Netlify site or the Netlify CLI so `netlify/functions/` is built; static drag-and-drop deployment alone does not publish these functions. Set `ANTHROPIC_API_KEY` as a private Netlify environment variable available to Functions in the Production context, then redeploy. `ANTHROPIC_MODEL` is optional; the code includes a default model. See `PUBLIC-SPEAKING-RELEASE-SETUP.md` for the full setup and troubleshooting steps.
