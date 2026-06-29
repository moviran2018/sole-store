"use client";

import { useState } from "react";
import menuData from "@/data/menu.json";
import { formatPrice, generateId } from "@/lib/utils";
import Link from "next/link";
import type { MenuItem } from "@/types";

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تایید شده",
  cancelled: "لغو شده",
};

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>(menuData);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-amber-400">
              ← بازگشت
            </Link>
            <div>
              <span className="text-amber-500 font-semibold text-sm">—— مدیریت ——</span>
              <h1 className="text-3xl font-bold text-white mt-1">منوی غذا</h1>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400">
                  <th className="text-right p-4">تصویر</th>
                  <th className="text-right p-4">نام</th>
                  <th className="text-right p-4">دسته‌بندی</th>
                  <th className="text-right p-4">قیمت</th>
                  <th className="text-center p-4">وضعیت</th>
                  <th className="text-center p-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-lg flex items-center justify-center text-xl">
                        {["🥩", "🥗", "🍕", "🍣", "🍔", "🍝", "🍰", "🍹", "🥣", "🧀", "🥤", "🧄"][index]}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.nameEn}</p>
                    </td>
                    <td className="p-4 text-gray-400">{item.category}</td>
                    <td className="p-4 text-amber-400 font-medium">{formatPrice(item.price)}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          item.available
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.available ? "موجود" : "ناموجود"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          item.available
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/40"
                            : "bg-green-500/20 text-green-400 hover:bg-green-500/40"
                        }`}
                      >
                        {item.available ? "غیرفعال" : "فعال"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
