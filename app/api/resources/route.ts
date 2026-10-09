import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_QUERY_LENGTH = 160;
const MAX_RESULTS = 8;

type SerpApiResult = {
  title?: string;
  link?: string;
  snippet?: string;
  source?: string;
  displayed_link?: string;
};

function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || !("query" in body) || typeof body.query !== "string") {
      return NextResponse.json({ error: "Please provide a search topic." }, { status: 400 });
    }

    const query = body.query.trim().slice(0, MAX_QUERY_LENGTH);
    if (query.length < 2) {
      return NextResponse.json({ error: "Enter a topic with at least two characters." }, { status: 400 });
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Resource search is not configured yet. Add SERPAPI_KEY to the server environment." }, { status: 503 });
    }

    const params = new URLSearchParams({
      engine: "google",
      q: query,
      num: String(MAX_RESULTS),
      api_key: apiKey,
    });

    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      console.error("SerpApi returned status:", response.status);
      return NextResponse.json({ error: "Search is temporarily unavailable. Please try again." }, { status: 502 });
    }

    const data: { organic_results?: SerpApiResult[]; error?: string } = await response.json();
    if (data.error) {
      console.error("SerpApi search error:", data.error);
      return NextResponse.json({ error: "The search provider could not complete this request." }, { status: 502 });
    }

    const results = (data.organic_results ?? [])
      .filter((item) => typeof item.title === "string" && isSafeHttpUrl(item.link))
      .slice(0, MAX_RESULTS)
      .map((item) => ({
        title: item.title!.slice(0, 300),
        url: item.link!,
        snippet: typeof item.snippet === "string" ? item.snippet.slice(0, 700) : "Open this source to read more.",
        source: typeof item.source === "string"
          ? item.source.slice(0, 120)
          : typeof item.displayed_link === "string"
            ? item.displayed_link.slice(0, 120)
            : new URL(item.link!).hostname,
      }));

    return NextResponse.json({ query, results }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return NextResponse.json({ error: "Search took too long. Please try again." }, { status: 504 });
    }
    console.error("Resource search failed:", error);
    return NextResponse.json({ error: "Something went wrong while searching. Please try again." }, { status: 500 });
  }
}
