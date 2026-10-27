/**
 * @file components/seo/JsonLd.jsx
 * @description Safe Schema.org JSON-LD structured data renderer with XSS sanitization.
 */

import { useId } from 'react';
import { sanitizeJsonLd } from '../../services/seo/schemaBuilder';

/**
 * JsonLd Component
 * Injects a sanitized JSON-LD structured data script into the document.
 *
 * @param {Object} props
 * @param {Object|Array} props.schema - Valid Schema.org structured data object or array of objects
 * @returns {JSX.Element|null}
 */
const JsonLd = ({ schema }) => {
  const scriptId = useId();

  if (!schema) return null;

  const sanitizedJson = sanitizeJsonLd(schema);

  return (
    <script
      id={`jsonld-${scriptId}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedJson }}
    />
  );
};

export default JsonLd;
