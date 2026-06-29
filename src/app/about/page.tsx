import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-14 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] font-medium mb-3 sm:mb-4">About Us</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            داستان <span className="text-gradient">Sole Store</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            ما در Sole Store معتقدیم که کفش مناسب می‌تواند یک قدم معمولی را به یک تجربه فراموش‌نشدنی تبدیل کند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <div className="aspect-square bg-[var(--muted)] overflow-hidden rounded-2xl card-3d">
            <div className="w-full h-full bg-gradient-to-br from-orange-900/30 to-black flex items-center justify-center">
              <span className="text-5xl sm:text-6xl opacity-20">👟</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">کیفیت، اولویت اول ما</h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3 sm:mb-4">
              ما با افتخار مجموعه‌ای از بهترین برندهای کفش دنیا را گرد هم آورده‌ایم. از کتانی‌های روزمره گرفته تا کفش‌های رسمی مجلسی، هر محصول با دقت انتخاب شده تا بالاترین استانداردهای کیفیت و راحتی را ارائه دهد.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-5 sm:mb-6">
              تیم ما متشکل از متخصصانی است که به مد و کیفیت عشق می‌ورزند. ما هر روز تلاش می‌کنیم تا بهترین تجربه خرید را برای شما فراهم کنیم.
            </p>
            <Link href="/#products" className="inline-flex items-center px-5 py-2.5 btn-primary text-xs font-semibold tracking-wider uppercase rounded-xl">
              مشاهده محصولات
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-t border-[var(--border)] pt-8 sm:pt-12">
          {[
            { number: "۱۰۰+", label: "محصول" },
            { number: "۲۰+", label: "برند" },
            { number: "۵۰۰۰+", label: "مشتری راضی" },
            { number: "۹۹٪", label: "رضایت" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gradient">{stat.number}</p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
