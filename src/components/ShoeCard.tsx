"use client";

import Link from "next/link";
import { useState } from "react";
import type { Shoe } from "@/types/shoe";
import { useCart } from "@/lib/cart-context";

export default function ShoeCard({ shoe }: { shoe: Shoe }) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  return (
    <div className="group relative card-3d">
      {shoe.new && (
        <span className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 badge-new text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wider uppercase">
          جدید
        </span>
      )}
      {shoe.sale && shoe.discount && (
        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 badge-sale text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 tracking-wider uppercase">
          -{shoe.discount}%
        </span>
      )}

      <Link href={`/products/${shoe.id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden bg-[var(--muted)] relative rounded-t-[16px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-[1]" />
          <img src={imgError ? `/placeholder.svg` : shoe.image} alt={shoe.name}
            onError={() => setImgError(true)} className="card-image w-full h-full object-cover" />
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-[2] flex gap-1 sm:gap-1.5">
            {shoe.colors.slice(0, 3).map((c) => (
              <span key={c.hex} className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-white/30 shadow-lg" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>
      </Link>

      <div className="card-content p-3 sm:p-4">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-600 mb-0.5 sm:mb-1 font-medium">{shoe.brand}</p>
        <Link href={`/products/${shoe.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{shoe.namePersian}</h3>
        </Link>
        <p className="text-[10px] sm:text-[11px] text-gray-600 mb-2 sm:mb-3 line-clamp-1">{shoe.name}</p>

        <div className="flex items-center justify-between">
          <div>
            {shoe.sale && shoe.discount ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-bold text-red-500">{new Intl.NumberFormat("fa-IR").format(shoe.price * (1 - shoe.discount / 100))}</span>
                <span className="text-[9px] sm:text-[10px] text-gray-600 line-through">{new Intl.NumberFormat("fa-IR").format(shoe.price)}</span>
                <span className="text-[9px] sm:text-[10px] text-gray-600">تومان</span>
              </div>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-white">
                {new Intl.NumberFormat("fa-IR").format(shoe.price)}
                <span className="text-[9px] sm:text-[10px] text-gray-600 mr-0.5 sm:mr-1">تومان</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="text-[9px] sm:text-[10px] text-gray-500">{shoe.rating}</span>
            <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <button onClick={() => addItem(shoe, shoe.sizes[0], shoe.colors[0].name)}
          className="w-full py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold btn-primary tracking-wider uppercase rounded-xl">
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
