# ساختار پروژه Sole Store

## نقشه کلی

```
sole-store/
├── .cloudflare.json                # کانفیگ Cloudflare Pages
├── .env.example                    # نمونه متغیرهای محیطی
├── .env.local                      # متغیرهای محیطی محلی (API keys)
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: دپلوی خودکار روی GitHub Pages
├── .gitignore
├── chatbot-module/                 # ★ ماژول چت‌بات مستقل (هسته هوش مصنوعی)
│   ├── example/
│   │   ├── data/
│   │   │   └── products.json       # نمونه محصولات برای تست محلی
│   │   ├── extract-products.js     # استخراج محصولات از سایت برای تست
│   │   └── usage.html              # دموی مستقل ویجت (برای تست offline)
│   ├── generate-data.js            # ژنراتور داده محصولات (JSON)
│   ├── README.md                   # راهنمای کامل نصب و دپلوی
│   ├── widget/
│   │   └── chatbot-widget.js       # ★ ویجت embeddable (single <script>)
│   ├── worker/
│   │   └── index.js                # ★ Cloudflare Worker (proxy AI + Google Doc)
│   └── wrangler.toml               # کانفیگ دپلوی Worker روی Cloudflare
│
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts                  # کانفیگ Next.js (static export, basePath)
├── node_modules/
├── out/                            # خروجی build استاتیک (GitHub Pages)
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/                         # ★ فایل‌های استاتیک سرو شده توسط سایت
│   ├── _headers                    # هدرهای امنیتی Cloudflare Pages
│   ├── _redirects                  # ریدایرکت‌های Cloudflare Pages
│   ├── chatbot-widget.js           # کپی widget برای سرو شدن توسط سایت
│   ├── data/
│   │   └── products.json           # ★ ۱۰۱ محصول نهایی
│   ├── images/                     # تصاویر محصولات
│   └── *.svg                       # فایل‌های SVG (placeholderها)
│
├── README.md
├── src/                            # ★ کد اصلی Next.js
│   ├── app/                        # routing (App Router)
│   │   ├── about/page.tsx          # صفحه درباره ما
│   │   ├── admin/                  # ★ پنل مدیریت
│   │   │   ├── knowledge/page.tsx  # مدیریت دانش (Google Doc)
│   │   │   ├── layout.tsx          # لایهوت پنل ادمین (با AuthGuard)
│   │   │   ├── login/page.tsx      # صفحه ورود ادمین
│   │   │   ├── messages/page.tsx   # پیغام‌های کاربران
│   │   │   ├── orders/page.tsx     # سفارشات
│   │   │   ├── page.tsx            # پیشخوان ادمین (داشبورد)
│   │   │   └── products/           # مدیریت محصولات
│   │   │       ├── edit/page.tsx   # ویرایش/افزودن محصول (permanent ID)
│   │   │       └── page.tsx        # لیست محصولات ادمین
│   │   ├── cart/page.tsx           # سبد خرید
│   │   ├── checkout/               # تسویه حساب
│   │   │   ├── callback/page.tsx   # برگشت از درگاه پرداخت
│   │   │   └── page.tsx            # فرم تسویه
│   │   ├── contact/page.tsx        # تماس با ما
│   │   ├── favicon.ico
│   │   ├── globals.css             # استایل‌های سراسری
│   │   ├── layout.tsx              # ★ لایهوت اصلی (لود chatbot widget)
│   │   ├── menu/page.tsx           # منوی دسته‌بندی
│   │   ├── not-found.tsx           # صفحه ۴۰۴
│   │   ├── page.tsx                # ★ صفحه اصلی (hero, featured, etc)
│   │   ├── products/
│   │   │   └── [id]/page.tsx       # ★ صفحه جزئیات محصول (مسیر داینامیک)
│   │   └── reserve/page.tsx        # رزرو محصول
│   │
│   ├── components/                 # ★ کامپوننت‌های React
│   │   ├── AdminGuard.tsx          # گارد امنیتی پنل ادمین
│   │   ├── CartDrawer.tsx          # دراور سبد خرید
│   │   ├── FeaturedMenu.tsx        # محصولات ویژه
│   │   ├── Footer.tsx              # فوتر
│   │   ├── Header.tsx              # هدر (ناوبری اصلی)
│   │   ├── Hero.tsx                # بخش Hero صفحه اصلی
│   │   ├── HeroSlider.tsx          # اسلایدر Hero
│   │   ├── MenuItem.tsx            # آیتم منو
│   │   ├── MenuItemCard.tsx        # کارت محصول در منو
│   │   ├── MobileNav.tsx           # ناوبری موبایل
│   │   ├── ProductDetailContent.tsx # محتوای جزئیات محصول
│   │   ├── SearchDropdown.tsx      # جستجوی کشویی
│   │   └── ShoeCard.tsx            # کارت محصول
│   │
│   ├── data/                       # داده‌های استاتیک
│   │   ├── categories.ts           # دسته‌بندی‌ها
│   │   ├── menu.json               # منوی ناوبری (JSON)
│   │   └── shoes.ts                # دیتای اولیه کفشها
│   │
│   ├── lib/                        # ★ کتابخانه‌ها و منطق تجاری
│   │   ├── ai-client.ts            # کلاینت هوش مصنوعی (server-side)
│   │   ├── auth.ts                 # احراز هویت ادمین
│   │   ├── cart-context.tsx        # Context سبد خرید (React)
│   │   ├── chatbot-settings.ts     # تنظیمات چت‌بات
│   │   ├── knowledge.ts            # مدیریت دانش (Google Doc)
│   │   ├── payment.ts              # درگاه پرداخت (ZarinPal)
│   │   ├── shoe-store.ts           # ★ توابع اصلی فروشگاه (CRUD محصولات)
│   │   ├── storage.ts              # ذخیره‌سازی محلی (localStorage)
│   │   ├── supabase.ts             # کلاینت Supabase
│   │   └── utils.ts                # توابع کمکی عمومی
│   │
│   └── types/                      #的类型 TypeScript
│       ├── index.ts                # نوع‌های عمومی
│       └── shoe.ts                 # نوع Shoe + interfaces
│
├── supabase/
│   └── schema.sql                  # اسکیما و قوانین Supabase
├── supabase-schema.sql             # کپی اسکیما (مرجع سریع)
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

---

## توضیح ماژول‌های اصلی

### 📦 chatbot-module (چت‌بات هوشمند)
| فایل | وظیفه |
|------|--------|
| `worker/index.js` | Cloudflare Worker: پروکسی برای Google AI + OpenRouter + Groq (failover سه‌لایه)، دریافت Google Doc |
| `widget/chatbot-widget.js` | ویجت embeddable: UI چت، voice (Web Speech API)، fallback کلاینتی |
| `wrangler.toml` | تنظیمات wrangler برای دپلوی Worker |
| `example/usage.html` | صفحه دمو تست ویجت |
| `README.md` | راهنمای کامل دپلوی |

### 🏪 src (سایت Next.js)
| مسیر | وظیفه |
|------|--------|
| `app/page.tsx` | صفحه اصلی (hero, featured products) |
| `app/products/[id]` | صفحه جزئیات هر محصول |
| `app/admin/*` | پنل مدیریت (محصولات، سفارشات، پیغام‌ها، دانش) |
| `lib/shoe-store.ts` | مغز فروشگاه: CRUD، آپلود عکس، نمایش محصولات |
| `lib/payment.ts` | اتصال به درگاه پرداخت ZarinPal |
| `lib/supabase.ts` | اتصال به Supabase (PostgreSQL + Storage) |
| `components/*` | کامپوننت‌های React (قابل استفاده مجدد) |

### 🌐 Root Config
| فایل | وظیفه |
|------|--------|
| `next.config.ts` | next.config با `output: 'export'` و `basePath` |
| `.github/workflows/deploy.yml` | GitHub Actions: build + دپلوی روی GitHub Pages |
| `public/_headers` | هدرهای امنیتی (CSP, XSS, ...) |
| `public/_redirects` | ریدایرکت‌ها (مثلاً /admin به صفحه ادمین) |

---

## ارتباط بین ماژول‌ها

```
کاربر → مرورگر
  ├── chatbot-widget.js (ویجت)
  │     ├── → Worker (cloudflare) → Google AI / OpenRouter / Groq (failover)
  │     ├── → Worker → Google Doc Knowledge
  │     └── → products.json (fallback محلی)
  │
  └── Next.js سایت
        ├── → Supabase (PostgreSQL + Storage)
        ├── → ZarinPal (درگاه پرداخت)
        └── → GitHub Pages (هاست)

دپلوی:
  GitHub Actions → build (next build) → push به gh-pages → Cloudflare Pages
```

---

## نکات مهم برای توسعه

1. **چت‌بات مستقل از سایته** — `chatbot-module/` رو جداگانه دپلوی میکنی (Worker روی Cloudflare)
2. **API keys** توی `.env.local` هستن (توی گیت نیست)
3. **محصولات** توی Supabase (PostgreSQL) ذخیره میشن و `products.json` حاصل export شده
4. **Google Doc** به عنوان knowledge base استفاده میشه (هم سرور، هم fallback کلاینت)
5. **Widget** رو هر جا با `<script defer>` صدا بزنی کار میکنه
