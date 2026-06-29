"use client";

import { useState } from "react";
import Link from "next/link";
import { shoes } from "@/data/shoes";
import { useCart } from "@/lib/cart-context";
import ShoeCard from "@/components/ShoeCard";
import type { Shoe } from "@/types/shoe";

export default function ProductDetailContent({ shoe }: { shoe: Shoe }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imgError, setImgError] = useState<Set<string>>(new Set());

  const relatedShoes = shoes
    .filter((s) => s.category === shoe.category && s.id !== shoe.id)
    .slice(0, 4);

  const displayPrice = shoe.sale && shoe.discount
    ? shoe.price * (1 - shoe.discount / 100)
    : shoe.price;

  const handleImgError = (imgId: string) => {
    setImgError((prev) => new Set(prev).add(imgId));
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-[#111] transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-[#111] transition-colors">
            {shoe.categoryPersian}
          </Link>
          <span>/</span>
          <span className="text-[#111]">{shoe.namePersian}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-[var(--muted)] overflow-hidden mb-4">
              <img
                src={imgError.has("main") ? shoe.image : shoe.images[activeImage] || shoe.image}
                alt={shoe.name}
                onError={() => handleImgError("main")}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[shoe.image, ...shoe.images.slice(0, 2)].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-[var(--muted)] overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-[var(--accent)]" : "border-transparent"
                  }`}
                >
                  <img
                    src={imgError.has(`thumb-${i}`) ? shoe.image : img}
                    alt=""
                    onError={() => handleImgError(`thumb-${i}`)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              {shoe.brand}
            </p>
            <h1 className="text-2xl font-semibold text-[#111] mb-1">{shoe.namePersian}</h1>
            <p className="text-sm text-gray-400 mb-4">{shoe.name}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(shoe.rating) ? "text-[var(--accent)]" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">{shoe.rating} / 5</span>
            </div>

            <div className="mb-6">
              {shoe.sale && shoe.discount ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-red-500">
                    {new Intl.NumberFormat("fa-IR").format(displayPrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {new Intl.NumberFormat("fa-IR").format(shoe.price)}
                  </span>
                  <span className="text-xs text-gray-400">تومان</span>
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 font-medium">
                    -{shoe.discount}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-[#111]">
                    {new Intl.NumberFormat("fa-IR").format(shoe.price)}
                  </span>
                  <span className="text-xs text-gray-400">تومان</span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              {shoe.descriptionPersian}
            </p>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[#111] mb-3">رنگ:</h3>
              <div className="flex gap-3">
                {shoe.colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c.name
                        ? "border-[#111] scale-110"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-semibold text-[#111] mb-3">سایز:</h3>
              <div className="flex flex-wrap gap-2">
                {shoe.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? "bg-[#111] text-white border-[#111]"
                        : "bg-white text-[#111] border-[var(--border)] hover:border-[#111]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const size = selectedSize || shoe.sizes[0];
                const color = selectedColor || shoe.colors[0].name;
                addItem(shoe, size, color);
              }}
              className="w-full py-3.5 bg-[#111] text-white text-sm font-medium hover:bg-[#333] transition-colors tracking-wider uppercase mb-4"
            >
              افزودن به سبد خرید
            </button>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-[var(--border)]">
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[10px] text-gray-500">ضمانت اصالت</p>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <p className="text-[10px] text-gray-500">ارسال سریع</p>
              </div>
              <div className="text-center">
                <svg className="w-5 h-5 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                <p className="text-[10px] text-gray-500">۷ روز بازگشت</p>
              </div>
            </div>
          </div>
        </div>

        {relatedShoes.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[#111] mb-6">محصولات مشابه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedShoes.map((s) => (
                <ShoeCard key={s.id} shoe={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
