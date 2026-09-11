# Workroom Campus

An AI-native career-readiness experience for third-year CSE students. The interactive mission is **Incident Zero**: students triage a production failure, gather evidence, select a reversible response, communicate responsibly, and receive a private debrief.

## Run locally

```bash
npm start
```

Open `http://localhost:4173`. Without an API key, the product still works with the built-in rubric; only the personalised Gemini coaching note is unavailable.

To test Gemini locally after creating a new key, place it in a local `.env` file and run:

```bash
npx vercel dev
```

Open the local URL Vercel prints. Do not commit the `.env` file.

## Deploy to Vercel with Gemini

1. Create a **new Gemini API key** in Google AI Studio. Never use a key that has been posted to chat, a repository, or client-side code.
2. Push this folder to a Git repository and import it into Vercel.
3. In Vercel: **Project → Settings → Environment Variables**, add `GEMINI_API_KEY` for Preview and Production, then redeploy.
4. Optionally set `GEMINI_MODEL` (the default is `gemini-3.7-flash`).

Vercel exposes `api/gemini.js` as a server-side Function. The browser calls `/api/gemini`; the API key is used only inside that function and is never returned to the client.

## Responsible AI boundaries

- Student reflections and practice evidence are private by default.
- The product evaluates observable choices in a scenario, not personality, mental health, potential, or employability.
- Gemini feedback is bounded to coaching on the completed simulation and is explicitly not a hiring assessment.
- The server limits submitted text, uses Gemini safety settings, and returns a local, non-AI rubric if Gemini is unavailable.

## Validation

```bash
npm test
npm run check
```
