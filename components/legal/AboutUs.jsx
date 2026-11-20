import { Heart, Award, Sparkles, Stethoscope, Users } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import Breadcrumbs from '../seo/Breadcrumbs';

const AboutUs = () => {
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

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The postpartum period is often marked by silence, overwhelm, and conflicting advice. Our mission is to provide mothers and caregivers with a single, clinically verified sanctuary that honors physical healing, emotional stabilization, and community support without judgment.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Editorial Standards</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every recovery exercise, nutritional guide, and wellness tip is cross-referenced with modern clinical obstetrics and traditional restorative practices. We prioritize clarity, safety, and source transparency, guaranteeing no speculative or dangerous maternal trends.
          </p>
        </div>
      </div>

      {/* Clinical Advisory Board (E-E-A-T) */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-pink-600">
            <Stethoscope size={14} /> Medical Excellence
          </div>
          <h2 className="text-3xl font-black text-slate-900">Clinical Advisory & Reviewers</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Our content is guided and validated by practicing physicians, physical therapists, and lactation experts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {clinicalAdvisors.map((advisor, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-pink-200 transition-all">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${advisor.avatarBg} text-white font-black text-lg flex items-center justify-center shadow-md`}>
                  {advisor.name.split(' ')[1]?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{advisor.name}</h3>
                  <p className="text-xs font-bold text-pink-600 mt-0.5">{advisor.role}</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {advisor.bio}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-50">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Focus: {advisor.focus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Development & Community Team */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 md:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl">
            <Users size={22} className="text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-black">Built with Care for Mothers Everywhere</h2>
            <p className="text-xs text-slate-400">Engineered by a dedicated maternal health software team.</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
          AfterMa is developed and maintained by a passionate cross-functional team of software engineers, UI/UX designers, and clinical researchers committed to delivering accessible, fast, and secure maternal health tools across the globe.
        </p>
      </div>

    </div>
  );
};

export default AboutUs;
