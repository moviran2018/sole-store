const fs = require("fs");
const path = require("path");
const BASE = "https://moviran2018.github.io/sole-store";

const staticPages = [
  { path: "", priority: "1.0" },
  { path: "about", priority: "0.8" },
  { path: "contact", priority: "0.8" },
  { path: "cart", priority: "0.6" },
  { path: "checkout", priority: "0.6" },
  { path: "menu", priority: "0.7" },
  { path: "reserve", priority: "0.7" },
  { path: "admin", priority: "0.5" },
];

let products = [];
try {
  const json = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "public", "data", "products.json"),
      "utf-8"
    )
  );
  products = json.products || [];
} catch {
  console.warn("products.json not found, generating sitemap without products");
}

const urls = staticPages.map(
  (p) => `  <url><loc>${BASE}/${p.path}</loc><changefreq>monthly</changefreq><priority>${p.priority}</priority></url>`
);

for (const p of products) {
  urls.push(
    `  <url><loc>${BASE}/products/${p.id}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
fs.writeFileSync(outPath, xml);
console.log("✓ sitemap.xml generated with", urls.length, "URLs →", outPath);
