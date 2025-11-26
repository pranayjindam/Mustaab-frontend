// scripts/generate-sitemap.js
import fs from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';

const siteUrl = 'https://laxmisareehouse.com';
const API_BASE = process.env.API_BASE || 'https://api.laxmisareehouse.com'; // set in Vercel env

async function fetchProducts() {
  // expects API to return JSON array or { products: [...] }
  const res = await fetch(`${API_BASE}/product`);
  if (!res.ok) {
    console.warn('Failed to fetch products:', res.status);
    return [];
  }
  const json = await res.json();
  return json.products || json || [];
}

(async () => {
  try {
    const sitemap = new SitemapStream({ hostname: siteUrl });

    // static pages (from your router)
    const pages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/women', changefreq: 'weekly', priority: 0.9 },
      { url: '/men', changefreq: 'weekly', priority: 0.9 },
      { url: '/kids', changefreq: 'weekly', priority: 0.8 },
      { url: '/beauty', changefreq: 'weekly', priority: 0.8 },
      { url: '/ornaments', changefreq: 'weekly', priority: 0.8 },
      { url: '/store', changefreq: 'weekly', priority: 0.7 },
      { url: '/cart', changefreq: 'daily', priority: 0.7 },
      { url: '/wishlist', changefreq: 'daily', priority: 0.6 },
      { url: '/checkout', changefreq: 'daily', priority: 0.7 },
      { url: '/privacy-policy', changefreq: 'yearly', priority: 0.2 },
      { url: '/terms-service', changefreq: 'yearly', priority: 0.2 },
      { url: '/shipping-delivery', changefreq: 'monthly', priority: 0.3 },
      { url: '/returns', changefreq: 'monthly', priority: 0.3 },
      { url: '/help', changefreq: 'monthly', priority: 0.3 }
    ];

    pages.forEach(p => sitemap.write(p));

    // products
    const products = await fetchProducts();
    for (const prod of products) {
      // try multiple possible slug fields
      const slug = prod.slug || prod.slugName || prod.slugUrl || prod._id || prod.id;
      if (!slug) continue;
      // ensure path looks like /product/slug
      const path = String(slug).startsWith('product/') ? `/${slug}` : `/product/${slug}`;
      sitemap.write({
        url: path,
        lastmod: prod.updatedAt || prod.createdAt || undefined,
        changefreq: 'monthly',
        priority: 0.6
      });
    }

    sitemap.end();
    const xml = await streamToPromise(sitemap).then(sm => sm.toString());
    fs.writeFileSync('./public/sitemap.xml', xml, 'utf8');
    console.log('✅ public/sitemap.xml generated');
  } catch (err) {
    console.error('Sitemap generation failed:', err);
    process.exit(1);
  }
})();
