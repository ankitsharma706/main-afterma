/**
 * @file scripts/generate-seo-assets.js
 * @description Build script to write dynamic sitemap.xml and robots.txt to public/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXml, generateRobotsTxt } from '../services/seo/sitemapGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

function buildSeoAssets() {
  console.log('🚀 Generating SEO assets (sitemap.xml and robots.txt)...');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate Sitemap XML
  const sitemapXml = generateSitemapXml();
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  console.log(`✅ sitemap.xml written to ${sitemapPath}`);

  // 2. Generate robots.txt
  const robotsTxt = generateRobotsTxt();
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
  console.log(`✅ robots.txt written to ${robotsPath}`);

  console.log('🎉 Enterprise SEO assets generation complete!');
}

buildSeoAssets();
