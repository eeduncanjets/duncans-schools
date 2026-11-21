# Duncan's Tech Schools — Bigger Vision release

## The five connected academies

1. **Learning Academy** — existing courses, 1,000 interactive lessons, course catalogue and structured learning tracks (`/academy`).
2. **Practice Academy** — existing coding challenges, practice tests, cheatsheets and browser playground (`/challenges`, `/practice`, `/playground`).
3. **Project Academy** — Project Lab with editable HTML/CSS/JS starters, sandboxed preview, autosave and export (`/project-lab`).
4. **Career Academy** — Career Studio roadmaps, active-recall cards and portfolio planning, plus Interview Studio question practice (`/career-studio`, `/interview-studio`).
5. **Innovation Academy** — new problem discovery and venture development workspace (`/innovation-academy`).

## Innovation Academy capabilities

- A nine-stage innovation playbook: discover, research, define, design, prototype, test, improve, present and launch responsibly.
- Milestone completion and progress percentage.
- Venture canvas for target users, problem, current alternatives, proposed solution, differentiator, success metric and first experiment.
- Browser-local draft persistence with explicit clear control.
- Markdown venture brief export.
- User interview prompts designed to avoid leading questions.
- Generated 60-second product pitch and copy action.
- Ethical research reminder covering consent, data minimisation and honest reporting.
- Links into Project Lab, Career Studio, Interview Studio and Dashboard.

## Data and limitations

Innovation canvas and milestone state are stored in browser localStorage. They are not cloud-synced and are not public. Export the Markdown brief for backup. This release does not claim to provide funding, investor access, public hosting, legal advice, external user validation, or a moderated public showcase. Those require separately designed services and operational safeguards.

## Verification

Run `npm run check`. The build regenerates pages, sitemap and service-worker assets. The release gate checks JavaScript syntax, local links/assets, lesson/course counts and the Innovation Academy route and core controls. Provider-dependent authentication, account sync, contact forms and hosted AI still require live deployment tests.
