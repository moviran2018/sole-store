"use client";

import { useState } from "react";
import { saveMessage } from "@/lib/shoe-store";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return alert("لطفاً تمام فیلدها را پر کنید");
    await saveMessage({ ...form, createdAt: new Date().toLocaleString("fa-IR") });
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="pt-14 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-3 sm:mb-4">Contact Us</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">با ما در تماس باشید</h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">خوشحال می‌شویم نظرات، پیشنهادات و سوالات شما را بشنویم.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
          <div>
            <form className="space-y-4 sm:space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {[{ key: "name", label: "نام و نام خانوادگی", type: "text", placeholder: "نام خود را وارد کنید" },
                { key: "email", label: "ایمیل", type: "email", placeholder: "ایمیل خود را وارد کنید" },
                { key: "subject", label: "موضوع", type: "text", placeholder: "موضوع پیام" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-300 mb-1 sm:mb-1.5">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors text-white placeholder-gray-500 rounded-xl" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-[11px] sm:text-xs font-medium text-gray-300 mb-1 sm:mb-1.5">پیام</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors text-white placeholder-gray-500 resize-none rounded-xl" placeholder="پیام خود را بنویسید..." />
              </div>
              <button type="submit"
                className={`w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all ${sent ? "bg-green-600" : "btn-primary"}`}>
                {sent ? "✓ ارسال شد" : "ارسال پیام"}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            <div>
              <h3 className="text-[11px] sm:text-xs font-semibold text-gray-300 mb-3 sm:mb-4 uppercase tracking-wider">اطلاعات تماس</h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", title: "آدرس", value: "تهران، خیابان ولیعصر، خیابان مطهری، پلاک ۱۲۳" },
                  { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", title: "تلفن", value: "۰۲۱-۱۲۳۴۵۶۷۸\n۰۹۱۲-۱۲۳۴۵۶۷" },
                  { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", title: "ایمیل", value: "info@solestore.com" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-4 sm:w-4 h-4 sm:h-4 text-[var(--accent)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500">{item.title}</p>
                      <p className="text-xs sm:text-sm text-gray-300" style={{ whiteSpace: "pre-line" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] sm:text-xs font-semibold text-gray-300 mb-3 sm:mb-4 uppercase tracking-wider">ساعات کاری</h3>
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                {[
                  { day: "شنبه - چهارشنبه", time: "۹:۰۰ - ۲۰:۰۰" },
                  { day: "پنجشنبه", time: "۹:۰۰ - ۱۶:۰۰" },
                  { day: "جمعه", time: "تعطیل", isOff: true },
                ].map((d) => (
                  <div key={d.day} className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-gray-500">{d.day}</span>
                    <span className={d.isOff ? "text-red-500" : "text-gray-300"}>{d.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
