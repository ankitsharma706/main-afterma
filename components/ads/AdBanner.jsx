import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isAdEligiblePath } from './AdSenseManager';

/**
 * AdBanner Component
 * Compliant Google AdSense ad unit wrapper that guarantees:
 * 1. Strict route isolation (will never render on non-content, auth, tool, or alert screens)
 * 2. Mandatory "ADVERTISEMENT" labeling per Google AdSense policies
 * 3. Pre-allocated min-height to eliminate Cumulative Layout Shift (CLS)
 * 4. Error isolation to prevent app-breaking runtime exceptions
 */
const AdBanner = ({
  client = 'ca-pub-4318712038607459',
  slot = '1234567890',
  format = 'auto',
  responsive = 'true',
  className = '',
  minHeight = '100px',
}) => {
  const location = useLocation();
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  // Policy check: Strictly refuse to render on non-content or interactive tool screens
  const isEligible = isAdEligiblePath(location.pathname);

  useEffect(() => {
    if (!isEligible) return;

    // Push ad request only once when mounted on an eligible content route
    if (!pushedRef.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        console.warn('AdSense slot initialization:', err?.message);
      }
    }
  }, [isEligible]);

  if (!isEligible) {
    return null;
  }

  const isDemoClient = !client || client.includes('XXXXX');

  return (
    <div
      className={`my-8 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all ${className}`}
      style={{ minHeight }}
      aria-label="Advertisement Container"
    >
      {/* Mandatory Ad Disclosure Label */}
      <div className="mb-2 w-full text-center">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          Advertisement
        </span>
      </div>

      {isDemoClient ? (
        <div className="flex h-20 w-full max-w-2xl items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/80 p-4 text-center">
          <p className="text-xs font-semibold text-slate-400">
            Ad Space (Editorial Content Only) • Responsive AdSense Slot #{slot}
          </p>
        </div>
      ) : (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      )}
    </div>
  );
};

export default AdBanner;
