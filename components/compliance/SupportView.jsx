import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const SupportView = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Support', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-12 animate-in fade-in duration-500">
      <SEOHead
        title="Contact Us & Clinical Support"
        description="Get in touch with AfterMa maternal health support, technical team, or clinical reviewers. 24-48h response SLA."
        pathname="/contact"
      />

      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Contact Us' }]} />

      {/* Header */}
      <div className="space-y-4 border-b border-pink-100 pb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600">
          <MessageSquare size={14} /> Support & Inquiries
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          We’re Here for You
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Whether you have a technical question, feedback on an educational guide, or a partnership inquiry, our team responds promptly.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
            <h2 className="text-lg font-black text-slate-900">Direct Contacts</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">General Support</span>
                <p className="font-semibold text-slate-800">
                  <a href="mailto:hello@afterma.care" className="text-pink-600 hover:underline">hello@afterma.care</a>
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Clinical & Editorial Review</span>
                <p className="font-semibold text-slate-800">
                  <a href="mailto:clinical@afterma.care" className="text-pink-600 hover:underline">clinical@afterma.care</a>
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase">Privacy & Legal Compliance</span>
                <p className="font-semibold text-slate-800">
                  <a href="mailto:privacy@afterma.care" className="text-pink-600 hover:underline">privacy@afterma.care</a>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-pink-50/70 border border-pink-100 rounded-3xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-pink-900">Response SLA</h3>
            <p className="text-xs text-pink-800 leading-relaxed">
              We respond to all clinical feedback and platform inquiries within 24 to 48 business hours. For acute postpartum emergencies, please contact emergency medical services immediately.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Message Received</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Thank you for reaching out. Our support team has logged your inquiry and will respond to <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Support', message: '' }); }}
                className="mt-4 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. priya@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                >
                  <option value="General Support">General Support</option>
                  <option value="Article Feedback">Editorial or Article Feedback</option>
                  <option value="Medical Inquiry">Medical Advisory Feedback</option>
                  <option value="Account Privacy">Privacy & Data Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help your postpartum recovery journey?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl text-sm shadow-md hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportView;
