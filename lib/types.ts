export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  value: MoodValue;
  note?: string;
  createdAt: number;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Habit {
  id: string;
  title: string;
  createdAt: number;
  archived?: boolean;
  // dates (YYYY-MM-DD) on which it was completed
  completedDates: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export const MOOD_LABELS: Record<MoodValue, string> = {
  1: "Awful",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const MOOD_EMOJI: Record<MoodValue, string> = {
  1: "😞",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};
