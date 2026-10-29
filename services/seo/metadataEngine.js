/**
 * @file services/seo/metadataEngine.js
 * @description Canonical metadata resolution, title templating, OpenGraph, Twitter Cards, and hreflang engine.
 */

import { SITE_CONFIG, ROBOTS_DIRECTIVES, ROUTE_REGISTRY } from './seoConfig.js';

/**
 * Route Alias Canonical Mapping
 * Normalizes legacy or shorthand URLs to the single authoritative canonical destination.
 */
const CANONICAL_ALIASES = {
  '/privacy': '/privacy-policy',
  '/terms': '/terms-of-service',
  '/about-us': '/about',
  '/support': '/contact',
  '/help': '/contact',
  '/medical-disclaimer': '/disclaimer',
  '/learning': '/education',
};

/**
 * Resolves a normalized canonical URL from a given route path.
 * Strips query parameters, trailing slashes, and resolves route aliases.
 *
 * @param {string} pathname - Raw route path (e.g., "/privacy?ref=nav#top")
 * @param {string} [baseUrl=SITE_CONFIG.baseUrl] - Base canonical domain
 * @returns {string} Fully qualified canonical URL
 */
export function resolveCanonicalUrl(pathname = '/', baseUrl = SITE_CONFIG.baseUrl) {
  if (!pathname) return baseUrl;

  // Strip query strings and hash anchors
  const cleanPath = pathname.split('?')[0].split('#')[0].trim();

  // Normalize root or remove trailing slash
  let normalized = cleanPath === '' || cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  // Resolve aliases
  const canonicalPath = CANONICAL_ALIASES[normalized] || normalized;

  // Clean trailing slash for root vs sub-paths
  return canonicalPath === '/' ? baseUrl : `${baseUrl}${canonicalPath}`;
}

/**
 * Generates an SEO-compliant page title using the configured brand template.
 *
 * @param {string} [pageTitle] - Specific title of the page
 * @param {string} [template=SITE_CONFIG.titleTemplate] - Format template with %s
 * @returns {string} Formatted title tag content
 */
export function generatePageTitle(pageTitle, template = SITE_CONFIG.titleTemplate) {
  if (!pageTitle || pageTitle.trim() === '') {
    return SITE_CONFIG.defaultTitle;
  }

  const trimmed = pageTitle.trim();

  // Avoid duplicate brand suffix if already included
  if (trimmed.toLowerCase().includes(SITE_CONFIG.name.toLowerCase())) {
    return trimmed;
  }

  return template.replace('%s', trimmed);
}

/**
 * Determines whether a route is an authenticated, internal, or non-content utility screen.
 *
 * @param {string} pathname
 * @returns {boolean} True if the screen must be blocked from indexing
 */
export function isRestrictedRoute(pathname = '/') {
  const cleanPath = pathname.split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';

  if (ROUTE_REGISTRY.RESTRICTED_APP_SCREENS.some((restricted) => cleanPath === restricted || cleanPath.startsWith(`${restricted}/`))) {
    return true;
  }

  return false;
}

/**
 * Resolves the appropriate robots meta directive for a given path.
 *
 * @param {string} pathname
 * @param {boolean} [explicitNoindex=false]
 * @returns {string} Robots directive string
 */
export function resolveRobotsDirective(pathname = '/', explicitNoindex = false) {
  if (explicitNoindex || isRestrictedRoute(pathname)) {
    return ROBOTS_DIRECTIVES.NOINDEX_NOFOLLOW;
  }
  return ROBOTS_DIRECTIVES.INDEX_FOLLOW;
}

/**
 * Generates hreflang alternate links for international and bilingual SEO.
 *
 * @param {string} pathname
 * @param {string} [baseUrl=SITE_CONFIG.baseUrl]
 * @returns {Array<{ rel: string, hreflang: string, href: string }>}
 */
export function generateHreflangAlternates(pathname = '/', baseUrl = SITE_CONFIG.baseUrl) {
  const canonical = resolveCanonicalUrl(pathname, baseUrl);

  const alternates = SITE_CONFIG.supportedLanguages.map((lang) => ({
    rel: 'alternate',
    hreflang: lang.hreflang,
    href: canonical, // Single-domain responsive app serving localized views
  }));

  // Standard x-default fallback
  alternates.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: canonical,
  });

  return alternates;
}

/**
 * Complete Metadata Factory
 * Generates full OpenGraph, Twitter, canonical, and crawler headers for any route.
 *
 * @param {Object} options
 * @param {string} [options.title] - Page title
 * @param {string} [options.description] - Meta description
 * @param {string} [options.pathname] - Current route pathname
 * @param {string} [options.image] - Social card image URL
 * @param {string} [options.type='website'] - OpenGraph type ('website' | 'article')
 * @param {string} [options.publishedTime] - ISO publish timestamp for articles
 * @param {string} [options.modifiedTime] - ISO modification timestamp
 * @param {string} [options.author] - Author name for articles
 * @param {string} [options.section] - Editorial category/section
 * @param {Array<string>} [options.keywords] - Keywords / tags
 * @param {boolean} [options.noindex=false] - Explicit noindex flag
 * @returns {Object} Complete structured metadata definitions
 */
export function buildMetadata({
  title,
  description = SITE_CONFIG.defaultDescription,
  pathname = '/',
  image = SITE_CONFIG.defaultOgImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'AfterMa Clinical Team',
  section = 'Postpartum Health',
  keywords = ['postpartum recovery', 'fourth trimester', 'maternal wellness', 'pelvic health', 'maternal nutrition'],
  noindex = false,
} = {}) {
  const canonicalUrl = resolveCanonicalUrl(pathname);
  const formattedTitle = generatePageTitle(title);
  const robotsDirective = resolveRobotsDirective(pathname, noindex);
  const hreflangLinks = generateHreflangAlternates(pathname);

  // Absolute image URL guarantee
  const absoluteImage = image.startsWith('http') ? image : `${SITE_CONFIG.baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;

  const metaTags = [
    { name: 'description', content: description },
    { name: 'robots', content: robotsDirective },
    { name: 'googlebot', content: robotsDirective },
    { name: 'keywords', content: keywords.join(', ') },
    { name: 'theme-color', content: SITE_CONFIG.themeColor },
    { name: 'author', content: author },

    // OpenGraph
    { property: 'og:site_name', content: SITE_CONFIG.name },
    { property: 'og:title', content: formattedTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: type },
    { property: 'og:image', content: absoluteImage },
    { property: 'og:image:alt', content: formattedTitle },
    { property: 'og:locale', content: SITE_CONFIG.locale },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: SITE_CONFIG.twitterHandle },
    { name: 'twitter:creator', content: SITE_CONFIG.twitterHandle },
    { name: 'twitter:title', content: formattedTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteImage },
  ];

  // Article-specific OpenGraph enhancements
  if (type === 'article') {
    if (publishedTime) metaTags.push({ property: 'article:published_time', content: publishedTime });
    if (modifiedTime) metaTags.push({ property: 'article:modified_time', content: modifiedTime });
    if (author) metaTags.push({ property: 'article:author', content: author });
    if (section) metaTags.push({ property: 'article:section', content: section });
    keywords.forEach((tag) => metaTags.push({ property: 'article:tag', content: tag }));
  }

  const linkTags = [
    { rel: 'canonical', href: canonicalUrl },
    ...hreflangLinks,
  ];

  return {
    title: formattedTitle,
    canonicalUrl,
    robotsDirective,
    metaTags,
    linkTags,
  };
}
