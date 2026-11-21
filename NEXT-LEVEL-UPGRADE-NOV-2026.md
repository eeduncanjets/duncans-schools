# Duncan's Tech Schools — Next-level upgrade

## New learner experiences

### Project Lab (`/project-lab`)
- Three editable starter projects: profile card, product landing page and mini quiz.
- HTML, CSS and JavaScript editor fields with an isolated sandboxed live preview.
- Browser-local draft autosave and manual save/reset controls.
- Export a standalone HTML file for offline viewing and portfolio use.
- Portfolio quality checklist covering problem definition, responsiveness, functionality, edge cases, explanation and README quality.

### Interview Studio (`/interview-studio`)
- Role-specific technical and behavioural question banks for general graduate, frontend, backend, software engineering, data/AI and cybersecurity tracks.
- Mixed or focused question practice, two-minute response timer and written answer workspace.
- Four-dimension self-assessment rubric: clarity, technical accuracy, examples and reasoning.
- Local practice history, average score and JSON export.
- STAR, technical explanation and problem-solving answer frameworks.

### Learner rewards
- Shared local XP and level system, from Starter through Trailblazer.
- XP rewards for completed interview reviews, project export and portfolio checklist work.
- XP progress display in the student dashboard and new learning tools.

## Integration and discoverability
- Added Project Lab and Interview Studio to primary navigation, footer, homepage tool cards, redirects, sitemap generation and offline service-worker precache.
- Added dashboard links and privacy disclosures for local project drafts, interview history and XP.
- Preserved the existing 1,000 lessons, 25 courses, LC-3 learning centre, existing dashboard, Career Studio, challenges, practice tests, playground, authentication and existing features.
- No teacher dashboard or administrator dashboard added.

## Data and service notes
- New Project Lab drafts, Interview Studio history and XP are stored locally in the user's browser. They are not automatically synced to Supabase.
- Project Lab preview runs inside a sandboxed iframe. Exported projects are standalone HTML files.
- Interview scores are learner self-assessments, not AI-graded or externally verified assessments.

## Release verification
- Run `npm run check` from this directory.
- The release check rebuilds all generated pages, checks JavaScript syntax, verifies local links/assets, and asserts the new feature routes and controls exist.
- Real-provider tests (Supabase OAuth/sync, Netlify Forms and hosted AI helper) remain deployment-environment checks and are not claimed as verified by this static build.
