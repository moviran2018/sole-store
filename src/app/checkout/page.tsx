"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { defaultProvider } from "@/lib/payment";

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState({ fullName: "", phone: "", address: "", city: "", postalCode: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.address) {
      setError("لطفاً اطلاعات مورد نیاز را وارد کنید");
      return;
    }
    setSubmitting(true);
    setError("");

    const orderId = `ord-${Date.now().toString(36)}`;

    const result = await defaultProvider.requestPayment({
      amount: total,
      orderId,
      description: `سفارش ${orderId} - ${itemCount} کالا`,
      callbackUrl: `${window.location.origin}/checkout/callback?orderId=${orderId}`,
    });

    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl;
    } else {
      setError(result.error || "خطا در اتصال به درگاه پرداخت");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-14 sm:pt-16" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium mb-1">Checkout</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">نهایی‌سازی سفارش</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Address form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 sm:p-6 space-y-4">
              <h2 className="text-sm font-semibold text-white mb-2">اطلاعات تحویل</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">نام و نام خانوادگی</label>
                  <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">شماره تماس</label>
                  <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} dir="ltr"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">آدرس</label>
                <textarea value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} rows={3}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">شهر</label>
                  <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">کد پستی</label>
                  <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} dir="ltr"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button type="submit" disabled={submitting}
              className="w-full py-3.5 btn-primary text-sm font-semibold tracking-wider uppercase rounded-xl disabled:opacity-50">
              {submitting ? "در حال اتصال به درگاه..." : `پرداخت ${total.toLocaleString("fa-IR")} تومان`}
            </button>

            <p className="text-[10px] text-gray-600 text-center">درگاه: {defaultProvider.name}</p>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-white mb-4">خلاصه سفارش</h2>
              <div className="space-y-3 mb-4">
                {items.slice(0, 5).map((item) => (
                  <div key={item.id + item.selectedSize + item.selectedColor} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{item.namePersian}</p>
                      <p className="text-[10px] text-gray-500">{item.quantity} × {item.price.toLocaleString("fa-IR")}</p>
                    </div>
                  </div>
                ))}
                {items.length > 5 && <p className="text-[10px] text-gray-600 text-center">+{items.length - 5} کالای دیگر</p>}
              </div>
              <div className="border-t border-gray-800 pt-3 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-500">تعداد کالا</span><span className="text-white">{itemCount}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">حمل و نقل</span><span className="text-green-500">رایگان</span></div>
                <div className="flex justify-between text-sm font-bold border-t border-gray-800 pt-2">
                  <span className="text-white">مجموع</span>
                  <span className="text-[var(--accent)]">{total.toLocaleString("fa-IR")} تومان</span>
                </div>
              </div>
            </div>
            <Link href="/cart" className="block text-center text-xs text-gray-500 hover:text-[var(--accent)] mt-3 transition-colors">ویرایش سبد خرید</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
