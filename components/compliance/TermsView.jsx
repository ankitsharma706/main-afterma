import { FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const TermsView = () => {
  const lastUpdated = "October 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10 animate-in fade-in duration-500">
      <SEOHead
        title="Terms of Service & Platform Guidelines"
        description="Review terms of use, limitation of liability, and platform standards for AfterMa maternal care."
        pathname="/terms-of-service"
      />

      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Terms of Service' }]} />

      {/* Header */}
      <div className="space-y-4 border-b border-pink-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600">
          <FileText size={14} /> Legal Agreement
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Last Updated: {lastUpdated} • Governing terms for all visitors, registered users, and care partners.
        </p>
      </div>

      <div className="space-y-8 text-slate-600 leading-relaxed text-sm md:text-base">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AfterMa ("Service", "Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue use of the platform immediately.
          </p>
        </section>

        {/* Section 2: Medical Disclaimer Notice */}
        <section className="space-y-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-amber-900 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600" /> 2. Important Medical Disclaimer
          </h2>
          <p className="text-amber-950 font-medium">
            AfterMa provides wellness tracking, educational articles, peer experiences, and recovery milestone planning. <strong>AfterMa is NOT a medical provider, diagnostic tool, or emergency healthcare service.</strong>
          </p>
          <p className="text-amber-900 text-sm">
            Content found on this platform is for educational and wellness informational purposes only. It should never be used as a substitute for professional clinical diagnosis, obstetrical care, or gynecological treatment. Always seek the advice of your physician or qualified obstetric healthcare provider with any questions regarding postpartum complications, infection, severe hemorrhaging, or acute postpartum depression.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">3. User Accounts and Security</h2>
          <p>
            When creating an account on AfterMa, you represent that you are at least 18 years of age. You are responsible for safeguarding your login credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use or security breach.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">4. Intellectual Property & Editorial Content</h2>
          <p>
            All original articles, recovery databases, wellness recipes, UI illustrations, and brand assets on AfterMa are the exclusive intellectual property of AfterMa and its medical contributors. You may not reproduce, redistribute, or commercially exploit any content without express written consent.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, AfterMa and its directors, employees, or medical contributors shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of or inability to use the platform.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-black text-slate-900">6. Governing Law & Contact</h2>
          <p>
            These Terms shall be governed and construed in accordance with applicable laws. Inquiries concerning these terms may be directed to <a href="mailto:legal@afterma.care" className="text-pink-600 font-bold">legal@afterma.care</a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsView;
