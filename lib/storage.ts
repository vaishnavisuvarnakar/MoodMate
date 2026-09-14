"use client";

import { useCallback, useEffect, useState } from "react";
import type { Habit, JournalEntry, MoodEntry, ChatMessage } from "./types";

const KEYS = {
  moods: "moodmate.moods",
  journal: "moodmate.journal",
  habits: "moodmate.habits",
  chat: "moodmate.chat",
  profile: "moodmate.profile",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("moodmate-storage", { detail: key }));
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function useStorageList<T>(key: string) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setItems(read<T[]>(key, []));
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail === key) setItems(read<T[]>(key, []));
    };
    window.addEventListener("moodmate-storage", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("moodmate-storage", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);

  const save = useCallback(
    (next: T[] | ((prev: T[]) => T[])) => {
      setItems((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T[]) => T[])(prev) : next;
        write(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [items, save] as const;
}

// ---- Moods ----
export function useMoods() {
  const [moods, setMoods] = useStorageList<MoodEntry>(KEYS.moods);

  const addMood = useCallback(
    (entry: Omit<MoodEntry, "id" | "createdAt">) => {
      const next = [...moods, { ...entry, id: uid(), createdAt: Date.now() }].sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMoods(next);
    },
    [moods, setMoods]
  );

  const today = todayStr();
  const todayMood = [...moods]
    .filter((m) => m.date === today)
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  return { moods, addMood, todayMood };
}

// ---- Journal ----
export function useJournal() {
  const [entries, setEntries] = useStorageList<JournalEntry>(KEYS.journal);

  const addEntry = useCallback(
    (entry: Pick<JournalEntry, "title" | "content" | "date">) => {
      const now = Date.now();
      const next = [
        { ...entry, id: uid(), createdAt: now, updatedAt: now },
        ...entries,
      ];
      setEntries(next);
    },
    [entries, setEntries]
  );

  const updateEntry = useCallback(
    (id: string, patch: Partial<Pick<JournalEntry, "title" | "content">>) => {
      const next = entries.map((e) =>
        e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e
      );
      setEntries(next);
    },
    [entries, setEntries]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries(entries.filter((e) => e.id !== id));
    },
    [entries, setEntries]
  );

  return { entries, addEntry, updateEntry, deleteEntry };
}

// ---- Habits ----
export function useHabits() {
  const [habits, setHabits] = useStorageList<Habit>(KEYS.habits);

  const addHabit = useCallback(
    (title: string) => {
      const next = [
        ...habits,
        { id: uid(), title, createdAt: Date.now(), completedDates: [] },
      ];
      setHabits(next);
    },
    [habits, setHabits]
  );

  const renameHabit = useCallback(
    (id: string, title: string) => {
      setHabits(habits.map((h) => (h.id === id ? { ...h, title } : h)));
    },
    [habits, setHabits]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      setHabits(habits.filter((h) => h.id !== id));
    },
    [habits, setHabits]
  );

  const toggleToday = useCallback(
    (id: string) => {
      const today = todayStr();
      setHabits(
        habits.map((h) => {
          if (h.id !== id) return h;
          const has = h.completedDates.includes(today);
          return {
            ...h,
            completedDates: has
              ? h.completedDates.filter((d) => d !== today)
              : [...h.completedDates, today],
          };
        })
      );
    },
    [habits, setHabits]
  );

  const activeHabits = habits.filter((h) => !h.archived);

  return { habits: activeHabits, addHabit, renameHabit, deleteHabit, toggleToday };
}

// ---- Chat ----
export function useChat() {
  const [messages, setMessages] = useStorageList<ChatMessage>(KEYS.chat);

  const addMessage = useCallback(
    (role: ChatMessage["role"], content: string) => {
      const newMsg = { id: uid(), role, content, createdAt: Date.now() };
      setMessages((prev) => [...prev, newMsg]);
      return newMsg;
    },
    [setMessages]
  );

  const clear = useCallback(() => setMessages([]), [setMessages]);

  return { messages, addMessage, clear };
}

// ---- Gemini key (session only, not persisted to localStorage) ----
let sessionGeminiKey: string | null = null;
const keyListeners = new Set<(k: string | null) => void>();

export function getGeminiKey() {
  return sessionGeminiKey;
}

export function setGeminiKey(key: string | null) {
  sessionGeminiKey = key;
  keyListeners.forEach((l) => l(key));
}

export function useGeminiKey() {
  const [key, setKey] = useState<string | null>(sessionGeminiKey);
  useEffect(() => {
    const listener = (k: string | null) => setKey(k);
    keyListeners.add(listener);
    return () => {
      keyListeners.delete(listener);
    };
  }, []);
  return { key, setKey: setGeminiKey };
}

// ---- Profile (name only, local) ----
export function useProfile() {
  const [name, setNameState] = useState<string>(() => read<string>(KEYS.profile, "Alex"));
  useEffect(() => {
    setNameState(read<string>(KEYS.profile, "Alex"));
  }, []);
  const setName = useCallback((n: string) => {
    setNameState(n);
    write(KEYS.profile, n);
  }, []);
  return { name, setName };
}
