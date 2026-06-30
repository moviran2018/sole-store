"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllShoes, getOrders, categories } from "@/lib/shoe-store";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, brands: 0, lowStock: 0 });

  useEffect(() => {
    const products = getAllShoes();
    const orders = getOrders();
    const brands = new Set(products.map((p) => p.brand));
    const revenue = orders.filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + (o.total || 0), 0);
    setStats({
      products: products.length,
      orders: orders.length,
      revenue,
      brands: brands.size,
      lowStock: products.filter((p) => !p.inStock).length,
    });
  }, []);

  const cards = [
    { label: "محصولات", value: stats.products, icon: "👟", color: "from-orange-600/20 to-orange-800/10", border: "border-orange-500/30" },
    { label: "سفارشات", value: stats.orders, icon: "📦", color: "from-blue-600/20 to-blue-800/10", border: "border-blue-500/30" },
    { label: "برندها", value: stats.brands, icon: "🏷️", color: "from-purple-600/20 to-purple-800/10", border: "border-purple-500/30" },
    { label: "درآمد (تومان)", value: stats.revenue.toLocaleString("fa-IR"), icon: "💰", color: "from-green-600/20 to-green-800/10", border: "border-green-500/30" },
    { label: "ناموجود", value: stats.lowStock, icon: "⚠️", color: "from-red-600/20 to-red-800/10", border: "border-red-500/30" },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <span className="text-orange-400 font-semibold text-sm">—— داشبورد مدیریت ——</span>
        <h1 className="text-3xl font-bold text-white mt-1">سولو استور</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {cards.map((c, i) => (
          <div key={i} className={`bg-gradient-to-br ${c.color} rounded-2xl p-5 border ${c.border} backdrop-blur-sm`}>
            <span className="text-2xl block mb-2">{c.icon}</span>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products" className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-orange-500/40 transition-all">
          <span className="text-3xl block mb-3">👟</span>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">مدیریت محصولات</h3>
          <p className="text-sm text-gray-400">افزودن، ویرایش و حذف کفش‌ها</p>
        </Link>
        <Link href="/admin/orders" className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-orange-500/40 transition-all">
          <span className="text-3xl block mb-3">📦</span>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">مدیریت سفارشات</h3>
          <p className="text-sm text-gray-400">مشاهده و تغییر وضعیت سفارشات</p>
        </Link>
        <Link href="/admin/messages" className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-orange-500/40 transition-all">
          <span className="text-3xl block mb-3">✉️</span>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">پیام‌ها</h3>
          <p className="text-sm text-gray-400">مشاهده پیام‌های دریافتی از کاربران</p>
        </Link>
      </div>
    </div>
  );
}
