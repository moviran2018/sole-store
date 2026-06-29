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
    bg: "from-amber-100/40 via-white to-stone-200/30",
    img: "https://picsum.photos/seed/hero1/1600/900",
    link: "/#products",
    btnText: "مشاهده محصولات",
  },
  {
    id: 2,
    title: "ورزشی",
    subtitle: "عملکرد",
    desc: "کفش‌های ورزشی با جدیدترین تکنولوژی روز دنیا",
    label: "Sport Performance",
    bg: "from-blue-100/40 via-white to-slate-200/30",
    img: "https://picsum.photos/seed/hero2/1600/900",
    link: "/?category=sport",
    btnText: "مشاهده",
  },
  {
    id: 3,
    title: "تابستانی",
    subtitle: "طراوت",
    desc: "صندل‌ها و کفش‌های تابستانی برای روزهای گرم",
    label: "Summer Collection",
    bg: "from-yellow-100/40 via-white to-orange-200/30",
    img: "https://picsum.photos/seed/hero3/1600/900",
    link: "/?category=sandals",
    btnText: "مشاهده",
  },
  {
    id: 4,
    title: "کلاسیک",
    subtitle: "اصالت",
    desc: "کفش‌های رسمی و کلاسیک برای موقعیت‌های خاص",
    label: "Classic Elegance",
    bg: "from-stone-200/40 via-white to-stone-300/30",
    img: "https://picsum.photos/seed/hero4/1600/900",
    link: "/?category=formal",
    btnText: "مشاهده",
  },
  {
    id: 5,
    title: "کمپین",
    subtitle: "ماجراجویی",
    desc: "چکمه‌های مقاوم برای هر مسیری",
    label: "Adventure Ready",
    bg: "from-green-100/40 via-white to-emerald-200/30",
    img: "https://picsum.photos/seed/hero5/1600/900",
    link: "/?category=boots",
    btnText: "مشاهده",
  },
  {
    id: 6,
    title: "شیک",
    subtitle: "جذابیت",
    desc: "کفش‌های پاشنه‌بلند برای شب‌های خاص",
    label: "Evening Glamour",
    bg: "from-rose-100/40 via-white to-pink-200/30",
    img: "https://picsum.photos/seed/hero6/1600/900",
    link: "/?category=heels",
    btnText: "مشاهده",
  },
  {
    id: 7,
    title: "روزمره",
    subtitle: "راحتی",
    desc: "کفش‌های روزمره برای استایل همیشگی شما",
    label: "Daily Comfort",
    bg: "from-sky-100/40 via-white to-indigo-200/30",
    img: "https://picsum.photos/seed/hero7/1600/900",
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
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent" />
          {!imgErrors.has(i) && (
            <img
              src={slide.img}
              alt=""
              onError={() => setImgErrors((prev) => new Set(prev).add(i))}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
        </div>
      ))}

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-4 font-medium">
            {s.label}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#111] leading-tight mb-2">
            {s.subtitle}
            <span className="block font-semibold mt-1">{s.title}</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
            {s.desc}
          </p>
          <Link
            href={s.link}
            className="inline-flex items-center px-7 py-3.5 bg-[#111] text-white text-xs font-medium tracking-wider uppercase hover:bg-[#333] transition-all hover:translate-y-[-1px]"
          >
            {s.btnText}
          </Link>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 border border-[var(--border)] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all text-gray-500 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 border border-[var(--border)] hover:bg-[#111] hover:text-white hover:border-[#111] transition-all text-gray-500 z-10"
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
                ? "w-8 h-1.5 bg-[#111]"
                : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400 rounded-full"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-10 text-[10px] text-gray-400 font-mono tracking-wider">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
