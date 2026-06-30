"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getShoeById } from "@/lib/shoe-store";
import ProductDetailContent from "@/components/ProductDetailContent";
import type { Shoe } from "@/types/shoe";

export default function NotFoundPage() {
  const [product, setProduct] = useState<{ id: string; shoe?: Shoe } | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/products\/(.+)/);
    if (match) {
      const id = match[1];
      setProduct({ id });
      getShoeById(id).then((s) => {
        if (s) setProduct({ id, shoe: s });
      });
    }
  }, []);

  if (product?.shoe) {
    return <ProductDetailContent shoeId={product.id} staticShoe={product.shoe} />;
  }

  if (product && !product.shoe) {
    // Product route but not yet loaded – try rendering with just ID
    return <ProductDetailContent shoeId={product.id} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 bg-black" dir="rtl">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4 opacity-20">۴۰۴</div>
        <h1 className="text-xl font-bold text-white mb-2">صفحه مورد نظر یافت نشد</h1>
        <p className="text-sm text-gray-500 mb-6">صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
        <Link href="/" className="inline-flex px-6 py-3 btn-primary text-xs font-semibold rounded-xl">
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
