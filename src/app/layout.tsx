import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import ClientWrapper from "@/components/ClientWrapper";
import ApiKeyDebug from "@/components/ApiKeyDebug";
import { CartProvider } from "@/lib/cart-context";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "Sole Store | فروشگاه کفش مدرن",
  description: "فروشگاه تخصصی کفش با بهترین برندهای دنیا. کیفیت، راحتی و استایل را با هم تجربه کنید.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable}`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <CartProvider>
          <Header />
          <main className="flex-1 pb-16 sm:pb-0">{children}</main>
          <Footer />
          <MobileNav />
          <ClientWrapper />
          <ApiKeyDebug />
        </CartProvider>
      </body>
    </html>
  );
}
