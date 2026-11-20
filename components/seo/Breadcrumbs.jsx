/**
 * @file components/seo/Breadcrumbs.jsx
 * @description Accessible semantic Breadcrumb navigation with synchronized Schema.org BreadcrumbList JSON-LD.
 */

import { ChevronRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildBreadcrumbSchema } from '../../services/seo/schemaBuilder';
import JsonLd from './JsonLd';

/**
 * Breadcrumbs Component
 *
 * @param {Object} props
 * @param {Array<{ name: string, path?: string }>} props.items - Hierarchical breadcrumb items
 * @param {string} [props.className=''] - Custom styling
 * @returns {JSX.Element|null}
 */
const Breadcrumbs = ({ items = [], className = '' }) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  // Generate synchronized Schema.org structured data
  const breadcrumbSchema = buildBreadcrumbSchema(items);

  return (
    <>
      {/* Synchronized JSON-LD Schema */}
      {breadcrumbSchema && <JsonLd schema={breadcrumbSchema} />}

      {/* Accessible Semantic HTML5 Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs md:text-sm text-slate-500 font-medium py-2.5 overflow-x-auto scrollbar-hide ${className}`}
      >
        <ol className="flex items-center gap-1.5 whitespace-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li key={`bc-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight size={14} className="text-slate-300 shrink-0" aria-hidden="true" />
                )}

                {isLast || !item.path ? (
                  <span
                    aria-current="page"
                    className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-xs"
                  >
                    {item.name}
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-1 hover:text-pink-600 transition-colors cursor-pointer"
                  >
                    {isFirst && <Home size={14} className="shrink-0" />}
                    <span>{item.name}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
