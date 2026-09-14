"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button } from "@/components/ui";
import { Mascot } from "@/components/Mascot";
import { GeminiKeyModal } from "@/components/GeminiKeyModal";
import { useChat, useGeminiKey, useMoods, useHabits } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

const SUGGESTIONS = ["How am I feeling?", "Help me plan my day", "I feel stressed", "Motivate me"];

export default function ChatPage() {
  const { messages, addMessage } = useChat();
  const { key } = useGeminiKey();
  const { todayMood } = useMoods();
  const { habits } = useHabits();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function buildSystemPrompt() {
    const moodPart = todayMood ? `Today's mood: ${todayMood.value}/5.` : "No mood logged today.";
    const habitsPart =
      habits.length > 0
        ? `Habits: ${habits.map((h) => h.title).join(", ")}.`
        : "No habits tracked yet.";
    return `You are MoodMate, a warm, gentle, encouraging self-help companion inside a wellness app. Keep replies short (2-4 sentences), supportive, and practical. Never give medical or clinical diagnoses. If the user seems in crisis or mentions self-harm, gently encourage them to reach out to a crisis line or trusted person. Context about the user right now: ${moodPart} ${habitsPart}`;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!key) {
      setShowKeyModal(true);
      return;
    }
    setError(null);
    addMessage("user", trimmed);
    setInput("");
    setLoading(true);
    try {
      const reply = await askGemini(key, buildSystemPrompt(), trimmed);
      addMessage("assistant", reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="Talk to MoodMate" subtitle="I'm here to listen and help you reflect." showMascot />

      <Card className="flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 && (
            <div className="flex gap-3">
              <Mascot size={32} expression="happy" />
              <div className="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-md">
                Hi! I&apos;m glad you&apos;re here. How are you feeling today? You can tell me about
                your mood, your habits, or anything on your mind.
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
            >
              {m.role === "assistant" && <Mascot size={32} expression="happy" />}
              <div
                className={`rounded-2xl px-4 py-3 text-sm max-w-md whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary-container text-on-primary-container rounded-tr-sm"
                    : "bg-surface-container rounded-tl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <Mascot size={32} expression="neutral" />
              <div className="bg-surface-container rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-on-surface-variant">
                MoodMate is thinking…
              </div>
            </div>
          )}
          {error && (
            <div className="bg-error-container text-on-error-container rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2 mt-4 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high font-medium"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Tell MoodMate what's on your mind…"
            className="flex-1 rounded-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <Button onClick={() => send(input)} disabled={!input.trim() || loading}>
            Send
          </Button>
        </div>
        <p className="text-xs text-on-surface-variant text-center mt-3">
          Your conversations stay on this device.
        </p>
      </Card>

      {showKeyModal && <GeminiKeyModal onClose={() => setShowKeyModal(false)} />}
    </AppShell>
  );
}
