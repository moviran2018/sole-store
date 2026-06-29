"use client";

import { useState } from "react";
import menuData from "@/data/menu.json";
import { categories } from "@/data/categories";
import MenuItemCard from "@/components/MenuItem";
import type { MenuItem } from "@/types";

const menuItems: MenuItem[] = menuData;

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
            —— منوی رستوران ——
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">
            منوی <span className="text-amber-400">FoodMode</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            مجموعه‌ای از بهترین و خوشمزه‌ترین غذاها با تازه‌ترین مواد اولیه
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">😕</span>
            <p className="text-gray-400 mt-4">غذایی در این دسته‌بندی یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
