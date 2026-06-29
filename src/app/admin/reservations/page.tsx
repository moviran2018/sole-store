"use client";

import { useState, useEffect } from "react";
import { getReservations, updateReservationStatus } from "@/lib/storage";
import Link from "next/link";
import type { Reservation } from "@/types";

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تایید شده",
  cancelled: "لغو شده",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const handleStatus = (id: string, status: Reservation["status"]) => {
    updateReservationStatus(id, status);
    setReservations(getReservations());
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-amber-400">
            ← بازگشت
          </Link>
          <div>
            <span className="text-amber-500 font-semibold text-sm">—— مدیریت ——</span>
            <h1 className="text-3xl font-bold text-white mt-1">رزرو میز</h1>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">📅</span>
            <p className="text-gray-400 mt-4">هیچ رزروی ثبت نشده است</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-bold text-lg">{res.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[res.status]}`}>
                        {statusLabels[res.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                      <span>📅 {new Date(res.date).toLocaleDateString("fa-IR")}</span>
                      <span>🕐 {res.time}</span>
                      <span>👥 {res.guests} نفر</span>
                      <span>📞 {res.phone}</span>
                      {res.email && <span>📧 {res.email}</span>}
                    </div>
                    {res.notes && (
                      <p className="text-sm text-gray-500 mt-2">📝 {res.notes}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      ثبت شده در: {new Date(res.createdAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {res.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatus(res.id, "confirmed")}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          تایید
                        </button>
                        <button
                          onClick={() => handleStatus(res.id, "cancelled")}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg text-sm"
                        >
                          رد
                        </button>
                      </>
                    )}
                    {res.status === "confirmed" && (
                      <button
                        onClick={() => handleStatus(res.id, "cancelled")}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-lg text-sm"
                      >
                        لغو
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
