"use client";

import type { Shoe } from "@/types/shoe";
import { shoes as staticShoes, categories } from "@/data/shoes";

const ADMIN_PRODUCTS_KEY = "sole_admin_custom_products";
const ADMIN_REMOVED_KEY = "sole_admin_removed_ids";

function getCustomProducts(): Shoe[] {
  if (typeof window === "undefined") return [];
  try {
    const d = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function saveCustomProducts(products: Shoe[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

function getRemovedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const d = localStorage.getItem(ADMIN_REMOVED_KEY);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function saveRemovedIds(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_REMOVED_KEY, JSON.stringify(ids));
}

export function getAllShoes(): Shoe[] {
  const custom = getCustomProducts();
  const removed = new Set(getRemovedIds());
  const base = staticShoes.filter((s) => !removed.has(s.id));
  return [...base, ...custom];
}

export function getShoeById(id: string): Shoe | undefined {
  return getAllShoes().find((s) => s.id === id);
}

export function addShoe(shoe: Shoe): void {
  const products = getCustomProducts();
  const idx = products.findIndex((p) => p.id === shoe.id);
  if (idx !== -1) {
    products[idx] = shoe;
  } else {
    products.push(shoe);
  }
  saveCustomProducts(products);
}

export function deleteShoe(id: string): void {
  const removed = getRemovedIds();
  removed.push(id);
  saveRemovedIds(removed);
  const products = getCustomProducts().filter((p) => p.id !== id);
  saveCustomProducts(products);
}

export function getOrders() {
  if (typeof window === "undefined") return [];
  try {
    const d = localStorage.getItem("sole_admin_orders");
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

export function saveOrder(order: any) {
  const orders = getOrders();
  const idx = orders.findIndex((o: any) => o.id === order.id);
  if (idx !== -1) {
    orders[idx] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem("sole_admin_orders", JSON.stringify(orders));
}

export function updateOrderStatus(id: string, status: string) {
  const orders = getOrders();
  const idx = orders.findIndex((o: any) => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    localStorage.setItem("sole_admin_orders", JSON.stringify(orders));
  }
}

export function getMessages() {
  if (typeof window === "undefined") return [];
  try {
    const d = localStorage.getItem("sole_admin_messages");
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

export function saveMessage(msg: any) {
  const messages = getMessages();
  messages.unshift(msg);
  localStorage.setItem("sole_admin_messages", JSON.stringify(messages));
}

export { categories };
