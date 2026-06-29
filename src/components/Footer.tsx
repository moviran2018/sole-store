import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fafaf8] border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold tracking-wider text-[#111]">SOLE</span>
              <span className="text-[10px] text-[var(--accent)] font-light tracking-[0.2em] uppercase">STORE</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              فروشگاه تخصصی کفش با بهترین برندهای دنیا. کیفیت، راحتی و استایل را با هم تجربه کنید.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111] mb-4">دسترسی سریع</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-500 hover:text-[#111] transition-colors">خانه</Link>
              <Link href="/#products" className="text-sm text-gray-500 hover:text-[#111] transition-colors">محصولات</Link>
              <Link href="/about" className="text-sm text-gray-500 hover:text-[#111] transition-colors">درباره ما</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-[#111] transition-colors">تماس</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111] mb-4">دسته‌بندی‌ها</h3>
            <div className="flex flex-col gap-2">
              <Link href="/?category=sneakers" className="text-sm text-gray-500 hover:text-[#111] transition-colors">کتانی</Link>
              <Link href="/?category=formal" className="text-sm text-gray-500 hover:text-[#111] transition-colors">رسمی</Link>
              <Link href="/?category=running" className="text-sm text-gray-500 hover:text-[#111] transition-colors">دویدن</Link>
              <Link href="/?category=boots" className="text-sm text-gray-500 hover:text-[#111] transition-colors">چکمه</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#111] mb-4">اطلاعات تماس</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <span>تهران، خیابان ولیعصر</span>
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              <span>info@solestore.com</span>
              <div className="flex gap-3 mt-2">
                <span className="text-gray-400 hover:text-[#111] cursor-pointer transition-colors">اینستاگرام</span>
                <span className="text-gray-400 hover:text-[#111] cursor-pointer transition-colors">تلگرام</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SOLE STORE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
