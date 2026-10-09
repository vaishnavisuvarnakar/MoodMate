"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

type Resource = {
  title: string;
  url: string;
  snippet: string;
  source: string;
};

const SUGGESTIONS = [
  "Mindful journaling",
  "Gratitude journaling prompts",
  "Building a journaling habit",
  "Mindfulness for students",
];

export default function ResourcesPage() {
  const [query, setQuery] = useState("Mindful journaling");
  const [results, setResults] = useState<Resource[]>([]);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function searchResources(event?: FormEvent<HTMLFormElement>, suggestedQuery?: string) {
    event?.preventDefault();
    const topic = (suggestedQuery ?? query).trim();

    if (topic.length < 2) {
      setError("Enter a topic with at least two characters.");
      return;
    }

    setQuery(topic);
    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(false);

    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: topic }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unable to search for resources right now.");

      setResults(Array.isArray(data.results) ? data.results : []);
      setSearchedQuery(topic);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="Discover resources" subtitle="Small steps, thoughtful reads, and space to reflect." showMascot />

      <section className="mb-6 rounded-3xl border border-outline-variant/40 bg-gradient-to-br from-primary-container/30 to-tertiary-container/20 p-5 md:p-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">Your mindful corner 🌿</p>
        <h2 className="mb-3 text-2xl font-extrabold md:text-3xl">Find something that helps you grow.</h2>
        <p className="mb-6 max-w-2xl text-sm leading-6 text-on-surface-variant">
          Explore articles, practical guides, and ideas for mindful journaling, reflection, and healthier everyday habits.
        </p>

        <form onSubmit={(event) => void searchResources(event)} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="resource-query" className="sr-only">Search for resources</label>
          <input
            id="resource-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={160}
            placeholder="What would you like to explore?"
            className="min-w-0 flex-1 rounded-2xl border border-outline-variant/50 bg-surface-container-low px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-container"
          />
          <button type="submit" disabled={loading || query.trim().length < 2}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Searching…" : "Find resources"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button key={suggestion} type="button" disabled={loading}
              onClick={() => { setQuery(suggestion); void searchResources(undefined, suggestion); }}
              className="rounded-full border border-outline-variant/50 px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50">
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <section className="mb-6 rounded-2xl border border-error/30 bg-surface p-5" role="alert">
          <p className="text-sm text-on-surface">{error}</p>
          <button type="button" onClick={() => void searchResources()} disabled={loading}
            className="mt-3 rounded-xl border border-outline-variant px-4 py-2 text-sm font-bold hover:bg-surface-container disabled:opacity-50">
            Try again
          </button>
        </section>
      )}

      {loading && (
        <section className="rounded-2xl border border-outline-variant/40 bg-surface p-5" role="status" aria-live="polite">
          <p className="mb-2 font-bold">Finding thoughtful reads…</p>
          <p className="text-sm text-on-surface-variant">Searching the web for resources related to your topic.</p>
          <div className="mt-5 animate-pulse space-y-3">
            <div className="h-4 w-3/4 rounded bg-surface-container" />
            <div className="h-3 w-full rounded bg-surface-container" />
            <div className="h-3 w-5/6 rounded bg-surface-container" />
          </div>
        </section>
      )}

      {!loading && hasSearched && (
        <section aria-live="polite">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">Your reading list</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Results for “{searchedQuery}”</p>
            </div>
            <span className="text-xs text-on-surface-variant">{results.length} found</span>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5">
              <p className="mb-2 font-bold">No results this time</p>
              <p className="text-sm text-on-surface-variant">Try a broader topic or choose one of the suggestions above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {results.map((resource, index) => (
                <article key={resource.url + index} className="flex flex-col rounded-2xl border border-outline-variant/40 bg-surface p-5">
                  <p className="mb-3 text-xs font-semibold text-tertiary">{resource.source}</p>
                  <h3 className="mb-3 text-base font-bold leading-6">{resource.title}</h3>
                  <p className="flex-1 text-sm leading-6 text-on-surface-variant">{resource.snippet}</p>
                  <div className="mt-5 border-t border-outline-variant/30 pt-4">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                      Read source <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {!loading && !hasSearched && !error && (
        <section className="rounded-2xl border border-outline-variant/40 bg-surface p-5">
          <p className="mb-2 font-bold">A gentle place to begin</p>
          <p className="text-sm leading-6 text-on-surface-variant">
            Search for mindful journaling prompts, gratitude exercises, or ways to make reflection a comfortable daily habit. Choose what feels useful to you, and leave the rest.
          </p>
        </section>
      )}

      <p className="mt-6 px-1 text-xs leading-5 text-on-surface-variant">
        Resources are discovered from external websites and are for general educational purposes, not a substitute for professional mental health care.
      </p>
    </AppShell>
  );
}
