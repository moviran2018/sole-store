import Link from "next/link";
import menuData from "@/data/menu.json";
import { formatPrice } from "@/lib/utils";

const featuredItems = menuData.slice(0, 4);

const emojiMap: Record<string, string> = {
  "استیک گریل شده": "🥩",
  "سالاد سزار": "🥗",
  "پیتزا مارگاریتا": "🍕",
  "سوشی مخلوط": "🍣",
};

export default function FeaturedMenu() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-500 font-semibold text-sm tracking-widest uppercase">
            —— منوی ویژه ——
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            محبوب‌ترین غذاها
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            انتخاب‌های برتر ما که توسط مهمانان عزیز بیشترین استقبال را داشته‌اند
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-amber-900/30 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-to-br from-amber-900/40 to-orange-900/40 flex items-center justify-center">
                <span className="text-6xl transition-transform group-hover:scale-110">
                  {emojiMap[item.name] || ["🥘", "🍲", "🥙", "🌮"][index]}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{formatPrice(item.price)}</span>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-xl transition-all hover:scale-105"
          >
            مشاهده منوی کامل
            <span>←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
