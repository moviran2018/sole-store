"use client";

import type { Shoe } from "@/types/shoe";

export interface StoreSummary {
  text: string;
  productCount: number;
}

export function buildStoreSummary(products: Shoe[]): StoreSummary {
  const brands = [...new Set(products.map((p) => p.brand))];
  const categories = [...new Set(products.map((p) => p.categoryPersian))];
  const byCategory = new Map<string, Shoe[]>();
  for (const p of products) {
    const list = byCategory.get(p.categoryPersian) || [];
    list.push(p);
    byCategory.set(p.categoryPersian, list);
  }

  const saleCount = products.filter((p) => p.sale).length;
  const newCount = products.filter((p) => p.new).length;
  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));

  let text = `Total: ${products.length} products | Brands: ${brands.slice(0, 20).join(", ")} | Categories: ${categories.join(", ")} | Price range: ${minPrice.toLocaleString("fa-IR")} - ${maxPrice.toLocaleString("fa-IR")} Toman | ${saleCount} on sale | ${newCount} new arrivals\n\n`;

  for (const [cat, items] of byCategory) {
    const top = items.slice(0, 8);
    text += `${cat} (${items.length} items): `;
    text += top.map((p) => {
      const flags = [];
      if (p.new) flags.push("NEW");
      if (p.sale) flags.push(`${p.discount}%OFF`);
      if (p.featured) flags.push("FEATURED");
      const tag = flags.length ? `[${flags.join(",")}]` : "";
      const price = p.sale && p.discount
        ? (p.price * (1 - p.discount / 100)).toLocaleString("fa-IR")
        : p.price.toLocaleString("fa-IR");
      return `${p.namePersian}(${p.brand})${tag} ${price}T /products/${p.id}`;
    }).join(" | ");
    if (items.length > 8) text += ` | ... and ${items.length - 8} more`;
    text += "\n";
  }

  return { text, productCount: products.length };
}
