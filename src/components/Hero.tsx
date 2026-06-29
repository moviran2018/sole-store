import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-amber-950" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)`
      }} />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="text-6xl sm:text-8xl inline-block animate-bounce">🍽️</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
          به <span className="text-amber-400">FoodMode</span> خوش آمدید
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          جایی که طعم‌های اصیل با مدرن‌ترین سبک آشپزی تلفیق می‌شوند.
          تجربه‌ای فراموش‌نشدنی از غذا را با ما تجربه کنید.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
          >
            مشاهده منو
          </Link>
          <Link
            href="/reserve"
            className="border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10 font-semibold px-8 py-4 rounded-xl text-lg transition-all"
          >
            رزرو میز
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse">
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
