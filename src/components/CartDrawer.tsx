"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, clearCart, itemCount, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-[#111] border-l border-[var(--border)] shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-[#111] border-b border-[var(--border)] p-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">سبد خرید ({itemCount})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm text-gray-500 mb-4">سبد خرید خالی است</p>
            <Link href="/#products" onClick={onClose} className="inline-block px-5 py-2.5 btn-primary text-xs font-semibold tracking-wider uppercase">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-3">
              {items.map((item) => {
                const itemKey = item.id + item.selectedSize + item.selectedColor;
                return (
                  <div key={itemKey} className="flex items-center gap-3 bg-[#1a1a1a] border border-[var(--border)] p-3">
                    <div className="w-14 h-14 bg-[var(--muted)] overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-white truncate">{item.namePersian}</h4>
                      <p className="text-[10px] text-gray-500">سایز {item.selectedSize} - {item.selectedColor}</p>
                      <p className="text-xs font-medium text-[var(--accent)] mt-0.5">
                        {new Intl.NumberFormat("fa-IR").format(item.price)}
                        <span className="text-[9px] text-gray-500 mr-0.5">تومان</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center border border-[var(--border)] text-gray-500 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] text-xs transition-all">
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-[var(--border)] text-gray-500 hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] text-xs transition-all">
                        +
                      </button>
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

            <div className="border-t border-[var(--border)] p-4 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>مجموع:</span>
                <span className="text-[var(--accent)]">{new Intl.NumberFormat("fa-IR").format(total)} تومان</span>
              </div>
              <div className="flex gap-2">
                <button onClick={clearCart} className="flex-1 border border-[var(--border)] text-gray-500 py-2.5 text-xs font-medium hover:bg-[var(--border)] transition-colors">
                  خالی کردن
                </button>
                <Link href="/cart" onClick={onClose} className="flex-1 btn-primary text-center py-2.5 text-xs font-semibold tracking-wider uppercase">
                  ثبت سفارش
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
