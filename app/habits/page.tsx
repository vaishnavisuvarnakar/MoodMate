"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, FAB } from "@/components/ui";
import { useHabits, todayStr } from "@/lib/storage";

export default function HabitsPage() {
  const { habits, addHabit, renameHabit, deleteHabit, toggleToday } = useHabits();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const today = todayStr();
  const pending = habits.filter((h) => !h.completedDates.includes(today));
  const done = habits.filter((h) => h.completedDates.includes(today));

  function submitNew() {
    const t = newTitle.trim();
    if (t) addHabit(t);
    setNewTitle("");
    setAdding(false);
  }

  function startEdit(id: string, title: string) {
    setEditingId(id);
    setEditTitle(title);
  }

  function submitEdit() {
    if (!editingId) return;
    const t = editTitle.trim();
    if (t) renameHabit(editingId, t);
    setEditingId(null);
  }

  return (
    <AppShell>
      <PageHeader title="Habits" subtitle="Small daily habits, tracked simply." />

      <Card>
        {habits.length === 0 && !adding && (
          <p className="text-sm text-on-surface-variant mb-4">
            No habits yet. Tap + to add your first one.
          </p>
        )}

        {adding && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="w-5 h-5 rounded-md border-2 border-outline-variant shrink-0" />
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitNew()}
              onBlur={submitNew}
              placeholder="New habit title"
              className="flex-1 bg-transparent border-b border-outline-variant/50 focus:outline-none text-sm py-1"
            />
          </div>
        )}

        <ul className="space-y-1">
          {pending.map((h) => (
            <HabitRow
              key={h.id}
              title={h.title}
              done={false}
              editing={editingId === h.id}
              editTitle={editTitle}
              onToggle={() => toggleToday(h.id)}
              onEditStart={() => startEdit(h.id, h.title)}
              onEditChange={setEditTitle}
              onEditSubmit={submitEdit}
              onDelete={() => deleteHabit(h.id)}
            />
          ))}
        </ul>

        {done.length > 0 && (
          <>
            <p className="text-xs font-semibold text-on-surface-variant mt-5 mb-2 px-1">
              Completed today
            </p>
            <ul className="space-y-1">
              {done.map((h) => (
                <HabitRow
                  key={h.id}
                  title={h.title}
                  done
                  editing={editingId === h.id}
                  editTitle={editTitle}
                  onToggle={() => toggleToday(h.id)}
                  onEditStart={() => startEdit(h.id, h.title)}
                  onEditChange={setEditTitle}
                  onEditSubmit={submitEdit}
                  onDelete={() => deleteHabit(h.id)}
                />
              ))}
            </ul>
          </>
        )}
      </Card>

      <FAB onClick={() => setAdding(true)} label="Add habit" />
    </AppShell>
  );
}

function HabitRow({
  title,
  done,
  editing,
  editTitle,
  onToggle,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onDelete,
}: {
  title: string;
  done: boolean;
  editing: boolean;
  editTitle: string;
  onToggle: () => void;
  onEditStart: () => void;
  onEditChange: (v: string) => void;
  onEditSubmit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-2 group px-1 py-1.5 rounded-xl hover:bg-surface-container">
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 text-xs ${
          done ? "bg-tertiary border-tertiary text-white" : "border-outline-variant"
        }`}
        aria-label="Mark complete"
      >
        {done && "✓"}
      </button>

      {editing ? (
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEditSubmit()}
          onBlur={onEditSubmit}
          className="flex-1 bg-transparent border-b border-outline-variant/50 focus:outline-none text-sm py-0.5"
        />
      ) : (
        <span className={`flex-1 text-sm ${done ? "line-through text-on-surface-variant" : ""}`}>
          {title}
        </span>
      )}

      <button
        onClick={onEditStart}
        className="opacity-0 group-hover:opacity-100 text-xs text-on-surface-variant px-2 py-1 rounded-lg hover:bg-surface-container-high transition-opacity"
        aria-label="Edit"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 text-xs text-error px-2 py-1 rounded-lg hover:bg-error-container/40 transition-opacity"
        aria-label="Delete"
      >
        ✕
      </button>
    </li>
  );
}
