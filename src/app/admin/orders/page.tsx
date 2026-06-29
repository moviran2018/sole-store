"use client";

import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Order } from "@/types";

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تایید شده",
  preparing: "در حال آماده‌سازی",
  ready: "آماده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  delivered: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleStatus = (id: string, status: Order["status"]) => {
    updateOrderStatus(id, status);
    setOrders(getOrders());
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-amber-400">
            ← بازگشت
          </Link>
          <div>
            <span className="text-amber-500 font-semibold text-sm">—— مدیریت ——</span>
            <h1 className="text-3xl font-bold text-white mt-1">سفارشات</h1>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">📋</span>
            <p className="text-gray-400 mt-4">هیچ سفارشی ثبت نشده است</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-bold">{order.customerName}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.id} | {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.status === "pending" && (
                      <button onClick={() => handleStatus(order.id, "confirmed")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">
                        تایید
                      </button>
                    )}
                    {order.status === "confirmed" && (
                      <button onClick={() => handleStatus(order.id, "preparing")} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm">
                        شروع آماده‌سازی
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button onClick={() => handleStatus(order.id, "ready")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">
                        آماده شد
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button onClick={() => handleStatus(order.id, "delivered")} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-sm">
                        تحویل شد
                      </button>
                    )}
                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <button onClick={() => handleStatus(order.id, "cancelled")} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg text-sm">
                        لغو
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-right pb-2">غذا</th>
                        <th className="text-center pb-2">تعداد</th>
                        <th className="text-left pb-2">قیمت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="text-gray-300">
                          <td className="py-1">{item.name}</td>
                          <td className="text-center py-1">{item.quantity}</td>
                          <td className="text-left py-1">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="text-white font-bold border-t border-gray-800">
                        <td className="pt-2" colSpan={2}>مجموع</td>
                        <td className="text-left pt-2 text-amber-400">{formatPrice(order.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-500">
                  <p>📞 {order.phone} | 📧 {order.email}</p>
                  {order.address && <p>📍 {order.address}</p>}
                  {order.notes && <p>📝 {order.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
