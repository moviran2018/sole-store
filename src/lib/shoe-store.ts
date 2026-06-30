"use client";

import type { Shoe } from "@/types/shoe";
import { shoes as staticShoes, categories } from "@/data/shoes";
import { getSupabase, isSupabaseConfigured } from "./supabase";

const ADMIN_PRODUCTS_KEY = "sole_admin_custom_products";
const ADMIN_REMOVED_KEY = "sole_admin_removed_ids";
const ADMIN_ORDERS_KEY = "sole_admin_orders";
const ADMIN_MESSAGES_KEY = "sole_admin_messages";

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function lsSet(key: string, value: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getAllShoes(): Promise<Shoe[]> {
  const removed = new Set(lsGet<string[]>(ADMIN_REMOVED_KEY, []));
  const custom = lsGet<Shoe[]>(ADMIN_PRODUCTS_KEY, []);

  // Build merged map: static → custom → supabase (latter overrides former)
  const merged = new Map<string, Shoe>();

  // 1. All static shoes (minus removed)
  for (const s of staticShoes) {
    if (!removed.has(s.id)) merged.set(s.id, s);
  }

  // 2. Custom products from localStorage
  for (const s of custom) {
    merged.set(s.id, s);
  }

  // 3. Supabase products (if configured)
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await (supabase.from("products") as any).select("*");
      if (data) {
        for (const d of data) {
          merged.set(d.id, mapShoe(d));
        }
      }
    }
  }

  return Array.from(merged.values());
}

export async function getShoeById(id: string): Promise<Shoe | undefined> {
  // 1. Check Supabase first (most authoritative)
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await (supabase.from("products") as any).select("*").eq("id", id).single();
      if (data) return mapShoe(data);
    }
  }

  // 2. Check custom products
  const custom = lsGet<Shoe[]>(ADMIN_PRODUCTS_KEY, []);
  const found = custom.find((s) => s.id === id);
  if (found) return found;

  // 3. Check static data
  const removed = new Set(lsGet<string[]>(ADMIN_REMOVED_KEY, []));
  if (!removed.has(id)) return staticShoes.find((s) => s.id === id);
}

export async function addShoe(shoe: Shoe): Promise<void> {
  // Save to localStorage (always)
  const products = lsGet<Shoe[]>(ADMIN_PRODUCTS_KEY, []);
  const idx = products.findIndex((p) => p.id === shoe.id);
  idx !== -1 ? products[idx] = shoe : products.push(shoe);
  lsSet(ADMIN_PRODUCTS_KEY, products);

  // Save to Supabase (if configured)
  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!;
    const dbRow = {
      id: shoe.id, name: shoe.name, name_persian: shoe.namePersian,
      description: shoe.description, description_persian: shoe.descriptionPersian,
      price: shoe.price, category: shoe.category, category_persian: shoe.categoryPersian,
      sizes: shoe.sizes, colors: JSON.stringify(shoe.colors),
      image: shoe.image, images: JSON.stringify(shoe.images),
      brand: shoe.brand, rating: shoe.rating, in_stock: shoe.inStock,
      featured: shoe.featured || false, new: shoe.new || false,
      sale: shoe.sale || false, discount: shoe.discount || 0,
    };
    const { error } = await (supabase.from("products") as any).upsert([dbRow], { onConflict: "id" });
    if (error) console.error("Supabase error:", error);
  }
}

export async function deleteShoe(id: string): Promise<void> {
  // Remove from localStorage
  const removed = lsGet<string[]>(ADMIN_REMOVED_KEY, []);
  if (!removed.includes(id)) removed.push(id);
  lsSet(ADMIN_REMOVED_KEY, removed);
  lsSet(ADMIN_PRODUCTS_KEY, lsGet<Shoe[]>(ADMIN_PRODUCTS_KEY, []).filter((p) => p.id !== id));

  // Remove from Supabase (if configured)
  if (isSupabaseConfigured()) {
    await (getSupabase()!.from("products") as any).delete().eq("id", id);
  }
}

export async function getOrders(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    const { data } = await (getSupabase()!.from("orders") as any).select("*").order("created_at", { ascending: false });
    return data || [];
  }
  return lsGet<any[]>(ADMIN_ORDERS_KEY, []);
}

export async function saveOrder(order: any): Promise<void> {
  if (isSupabaseConfigured()) {
    await (getSupabase()!.from("orders") as any).upsert([{ ...order, items: JSON.stringify(order.items) }], { onConflict: "id" });
  }
  const orders = lsGet<any[]>(ADMIN_ORDERS_KEY, []);
  const idx = orders.findIndex((o: any) => o.id === order.id);
  idx !== -1 ? orders[idx] = order : orders.unshift(order);
  lsSet(ADMIN_ORDERS_KEY, orders);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  if (isSupabaseConfigured()) {
    await (getSupabase()!.from("orders") as any).update({ status }).eq("id", id);
  }
  const orders = lsGet<any[]>(ADMIN_ORDERS_KEY, []);
  const idx = orders.findIndex((o: any) => o.id === id);
  if (idx !== -1) { orders[idx].status = status; lsSet(ADMIN_ORDERS_KEY, orders); }
}

export async function getMessages(): Promise<any[]> {
  if (isSupabaseConfigured()) {
    const { data } = await (getSupabase()!.from("messages") as any).select("*").order("created_at", { ascending: false });
    return data || [];
  }
  return lsGet<any[]>(ADMIN_MESSAGES_KEY, []);
}

export async function saveMessage(msg: any): Promise<void> {
  if (isSupabaseConfigured()) {
    await (getSupabase()!.from("messages") as any).insert([{ name: msg.name, email: msg.email, subject: msg.subject, message: msg.message }]);
  }
  const messages = lsGet<any[]>(ADMIN_MESSAGES_KEY, []);
  messages.unshift(msg);
  lsSet(ADMIN_MESSAGES_KEY, messages);
}

function mapShoe(d: any): Shoe {
  return {
    id: d.id, name: d.name, namePersian: d.name_persian,
    description: d.description || "", descriptionPersian: d.description_persian || "",
    price: d.price, category: d.category, categoryPersian: d.category_persian || d.category,
    sizes: d.sizes || [], colors: typeof d.colors === "string" ? JSON.parse(d.colors) : (d.colors || []),
    image: d.image, images: typeof d.images === "string" ? JSON.parse(d.images) : (d.images || []),
    brand: d.brand, rating: d.rating || 4.0, inStock: d.in_stock,
    featured: d.featured || false, new: d.new || false,
    sale: d.sale || false, discount: d.discount || 0,
  };
}

export { categories };
