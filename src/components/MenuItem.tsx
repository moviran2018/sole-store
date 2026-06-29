"use client";

import type { MenuItem } from "@/types";
import type { Shoe } from "@/types/shoe";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface Props {
  item: MenuItem;
}

const emojiMap: Record<string, string> = {
  "استیک گریل شده": "🥩",
  "سالاد سزار": "🥗",
  "پیتزا مارگاریتا": "🍕",
  "سوشی مخلوط": "🍣",
  "برگر مخصوص": "🍔",
  "پاستا آلفردو": "🍝",
  "تیرامیسو": "🍰",
  "apérol Spritz": "🍹",
  "سوپ قارچ": "🥣",
  "چیزکیک نیویورکی": "🧀",
  "نوشابه": "🥤",
  "نان سیر": "🧄",
};

const defaultEmojis = ["🥘", "🍲", "🥙", "🌮", "🌯", "🥪", "🧆", "🥚"];

function getEmoji(name: string, index: number): string {
  return emojiMap[name] || defaultEmojis[index % defaultEmojis.length];
}

export default function MenuItemCard({ item }: Props) {
  const { addItem } = useCart();

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-amber-900/30 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1">
      <div className="h-48 bg-gradient-to-br from-amber-900/40 to-orange-900/40 flex items-center justify-center relative overflow-hidden">
        <span className="text-7xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          {getEmoji(item.name, parseInt(item.id))}
        </span>
        <div className="absolute top-3 right-3">
          <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-1">
          <p className="text-xs text-gray-500 italic">{item.nameEn}</p>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-400">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => addItem(item as unknown as Shoe, 42, "Black")}
            className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}
