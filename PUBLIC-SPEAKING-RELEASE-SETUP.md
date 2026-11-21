# Public Speaking Academy — production setup (V54)

## Features completed in this release

- Turn-by-turn AI voice role-play: the browser speech-recognition API captures a learner's turn, the Netlify speaking-coach function obtains an AI reply, and browser speech synthesis reads the reply aloud. Scenarios and beginner/intermediate/advanced levels are selectable. A text-reply fallback is included.
- Audio recorder with pause/resume, playback and user-initiated download. Recordings are not uploaded or placed in public storage.
- Acoustic practice report based on actual recorded microphone samples: duration, RMS signal level, peak amplitude, low-energy proportion, and (when a transcript exists) estimated words per minute and detected filler expressions. The report explains device/microphone limitations and does not pretend to measure confidence, personality or pronunciation accuracy.
- Speaking progress stored in the existing DTS progress model and included in Supabase cross-device synchronization for signed-in learners. Local-only mode continues to work.
- Final assessment requires every curriculum lesson to be marked complete, an 80+ word final speech transcript and three self-check confirmations. Certificate issuance requires sign-in and server-side verification of the saved progress record.
- Certificate codes are signed by the existing certificate function and can be checked through the existing certificate verification page.

## Netlify environment variables

Set these in Netlify → Site configuration → Environment variables, then redeploy:

1. `ANTHROPIC_API_KEY` — private API key used by the AI speaking mentor and voice coach.
2. `ANTHROPIC_MODEL` — optional; defaults to `claude-haiku-4-5-20251001`.
3. `CERT_SECRET` — long, random private secret used to sign certificate IDs.
4. `SUPABASE_URL` — same project URL configured in `js/config.js`.
5. `SUPABASE_ANON_KEY` — same public anon/publishable key configured in `js/config.js`.
6. `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role secret, used only inside the certificate Netlify Function. NEVER add this to `js/config.js`, HTML or any client-side file.

Do not commit private environment values to Git or include them in the ZIP.

## Supabase

The existing `public.progress` table and its own-user Row Level Security policies are reused. The `speaking` object is saved inside each user's `data` JSONB record. No new public table or public audio bucket is required. If the progress table has not yet been created in the active Supabase project, run `supabase/schema.sql` in the Supabase SQL Editor.

## Browser requirements and fallbacks

- Microphone capture requires HTTPS (Netlify provides HTTPS) or localhost and an explicit user permission.
- Live voice conversation requires a browser exposing `SpeechRecognition` or `webkitSpeechRecognition`; support varies by browser. The text-reply option remains available.
- Spoken AI replies use the browser's speech synthesis voices. If unavailable, the text conversation remains usable.
- Recording requires `getUserMedia`, `MediaRecorder` and an audio-capable browser.
- Acoustic measurements vary with microphone gain, room noise, device and distance. They are coaching indicators, not objective grades of a person's voice.

## Release validation

Run:

```sh
npm run check
```

Then deploy the entire `duncans-tech-schools-deploy` folder to Netlify. Test on the deployed HTTPS site with a signed-in account, microphone permission granted, and all environment variables configured.

## Important product boundary

The AI service and certificate endpoint are real server integrations, not simulated responses. They will report a clear setup error until their private Netlify environment variables are configured. Browser speech recognition and speech synthesis are device/browser capabilities, not guaranteed services on every platform. The course still offers text alternatives.

## V55 next-level speaking studio additions

The Public Speaking Academy now includes:

- AI-created four-scene teaching storyboards via `/.netlify/functions/speaking-demo`, rendered as downloadable WebM animation in the browser. Browser speech narration plays separately; the exported WebM currently contains animated visuals and captions, not the speech-synthesis audio track.
- A supportive virtual audience that reacts to live microphone activity with simulated coaching prompts.
- Real-time delivery indicators for microphone signal level, recognised words per minute, detected pauses and transcript-based filler expressions where browser speech recognition is available.
- A pronunciation and articulation practice lab using browser speech synthesis and optional speech recognition. Word-match feedback is not a phonetic or accent score.
- A structured 90-day confidence journey with three phases and cloud synchronization through the existing Supabase `progress` record. The additional `speakingJourney` key is included in the account sync merge.
- An improved public digital-signature verification portal at `/verify` (also `/speaking-certificate`).

### Required configuration and limitations

No additional secret is required beyond the existing `ANTHROPIC_API_KEY` and certificate/Supabase settings documented above. AI storyboard generation uses the configured Anthropic model. The browser APIs require a secure HTTPS origin (localhost is also treated as secure by modern browsers) and explicit microphone permission. Speech recognition availability and language accuracy vary by browser and device. If voice recognition is unavailable, learners can still use the text-based lessons and other exercises.

The virtual audience is a simulated practice aid, not a real human audience. Real-time indicators measure observable technical signals and recognition output; they do not determine a learner's actual confidence, intelligence, personality, accent quality or overall speaking ability. The certificate is a school-issued course-completion record and is not an externally accredited qualification.

## Important: deploy the AI functions (not just the static website)

The speaking coach, AI speaking demonstrations and certificate verification depend on Netlify Functions in `netlify/functions/`. A manual static drag-and-drop upload can publish the HTML/CSS/JS pages while leaving these server functions unavailable. If the AI coach says it is temporarily unavailable:

1. Connect this project folder/repository to the existing Netlify site using Git, or deploy it with the Netlify CLI from this project root.
2. Keep `netlify.toml` in the project root. It sets `publish = "."` and `functions = "netlify/functions"`.
3. In Netlify Site configuration → Environment variables, add `ANTHROPIC_API_KEY` and make it available to the Functions runtime and the Production deploy context. Do not put the key in HTML, JavaScript, Git, or a public file.
4. Trigger a new production deploy after saving the variable.
5. `ANTHROPIC_MODEL` is optional. If it is not set, the function uses its built-in default (`claude-haiku-4-5-20251001`). You do not need to create a separate model secret.
6. Open `/public-speaking`, ask the AI mentor a short question, and confirm that it replies. If it still fails, inspect Netlify → Logs → Functions → `speaking-coach`.

The coach now displays clearer messages for a missing function, missing/rejected key, unavailable model, rate limit, provider outage and timeout. These messages never reveal the API key.
