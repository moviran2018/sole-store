(function () {
  "use strict";

  const SCRIPT = document.currentScript || document.querySelector("script[src*=\"chatbot-widget\"]");
  const WORKER_URL = SCRIPT?.getAttribute("data-worker") || "";
  const SITE_ID = SCRIPT?.getAttribute("data-site") || "";
  const LANG = SCRIPT?.getAttribute("data-lang") || "fa";
  const PROVIDER = SCRIPT?.getAttribute("data-provider") || "gemini";
  const TITLE = SCRIPT?.getAttribute("data-title") || "SoleBot";
  const WELCOME = SCRIPT?.getAttribute("data-welcome") || "سلام! چطور می‌توانم کمک کنم؟";
  const KNOWLEDGE_URL = SCRIPT?.getAttribute("data-knowledge-url") || "";

  if (!WORKER_URL) return console.warn("Chatbot: data-worker attribute required");

  let state = { messages: [], products: [], knowledge: [] };

  const KB_KEY = "chatbot_kb_" + SITE_ID;

  const css = `
#cb-container *{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,'Segoe UI',Tahoma,sans-serif;direction:rtl}
#cb-btn{position:fixed;bottom:20px;left:20px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3);z-index:999999;display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .2s}
#cb-btn:hover{transform:scale(1.08)}
#cb-panel{position:fixed;bottom:90px;left:20px;width:380px;max-height:600px;height:70vh;background:#1a1a2e;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.5);z-index:999998;display:none;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.08)}
#cb-panel.open{display:flex}
#cb-header{padding:14px 18px;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px;flex-shrink:0}
#cb-header span{flex:1}
#cb-close{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:0 4px}
#cb-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth}
#cb-messages::-webkit-scrollbar{width:4px}
#cb-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}
.cb-msg{max-width:88%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.6;white-space:pre-wrap;word-wrap:break-word}
.cb-user{align-self:flex-end;background:#f97316;color:#fff;border-bottom-right-radius:4px}
.cb-bot{align-self:flex-start;background:rgba(255,255,255,.07);color:#e0e0e0;border-bottom-left-radius:4px}
.cb-bot a{color:#f97316;text-decoration:underline}
.cb-time{font-size:10px;color:rgba(255,255,255,.35);margin-top:3px;text-align:left}
.cb-loading{align-self:flex-start;display:flex;gap:4px;padding:12px 16px;background:rgba(255,255,255,.07);border-radius:12px}
.cb-loading span{width:7px;height:7px;background:rgba(255,255,255,.4);border-radius:50%;animation:cb-bounce 1.2s infinite}
.cb-loading span:nth-child(2){animation-delay:.2s}
.cb-loading span:nth-child(3){animation-delay:.4s}
@keyframes cb-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
#cb-input-wrap{display:flex;gap:8px;padding:10px 14px;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0}
#cb-input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 14px;color:#fff;font-size:13px;outline:none;direction:rtl}
#cb-input:focus{border-color:#f97316}
#cb-input::placeholder{color:rgba(255,255,255,.3)}
#cb-send,#cb-mic{background:#f97316;color:#fff;border:none;border-radius:10px;width:42px;height:42px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
#cb-send:hover,#cb-mic:hover{background:#ea580c}
#cb-send:disabled{opacity:.4;cursor:default}
#cb-mic.recording{background:#ef4444;animation:cb-pulse .8s infinite}
@keyframes cb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@media(max-width:480px){#cb-panel{left:10px;right:10px;width:auto;bottom:80px;height:75vh}}
`;

  function injectStyles() {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
  }

  function createDOM() {
    const container = document.createElement("div");
    container.id = "cb-container";
    container.innerHTML = `
      <button id="cb-btn" aria-label="Chat">💬</button>
      <div id="cb-panel">
        <div id="cb-header">
          <span>🤖 ${escHtml(TITLE)}</span>
          <button id="cb-close">✕</button>
        </div>
        <div id="cb-messages"></div>
        <div id="cb-input-wrap">
          <input id="cb-input" type="text" placeholder="پیام خود را بنویسید..." />
          <button id="cb-mic" title="ضبط صدا (hold)">🎤</button>
          <button id="cb-send" disabled>➤</button>
        </div>
      </div>`;
    document.body.appendChild(container);

    const btn = document.getElementById("cb-btn");
    const panel = document.getElementById("cb-panel");
    const close = document.getElementById("cb-close");
    const input = document.getElementById("cb-input");
    const send = document.getElementById("cb-send");
    const mic = document.getElementById("cb-mic");
    const msgs = document.getElementById("cb-messages");

    btn.onclick = () => panel.classList.add("open");
    close.onclick = () => panel.classList.remove("open");
    input.oninput = () => { send.disabled = !input.value.trim(); };
    input.onkeydown = (e) => { if (e.key === "Enter") sendMsg(); };
    send.onclick = sendMsg;

    let recognition = null, recording = false;

    function useBrowserSpeech() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      return !!SpeechRecognition;
    }

    function startVoice() {
      if (recording) return;
      recording = true;
      mic.classList.add("recording");

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = "fa-IR";
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.onresult = (e) => {
          const txt = e.results[0][0].transcript;
          if (txt) sendMsgText(txt);
          cleanupVoice();
        };
        recognition.onerror = () => { cleanupVoice(); };
        recognition.onend = () => { cleanupVoice(); };
        recognition.start();
      } else {
        cleanupVoice();
        alert("مرورگر شما از تشخیص صدای خودکار پشتیبانی نمی‌کند.");
      }
    }

    function stopVoice() {
      if (recognition) { try { recognition.stop(); } catch (e) {} recognition = null; }
      cleanupVoice();
    }

    function cleanupVoice() {
      recording = false;
      mic.classList.remove("recording");
    }

    mic.addEventListener("mousedown", startVoice);
    mic.addEventListener("mouseup", stopVoice);
    mic.addEventListener("mouseleave", stopVoice);
    mic.addEventListener("touchstart", (e) => { e.preventDefault(); startVoice(); });
    mic.addEventListener("touchend", (e) => { e.preventDefault(); stopVoice(); });

    return { btn, panel, close, input, send, msgs, mic };
  }

  function escHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function formatText(text) {
    let html = escHtml(text);
    html = html.replace(/📦/g, "").replace(/🔗/g, "");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/^-{3,}\s*$/gm, "<hr>");
    html = html.replace(/^`{3}[\s\S]*?`{3}$/gm, (m) => {
      const code = m.replace(/^`{3}\w*\n?/, "").replace(/`{3}$/, "");
      return "<pre><code>" + code + "</code></pre>";
    });
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/^(\d+)\. (.+)$/gm, (m, n, li) => "</li><li>" + li);
    html = html.replace(/^[*-] (.+)$/gm, (m, li) => "</li><li>" + li);
    html = html.replace(/(<(?:li|h[12]3|blockquote)[^>]*>)/g, "__BLOCK__$1");
    html = html.split("__BLOCK__").map((seg) => {
      if (seg.startsWith("<li")) return seg.replace(/<\/li>/, "") + "</li>";
      return seg;
    }).join("");
    html = html.replace(/__BLOCK__/g, "");
    html = html.replace(/(?:<\/li>){2,}/g, "</li>");
    html = html.replace(/(<li>.*?<\/li>)/gs, (m) => {
      const items = m.match(/<li>.*?<\/li>/g);
      return items ? "<ul>" + items.join("") + "</ul>" : m;
    });
    html = html.replace(/\|(.+?)\|/g, (m) => {
      const cells = m.split("|").filter(Boolean).map((c) => "<td>" + c.trim() + "</td>").join("");
      return "<tr>" + cells + "</tr>";
    });
    html = html.replace(/(<tr>.*?<\/tr>)+/g, "<table>$&</table>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    html = html.replace(/\*(.+?)\*/g, "<i>$1</i>");
    html = html.replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}" target="_blank">${url}</a>`);
    html = html.replace(/\/products\/([\w-]+)/g, '<a href="/products/$1">🔗 مشاهده محصول</a>');
    html = html.replace(/\n/g, "<br>");
    html = html.replace(/(<(?:ul|ol|table|pre|blockquote|h[12]3|hr)[^>]*>)/g, "<br>$1");
    html = html.replace(/(<\/(?:ul|ol|table|pre|blockquote|h[12]3)>)/g, "$1<br>");
    html = html.replace(/(<br\s*\/?>\s*){3,}/g, "<br><br>");
    html = html.replace(/<br><\/(li|tr|td|th)>/g, "</$1>");
    html = html.replace(/<(li|tr|td|th)><br>/g, "<$1>");
    return html;
  }

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = "cb-msg cb-" + role;
    div.innerHTML = formatText(text);
    const time = document.createElement("div");
    time.className = "cb-time";
    time.textContent = new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
    div.appendChild(time);
    const msgs = document.getElementById("cb-messages");
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showLoading() {
    const div = document.createElement("div");
    div.className = "cb-loading";
    div.id = "cb-loading";
    div.innerHTML = "<span></span><span></span><span></span>";
    document.getElementById("cb-messages").appendChild(div);
  }

  function hideLoading() {
    const el = document.getElementById("cb-loading");
    if (el) el.remove();
  }

  async function sendMsgText(text) {
    if (!text?.trim()) return;
    addMessage("user", text);
    showLoading();
    try {
      const payload = { message: text, history: state.messages.slice(-10), provider: PROVIDER };
      if (KNOWLEDGE_URL) payload.knowledgeUrl = KNOWLEDGE_URL;
      if (state.products.length) payload.knowledge = JSON.stringify(state.products);
      const res = await fetch(WORKER_URL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      hideLoading();
      if (data.reply) {
        addMessage("bot", data.reply);
        state.messages.push({ role: "user", content: text }, { role: "assistant", content: data.reply });
      } else {
        const fallback = botReply(text, state.products, state.knowledge);
        addMessage("bot", fallback);
        state.messages.push({ role: "user", content: text }, { role: "assistant", content: fallback });
      }
    } catch {
      hideLoading();
      const fallback = botReply(text, state.products, state.knowledge);
      addMessage("bot", fallback);
      state.messages.push({ role: "user", content: text }, { role: "assistant", content: fallback });
    }
  }

  async function sendMsg() {
    const input = document.getElementById("cb-input");
    const send = document.getElementById("cb-send");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    send.disabled = true;
    await sendMsgText(text);
  }

  injectStyles();
  const dom = createDOM();
  addMessage("bot", WELCOME);
  dom.input.focus();

  function botReply(q, products, knowledge) {
    const query = q.toLowerCase();
    const brandAliases = {
      nike: ["نایک"], adidas: ["آدیداس"], puma: ["پوما"],
      reebok: ["ریباک"], "new balance": ["نیوبالانس"],
      asics: ["آسیکس"], converse: ["کانورس"], vans: ["ونس"],
      underarmour: ["آندرآرمور"],
    };

    let fallbackText = "سوال شما رو متوجه نشدم. می‌توانم درباره محصولات، برندها و قیمت‌ها کمک کنم.";

    if (knowledge && knowledge.length > 50) {
      const match = knowledge.split("\n").filter(l => l.includes(":") || l.includes(query)).slice(0, 3);
      if (match.length) return match.join("\n");
    }

    if (!products || !products.length) return "در حال بارگذاری اطلاعات فروشگاه... لطفاً کمی صبر کنید.";

    const matched = products.filter((p) => {
      const name = ((p.namePersian || p.name) + " " + (p.brand || "") + " " + (p.category || "")).toLowerCase();
      return brandAliases[query] ? brandAliases[query].some((a) => name.includes(a)) : name.includes(query);
    });

    if (matched.length) {
      return "محصولات مرتبط:\n" + matched.slice(0, 5).map((p) =>
        `**${p.namePersian || p.name}** (${p.brand}) - ${(p.price || 0).toLocaleString("fa-IR")} تومان\nبرای مشاهده: /products/${p.id}`
      ).join("\n\n");
    }

    if (knowledge && knowledge.length > 50) return knowledge.slice(0, 300);
    return fallbackText;
  }

  function loadKnowledge(url) {
    return fetch(url).then((r) => r.json()).then((data) => {
      state.products = data.products || [];
    }).catch(() => {});
  }

  const kbUrl = SCRIPT?.getAttribute("data-knowledge");
  if (kbUrl) loadKnowledge(kbUrl);

  fetch(WORKER_URL + "/knowledge").then(r => r.json()).then(d => {
    if (d.content) state.knowledge = d.content;
  }).catch(() => {});
})();
