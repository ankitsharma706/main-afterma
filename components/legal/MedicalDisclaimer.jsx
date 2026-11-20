import { AlertCircle, PhoneCall, HeartHandshake, ShieldAlert } from 'lucide-react';
import { HELPLINES } from '../../constants';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const MedicalDisclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10 animate-in fade-in duration-500">
      <SEOHead
        title="Clinical & Medical Disclaimer"
        description="Important safety guidelines: AfterMa provides supportive wellness guidance and is not a substitute for clinical diagnosis or emergency obstetrics."
        pathname="/disclaimer"
      />

      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Medical Disclaimer' }]} />

      {/* Header */}
      <div className="space-y-4 border-b border-rose-100 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
          <ShieldAlert size={14} /> Clinical & Safety Notice
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Medical Disclaimer
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium">
          Essential health and safety guidelines for every mother, family member, and reader.
        </p>
      </div>

      {/* Emergency Alert Callout */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-3xl p-6 md:p-8 space-y-4 shadow-lg shadow-pink-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-2xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black">Experiencing a Postpartum Medical Emergency?</h2>
            <p className="text-xs text-rose-100 font-medium">Do not rely on online articles or web platforms during acute crises.</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-rose-50">
          If you or someone in your care experiences heavy vaginal bleeding (soaking more than one pad per hour), severe headaches with visual changes, sudden chest pain or shortness of breath, high fever above 100.4°F (38°C), or thoughts of self-harm or harming your baby:
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="tel:112"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-rose-600 rounded-full font-black text-sm shadow-md hover:bg-rose-50 transition-all"
          >
            <PhoneCall size={16} /> Dial Emergency: 112
          </a>
          <div className="text-xs font-bold text-white/90">
            {HELPLINES.india.name}: <a href={`tel:${HELPLINES.india.number}`} className="underline">{HELPLINES.india.number}</a> ({HELPLINES.india.label})
          </div>
        </div>
      </div>

      {/* Structured Guidance */}
      <div className="space-y-8 text-slate-600 leading-relaxed text-sm md:text-base">
        
        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">1. Not Medical Advice</h2>
          <p>
            The content provided on AfterMa — including all recovery milestone schedules, nutritional recipes, pelvic floor exercise guides, peer Q&A answers, and mental wellness articles — is for <strong>general educational and supportive informational purposes only</strong>.
          </p>
          <p>
            None of the content should be considered, construed, or utilized as medical advice, clinical diagnosis, or a prescribed course of obstetrical or gynecological treatment.
          </p>
        </section>

        <section className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-6">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HeartHandshake size={18} className="text-emerald-500" /> 2. Physician-Patient Relationship
          </h2>
          <p>
            Your interaction with AfterMa, including any automated logging or triage suggestions, does not establish a doctor-patient relationship. Always consult your primary obstetrician, gynecologist, licensed physical therapist, or mental health clinician before initiating any physical exercise program or making significant dietary modifications during pregnancy and postpartum recovery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-slate-900">3. Individual Variation</h2>
          <p>
            Every mother's delivery (spontaneous vaginal, assisted, or surgical cesarean section) and recovery journey is biologically unique. Complications such as pre-eclampsia, gestational diabetes, surgical wound dehiscence, or postpartum hemorrhage require personalized, in-person clinical supervision. Never delay or disregard professional clinical advice because of information you read on AfterMa.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-black text-slate-900">4. Editorial & Clinical Review Standards</h2>
          <p>
            All educational articles in our Learning Center are written with reference to established guidelines (such as ACOG, WHO, and FOGSI) and reviewed by certified medical specialists. For editorial inquiries or clinical feedback, contact <a href="mailto:clinical@afterma.care" className="text-pink-600 font-bold">clinical@afterma.care</a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default MedicalDisclaimer;
