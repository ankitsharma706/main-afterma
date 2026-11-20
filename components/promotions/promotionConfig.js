/**
 * Whitelist of genuine, content-rich editorial routes where Google Ads are permitted.
 * In compliance with Google AdSense "Valuable Inventory" policy:
 * Ads are STRICTLY PROHIBITED on:
 * - Authentication / Login / Sign-up screens
 * - Dashboard / Account / Profile / Settings screens
 * - Interactive tools, workout sessions, mood quizzes, games
 * - Error / 404 / Under-construction pages
 * - Alert overlays, modals, and checkout / payment screens
 */
export const CONTENT_ROUTES = [
  '/',
  '/education',
  '/recipes',
  '/community-wisdom',
  '/privacy-policy',
  '/privacy',
  '/terms-of-service',
  '/terms',
  '/about',
  '/about-us',
  '/contact',
  '/support',
  '/disclaimer',
  '/medical-disclaimer',
];

/**
 * Checks whether the current path is an approved editorial publisher-content route.
 * @param {string} pathname - e.g. "/education", "/learning-center/article-csection-care"
 * @returns {boolean}
 */
export const isPromotionEligiblePath = (pathname) => {
  if (!pathname) return false;
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

  // Deep-dive article and recipe editorial content
  if (cleanPath.startsWith('/learning-center/')) {
    return true;
  }

  return CONTENT_ROUTES.includes(cleanPath);
};
