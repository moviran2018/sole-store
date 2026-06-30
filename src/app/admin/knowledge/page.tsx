"use client";

import { useState, useEffect } from "react";
import { getKnowledgeBase, addKnowledge, deleteKnowledge, type KnowledgeEntry } from "@/lib/knowledge";

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
  const [form, setForm] = useState({ title: "", content: "", type: "faq", tags: "" });

  useEffect(() => { getKnowledgeBase().then(setEntries); }, []);

  const resetForm = () => setForm({ title: "", content: "", type: "faq", tags: "" });

  const handleEdit = (e: KnowledgeEntry) => {
    setEditing(e);
    setForm({ title: e.title, content: e.content, type: e.type, tags: e.tags.join(", ") });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return alert("عنوان و متن را وارد کنید");
    const entry: KnowledgeEntry = {
      id: editing?.id || `k-${Date.now().toString(36)}`,
      title: form.title,
      content: form.content,
      type: form.type as KnowledgeEntry["type"],
      tags: form.tags.split(/[,\s]+/).filter(Boolean),
      createdAt: editing?.createdAt || new Date().toISOString(),
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
