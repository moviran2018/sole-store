const fs = require("fs");
const path = require("path");

const categories = ["sneakers","formal","running","casual","boots","sandals","loafers","slides","heels","sport"];
const catPersian = {"sneakers":"کتانی","formal":"رسمی","running":"دویدن","casual":"مجلسی","boots":"چکمه","sandals":"صندل","loafers":"موکاسین","slides":"دمپایی","heels":"پاشنه بلند","sport":"ورزشی"};

const products = {
  sneakers: [
    {id:"snk-001",name:"Air Max Pulse",namePersian:"ایر مکس پالس",brand:"Nike",featured:true},
    {id:"snk-002",name:"Cloud Runner Pro",namePersian:"کلود رانر پرو",brand:"Adidas",new:true},
    {id:"snk-003",name:"Urban Street X",namePersian:"اربان استریت ایکس",brand:"Puma"},
    {id:"snk-004",name:"Flex Walker 3000",namePersian:"فلکس واکر ۳۰۰۰",brand:"New Balance",featured:true},
    {id:"snk-005",name:"Neo Wave",namePersian:"نئو ویو",brand:"Reebok"},
    {id:"snk-006",name:"Street Glide",namePersian:"استریت گلاید",brand:"Vans"},
    {id:"snk-007",name:"Motion Flow",namePersian:"موشن فلو",brand:"Asics",sale:true,discount:20},
    {id:"snk-008",name:"Pure Step",namePersian:"پیور استپ",brand:"Converse"},
    {id:"snk-009",name:"Core Flex",namePersian:"کور فلکس",brand:"Under Armour",featured:true,new:true},
    {id:"snk-010",name:"Apex Stride",namePersian:"اپکس استراید",brand:"Fila"},
    {id:"snk-011",name:"Vapor Trail",namePersian:"ویپر تریل",brand:"Mizuno"},
    {id:"snk-012",name:"City Trek",namePersian:"سیتی ترک",brand:"Timberland"},
    {id:"snk-013",name:"Nova Sprint",namePersian:"نوا اسپرینت",brand:"Saucony",sale:true,discount:15},
    {id:"snk-014",name:"Pulse 2.0",namePersian:"پالس ۲.۰",brand:"Diadora"},
    {id:"snk-015",name:"Edge Runner",namePersian:"اج رانر",brand:"Li-Ning",new:true}
  ],
  formal: [
    {id:"frm-001",name:"Executive Black",namePersian:"اکزیکتیو بلک",brand:"Clarks",featured:true},
    {id:"frm-002",name:"Classic Oxford",namePersian:"کلاسیک آکسفورد",brand:"Loake"},
    {id:"frm-003",name:"Heritage Brown",namePersian:"هریتیج براون",brand:"Barker",new:true},
    {id:"frm-004",name:"Modern Derby",namePersian:"مدرن دربی",brand:"Hush Puppies"},
    {id:"frm-005",name:"Elite Leather",namePersian:"الیت لدر",brand:"Florsheim",featured:true},
    {id:"frm-006",name:"Royal Windsor",namePersian:"رویال ویندزور",brand:"Church's"},
    {id:"frm-007",name:"Premium Cap-Toe",namePersian:"پریمیوم کپ-تو",brand:"Allen Edmonds",sale:true,discount:25},
    {id:"frm-008",name:"Vintage Tan",namePersian:"وینتیج تن",brand:"Sanders"},
    {id:"frm-009",name:"Business Lace-Up",namePersian:"بیزینس لیس-آپ",brand:"Ecco",featured:true},
    {id:"frm-010",name:"Signature Black",namePersian:"سیگنیچر بلک",brand:"Magnanni",new:true}
  ],
  running: [
    {id:"run-001",name:"Speed Force",namePersian:"اسپید فورس",brand:"Nike",featured:true},
    {id:"run-002",name:"Marathon Elite",namePersian:"ماراتون الیت",brand:"Adidas",new:true},
    {id:"run-003",name:"Endurance Pro",namePersian:"اندورنس پرو",brand:"Brooks"},
    {id:"run-004",name:"Quick Stride",namePersian:"کوییک استراید",brand:"Asics",sale:true,discount:10},
    {id:"run-005",name:"Trail Blazer",namePersian:"تریل بلیزر",brand:"Salomon",featured:true},
    {id:"run-006",name:"Velocity X",namePersian:"ولوسیتی ایکس",brand:"New Balance"},
    {id:"run-007",name:"Run Free",namePersian:"ران فری",brand:"Hoka"},
    {id:"run-008",name:"Pace Setter",namePersian:"پیس ستر",brand:"Under Armour",new:true},
    {id:"run-009",name:"Turbo Flex",namePersian:"توربو فلکس",brand:"Mizuno",featured:true},
    {id:"run-010",name:"Long Run",namePersian:"لانگ ران",brand:"Puma"},
    {id:"run-011",name:"Sprint Master",namePersian:"اسپرینت مستر",brand:"Reebok",sale:true,discount:20},
    {id:"run-012",name:"Air Cushion",namePersian:"ایر کوشن",brand:"Skechers",new:true}
  ],
  casual: [
    {id:"csl-001",name:"Weekend Walker",namePersian:"ویکند واکر",brand:"Clarks",featured:true},
    {id:"csl-002",name:"Comfort Plus",namePersian:"کامفورت پلاس",brand:"Skechers"},
    {id:"csl-003",name:"Daily Driver",namePersian:"دیلی درایور",brand:"Ecco",new:true},
    {id:"csl-004",name:"Easy Step",namePersian:"ایزی استپ",brand:"Geox"},
    {id:"csl-005",name:"Relax Fit",namePersian:"ریلکس فیت",brand:"FitFlop",featured:true},
    {id:"csl-006",name:"Urban Comfort",namePersian:"اربان کامفورت",brand:"Dr. Martens"},
    {id:"csl-007",name:"Laid Back",namePersian:"لید بک",brand:"Vans"},
    {id:"csl-008",name:"Soft Touch",namePersian:"سافت تاچ",brand:"Toms",sale:true,discount:15},
    {id:"csl-009",name:"Breeze Walk",namePersian:"بریز واک",brand:"Birkenstock",new:true},
    {id:"csl-010",name:"Chill Out",namePersian:"چیل اوت",brand:"Sanuk",featured:true}
  ],
  boots: [
    {id:"bt-001",name:"Winter Guard",namePersian:"وینتر گارد",brand:"Timberland",featured:true},
    {id:"bt-002",name:"Desert Storm",namePersian:"دزرت استورم",brand:"Clarks"},
    {id:"bt-003",name:"Mountain Trek",namePersian:"ماونتین ترک",brand:"Merrell",new:true},
    {id:"bt-004",name:"Urban Boot",namePersian:"اربان بوت",brand:"Dr. Martens",sale:true,discount:20},
    {id:"bt-005",name:"Classic Chelsea",namePersian:"کلاسیک چلسی",brand:"Blundstone",featured:true},
    {id:"bt-006",name:"Leather Lace-Up",namePersian:"لدر لیس-آپ",brand:"Red Wing"},
    {id:"bt-007",name:"Snow Proof",namePersian:"اسنو پروف",brand:"Sorel",new:true},
    {id:"bt-008",name:"Adventure Boot",namePersian:"ادونچر بوت",brand:"Columbia"},
    {id:"bt-009",name:"Timber Walk",namePersian:"تیمبر واک",brand:"CAT",featured:true},
    {id:"bt-010",name:"Rugged Style",namePersian:"راکد استایل",brand:"Wolverine",sale:true,discount:10}
  ],
  sandals: [
    {id:"snd-001",name:"Summer Breeze",namePersian:"سامر بریز",brand:"Birkenstock",featured:true},
    {id:"snd-002",name:"Beach Walk",namePersian:"بیچ واک",brand:"Reef"},
    {id:"snd-003",name:"Open Air",namePersian:"اوپن ایر",brand:"Teva",new:true},
    {id:"snd-004",name:"Island Time",namePersian:"آیلند تایم",brand:"Rainbow"},
    {id:"snd-005",name:"Sun Kissed",namePersian:"سان کیس",brand:"Havaianas",featured:true},
    {id:"snd-006",name:"Coastal Step",namePersian:"کوستال استپ",brand:"Chaco"},
    {id:"snd-007",name:"Barefoot Feel",namePersian:"بیرفوت فیل",brand:"Xero",sale:true,discount:15},
    {id:"snd-008",name:"Tropical Vibes",namePersian:"تروپیکال وایب",brand:"Olukai",new:true}
  ],
  loafers: [
    {id:"lf-001",name:"Penny Loafer",namePersian:"پنی لوفِر",brand:"G.H. Bass",featured:true},
    {id:"lf-002",name:"Italian Leather",namePersian:"ایتالین لدر",brand:"Tod's"},
    {id:"lf-003",name:"Tassel Classic",namePersian:"تاسل کلاسیک",brand:"Alden",new:true},
    {id:"lf-004",name:"Slip-On Luxe",namePersian:"اسلیپ-آن لاکس",brand:"Cole Haan",featured:true},
    {id:"lf-005",name:"Venetian Style",namePersian:"ونیشن استایل",brand:"Salvatore Ferragamo",sale:true,discount:30},
    {id:"lf-006",name:"Driving Shoe",namePersian:"درایوینگ شو",brand:"Hogan"},
    {id:"lf-007",name:"Bit Loafer",namePersian:"بیت لوفِر",brand:"Gucci",featured:true},
    {id:"lf-008",name:"Suede Comfort",namePersian:"سوئید کامفورت",brand:"Clarks",new:true}
  ],
  slides: [
    {id:"sld-001",name:"Pool Side",namePersian:"پول ساید",brand:"Adidas",featured:true},
    {id:"sld-002",name:"Cloud Slide",namePersian:"کلاید اسلاید",brand:"Nike"},
    {id:"sld-003",name:"Easy On",namePersian:"ایزی آن",brand:"Under Armour"},
    {id:"sld-004",name:"Sport Slide",namePersian:"اسپرت اسلاید",brand:"Puma",new:true},
    {id:"sld-005",name:"Bath House",namePersian:"بث هاوس",brand:"Crocs",sale:true,discount:10},
    {id:"sld-006",name:"Ultra Soft",namePersian:"اولترا سافت",brand:"Skechers",featured:true},
    {id:"sld-007",name:"Quick Step",namePersian:"کوییک استپ",brand:"Reebok"},
    {id:"sld-008",name:"Lounge Wear",namePersian:"لانج ویر",brand:"Havaianas",new:true}
  ],
  heels: [
    {id:"hl-001",name:"Stiletto Night",namePersian:"استیلتو نایت",brand:"Jimmy Choo",featured:true},
    {id:"hl-002",name:"Pump Classic",namePersian:"پامپ کلاسیک",brand:"Christian Louboutin"},
    {id:"hl-003",name:"Block Heel",namePersian:"بلوک هیل",brand:"Sam Edelman",new:true},
    {id:"hl-004",name:"Kitten Heel",namePersian:"کیتن هیل",brand:"Manolo Blahnik"},
    {id:"hl-005",name:"Platform Luxe",namePersian:"پلتفرم لاکس",brand:"Steve Madden",sale:true,discount:20},
    {id:"hl-006",name:"Evening Glam",namePersian:"ایونینگ گلم",brand:"Stuart Weitzman",featured:true},
    {id:"hl-007",name:"Strappy Sandal",namePersian:"استرپی سندل",brand:"Giuseppe Zanotti"},
    {id:"hl-008",name:"Pointed Toe",namePersian:"پوینتید تو",brand:"Nine West",new:true},
    {id:"hl-009",name:"Wedge Heel",namePersian:"وج هیل",brand:"Tory Burch",featured:true},
    {id:"hl-010",name:"Court Shoe",namePersian:"کورت شو",brand:"Kate Spade",sale:true,discount:15}
  ],
  sport: [
    {id:"spt-001",name:"Training Pro",namePersian:"ترینینگ پرو",brand:"Nike",featured:true},
    {id:"spt-002",name:"Gym Flex",namePersian:"جیم فلکس",brand:"Adidas",new:true},
    {id:"spt-003",name:"Cross Fit X",namePersian:"کراس فیت ایکس",brand:"Reebok"},
    {id:"spt-004",name:"Court Master",namePersian:"کورت مستر",brand:"Wilson"},
    {id:"spt-005",name:"Basket Ball Pro",namePersian:"بسکتبال پرو",brand:"Under Armour",featured:true},
    {id:"spt-006",name:"Soccer Edge",namePersian:"ساکر اج",brand:"Puma"},
    {id:"spt-007",name:"Tennis Ace",namePersian:"تنیس ایس",brand:"Asics",new:true},
    {id:"spt-008",name:"Yoga Flow",namePersian:"یوگا فلو",brand:"Lululemon",featured:true},
    {id:"spt-009",name:"HIIT Runner",namePersian:"هیت رانر",brand:"New Balance",sale:true,discount:15},
    {id:"spt-010",name:"Plyo Force",namePersian:"پلایو فورس",brand:"Nike",new:true}
  ]
};

const prices = [
  890000,1200000,1500000,980000,2100000,750000,1650000,1100000,1850000,1350000,
  2500000,3200000,890000,1450000,1700000,950000,2800000,3900000,650000,1250000
];

let allProducts = [];
let idx = 0;
for (const cat of categories) {
  for (const p of products[cat]) {
    allProducts.push({
      id: p.id,
      name: p.name,
      namePersian: p.namePersian,
      brand: p.brand,
      price: prices[idx % prices.length],
      category: cat,
      categoryPersian: catPersian[cat],
      sale: p.sale || false,
      discount: p.discount || null,
      new: p.new || false,
      featured: p.featured || false,
    });
    idx++;
  }
}

const out = { products: allProducts, knowledge: [] };
const outPath = path.join(__dirname, "example", "data", "products.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log("Wrote " + allProducts.length + " products to " + outPath);
