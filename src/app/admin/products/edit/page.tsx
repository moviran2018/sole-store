"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getShoeById, addShoe, getAllShoes, categories } from "@/lib/shoe-store";
import { shoeSvg } from "@/data/shoes";
import type { Shoe } from "@/types/shoe";

const catPrefix: Record<string, string> = {
  sneakers: "snk", formal: "frm", running: "run", casual: "csl",
  boots: "bt", sandals: "snd", loafers: "lf", slides: "sld",
  heels: "hl", sport: "spt",
};

const brands = ["Nike", "Adidas", "Puma", "New Balance", "Reebok", "Vans", "Asics", "Converse", "Under Armour", "Fila", "Mizuno", "Timberland", "Saucony", "Diadora", "Li-Ning", "Clarks", "Loake", "Barker", "Hush Puppies", "Florsheim", "Church's", "Allen Edmonds", "Sanders", "Ecco", "Magnanni", "Brooks", "Salomon", "Hoka", "Skechers", "Geox", "FitFlop", "Dr. Martens", "Toms", "Birkenstock", "Sanuk", "Merrell", "Blundstone", "Red Wing", "Sorel", "Columbia", "CAT", "Wolverine", "Reef", "Teva", "Rainbow", "Havaianas", "Chaco", "Xero", "Olukai", "G.H. Bass", "Tod's", "Alden", "Cole Haan", "Salvatore Ferragamo", "Hogan", "Gucci", "Jimmy Choo", "Christian Louboutin", "Sam Edelman", "Manolo Blahnik", "Steve Madden", "Stuart Weitzman", "Giuseppe Zanotti", "Nine West", "Tory Burch", "Kate Spade", "Wilson", "Lululemon"];

function EditForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const isNew = !id;

  const [form, setForm] = useState({
    id: "", name: "", namePersian: "", brand: "Nike", category: "sneakers",
    price: 890000, description: "", descriptionPersian: "",
    sizes: [40, 41, 42, 43], colors: ["#ffffff"],
    inStock: true, featured: false, new: false, sale: false, discount: 0,
    imageLinks: "", podcastLink: "", videoLink: "",
  });
  const [saving, setSaving] = useState(false);

  async function generateId(category: string): Promise<string> {
    const prefix = catPrefix[category] || "gen";
    const all = await getAllShoes();
    let max = 0;
    for (const s of all) {
      const m = s.id.match(new RegExp(`^${prefix}-(\\d+)$`));
      if (m) max = Math.max(max, parseInt(m[1]));
    }
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }

  useEffect(() => {
    if (id) {
      (async () => {
        const shoe = await getShoeById(id);
        if (shoe) {
          setForm({
            id: shoe.id, name: shoe.name, namePersian: shoe.namePersian,
            brand: shoe.brand, category: shoe.category, price: shoe.price,
            description: shoe.description, descriptionPersian: shoe.descriptionPersian,
            sizes: shoe.sizes, colors: shoe.colors.map((c) => c.hex),
            inStock: shoe.inStock, featured: shoe.featured || false,
            new: shoe.new || false, sale: shoe.sale || false, discount: shoe.discount || 0,
            imageLinks: shoe.imageLinks?.join("\n") || "", podcastLink: shoe.podcastLink || "", videoLink: shoe.videoLink || "",
          });
        }
      })();
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      generateId(form.category).then((newId) => setForm((f) => ({ ...f, id: newId })));
    }
  }, [form.category, id]);

  const cat = categories.find((c) => c.id === form.category);

  const handleSave = async () => {
    if (!form.namePersian || !form.name) return alert("نام محصول را وارد کنید");
    setSaving(true);
    const imageLinks = form.imageLinks.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    const shoe: Shoe = {
      id: form.id, name: form.name, namePersian: form.namePersian,
      description: form.description || "توضیحاتی وارد نشده",
      descriptionPersian: form.descriptionPersian || "توضیحاتی وارد نشده",
      price: form.price, category: form.category,
      categoryPersian: cat?.namePersian || form.category,
      sizes: form.sizes.length > 0 ? form.sizes : [40, 41, 42],
      colors: form.colors.map((hex) => ({ name: hex, hex })),
      image: shoeSvg(form.category, form.namePersian, 0, form.brand),
      images: [shoeSvg(form.category, form.namePersian, 1, form.brand), shoeSvg(form.category, form.namePersian, 2, form.brand), shoeSvg(form.category, form.namePersian, 3, form.brand)],
      brand: form.brand, rating: 4.0, inStock: form.inStock,
      featured: form.featured, new: form.new,
      sale: form.sale, discount: form.sale ? form.discount : undefined,
      imageLinks: imageLinks.length > 0 ? imageLinks : undefined,
      podcastLink: form.podcastLink || undefined,
      videoLink: form.videoLink || undefined,
    };
    await addShoe(shoe);
    setSaving(false);
    router.push("/admin/products");
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <span className="text-orange-400 font-semibold text-sm">—— {isNew ? "محصول جدید" : "ویرایش محصول"} ——</span>
        <h1 className="text-2xl font-bold text-white mt-1">{isNew ? "افزودن محصول جدید" : `ویرایش: ${form.namePersian}`}</h1>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <span className="text-sm text-gray-400">کد محصول:</span>
        <code className="text-orange-400 font-mono text-lg font-bold ltr">{form.id}</code>
        <button onClick={() => navigator.clipboard.writeText(form.id)}
          className="text-xs text-gray-500 hover:text-orange-400 transition-colors" title="کپی کد">
          📋 کپی
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">نام فارسی</label>
            <input value={form.namePersian} onChange={(e) => setForm({ ...form, namePersian: e.target.value })} dir="rtl"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">نام انگلیسی</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} dir="ltr"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">برند</label>
            <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50">
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">دسته‌بندی</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.namePersian}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">قیمت (تومان)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} dir="ltr"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">توضیحات فارسی</label>
            <textarea value={form.descriptionPersian} onChange={(e) => setForm({ ...form, descriptionPersian: e.target.value })} rows={3} dir="rtl"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">توضیحات انگلیسی</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} dir="ltr"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">سایزهای موجود</label>
            <input value={form.sizes.join(", ")} onChange={(e) => setForm({ ...form, sizes: e.target.value.split(/[,\s]+/).map(Number).filter(Boolean) })} dir="ltr" placeholder="مثلاً: 38, 39, 40, 41, 42"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">رنگ‌ها</label>
            <div className="flex gap-2 flex-wrap">
              {form.colors.map((hex, i) => (
                <div key={i} className="flex items-center gap-1 bg-gray-900 rounded-lg px-2 py-1 border border-gray-800">
                  <input type="color" value={hex} onChange={(e) => { const c = [...form.colors]; c[i] = e.target.value; setForm({ ...form, colors: c }); }}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                  <button onClick={() => setForm({ ...form, colors: form.colors.filter((_, j) => j !== i) })} className="text-red-400 text-xs">✕</button>
                </div>
              ))}
              <button onClick={() => setForm({ ...form, colors: [...form.colors, "#cccccc"] })} className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-lg hover:bg-orange-500/20">+ رنگ</button>
            </div>
          </div>
          {form.sale && (
            <div>
              <label className="text-sm text-gray-400 block mb-1">درصد تخفیف</label>
              <input type="number" min="1" max="99" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                className="w-24 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          )}
        </div>
      </div>

      {/* Media Links Section */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-4 sm:p-6 mt-6">
        <h3 className="text-sm font-semibold text-white mb-4">لینک‌های رسانه‌ای</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">لینک تصاویر اضافی</label>
            <textarea value={form.imageLinks} onChange={(e) => setForm({ ...form, imageLinks: e.target.value })} rows={3} dir="ltr" placeholder="هر لینک در یک خط"
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">لینک پادکست</label>
            <input value={form.podcastLink} onChange={(e) => setForm({ ...form, podcastLink: e.target.value })} dir="ltr" placeholder="https://..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">لینک ویدیو</label>
            <input value={form.videoLink} onChange={(e) => setForm({ ...form, videoLink: e.target.value })} dir="ltr" placeholder="https://..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-500/50" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
        {[
          { key: "inStock", label: "موجود" },
          { key: "featured", label: "ویژه" },
          { key: "new", label: "جدید" },
          { key: "sale", label: "تخفیف‌دار" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-orange-500" />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button onClick={handleSave} disabled={saving}
          className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-600/25">
          {saving ? "در حال ذخیره..." : "ذخیره محصول"}
        </button>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white px-6 py-3 rounded-xl border border-gray-800 hover:border-gray-600 transition-all">
          انصراف
        </button>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  return <Suspense fallback={<div className="p-8 text-center text-gray-500">بارگذاری...</div>}><EditForm /></Suspense>;
}
