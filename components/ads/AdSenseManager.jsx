import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
export const isAdEligiblePath = (pathname) => {
  if (!pathname) return false;
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';

  // Deep-dive article and recipe editorial content
  if (cleanPath.startsWith('/learning-center/')) {
    return true;
  }

  return CONTENT_ROUTES.includes(cleanPath);
};

/**
 * Route-Aware AdSense Manager
 * Dynamically controls the AdSense script tag and suppresses ad delivery
 * on non-content, utility, alert, or authenticated account screens.
 */
const AdSenseManager = ({ client = 'ca-pub-4318712038607459' }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isEligible = isAdEligiblePath(currentPath);

  useEffect(() => {
    // If not eligible (e.g. on /dashboard, /signin, /mood-check, /care-journey/session, etc.)
    // actively suppress ad requests so Google Auto-Ads does not scan or inject ads.
    if (!isEligible) {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          window.adsbygoogle.pauseAdRequests = 1;
        } catch {
          // ignore
        }
      }
      return;
    }

    // On eligible content routes, unpause ad requests
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.pauseAdRequests = 0;
      } catch {
        // ignore
      }
    }

    // Only inject the script tag if client is configured and on an eligible route
    const scriptId = 'google-adsense-script';
    let scriptTag = document.getElementById(scriptId);

    if (!scriptTag && client && !client.includes('XXXXX')) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.async = true;
      scriptTag.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      scriptTag.crossOrigin = 'anonymous';
      document.head.appendChild(scriptTag);
    }
  }, [currentPath, isEligible, client]);

  return null;
};

export default AdSenseManager;
