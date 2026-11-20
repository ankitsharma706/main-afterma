import { Heart, Award, Sparkles, Stethoscope, Users } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const AboutView = () => {
  const clinicalAdvisors = [
    {
      name: "Dr. Meera Sharma",
      role: "Obstetrician & Gynecologist (MBBS, MS - OBG)",
      bio: "Over 14 years of clinical experience specializing in high-risk pregnancies and holistic postpartum pelvic restoration.",
      focus: "Clinical Advisory & Maternal Triage",
      avatarBg: "from-pink-500 to-rose-500"
    },
    {
      name: "Dr. Rohan Mehra",
      role: "Senior Women's Health Physiotherapist (MPT)",
      bio: "Specialist in diastasis recti rehabilitation, core stabilization, and post-surgical cesarean scar recovery.",
      focus: "Physical Recovery Protocols",
      avatarBg: "from-blue-500 to-indigo-500"
    },
    {
      name: "Dr. Kavita Reddy",
      role: "Perinatal Nutritionist & Lactation Consultant (IBCLC)",
      bio: "Dedicated to micro-nutrient optimization, postpartum anemia recovery, and traditional lactation nourishment.",
      focus: "Nutritional Science & Safe Recipes",
      avatarBg: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12 animate-in fade-in duration-500">
      <SEOHead
        title="About Us & Medical Advisory Board"
        description="Meet the clinical advisors, obstetricians, physical therapists, and maternal researchers guiding AfterMa postpartum care."
        pathname="/about"
      />

      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'About Us' }]} />

      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-50 text-pink-600 border border-pink-100">
          <Heart size={14} className="fill-pink-500" /> Dedicated to the Fourth Trimester
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Nurturing Every Mother's Healing Journey
        </h1>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
          AfterMa was founded to bridge the critical gap between hospital discharge and long-term postpartum recovery with evidence-based guidance, empathetic tools, and clinical reassurance.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-pink-100/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xl">
            <Stethoscope size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-900">Clinical Integrity</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every recovery milestone and health article is verified against obstetrical guidelines (WHO, ACOG, FOGSI) by licensed medical practitioners.
          </p>
        </div>

        <div className="bg-white border border-pink-100/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">
            <Users size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-900">Empathetic Care</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Postpartum recovery is deeply emotional. We combine medical rigor with gentleness, community wisdom, and active partner involvement.
          </p>
        </div>

        <div className="bg-white border border-pink-100/80 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            <Sparkles size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-900">Holistic Recovery</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            From pelvic floor physiotherapy to Ayurvedic postpartum soups and emotional triage, we nurture the whole mother.
          </p>
        </div>
      </div>

      {/* Medical Advisory Board (Crucial for AdSense & Google YMYL Authority) */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-wider">
            <Award size={14} /> Clinical Review Board
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Guided by Leading Healthcare Specialists
          </h2>
          <p className="text-slate-500 text-sm">
            Our content is authored, reviewed, and vetted by licensed maternal clinicians to meet rigorous medical publishing standards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {clinicalAdvisors.map((advisor, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${advisor.avatarBg} text-white flex items-center justify-center font-black text-lg shadow-sm`}>
                  {advisor.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{advisor.name}</h3>
                  <p className="text-xs text-pink-600 font-semibold">{advisor.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{advisor.bio}</p>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Review Focus:</span>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{advisor.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AboutView;
