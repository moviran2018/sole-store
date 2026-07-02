"use client";

import { useState, useEffect } from "react";
import { getKnowledgeBase, addKnowledge, deleteKnowledge, type KnowledgeEntry, type KnowledgeMedia } from "@/lib/knowledge";
import { getChatbotSettings, saveChatbotSettings, loadChatbotSettings } from "@/lib/chatbot-settings";

const entryTypes = [
  { id: "faq", label: "سوالات متداول" },
  { id: "policy", label: "قوانین" },
  { id: "product_info", label: "اطلاعات محصولات" },
  { id: "shipping", label: "حمل و نقل" },
  { id: "custom", label: "سفارشی" },
];

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<KnowledgeEntry | null>(null);
  const [form, setForm] = useState({ title: "", content: "", type: "faq", tags: "", imageLinks: "", audioLinks: "", videoLinks: "", documentLinks: "", driveLinks: "" });
  const [sysPrompt, setSysPrompt] = useState("");
  const [sysPromptOpen, setSysPromptOpen] = useState(false);
  const [sysPromptSaving, setSysPromptSaving] = useState(false);
  const [uiSettings, setUiSettings] = useState({ showChatbot: true, showAiStatus: true });
  const [uiOpen, setUiOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sole_ui_settings") || "{}");
      setUiSettings({ showChatbot: stored.showChatbot !== false, showAiStatus: stored.showAiStatus !== false });
    } catch {}
  }, []);

  const saveUiSettings = (next: typeof uiSettings) => {
    setUiSettings(next);
    localStorage.setItem("sole_ui_settings", JSON.stringify(next));
  };

  useEffect(() => { getKnowledgeBase().then(setEntries); }, []);

  useEffect(() => {
    loadChatbotSettings().then((s) => setSysPrompt(s.systemPrompt));
  }, []);

  const resetForm = () => setForm({ title: "", content: "", type: "faq", tags: "", imageLinks: "", audioLinks: "", videoLinks: "", documentLinks: "", driveLinks: "" });

  const handleEdit = (e: KnowledgeEntry) => {
    setEditing(e);
    setForm({
      title: e.title, content: e.content, type: e.type, tags: e.tags.join(", "),
      imageLinks: e.media?.imageLinks?.join("\n") || "",
      audioLinks: e.media?.audioLinks?.join("\n") || "",
      videoLinks: e.media?.videoLinks?.join("\n") || "",
      documentLinks: e.media?.documentLinks?.join("\n") || "",
      driveLinks: e.media?.driveLinks?.join("\n") || "",
    });
    setShowForm(true);
  };

  const parseLinks = (text: string): string[] => text.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("http"));

  const handleSave = async () => {
    if (!form.title || !form.content) return alert("عنوان و متن را وارد کنید");

    const imageLinks = parseLinks(form.imageLinks);
    const audioLinks = parseLinks(form.audioLinks);
    const videoLinks = parseLinks(form.videoLinks);
    const documentLinks = parseLinks(form.documentLinks);
    const driveLinks = parseLinks(form.driveLinks);
    const media: KnowledgeMedia | undefined = (imageLinks.length || audioLinks.length || videoLinks.length || documentLinks.length || driveLinks.length)
      ? { imageLinks, audioLinks, videoLinks, documentLinks, driveLinks }
      : undefined;

    const entry: KnowledgeEntry = {
      id: editing?.id || `k-${Date.now().toString(36)}`,
      title: form.title,
      content: form.content,
      type: form.type as KnowledgeEntry["type"],
      tags: form.tags.split(/[,\s]+/).filter(Boolean),
      createdAt: editing?.createdAt || new Date().toISOString(),
      media,
    };
    await addKnowledge(entry);
    setEditing(null);
    setShowForm(false);
    resetForm();
    setEntries(await getKnowledgeBase());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف شود؟")) return;
    await deleteKnowledge(id);
    setEntries(await getKnowledgeBase());
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <span className="text-orange-400 font-semibold text-sm">—— مدیریت دانشنامه ——</span>
          <h1 className="text-2xl font-bold text-white mt-1">{entries.length} مدخل</h1>
          <p className="text-xs text-gray-500 mt-1">این اطلاعات به چت‌بات هوشمند سایت داده میشود</p>
        </div>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(!showForm); }}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-orange-600/25">
          {showForm ? "بستن" : "+ افزودن مدخل"}
        </button>
      </div>

      {/* ---------- System Prompt Section ---------- */}
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-2xl mb-6 overflow-hidden">
        <button onClick={() => setSysPromptOpen(!sysPromptOpen)}
          className="w-full flex items-center justify-between p-4 text-right">
          <div>
            <span className="text-orange-400 font-semibold text-sm">🤖 تنظیمات سیستم پرامپت چت‌بات</span>
            <p className="text-xs text-gray-500 mt-0.5">شخصیت، لحن، قوانین و نحوه برخورد با مشتری را تعریف کنید</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 text-gray-400 transition-transform ${sysPromptOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {sysPromptOpen && (
          <div className="px-4 pb-4 space-y-3">
            <p className="text-[10px] text-gray-600 leading-relaxed">
              این متن به عنوان <strong className="text-gray-400">System Prompt</strong> اصلی به مدل هوش مصنوعی فرستاده میشود.
              شخصیت، لحن، محدودیت‌ها و نحوه پاسخگویی ربات را تعریف کنید. 
              اگر خالی بماند، از پرامپت پیش‌فرض استفاده میشود.
            </p>
            <textarea value={sysPrompt} onChange={(e) => setSysPrompt(e.target.value)} rows={8} dir="rtl"
              placeholder="مثال: تو یک دستیار فروش حرفه‌ای هستی. با لحنی گرم و دوستانه با مشتری صحبت کن. همیشه قیمت را به تومان اعلام کن و لینک محصول را هم بده. اگر مشتری عصبانی است، اول عذرخواهی کن..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
            <div className="flex items-center gap-3">
              <button onClick={async () => {
                setSysPromptSaving(true);
                await saveChatbotSettings({ systemPrompt: sysPrompt });
                setSysPromptSaving(false);
              }} disabled={sysPromptSaving}
                className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all">
                {sysPromptSaving ? "در حال ذخیره..." : "💾 ذخیره سیستم پرامپت"}
              </button>
              <span className="text-[10px] text-gray-600">{(sysPrompt.length || 0).toLocaleString("fa-IR")} کاراکتر</span>
            </div>
          </div>
        )}
      </div>

      {/* ---------- UI Settings Section ---------- */}
      <div className="bg-gray-900/20 border border-gray-800/50 rounded-2xl mb-6 overflow-hidden">
        <button onClick={() => setUiOpen(!uiOpen)}
          className="w-full flex items-center justify-between p-4 text-right">
          <div>
            <span className="text-orange-400 font-semibold text-sm">👁️ نمایش چت‌بات و وضعیت هوش مصنوعی</span>
            <p className="text-xs text-gray-500 mt-0.5">نمایش دکمه چت‌بات و نشانگر وضعیت اتصال AI را برای کاربران کنترل کنید</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 text-gray-400 transition-transform ${uiOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {uiOpen && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-[10px] text-gray-600 leading-relaxed">
              این تنظیمات در <strong className="text-gray-400">localStorage</strong> ذخیره میشوند و بلافاصله برای کاربران اعمال میگردند.
            </p>
            <label className="flex items-center justify-between p-3 bg-gray-900/40 border border-gray-800/50 rounded-xl cursor-pointer">
              <div>
                <span className="text-white text-sm font-medium">نمایش دکمه چت‌بات</span>
                <p className="text-[10px] text-gray-500">دکمه شناور چت‌بات را در سایت نشان بده</p>
              </div>
              <div onClick={() => saveUiSettings({ ...uiSettings, showChatbot: !uiSettings.showChatbot })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${uiSettings.showChatbot ? "bg-orange-500" : "bg-gray-700"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${uiSettings.showChatbot ? "translate-x-5" : ""}`} />
              </div>
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-900/40 border border-gray-800/50 rounded-xl cursor-pointer">
              <div>
                <span className="text-white text-sm font-medium">نمایش نشانگر وضعیت AI</span>
                <p className="text-[10px] text-gray-500">نقطه سبز/قرمز وضعیت اتصال به هوش مصنوعی روی دکمه چت‌بات</p>
              </div>
              <div onClick={() => saveUiSettings({ ...uiSettings, showAiStatus: !uiSettings.showAiStatus })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${uiSettings.showAiStatus ? "bg-orange-500" : "bg-gray-700"}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${uiSettings.showAiStatus ? "translate-x-5" : ""}`} />
              </div>
            </label>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">{editing ? "ویرایش مدخل" : "مدخل جدید"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">عنوان</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} dir="rtl"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">نوع</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50">
                {entryTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">برچسب‌ها (با کاما جدا کنید)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} dir="rtl" placeholder="مثلاً: قیمت, ارسال, تخفیف"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">متن</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} dir="rtl"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
          </div>

          {/* Media Links */}
          <div className="pt-2 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 mb-3">لینک‌های رسانه (هر لینک یک خط)</p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">تصاویر</label>
                <textarea value={form.imageLinks} onChange={(e) => setForm({ ...form, imageLinks: e.target.value })} rows={4} dir="ltr" placeholder="https://..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">صدا</label>
                <textarea value={form.audioLinks} onChange={(e) => setForm({ ...form, audioLinks: e.target.value })} rows={4} dir="ltr" placeholder="https://..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">ویدیو</label>
                <textarea value={form.videoLinks} onChange={(e) => setForm({ ...form, videoLinks: e.target.value })} rows={4} dir="ltr" placeholder="https://..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">فایل‌ها (PDF, DOC, Excel)</label>
                <textarea value={form.documentLinks} onChange={(e) => setForm({ ...form, documentLinks: e.target.value })} rows={4} dir="ltr" placeholder="https://drive.google.com/..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Google Docs / Sheets / Drive</label>
                <textarea value={form.driveLinks} onChange={(e) => setForm({ ...form, driveLinks: e.target.value })} rows={4} dir="ltr" placeholder="https://docs.google.com/..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500/50" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">ذخیره</button>
            <button onClick={() => { setShowForm(false); setEditing(null); resetForm(); }} className="text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-gray-800 text-sm transition-all">انصراف</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.id} className="bg-gray-900/20 border border-gray-800/50 rounded-2xl p-4 hover:border-gray-700 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-white text-sm font-medium">{e.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-400">
                    {entryTypes.find((t) => t.id === e.type)?.label || e.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{e.content}</p>
                {e.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {e.tags.map((t) => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500">{t}</span>)}
                  </div>
                )}
                {e.media && (e.media.imageLinks.length > 0 || e.media.audioLinks.length > 0 || e.media.videoLinks.length > 0 || e.media.documentLinks.length > 0 || e.media.driveLinks.length > 0) && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {e.media.imageLinks.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400">🖼 {e.media.imageLinks.length} تصویر</span>}
                    {e.media.audioLinks.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400">🎵 {e.media.audioLinks.length} صدا</span>}
                    {e.media.videoLinks.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400">🎬 {e.media.videoLinks.length} ویدیو</span>}
                    {e.media.documentLinks.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400">📄 {e.media.documentLinks.length} فایل</span>}
                    {e.media.driveLinks.length > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-900/30 text-yellow-400">☁️ {e.media.driveLinks.length} Drive</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(e)} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded-lg bg-blue-500/10 transition-colors">ویرایش</button>
                <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg bg-red-500/10 transition-colors">حذف</button>
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">هنوز مدخلی اضافه نشده. یک مدخل دانش اضافه کنید تا چت‌بات هوشمند شود.</div>
        )}
      </div>
    </div>
  );
}
