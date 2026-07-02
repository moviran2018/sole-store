"use client";

import { useState, useMemo, useEffect } from "react";
import ShoeCard from "@/components/ShoeCard";
import CompactShoeCard from "@/components/CompactShoeCard";
import HeroSlider from "@/components/HeroSlider";
import SearchDropdown from "@/components/SearchDropdown";
import { shoes as staticShoes, categories } from "@/data/shoes";
import { getAllShoes } from "@/lib/shoe-store";

const ALL_BRANDS = [...new Set(staticShoes.map((s) => s.brand))].sort();
const PRICE_MIN = Math.min(...staticShoes.map((s) => s.price));
const PRICE_MAX = Math.max(...staticShoes.map((s) => s.price));
const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];
const ALL_COLORS = [
  { name: "مشکی", hex: "#000000" },
  { name: "سفید", hex: "#FFFFFF" },
  { name: "طوسی", hex: "#808080" },
  { name: "قهوه‌ای", hex: "#6B4226" },
  { name: "آبی", hex: "#0044CC" },
  { name: "قرمز", hex: "#CC0000" },
  { name: "سبز", hex: "#2E7D32" },
  { name: "بژ", hex: "#F5F5DC" },
];

function useFilters(displayShoes: typeof staticShoes) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) setSearchQuery(q);
    }
  }, []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [saleOnly, setSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...displayShoes];

    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.namePersian.includes(q) ||
          s.brand.toLowerCase().includes(q) ||
          s.categoryPersian.includes(q)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((s) => selectedBrands.includes(s.brand));
    }

    result = result.filter((s) => s.price >= priceRange[0] && s.price <= priceRange[1]);

    if (minRating > 0) {
      result = result.filter((s) => s.rating >= minRating);
    }

    if (selectedColors.length > 0) {
      const hexSet = new Set(ALL_COLORS.filter((c) => selectedColors.includes(c.name)).map((c) => c.hex));
      result = result.filter((s) => s.colors.some((c) => hexSet.has(c.hex)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter((s) => s.sizes.some((sz) => selectedSizes.includes(sz)));
    }

    if (saleOnly) {
      result = result.filter((s) => s.sale);
    }

    if (inStockOnly) {
      result = result.filter((s) => s.inStock);
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "name": result.sort((a, b) => a.namePersian.localeCompare(b.namePersian)); break;
      case "discount": result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
    }

    return result;
  }, [displayShoes, searchQuery, activeCategory, selectedBrands, priceRange, minRating, selectedColors, selectedSizes, saleOnly, inStockOnly, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };

  const toggleColor = (name: string) => {
    setSelectedColors((prev) => prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const clearAll = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedBrands([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setMinRating(0);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSaleOnly(false);
    setInStockOnly(false);
    setSortBy("default");
  };

  const hasActiveFilters = !!(
    searchQuery ||
    activeCategory !== "all" ||
    selectedBrands.length > 0 ||
    priceRange[0] !== PRICE_MIN ||
    priceRange[1] !== PRICE_MAX ||
    minRating > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    saleOnly ||
    inStockOnly
  );

  const catCount = (catId: string) => (catId === "all" ? displayShoes.length : displayShoes.filter((s) => s.category === catId).length);

  return {
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    selectedBrands, toggleBrand,
    priceRange, setPriceRange,
    minRating, setMinRating,
    selectedColors, toggleColor,
    selectedSizes, toggleSize,
    saleOnly, setSaleOnly,
    inStockOnly, setInStockOnly,
    clearAll, hasActiveFilters,
    filtered, catCount,
  };
}

function FilterSidebar({
  activeCategory, setActiveCategory, catCount,
  selectedBrands, toggleBrand,
  priceRange, setPriceRange,
  minRating, setMinRating,
  selectedColors, toggleColor,
  selectedSizes, toggleSize,
  saleOnly, setSaleOnly,
  inStockOnly, setInStockOnly,
  clearAll, hasActiveFilters,
  filtered, searchQuery,
  isDrawer = false, onClose,
}: {
  activeCategory: string; setActiveCategory: (c: string) => void; catCount: (id: string) => number;
  selectedBrands: string[]; toggleBrand: (b: string) => void;
  priceRange: [number, number]; setPriceRange: (r: [number, number]) => void;
  minRating: number; setMinRating: (r: number) => void;
  selectedColors: string[]; toggleColor: (c: string) => void;
  selectedSizes: number[]; toggleSize: (s: number) => void;
  saleOnly: boolean; setSaleOnly: (v: boolean) => void;
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void;
  clearAll: () => void; hasActiveFilters: boolean;
  filtered: any[]; searchQuery: string;
  isDrawer?: boolean; onClose?: () => void;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const Section = ({
    label,
    id,
    children,
  }: {
    label: string;
    id: string;
    children: React.ReactNode;
  }) => (
    <div className="filter-section py-3">
      <div className="flex items-center justify-between mb-2" onClick={() => toggle(id)}>
        <span className="filter-title">{label}</span>
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform ${collapsed[id] ? "" : "rotate-180"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {!collapsed[id] && children}
    </div>
  );

  return (
    <div className={isDrawer ? "" : "sidebar-sticky pl-4 lg:pl-6"}>
      {isDrawer && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-white">فیلترها</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <button onClick={clearAll} className="clear-filter-btn mb-3 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          پاک کردن همه فیلترها
        </button>
      )}

      <Section label="دسته‌بندی" id="cat">
        <div className="filter-tree-item active" onClick={() => setActiveCategory("all")}>
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm12.75 0A2.25 2.25 0 0121 3.75h2.25A2.25 2.25 0 0124 6v12a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
          </svg>
          همه دسته‌ها
          <span className="count">{catCount("all")}</span>
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`filter-tree-item ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="text-xs">{cat.icon}</span>
            {cat.namePersian}
            <span className="count">{catCount(cat.id)}</span>
          </div>
        ))}
      </Section>

      <Section label="برند" id="brand">
        <div className="max-h-40 overflow-y-auto space-y-0.5">
          {ALL_BRANDS.slice(0, 30).map((brand) => (
            <label key={brand} className="filter-checkbox">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
              {brand}
            </label>
          ))}
        </div>
      </Section>

      <Section label="قیمت" id="price">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number" className="price-input" placeholder="از"
            value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value) || PRICE_MIN, priceRange[1]])}
          />
          <span className="text-gray-600 text-xs">تا</span>
          <input
            type="number" className="price-input" placeholder="تا"
            value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || PRICE_MAX])}
          />
        </div>
        <input
          type="range" className="price-slider" min={PRICE_MIN} max={PRICE_MAX} step={50000}
          value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
        />
        <div className="flex justify-between text-[10px] text-gray-600 mt-1">
          <span>{PRICE_MIN.toLocaleString("fa-IR")}</span>
          <span>{PRICE_MAX.toLocaleString("fa-IR")}</span>
        </div>
      </Section>

      <Section label="امتیاز" id="rating">
        {[4, 3, 2, 1].map((star) => (
          <div
            key={star}
            className="filter-checkbox"
            onClick={() => setMinRating(minRating === star ? 0 : star)}
          >
            <input type="radio" checked={minRating === star} onChange={() => {}} name="rating" />
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`rating-star ${i < star ? "text-[var(--accent)]" : "text-gray-700"}`}
                  fill="currentColor" viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-[10px] text-gray-600 mr-1">به بالا</span>
            </div>
          </div>
        ))}
      </Section>

      <Section label="رنگ" id="color">
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleColor(c.name)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColors.includes(c.name) ? "color-dot-active" : "border-gray-700 hover:border-gray-500"}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </Section>

      <Section label="سایز" id="size">
        <div className="flex flex-wrap gap-1.5">
          {ALL_SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => toggleSize(sz)}
              className={`min-w-[36px] h-8 text-[11px] font-medium border rounded-lg transition-all ${
                selectedSizes.includes(sz) ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "bg-[var(--muted)] text-gray-400 border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </Section>

      <Section label="ویژه" id="special">
        <label className="filter-checkbox">
          <input type="checkbox" checked={saleOnly} onChange={() => setSaleOnly(!saleOnly)} />
          <span className="text-red-500">تخفیف‌دار</span>
        </label>
        <label className="filter-checkbox">
          <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          فقط موجودی‌ها
        </label>
      </Section>
    </div>
  );
}

export default function Home() {
  const [shoes, setShoes] = useState(staticShoes);

  useEffect(() => { getAllShoes().then(setShoes); }, []);

  const {
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    selectedBrands, toggleBrand,
    priceRange, setPriceRange,
    minRating, setMinRating,
    selectedColors, toggleColor,
    selectedSizes, toggleSize,
    saleOnly, setSaleOnly,
    inStockOnly, setInStockOnly,
    clearAll, hasActiveFilters,
    filtered, catCount,
  } = useFilters(shoes);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const featured = shoes.filter((s) => s.featured);
  const newArrivals = shoes.filter((s) => s.new);
  const saleItems = shoes.filter((s) => s.sale);

  const filterProps = {
    activeCategory, setActiveCategory, catCount,
    selectedBrands, toggleBrand,
    priceRange, setPriceRange,
    minRating, setMinRating,
    selectedColors, toggleColor,
    selectedSizes, toggleSize,
    saleOnly, setSaleOnly,
    inStockOnly, setInStockOnly,
    clearAll, hasActiveFilters,
    filtered, searchQuery,
  };

  return (
    <div>
      <HeroSlider products={shoes} />

      {/* Mobile category chips */}
      <div className="md:hidden overflow-hidden">
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
          <div className="flex gap-2 py-3">
            <button onClick={() => setActiveCategory("all")}
              className={`flex flex-col items-center gap-1 min-w-[68px] p-2 rounded-xl border transition-all ${
                activeCategory === "all"
                  ? "bg-[var(--accent)]/20 border-[var(--accent)]/40"
                  : "bg-[var(--muted)] border-[var(--border)]"
              }`}>
              <span className="text-xl">📋</span>
              <span className="text-[8px] whitespace-nowrap text-gray-400">همه</span>
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-1 min-w-[68px] p-2 rounded-xl border transition-all ${
                  activeCategory === cat.id
                    ? "bg-[var(--accent)]/20 border-[var(--accent)]/40"
                    : "bg-[var(--muted)] border-[var(--border)]"
                }`}>
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[8px] whitespace-nowrap text-gray-400">{cat.namePersian}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {featured.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">Featured</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">محصولات ویژه</h2>
            </div>
          </div>
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden overflow-hidden">
            <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
              <div className="flex gap-3">
                {featured.slice(0, 8).map((shoe) => <CompactShoeCard key={shoe.id} shoe={shoe} />)}
              </div>
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.slice(0, 8).map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 bg-[var(--muted)]/30">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">New Arrivals</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">جدیدترین محصولات</h2>
            </div>
          </div>
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden overflow-hidden">
            <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
              <div className="flex gap-3">
                {newArrivals.slice(0, 8).map((shoe) => <CompactShoeCard key={shoe.id} shoe={shoe} />)}
              </div>
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 8).map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </section>
      )}

      {saleItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-medium mb-1">Sale</p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">تخفیف‌های ویژه</h2>
            </div>
          </div>
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden overflow-hidden">
            <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
              <div className="flex gap-3">
                {saleItems.slice(0, 8).map((shoe) => <CompactShoeCard key={shoe.id} shoe={shoe} />)}
              </div>
            </div>
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {saleItems.slice(0, 8).map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </section>
      )}

      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="mb-4 sm:mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">Collection</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white">همه محصولات</h2>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="w-56 lg:w-64 shrink-0 hidden md:block">
            <FilterSidebar {...filterProps} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search + Sort + Filter Button Bar */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 border-b border-[var(--border)]">
              <div className="relative flex-1">
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <SearchDropdown value={searchQuery} onChange={setSearchQuery} placeholder="جستجو در بین همه محصولات..." />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Mobile filter button */}
                <button
                  onClick={() => setFilterDrawerOpen(true)}
                  className="md:hidden flex items-center gap-1 px-3 py-2 text-xs bg-[var(--muted)] border border-[var(--border)] text-gray-400 hover:text-white rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  فیلتر
                  {hasActiveFilters && <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />}
                </button>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors text-gray-400 rounded-xl"
                >
                  <option value="default">مرتب‌سازی</option>
                  <option value="price-asc">قیمت: کم به زیاد</option>
                  <option value="price-desc">قیمت: زیاد به کم</option>
                  <option value="rating">محبوب‌ترین</option>
                  <option value="name">نام</option>
                  <option value="discount">بیشترین تخفیف</option>
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500">
                {searchQuery ? (
                  <>نتیجه جستجوی &quot;{searchQuery}&quot;: {filtered.length} محصول</>
                ) : (
                  <>{filtered.length} محصول از {shoes.length}</>
                )}
              </p>
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {filtered.map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <svg className="w-12 sm:w-14 h-12 sm:h-14 mx-auto text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-gray-500 text-sm mb-1">محصولی یافت نشد.</p>
                <p className="text-xs text-gray-600 mb-4">فیلترهای دیگری امتحان کنید.</p>
                {hasActiveFilters && (
                  <button onClick={clearAll} className="btn-primary px-5 py-2 text-xs font-semibold rounded-xl">
                    حذف همه فیلترها
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <div className={`filter-drawer-overlay ${filterDrawerOpen ? "open" : ""}`} onClick={() => setFilterDrawerOpen(false)} />
      <div className={`filter-drawer ${filterDrawerOpen ? "open" : ""}`}>
        <FilterSidebar {...filterProps} isDrawer onClose={() => setFilterDrawerOpen(false)} />
      </div>
    </div>
  );
}
