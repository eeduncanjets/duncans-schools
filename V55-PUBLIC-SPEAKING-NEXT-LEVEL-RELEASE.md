# Duncan's Tech Schools V55 — Public Speaking Next-Level Upgrade

## Delivered

1. **AI storyboard-to-video demonstrations** — AI generates a four-scene teaching storyboard; the browser renders it as an animated WebM with captions. Browser narration is played separately and is not embedded in the exported video.
2. **Virtual audience simulator** — animated audience reactions respond to observable microphone activity and detected speech, with supportive coaching cues.
3. **Real-time speaking indicators** — microphone signal level, recognised words-per-minute estimate, detected long pauses and transcript-based filler expression counts where browser support permits.
4. **Pronunciation and articulation laboratory** — listen-and-repeat phrases, optional speech recognition word comparison, and gentle articulation warm-ups.
5. **90-day confidence journey** — 90 progressive daily challenges across Foundation, Connection and Expression phases; progress is saved locally and included in Supabase cloud sync for signed-in users.
6. **Professional certificate verification portal** — improved digital-signature result card, recipient/course/module/date/ID details, print view, and `/speaking-certificate` alias.

## Configuration

- Existing `ANTHROPIC_API_KEY` and optional `ANTHROPIC_MODEL` power AI coaching and storyboard generation.
- Existing `CERT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are required for secure speaking certificate issuance and verification of course progress at issue time.
- No additional API key is introduced by this release.
- Microphone features require HTTPS (or localhost) and browser permission. Speech recognition support varies by browser/device.

## Honest capability boundaries

- Exported WebM contains animated graphics and captions; speech-synthesis narration plays separately and is not part of the downloaded file.
- The virtual audience is simulated, not a live human audience.
- Acoustic indicators are technical estimates. They do not measure a person's true confidence, intelligence, personality, accent quality or overall speaking ability.
- Recognition word matching is not phonetic pronunciation grading.
- The certificate is a school-issued course-completion record, not an externally accredited qualification.

## Validation

`npm run check` passed: site build completed and the quality checker reported no missing local links/assets or JavaScript syntax failures.
