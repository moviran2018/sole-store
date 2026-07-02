"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "خانه", scrollTop: true,
    icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
  { href: "products", label: "محصولات",
    icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
  { href: "/cart", label: "سبد خرید", badge: true,
    icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" },
  { href: "/about", label: "درباره ما",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [hasHash, setHasHash] = useState(false);

  useEffect(() => {
    setHasHash(!!window.location.hash);
    const onHash = () => setHasHash(!!window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const isActive = (item: typeof items[number]) => {
    if (item.href === "/") return pathname === "/" && !hasHash;
    if (item.href === "products") return pathname === "/products" || (pathname === "/" && hasHash);
    return pathname === item.href;
  };

  const handleNav = (item: typeof items[number]) => {
    if (item.href === "products") {
      if (pathname === "/") {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
        window.location.hash = "products";
      } else {
        window.location.href = "/#products";
      }
      return;
    }
    if (item.href === "/") {
      if (pathname === "/" && !hasHash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
      return;
    }
    window.location.href = item.href;
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d] border-t border-[var(--border)] safe-bottom">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <button key={item.href} onClick={() => handleNav(item)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-2 py-1 transition-colors ${
                active ? "text-[var(--accent)]" : "text-gray-600 hover:text-gray-400"
              }`}>
              <div className="relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.badge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-lg">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
