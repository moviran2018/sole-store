import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-4">
            About Us
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#111] mb-6">
            داستان <span className="text-[var(--accent)]">Sole Store</span>
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            ما در Sole Store معتقدیم که کفش مناسب می‌تواند یک قدم معمولی را به یک تجربه فراموش‌نشدنی تبدیل کند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-square bg-[var(--muted)] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[var(--accent-light)] to-[var(--muted)] flex items-center justify-center">
              <span className="text-6xl opacity-30">👟</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#111] mb-4">کیفیت، اولویت اول ما</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              ما با افتخار مجموعه‌ای از بهترین برندهای کفش دنیا را گرد هم آورده‌ایم. از کتانی‌های روزمره گرفته تا کفش‌های رسمی مجلسی، هر محصول با دقت انتخاب شده تا بالاترین استانداردهای کیفیت و راحتی را ارائه دهد.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              تیم ما متشکل از متخصصانی است که به مد و کیفیت عشق می‌ورزند. ما هر روز تلاش می‌کنیم تا بهترین تجربه خرید را برای شما فراهم کنیم.
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center px-5 py-2.5 bg-[#111] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#333] transition-colors"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--border)] pt-12">
          {[
            { number: "۱۰۰+", label: "محصول" },
            { number: "۲۰+", label: "برند" },
            { number: "۵۰۰۰+", label: "مشتری راضی" },
            { number: "۹۹٪", label: "رضایت" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-[#111]">{stat.number}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
