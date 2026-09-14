# MoodMate 🌻

MoodMate is a self-help wellness companion that helps you track your mood, build small daily habits, journal your thoughts, and talk things through with an AI companion — all in one simple dashboard.

No sign-up. No accounts. Your data stays entirely on your own device.

## Live app
🔗 https://moodmate-lhczqsovg-vaishnavisuvarnakars-projects.vercel.app/dashboard

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
<img width="1920" height="1200" alt="Screenshot (25)" src="https://github.com/user-attachments/assets/1e90acff-a28c-429d-a549-9ad4f0d1bc82" />

down below are screenshots of working app with real data <img width="1920" height="1200" alt="Screenshot (34)" src="https://github.com/user-attachments/assets/bbcc818e-474d-464f-b803-29b2ab790854" />
<img width="1920" height="1200" alt="Screenshot (33)" src="https://github.com/user-attachments/assets/ab778c4f-d90b-439e-89f7-5f3552862481" />
<img width="1920" height="1200" alt="Screenshot (32)" src="https://github.com/user-attachments/assets/e89cbc6a-6dfa-481f-b2ad-f74a64741aa1" />
<img width="1920" height="1200" alt="Screenshot (31)" src="https://github.com/user-attachments/assets/8a2cb987-8ac2-4405-819a-b59448456ebd" />
<img width="1920" height="1200" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/1c5f206a-c986-4eb9-880d-7357bfa3a7fe" />
<img width="1920" height="1200" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/bc78f3ea-729c-4a4d-8de0-74855841d412" />
:<img width="1920" height="1200" alt="Screenshot (28)" src="https://github.com/user-attachments/assets/4f8af0da-d824-4c11-a1d3-5c29acddb268" />
<img width="1920" height="1200" alt="Screenshot (27)" src="https://github.com/user-attachments/assets/b9fdf364-292e-42da-a98f-a31269fb0c6a" />
<img width="1920" height="1200" alt="Screenshot (26)" src="https://github.com/user-attachments/assets/1fa78782-48ae-499f-9146-efd838e22661" />

