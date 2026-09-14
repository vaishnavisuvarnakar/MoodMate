"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button } from "@/components/ui";
import { useMoods } from "@/lib/storage";
import { MOOD_EMOJI, MOOD_LABELS, type MoodValue } from "@/lib/types";
import { todayStr } from "@/lib/storage";

const VALUES: MoodValue[] = [1, 2, 3, 4, 5];

export default function MoodPage() {
  const { moods, addMood, todayMood } = useMoods();
  const [selected, setSelected] = useState<MoodValue | null>(todayMood?.value ?? null);
  const [note, setNote] = useState(todayMood?.note ?? "");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!selected) return;
    addMood({ date: todayStr(), value: selected, note: note.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const recent = [...moods].reverse().slice(0, 7);

  return (
    <AppShell>
      <PageHeader title="Mood check-in" subtitle="How are you feeling right now?" showMascot />

      <Card className="mb-6">
        <div className="flex justify-between gap-2 mb-6">
          {VALUES.map((v) => (
            <button
              key={v}
              onClick={() => setSelected(v)}
              className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-2xl transition-transform hover:scale-[1.03] ${
                selected === v ? "bg-primary-container" : "bg-surface-container"
              }`}
            >
              <span className="text-3xl">{MOOD_EMOJI[v]}</span>
              <span className="text-xs font-semibold">{MOOD_LABELS[v]}</span>
            </button>
          ))}
        </div>

        <label className="block text-sm font-semibold mb-2" htmlFor="mood-note">
          Add a note (optional)
        </label>
        <textarea
          id="mood-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full rounded-2xl bg-surface-container-low border border-outline-variant/40 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container resize-none mb-4"
        />

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={!selected}>
            {todayMood ? "Update today's mood" : "Save check-in"}
          </Button>
          {saved && <span className="text-sm text-tertiary font-semibold">Saved ✓</span>}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-lg mb-4">Recent check-ins</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No check-ins yet.</p>
        ) : (
          <ul className="space-y-3">
            {recent.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <span className="text-xl">{MOOD_EMOJI[m.value]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {m.date} · {MOOD_LABELS[m.value]}
                  </p>
                  {m.note && <p className="text-xs text-on-surface-variant truncate">{m.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
