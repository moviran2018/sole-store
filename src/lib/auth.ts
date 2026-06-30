"use client";

const AUTH_KEY = "sole_admin_auth";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function loginAdmin(password: string): boolean {
  const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  if (password === correct) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(AUTH_KEY);
}
