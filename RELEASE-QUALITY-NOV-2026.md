# Release quality improvements — November 2026

## Changes in this package

- Focus timer now uses an absolute end time instead of assuming the browser fires a one-second interval exactly on time. It catches up after background-tab throttling and when a learner returns to the tab.
- Study Pal no longer starts a separate, untracked 25-minute timer. It directs learners to the dashboard timer, which records completed sessions toward the weekly study goal.
- AI helper endpoint rejects oversized requests, returns non-cacheable JSON, prunes stale in-memory rate-limit entries, and applies a 20-second upstream timeout.
- Added a dependency-free release gate (`npm test`) that syntax-checks browser and Netlify JavaScript, checks local HTML links/assets, and verifies the 1,000-lesson / 25-course catalogue baseline.

## Verification performed

- `node build.js` completed successfully.
- `node --check` passed for the edited JavaScript and Netlify function.
- `npm test` is included as the repeatable release check; run it from this folder before deployment.

## Important limits

This is a static source-package audit, not a substitute for testing the deployed site in real browsers. Supabase authentication/cloud sync, Google OAuth, Netlify Forms, and the hosted AI provider still require credentials and end-to-end tests in their respective dashboards. No teacher or administrator dashboard has been added. Completion certificates remain non-accredited certificates of completion.
