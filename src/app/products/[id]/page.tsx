import { shoes } from "@/data/shoes";
import ProductDetailContent from "@/components/ProductDetailContent";
import type { Shoe } from "@/types/shoe";

export function generateStaticParams() {
  return shoes.map((shoe) => ({ id: shoe.id }));
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const shoe = shoes.find((s) => s.id === params.id);

  if (!shoe) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">محصول مورد نظر یافت نشد.</p>
          <a href="/" className="text-xs text-[var(--accent)] hover:underline">
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetailContent shoe={shoe} />;
}
