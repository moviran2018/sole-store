import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { CartProvider } from "@/lib/cart-context";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moviran2018.github.io/sole-store"),
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
          <script
            src="/sole-store/chatbot-widget.js"
            data-worker="https://sole-chatbot.moviran2018.workers.dev"
            data-site="sole-store"
            data-provider="gemini"
            data-title="SoleBot"
            data-welcome="سلام! به فروشگاه Sole خوش آمدید. چطور می‌توانم کمک کنم؟"
            data-knowledge="/sole-store/data/products.json"
            data-knowledge-url="https://docs.google.com/document/d/19sB0sOggtZq0CnhHsU4fMvNAAtdR9dG_ftIqJ2qExM0/export?format=txt"
            defer
          ></script>
        </CartProvider>
      </body>
    </html>
  );
}
