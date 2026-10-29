/**
 * @file services/seo/sitemapGenerator.js
 * @description Dynamic XML Sitemap and robots.txt generator pulling canonical routes, CMS articles, and recipes.
 */

import { SITE_CONFIG } from './seoConfig.js';
import { ARTICLES, RECIPES } from '../../constants.js';

/**
 * Builds the complete list of canonical public URLs with priority and change frequency.
 * @returns {Array<{ path: string, changefreq: string, priority: string, lastmod: string }>}
 */
export function getCanonicalUrlEntries() {
  const today = new Date().toISOString().split('T')[0];

  const staticEntries = [
    { path: '/', changefreq: 'weekly', priority: '1.0', lastmod: today },
    { path: '/education', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { path: '/recipes', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { path: '/community-wisdom', changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/about', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { path: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: today },
    { path: '/privacy-policy', changefreq: 'monthly', priority: '0.6', lastmod: today },
    { path: '/terms-of-service', changefreq: 'monthly', priority: '0.6', lastmod: today },
    { path: '/disclaimer', changefreq: 'monthly', priority: '0.6', lastmod: today },
  ];

  // Dynamic editorial articles from repository constants
  const articleEntries = (ARTICLES || []).map((art) => ({
    path: `/learning-center/${art.id}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: today,
  }));

  // Dynamic restorative recipe articles
  const recipeEntries = (RECIPES || []).map((recipe) => ({
    path: `/learning-center/${recipe.id}`,
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: today,
  }));

  return [...staticEntries, ...articleEntries, ...recipeEntries];
}

/**
 * Generates an XML string conforming to the Sitemaps XML protocol.
 * @returns {string} XML Sitemap content
 */
export function generateSitemapXml() {
  const entries = getCanonicalUrlEntries();

  const urlNodes = entries
    .map(
      (entry) => `  <url>
    <loc>${SITE_CONFIG.baseUrl}${entry.path === '/' ? '' : entry.path}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlNodes}
</urlset>
`;
}

/**
 * Generates production robots.txt content with strict security and AdSense crawlers permissions.
 * @returns {string} robots.txt content
 */
export function generateRobotsTxt() {
  return `# ==============================================================================
# robots.txt for AfterMa Postpartum Healthcare & Wellness
# Canonical: ${SITE_CONFIG.baseUrl}/robots.txt
# Generated: ${new Date().toISOString()}
# ==============================================================================

# 1. Standard Crawlers (Googlebot, Bingbot, DuckDuckBot)
User-agent: *
Allow: /
Allow: /education
Allow: /recipes
Allow: /community-wisdom
Allow: /learning-center/
Allow: /about
Allow: /contact
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /disclaimer

# Protect private health portals, auth states, checkout, and interactive tools
Disallow: /dashboard*
Disallow: /carejourney*
Disallow: /care-journey/session*
Disallow: /mood-check*
Disallow: /healthlogs*
Disallow: /lactationlogs*
Disallow: /healthsummary*
Disallow: /mentalwellness*
Disallow: /momkart-cart*
Disallow: /momkart-payment*
Disallow: /settings*
Disallow: /signin*
Disallow: /api/
Disallow: /*?*session=
Disallow: /*?*token=

# 2. Google AdSense Mediapartners Crawler
# Must have access to verify editorial content and context
User-agent: Mediapartners-Google
Allow: /
Allow: /education
Allow: /recipes
Allow: /learning-center/
Allow: /community-wisdom
Allow: /about
Allow: /contact
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /disclaimer

# 3. Google-Display-Ads-Bot
User-agent: Google-Display-Ads-Bot
Allow: /
Allow: /education
Allow: /recipes
Allow: /learning-center/

# 4. Sitemap Index Pointer
Sitemap: ${SITE_CONFIG.baseUrl}/sitemap.xml
`;
}
