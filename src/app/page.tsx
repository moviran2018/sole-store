"use client";

import { useState, useMemo } from "react";
import ShoeCard from "@/components/ShoeCard";
import HeroSlider from "@/components/HeroSlider";
import { shoes, categories, getFeaturedShoes, getNewShoes, getSaleShoes } from "@/data/shoes";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = getFeaturedShoes();
  const newArrivals = getNewShoes();
  const saleItems = getSaleShoes();

  const filteredShoes = useMemo(() => {
    let result = activeCategory === "all" ? shoes : shoes.filter((s) => s.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.namePersian.includes(q) || s.brand.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "rating": result = [...result].sort((a, b) => b.rating - a.rating); break;
      case "name": result = [...result].sort((a, b) => a.namePersian.localeCompare(b.namePersian)); break;
    }
    return result;
  }, [activeCategory, sortBy, searchQuery]);

  return (
    <div>
      <HeroSlider />

      {featured.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">Featured</p>
              <h2 className="text-2xl font-bold text-white">محصولات ویژه</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-[var(--muted)]/30">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">New Arrivals</p>
              <h2 className="text-2xl font-bold text-white">جدیدترین محصولات</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </section>
      )}

      {saleItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-medium mb-1">Sale</p>
              <h2 className="text-2xl font-bold text-white">تخفیف‌های ویژه</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleItems.slice(0, 4).map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </section>
      )}

      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">Collection</p>
          <h2 className="text-2xl font-bold text-white">همه محصولات</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 pb-6 border-b border-[var(--border)]">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="جستجوی محصول..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap px-4 py-2 text-xs font-medium transition-colors ${activeCategory === "all" ? "btn-primary" : "bg-[var(--muted)] text-gray-400 hover:bg-[var(--border)]"}`}>
              همه
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 text-xs font-medium transition-colors ${activeCategory === cat.id ? "btn-primary" : "bg-[var(--muted)] text-gray-400 hover:bg-[var(--border)]"}`}>
                {cat.namePersian}
              </button>
            ))}
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 text-xs bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors text-gray-400">
            <option value="default">مرتب‌سازی: پیش‌فرض</option>
            <option value="price-asc">قیمت: کم به زیاد</option>
            <option value="price-desc">قیمت: زیاد به کم</option>
            <option value="rating">محبوب‌ترین</option>
            <option value="name">نام</option>
          </select>
        </div>

        {filteredShoes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShoes.map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">محصولی یافت نشد.</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-600 mt-8">
          نمایش {filteredShoes.length} از {shoes.length} محصول
        </p>
      </section>
    </div>
  );
}
