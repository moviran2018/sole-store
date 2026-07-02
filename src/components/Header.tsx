"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import SearchDropdown from "@/components/SearchDropdown";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { itemCount } = useCart();

  const closeSearch = () => { setSearchOpen(false); setSearchVal(""); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" onClick={(e) => { if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); window.history.replaceState(null, "", "/"); } }} className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
            <span className="text-lg sm:text-xl font-bold text-gradient">SOLE</span>
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-light tracking-[0.2em] uppercase">STORE</span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:block search-bar-header mx-3 lg:mx-6">
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <SearchDropdown value={searchVal} onChange={setSearchVal} placeholder="جستجو در ۱۰۱ محصول..." />
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide">خانه</Link>
            <Link href="/#products" className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide">محصولات</Link>
            <Link href="/about" className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide">درباره ما</Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide">تماس</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden text-gray-400 hover:text-[var(--accent)] p-1.5" aria-label="Search">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <Link href="/cart" className="relative text-gray-400 hover:text-[var(--accent)] transition-colors p-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-white text-[9px] sm:text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                  {itemCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-[var(--accent)] p-1.5" aria-label="Menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <SearchDropdown value={searchVal} onChange={setSearchVal} onSelect={closeSearch} placeholder="جستجو در ۱۰۱ محصول..." />
          </div>
        )}

        {/* Mobile fullscreen menu */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 top-14 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8">
            <Link href="/" className="text-2xl text-gray-300 hover:text-[var(--accent)] transition-colors" onClick={() => setMenuOpen(false)}>خانه</Link>
            <Link href="/#products" className="text-2xl text-gray-300 hover:text-[var(--accent)] transition-colors" onClick={() => setMenuOpen(false)}>محصولات</Link>
            <Link href="/about" className="text-2xl text-gray-300 hover:text-[var(--accent)] transition-colors" onClick={() => setMenuOpen(false)}>درباره ما</Link>
            <Link href="/contact" className="text-2xl text-gray-300 hover:text-[var(--accent)] transition-colors" onClick={() => setMenuOpen(false)}>تماس</Link>
            <Link href="/cart" className="text-2xl text-gray-300 hover:text-[var(--accent)] transition-colors" onClick={() => setMenuOpen(false)}>
              سبد خرید {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
