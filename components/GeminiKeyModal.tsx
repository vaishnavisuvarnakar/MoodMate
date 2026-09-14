"use client";

import { useState } from "react";
import { Card, Button } from "./ui";
import { useGeminiKey } from "@/lib/storage";

export function GeminiKeyModal({ onClose }: { onClose: () => void }) {
  const { setKey } = useGeminiKey();
  const [value, setValue] = useState("");

  function submit() {
    if (!value.trim()) return;
    setKey(value.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h3 className="font-bold text-lg mb-2">Connect your Gemini API key</h3>
        <p className="text-sm text-on-surface-variant mb-4">
          MoodMate uses Google&apos;s Gemini (free tier) to power AI chat and insights. Your key is
          used only in this browser session — it&apos;s never saved or sent anywhere else.
        </p>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Paste your Gemini API key"
          className="w-full rounded-2xl bg-surface-container-low border border-outline-variant/40 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container mb-4"
        />
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-on-surface-variant underline block mb-4"
        >
          Get a free key from Google AI Studio →
        </a>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!value.trim()}>
            Connect
          </Button>
        </div>
      </Card>
    </div>
  );
}
