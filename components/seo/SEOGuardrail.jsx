/**
 * @file components/seo/SEOGuardrail.jsx
 * @description Route-level verification guardrail strictly enforcing noindex directives and AdSense suppression on non-content screens.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isRestrictedRoute } from '../../services/seo/metadataEngine';

/**
 * SEOGuardrail Component
 * Mounts at the root application level.
 * Dynamically enforces search crawler boundaries and AdSense policy guardrails.
 */
const SEOGuardrail = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const isRestricted = isRestrictedRoute(currentPath);

    if (isRestricted) {
      // 1. Force strict noindex on non-content/utility screens
      let robotsMeta = document.head.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');

      // 2. Suppress Google AdSense Auto-Ads completely on this view
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          window.adsbygoogle.pauseAdRequests = 1;
        } catch (e) {
          // ignore
        }
      }
    } else {
      // On public content pages, ensure ad requests can proceed normally
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          window.adsbygoogle.pauseAdRequests = 0;
        } catch (e) {
          // ignore
        }
      }
    }
  }, [currentPath]);

  return null;
};

export default SEOGuardrail;
