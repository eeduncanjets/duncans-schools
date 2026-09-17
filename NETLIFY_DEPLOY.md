# Duncan's Schools — Netlify deployment

## What this build fixes
Every one of the 12 courses has a public course intelligence view: overview, prerequisites, duration, tools, guide, skills, projects, outcomes, 6 modules and a 5-question assessment. The cards and course modal also use 3D tilt, animated HUD styling and a richer learning flow.

## Architecture
Netlify hosts the frontend and serverless API. A hosted MySQL database stores users, courses, lessons, quizzes and progress. Netlify itself does not provide a persistent MySQL server.

## Deploy
1. Create a hosted MySQL database and run `server/db/schema.sql`, then `server/db/seed.sql`.
2. Push this whole project folder to GitHub.
3. In Netlify choose **Add new site → Import an existing project** and select the GitHub repo.
4. Netlify reads `netlify.toml`: publish directory `client`, functions directory `netlify/functions`.
5. Add environment variables: `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `DB_CONNECTION_LIMIT`.
6. Deploy and test `/api/health`.
7. Test register → enroll → open lesson → complete lesson → assessment → dashboard.

## Local Netlify test
Run `npm install` then `npm run netlify:dev`.

Never place database credentials in frontend JavaScript.
