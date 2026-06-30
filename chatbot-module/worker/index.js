addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const url = new URL(request.url);
  if (url.pathname === "/health") return json({ ok: true, keySet: !!AI_API_KEY_GROQ });
  if (url.pathname === "/chat" && request.method === "POST") return handleChat(request);

  return json({ error: "not found" }, 404);
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

async function handleChat(request) {
  try {
    const { message, history, provider, knowledge } = await request.json();
    if (!message?.trim()) return json({ error: "message is required" }, 400);

    const p = (provider || "groq").toUpperCase();
    const apiKey = p === "GROQ" ? AI_API_KEY_GROQ : p === "OPENAI" ? AI_API_KEY_OPENAI : AI_API_KEY_CLAUDE;
    if (!apiKey) return json({ error: `API key for ${p} not configured` }, 500);

    const systemPrompt = (typeof SYSTEM_PROMPT !== "undefined" ? SYSTEM_PROMPT :
      "You are SoleBot, a Persian AI assistant for Sole Store. Answer ONLY about Sole Store products. "
    );
    const kb = knowledge || "";
    const sys = kb ? systemPrompt + "\n\n## STORE DATA\n" + kb : systemPrompt;

    const messages = [{ role: "system", content: sys }, ...(history || []), { role: "user", content: message }];
    let reply;

    if (p === "GROQ") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.3, max_tokens: 1024 }),
      });
      if (!res.ok) throw new Error(`Groq error (${res.status}): ${await res.text().catch(() => "")}`);
      reply = (await res.json()).choices?.[0]?.message?.content || "";
    } else if (p === "OPENAI") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.3, max_tokens: 1024 }),
      });
      if (!res.ok) throw new Error(`OpenAI error (${res.status}): ${await res.text().catch(() => "")}`);
      reply = (await res.json()).choices?.[0]?.message?.content || "";
    } else if (p === "CLAUDE") {
      const sysMsg = messages.find((m) => m.role === "system")?.content || "";
      const chatMsgs = messages.filter((m) => m.role !== "system").map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user", content: m.content,
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-3-haiku-20240307", system: sysMsg, messages: chatMsgs, max_tokens: 1024 }),
      });
      if (!res.ok) throw new Error(`Claude error (${res.status}): ${await res.text().catch(() => "")}`);
      reply = (await res.json()).content?.[0]?.text || "";
    }

    return json({ reply });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
