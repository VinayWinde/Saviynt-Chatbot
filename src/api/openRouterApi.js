export async function openRouterCall(systemPrompt, userMsg, maxTokens = 2000) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const model =
    import.meta.env.VITE_OPENROUTER_MODEL ||
    "google/gemini-2.0-flash-exp:free";

  if (!apiKey) {
    throw new Error("Missing OpenRouter API key. Add VITE_OPENROUTER_API_KEY in .env");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-OpenRouter-Title": "SaviyntBot"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg }
      ]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenRouter HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}