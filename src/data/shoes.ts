import { Shoe, Category } from "@/types/shoe";

export const categories: Category[] = [
  { id: "sneakers", name: "Sneakers", namePersian: "کتانی", icon: "👟" },
  { id: "formal", name: "Formal", namePersian: "رسمی", icon: "👞" },
  { id: "running", name: "Running", namePersian: "دویدن", icon: "🏃" },
  { id: "casual", name: "Casual", namePersian: "مجلسی", icon: "🥿" },
  { id: "boots", name: "Boots", namePersian: "چکمه", icon: "👢" },
  { id: "sandals", name: "Sandals", namePersian: "صندل", icon: "🩴" },
  { id: "loafers", name: "Loafers", namePersian: "موکاسین", icon: "👞" },
  { id: "slides", name: "Slides", namePersian: "دمپایی", icon: "🩴" },
  { id: "heels", name: "High Heels", namePersian: "پاشنه بلند", icon: "👠" },
  { id: "sport", name: "Sport", namePersian: "ورزشی", icon: "⚽" },
];

const sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];

const colors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1a2744" },
  { name: "Brown", hex: "#6B4226" },
  { name: "Gray", hex: "#808080" },
  { name: "Red", hex: "#CC0000" },
  { name: "Blue", hex: "#0044CC" },
  { name: "Green", hex: "#2E7D32" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Beige", hex: "#F5F5DC" },
];

function rng(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function randInt(min: number, max: number, seed: number): number {
  return Math.floor(rng(seed) * (max - min + 1)) + min;
}

function pickSizes(seed: number): number[] {
  const count = randInt(4, 8, seed);
  const available = [...sizes].sort(() => rng(seed + 1) - 0.5);
  return available.slice(0, count).sort((a, b) => a - b);
}

function pickColors(seed: number): { name: string; hex: string }[] {
  const count = randInt(2, 4, seed);
  const available = [...colors].sort(() => rng(seed + 2) - 0.5);
  return available.slice(0, count);
}

const catTheme: Record<string, { bg: string; bg2: string; ac: string; body: string; sole: string }> = {
  sneakers: { bg: "#1a1a2e", bg2: "#0d0d1a", ac: "#ff6b00", body: "#2a2a4e", sole: "#1a1a3e" },
  formal:   { bg: "#1a1a1a", bg2: "#0a0a0a", ac: "#8B4513", body: "#3a3a3a", sole: "#1a1a1a" },
  running:  { bg: "#0d1b2a", bg2: "#070f1a", ac: "#00b894", body: "#1a3a4a", sole: "#0d2a3a" },
  casual:   { bg: "#1b0a2e", bg2: "#10061a", ac: "#6c5ce7", body: "#3a2a5e", sole: "#2a1a4e" },
  boots:    { bg: "#1a0f0a", bg2: "#0f0805", ac: "#A0522D", body: "#3a2a1a", sole: "#2a1a0a" },
  sandals:  { bg: "#1a1a0a", bg2: "#0f0f05", ac: "#fdcb6e", body: "#3a3a1a", sole: "#2a2a0a" },
  loafers:  { bg: "#1a0a0a", bg2: "#0f0505", ac: "#e17055", body: "#3a1a1a", sole: "#2a0a0a" },
  slides:   { bg: "#0a1a1a", bg2: "#050f0f", ac: "#00cec9", body: "#1a3a3a", sole: "#0a2a2a" },
  heels:    { bg: "#1a0a14", bg2: "#0f050b", ac: "#fd79a8", body: "#3a1a2e", sole: "#2a0a1e" },
  sport:    { bg: "#0a0a1a", bg2: "#05050f", ac: "#0984e3", body: "#1a1a3a", sole: "#0a0a2a" },
};
const shoePaths: Record<string, string> = {
  sneakers: `<path d="M140,380 C130,380 120,370 120,360 L120,340 C120,330 130,320 140,310 C160,290 190,270 210,250 C230,230 240,200 240,180 C240,160 250,150 270,150 C290,150 300,160 310,180 C320,200 330,230 360,250 C390,270 420,290 440,310 Q460,330 470,350 L480,370 Q480,390 460,390 Z" fill="currentColor" opacity=".85"/>
  <path d="M120,380 C120,390 130,400 140,410 L460,410 C470,400 480,390 480,380 L120,380 Z" fill="currentColor" opacity=".6"/>
  <path d="M250,150 L260,150 Q270,165 270,180 C270,195 260,210 250,220 L240,220 Q240,200 245,185 Q250,170 250,150 Z" fill="currentColor" opacity=".5"/>
  <circle cx="320" cy="180" r="4" fill="currentColor" opacity=".4"/>
  <circle cx="340" cy="185" r="4" fill="currentColor" opacity=".4"/>
  <circle cx="360" cy="195" r="4" fill="currentColor" opacity=".4"/>`,
  formal: `<path d="M100,370 L460,370 Q480,370 480,350 L480,330 Q480,310 450,300 C420,290 380,280 350,260 C320,240 300,210 280,180 C270,160 250,150 230,160 C210,170 200,190 190,220 C180,250 160,280 130,300 Q110,320 100,340 Z" fill="currentColor" opacity=".85"/>
  <path d="M100,370 C100,380 110,390 120,395 L460,395 Q470,390 480,380 L480,370 Z" fill="currentColor" opacity=".55"/>
  <path d="M240,165 L250,165 Q260,178 260,190 C260,205 250,215 240,225 L230,225 Q235,210 238,195 Q240,180 240,165 Z" fill="currentColor" opacity=".45"/>
  <path d="M290,185 L350,200" stroke="currentColor" stroke-width="2" opacity=".35"/>
  <path d="M295,195 L345,208" stroke="currentColor" stroke-width="2" opacity=".35"/>`,
  running: `<path d="M90,380 L430,380 Q460,380 470,350 L480,320 Q480,290 460,270 C430,250 390,230 360,210 C330,190 310,160 300,130 C290,110 280,100 260,110 C240,120 230,140 230,170 C230,200 210,240 180,270 C150,300 120,330 100,350 Q90,370 90,380 Z" fill="currentColor" opacity=".85"/>
  <path d="M90,380 C90,395 100,405 110,410 L440,410 C455,405 465,395 470,380 Z" fill="currentColor" opacity=".55"/>
  <ellipse cx="290" cy="410" rx="50" ry="20" fill="currentColor" opacity=".5"/>
  <path d="M340,120 L350,120 Q360,135 360,150 C360,165 350,180 340,190 L330,190 Q340,170 342,155 Q345,140 340,120 Z" fill="currentColor" opacity=".4"/>
  <line x1="140" y1="395" x2="340" y2="395" stroke="currentColor" stroke-width="3" opacity=".3"/>`,
  casual: `<path d="M120,370 L450,370 Q470,370 470,350 L470,330 Q470,310 450,300 C420,290 380,280 360,270 C340,260 320,240 310,220 C300,200 290,180 270,170 C250,160 230,170 210,190 C190,210 170,250 140,280 Q120,300 120,330 Z" fill="currentColor" opacity=".85"/>
  <path d="M120,370 C120,380 130,390 140,395 L460,395 Q470,390 480,380 L480,370 Z" fill="currentColor" opacity=".55"/>
  <ellipse cx="320" cy="280" rx="40" ry="15" fill="currentColor" opacity=".3"/>
  <path d="M190,230 Q220,200 260,200" stroke="currentColor" stroke-width="2" fill="none" opacity=".4"/>`,
  boots: `<path d="M150,380 C140,380 130,370 130,360 L130,250 C130,220 140,190 150,170 C160,150 180,140 200,140 L280,140 C300,140 320,150 330,170 C340,190 350,220 350,250 L350,310 C350,330 380,340 410,350 Q450,360 470,370 L470,390 Q470,400 460,400 Z" fill="currentColor" opacity=".85"/>
  <path d="M130,380 C130,395 140,405 150,410 L460,410 Q470,405 480,395 L480,380 Z" fill="currentColor" opacity=".55"/>
  <rect x="200" y="160" width="100" height="110" rx="10" fill="currentColor" opacity=".35"/>
  <path d="M200,270 L200,320" stroke="currentColor" stroke-width="3" opacity=".5"/>
  <path d="M300,270 L300,320" stroke="currentColor" stroke-width="3" opacity=".5"/>
  <line x1="150" y1="310" x2="350" y2="310" stroke="currentColor" stroke-width="2" opacity=".3"/>`,
  sandals: `<ellipse cx="300" cy="280" rx="160" ry="50" fill="currentColor" opacity=".85"/>
  <rect x="140" y="310" width="320" height="80" rx="40" fill="currentColor" opacity=".85"/>
  <rect x="140" y="310" width="320" height="80" rx="40" fill="currentColor" opacity=".55"/>
  <path d="M200,180 L180,310" stroke="currentColor" stroke-width="12" stroke-linecap="round" opacity=".7"/>
  <path d="M380,180 L400,310" stroke="currentColor" stroke-width="12" stroke-linecap="round" opacity=".7"/>
  <path d="M260,170 L280,310" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity=".5"/>
  <ellipse cx="300" cy="350" rx="140" ry="35" fill="currentColor" opacity=".3"/>
  <circle cx="200" cy="200" r="8" fill="currentColor" opacity=".4"/>
  <circle cx="380" cy="200" r="8" fill="currentColor" opacity=".4"/>`,
  loafers: `<path d="M130,370 L450,370 Q470,370 470,350 L470,330 Q470,310 450,300 C420,290 390,280 370,270 C350,260 330,240 320,220 C310,200 300,180 280,170 C260,160 240,165 220,180 C200,195 180,220 160,250 Q140,280 130,310 Z" fill="currentColor" opacity=".85"/>
  <path d="M130,370 C130,385 140,393 150,398 L460,398 Q470,393 480,385 L480,370 Z" fill="currentColor" opacity=".55"/>
  <path d="M270,175 L280,175 Q290,185 290,195 C290,208 280,218 270,225 L260,225 Q268,212 270,200 Q272,188 270,175 Z" fill="currentColor" opacity=".45"/>
  <ellipse cx="320" cy="270" rx="35" ry="12" fill="currentColor" opacity=".25"/>
  <path d="M200,230 Q230,205 260,200" stroke="currentColor" stroke-width="2" fill="none" opacity=".4"/>
  <circle cx="300" cy="190" r="5" fill="currentColor" opacity=".3"/>`,
  slides: `<ellipse cx="300" cy="280" rx="170" ry="45" fill="currentColor" opacity=".85"/>
  <ellipse cx="300" cy="350" rx="160" ry="40" fill="currentColor" opacity=".55"/>
  <path d="M200,180 C200,180 230,310 280,310" stroke="currentColor" stroke-width="14" stroke-linecap="round" fill="none" opacity=".7"/>
  <ellipse cx="300" cy="200" rx="80" ry="12" fill="currentColor" opacity=".4"/>
  <ellipse cx="300" cy="340" rx="130" ry="30" fill="currentColor" opacity=".25"/>
  <circle cx="220" cy="195" r="6" fill="currentColor" opacity=".35"/>
  <circle cx="370" cy="195" r="6" fill="currentColor" opacity=".35"/>`,
  heels: `<path d="M140,350 L450,350 Q470,350 470,330 L470,310 Q470,290 450,280 C420,270 390,260 370,250 C350,240 330,220 320,200 C310,180 300,160 280,150 C260,140 240,150 220,170 C200,190 180,220 160,250 Q140,280 130,310 Z" fill="currentColor" opacity=".85"/>
  <path d="M130,350 L170,460 Q180,480 200,480 L210,480 Q230,480 240,460 L280,350 Z" fill="currentColor" opacity=".55"/>
  <path d="M130,350 C130,360 140,368 150,375 L460,375 Q470,368 480,360 L480,350 Z" fill="currentColor" opacity=".6"/>
  <ellipse cx="300" cy="250" rx="35" ry="10" fill="currentColor" opacity=".25"/>
  <path d="M160,365 L460,365" stroke="currentColor" stroke-width="1.5" opacity=".2"/>
  <path d="M200,180 Q240,160 270,160" stroke="currentColor" stroke-width="2" fill="none" opacity=".35"/>`,
  sport: `<path d="M100,380 L440,380 Q470,380 480,350 L490,310 Q490,280 470,260 C440,240 400,220 370,200 C340,180 320,150 310,120 C300,100 290,90 270,100 C250,110 240,130 230,160 C220,190 200,230 170,260 C140,290 110,320 100,350 Z" fill="currentColor" opacity=".85"/>
  <path d="M100,380 C100,395 110,405 120,410 L450,410 C460,405 470,395 480,380 Z" fill="currentColor" opacity=".55"/>
  <rect x="350" y="390" width="100" height="20" rx="5" fill="currentColor" opacity=".4"/>
  <rect x="200" y="390" width="80" height="20" rx="5" fill="currentColor" opacity=".4"/>
  <path d="M330,110 L340,110 Q350,125 350,140 C350,155 340,170 330,180 L320,180 Q330,160 332,145 Q335,130 330,110 Z" fill="currentColor" opacity=".4"/>
  <line x1="130" y1="395" x2="380" y2="395" stroke="currentColor" stroke-width="3" opacity=".25"/>`,
};
function shoeSvg(cat: string, name: string, v: number, brand: string = ""): string {
  const t = catTheme[cat] || catTheme.sneakers;
  const n = name.replace(/[&<>"']/g, "_");
  const b = brand.replace(/[&<>"']/g, "_");
  const rx = v === 1 ? "-1 1" : "0 1";
  const fl = v === 3 ? "scale(-1,1) translate(-600,0)" : "";
  const sc = v === 2 ? 1.15 : 1;
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="${t.bg}"/><stop offset="100%" stop-color="${t.bg2}"/>
</linearGradient>
<filter id="g"><feGaussianBlur stdDeviation="20"/></filter>
</defs>
<rect width="600" height="600" fill="url(#g)"/>
<ellipse cx="300" cy="300" rx="180" ry="180" fill="${t.ac}" opacity=".05" transform="scale(${sc})"/>
<g transform="${fl} translate(0,0)">
<ellipse cx="300" cy="430" rx="200" ry="30" fill="#000" opacity=".3"/>
<g transform="translate(300,300) scale(${sc}) translate(-300,-300)">
<g color="${t.ac}">${shoePaths[cat]}</g>
</g>
</g>
<text x="300" y="490" text-anchor="middle" font-size="22" fill="${t.ac}" font-family="sans-serif" font-weight="bold">${n}</text>
<text x="300" y="515" text-anchor="middle" font-size="14" fill="${t.ac}" opacity=".6" font-family="sans-serif">${b || cat}</text>
<rect x="180" y="535" width="240" height="2" rx="1" fill="${t.ac}" opacity=".25"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}

const sneakers = [
  { id: "snk-001", name: "Air Max Pulse", namePersian: "ایر مکس پالس", brand: "Nike", featured: true },
  { id: "snk-002", name: "Cloud Runner Pro", namePersian: "کلود رانر پرو", brand: "Adidas", new: true },
  { id: "snk-003", name: "Urban Street X", namePersian: "اربان استریت ایکس", brand: "Puma" },
  { id: "snk-004", name: "Flex Walker 3000", namePersian: "فلکس واکر ۳۰۰۰", brand: "New Balance", featured: true },
  { id: "snk-005", name: "Neo Wave", namePersian: "نئو ویو", brand: "Reebok" },
  { id: "snk-006", name: "Street Glide", namePersian: "استریت گلاید", brand: "Vans" },
  { id: "snk-007", name: "Motion Flow", namePersian: "موشن فلو", brand: "Asics", sale: true, discount: 20 },
  { id: "snk-008", name: "Pure Step", namePersian: "پیور استپ", brand: "Converse" },
  { id: "snk-009", name: "Core Flex", namePersian: "کور فلکس", brand: "Under Armour", featured: true, new: true },
  { id: "snk-010", name: "Apex Stride", namePersian: "اپکس استراید", brand: "Fila" },
  { id: "snk-011", name: "Vapor Trail", namePersian: "ویپر تریل", brand: "Mizuno" },
  { id: "snk-012", name: "City Trek", namePersian: "سیتی ترک", brand: "Timberland" },
  { id: "snk-013", name: "Nova Sprint", namePersian: "نوا اسپرینت", brand: "Saucony", sale: true, discount: 15 },
  { id: "snk-014", name: "Pulse 2.0", namePersian: "پالس ۲.۰", brand: "Diadora" },
  { id: "snk-015", name: "Edge Runner", namePersian: "اج رانر", brand: "Li-Ning", new: true },
];

const formal = [
  { id: "frm-001", name: "Executive Black", namePersian: "اکزیکتیو بلک", brand: "Clarks", featured: true },
  { id: "frm-002", name: "Classic Oxford", namePersian: "کلاسیک آکسفورد", brand: "Loake" },
  { id: "frm-003", name: "Heritage Brown", namePersian: "هریتیج براون", brand: "Barker", new: true },
  { id: "frm-004", name: "Modern Derby", namePersian: "مدرن دربی", brand: "Hush Puppies" },
  { id: "frm-005", name: "Elite Leather", namePersian: "الیت لدر", brand: "Florsheim", featured: true },
  { id: "frm-006", name: "Royal Windsor", namePersian: "رویال ویندزور", brand: "Church's" },
  { id: "frm-007", name: "Premium Cap-Toe", namePersian: "پریمیوم کپ-تو", brand: "Allen Edmonds", sale: true, discount: 25 },
  { id: "frm-008", name: "Vintage Tan", namePersian: "وینتیج تن", brand: "Sanders" },
  { id: "frm-009", name: "Business Lace-Up", namePersian: "بیزینس لیس-آپ", brand: "Ecco", featured: true },
  { id: "frm-010", name: "Signature Black", namePersian: "سیگنیچر بلک", brand: "Magnanni", new: true },
];

const running = [
  { id: "run-001", name: "Speed Force", namePersian: "اسپید فورس", brand: "Nike", featured: true },
  { id: "run-002", name: "Marathon Elite", namePersian: "ماراتون الیت", brand: "Adidas", new: true },
  { id: "run-003", name: "Endurance Pro", namePersian: "اندورنس پرو", brand: "Brooks" },
  { id: "run-004", name: "Quick Stride", namePersian: "کوییک استراید", brand: "Asics", sale: true, discount: 10 },
  { id: "run-005", name: "Trail Blazer", namePersian: "تریل بلیزر", brand: "Salomon", featured: true },
  { id: "run-006", name: "Velocity X", namePersian: "ولوسیتی ایکس", brand: "New Balance" },
  { id: "run-007", name: "Run Free", namePersian: "ران فری", brand: "Hoka" },
  { id: "run-008", name: "Pace Setter", namePersian: "پیس ستر", brand: "Under Armour", new: true },
  { id: "run-009", name: "Turbo Flex", namePersian: "توربو فلکس", brand: "Mizuno", featured: true },
  { id: "run-010", name: "Long Run", namePersian: "لانگ ران", brand: "Puma" },
  { id: "run-011", name: "Sprint Master", namePersian: "اسپرینت مستر", brand: "Reebok", sale: true, discount: 20 },
  { id: "run-012", name: "Air Cushion", namePersian: "ایر کوشن", brand: "Skechers", new: true },
];

const casual = [
  { id: "csl-001", name: "Weekend Walker", namePersian: "ویکند واکر", brand: "Clarks", featured: true },
  { id: "csl-002", name: "Comfort Plus", namePersian: "کامفورت پلاس", brand: "Skechers" },
  { id: "csl-003", name: "Daily Driver", namePersian: "دیلی درایور", brand: "Ecco", new: true },
  { id: "csl-004", name: "Easy Step", namePersian: "ایزی استپ", brand: "Geox" },
  { id: "csl-005", name: "Relax Fit", namePersian: "ریلکس فیت", brand: "FitFlop", featured: true },
  { id: "csl-006", name: "Urban Comfort", namePersian: "اربان کامفورت", brand: "Dr. Martens" },
  { id: "csl-007", name: "Laid Back", namePersian: "لید بک", brand: "Vans" },
  { id: "csl-008", name: "Soft Touch", namePersian: "سافت تاچ", brand: "Toms", sale: true, discount: 15 },
  { id: "csl-009", name: "Breeze Walk", namePersian: "بریز واک", brand: "Birkenstock", new: true },
  { id: "csl-010", name: "Chill Out", namePersian: "چیل اوت", brand: "Sanuk", featured: true },
];

const boots = [
  { id: "bt-001", name: "Winter Guard", namePersian: "وینتر گارد", brand: "Timberland", featured: true },
  { id: "bt-002", name: "Desert Storm", namePersian: "دزرت استورم", brand: "Clarks" },
  { id: "bt-003", name: "Mountain Trek", namePersian: "ماونتین ترک", brand: "Merrell", new: true },
  { id: "bt-004", name: "Urban Boot", namePersian: "اربان بوت", brand: "Dr. Martens", sale: true, discount: 20 },
  { id: "bt-005", name: "Classic Chelsea", namePersian: "کلاسیک چلسی", brand: "Blundstone", featured: true },
  { id: "bt-006", name: "Leather Lace-Up", namePersian: "لدر لیس-آپ", brand: "Red Wing" },
  { id: "bt-007", name: "Snow Proof", namePersian: "اسنو پروف", brand: "Sorel", new: true },
  { id: "bt-008", name: "Adventure Boot", namePersian: "ادونچر بوت", brand: "Columbia" },
  { id: "bt-009", name: "Timber Walk", namePersian: "تیمبر واک", brand: "CAT", featured: true },
  { id: "bt-010", name: "Rugged Style", namePersian: "راکد استایل", brand: "Wolverine", sale: true, discount: 10 },
];

const sandals = [
  { id: "snd-001", name: "Summer Breeze", namePersian: "سامر بریز", brand: "Birkenstock", featured: true },
  { id: "snd-002", name: "Beach Walk", namePersian: "بیچ واک", brand: "Reef" },
  { id: "snd-003", name: "Open Air", namePersian: "اوپن ایر", brand: "Teva", new: true },
  { id: "snd-004", name: "Island Time", namePersian: "آیلند تایم", brand: "Rainbow" },
  { id: "snd-005", name: "Sun Kissed", namePersian: "سان کیس", brand: "Havaianas", featured: true },
  { id: "snd-006", name: "Coastal Step", namePersian: "کوستال استپ", brand: "Chaco" },
  { id: "snd-007", name: "Barefoot Feel", namePersian: "بیرفوت فیل", brand: "Xero", sale: true, discount: 15 },
  { id: "snd-008", name: "Tropical Vibes", namePersian: "تروپیکال وایب", brand: "Olukai", new: true },
];

const loafers = [
  { id: "lf-001", name: "Penny Loafer", namePersian: "پنی لوفِر", brand: "G.H. Bass", featured: true },
  { id: "lf-002", name: "Italian Leather", namePersian: "ایتالین لدر", brand: "Tod's" },
  { id: "lf-003", name: "Tassel Classic", namePersian: "تاسل کلاسیک", brand: "Alden", new: true },
  { id: "lf-004", name: "Slip-On Luxe", namePersian: "اسلیپ-آن لاکس", brand: "Cole Haan", featured: true },
  { id: "lf-005", name: "Venetian Style", namePersian: "ونیشن استایل", brand: "Salvatore Ferragamo", sale: true, discount: 30 },
  { id: "lf-006", name: "Driving Shoe", namePersian: "درایوینگ شو", brand: "Hogan" },
  { id: "lf-007", name: "Bit Loafer", namePersian: "بیت لوفِر", brand: "Gucci", featured: true },
  { id: "lf-008", name: "Suede Comfort", namePersian: "سوئید کامفورت", brand: "Clarks", new: true },
];

const slides = [
  { id: "sld-001", name: "Pool Side", namePersian: "پول ساید", brand: "Adidas", featured: true },
  { id: "sld-002", name: "Cloud Slide", namePersian: "کلاید اسلاید", brand: "Nike" },
  { id: "sld-003", name: "Easy On", namePersian: "ایزی آن", brand: "Under Armour" },
  { id: "sld-004", name: "Sport Slide", namePersian: "اسپرت اسلاید", brand: "Puma", new: true },
  { id: "sld-005", name: "Bath House", namePersian: "بث هاوس", brand: "Crocs", sale: true, discount: 10 },
  { id: "sld-006", name: "Ultra Soft", namePersian: "اولترا سافت", brand: "Skechers", featured: true },
  { id: "sld-007", name: "Quick Step", namePersian: "کوییک استپ", brand: "Reebok" },
  { id: "sld-008", name: "Lounge Wear", namePersian: "لانج ویر", brand: "Havaianas", new: true },
];

const heels = [
  { id: "hl-001", name: "Stiletto Night", namePersian: "استیلتو نایت", brand: "Jimmy Choo", featured: true },
  { id: "hl-002", name: "Pump Classic", namePersian: "پامپ کلاسیک", brand: "Christian Louboutin" },
  { id: "hl-003", name: "Block Heel", namePersian: "بلوک هیل", brand: "Sam Edelman", new: true },
  { id: "hl-004", name: "Kitten Heel", namePersian: "کیتن هیل", brand: "Manolo Blahnik" },
  { id: "hl-005", name: "Platform Luxe", namePersian: "پلتفرم لاکس", brand: "Steve Madden", sale: true, discount: 20 },
  { id: "hl-006", name: "Evening Glam", namePersian: "ایونینگ گلم", brand: "Stuart Weitzman", featured: true },
  { id: "hl-007", name: "Strappy Sandal", namePersian: "استرپی سندل", brand: "Giuseppe Zanotti" },
  { id: "hl-008", name: "Pointed Toe", namePersian: "پوینتید تو", brand: "Nine West", new: true },
  { id: "hl-009", name: "Wedge Heel", namePersian: "وج هیل", brand: "Tory Burch", featured: true },
  { id: "hl-010", name: "Court Shoe", namePersian: "کورت شو", brand: "Kate Spade", sale: true, discount: 15 },
];

const sport = [
  { id: "spt-001", name: "Training Pro", namePersian: "ترینینگ پرو", brand: "Nike", featured: true },
  { id: "spt-002", name: "Gym Flex", namePersian: "جیم فلکس", brand: "Adidas", new: true },
  { id: "spt-003", name: "Cross Fit X", namePersian: "کراس فیت ایکس", brand: "Reebok" },
  { id: "spt-004", name: "Court Master", namePersian: "کورت مستر", brand: "Wilson" },
  { id: "spt-005", name: "Basket Ball Pro", namePersian: "بسکتبال پرو", brand: "Under Armour", featured: true },
  { id: "spt-006", name: "Soccer Edge", namePersian: "ساکر اج", brand: "Puma" },
  { id: "spt-007", name: "Tennis Ace", namePersian: "تنیس ایس", brand: "Asics", new: true },
  { id: "spt-008", name: "Yoga Flow", namePersian: "یوگا فلو", brand: "Lululemon", featured: true },
  { id: "spt-009", name: "HIIT Runner", namePersian: "هیت رانر", brand: "New Balance", sale: true, discount: 15 },
  { id: "spt-010", name: "Plyo Force", namePersian: "پلایو فورس", brand: "Nike", new: true },
];

const rawShoes = [
  ...sneakers.map((s) => ({ ...s, category: "sneakers", categoryPersian: "کتانی" })),
  ...formal.map((s) => ({ ...s, category: "formal", categoryPersian: "رسمی" })),
  ...running.map((s) => ({ ...s, category: "running", categoryPersian: "دویدن" })),
  ...casual.map((s) => ({ ...s, category: "casual", categoryPersian: "مجلسی" })),
  ...boots.map((s) => ({ ...s, category: "boots", categoryPersian: "چکمه" })),
  ...sandals.map((s) => ({ ...s, category: "sandals", categoryPersian: "صندل" })),
  ...loafers.map((s) => ({ ...s, category: "loafers", categoryPersian: "موکاسین" })),
  ...slides.map((s) => ({ ...s, category: "slides", categoryPersian: "دمپایی" })),
  ...heels.map((s) => ({ ...s, category: "heels", categoryPersian: "پاشنه بلند" })),
  ...sport.map((s) => ({ ...s, category: "sport", categoryPersian: "ورزشی" })),
];

const descriptions: Record<string, string> = {
  sneakers: "A versatile sneaker designed for everyday comfort and street-ready style. Features responsive cushioning and a breathable upper for all-day wear.",
  formal: "Crafted from premium leather with meticulous attention to detail. Perfect for business meetings, formal events, and sophisticated occasions.",
  running: "Engineered for performance with lightweight materials and advanced cushioning technology. Helps you go further, faster.",
  casual: "Relaxed style meets everyday comfort. Ideal for weekend outings, casual Fridays, and laid-back adventures.",
  boots: "Built tough for any terrain. Weather-resistant materials and rugged construction make these boots ready for any adventure.",
  sandals: "Embrace the warm weather with these comfortable and stylish sandals. Perfect for beach days and summer strolls.",
  loafers: "Effortless elegance for the modern wardrobe. Slip into sophistication with these timeless loafers.",
  slides: "Ultimate convenience for poolside, gym, or lounging at home. Lightweight and easy to wear.",
  heels: "Make a statement with these stunning heels. Designed to elevate any outfit, from day to night.",
  sport: "Maximum performance for your active lifestyle. Engineered with sport-specific technology for your training needs.",
};

const descPersian: Record<string, string> = {
  sneakers: "یک کتانی همه‌کاره برای راحتی روزمره و استایل خیابانی. با بالشتک‌های پاسخگو و رویه تنفس‌پذیر برای استفاده در تمام طول روز.",
  formal: "ساخته شده از چرم ممتاز با توجه دقیق به جزئیات. مناسب برای جلسات کاری، رویدادهای رسمی و موقعیت‌های خاص.",
  running: "طراحی شده برای عملکرد با مواد سبک و فناوری بالشتک پیشرفته. به شما کمک می‌کند سریع‌تر و دورتر بروید.",
  casual: "سبک راحت با راحتی روزمره. ایده‌آل برای گردش‌های آخر هفته و ماجراجویی‌های معمولی.",
  boots: "ساخته شده برای هر terrain. مواد مقاوم در برابر آب و ساختار مقاوم، این چکمه‌ها را برای هر ماجراجویی آماده کرده است.",
  sandals: "از هوای گرم با این صندل‌های راحت و شیک لذت ببرید. مناسب برای روزهای ساحلی و قدم‌های تابستانی.",
  loafers: "ظرافت بی‌زحمت برای کمد مدرن. با این موکاسین‌های بی‌زمان، در elegance قدم بزنید.",
  slides: "راحتی نهایی برای کنار استخر، باشگاه یا استراحت در خانه. سبک و آسان برای پوشیدن.",
  heels: "با این کفش‌های پاشنه‌بلند خیره‌کننده، یک بیانیه جسورانه داشته باشید. طراحی شده برای ارتقاء هر لباس، از روز تا شب.",
  sport: "حداکثر عملکرد برای سبک زندگی فعال شما. طراحی شده با فناوری مخصوص ورزش برای نیازهای تمرینی شما.",
};

const prices = [
  890000, 1200000, 1500000, 980000, 2100000, 750000, 1650000, 1100000, 1850000, 1350000,
  2500000, 3200000, 890000, 1450000, 1700000, 950000, 2800000, 3900000, 650000, 1250000,
];

export const shoes: Shoe[] = rawShoes.map((s, i) => ({
  id: s.id,
  name: s.name,
  namePersian: s.namePersian,
  description: descriptions[s.category] || "Premium quality footwear crafted for comfort and style.",
  descriptionPersian: descPersian[s.category] || "کفش با کیفیت ممتاز ساخته شده برای راحتی و استایل.",
  price: prices[i % prices.length],
  category: s.category,
  categoryPersian: s.categoryPersian,
  sizes: pickSizes(i + 1),
  colors: pickColors(i + 3),
  image: shoeSvg(s.category, s.namePersian, 0, s.brand),
  images: [shoeSvg(s.category, s.namePersian, 1, s.brand), shoeSvg(s.category, s.namePersian, 2, s.brand), shoeSvg(s.category, s.namePersian, 3, s.brand)],
  brand: s.brand,
  rating: +(3.5 + rng(i + 5) * 1.5).toFixed(1),
  inStock: true,
  featured: s.featured || false,
  new: s.new || false,
  sale: s.sale || false,
  discount: s.discount || undefined,
}));

export function getShoeById(id: string): Shoe | undefined {
  return shoes.find((s) => s.id === id);
}

export function getFeaturedShoes(): Shoe[] {
  return shoes.filter((s) => s.featured);
}

export function getNewShoes(): Shoe[] {
  return shoes.filter((s) => s.new);
}

export function getSaleShoes(): Shoe[] {
  return shoes.filter((s) => s.sale);
}

export function getShoesByCategory(category: string): Shoe[] {
  return shoes.filter((s) => s.category === category);
}

export function getCategories(): string[] {
  return [...new Set(shoes.map((s) => s.category))];
}

export function searchShoes(query: string): Shoe[] {
  const q = query.toLowerCase();
  return shoes.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.namePersian.includes(q) ||
      s.brand.toLowerCase().includes(q) ||
      s.category.includes(q)
  );
}
