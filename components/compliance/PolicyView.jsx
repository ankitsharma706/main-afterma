import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const PolicyView = () => {
  const lastUpdated = "October 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10 animate-in fade-in duration-500">
      <SEOHead
        title="Privacy Policy & Google AdSense Disclosures"
        description="Learn how AfterMa safeguards maternal health records, complies with Google AdSense DART cookie policies, and guarantees privacy."
        pathname="/privacy-policy"
      />

      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Privacy Policy' }]} />

      {/* Header */}
      <div className="space-y-4 border-b border-pink-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600">
          <ShieldCheck size={14} /> Official Policy & Compliance
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Last Updated: {lastUpdated} • Compliant with Google Publisher Policies, GDPR, and Digital Personal Data Protection standards.
        </p>
      </div>

      {/* Overview Notice */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-500 text-white rounded-2xl shadow-sm">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Our Commitment to Maternal Data Protection</h2>
            <p className="text-xs text-slate-500">Your intimate recovery milestones and health queries are treated with the highest tier of confidentiality.</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-700">
          At AfterMa ("we", "our", "us"), we recognize that postpartum health, recovery milestones, and emotional well-being represent deeply sensitive personal information. We do not sell, rent, or trade individual health logs or user profiles to data brokers or advertising exchanges.
        </p>
      </div>

      <div className="space-y-8 text-slate-600 leading-relaxed text-sm md:text-base">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">1. Information We Collect</h2>
          <p>
            We collect only the minimum necessary information required to tailor your postpartum wellness schedule and provide safe evidence-based recommendations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Maternal Profile Data:</strong> Delivery type (vaginal, cesarean), delivery date, recovery milestones, and care preferences.</li>
            <li><strong>Health & Wellness Logs:</strong> Daily hydration, physical symptoms, mood reflections, and lactation timings stored in encrypted client-side storage or secure database partitions.</li>
            <li><strong>Technical Diagnostics:</strong> IP address, browser type, device specifications, and standard server log metrics to maintain platform stability and protect against bot attacks.</li>
          </ul>
        </section>

        {/* Section 2: Google AdSense & Third-Party Cookies (MANDATORY FOR ADSENSE APPROVAL) */}
        <section className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Eye size={18} className="text-pink-600" /> 2. Google AdSense & Third-Party Advertising Disclosures
          </h2>
          <p>
            To support free access to our clinical recovery library and evidence-based maternal health guides, AfterMa partners with Google AdSense and accredited health network advertisers. In accordance with Google Publisher Policies, we disclose the following:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>
              <strong>Third-Party Vendors:</strong> Google, as a third-party vendor, uses cookies to serve ads on AfterMa based on a user's prior visits to our website or other websites on the Internet.
            </li>
            <li>
              <strong>DART Cookies:</strong> Google's use of advertising cookies (including the DoubleClick / DART cookie) enables it and its partners to serve ads to users based on their visit to AfterMa and/or other sites on the Internet.
            </li>
            <li>
              <strong>Cookie Opt-Out:</strong> Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline font-semibold">Ads Settings</a>. Alternatively, you may opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline font-semibold">www.aboutads.info</a>.
            </li>
            <li>
              <strong>Separation of Ads and Clinical Data:</strong> We never transmit individual maternal health metrics, symptom trackers, or lactation logs to Google AdSense or external advertising networks. Advertising algorithms operate independently of your personal health log data.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">3. How We Use Information</h2>
          <p>Collected information is utilized strictly to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Deliver relevant postpartum physical recovery milestones and dietary guides.</li>
            <li>Enable emergency contacts and caregiver sharing when explicitly enabled by you.</li>
            <li>Maintain site integrity, detect fraudulent access, and ensure reliable page loading.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">4. Data Retention & User Rights</h2>
          <p>
            You retain absolute ownership of your maternal health entries. You have the right to request access to your data, demand correction of inaccuracies, or request permanent deletion of your profile and logs at any time.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-black text-slate-900">5. Contact Our Privacy Officer</h2>
          <p>
            If you have questions, privacy inquiries, or data erasure requests regarding this policy, please email our Data Privacy Officer at <a href="mailto:privacy@afterma.care" className="text-pink-600 font-bold">privacy@afterma.care</a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PolicyView;
