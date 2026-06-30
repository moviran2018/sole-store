export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return cors(preflight());
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/chat" && request.method === "POST") return handleChat(request, env);
    if (path === "/health") return cors(json({ ok: true }));

    return cors(json({ error: "not found" }, 404));
  },
};

async function handleChat(request, env) {
  try {
    const { message, history, provider, knowledge } = await request.json();
    if (!message?.trim()) return cors(json({ error: "message is required" }, 400));

    const activeProvider = provider || env.AI_PROVIDER || "groq";
    const apiKey = env[`AI_API_KEY_${activeProvider.toUpperCase()}`] || env.AI_API_KEY;
    if (!apiKey) return cors(json({ error: "API key not configured for " + activeProvider }, 500));

    const systemPrompt = buildSystemPrompt(env, knowledge);
    const reply = await callAI(activeProvider, apiKey, systemPrompt, message, history || []);

    return cors(json({ reply }));
  } catch (err) {
    return cors(json({ error: err.message }, 500));
  }
}

function buildSystemPrompt(env, knowledge) {
  const base = env.SYSTEM_PROMPT || "You are a helpful Persian AI assistant. Answer in Persian.";
  const kb = knowledge || env.KNOWLEDGE_BASE || "";
  if (kb) return base + "\n\n## KNOWLEDGE BASE\n" + kb;
  return base;
}

async function callAI(provider, apiKey, system, message, history) {
  const messages = [{ role: "system", content: system }, ...history, { role: "user", content: message }];

  switch (provider) {
    case "groq":
      return callGroq(apiKey, messages);
    case "openai":
      return callOpenAI(apiKey, messages);
    case "claude":
      return callClaude(apiKey, messages);
    default:
      return callGroq(apiKey, messages);
  }
}

async function callGroq(apiKey, messages) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "llama3-70b-8192", messages, temperature: 0.3, max_tokens: 2048 }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callOpenAI(apiKey, messages) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.3, max_tokens: 2048 }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI API error (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callClaude(apiKey, messages) {
  const system = messages.find((m) => m.role === "system")?.content || "";
  const chatMessages = messages.filter((m) => m.role !== "system").map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-3-haiku-20240307", system, messages: chatMessages, max_tokens: 2048 }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Claude API error (${res.status}): ${err}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

function preflight() {
  return new Response(null, { status: 204 });
}

function cors(res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  return res;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
