"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-gray-400 text-sm mb-2">سبد خرید شما خالی است.</p>
          <Link href="/#products" className="inline-flex items-center px-6 py-3 btn-primary text-xs font-semibold tracking-wider uppercase">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    setShowConfirm(true);
    setTimeout(() => { setShowConfirm(false); clearCart(); }, 2000);
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">Shopping Cart</p>
            <h1 className="text-2xl font-bold text-white">سبد خرید</h1>
          </div>
          <button onClick={clearCart} className="text-xs text-gray-500 hover:text-red-500 transition-colors">حذف همه</button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const itemKey = item.id + item.selectedSize + item.selectedColor;
            return (
              <div key={itemKey} className="flex items-center gap-4 p-4 bg-[var(--card-bg)] border border-[var(--border)] card-3d">
                <Link href={`/products/${item.id}`} className="shrink-0">
                  <div className="w-20 h-20 bg-[var(--muted)] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-sm font-medium text-white truncate hover:text-[var(--accent)] transition-colors">{item.namePersian}</h3>
                  </Link>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.brand}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-500">سایز: {item.selectedSize}</span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      رنگ: <span className="w-3 h-3 rounded-full inline-block border border-gray-700"
                        style={{ backgroundColor: item.colors.find((c) => c.name === item.selectedColor)?.hex || "#ccc" }} />
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[var(--accent)] mt-1">
                    {new Intl.NumberFormat("fa-IR").format(item.price)}
                    <span className="text-[9px] text-gray-500 mr-1">تومان</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center border border-[var(--border)] text-gray-500 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all text-xs">-</button>
                  <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center border border-[var(--border)] text-gray-500 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all text-xs">+</button>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white">
                    {new Intl.NumberFormat("fa-IR").format(item.price * item.quantity)}
                    <span className="text-[9px] text-gray-500 mr-1">تومان</span>
                  </p>
                </div>

                <button onClick={() => removeItem(itemKey)} className="text-gray-600 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="max-w-md mr-auto">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-gray-500">تعداد کالا</span><span className="font-medium text-white">{itemCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">حمل و نقل</span><span className="font-medium text-[var(--accent)]">رایگان</span></div>
              <div className="flex justify-between text-base font-bold border-t border-[var(--border)] pt-3">
                <span className="text-white">مجموع</span>
                <span className="text-[var(--accent)]">{new Intl.NumberFormat("fa-IR").format(total)}<span className="text-[10px] text-gray-500 mr-1 font-normal">تومان</span></span>
              </div>
            </div>

            {showConfirm ? (
              <div className="w-full py-3.5 bg-green-600 text-white text-sm font-medium text-center tracking-wider shadow-lg">سفارش شما ثبت شد! ✓</div>
            ) : (
              <button onClick={handleCheckout} className="w-full py-3.5 btn-primary text-sm font-semibold tracking-wider uppercase">ثبت سفارش</button>
            )}

            <Link href="/#products" className="block text-center text-xs text-gray-500 hover:text-[var(--accent)] transition-colors mt-4">ادامه خرید</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
