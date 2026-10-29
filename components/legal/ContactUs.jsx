import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const ContactUs = () => {
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-sm">Direct Email</h2>
                <a href="mailto:hello@afterma.care" className="text-xs text-pink-600 font-bold hover:underline">
                  hello@afterma.care
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              For general user questions, technical troubleshooting, and editorial suggestions.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-3">
            <h2 className="font-black text-slate-900 text-sm">Response Time SLA</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our support team reviews inquiries Monday through Saturday. You will receive a personalized response within <strong>24 to 48 hours</strong>.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-2">
            <h2 className="font-black text-emerald-900 text-sm">Emergency Helplines</h2>
            <p className="text-xs text-emerald-700 leading-relaxed">
              If you require immediate psychological or medical emergency assistance, dial <strong>112</strong> or call the 24/7 Kiran Helpline at <strong>1800-599-0019</strong>.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Message Received</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
                Thank you for reaching out, {formData.name}. Our support team will review your message and reply to <span className="font-bold text-slate-700">{formData.email}</span> shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Support', message: '' }); }}
                className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sarah Jenkins"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all bg-white"
                >
                  <option value="General Support">General Support & Question</option>
                  <option value="Editorial Feedback">Editorial & Article Feedback</option>
                  <option value="Privacy Request">Privacy & Data Request</option>
                  <option value="Partnership Inquiry">Clinical Partnership Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm shadow-md hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Send size={16} /> Send Inquiries
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
