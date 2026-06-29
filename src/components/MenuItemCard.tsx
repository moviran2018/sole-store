"use client";

import type { MenuItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface Props {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-amber-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center overflow-hidden">
        <div className="text-7xl opacity-30 select-none">
          {item.category === "پیش غذا" && "🥗"}
          {item.category === "غذاهای اصلی" && "🍖"}
          {item.category === "فست فود" && "🍔"}
          {item.category === "دسر" && "🍰"}
          {item.category === "نوشیدنی" && "🥤"}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">ناموجود</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{item.nameEn}</p>
          </div>
          <span className="bg-amber-50 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.description}</p>

        <button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className="mt-4 w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-medium transition-colors"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
