"use client";

import type { Shoe } from "@/types/shoe";

export interface StoreSummary {
  text: string;
  productCount: number;
  brandCount: number;
  categoryCount: number;
}

export function buildStoreSummary(products: Shoe[], orders?: any[], messages?: any[]): StoreSummary {
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

  let text = `## STORE OVERVIEW\n`;
  text += `- Total products: ${products.length}\n`;
  text += `- Brands: ${brands.slice(0, 30).join(", ")}\n`;
  text += `- Categories (${categories.length}): ${categories.join(", ")}\n`;
  text += `- Price range: ${minPrice.toLocaleString("fa-IR")} - ${maxPrice.toLocaleString("fa-IR")} Toman\n`;
  text += `- Items on sale: ${saleCount}\n`;
  text += `- New arrivals: ${newCount}\n`;

  if (orders && orders.length > 0) {
    text += `- Total orders: ${orders.length}\n`;
    text += `- Recent orders: ${orders.slice(-5).map((o: any) => `${o.id} (${o.status})`).join(", ")}\n`;
  }
  if (messages && messages.length > 0) {
    text += `- Customer messages: ${messages.length}\n`;
  }

  text += `\n## ALL PRODUCTS\n`;
  for (const [cat, items] of byCategory) {
    text += `\n### ${cat} (${items.length})\n`;
    for (const p of items) {
      const flags = [];
      if (p.new) flags.push("NEW");
      if (p.sale) flags.push(`${p.discount}% OFF`);
      if (p.featured) flags.push("FEATURED");
      const tag = flags.length ? ` [${flags.join(", ")}]` : "";
      const price = p.sale && p.discount
        ? `${(p.price * (1 - p.discount / 100)).toLocaleString("fa-IR")}`
        : p.price.toLocaleString("fa-IR");
      text += `- ${p.namePersian} (${p.brand}) - ${price} Toman${tag}\n  /products/${p.id}\n`;
    }
  }

  return {
    text,
    productCount: products.length,
    brandCount: brands.length,
    categoryCount: categories.length,
  };
}
