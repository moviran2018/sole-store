addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

let cache = { knowledge: null, time: 0 };

async function getKnowledge(url) {
  if (!url) return null;
  if (cache.knowledge && cache.time > Date.now() - 60000) return cache.knowledge;
  try {
    const res = await fetch(url);
    const text = await res.text();
    cache.knowledge = text;
    cache.time = Date.now();
    return text;
  } catch { return null; }
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });

  const url = new URL(request.url);
  if (url.pathname === "/health") return json({ ok: true, keySet: !!AI_API_KEY_GROQ });

  if (url.pathname === "/chat" && request.method === "POST") return handleChat(request);

  if (url.pathname === "/knowledge" && request.method === "GET") {
    return json({ knowledgeUrl: typeof KNOWLEDGE_URL !== "undefined" ? KNOWLEDGE_URL : null });
  }

  if (url.pathname === "/transcribe" && request.method === "POST") return handleTranscribe(request);

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

async function handleTranscribe(request) {
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    if (!audio) return json({ error: "audio file required" }, 400);
    const apiKey = AI_API_KEY_GROQ;
    if (!apiKey) return json({ error: "Groq API key not configured" }, 500);
    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: (() => {
        const fd = new FormData();
        fd.append("file", audio, "recording.webm");
        fd.append("model", "whisper-large-v3-turbo");
        fd.append("language", "fa");
        return fd;
      })(),
    });
    if (!res.ok) throw new Error(`Transcribe error (${res.status}): ${await res.text().catch(() => "")}`);
    const data = await res.json();
    return json({ text: data.text || "" });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

async function handleChat(request) {
  try {
    const { message, history, provider, knowledgeUrl } = await request.json();
    if (!message?.trim()) return json({ error: "message is required" }, 400);

    const p = (provider || "groq").toUpperCase();
    const apiKey = p === "GROQ" ? AI_API_KEY_GROQ : p === "OPENAI" ? AI_API_KEY_OPENAI : AI_API_KEY_CLAUDE;
    if (!apiKey) return json({ error: `API key for ${p} not configured` }, 500);

    const docContent = await getKnowledge(
      knowledgeUrl || (typeof KNOWLEDGE_URL !== "undefined" ? KNOWLEDGE_URL : null)
    );

    let sys = "You are SoleBot, a Persian AI assistant for Sole Store (online shoe store). " +
      "Answer concisely in Persian using ONLY the provided data. " +
      "If the answer is not in the data, say exactly: 'اطلاعاتی در این مورد ندارم.' " +
      "DO NOT repeat yourself. DO NOT make up information.";

    if (docContent) sys += "\n\n## STORE INFO\n" + docContent.slice(0, 3000);

    const his = (history || []).slice(-10);
    const messages = [{ role: "system", content: sys }, ...his, { role: "user", content: message }];
    let reply;

    const body = {
      model: "llama3-8b-8192",
      messages,
      temperature: 0.5,
      max_tokens: 400,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    };

    if (p === "GROQ") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Groq error (${res.status}): ${await res.text().catch(() => "")}`);
      reply = (await res.json()).choices?.[0]?.message?.content || "";
    } else if (p === "OPENAI") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o-mini", ...body }),
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
        body: JSON.stringify({ model: "claude-3-haiku-20240307", system: sysMsg, messages: chatMsgs, max_tokens: 600 }),
      });
      if (!res.ok) throw new Error(`Claude error (${res.status}): ${await res.text().catch(() => "")}`);
      reply = (await res.json()).content?.[0]?.text || "";
    }

    return json({ reply });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
