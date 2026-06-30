"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

function CallbackInner() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const statusParam = searchParams.get("status");

    if (statusParam === "OK" && orderId) {
      clearCart();
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-black" dir="rtl">
      <div className="text-center max-w-sm">
        {status === "processing" && (
          <>
            <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">در حال تایید پرداخت...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-600/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h1 className="text-xl font-bold text-white mb-2">پرداخت با موفقیت انجام شد</h1>
            <p className="text-sm text-gray-500 mb-6">سفارش شما ثبت شد و در اسرع وقت پردازش خواهد شد.</p>
            <Link href="/" className="inline-flex px-6 py-3 btn-primary text-xs font-semibold rounded-xl">بازگشت به فروشگاه</Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✕</div>
            <h1 className="text-xl font-bold text-white mb-2">پرداخت ناموفق</h1>
            <p className="text-sm text-gray-500 mb-6">پرداخت شما تکمیل نشد. لطفاً مجدداً تلاش کنید.</p>
            <Link href="/checkout" className="inline-flex px-6 py-3 btn-primary text-xs font-semibold rounded-xl">تلاش مجدد</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-gray-400 text-sm">در حال بارگذاری...</div>}><CallbackInner /></Suspense>;
}
