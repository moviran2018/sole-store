"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "مدرن",
    subtitle: "گام‌های",
    desc: "مجموعه‌ای از بهترین و شیک‌ترین کفش‌های روز دنیا",
    label: "Premium Footwear Collection",
    bg: "from-orange-900/20 via-black to-stone-950",
    link: "/#products",
    btnText: "مشاهده محصولات",
  },
  {
    id: 2,
    title: "ورزشی",
    subtitle: "عملکرد",
    desc: "کفش‌های ورزشی با جدیدترین تکنولوژی روز دنیا",
    label: "Sport Performance",
    bg: "from-orange-800/20 via-black to-stone-950",
    link: "/?category=sport",
    btnText: "مشاهده",
  },
  {
    id: 3,
    title: "تابستانی",
    subtitle: "طراوت",
    desc: "صندل‌ها و کفش‌های تابستانی برای روزهای گرم",
    label: "Summer Collection",
    bg: "from-orange-700/15 via-black to-stone-950",
    link: "/?category=sandals",
    btnText: "مشاهده",
  },
  {
    id: 4,
    title: "کلاسیک",
    subtitle: "اصالت",
    desc: "کفش‌های رسمی و کلاسیک برای موقعیت‌های خاص",
    label: "Classic Elegance",
    bg: "from-orange-900/20 via-black to-stone-950",
    link: "/?category=formal",
    btnText: "مشاهده",
  },
  {
    id: 5,
    title: "کمپین",
    subtitle: "ماجراجویی",
    desc: "چکمه‌های مقاوم برای هر مسیری",
    label: "Adventure Ready",
    bg: "from-orange-800/15 via-black to-stone-950",
    link: "/?category=boots",
    btnText: "مشاهده",
  },
  {
    id: 6,
    title: "شیک",
    subtitle: "جذابیت",
    desc: "کفش‌های پاشنه‌بلند برای شب‌های خاص",
    label: "Evening Glamour",
    bg: "from-orange-900/20 via-black to-stone-950",
    link: "/?category=heels",
    btnText: "مشاهده",
  },
  {
    id: 7,
    title: "روزمره",
    subtitle: "راحتی",
    desc: "کفش‌های روزمره برای استایل همیشگی شما",
    label: "Daily Comfort",
    bg: "from-orange-800/15 via-black to-stone-950",
    link: "/?category=casual",
    btnText: "مشاهده",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const s = slides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          {!imgErrors.has(i) && (
            <img
              src={`https://picsum.photos/seed/hero${slide.id}/1600/900`}
              alt=""
              onError={() => setImgErrors((prev) => new Set(prev).add(i))}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>
      ))}

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 font-medium">
            {s.label}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight mb-2">
            {s.subtitle}
            <span className="block font-bold mt-1 text-gradient">{s.title}</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
            {s.desc}
          </p>
          <Link
            href={s.link}
            className="inline-flex items-center px-8 py-3.5 btn-primary text-xs font-semibold tracking-wider uppercase"
          >
            {s.btnText}
          </Link>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center glass hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all text-gray-500 hover:text-white z-10"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center glass hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all text-gray-500 hover:text-white z-10"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 ${
              i === current
                ? "w-8 h-1.5 bg-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]"
                : "w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400 rounded-full"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-10 text-[10px] text-gray-600 font-mono tracking-wider">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
