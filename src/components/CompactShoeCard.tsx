"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Shoe } from "@/types/shoe";

export default function CompactShoeCard({ shoe }: { shoe: Shoe }) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  return (
    <div className="w-full">
      <Link href={`/products/${shoe.id}`}>
        <div className="aspect-square rounded-xl overflow-hidden bg-[var(--muted)] relative mb-2">
          {shoe.new && (
            <span className="badge-new text-white text-[8px] font-bold px-1.5 py-0.5 rounded absolute top-1.5 right-1.5 z-10">جدید</span>
          )}
          {shoe.sale && shoe.discount && (
            <span className="badge-sale text-white text-[8px] font-bold px-1.5 py-0.5 rounded absolute top-1.5 left-1.5 z-10">-{shoe.discount}%</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 z-[1]" />
          <img src={imgError ? `/placeholder.svg` : shoe.image} alt={shoe.name}
            onError={() => setImgError(true)} className="w-full h-full object-cover" />
          <div className="absolute bottom-1.5 right-1.5 z-[2] flex gap-0.5">
            {shoe.colors.slice(0, 3).map((c) => (
              <span key={c.hex} className="w-1.5 h-1.5 rounded-full border border-white/30" style={{ backgroundColor: c.hex }} />
            ))}
          </div>
        </div>
      </Link>
      <p className="text-[9px] text-gray-600 truncate mb-0.5">{shoe.brand}</p>
      <Link href={`/products/${shoe.id}`}>
        <h3 className="text-[11px] font-bold text-white truncate leading-tight mb-0.5">{shoe.namePersian}</h3>
      </Link>
      <div className="flex items-center justify-between">
        <div>
          {shoe.sale && shoe.discount ? (
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-red-500">{new Intl.NumberFormat("fa-IR").format(shoe.price * (1 - shoe.discount / 100))}</span>
              <span className="text-[8px] text-gray-600 line-through">{new Intl.NumberFormat("fa-IR").format(shoe.price)}</span>
            </div>
          ) : (
            <span className="text-[11px] font-bold text-white">{new Intl.NumberFormat("fa-IR").format(shoe.price)}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[9px] text-gray-500">{shoe.rating}</span>
          <svg className="w-2.5 h-2.5 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
      <button onClick={() => addItem(shoe, shoe.sizes[0], shoe.colors[0].name)}
        className="w-full mt-1.5 py-1 text-[9px] font-bold btn-primary rounded-lg">
        افزودن به سبد
      </button>
    </div>
  );
}
