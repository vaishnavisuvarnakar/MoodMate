"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, FAB } from "@/components/ui";
import { useJournal, todayStr } from "@/lib/storage";
import type { JournalEntry } from "@/lib/types";

export default function JournalPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function openNew() {
    setEditing(null);
    setTitle("");
    setContent("");
    setComposing(true);
  }

  function openEdit(entry: JournalEntry) {
    setEditing(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setComposing(true);
  }

  function save() {
    if (!content.trim()) {
      setComposing(false);
      return;
    }
    if (editing) {
      updateEntry(editing.id, { title: title.trim() || "Untitled", content: content.trim() });
    } else {
      addEntry({ title: title.trim() || "Untitled", content: content.trim(), date: todayStr() });
    }
    setComposing(false);
  }

  return (
    <AppShell>
      <PageHeader title="Journal" subtitle="A private space to reflect." />

      {entries.length === 0 && (
        <Card>
          <p className="text-sm text-on-surface-variant">
            No entries yet. Tap + to write your first one.
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {entries.map((e) => (
          <Card key={e.id} className="cursor-pointer" >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0" onClick={() => openEdit(e)}>
                <p className="font-bold">{e.title}</p>
                <p className="text-xs text-on-surface-variant mb-2">{e.date}</p>
                <p className="text-sm text-on-surface-variant line-clamp-3 whitespace-pre-wrap">
                  {e.content}
                </p>
              </div>
              <button
                onClick={() => deleteEntry(e.id)}
                className="text-xs text-error px-2 py-1 rounded-lg hover:bg-error-container/40 shrink-0"
                aria-label="Delete entry"
              >
                ✕
              </button>
            </div>
          </Card>
        ))}
      </div>

      <FAB onClick={openNew} label="New journal entry" />

      {composing && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent font-bold text-lg mb-3 focus:outline-none border-b border-outline-variant/40 pb-2"
            />
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write what's on your mind..."
              rows={8}
              className="w-full bg-surface-container-low rounded-2xl p-4 text-sm focus:outline-none resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setComposing(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
