"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getShoeById, getAllShoes } from "@/lib/shoe-store";
import ShoeCard from "@/components/ShoeCard";
import type { Shoe } from "@/types/shoe";

const faqData = [
  { q: "روش‌های ارسال چیست؟", a: "ارسال به سراسر ایران از طریق پست پیشتاز (۳ تا ۵ روز کاری) و تیپاکس (۲ تا ۳ روز کاری) انجام می‌شود." },
  { q: "مدت زمان بازگشت کالا چقدر است؟", a: "شما تا ۷ روز پس از دریافت کالا فرصت دارید در صورت عدم رضایت، محصول را بازگردانید." },
  { q: "اصالت کالا چگونه تضمین می‌شود؟", a: "همه محصولات Sole Store دارای ضمانت اصالت کالا بوده و مستقیماً از برندهای معتبر تهیه می‌شوند." },
  { q: "هزینه ارسال چقدر است؟", a: "سفارش‌های بالای ۲ میلیون تومان شامل ارسال رایگان هستند." },
];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${filled ? "text-[var(--accent)]" : "text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const sizeGuide = [
  { size: "۳۸", us: "6.5", uk: "5.5", cm: "۲۴" },
  { size: "۳۹", us: "7", uk: "6", cm: "۲۴.۵" },
  { size: "۴۰", us: "7.5", uk: "6.5", cm: "۲۵" },
  { size: "۴۱", us: "8", uk: "7", cm: "۲۵.۵" },
  { size: "۴۲", us: "8.5", uk: "7.5", cm: "۲۶" },
  { size: "۴۳", us: "9.5", uk: "8.5", cm: "۲۶.۵" },
  { size: "۴۴", us: "10", uk: "9", cm: "۲۷" },
  { size: "۴۵", us: "10.5", uk: "9.5", cm: "۲۷.۵" },
  { size: "۴۶", us: "11.5", uk: "10.5", cm: "۲۸" },
];

export default function ProductDetailContent({ shoeId, staticShoe }: { shoeId: string; staticShoe?: Shoe }) {
  const { addItem } = useCart();
  const [shoe, setShoe] = useState<Shoe | undefined>(staticShoe);
  const [relatedShoes, setRelatedShoes] = useState<Shoe[]>([]);
  const [shoeLoaded, setShoeLoaded] = useState(!!staticShoe);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const merged = await getShoeById(shoeId);
      if (merged) { setShoe(merged); setShoeLoaded(true); }
      const all = await getAllShoes();
      setRelatedShoes(all.filter((s) => s.category === (merged?.category || staticShoe?.category) && s.id !== shoeId).slice(0, 4));
    })();
  }, [shoeId]);

  if (!shoe && shoeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">محصول مورد نظر یافت نشد.</p>
          <a href="/" className="text-xs text-[var(--accent)] hover:underline">بازگشت به صفحه اصلی</a>
        </div>
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const displayPrice = shoe.sale && shoe.discount ? shoe.price * (1 - shoe.discount / 100) : shoe.price;

  const handleAdd = () => {
    addItem(shoe, selectedSize || shoe.sizes[0], selectedColor || shoe.colors[0].name);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-14 sm:pt-16">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-black min-h-[50vh] sm:min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          <img src={imgError.has("hero") ? shoe.image : shoe.images[activeImage] || shoe.image} alt=""
            onError={() => setImgError((prev) => new Set(prev).add("hero"))}
            className="w-full h-full object-cover opacity-30 sm:opacity-40 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
          <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-600 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors shrink-0">خانه</Link>
            <span className="shrink-0">/</span>
            <Link href="/#products" className="hover:text-[var(--accent)] transition-colors shrink-0">{shoe.categoryPersian}</Link>
            <span className="shrink-0">/</span>
            <span className="text-gray-400 truncate">{shoe.namePersian}</span>
          </nav>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-medium mb-1 sm:mb-2">{shoe.brand}</p>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2">{shoe.namePersian}</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{shoe.name}</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => <Star key={i} filled={i < Math.round(shoe.rating)} />)}
              <span className="text-[10px] sm:text-xs text-gray-500 mr-2">{shoe.rating} / 5</span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600">|</span>
            <span className="text-[10px] sm:text-xs text-green-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              موجود در انبار
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="aspect-square bg-[var(--muted)] overflow-hidden rounded-3xl border border-[var(--border)] shadow-2xl">
                <img src={imgError.has("main") ? shoe.image : shoe.images[activeImage] || shoe.image} alt={shoe.name}
                  onError={() => setImgError((prev) => new Set(prev).add("main"))}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              {/* Zoom hint */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-[10px] text-gray-400 px-2.5 py-1.5 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                  hover برای بزرگنمایی
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-3 sm:mt-4">
              {[shoe.image, ...shoe.images.slice(0, 3)].map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-[var(--muted)] overflow-hidden border-2 transition-all rounded-2xl ${
                    activeImage === i ? "border-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]" : "border-transparent hover:border-gray-700"
                  }`}>
                  <img src={imgError.has(`thumb-${i}`) ? shoe.image : img} alt=""
                    onError={() => setImgError((prev) => new Set(prev).add(`thumb-${i}`))} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Price */}
            <div className="mb-4 sm:mb-6">
              {shoe.sale && shoe.discount ? (
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-red-500">{new Intl.NumberFormat("fa-IR").format(displayPrice)}</span>
                  <span className="text-sm sm:text-base text-gray-500 line-through">{new Intl.NumberFormat("fa-IR").format(shoe.price)}</span>
                  <span className="text-xs text-gray-500">تومان</span>
                  <span className="text-[11px] bg-red-600/20 text-red-500 px-2 py-0.5 font-medium border border-red-500/30 rounded-lg">-{shoe.discount}%</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white">{new Intl.NumberFormat("fa-IR").format(shoe.price)}</span>
                  <span className="text-xs text-gray-500">تومان</span>
                </div>
              )}
            </div>

            {/* Short description */}
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 sm:mb-8 border-r-2 border-[var(--accent)] pr-4">
              {shoe.descriptionPersian}
            </p>

            {/* Purchase stats */}
            <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-[10px] sm:text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                ارسال به سراسر ایران
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {Math.floor(Math.random() * 200 + 50)} نفر این محصول را خریده‌اند
              </div>
            </div>

            {/* Colors */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-300">رنگ:</h3>
                {selectedColor && <span className="text-[10px] sm:text-xs text-gray-500">{selectedColor}</span>}
              </div>
              <div className="flex gap-2 sm:gap-3">
                {shoe.colors.map((c) => (
                  <button key={c.hex} onClick={() => setSelectedColor(c.name)}
                    className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 transition-all ${
                      selectedColor === c.name ? "border-[var(--accent)] scale-110 shadow-lg shadow-[var(--accent-glow)] ring-2 ring-[var(--accent)]/30" : "border-gray-700 hover:border-gray-500"
                    }`} style={{ backgroundColor: c.hex }} title={c.name} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-300">سایز:</h3>
                <button onClick={() => setOpenFaq(openFaq === 99 ? null : 99)} className="text-[10px] sm:text-xs text-[var(--accent)] hover:underline">
                  راهنمای سایز
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {shoe.sizes.map((size) => {
                  const isOut = !shoe.inStock;
                  return (
                    <button key={size} onClick={() => !isOut && setSelectedSize(size)} disabled={isOut}
                      className={`min-w-[44px] sm:w-14 h-10 sm:h-12 text-xs sm:text-sm font-medium border transition-all rounded-xl ${
                        isOut ? "opacity-30 cursor-not-allowed bg-[var(--muted)] text-gray-600 border-[var(--border)] line-through" :
                        selectedSize === size ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]" : "bg-[var(--muted)] text-gray-400 border-[var(--border)] hover:border-[var(--accent)] hover:text-white"
                      }`}>{size}</button>
                  );
                })}
              </div>

              {/* Size guide popup */}
              {openFaq === 99 && (
                <div className="mt-3 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-300">راهنمای سایز (سانتی‌متر)</span>
                    <button onClick={() => setOpenFaq(null)} className="text-gray-500 hover:text-white">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                    <div className="text-gray-600 font-medium py-1">ایران</div>
                    <div className="text-gray-600 font-medium py-1">US</div>
                    <div className="text-gray-600 font-medium py-1">UK</div>
                    <div className="text-gray-600 font-medium py-1">سانتی‌متر</div>
                    {sizeGuide.map((row) => (
                      <>
                        <div key={`${row.size}-size`} className="text-gray-300 py-1 border-t border-[var(--border)]">{row.size}</div>
                        <div key={`${row.size}-us`} className="text-gray-500 py-1 border-t border-[var(--border)]">{row.us}</div>
                        <div key={`${row.size}-uk`} className="text-gray-500 py-1 border-t border-[var(--border)]">{row.uk}</div>
                        <div key={`${row.size}-cm`} className="text-gray-500 py-1 border-t border-[var(--border)]">{row.cm}</div>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="sm:relative sm:z-auto fixed bottom-0 left-0 right-0 p-3 sm:p-0 bg-[#111] sm:bg-transparent border-t sm:border-0 border-[var(--border)] z-30">
              <div className="flex items-center gap-3">
                <button onClick={handleAdd}
                  className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all ${
                    added ? "bg-green-600 text-white" : "btn-primary"
                  }`}>
                  {added ? "به سبد خرید اضافه شد ✓" : "افزودن به سبد خرید"}
                </button>
              </div>
              {/* Trust badges */}
              <div className="hidden sm:flex items-center justify-center gap-4 mt-3 text-[10px] text-gray-600">
                <span>✓ ضمانت اصالت</span>
                <span>✓ ۷ روز بازگشت</span>
                <span>✓ ارسال سریع</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-[var(--border)] mt-4">
              {[
                { icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "ضمانت اصالت کالا" },
                { icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12", label: "ارسال سریع و رایگان" },
                { icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182", label: "بازگشت تا ۷ روز" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 mx-auto text-[var(--accent)] mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">{f.label}</p>
                </div>
              ))}
            </div>

            <div className="sm:hidden h-16" />
          </div>
        </div>

        {/* === Tabs Section === */}
        <div className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-[var(--border)]">
          {/* Tab buttons */}
          <div className="flex border-b border-[var(--border)] mb-6 sm:mb-8 overflow-x-auto">
            {[
              { key: "desc" as const, label: "توضیحات" },
              { key: "specs" as const, label: "مشخصات" },
              { key: "reviews" as const, label: "نظرات کاربران" },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-6 pb-3 sm:pb-4 text-xs sm:text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.key ? "border-[var(--accent)] text-white" : "border-transparent text-gray-600 hover:text-gray-400"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "desc" && (
            <div className="max-w-3xl">
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">{shoe.descriptionPersian}</p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">{shoe.description}</p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { title: "راحتی در طول روز", desc: "طراحی ارگونومیک با کفی نرم و منعطف برای استفاده طولانی مدت بدون خستگی" },
                  { title: "کیفیت ساخت بالا", desc: "استفاده از بهترین مواد اولیه و دوخت دقیق برای دوام و ماندگاری بالا" },
                  { title: "طراحی مدرن", desc: "استایلی شیک و به روز که با هر نوع پوششی هماهنگ می‌شود" },
                  { title: "قیمت مناسب", desc: "بهترین قیمت در بازار با کیفیت هم‌رده برندهای معتبر جهانی" },
                ].map((item) => (
                  <div key={item.title} className="p-3 sm:p-4 bg-[var(--muted)] border border-[var(--border)] rounded-2xl">
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full text-xs sm:text-sm">
                <tbody>
                  {[
                    { label: "برند", value: shoe.brand },
                    { label: "دسته‌بندی", value: shoe.categoryPersian },
                    { label: "سایزهای موجود", value: shoe.sizes.join("، ") },
                    { label: "رنگ‌های موجود", value: shoe.colors.map((c) => c.name).join("، ") },
                    { label: "کشور تولید", value: "چین / ویتنام" },
                    { label: "جنس رویه", value: "چرم طبیعی / مش تنفس‌پذیر" },
                    { label: "جنس کفی", value: "فوم EVA با حافظه" },
                    { label: "جنس زیره", value: "لاستیک مقاوم سایش" },
                    { label: "مناسب برای", value: "استفاده روزمره" },
                    { label: "گارانتی", value: "۶ ماه ضمانت اصالت" },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-[var(--muted)]/50" : ""}>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-500 font-medium w-36 sm:w-44">{row.label}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-300">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl">
              {/* Overall rating */}
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-[var(--muted)] border border-[var(--border)] rounded-2xl">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-[var(--accent)]">{shoe.rating.toFixed(1)}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">از ۵</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} filled={i < Math.round(shoe.rating)} />)}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-600">میانگین امتیاز از {Math.floor(Math.random() * 50 + 10)} نظر</p>
                </div>
              </div>

              {/* Reviews */}
              {[
                { name: "علی رضایی", rating: 5, date: "۲ هفته پیش", text: "کیفیت عالی، دقیقاً مطابق تصویر بود. رنگ‌بندی زیبا و دوخت بسیار تمیز. پیشنهاد می‌کنم.", color: "مشکی", size: "۴۲" },
                { name: "سارا محمدی", rating: 4, date: "۱ ماه پیش", text: "کفش راحتی است و برای استفاده روزمره عالیه. فقط کفی‌اش کمی زود کثیف می‌شه.", color: "سفید", size: "۳۹" },
                { name: "امیر حسینی", rating: 5, date: "۳ هفته پیش", text: "سومین باره که از Sole Store خرید می‌کنم. همیشه عالی بوده. ارسال سریع و بسته‌بندی عالی", color: "قهوه‌ای", size: "۴۳" },
                { name: "ندا کریمی", rating: 4, date: "۲ ماه پیش", text: "برای کادو خریدم، خیلی خوشش اومد. سایزبندی دقیق و راحت.", color: "آبی", size: "۴۰" },
              ].map((review, i) => (
                <div key={i} className="py-4 sm:py-5 border-b border-[var(--border)] last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white">{review.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, idx) => <Star key={idx} filled={idx < review.rating} />)}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-600">{review.date}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed mb-1">{review.text}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-600">
                    <span>رنگ: {review.color}</span>
                    <span>سایز: {review.size}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === FAQ Section === */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[var(--border)]">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">سوالات متداول</h2>
          <div className="max-w-2xl space-y-2">
            {faqData.map((faq, i) => (
              <div key={i} className="border border-[var(--border)] rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-xs sm:text-sm text-gray-300 hover:bg-[var(--muted)] transition-colors text-right">
                  {faq.q}
                  <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === Related Products === */}
        {relatedShoes.length > 0 && (
          <section className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-white">محصولات مشابه</h2>
              <Link href={`/?category=${shoe.category}#products`} className="text-[10px] sm:text-xs text-[var(--accent)] hover:underline">
                مشاهده همه
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedShoes.map((s) => <ShoeCard key={s.id} shoe={s} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
