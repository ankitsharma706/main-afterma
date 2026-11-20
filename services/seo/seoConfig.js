/**
 * @file services/seo/seoConfig.js
 * @description Enterprise SEO master configuration, site defaults, and route governance.
 */

export const SITE_CONFIG = {
  name: 'AfterMa',
  legalName: 'AfterMa Maternal Health Technologies Private Limited',
  domain: 'afterma.online',
  baseUrl: 'https://afterma.online',
  defaultTitle: 'AfterMa | Postpartum Recovery & Maternal Wellness',
  titleTemplate: '%s | AfterMa',
  defaultDescription:
    'Clinically guided postpartum recovery platform. Access Fourth Trimester rehabilitation milestones, restorative maternal nutrition recipes, and expert-reviewed care.',
  themeColor: '#EC4899',
  defaultOgImage: 'https://afterma.online/AfterMaAppPics.png',
  logoUrl: 'https://afterma.online/aftermalogonew.png',
  twitterHandle: '@afterma_care',
  locale: 'en_US',
  supportedLanguages: [
    { code: 'en', hreflang: 'en', name: 'English', pathPrefix: '' },
    { code: 'hi', hreflang: 'hi', name: 'Hindi', pathPrefix: '/hi' },
  ],
  contact: {
    email: 'hello@afterma.care',
    privacyEmail: 'privacy@afterma.care',
    clinicalEmail: 'clinical@afterma.care',
    phone: '+91-1800-599-0019',
    country: 'IN',
  },
  socialProfiles: [
    'https://instagram.com/afterma.care',
    'https://youtube.com/@AfterMaChannel',
    'https://linkedin.com/company/afterma-care',
  ],
  organizationType: 'MedicalOrganization',
  medicalSpecialty: 'ObstetricAndGynecologic',
};

/**
 * Default Robots Directives
 */
export const ROBOTS_DIRECTIVES = {
  INDEX_FOLLOW: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  NOINDEX_NOFOLLOW: 'noindex, nofollow, noarchive, nosnippet',
  NOINDEX_FOLLOW: 'noindex, follow',
};

/**
 * Route Classification Registry
 * Governs indexability, ad-eligibility, and canonical handling.
 */
export const ROUTE_REGISTRY = {
  // Public Editorial & Marketing Pages (Fully Indexable + Ad-Eligible where appropriate)
  PUBLIC_CONTENT: [
    '/',
    '/education',
    '/recipes',
    '/community-wisdom',
    '/about',
    '/about-us',
    '/contact',
    '/support',
    '/privacy-policy',
    '/privacy',
    '/terms-of-service',
    '/terms',
    '/disclaimer',
    '/medical-disclaimer',
  ],

  // Dynamic Content Route Prefixes
  DYNAMIC_PUBLIC_PREFIXES: [
    '/learning-center/',
  ],

  // Private / Authenticated / Interactive Screens (STRICT NOINDEX, NO ADS)
  RESTRICTED_APP_SCREENS: [
    '/signin',
    '/dashboard',
    '/carejourney',
    '/care-journey/session',
    '/mood-check',
    '/healthlogs',
    '/lactationlogs',
    '/healthsummary',
    '/mentalwellness',
    '/momkart',
    '/momkart-cart',
    '/momkart-payment',
    '/aftermaplus',
    '/settings',
    '/careconnect',
    '/caregiver',
    '/expert-dashboard',
    '/expert-analytics',
    '/expert-settings',
  ],
};
