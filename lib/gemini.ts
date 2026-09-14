const MODEL = "gemini-3.6-flash";

export async function askGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    if (res.status === 400 || res.status === 403) {
      throw new Error("That API key doesn't seem to work. Please check it and try again.");
    }
    throw new Error(`Gemini request failed (${res.status}). ${errBody.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ??
    undefined;

  if (!text) {
    throw new Error("MoodMate couldn't generate a reply just now. Try again.");
  }
  return text.trim();
}
