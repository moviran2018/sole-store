"use client";

import { useState } from "react";
import { generateId } from "@/lib/utils";
import { saveReservation } from "@/lib/storage";
import Link from "next/link";

export default function ReservePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [reserveId, setReserveId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateId();
    saveReservation({
      id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      date: form.date,
      time: form.time,
      guests: parseInt(form.guests),
      notes: form.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setReserveId(id);
    setSubmitted(true);
  };

  const today = new Date().toISOString().split("T")[0];

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 border border-amber-500/30">
          <span className="text-6xl">✅</span>
          <h1 className="text-2xl font-bold text-white mt-4 mb-2">رزرو شما ثبت شد!</h1>
          <p className="text-gray-400 mb-2">کد رزرو: <span className="text-amber-400 font-bold">{reserveId}</span></p>
          <p className="text-sm text-gray-500 mb-8">منتظر حضور گرم شما در FoodMode هستیم.</p>
          <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl transition-all">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
            —— رزرو میز ——
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            رزرو <span className="text-amber-400">میز</span>
          </h1>
          <p className="text-gray-400">
            برای رزرو میز، فرم زیر را پر کنید. ما در اسرع وقت با شما تماس خواهیم گرفت.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">نام و نام خانوادگی</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="مثال: علی محمدی"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">شماره تماس</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">تاریخ</label>
              <input
                required
                type="date"
                value={form.date}
                min={today}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">ساعت</label>
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">تعداد مهمان</label>
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} نفر</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">توضیحات (اختیاری)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              rows={3}
              placeholder="مناسبت خاص یا درخواست ویژه..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-xl transition-all text-lg"
          >
            ثبت رزرو
          </button>
        </form>
      </div>
    </div>
  );
}
