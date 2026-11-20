import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isPromotionEligiblePath, CONTENT_ROUTES } from './promotionConfig';

export { CONTENT_ROUTES, isPromotionEligiblePath };

/**
 * Route-Aware Promotion / AdSense Manager
 * Dynamically controls the AdSense script tag and suppresses ad delivery
 * on non-content, utility, alert, or authenticated account screens.
 */
const PromotionManager = ({ client = 'ca-pub-4318712038607459' }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isEligible = isPromotionEligiblePath(currentPath);

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

export default PromotionManager;
