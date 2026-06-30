"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: "📊" },
  { href: "/admin/products", label: "محصولات", icon: "👟" },
  { href: "/admin/orders", label: "سفارشات", icon: "📦" },
  { href: "/admin/messages", label: "پیام‌ها", icon: "✉️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <div className="flex">
        <aside className={`fixed top-0 right-0 z-50 h-full w-64 bg-[#0a0a0a] border-l border-gray-800/50 transform transition-all duration-300 ${open ? "translate-x-0" : "translate-x-64"} lg:translate-x-0 lg:static`}>
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👟</span>
              <div>
                <h2 className="font-bold text-white">Sole Store</h2>
                <p className="text-xs text-gray-500">پنل مدیریت</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = path === item.href || (item.href !== "/admin" && path.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-orange-600/20 to-transparent text-orange-400 border-r-2 border-orange-500"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 min-h-screen">
          <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button onClick={() => setOpen(!open)} className="lg:hidden text-2xl text-gray-400 hover:text-white">
                ☰
              </button>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-sm text-gray-500 hover:text-orange-400 transition-colors">
                  ← بازگشت به سایت
                </Link>
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
