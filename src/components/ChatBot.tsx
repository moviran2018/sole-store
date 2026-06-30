"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getAiClient, hasAiConfigured } from "@/lib/ai-client";
import { getKnowledgeBase, buildKnowledgePrompt } from "@/lib/knowledge";
import type { Shoe } from "@/types/shoe";
import type { KnowledgeEntry } from "@/lib/knowledge";

interface Message {
  role: "user" | "bot";
  text: string;
}

function makeSystemPrompt(products: Shoe[], knowledgeEntries: KnowledgeEntry[]): string {
  const cats = [...new Set(products.map((s) => s.categoryPersian))];
  const brands = [...new Set(products.map((s) => s.brand))];
  const minP = Math.min(...products.map((s) => s.price));
  const maxP = Math.max(...products.map((s) => s.price));

  let prompt = `You are a Persian-speaking shoe store assistant for "Sole Store" (فروشگاه Sole).
CRITICAL: Answer ONLY about the store's products and policies. If asked about anything else, politely refuse.
Product range: ${cats.join(", ")}.
Brands: ${brands.join(", ")}.
Price range: ${minP.toLocaleString("fa-IR")} to ${maxP.toLocaleString("fa-IR")} تومان.
Total products: ${products.length}.
Use Persian (fa-IR). Be brief, friendly, and helpful.`;

  const knowledge = buildKnowledgePrompt(knowledgeEntries);
  if (knowledge) prompt += `\n\n--- STORE KNOWLEDGE BASE ---\n${knowledge}`;

  return prompt;
}

interface Props {
  products: Shoe[];
}

export default function ChatBot({ products }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "سلام! به فروشگاه Sole خوش آمدید. چطور می‌توانم کمکتان کنم؟ 🎯" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ai = getAiClient();

  useEffect(() => { getKnowledgeBase().then(setKnowledge); }, []);

  const sysPrompt = makeSystemPrompt(products, knowledge);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    if (ai) {
      try {
        const full = [...messages, { role: "user" as const, text: q }]
          .map((m) => `${m.role === "user" ? "مشتری" : "فروشنده"}: ${m.text}`)
          .join("\n");
        const reply = await ai.ask(sysPrompt, full);
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "bot", text: "متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید." }]);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: botReply(q, products, knowledge) }]);
        setLoading(false);
      }, 500);
    }
  }, [input, loading, messages, ai, sysPrompt, products]);

  return (
    <>
      {/* Toggle button */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105 transition-all grid place-items-center">
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <div className={`fixed bottom-20 left-5 z-50 w-[360px] max-w-[calc(100vw-40px)] h-[520px] max-h-[calc(100vh-160px)] bg-[#111] border border-gray-800 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-all duration-300 ${open ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}`}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gradient-to-r from-orange-600/10 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg shadow-lg shadow-orange-600/20">🤖</div>
          <div>
            <p className="text-sm font-semibold text-white">پشتیبان Sole</p>
            <p className="text-[10px] text-gray-500">{hasAiConfigured() ? "AI Assistant" : "راهنمای فروشگاه"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-orange-600/20 border border-orange-600/30 text-white"
                  : "bg-gray-800/50 border border-gray-700/50 text-gray-300"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="bg-gray-800/50 border border-gray-700/50 p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="سوال خود را بپرسید..." dir="rtl"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all" />
            <button onClick={handleSend} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white grid place-items-center transition-all shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          {!hasAiConfigured() && (
            <p className="text-[9px] text-gray-700 mt-1.5 text-center">
              پاسخ‌های پیش‌فرض • برای هوش مصنوعی، API Key در .env.local تنظیم کنید
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Fallback rule-based reply (when no AI configured) ── */
function botReply(q: string, products: Shoe[], knowledge: KnowledgeEntry[] = []): string {
  const query = q.toLowerCase();

  // Check knowledge base first
  for (const entry of knowledge) {
    const tags = entry.tags.map((t) => t.toLowerCase());
    const match = tags.some((t) => query.includes(t)) || query.includes(entry.title.toLowerCase());
    if (match) return entry.content;
  }

  if (/سلام|درود|خوبی|hello|hi/i.test(query)) {
    return "سلام! به فروشگاه Sole خوش آمدید. چطور می‌توانم کمکتان کنم؟ 😊";
  }

  if (/قیمت|قیمتها|ارزان|گران/i.test(query)) {
    const minP = Math.min(...products.map((s) => s.price));
    const maxP = Math.max(...products.map((s) => s.price));
    return `محصولات ما از ${minP.toLocaleString("fa-IR")} تا ${maxP.toLocaleString("fa-IR")} تومان متغیر هستند. می‌توانید با استفاده از فیلترهای سایت، محدوده قیمت دلخواه خود را انتخاب کنید.`;
  }

  if (/تخفیف|حراج|sale|شگفت‌انگیز/i.test(query)) {
    const saleItems = products.filter((s) => s.sale);
    if (saleItems.length === 0) return "در حال حاضر محصولی با تخفیف ویژه نداریم. برای اطلاع از آخرین تخفیف‌ها، صفحه اصلی سایت را دنبال کنید.";
    return `${saleItems.length} محصول با تخفیف ویژه داریم! 🎉 برای مشاهده، بخش "تخفیف‌های ویژه" در صفحه اصلی را ببینید.`;
  }

  if (/برند|brand/i.test(query)) {
    const brands = [...new Set(products.map((s) => s.brand))];
    return `برندهای موجود در فروشگاه:\n${brands.slice(0, 20).join("، ")}${brands.length > 20 ? " و..." : ""}`;
  }

  const catMap: Record<string, string[]> = {
    کتانی: ["sneakers"], sneaker: ["sneakers"],
    دویدن: ["running"], run: ["running"],
    رسمی: ["formal"], formal: ["formal"],
    چکمه: ["boots"], boot: ["boots"],
    صندل: ["sandals"], sandal: ["sandals"],
    پاشنه: ["heels"], heel: ["heels"],
    ورزشی: ["sport"], sport: ["sport"],
  };

  for (const [kw, cats] of Object.entries(catMap)) {
    if (query.includes(kw)) {
      const cat = cats[0];
      const catName = products.find((s) => s.category === cat)?.categoryPersian || cat;
      const count = products.filter((s) => s.category === cat).length;
      return `دسته ${catName} شامل ${count} محصول است. برای مشاهده، روی دسته ${catName} در صفحه اصلی کلیک کنید.`;
    }
  }

  return "سوال شما رو متوجه نشدم. می‌توانم درباره محصولات، برندها، قیمت‌ها، ارسال، بازگشت کالا و ساعت کاری به شما اطلاعات بدم. لطفاً سوالتون رو واضح‌تر بپرسید 🙏";
}
