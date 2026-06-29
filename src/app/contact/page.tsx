"use client";

export default function ContactPage() {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-4">
            Contact Us
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#111] mb-6">
            با ما در تماس باشید
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            خوشحال می‌شویم نظرات، پیشنهادات و سوالات شما را بشنویم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Form */}
          <div>
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5">نام و نام خانوادگی</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5">ایمیل</label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5">موضوع</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  placeholder="موضوع پیام"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5">پیام</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
                  placeholder="پیام خود را بنویسید..."
                />
              </div>
              <button
                type="button"
                className="w-full py-3 bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors tracking-wider uppercase"
                onClick={() => alert("پیام شما با موفقیت ارسال شد.")}
              >
                ارسال پیام
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-xs font-semibold text-[#111] mb-4 uppercase tracking-wider">اطلاعات تماس</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">آدرس</p>
                    <p className="text-sm text-[#111]">تهران، خیابان ولیعصر، خیابان مطهری، پلاک ۱۲۳</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">تلفن</p>
                    <p className="text-sm text-[#111]">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    <p className="text-sm text-[#111]">۰۹۱۲-۱۲۳۴۵۶۷</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">ایمیل</p>
                    <p className="text-sm text-[#111]">info@solestore.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-[#111] mb-4 uppercase tracking-wider">ساعات کاری</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="text-gray-500">شنبه - چهارشنبه</span>
                  <span>۹:۰۰ - ۲۰:۰۰</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">پنجشنبه</span>
                  <span>۹:۰۰ - ۱۶:۰۰</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">جمعه</span>
                  <span className="text-red-400">تعطیل</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
