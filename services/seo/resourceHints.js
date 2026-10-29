/**
 * @file services/seo/resourceHints.js
 * @description Core Web Vitals optimization utility for preconnect, dns-prefetch, and font preloading.
 */

const CRITICAL_ORIGINS = [
  { url: 'https://fonts.googleapis.com', preconnect: true },
  { url: 'https://fonts.gstatic.com', preconnect: true, crossOrigin: 'anonymous' },
  { url: 'https://images.unsplash.com', preconnect: true, crossOrigin: 'anonymous' },
  { url: 'https://picsum.photos', dnsPrefetch: true },
  { url: 'https://checkout.razorpay.com', dnsPrefetch: true },
  { url: 'https://pagead2.googlesyndication.com', dnsPrefetch: true },
];

/**
 * Injects resource hints (preconnect and dns-prefetch) into document <head>
 * to optimize Time to First Byte (TTFB), First Contentful Paint (FCP), and LCP.
 */
export function injectResourceHints() {
  if (typeof document === 'undefined') return;

  CRITICAL_ORIGINS.forEach((hint) => {
    // Check if already injected
    const existing = document.querySelector(`link[href="${hint.url}"]`);
    if (existing) return;

    if (hint.preconnect) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = hint.url;
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      document.head.appendChild(link);
    }

    if (hint.dnsPrefetch) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = hint.url;
      document.head.appendChild(link);
    }
  });
}

/**
 * Preloads a specific font or critical media asset.
 *
 * @param {string} href - URL of font or image
 * @param {'font'|'image'|'script'|'style'} asType - Resource type
 * @param {string} [type] - MIME type, e.g. "font/woff2"
 */
export function preloadAsset(href, asType, type) {
  if (typeof document === 'undefined' || !href) return;

  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = asType;
  if (type) link.type = type;
  if (asType === 'font') link.crossOrigin = 'anonymous';

  document.head.appendChild(link);
}
