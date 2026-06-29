"use client";

import Link from "next/link";
import { useState } from "react";
import type { Shoe } from "@/types/shoe";
import { useCart } from "@/lib/cart-context";

export default function ShoeCard({ shoe }: { shoe: Shoe }) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  const imgSrc = imgError
    ? `/placeholder.svg`
    : shoe.image;

  return (
    <div className="group relative bg-white border border-[var(--border)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--accent)]/30">
      {shoe.new && (
        <span className="absolute top-3 right-3 z-10 bg-[#111] text-white text-[10px] font-medium px-2 py-1 tracking-wider uppercase">
          جدید
        </span>
      )}
      {shoe.sale && shoe.discount && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-medium px-2 py-1 tracking-wider uppercase">
          -{shoe.discount}%
        </span>
      )}

      <Link href={`/products/${shoe.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-[var(--muted)]">
          <img
            src={imgSrc}
            alt={shoe.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
          {shoe.brand}
        </p>
        <Link href={`/products/${shoe.id}`}>
          <h3 className="text-sm font-medium text-[#111] mb-1 line-clamp-1 hover:text-[var(--accent)] transition-colors">
            {shoe.namePersian}
          </h3>
        </Link>
        <p className="text-[11px] text-gray-400 mb-3 line-clamp-1">{shoe.name}</p>

        <div className="flex items-center justify-between">
          <div>
            {shoe.sale && shoe.discount ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-red-500">
                  {new Intl.NumberFormat("fa-IR").format(shoe.price * (1 - shoe.discount / 100))}
                </span>
                <span className="text-[10px] text-gray-400 line-through">
                  {new Intl.NumberFormat("fa-IR").format(shoe.price)}
                </span>
                <span className="text-[10px] text-gray-400">تومان</span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-[#111]">
                {new Intl.NumberFormat("fa-IR").format(shoe.price)}
                <span className="text-[10px] text-gray-400 mr-1">تومان</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">{shoe.rating}</span>
            <svg className="w-3 h-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        <div className="flex gap-1.5 mt-3">
          {shoe.colors.slice(0, 4).map((c) => (
            <span
              key={c.hex}
              className="w-3.5 h-3.5 rounded-full border border-gray-200"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {shoe.colors.length > 4 && (
            <span className="text-[9px] text-gray-400 self-center">+{shoe.colors.length - 4}</span>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => addItem(shoe, shoe.sizes[0], shoe.colors[0].name)}
          className="w-full py-2.5 text-xs font-medium bg-[#111] text-white hover:bg-[#333] transition-colors tracking-wider uppercase"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
