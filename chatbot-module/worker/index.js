addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

let cache = { knowledge: null, time: 0 };

async function getKnowledge(url) {
  if (!url) return null;
  if (cache.knowledge && cache.time > Date.now() - 60000) return cache.knowledge;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    cache.knowledge = text;
    cache.time = Date.now();
    return text;
  } catch { return null; }
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });

  const url = new URL(request.url);
  if (url.pathname === "/health") return json({ ok: !!(GEMINI_API_KEY || OPENROUTER_API_KEY || AI_API_KEY_GROQ) });

  if (url.pathname === "/chat" && request.method === "POST") return handleChat(request);

  if (url.pathname === "/knowledge" && request.method === "GET") {
    const docUrl = typeof KNOWLEDGE_URL !== "undefined" ? KNOWLEDGE_URL : null;
    const content = docUrl ? await getKnowledge(docUrl) : null;
    return json({ knowledgeUrl: docUrl, content: content ? content.slice(0, 8000) : null });
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

    const docContent = await getKnowledge(
      knowledgeUrl || (typeof KNOWLEDGE_URL !== "undefined" ? KNOWLEDGE_URL : null)
    );

    let sys = "تو SoleBot هستی، دستیار کفش فروشی.\n" +
      "سلام: سلام! چطور می‌توانم کمک کنم؟\n" +
      "تشکر: خواهش می‌کنم. سوال دیگه‌ای دارید؟\n" +
      "چیز دیگه: فقط در مورد محصولات فروشگاه می‌توانم کمک کنم.\n" +
      "نمیدونم: اطلاعاتی در این مورد ندارم.\n" +
      "کوتاه جواب بده. از **bold** و `code` استفاده کن.";

    if (docContent) {
      const facts = docContent.replace(/قوانین[\s\S]*?:/g, "").replace(/دانشنامه.*?\n/, "").slice(0, 2000);
      sys += "\n\nحقایق فروشگاه:\n" + facts;
    }

    const his = (history || []).slice(-10);
    const msgs = [{ role: "system", content: sys }, ...his, { role: "user", content: message }];
    let reply = "";

    async function tryGemini(key) {
      const contents = [
        { role: "user", parts: [{ text: sys + "\n\nOk? Reply with: 'باشه، متوجه شدم.'" }] },
        { role: "model", parts: [{ text: "باشه، متوجه شدم." }] },
      ];
      for (const m of his) contents.push({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] });
      contents.push({ role: "user", parts: [{ text: message }] });
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=" + key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.1, maxOutputTokens: 800 } }),
      });
      if (res.status === 429 || !res.ok) return null;
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      let r = parts.filter(p => !p.thought).map(p => p.text).join("\n").trim();
      if (!r) {
        const lines = parts.map(p => p.text).join("\n").split("\n").filter(l => l.trim());
        r = lines.filter(l => l.match(/[\u0600-\u06FF]/) && !l.match(/^\s*[*\-\d.]/)).pop() || lines.pop() || "";
      }
      return r || null;
    }

    async function tryOpenRouter(apiKey) {
      const models = ["google/gemma-4-26b-a4b-it:free", "google/gemma-4-31b-it:free", "meta-llama/llama-3.3-70b-instruct:free"];
      for (const model of models) {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ model, messages: msgs, max_tokens: 400, temperature: 0.3 }),
        });
        if (!res.ok) continue;
        const text = (await res.json()).choices?.[0]?.message?.content || "";
        if (text.trim()) return text.trim();
      }
      return null;
    }

    async function tryGroq(apiKey) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "llama3-8b-8192", messages: msgs, temperature: 0.5, max_tokens: 400 }),
      });
      if (res.status === 429 || !res.ok) return null;
      return (await res.json()).choices?.[0]?.message?.content || null;
    }

    const preferred = (provider || "gemini").toUpperCase();
    const chain = preferred === "GROQ"
      ? ["tryGroq", "tryOpenRouter", "tryGemini"]
      : ["tryGemini", "tryOpenRouter", "tryGroq"];

    const funcs = { tryGemini, tryOpenRouter, tryGroq };
    const keys = { tryGemini: GEMINI_API_KEY, tryOpenRouter: OPENROUTER_API_KEY, tryGroq: AI_API_KEY_GROQ };

    for (const name of chain) {
      if (keys[name]) { reply = await funcs[name](keys[name]); if (reply) break; }
    }

    return json({ reply: reply || "" });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
