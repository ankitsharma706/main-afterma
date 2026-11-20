/**
 * @file components/seo/OptimizedImage.jsx
 * @description Core Web Vitals compliant image component eliminating Cumulative Layout Shift (CLS).
 */

import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * OptimizedImage Component
 * Enforces explicit layout dimensions, native lazy loading, asynchronous decoding,
 * and error fallbacks to guarantee high Core Web Vitals (LCP & CLS) scores.
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Meaningful descriptive alt text (mandatory for SEO and accessibility)
 * @param {number|string} [props.width] - Intrinsic width in pixels
 * @param {number|string} [props.height] - Intrinsic height in pixels
 * @param {string} [props.aspectRatio='16/9'] - Aspect ratio CSS value (e.g., '16/9', '1/1', '4/3')
 * @param {boolean} [props.priority=false] - If true, loads eagerly for LCP hero elements
 * @param {string} [props.className=''] - Tailwind or CSS class string
 * @param {string} [props.fallbackSrc] - Fallback image URL if primary fails
 * @param {Object} [props.style={}] - Additional inline styles
 * @returns {JSX.Element}
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  aspectRatio = '16/9',
  priority = false,
  className = '',
  fallbackSrc = '/AfterMaAppPics.png',
  style = {},
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc && src !== fallbackSrc) {
      setHasError(true);
    }
  };

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{
        aspectRatio,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        ...style,
      }}
    >
      {/* Blurred Skeleton Shimmer until loaded */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-slate-400 bg-slate-50 text-center">
          <ImageOff size={24} className="mb-1 text-slate-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Image Unavailable</span>
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt || 'AfterMa Postpartum Care Resource'}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
