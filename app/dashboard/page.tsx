"use client";

import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, LinkButton } from "@/components/ui";
import { Mascot } from "@/components/Mascot";
import { useHabits, useJournal, useMoods, useProfile } from "@/lib/storage";
import { MOOD_EMOJI, MOOD_LABELS } from "@/lib/types";

export default function DashboardPage() {
  const { name } = useProfile();
  const { todayMood } = useMoods();
  const { habits, toggleToday } = useHabits();
  const { entries } = useJournal();

  const doneCount = habits.filter((h) => h.completedDates.includes(today())).length;
  const latestEntry = entries[0];

  return (
    <AppShell>
      <PageHeader title={`Good to see you, ${name}`} subtitle="How are you feeling today?" showMascot />

      {/* Hero */}
      <Card className="flex flex-col md:flex-row items-center gap-6 mb-6 bg-gradient-to-br from-primary-container/30 to-tertiary-container/20">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2">Ready to make today a good day?</h2>
          <p className="text-on-surface-variant mb-4 text-sm md:text-base">
            Take a moment to check in with yourself and see how your day is going.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/mood">Check in your mood →</LinkButton>
            <LinkButton href="/chat" variant="ghost">
              Talk to MoodMate
            </LinkButton>
          </div>
        </div>
        <Mascot size={120} expression={todayMood ? moodToExpression(todayMood.value) : "neutral"} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Today's mood */}
        <Card>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">Today&apos;s Mood</h3>
            <LinkButton href="/mood" variant="ghost" className="!px-3 !py-1 text-xs">
              {todayMood ? "Update" : "Check in"}
            </LinkButton>
          </div>
          {todayMood ? (
            <div className="flex items-center gap-3">
              <span className="text-3xl">{MOOD_EMOJI[todayMood.value]}</span>
              <div>
                <p className="font-semibold">{MOOD_LABELS[todayMood.value]}</p>
                <p className="text-xs text-on-surface-variant">{todayMood.value}/5</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">You haven&apos;t checked in yet today.</p>
          )}
        </Card>

        {/* Today's habits */}
        <Card>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">Today&apos;s Habits</h3>
            <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-full font-semibold">
              {doneCount}/{habits.length || 0}
            </span>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-on-surface-variant mb-2">No habits yet.</p>
          ) : (
            <ul className="space-y-2 mb-2">
              {habits.slice(0, 4).map((h) => {
                const done = h.completedDates.includes(today());
                return (
                  <li key={h.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleToday(h.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${
                        done
                          ? "bg-tertiary border-tertiary text-white"
                          : "border-outline-variant"
                      }`}
                    >
                      {done && "✓"}
                    </button>
                    <span className={`text-sm ${done ? "line-through text-on-surface-variant" : ""}`}>
                      {h.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <LinkButton href="/habits" variant="ghost" className="!px-3 !py-1 text-xs mt-1">
            View all →
          </LinkButton>
        </Card>

        {/* Latest journal */}
        <Card>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">Journal</h3>
          </div>
          {latestEntry ? (
            <div>
              <p className="font-semibold text-sm mb-1 truncate">{latestEntry.title || "Untitled"}</p>
              <p className="text-xs text-on-surface-variant line-clamp-3">{latestEntry.content}</p>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">No entries yet. Write your first one.</p>
          )}
          <LinkButton href="/journal" variant="ghost" className="!px-3 !py-1 text-xs mt-3">
            Open journal →
          </LinkButton>
        </Card>
      </div>
    </AppShell>
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function moodToExpression(v: number) {
  if (v === 5) return "happy";
  if (v === 4) return "curious";
  if (v === 3) return "neutral"; // maps to calm.png in Mascot.tsx
  if (v === 2) return "sad";
  return "stressed"; // v === 1
}
