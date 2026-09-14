# MoodMate 🌻

MoodMate is a self-help wellness companion that helps you track your mood, build small daily habits, journal your thoughts, and talk things through with an AI companion — all in one simple dashboard.

No sign-up. No accounts. Your data stays entirely on your own device.

## Live app
🔗 [Add your Vercel link here]

## What it does

- **Mood check-ins** — log how you're feeling each day, with an optional note
- **Habits** — a simple, no-fuss habit tracker (tick to complete, edit to rename)
- **Journal** — a private space to write and revisit your thoughts
- **Dashboard** — your mood, habits, and journal at a glance, always visible
- **AI Chat** — talk to MoodMate, an AI companion that responds with context from your actual mood and habits
- **AI Insights** — get a short, personalized reflection on patterns in your mood and habit data

## How your data works

Everything you track — moods, habits, journal entries — is stored locally in your browser (`localStorage`). It never gets sent to a server or saved anywhere else. If you clear your browser data or switch devices, that history is gone, and you can wipe it yourself anytime from **Settings → Delete all my data**.

## About the AI features

AI Chat and Insights are powered by Google's Gemini API. MoodMate doesn't come with a built-in key — you bring your own, free from Google AI Studio:

👉 https://aistudio.google.com/app/apikey

The first time you open AI Chat or Insights, you'll be asked to paste your key. It's used only for that browser session — it's never saved to disk, never sent anywhere but directly to Google's API, and you'll need to enter it again next time you open the app.

## Running it yourself

npm install

npm run dev


Then open `http://localhost:3000`.

## Tech stack

Next.js (App Router) + TypeScript + Tailwind CSS. No backend, no database — everything runs in the browser.

## A note on scope

This is a hackathon MVP. No accounts, no cross-device sync, no offline support yet — deliberately kept simple so the core self-help experience works well first.
