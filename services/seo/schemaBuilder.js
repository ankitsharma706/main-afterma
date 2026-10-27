/**
 * @file services/seo/schemaBuilder.js
 * @description Strongly typed Schema.org JSON-LD builders and sanitizers.
 */

import { SITE_CONFIG } from './seoConfig.js';

/**
 * Escapes unsafe characters in JSON strings to prevent XSS vulnerabilities
 * inside inline <script type="application/ld+json"> blocks.
 *
 * @param {Object|Array} schemaData - Raw schema object
 * @returns {string} Sanitized JSON-LD string
 */
export function sanitizeJsonLd(schemaData) {
  if (!schemaData) return '';
  const jsonString = JSON.stringify(schemaData);

  // Escape HTML-sensitive characters and JS line terminators
  return jsonString
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Builds Schema.org Organization structured data.
 * @returns {Object} Schema.org Organization object
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': SITE_CONFIG.organizationType,
    '@id': `${SITE_CONFIG.baseUrl}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.baseUrl,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_CONFIG.baseUrl}/#logo`,
      url: SITE_CONFIG.logoUrl,
      caption: SITE_CONFIG.name,
    },
    image: SITE_CONFIG.defaultOgImage,
    sameAs: SITE_CONFIG.socialProfiles,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.phone,
        contactType: 'customer support',
        email: SITE_CONFIG.contact.email,
        areaServed: 'Worldwide',
        availableLanguage: ['en', 'hi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.contact.phone,
        contactType: 'emergency',
        email: SITE_CONFIG.contact.clinicalEmail,
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
  };
}

/**
 * Builds Schema.org WebSite structured data with SearchAction potential.
 * @returns {Object} Schema.org WebSite object
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.baseUrl}/#website`,
    url: SITE_CONFIG.baseUrl,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      '@id': `${SITE_CONFIG.baseUrl}/#organization`,
    },
    inLanguage: ['en', 'hi'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.baseUrl}/education?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Builds Schema.org WebApplication structured data.
 * @returns {Object} Schema.org WebApplication object
 */
export function buildWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_CONFIG.baseUrl}/#webapp`,
    name: `${SITE_CONFIG.name} — Postpartum Care Platform`,
    url: SITE_CONFIG.baseUrl,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All modern web browsers',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: SITE_CONFIG.defaultDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    author: {
      '@id': `${SITE_CONFIG.baseUrl}/#organization`,
    },
  };
}

/**
 * Builds Schema.org Article / MedicalWebPage structured data.
 *
 * @param {Object} article
 * @param {string} article.title - Article title
 * @param {string} article.summary - Summary or excerpt
 * @param {string} article.url - Canonical URL of article
 * @param {string} [article.image] - Hero image URL
 * @param {string} [article.author] - Author or verifying expert name
 * @param {string} [article.category] - Article section or category
 * @param {string} [article.publishedTime] - ISO date published
 * @param {string} [article.modifiedTime] - ISO date modified
 * @returns {Object} Schema.org MedicalWebPage & Article object
 */
export function buildArticleSchema({
  title,
  summary,
  url,
  image = SITE_CONFIG.defaultOgImage,
  author = 'Dr. Meera Sharma, OB-GYN',
  category = 'Postpartum Care',
  publishedTime = '2026-01-15T08:00:00+05:30',
  modifiedTime = '2026-10-28T00:00:00+05:30',
}) {
  const absoluteImage = image.startsWith('http') ? image : `${SITE_CONFIG.baseUrl}${image.startsWith('/') ? '' : '/'}${image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    headline: title,
    description: summary,
    inLanguage: 'en',
    isPartOf: {
      '@id': `${SITE_CONFIG.baseUrl}/#website`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteImage,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: author,
      jobTitle: 'Medical Contributor & Reviewer',
      worksFor: {
        '@id': `${SITE_CONFIG.baseUrl}/#organization`,
      },
    },
    publisher: {
      '@id': `${SITE_CONFIG.baseUrl}/#organization`,
    },
    about: {
      '@type': 'MedicalCondition',
      name: 'Postpartum Recovery and Care',
      possibleTreatment: [
        {
          '@type': 'MedicalTherapy',
          name: 'Pelvic Floor Physical Therapy',
        },
        {
          '@type': 'DietarySupplement',
          name: 'Postpartum Maternal Nutrition',
        },
      ],
    },
    medicalAudience: {
      '@type': 'MedicalAudience',
      audienceType: 'Postpartum Mothers, Expecting Mothers, and Caregivers',
    },
    articleSection: category,
  };
}

/**
 * Builds Schema.org BreadcrumbList structured data.
 *
 * @param {Array<{ name: string, path: string }>} items - Hierarchical breadcrumb items
 * @returns {Object} Schema.org BreadcrumbList object
 */
export function buildBreadcrumbSchema(items = []) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const itemListElement = items.map((item, index) => {
    let itemUrl = '';
    if (item?.path) {
      itemUrl = item.path.startsWith('http')
        ? item.path
        : `${SITE_CONFIG.baseUrl}${item.path.startsWith('/') ? '' : '/'}${item.path}`;
    } else if (typeof window !== 'undefined' && window.location?.href) {
      itemUrl = window.location.href;
    } else {
      itemUrl = SITE_CONFIG.baseUrl;
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item?.name || `Step ${index + 1}`,
      item: itemUrl,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Builds Schema.org FAQPage structured data.
 *
 * @param {Array<{ question: string, answer: string }>} faqs - Array of Q&A items
 * @returns {Object} Schema.org FAQPage object
 */
export function buildFaqSchema(faqs = []) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
