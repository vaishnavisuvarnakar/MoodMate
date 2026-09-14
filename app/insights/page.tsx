"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button } from "@/components/ui";
import { Mascot } from "@/components/Mascot";
import { GeminiKeyModal } from "@/components/GeminiKeyModal";
import { useGeminiKey, useHabits, useMoods, useJournal, todayStr } from "@/lib/storage";

import { askGemini } from "@/lib/gemini";

export default function InsightsPage() {
  const { key } = useGeminiKey();
  const { moods } = useMoods();
  const { habits } = useHabits();
  const { entries } = useJournal();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasEnoughData = moods.length > 0 || habits.length > 0 || entries.length > 0;

  // ---- Last 7 days mood trend ----
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const moodByDate = new Map(moods.map((m) => [m.date, m.value]));
  const trend = last7Days.map((date) => ({
    date,
    value: moodByDate.get(date) ?? null,
  }));
  const loggedValues = trend.filter((t) => t.value !== null) as { date: string; value: number }[];
  const avgMood =
    loggedValues.length > 0
      ? (loggedValues.reduce((sum, t) => sum + t.value, 0) / loggedValues.length).toFixed(1)
      : null;

  // ---- Habit completion rates (last 7 days) ----
  const habitStats = habits.map((h) => {
    const completedInWindow = last7Days.filter((d) => h.completedDates.includes(d)).length;
    return {
      id: h.id,
      title: h.title,
      completedInWindow,
      rate: Math.round((completedInWindow / 7) * 100),
    };
  });

  async function generate() {
    if (!key) {
      setShowKeyModal(true);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const moodSummary = moods
        .slice(-7)
        .map((m) => `${m.date}: mood ${m.value}/5${m.note ? ` (note: ${m.note})` : ""}`)
        .join("\n");
      const habitSummary = habits
        .map((h) => `${h.title}: completed ${h.completedDates.length} times`)
        .join("\n");

      const prompt = `Here is the user's recent self-tracking data.\n\nMood entries (last 7):\n${
        moodSummary || "none"
      }\n\nHabits:\n${habitSummary || "none"}\n\nJournal entries so far: ${entries.length}\n\nWrite one short, warm, specific insight (2-3 sentences) about a pattern you notice, and one gentle suggestion. Do not diagnose or give medical advice.`;

      const reply = await askGemini(
        key,
        "You are MoodMate, a gentle wellness insight generator. Be specific, warm, brief, and never clinical.",
        prompt
      );
      setInsight(reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="Insights" subtitle="Small observations from your mood and habits." showMascot />

      <Card className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <Mascot size={90} expression="happy" />
        <div className="flex-1">
          {!hasEnoughData ? (
            <p className="text-sm text-on-surface-variant">
              Log a few mood check-ins or habits first, then come back for a personalized insight.
            </p>
          ) : insight ? (
            <p className="text-sm md:text-base">{insight}</p>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Generate an AI insight based on your recent mood and habit activity.
            </p>
          )}
          {error && <p className="text-sm text-error mt-2">{error}</p>}
          <Button onClick={generate} disabled={loading || !hasEnoughData} className="mt-4">
            {loading ? "Thinking…" : insight ? "Regenerate" : "Generate insight"}
          </Button>
        </div>
      </Card>

      {/* ---- Mood trend (last 7 days) ---- */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Mood — last 7 days</h3>
          {avgMood && (
            <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded-full font-semibold">
              Avg {avgMood}/5
            </span>
          )}
        </div>
        {loggedValues.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No mood check-ins yet this week.</p>
        ) : (
          <div className="flex items-end justify-between gap-2 h-32">
            {trend.map((t) => (
              <div key={t.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={`w-full rounded-t-lg ${
                    t.value ? "bg-primary-container" : "bg-surface-container"
                  }`}
                  style={{ height: t.value ? `${(t.value / 5) * 100}%` : "6%" }}
                  title={t.value ? `${t.value}/5` : "No check-in"}
                />
                <span className="text-[10px] text-on-surface-variant">
                  {new Date(t.date).toLocaleDateString(undefined, { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ---- Habit completion (last 7 days) ---- */}
      <Card className="mb-6">
        <h3 className="font-bold text-lg mb-4">Habit completion — last 7 days</h3>
        {habitStats.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No habits tracked yet.</p>
        ) : (
          <ul className="space-y-3">
            {habitStats.map((h) => (
              <li key={h.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{h.title}</span>
                  <span className="text-on-surface-variant">
                    {h.completedInWindow}/7 · {h.rate}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full"
                    style={{ width: `${h.rate}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Mood check-ins</p>
          <p className="text-2xl font-extrabold">{moods.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Habits tracked</p>
          <p className="text-2xl font-extrabold">{habits.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold text-on-surface-variant mb-1">Journal entries</p>
          <p className="text-2xl font-extrabold">{entries.length}</p>
        </Card>
      </div>

      {showKeyModal && <GeminiKeyModal onClose={() => setShowKeyModal(false)} />}
    </AppShell>
  );
}