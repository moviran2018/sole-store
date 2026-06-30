"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllShoes, deleteShoe } from "@/lib/shoe-store";
import type { Shoe } from "@/types/shoe";

export default function ProductsPage() {
  const [products, setProducts] = useState<Shoe[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { (async () => setProducts(await getAllShoes()))(); }, []);

  const filtered = products.filter((p) =>
    p.namePersian.includes(search) || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`حذف "${name}"؟`)) {
      await deleteShoe(id);
      setProducts(await getAllShoes());
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <span className="text-orange-400 font-semibold text-sm">—— مدیریت محصولات ——</span>
          <h1 className="text-2xl font-bold text-white mt-1">{products.length} محصول</h1>
        </div>
        <Link href="/admin/products/edit" className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-orange-600/25">
          + محصول جدید
        </Link>
      </div>

      <div className="relative mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجوی محصول..." dir="rtl"
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900/80">
              <th className="text-right p-4 text-gray-400 font-medium">محصول</th>
              <th className="text-right p-4 text-gray-400 font-medium hidden md:table-cell">دسته</th>
              <th className="text-right p-4 text-gray-400 font-medium hidden sm:table-cell">برند</th>
              <th className="text-left p-4 text-gray-400 font-medium">قیمت</th>
              <th className="text-center p-4 text-gray-400 font-medium hidden lg:table-cell">وضعیت</th>
              <th className="text-center p-4 text-gray-400 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-gray-800/50 hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{p.namePersian}</p>
                      <p className="text-xs text-gray-500">{p.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-300 hidden md:table-cell">{p.categoryPersian}</td>
                <td className="p-4 text-gray-300 hidden sm:table-cell">{p.brand}</td>
                <td className="p-4 text-left text-orange-400 font-medium" dir="ltr">{p.price.toLocaleString("fa-IR")}</td>
                <td className="p-4 text-center hidden lg:table-cell">
                  {p.sale && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-md">تخفیف</span>}
                  {p.new && <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md mr-1">جدید</span>}
                  {!p.inStock && <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-md mr-1">ناموجود</span>}
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/products/edit?id=${p.id}`} className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded-lg bg-blue-500/10 transition-colors">ویرایش</Link>
                    <button onClick={() => handleDelete(p.id, p.namePersian)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg bg-red-500/10 transition-colors">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
