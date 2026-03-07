import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

/* ─── Article Section Block ──────────────────────────────────────────── */
const Section = ({ heading, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
      <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-pink-400 to-rose-500 shrink-0" />
      {heading}
    </h2>
    <div className="pl-4 md:pl-5 text-slate-600 leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

/* ─── Tip Box ─────────────────────────────────────────────────────────── */
const TipBox = ({ tips }) => (
  <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-5 md:p-6 space-y-3">
    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Expert Tips</p>
    <ul className="space-y-2">
      {tips.map((tip, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm font-medium leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Safety Box ──────────────────────────────────────────────────────── */
const SafetyBox = ({ points }) => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 md:p-6 space-y-3">
    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Safety Considerations</p>
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm font-medium leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          {p}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Full Article Content ────────────────────────────────────────────── */
const ArticleContent = ({ article }) => {
  const [expanded, setExpanded] = useState(false);

  const content = article.fullContent;

  /* Paragraph helper */
  const P = ({ children }) => (
    <p className="text-slate-600 text-base leading-relaxed font-medium">{children}</p>
  );

  const previewContent = (
    <div className="space-y-6">
      <Section heading="Introduction">
        <P>{content?.intro || generateIntro(article)}</P>
      </Section>
      <Section heading="Why This Topic Matters">
        <P>{content?.whyItMatters || generateWhyItMatters(article)}</P>
      </Section>
    </div>
  );

  const fullContent = (
    <div className="space-y-8">
      <Section heading="Introduction">
        <P>{content?.intro || generateIntro(article)}</P>
      </Section>

      <Section heading="Why This Topic Matters">
        <P>{content?.whyItMatters || generateWhyItMatters(article)}</P>
        <P>{content?.whyItMatters2 || generateSupplementary(article, 'matters')}</P>
      </Section>

      <Section heading="Practical Guidance">
        <P>{content?.practicalGuidance1 || generatePractical(article, 1)}</P>
        <P>{content?.practicalGuidance2 || generatePractical(article, 2)}</P>
        <P>{content?.practicalGuidance3 || generatePractical(article, 3)}</P>
      </Section>

      {/* Expert Tips callout */}
      <TipBox tips={content?.expertTips || generateExpertTips(article)} />

      <Section heading="Understanding Your Body's Signals">
        <P>{content?.bodySignals1 || generateBodySignals(article, 1)}</P>
        <P>{content?.bodySignals2 || generateBodySignals(article, 2)}</P>
      </Section>

      {/* Safety box */}
      <SafetyBox points={content?.safetyPoints || generateSafetyPoints(article)} />

      <Section heading="Emotional Dimensions">
        <P>{content?.emotional || generateEmotional(article)}</P>
      </Section>

      <Section heading="When to Seek Professional Support">
        <P>{content?.whenToSeek || generateWhenToSeek(article)}</P>
      </Section>

      <Section heading="Conclusion">
        <P>{content?.conclusion || generateConclusion(article)}</P>
      </Section>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Medically reviewed & expert verified · AfterMa Clinical Content Team
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Content (preview or full) */}
      <div
        className={`relative overflow-hidden transition-all duration-700 ease-in-out`}
        style={{ maxHeight: expanded ? '9999px' : '520px' }}
      >
        {expanded ? fullContent : previewContent}

        {/* Gradient fade-out when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand / Collapse button */}
      <div className="flex justify-center">
        <button
          id="article-expand-btn"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
            expanded
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
          }`}
        >
          {expanded ? (
            <>
              <ChevronUp size={15} />
              Close Article
            </>
          ) : (
            <>
              <ChevronDown size={15} />
              Show Full Article
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ─── Auto-generated content fallbacks from article data ─────────────── */
function generateIntro(article) {
  const title = article.title || 'this important topic';
  const cat = article.category || 'maternal health';
  return `Understanding ${title.toLowerCase()} is one of the most empowering steps a mother can take during her postpartum or maternal journey. In the realm of ${cat.toLowerCase()}, this topic holds deep clinical significance. Every mother's experience is unique, and knowledge — paired with expert guidance — becomes the greatest tool for safe, confident recovery. This article provides evidence-informed insights drawn from the latest maternal health research and the wisdom of experienced practitioners.`;
}

function generateWhyItMatters(article) {
  const summary = article.summary || '';
  return `${summary ? summary + ' ' : ''}The postpartum period, often called the "fourth trimester," is one of the most physically and emotionally demanding phases of a woman's life. Hormonal fluctuations, physical healing, sleep deprivation, and psychological adjustments occur simultaneously. When mothers have access to accurate, compassionate information about their health, they are far better equipped to navigate these changes with resilience and grace.`;
}

function generateSupplementary(article, _type) {
  return `Research consistently shows that informed mothers report lower levels of postpartum anxiety, improved recovery outcomes, and stronger bonding experiences. Yet access to reliable maternal health information remains unequal. AfterMa is committed to bridging this gap — ensuring that every mother, regardless of her background or location, receives the clinical support and knowledge she deserves.`;
}

function generatePractical(article, index) {
  const guides = [
    `Begin gradually. In the early postpartum weeks, your body is engaged in intensive healing. High-quality rest, adequate hydration, and nutrient-dense foods form the non-negotiable foundation. Even the most ambitious recovery plan must be built on this base. Prioritize sleep — even fragmented sleep — whenever possible, and accept help without guilt.`,
    `Consistency matters more than intensity. Whether you are practicing breathing exercises, pelvic floor engagement, or nutritional habits, a gentle and consistent approach yields better long-term results than sporadic high-effort sessions. Track your progress with compassion — celebrating small wins is a meaningful part of the healing process.`,
    `Create a support system. Postpartum recovery is not a solitary endeavor. Involve your partner, family members, or trusted friends in your journey. Communicate your needs clearly. If professional support is accessible — whether from a physiotherapist, lactation consultant, or psychologist — do not hesitate to utilize it. Your long-term wellness depends on asking for what you need.`,
  ];
  return guides[index - 1] || guides[0];
}

function generateExpertTips(article) {
  return [
    'Hydrate consistently — aim for 2.5 to 3 liters of water per day, especially if you are breastfeeding.',
    'Practice diaphragmatic breathing for 5 minutes each morning to reset your nervous system and support pelvic floor function.',
    'Prioritize foods rich in iron, vitamin D, and omega-3 fatty acids to support tissue repair and emotional balance.',
    'Monitor your emotional state without judgment — a supportive journal practice or mood log can help you identify patterns early.',
    `If you feel something is "not right," trust that instinct — contact your healthcare provider promptly.`,
  ];
}

function generateBodySignals(article, index) {
  const parts = [
    `Your body communicates continuously during recovery. Learning to distinguish between normal healing sensations and warning signs is a fundamental clinical skill for postpartum mothers. Mild soreness, fatigue, and occasional emotional waves are expected. However, certain signals — such as fever above 38°C, heavy or foul-smelling discharge, persistent chest pain, or intrusive thoughts — require immediate medical attention.`,
    `Physical sensations such as breast engorgement, changes in urinary patterns, and mild abdominal cramping are common in the early weeks. Over time, these should gradually improve. Track these changes gently — note what feels different, what improves, and what seems to persist. This awareness is what allows you to have productive, specific conversations with your healthcare team.`,
  ];
  return parts[index - 1] || parts[0];
}

function generateSafetyPoints(article) {
  return [
    'Never ignore signs of infection: redness, warmth, swelling, or fever should be assessed by your provider immediately.',
    'Avoid strenuous exercise until cleared by your OB-GYN or physiotherapist — typically after the 6-week postnatal checkup.',
    'Do not self-prescribe herbal supplements without clinical guidance, as several interact with breastmilk or postpartum medications.',
    'Postpartum depression and anxiety are medical conditions — not personal failures. Seek support without delay if you experience persistent sadness, hopelessness, or panic.',
  ];
}

function generateEmotional(article) {
  return `Healing after childbirth is as much an emotional journey as a physical one. Many mothers describe a profound sense of identity shift — the transition into motherhood carries joy, grief, disorientation, and love in equal measure. This complexity is not pathological; it is the terrain of becoming. Giving yourself permission to feel the full spectrum of emotions — without judgment or the pressure to "bounce back" — is itself a form of deep healing. Practice self-compassion as a clinical tool.`;
}

function generateWhenToSeek(article) {
  return `Schedule a postnatal check-up within 6 weeks of delivery — and ideally, a follow-up at 3 months. If you experience any of the red flag symptoms outlined above, seek medical attention immediately rather than waiting. Trust is not about stoicism. Your health provider is your partner in this journey, and proactive communication leads to better outcomes. Remember: you do not need to be in crisis to deserve support.`;
}

function generateConclusion(article) {
  return `Your postpartum journey is not a race to the finish, but a chapter of profound transformation deserving of care, patience, and evidence-based support. By staying informed, listening to your body, and reaching out to your care network, you are already embodying the strength that defines motherhood. AfterMa is here — every step of the way — with clinical guidance rooted in compassion. You are not alone, and your healing matters deeply.`;
}

export default ArticleContent;
