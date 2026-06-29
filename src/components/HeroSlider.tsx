"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { shoes } from "@/data/shoes";

const categories = ["sport", "running", "casual", "formal", "boots", "sandals", "heels"] as const;

const allSlides = categories.map((cat, idx) => {
  const catShoes = shoes.filter((s) => s.category === cat);
  const shoe = catShoes[0] || shoes[idx % shoes.length];
  const labels: Record<string, { title: string; subtitle: string; desc: string; label: string }> = {
    sport: { title: "ورزشی", subtitle: "عملکرد", desc: "کفش‌های ورزشی با جدیدترین تکنولوژی روز دنیا", label: "Sport Performance" },
    running: { title: "دویدن", subtitle: "سرعت", desc: "کفش‌های دویدن حرفه‌ای برای بهترین عملکرد", label: "Running Gear" },
    casual: { title: "روزمره", subtitle: "راحتی", desc: "کفش‌های روزمره برای استایل همیشگی شما", label: "Daily Comfort" },
    formal: { title: "کلاسیک", subtitle: "اصالت", desc: "کفش‌های رسمی و کلاسیک برای موقعیت‌های خاص", label: "Classic Elegance" },
    boots: { title: "کمپین", subtitle: "ماجراجویی", desc: "چکمه‌های مقاوم برای هر مسیری", label: "Adventure Ready" },
    sandals: { title: "تابستانی", subtitle: "طراوت", desc: "صندل‌ها و کفش‌های تابستانی برای روزهای گرم", label: "Summer Collection" },
    heels: { title: "شیک", subtitle: "جذابیت", desc: "کفش‌های پاشنه‌بلند برای شب‌های خاص", label: "Evening Glamour" },
  };
  const info = labels[cat] || { title: "مدرن", subtitle: "گام‌های", desc: "جدیدترین مجموعه کفش", label: "Premium Collection" };
  return { ...info, image: shoe.image, link: `/?category=${cat}`, btnText: "مشاهده محصولات", id: idx };
});

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const next = useCallback(() => setCurrent((c) => (c + 1) % allSlides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + allSlides.length) % allSlides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const s = allSlides[current];

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black hero-3d">
      {allSlides.map((slide, i) => (
        <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}>
          {!imgErrors.has(i) && (
            <img src={slide.image} alt="" onError={() => setImgErrors((prev) => new Set(prev).add(i))}
              className="hero-bg absolute inset-0 w-full h-full object-cover opacity-30 sm:opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative h-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl sm:max-w-2xl">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-3 sm:mb-4 font-medium">{s.label}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-1.5 sm:mb-2">
            {s.subtitle}
            <span className="block font-bold mt-1 text-gradient">{s.title}</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-sm sm:max-w-md">{s.desc}</p>
          <Link href={s.link} className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 btn-primary text-[11px] sm:text-xs font-semibold tracking-wider uppercase rounded-xl">
            {s.btnText}
          </Link>
        </div>
      </div>

      <button onClick={prev} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center glass hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all text-gray-500 hover:text-white z-10 rounded-xl" aria-label="Previous">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button onClick={next} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center glass hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all text-gray-500 hover:text-white z-10 rounded-xl" aria-label="Next">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-10">
        {allSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-300 ${i === current ? "w-5 sm:w-8 h-1 sm:h-1.5 bg-[var(--accent)] shadow-lg shadow-[var(--accent-glow)] rounded-full" : "w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gray-600 hover:bg-gray-400 rounded-full"}`}
            aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 z-10 text-[9px] sm:text-[10px] text-gray-600 font-mono tracking-wider">
        {String(current + 1).padStart(2, "0")} / {String(allSlides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
