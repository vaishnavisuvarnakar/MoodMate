"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button } from "@/components/ui";
import { useProfile, useGeminiKey } from "@/lib/storage";

export default function SettingsPage() {
  const { name, setName } = useProfile();
  const { key, setKey } = useGeminiKey();
  const [nameInput, setNameInput] = useState(name);

  function clearAllData() {
    if (!confirm("This will permanently delete all your local MoodMate data. Continue?")) return;
    ["moodmate.moods", "moodmate.journal", "moodmate.habits", "moodmate.chat", "moodmate.profile"].forEach(
      (k) => localStorage.removeItem(k)
    );
    window.location.href = "/dashboard";
  }

  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Manage your profile, AI key, and data." />

      <div className="space-y-5">
        <Card>
          <h3 className="font-bold text-lg mb-4">Profile</h3>
          <label className="block text-sm font-semibold mb-2">Display name</label>
          <div className="flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 rounded-2xl bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <Button onClick={() => setName(nameInput.trim() || "Alex")}>Save</Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-2">Gemini API key</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            {key
              ? "Connected for this session. Your key is not saved — you'll be asked again next time you open the app."
              : "Not connected yet. You'll be asked for a key the first time you use AI Chat or Insights."}
          </p>
          {key && (
            <Button variant="danger" onClick={() => setKey(null)}>
              Disconnect key
            </Button>
          )}
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-2">Privacy &amp; data</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            MoodMate has no accounts. All your mood, habit, and journal data is stored only in this
            browser&apos;s local storage — it never leaves your device except when you send a message
            to the AI.
          </p>
          <Button variant="danger" onClick={clearAllData}>
            Delete all my data
          </Button>
        </Card>

        <Card>
          <p className="text-xs text-on-surface-variant">
            MoodMate is designed to support wellbeing and is not a replacement for professional
            clinical advice or therapy. v0.1 (hackathon MVP)
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
