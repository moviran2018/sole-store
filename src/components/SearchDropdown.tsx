"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { shoes } from "@/data/shoes";
import { categories } from "@/data/shoes";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSelect?: () => void;
  placeholder?: string;
}

export default function SearchDropdown({ value, onChange, onSelect, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = value.toLowerCase().trim();

  const matchedProducts = q
    ? shoes
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.namePersian.includes(q) ||
            s.brand.toLowerCase().includes(q) ||
            s.categoryPersian.includes(q)
        )
        .slice(0, 8)
    : [];

  const matchedCategories = q
    ? categories.filter(
        (c) =>
          c.namePersian.includes(q) || c.name.toLowerCase().includes(q) || c.id.includes(q)
      )
    : [];

  const showDropdown = q.length > 0 && open && (matchedProducts.length > 0 || matchedCategories.length > 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    const total = matchedProducts.length + matchedCategories.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev < total - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev > 0 ? prev - 1 : total - 1));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      const catCount = matchedCategories.length;
      if (highlightIdx < catCount) {
        window.location.href = `/?category=${matchedCategories[highlightIdx].id}#products`;
      } else {
        const p = matchedProducts[highlightIdx - catCount];
        if (p) window.location.href = `/products/${p.id}`;
      }
      setOpen(false);
      onSelect?.();
    }
  };

  const totalResults = matchedProducts.length + matchedCategories.length;

  return (
    <div ref={ref} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || "جستجوی محصول..."}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlightIdx(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full pr-9 sm:pr-10 pl-8 sm:pl-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors text-white placeholder-gray-500 rounded-xl"
      />
      {value && (
        <button
          onClick={() => { onChange(""); setOpen(false); inputRef.current?.focus(); }}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white p-0.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {showDropdown && (
        <div className="absolute top-full right-0 left-0 mt-1.5 bg-[#1a1a1a] border border-[var(--border)] rounded-2xl shadow-2xl shadow-black/60 z-50 overflow-hidden max-h-96 overflow-y-auto">
          <div className="p-2">
            {/* Category matches */}
            {matchedCategories.length > 0 && (
              <div>
                <div className="px-2 py-1.5 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
                  دسته‌بندی‌ها
                </div>
                {matchedCategories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.id}#products`}
                    onClick={() => { setOpen(false); onSelect?.(); }}
                    className={`flex items-center gap-2 px-2 py-2 text-xs rounded-xl transition-colors ${
                      highlightIdx === i ? "bg-[var(--accent)]/20 text-white" : "text-gray-400 hover:bg-[var(--muted)]"
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.namePersian}</span>
                    <span className="mr-auto text-[10px] text-gray-600">{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Product matches */}
            {matchedProducts.length > 0 && (
              <div className={matchedCategories.length > 0 ? "mt-1 border-t border-[var(--border)] pt-1" : ""}>
                <div className="px-2 py-1.5 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
                  محصولات
                </div>
                {matchedProducts.map((p, i) => {
                  const idx = matchedCategories.length + i;
                  return (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={() => { setOpen(false); onSelect?.(); }}
                      className={`flex items-center gap-2.5 px-2 py-2 rounded-xl transition-colors ${
                        highlightIdx === idx ? "bg-[var(--accent)]/20 text-white" : "text-gray-400 hover:bg-[var(--muted)]"
                      }`}
                    >
                      <div className="w-9 h-9 bg-[var(--muted)] rounded-lg overflow-hidden shrink-0">
                        <img src={p.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">{p.namePersian}</p>
                        <p className="text-[10px] text-gray-600 truncate">{p.brand} • {p.categoryPersian}</p>
                      </div>
                      <div className="text-left shrink-0">
                        <p className="text-[11px] font-medium text-[var(--accent)]">
                          {p.sale && p.discount
                            ? (p.price * (1 - p.discount / 100)).toLocaleString("fa-IR")
                            : p.price.toLocaleString("fa-IR")}
                        </p>
                        {p.sale && p.discount && (
                          <p className="text-[9px] text-gray-600 line-through">{p.price.toLocaleString("fa-IR")}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-[var(--border)] text-center">
            <Link
              href={`/?q=${encodeURIComponent(value)}#products`}
              onClick={() => { setOpen(false); onSelect?.(); }}
              className="text-[11px] text-gray-500 hover:text-[var(--accent)] transition-colors"
            >
              مشاهده همه {totalResults} نتیجه برای &quot;{value}&quot;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
