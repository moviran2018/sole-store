"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAiClient, hasAiConfigured } from "@/lib/ai-client";
import { getKnowledgeBase, buildKnowledgePrompt } from "@/lib/knowledge";
import { getAllShoes } from "@/lib/shoe-store";
import type { Shoe } from "@/types/shoe";
import type { KnowledgeEntry } from "@/lib/knowledge";

interface Message {
  role: "user" | "bot";
  text: string;
}

function makeProductCatalog(products: Shoe[]): string {
  const byCategory = new Map<string, Shoe[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  let catalog = "## PRODUCT CATALOG\n";
  for (const [cat, items] of byCategory) {
    const persian = items[0]?.categoryPersian || cat;
    catalog += `\n### ${persian} (${items.length} products)\n`;
    const top = items.slice(0, 5);
    for (const p of top) {
      const flags = [];
      if (p.new) flags.push("جدید");
      if (p.sale) flags.push(`تخفیف ${p.discount}%`);
      if (p.featured) flags.push("ویژه");
      const tag = flags.length ? ` [${flags.join(", ")}]` : "";
      const priceDisplay = p.sale && p.discount
        ? `${(p.price * (1 - p.discount / 100)).toLocaleString("fa-IR")} تومان`
        : `${p.price.toLocaleString("fa-IR")} تومان`;
      catalog += `- **${p.namePersian}** (${p.brand}) - ${priceDisplay}${tag}\n  Link: /products/${p.id}\n`;
    }
    if (items.length > 5) catalog += `  ... and ${items.length - 5} more\n`;
  }
  return catalog;
}

function makeSystemPrompt(products: Shoe[], knowledgeEntries: KnowledgeEntry[]): string {
  const catList = [...new Set(products.map((s) => s.categoryPersian))].join(", ");
  const brandList = [...new Set(products.map((s) => s.brand))].join(", ");

  const catalog = makeProductCatalog(products);
  const knowledge = buildKnowledgePrompt(knowledgeEntries);

  return `You are SoleBot, a Persian AI assistant for Sole Store shoe shop.

## YOUR JOB
Answer customer questions ONLY about Sole Store products, policies, and services. Be friendly, concise, and helpful. Always use Persian (fa-IR).

## WHEN ASKED ABOUT PRODUCTS
Search the product catalog below. Recommend matching products with name, price, and link: /products/{id}. If none match, say you couldn't find an exact match.

## STORE INFO
- Categories: ${catList}
- Brands: ${brandList}
- ${products.length} products total
- Free shipping over 2,000,000 Toman, delivery 3-5 days
- 7-day return policy
- Payment: online via Zarinpal

## PRODUCT CATALOG
${catalog || "No products available."}

## STORE KNOWLEDGE BASE
${knowledge || "No additional information."}

## RULES
- Persian language only
- Always include /products/{id} links with product recommendations
- NEVER make up products or prices. Only use the catalog above.
- If the customer asks about profanity, respond: "❌ لطفاً محترمانه سوال خود را مطرح کنید."
- If the question is outside store scope, respond: "من فقط درباره محصولات و خدمات Sole میتونم کمک کنم."`;
}

interface Props {
  products: Shoe[];
}

/** Hook: press-and-hold voice recorder using the Web Speech API */
function useVoiceRecognition() {
  const recognitionRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const holdingRef = useRef(false);
  const transcriptRef = useRef("");
  const resultCbRef = useRef<((text: string) => void) | null>(null);
  const errorCbRef = useRef<(() => void) | null>(null);
  const sentRef = useRef(false);
  const stopRequestedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const sendTranscript = useCallback(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    setRecording(false);
    const txt = transcriptRef.current.trim();
    transcriptRef.current = "";
    if (txt) resultCbRef.current?.(txt);
  }, []);

  const createRecognition = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.lang = "fa-IR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcriptRef.current = event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = () => {
      holdingRef.current = false;
      setRecording(false);
      errorCbRef.current?.();
    };

    recognition.onend = () => {
      if (holdingRef.current && !stopRequestedRef.current) {
        const next = createRecognition();
        if (next) {
          recognitionRef.current = next;
          try { next.start(); } catch { }
        }
      } else {
        sendTranscript();
      }
    };

    return recognition;
  }, [sendTranscript]);

  const startListening = useCallback((onResult: (text: string) => void, onError?: () => void) => {
    if (typeof window === "undefined") return;
    resultCbRef.current = onResult;
    errorCbRef.current = onError || null;
    transcriptRef.current = "";
    sentRef.current = false;
    stopRequestedRef.current = false;
    holdingRef.current = true;

    const r = createRecognition();
    if (!r) return;
    recognitionRef.current = r;
    setRecording(true);
    r.start();
  }, [createRecognition]);

  const stopListening = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    stopRequestedRef.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
      recognitionRef.current = null;
    }
    setTimeout(() => sendTranscript(), 800);
  }, [sendTranscript]);

  return { recording, supported, startListening, stopListening };
}

export default function ChatBot({ products }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "سلام! به فروشگاه Sole خوش آمدید. چطور می‌توانم کمکتان کنم؟ 🎯" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Shoe[]>(products);
  const [knowledge, setKnowledge] = useState<KnowledgeEntry[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const micHoldRef = useRef(false);

  const ai = getAiClient();
  const { recording, supported: voiceSupported, startListening, stopListening } = useVoiceRecognition();

  // Load fresh data on mount
  useEffect(() => {
    getAllShoes().then(setAllProducts);
    getKnowledgeBase().then(setKnowledge);
  }, []);

  const sysPrompt = makeSystemPrompt(allProducts, knowledge);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const processUserText = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    if (containsProfanity(text)) {
      setMessages((prev) => [...prev, { role: "user", text },
        { role: "bot", text: "❌ لطفاً محترمانه و در چهارچوب اخلاقی سوال خود را مطرح فرمایید. از کلمات نامناسب استفاده نکنید." },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    if (ai) {
      try {
        const history = [...messagesRef.current, { role: "user" as const, text }];
        const chatMessages = history
          .filter((m) => m.role === "user" || m.role === "bot")
          .slice(-20)
          .map((m) => ({ role: m.role === "user" ? "user" as const : "assistant" as const, content: m.text }));
        const reply = await ai.ask(sysPrompt, chatMessages);
        setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "bot", text: "متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید." }]);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text: botReply(text, allProducts, knowledge) }]);
        setLoading(false);
      }, 500);
    }
  }, [loading, ai, sysPrompt, allProducts, knowledge]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    await processUserText(q);
  }, [input, loading, processUserText]);

  const handleVoiceResult = useCallback(async (text: string) => {
    setInput("");
    await processUserText(text);
  }, [processUserText]);

  const handleVoiceError = useCallback(() => {
    setMessages((prev) => [...prev, { role: "bot", text: "متأسفانه میکروفون در دسترس نیست. لطفاً متن سوال را تایپ کنید." }]);
  }, []);

  const handleMicPointerDown = useCallback(() => {
    micHoldRef.current = true;
    startListening(handleVoiceResult, handleVoiceError);
  }, [startListening, handleVoiceResult, handleVoiceError]);

  const handleMicPointerUp = useCallback(() => {
    if (micHoldRef.current) {
      micHoldRef.current = false;
      stopListening();
    }
  }, [stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopListening(); };
  }, [stopListening]);

  return (
    <>
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

      <div className={`fixed bottom-20 left-5 z-50 w-[360px] max-w-[calc(100vw-40px)] h-[520px] max-h-[calc(100vh-160px)] bg-[#111] border border-gray-800 rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-all duration-300 ${open ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}`}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-800 bg-gradient-to-r from-orange-600/10 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg shadow-lg shadow-orange-600/20">🤖</div>
          <div>
            <p className="text-sm font-semibold text-white">پشتیبان Sole</p>
            <p className="text-[10px] text-gray-500">{hasAiConfigured() ? "AI Assistant" : "راهنمای فروشگاه"}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-orange-600/20 border border-orange-600/30 text-white"
                  : "bg-gray-800/50 border border-gray-700/50 text-gray-300"
              }`}>
                {renderMessage(msg.text)}
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

        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="سوال خود را بپرسید..." dir="rtl"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-all" />

            {voiceSupported && (
              <button
                onMouseDown={handleMicPointerDown}
                onMouseUp={handleMicPointerUp}
                onMouseLeave={handleMicPointerUp}
                onTouchStart={handleMicPointerDown}
                onTouchEnd={handleMicPointerUp}
                disabled={loading}
                className={`relative w-10 h-10 rounded-xl grid place-items-center transition-all shrink-0 ${
                  recording
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
                title="برای صحبت کردن نگه دارید">
                {recording && (
                  <span className="absolute inset-0 rounded-xl animate-ping bg-red-500/30" />
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 relative z-10 ${recording ? "animate-pulse" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}

            <button onClick={handleSend} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white grid place-items-center transition-all shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          {!hasAiConfigured() && (
            <p className="text-[9px] text-gray-700 mt-1.5 text-center">
              پاسخ‌های پیش‌فرض • برای هوش مصنوعی، API Key تنظیم کنید
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Profanity filter ── */
const profanityList = [
  "کثافت", "کون", "کیر", "کس", "جنده", "حرومی", "حرومزاده", "مادرجنده", "پدرجنده",
  "خواهرجنده", "گایید", "گائید", "گا.", "آبکیر", "آشغال", "ننت", "ننه", "مادرتو",
  "مادرت", "پدسگ", "پدر سگ", "سگپدر", "سگ پدر", "خارکصه", "خارکس", "منگف",
  "ساک زدن", "ساکزدن", "لاپا", "خایه", "خایمال", "کصکش", "کصخل", "کسکش",
  "کس لیس", "کسلیس", "داف", "سکس", "فحش", "فحاشی", "bitch", "fuck", "shit",
  "asshole", "bastard", "whore", "damn", "cunt", "dick", "piss off",
];

function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase().replace(/[-\s]/g, "");
  for (const word of profanityList) {
    const pattern = word.toLowerCase().replace(/[-\s]/g, "");
    if (lower.includes(pattern)) return true;
  }
  return false;
}

/** Convert markdown-style links `/products/xxx` and media URLs to clickable elements */
function renderMessage(text: string): React.ReactNode {
  const parts = text.split(/(\/products\/[\w-]+|https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) => {
    const prodMatch = part.match(/^\/products\/([\w-]+)$/);
    if (prodMatch) {
      return <Link key={i} href={part} className="text-orange-400 hover:text-orange-300 underline text-xs">🔗 مشاهده محصول</Link>;
    }
    const urlMatch = part.match(/^(https?:\/\/[^\s)]+)$/);
    if (urlMatch) {
      const url = urlMatch[1];
      const ext = url.split("?")[0].toLowerCase();
      if (/\.(png|jpe?g|gif|svg|webp|bmp)$/i.test(ext)) {
        return <img key={i} src={url} alt="" className="max-w-full h-auto rounded-lg my-1" loading="lazy" />;
      }
      if (/\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(ext)) {
        return <audio key={i} controls className="w-full my-1" src={url} />;
      }
      if (/\.(mp4|webm|mov|avi|mkv)$/i.test(ext)) {
        return <video key={i} controls className="max-w-full h-auto rounded-lg my-1" src={url} />;
      }
      if (/docs\.google\.com\/(document|spreadsheets|presentation|forms)\//i.test(url)) {
        const label = url.includes("document") ? "📄 Google Docs" : url.includes("spreadsheets") ? "📊 Google Sheets" : url.includes("presentation") ? "📽 Google Slides" : "📋 Google Forms";
        return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline text-xs block my-1">{label}</a>;
      }
      if (/drive\.google\.com\//i.test(url)) {
        return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline text-xs block my-1">☁️ Google Drive</a>;
      }
      if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|csv|txt)$/i.test(ext)) {
        const icon = ext === "pdf" ? "📕" : ext.startsWith("doc") ? "📝" : ext.startsWith("xls") ? "📊" : ext.startsWith("ppt") ? "📽" : "📄";
        return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs block my-1">{icon} {ext.toUpperCase()}</a>;
      }
      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">{url}</a>;
    }
    return <span key={i}>{part}</span>;
  });
}

/** Extract the most relevant snippet from a large content based on user query */
function findRelevantSnippet(content: string, query: string): string {
  if (content.length < 600) return content;

  const cLower = content.toLowerCase();
  const qLower = query.toLowerCase();

  const idx = cLower.indexOf(qLower);
  if (idx !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + qLower.length + 300);
    let s = content.slice(start, end);
    if (start > 0) s = "... " + s;
    if (end < content.length) s = s + " ...";
    return s;
  }

  const words = qLower.split(/\s+/).filter((w) => w.length >= 3);
  for (const word of words) {
    const idx = cLower.indexOf(word);
    if (idx !== -1) {
      const start = Math.max(0, idx - 150);
      const end = Math.min(content.length, idx + word.length + 300);
      let s = content.slice(start, end);
      if (start > 0) s = "... " + s;
      if (end < content.length) s = s + " ...";
      return s;
    }
  }

  return content.slice(0, 500) + " ...";
}

/* ── Fallback rule-based reply ── */
function botReply(q: string, products: Shoe[], knowledge: KnowledgeEntry[] = []): string {
  const query = q.toLowerCase();

  // 1) Greeting
  if (/سلام|درود|خوبی|hello|hi/i.test(query)) {
    return "سلام! به فروشگاه Sole خوش آمدید. چطور می‌توانم کمکتان کنم؟ 😊";
  }

  // 2) Specific product search (by name or brand)
  const matched = products.filter((p) =>
    p.namePersian.includes(query) || p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
  ).slice(0, 3);
  if (matched.length > 0) {
    return matched.map((p) =>
      `**${p.namePersian}** (${p.brand}) - ${p.price.toLocaleString("fa-IR")} تومان\nبرای مشاهده: /products/${p.id}`
    ).join("\n\n");
  }

  // 3) Category-based search
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
      const items = products.filter((s) => s.category === cat).slice(0, 4);
      if (items.length === 0) return `دسته ${catName} محصولی ندارد.`;
      return `محصولات ${catName}:\n` + items.map((p) =>
        `- **${p.namePersian}** ${p.price.toLocaleString("fa-IR")} تومان\n  /products/${p.id}`
      ).join("\n");
    }
  }

  // 4) Sale / discount
  if (/تخفیف|حراج|sale|شگفت‌انگیز/i.test(query)) {
    const saleItems = products.filter((s) => s.sale);
    if (saleItems.length === 0) return "در حال حاضر تخفیفی نداریم.";
    return saleItems.slice(0, 5).map((p) =>
      `🔥 **${p.namePersian}** ${p.discount}% تخفیف! ${(p.price * (1 - (p.discount || 0) / 100)).toLocaleString("fa-IR")} تومان\n/products/${p.id}`
    ).join("\n\n") + `\n\n${saleItems.length > 5 ? `و ${saleItems.length - 5} محصول دیگر` : ""}`;
  }

  // 5) New arrivals
  if (/جدید|new/i.test(query)) {
    const newItems = products.filter((s) => s.new);
    if (newItems.length === 0) return "در حال حاضر محصول جدیدی نداریم.";
    return newItems.slice(0, 5).map((p) =>
      `🆕 **${p.namePersian}** - ${p.price.toLocaleString("fa-IR")} تومان\n/products/${p.id}`
    ).join("\n\n");
  }

  // 6) Price range
  if (/قیمت|قیمتها|ارزان|گران/i.test(query)) {
    const minP = Math.min(...products.map((s) => s.price));
    const maxP = Math.max(...products.map((s) => s.price));
    return `محصولات ما از ${minP.toLocaleString("fa-IR")} تا ${maxP.toLocaleString("fa-IR")} تومان هستند.`;
  }

  // 7) Brand list
  if (/برند|brand/i.test(query)) {
    const brands = [...new Set(products.map((s) => s.brand))];
    return `برندها: ${brands.slice(0, 25).join("، ")}${brands.length > 25 ? " و..." : ""}`;
  }

  // 8) Knowledge base – only as last resort, return relevant snippet
  for (const entry of knowledge) {
    const tags = entry.tags.map((t) => t.toLowerCase());
    const contentLower = entry.content.toLowerCase();
    const titleLower = entry.title.toLowerCase();
    const queryWords = query.split(/\s+/).filter((w) => w.length >= 4);
    const match = tags.some((t) => query.includes(t))
      || query.includes(titleLower)
      || contentLower.includes(query)
      || queryWords.some((w) => contentLower.includes(w));
    if (match) {
      let reply = findRelevantSnippet(entry.content, query);
      if (entry.media) {
        if (entry.media.imageLinks.length) reply += "\n\n" + entry.media.imageLinks.join("\n");
        if (entry.media.audioLinks.length) reply += "\n\n" + entry.media.audioLinks.join("\n");
        if (entry.media.videoLinks.length) reply += "\n\n" + entry.media.videoLinks.join("\n");
        if (entry.media.documentLinks.length) reply += "\n\n" + entry.media.documentLinks.join("\n");
        if (entry.media.driveLinks.length) reply += "\n\n" + entry.media.driveLinks.join("\n");
      }
      return reply;
    }
  }

  return "سوال شما رو متوجه نشدم. می‌توانم درباره محصولات، برندها، قیمت‌ها، تخفیف‌ها، ارسال و بازگشت کالا به شما اطلاعات بدم. 🙏";
}
