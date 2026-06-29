"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-gradient">SOLE</span>
            <span className="text-[10px] text-gray-500 font-light tracking-[0.2em] uppercase">
              STORE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide"
            >
              خانه
            </Link>
            <Link
              href="/#products"
              className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide"
            >
              محصولات
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide"
            >
              درباره ما
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors tracking-wide"
            >
              تماس
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative text-gray-400 hover:text-[var(--accent)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-400 hover:text-[var(--accent)]"
              aria-label="Toggle menu"
            >
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

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--border)] pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-gray-400 hover:text-[var(--accent)]" onClick={() => setMenuOpen(false)}>خانه</Link>
              <Link href="/#products" className="text-sm text-gray-400 hover:text-[var(--accent)]" onClick={() => setMenuOpen(false)}>محصولات</Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-[var(--accent)]" onClick={() => setMenuOpen(false)}>درباره ما</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-[var(--accent)]" onClick={() => setMenuOpen(false)}>تماس</Link>
              <Link href="/cart" className="text-sm text-gray-400 hover:text-[var(--accent)]" onClick={() => setMenuOpen(false)}>
                سبد خرید {itemCount > 0 && `(${itemCount})`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
