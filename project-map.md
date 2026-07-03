# Project Map - Sole Store

## بخش‌های اصلی (Main)

| کد | بخش | فایل(ها) |
|---|---|---|
| M01 | صفحه اصلی (Home) | `src/app/page.tsx` |
| M02 | هدر (Header) | `src/components/Header.tsx` |
| M03 | فوتر (Footer) | `src/components/Footer.tsx` |
| M04 | نویگیشن موبایل (MobileNav) | `src/components/MobileNav.tsx` |
| M05 | HeroSlider | `src/components/HeroSlider.tsx` |
| M06 | ShoeCard (کارت کامل) | `src/components/ShoeCard.tsx` |
| M07 | CompactShoeCard (کارت جمع‌وجور) | `src/components/CompactShoeCard.tsx` |
| M08 | SearchDropdown (جستجو) | `src/components/SearchDropdown.tsx` |
| M09 | جزئیات محصول | `src/components/ProductDetailContent.tsx`, `src/app/products/[id]/page.tsx` |
| M10 | سبد خرید (Cart) | `src/app/cart/page.tsx` |
| M11 | CartDrawer (دراور سبد) | `src/components/CartDrawer.tsx` |
| M12 | تسویه حساب (Checkout) | `src/app/checkout/page.tsx` |
| M13 | FilterSidebar (فیلتر) | داخل `src/app/page.tsx` |
| M14 | Collection (همه محصولات) | بخش products در `src/app/page.tsx` |
| M15 | ScrollArrows (فلش اسکرول) | تابع scrollByAmount در `src/app/page.tsx` |
| M16 | منو (Menu) | `src/app/menu/page.tsx`, `src/components/MenuItem.tsx`, `MenuItemCard.tsx`, `FeaturedMenu.tsx`, `Hero.tsx` |
| M17 | رزرو (Reserve) | `src/app/reserve/page.tsx` |
| M18 | پنل ادمین (Admin) | `src/app/admin/page.tsx`, `admin/products/`, `admin/orders/`, `admin/messages/`, `admin/knowledge/` |
| M19 | لاگین ادمین | `src/app/admin/login/page.tsx` |
| M20 | صفحه درباره ما | `src/app/about/page.tsx` |
| M21 | صفحه تماس | `src/app/contact/page.tsx` |

## بخش‌های فرعی (Secondary)

| کد | بخش | فایل(ها) |
|---|---|---|
| S01 | لایه اوت (Layout) | `src/app/layout.tsx` |
| S02 | استایل گلوبال | `src/app/globals.css` |
| S03 | Cart Context | `src/lib/cart-context.tsx` |
| S04 | Supabase / دیتابیس | `src/lib/supabase.ts`, `src/lib/shoe-store.ts` |
| S05 | احراز هویت (Auth) | `src/lib/auth.ts` |
| S06 | پرداخت (Payment) | `src/lib/payment.ts` |
| S07 | بازگشت پرداخت | `src/app/checkout/callback/page.tsx` |
| S08 | AdminGuard | `src/components/AdminGuard.tsx` |
| S09 | چت‌بات (Chatbot) | `chatbot-module/` |
| S10 | AI Client | `src/lib/ai-client.ts` |
| S11 | دانش‌نامه (Knowledge) | `src/lib/knowledge.ts`, `chatbot-settings.ts` |
| S12 | دپلوی (Deploy) | `.github/workflows/deploy.yml` |
| S13 | Sitemap | `scripts/generate-sitemap.js`, `public/sitemap.xml` |
| S14 | دیتای محصولات | `src/data/shoes.ts` |
| S15 | دیتای دسته‌بندی | `src/data/categories.ts` |
| S16 | دیتای منو | `src/data/menu.json` |
| S17 | Storage | `src/lib/storage.ts` |
| S18 | Utils | `src/lib/utils.ts` |
| S19 | صفحه 404 | `src/app/not-found.tsx` |

---

> **نحوه استفاده**: هر وقت خواستی تغییری بدی، کد بخش رو بگو + توضیح. مثلاً:
> "M15: فلش اسکرول رو از سمت چپ به راست تغییر بده" یا "M06: یه badge جدید به ShoeCard اضافه کن"
