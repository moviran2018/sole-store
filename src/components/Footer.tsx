"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleHome = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      setHash("");
      window.history.replaceState(null, "", "/");
      window.scrollTo(0, 0);
    }
  };

  const handleProducts = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.hash = "products";
      setHash("#products");
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-[var(--border)] mt-20">
      <div className="glow-line mx-auto max-w-7xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" onClick={handleHome} className="flex items-center gap-2">
                <span className="text-lg font-bold text-gradient">SOLE</span>
                <span className="text-[10px] text-gray-600 font-light tracking-[0.2em] uppercase">STORE</span>
              </Link>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              فروشگاه تخصصی کفش با بهترین برندهای دنیا. کیفیت، راحتی و استایل را با هم تجربه کنید.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">دسترسی سریع</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={handleHome} className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">خانه</Link>
              <Link href="/#products" onClick={handleProducts} className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">محصولات</Link>
              <Link href="/about" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">درباره ما</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">تماس</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">دسته‌بندی‌ها</h3>
            <div className="flex flex-col gap-2">
              <Link href="/?category=sneakers" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">کتانی</Link>
              <Link href="/?category=formal" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">رسمی</Link>
              <Link href="/?category=running" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">دویدن</Link>
              <Link href="/?category=boots" className="text-sm text-gray-500 hover:text-[var(--accent)] transition-colors">چکمه</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">اطلاعات تماس</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <span>تهران، خیابان ولیعصر</span>
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              <span className="text-[var(--accent)]">info@solestore.com</span>
              <div className="flex gap-4 mt-2">
                <span className="text-gray-500 hover:text-[var(--accent)] cursor-pointer transition-colors text-xs">اینستاگرام</span>
                <span className="text-gray-500 hover:text-[var(--accent)] cursor-pointer transition-colors text-xs">تلگرام</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} SOLE STORE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
