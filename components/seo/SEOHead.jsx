/**
 * @file components/seo/SEOHead.jsx
 * @description Dynamic Head & Meta manager for canonical URLs, OpenGraph, Twitter, and hreflang.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { buildMetadata } from '../../services/seo/metadataEngine';
import { injectResourceHints } from '../../services/seo/resourceHints';
import JsonLd from './JsonLd';

/**
 * Helper to update or create an HTML <meta> tag by name or property.
 */
function updateMetaTag(key, value, attribute = 'name') {
  if (typeof document === 'undefined') return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', value);
}

/**
 * Helper to update or create an HTML <link> tag.
 */
function updateLinkTag(rel, href, extraAttributes = {}) {
  if (typeof document === 'undefined') return;

  let selector = `link[rel="${rel}"]`;
  if (extraAttributes.hreflang) {
    selector += `[hreflang="${extraAttributes.hreflang}"]`;
  }

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    Object.entries(extraAttributes).forEach(([k, v]) => element.setAttribute(k, v));
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * SEOHead Component
 * Declarative component for dynamic per-route SEO metadata management.
 *
 * @param {Object} props
 * @param {string} [props.title] - Page title
 * @param {string} [props.description] - Meta description
 * @param {string} [props.pathname] - Optional pathname override (defaults to current route)
 * @param {string} [props.image] - Hero image URL for OpenGraph and Twitter
 * @param {'website'|'article'} [props.type='website'] - OpenGraph content type
 * @param {string} [props.publishedTime] - Article published timestamp (ISO 8601)
 * @param {string} [props.modifiedTime] - Article modified timestamp (ISO 8601)
 * @param {string} [props.author] - Author name or medical reviewer
 * @param {string} [props.section] - Editorial section name
 * @param {Array<string>} [props.keywords] - Keywords / tags
 * @param {boolean} [props.noindex=false] - Explicit noindex flag
 * @param {Array<Object>} [props.schemas=[]] - Schema.org structured data objects
 * @returns {JSX.Element}
 */
const SEOHead = ({
  title,
  description,
  pathname,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  keywords,
  noindex = false,
  schemas = [],
}) => {
  const location = useLocation();
  const currentPath = pathname || location.pathname;

  useEffect(() => {
    // 1. Inject resource hints for Core Web Vitals optimization
    injectResourceHints();

    // 2. Generate resolved metadata
    const metadata = buildMetadata({
      title,
      description,
      pathname: currentPath,
      image,
      type,
      publishedTime,
      modifiedTime,
      author,
      section,
      keywords,
      noindex,
    });

    // 3. Update document title
    document.title = metadata.title;

    // 4. Update standard & OpenGraph meta tags
    metadata.metaTags.forEach((tag) => {
      if (tag.name) {
        updateMetaTag(tag.name, tag.content, 'name');
      } else if (tag.property) {
        updateMetaTag(tag.property, tag.content, 'property');
      }
    });

    // 5. Update canonical & hreflang link tags
    metadata.linkTags.forEach((link) => {
      const { rel, href, ...rest } = link;
      updateLinkTag(rel, href, rest);
    });
  }, [
    title,
    description,
    currentPath,
    image,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    keywords,
    noindex,
  ]);

  return (
    <>
      {schemas &&
        schemas.map((schema, index) => (
          <JsonLd key={`schema-${index}`} schema={schema} />
        ))}
    </>
  );
};

export default SEOHead;
