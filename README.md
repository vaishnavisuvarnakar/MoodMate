# MoodMate — Self-Help MVP

A local-first wellness app: mood check-ins, habits, journal, and an AI companion (chat + insights) powered by Google Gemini using your own free-tier API key.

## Stack
- Next.js (App Router) + TypeScript + Tailwind v4
- No backend, no accounts — all data lives in the browser's localStorage
- Gemini API called directly from the browser using a key you paste in; the key lives only for the current session (never persisted)

## Run locally
```
npm install
npm run dev
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Import the repo in Vercel — no environment variables needed (users bring their own Gemini key at runtime).
3. Deploy. Framework preset: Next.js (auto-detected).

## Get a free Gemini key
https://aistudio.google.com/app/apikey

## Notes
- All mood/habit/journal data is local to the browser — clearing site data or switching browsers loses it.
- "Delete all my data" in Settings wipes localStorage.
- This is a hackathon MVP: no auth, no sync, no offline PWA yet.
