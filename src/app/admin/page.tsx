"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getOrders, getReservations } from "@/lib/storage";
import type { Order, Reservation } from "@/types";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    setReservations(getReservations());
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingReservations = reservations.filter((r) => r.status === "pending").length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "مجموع سفارشات", value: orders.length, icon: "📦", color: "from-blue-900/40 to-blue-800/40" },
    { label: "سفارشات در انتظار", value: pendingOrders, icon: "⏳", color: "from-yellow-900/40 to-yellow-800/40" },
    { label: "رزروهای در انتظار", value: pendingReservations, icon: "📅", color: "from-purple-900/40 to-purple-800/40" },
    { label: "درآمد کل", value: totalRevenue.toLocaleString("fa-IR") + " تومان", icon: "💰", color: "from-green-900/40 to-green-800/40" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-amber-500 font-semibold text-sm">—— پنل مدیریت ——</span>
            <h1 className="text-3xl font-bold text-white mt-1">داشبورد</h1>
          </div>
          <span className="text-4xl">⚙️</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 border border-gray-800`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/orders"
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-4xl block mb-3">📋</span>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
              مدیریت سفارشات
            </h3>
            <p className="text-sm text-gray-400">مشاهده و تغییر وضعیت سفارشات</p>
            {pendingOrders > 0 && (
              <span className="inline-block mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingOrders} سفارش جدید
              </span>
            )}
          </Link>

          <Link
            href="/admin/reservations"
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-4xl block mb-3">📅</span>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
              مدیریت رزروها
            </h3>
            <p className="text-sm text-gray-400">مشاهده و تایید رزرو میز</p>
            {pendingReservations > 0 && (
              <span className="inline-block mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingReservations} رزرو جدید
              </span>
            )}
          </Link>

          <Link
            href="/admin/menu"
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-4xl block mb-3">🍽️</span>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
              مدیریت منو
            </h3>
            <p className="text-sm text-gray-400">ویرایش و بروزرسانی منوی غذا</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
