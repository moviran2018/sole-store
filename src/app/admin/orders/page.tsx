"use client";

import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "@/lib/shoe-store";

const statusLabels: Record<string, string> = { pending: "در انتظار", confirmed: "تایید شده", preparing: "در حال آماده‌سازی", shipped: "ارسال شده", delivered: "تحویل شده", cancelled: "لغو شده" };
const statusColors: Record<string, string> = { pending: "bg-yellow-500/20 text-yellow-400", confirmed: "bg-blue-500/20 text-blue-400", preparing: "bg-purple-500/20 text-purple-400", shipped: "bg-orange-500/20 text-orange-400", delivered: "bg-green-500/20 text-green-400", cancelled: "bg-red-500/20 text-red-400" };

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => { (async () => setOrders(await getOrders()))(); }, []);

  const handleStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    setOrders(await getOrders());
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <span className="text-orange-400 font-semibold text-sm">—— مدیریت سفارشات ——</span>
        <h1 className="text-2xl font-bold text-white mt-1">{orders.length} سفارش</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <span className="text-4xl block mb-3">📦</span>
          <p>هیچ سفارشی ثبت نشده</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-800">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{order.customerName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-500/20 text-gray-400"}`}>{statusLabels[order.status] || order.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{order.phone} · {order.createdAt}</p>
                </div>
                <div className="text-left">
                  <p className="text-orange-400 font-bold text-lg">{order.total?.toLocaleString?.("fa-IR") || "۰"} تومان</p>
                  <select value={order.status} onChange={(e) => handleStatus(order.id, e.target.value)}
                    className="mt-1 text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-orange-500/50">
                    {Object.keys(statusLabels).map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-3">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1">
                    <span className="text-gray-300">{item.namePersian || item.name} <span className="text-gray-600">×{item.quantity}</span></span>
                    <span className="text-gray-400" dir="ltr">{(item.price * item.quantity).toLocaleString?.("fa-IR") || "۰"}</span>
                  </div>
                ))}
              </div>
              {order.address && <p className="text-xs text-gray-600 mt-2">آدرس: {order.address}</p>}
              {order.notes && <p className="text-xs text-gray-600">توضیحات: {order.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
