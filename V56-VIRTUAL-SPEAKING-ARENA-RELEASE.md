# V56 — Virtual Speaking Arena

## What's new

- A dedicated `/speaking-arena` experience linked from the Public Speaking Academy.
- A responsive theatre-style auditorium rendered with CSS perspective, a virtual speaker, presentation screen and audience rows.
- Three editable presentation slides based on a learner's outline.
- Audience-size, target-duration and practice-mode controls.
- Browser microphone analysis using Web Audio API: signal level, elapsed time and detected quiet intervals.
- Optional browser speech recognition for approximate recognised word count, words per minute and filler-expression count.
- Prepared audience Q&A prompts with optional text answer planning and text-to-speech playback.
- A private local session snapshot stored in the learner's browser.
- A supportive session summary and repeat-practice flow.
- Direct links from the academy and a `/speaking-arena` Netlify redirect.

## Privacy and technical limits

The arena does not upload or record microphone audio. Audio analysis runs in the browser and the media stream is stopped when the session ends or the page is closed. Browser speech recognition may use the browser's speech service and its data handling depends on the browser provider; the arena does not claim that recognition is always on-device. Learners can use the stage and Q&A without speech recognition.

Audience members and reactions are simulated visual cues, not actual people or AI-driven emotional judgments. The room uses CSS perspective and animated visual states; it is not a full 3D/WebGL simulation. Live cues are based on measurable microphone and recognition signals, not a confidence/personality score. WPM and filler counts may be incomplete or inaccurate, especially across accents, languages and browser implementations.

Microphone access requires HTTPS and explicit browser permission. The generated Netlify `Permissions-Policy` allows microphone access from this site (`microphone=(self)`) while continuing to deny camera access.

## Deployment

No new API keys or paid external services are required. Deploy the complete project folder to Netlify. After deployment, open `/speaking-arena` and allow microphone access to test live audio indicators. If speech recognition is unavailable, test the stage, slides, Q&A and session flow without it.

## Validation performed

- `node --check js/speaking-arena.js`
- `node --check build.js`
- `npm run check` — build completed and release quality checks passed.
