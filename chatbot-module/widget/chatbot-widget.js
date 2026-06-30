(function () {
  "use strict";

  const SCRIPT = document.currentScript;
  const WORKER_URL = SCRIPT?.getAttribute("data-worker") || "";
  const SITE_ID = SCRIPT?.getAttribute("data-site") || "";
  const LANG = SCRIPT?.getAttribute("data-lang") || "fa";
  const PROVIDER = SCRIPT?.getAttribute("data-provider") || "groq";
  const TITLE = SCRIPT?.getAttribute("data-title") || "SoleBot";
  const WELCOME = SCRIPT?.getAttribute("data-welcome") || "سلام! چطور می‌توانم کمک کنم؟";

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
#cb-send{background:#f97316;color:#fff;border:none;border-radius:10px;width:42px;height:42px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
#cb-send:hover{background:#ea580c}
#cb-send:disabled{opacity:.4;cursor:default}
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
          <button id="cb-send" disabled>➤</button>
        </div>
      </div>`;
    document.body.appendChild(container);

    const btn = document.getElementById("cb-btn");
    const panel = document.getElementById("cb-panel");
    const close = document.getElementById("cb-close");
    const input = document.getElementById("cb-input");
    const send = document.getElementById("cb-send");
    const msgs = document.getElementById("cb-messages");

    btn.onclick = () => panel.classList.add("open");
    close.onclick = () => panel.classList.remove("open");
    input.oninput = () => { send.disabled = !input.value.trim(); };
    input.onkeydown = (e) => { if (e.key === "Enter") sendMsg(); };
    send.onclick = sendMsg;

    return { btn, panel, close, input, send, msgs };
  }

  function escHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function formatText(text) {
    let html = escHtml(text);
    html = html.replace(/\/products\/([\w-]+)/g, '<a href="/products/$1">🔗 مشاهده محصول</a>');
    html = html.replace(/https?:\/\/[^\s<)]+/g, (u) => `<a href="${u}" target="_blank">${u}</a>`);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\n/g, "<br/>");
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

  async function sendMsg() {
    const input = document.getElementById("cb-input");
    const send = document.getElementById("cb-send");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    send.disabled = true;

    addMessage("user", text);
    showLoading();

    try {
      const payload = { message: text, history: state.messages.slice(-20), provider: PROVIDER };
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

  addMessage("bot", WELCOME);

  injectStyles();
  const dom = createDOM();
  dom.input.focus();

  function botReply(q, products, knowledge) {
    const query = q.toLowerCase();
    const brandAliases = {
      nike: ["نایک"], adidas: ["آدیداس"], puma: ["پوما"],
      reebok: ["ریباک"], "new balance": ["نیوبالانس"],
      asics: ["آسیکس"], converse: ["کانورس"], vans: ["ونس"],
      underarmour: ["آندرآرمور"],
    };

    if (!products || !products.length) return "در حال بارگذاری اطلاعات فروشگاه... لطفاً کمی صبر کنید.";

    const matched = products.filter((p) => {
      if (query.includes((p.namePersian || "").toLowerCase())) return true;
      if (query.includes((p.name || "").toLowerCase())) return true;
      if (query.includes((p.brand || "").toLowerCase())) return true;
      const aliases = brandAliases[(p.brand || "").toLowerCase()];
      return aliases && aliases.some((a) => query.includes(a));
    }).slice(0, 3);

    if (matched.length) {
      return matched.map((p) =>
        `**${p.namePersian || p.name}** (${p.brand}) - ${(p.price || 0).toLocaleString("fa-IR")} تومان\nبرای مشاهده: /products/${p.id}`
      ).join("\n\n");
    }

    return "سوال شما رو متوجه نشدم. می‌توانم درباره محصولات، برندها و قیمت‌ها کمک کنم.";
  }

  function loadKnowledge(url) {
    return fetch(url).then((r) => r.json()).then((data) => {
      state.products = data.products || [];
      state.knowledge = data.knowledge || [];
    }).catch(() => {});
  }

  const kbUrl = SCRIPT?.getAttribute("data-knowledge");
  if (kbUrl) loadKnowledge(kbUrl);
})();
