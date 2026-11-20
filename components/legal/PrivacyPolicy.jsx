import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const PrivacyPolicy = () => {
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
        <p className="text-slate-600 text-sm leading-relaxed">
          AfterMa ("we", "our", or "us") operates the postpartum recovery and wellness platform. This Privacy Policy informs you of our policies regarding the collection, use, disclosure, and protection of personal data when you use our service, as well as your choices regarding that data.
        </p>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-8 text-slate-600 leading-relaxed text-sm md:text-base">
        
        {/* Section 1: Google AdSense & Third-Party Advertising Disclosures */}
        <section className="space-y-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Eye size={18} className="text-pink-500" /> 1. Advertising & Google AdSense Disclosures
          </h2>
          <p>
            We partner with third-party advertising partners, including <strong>Google AdSense</strong>, to display advertisements on designated editorial content pages of our website. Please review the following disclosures regarding how Google and third-party vendors use data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-medium">
            <li>
              <strong>Third-Party Vendors & Cookies:</strong> Third-party vendors, including Google, use cookies (such as the DoubleClick DART cookie) to serve ads based on a user’s prior visits to AfterMa or other websites on the Internet.
            </li>
            <li>
              <strong>Personalized Advertising:</strong> Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites across the World Wide Web.
            </li>
            <li>
              <strong>Opt-Out of Personalized Ads:</strong> Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-pink-600 underline font-bold">Google Ads Settings</a>. Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer" className="text-pink-600 underline font-bold">AboutAds.info</a>.
            </li>
            <li>
              <strong>Sensitive Health Data Exemption:</strong> In accordance with Google Publisher Policies, personalized advertising is never targeted based on sensitive personal health categories. Your private health logs, lactation records, and emotional check-in entries are never shared with advertising networks.
            </li>
          </ul>
        </section>

        {/* Section 2: Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">2. Information We Collect</h2>
          <p>We collect several different types of information for various purposes to provide and improve our service to you:</p>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">A. Voluntary Profile Information</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When you create an account, you may provide your name, email address, delivery date, delivery type (vaginal/cesarean), and maternity stage to personalize recovery recommendations.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">B. Log & Device Data</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We automatically record standard browser headers, IP addresses, browser types, referring pages, and access timestamps to ensure platform stability and security.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Use of Data */}
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">3. How We Use Your Information</h2>
          <p>AfterMa uses collected data for specific, lawful purposes:</p>
          <ul className="space-y-2">
            {[
              "To customize postpartum recovery timelines and gentle physical therapy prompts.",
              "To maintain platform security, prevent unauthorized access, and troubleshoot technical errors.",
              "To deliver non-sensitive editorial and educational guides relevant to maternal wellness.",
              "To facilitate emergency caregiver and SOS notifications if activated by the user."
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 mt-1 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4: GDPR & CCPA Rights */}
        <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-black text-slate-900">4. Your Data Protection Rights (GDPR / CCPA / CPRA)</h2>
          <p>
            Depending on your jurisdiction, you have statutory rights concerning your personal data:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Right of Access:</strong> You can request a copy of all personal records associated with your account.</li>
            <li><strong>Right to Rectification:</strong> You may update or correct inaccurate details at any time in your Settings.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You can request permanent deletion of your profile and data logs.</li>
            <li><strong>Right to Restrict or Object to Processing:</strong> You have the right to limit how your data is utilized.</li>
          </ul>
        </section>

        {/* Section 5: Contact Information */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-black text-slate-900">5. Grievance Officer & Contact Details</h2>
          <p>
            If you have questions or concerns regarding this Privacy Policy or wish to exercise your legal data rights, please contact our Data Protection Officer:
          </p>
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 text-sm font-medium">
            <p><strong>Entity:</strong> AfterMa Maternal Health Technologies</p>
            <p><strong>Email:</strong> <a href="mailto:privacy@afterma.care" className="text-pink-600 font-bold">privacy@afterma.care</a></p>
            <p><strong>Response SLA:</strong> Within 48 business hours</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
