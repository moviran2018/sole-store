import type { Order, Reservation } from "@/types";
import type { CartItem } from "@/types/shoe";

const ORDERS_KEY = "foodmode_orders";
const RESERVATIONS_KEY = "foodmode_reservations";
const CART_KEY = "sole_cart";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RESERVATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveReservation(reservation: Reservation): void {
  const reservations = getReservations();
  reservations.unshift(reservation);
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

export function updateReservationStatus(
  id: string,
  status: Reservation["status"]
): void {
  const reservations = getReservations();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx !== -1) {
    reservations[idx].status = status;
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }
}

export function loadCart(): CartItem[] | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
