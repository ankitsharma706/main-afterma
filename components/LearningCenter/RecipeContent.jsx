import { AlertTriangle, ChevronDown, ChevronUp, Leaf, Utensils } from 'lucide-react';
import { useState } from 'react';

/* ─── Section Block ───────────────────────────────────────────────────── */
const Section = ({ heading, icon: Icon, color = 'emerald', children }) => {
  const colorMap = {
    emerald: 'from-emerald-400 to-teal-500',
    rose:    'from-rose-400 to-pink-500',
    amber:   'from-amber-400 to-orange-500',
    sky:     'from-sky-400 to-blue-500',
  };
  return (
    <div className="space-y-3">
      <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
        {Icon && (
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${colorMap[color]} shadow-sm`}>
            <Icon size={14} className="text-white" />
          </div>
        )}
        {heading}
      </h2>
      <div className="pl-2 text-slate-600 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
};

/* ─── Ingredient List ─────────────────────────────────────────────────── */
const IngredientList = ({ ingredients }) => (
  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 md:p-6">
    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Ingredients</p>
    <ul className="space-y-2 columns-1 sm:columns-2">
      {ingredients.map((ing, i) => (
        <li key={i} className="flex items-start gap-2.5 text-slate-700 text-sm font-medium break-inside-avoid">
          <Leaf size={13} className="text-emerald-400 mt-0.5 shrink-0" />
          {ing}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Step List ───────────────────────────────────────────────────────── */
const StepList = ({ steps }) => (
  <ol className="space-y-4">
    {steps.map((step, i) => (
      <li key={i} className="flex items-start gap-4">
        <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          {i + 1}
        </span>
        <p className="text-slate-600 text-sm font-medium leading-relaxed pt-0.5">{step}</p>
      </li>
    ))}
  </ol>
);

/* ─── Safety Box ──────────────────────────────────────────────────────── */
const SafetyBox = ({ points }) => (
  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 md:p-6 space-y-3">
    <div className="flex items-center gap-2 text-amber-700">
      <AlertTriangle size={14} />
      <p className="text-[10px] font-black uppercase tracking-widest">Safety Tips for Mothers</p>
    </div>
    <ul className="space-y-2">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm font-medium leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          {p}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Nutrition Box ───────────────────────────────────────────────────── */
const NutritionBox = ({ benefits }) => (
  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5 md:p-6 space-y-3">
    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Nutrition Benefits</p>
    <ul className="space-y-2">
      {benefits.map((b, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm font-medium leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
          {b}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Main: RecipeContent ─────────────────────────────────────────────── */
const RecipeContent = ({ article }) => {
  const [expanded, setExpanded] = useState(false);

  const recipe = article.recipeData || generateRecipeData(article);

  const preview = (
    <div className="space-y-6">
      <Section heading="About This Recipe" icon={Utensils} color="emerald">
        <p className="text-slate-600 text-base leading-relaxed font-medium">
          {recipe.about}
        </p>
      </Section>

      <IngredientList ingredients={recipe.ingredients.slice(0, 4)} />
      <p className="text-slate-400 text-xs font-medium italic text-center">
        + {recipe.ingredients.length - 4} more ingredients & full preparation steps…
      </p>
    </div>
  );

  const fullContent = (
    <div className="space-y-8">
      <Section heading="About This Recipe" icon={Utensils} color="emerald">
        <p className="text-slate-600 text-base leading-relaxed font-medium">
          {recipe.about}
        </p>
        <p className="text-slate-600 text-base leading-relaxed font-medium">
          {recipe.aboutExtra}
        </p>
      </Section>

      <IngredientList ingredients={recipe.ingredients} />

      <Section heading="Step-by-Step Preparation" color="sky">
        <StepList steps={recipe.steps} />
      </Section>

      <NutritionBox benefits={recipe.nutritionBenefits} />

      <Section heading="Why This Supports Postpartum Recovery" color="rose">
        <p className="text-slate-600 text-base leading-relaxed font-medium">
          {recipe.recoveryNote}
        </p>
      </Section>

      <SafetyBox points={recipe.safetyTips} />

      <Section heading="Additional Nourishment Tips" color="amber">
        <p className="text-slate-600 text-base leading-relaxed font-medium">
          {recipe.additionalTips}
        </p>
      </Section>

      <div className="border-t border-slate-100 pt-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Reviewed by AfterMa Nutrition Team · Clinical-Grade Recipes for Maternal Health
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Content */}
      <div
        className="relative overflow-hidden transition-all duration-700 ease-in-out"
        style={{ maxHeight: expanded ? '9999px' : '480px' }}
      >
        {expanded ? fullContent : preview}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center">
        <button
          id="recipe-expand-btn"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 ${
            expanded
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
          }`}
        >
          {expanded ? (
            <><ChevronUp size={15} /> Close Recipe</>
          ) : (
            <><ChevronDown size={15} /> Show Full Recipe</>
          )}
        </button>
      </div>
    </div>
  );
};

/* ─── Generate recipe data from RECIPES constant ─────────────────────── */
function generateRecipeData(article) {
  const title = article.title || 'this Recipe';
  const desc = article.description || '';

  // Build recipe data dynamically based on article content
  const recipeMap = {
    'r1': {
      about: `Golden Ginger Congee is a time-honored healing porridge rooted in traditional Chinese and Ayurvedic medicine approaches to postpartum recovery. ${desc} It is gentle on a new mother's digestive system, warming for postpartum cold sensitivity, and deeply nourishing.`,
      aboutExtra: `This dish is ideal during the first 4–6 weeks postpartum when a mother's digestive fire is at its weakest. The slow cooking process ensures maximum nutrient bioavailability, while ginger's active compound gingerol actively reduces inflammation and nausea.`,
      ingredients: ['1 cup white or brown rice', '6 cups water or low-sodium vegetable broth', '1-inch fresh ginger, grated', '1/2 tsp turmeric powder', '1 tsp sesame oil', '2 tbsp soy sauce or coconut aminos', 'Spring onions, finely sliced (to garnish)', 'Soft-boiled egg (optional, for protein)'],
      steps: [
        'Rinse rice thoroughly until water runs clear. This removes excess starch for a smoother texture.',
        'Combine rice and water/broth in a medium pot. Bring to a boil over medium-high heat.',
        'Reduce heat to low. Add grated ginger and turmeric. Stir well.',
        'Simmer uncovered for 45–60 minutes, stirring occasionally, until rice breaks down into a creamy porridge.',
        'Season with soy sauce and sesame oil. Taste and adjust to preference.',
        'Ladle into a bowl, garnish with spring onions and a soft-boiled egg if using. Serve warm.',
      ],
      nutritionBenefits: [
        'Gingerol in fresh ginger reduces postpartum inflammation and treats nausea naturally.',
        'Turmeric contains curcumin — a powerful anti-inflammatory that supports uterine healing.',
        'Rice congee is easy to digest and provides sustained energy from complex carbohydrates.',
        'Sesame oil adds healthy fats that support hormonal balance and skin healing.',
        'Protein from optional egg supports tissue repair and boosts postpartum stamina.',
      ],
      recoveryNote: `During the postpartum period, the digestive system is often weakened due to the physical demands of labor, surgical recovery, or hormonal shifts. Warm, soft foods like congee are clinically recommended in Ayurvedic postpartum protocols because they require minimal digestive effort while delivering maximum nourishment. The warming properties of ginger also help counteract what Ayurveda describes as "vata imbalance" — the cold, depleted state many mothers feel in the early postpartum weeks.`,
      safetyTips: [
        'Avoid adding excess salt if you are experiencing postpartum fluid retention or hypertension.',
        'Use fresh ginger rather than powdered for best medicinal effect; however, avoid in excess if experiencing heartburn.',
        'If you had a C-section, stick to lighter meals in the first 48–72 hours and introduce congee gradually.',
        'Consult your provider before consuming large amounts of turmeric if you are on blood-thinning medications.',
      ],
      additionalTips: `Pair this congee with a glass of warm coconut water to support electrolyte balance. You may also add a teaspoon of ghee for additional lubrication of the digestive tract — a practice widely recommended in Ayurvedic postpartum care. If preparing in bulk, congee stores well in the refrigerator for up to 3 days and reheats easily with a splash of water.`,
    },
  };

  // Default recipe data for articles not specifically mapped
  return recipeMap[article.id] || {
    about: `${title} is a carefully curated recipe designed to support maternal health during the postpartum or prenatal period. ${desc} This recipe brings together the wisdom of traditional nutrition with modern nutritional science.`,
    aboutExtra: `Every ingredient in this recipe has been selected for its specific benefits to maternal health, digestive wellness, and hormonal support. Whether breastfeeding, recovering from birth, or nourishing a pregnancy, this recipe delivers targeted nutritional support in a delicious, approachable form.`,
    ingredients: [
      '2 cups primary ingredient of choice',
      '1 cup supporting vegetable or protein',
      '1 tsp turmeric powder (anti-inflammatory)',
      '1 tsp fresh ginger, grated',
      '1 tsp ghee or sesame oil',
      '2 cups water or low-sodium broth',
      'Rock salt to taste',
      'Fresh herbs to garnish (coriander or mint)',
    ],
    steps: [
      'Prepare all ingredients. Wash and chop vegetables if applicable. Measure out spices.',
      'Heat oil or ghee in a medium pot over low flame. Add spices and toast for 30 seconds until fragrant.',
      'Add primary ingredients and stir to coat with spices.',
      'Pour in water or broth. Bring to a simmer and cook on low heat until tender.',
      'Season with salt, adjust consistency if needed. Simmer for 5 more minutes.',
      'Serve warm, garnished with fresh herbs. Consume within 2 hours for maximum benefit.',
    ],
    nutritionBenefits: [
      'Anti-inflammatory spices support uterine healing and reduce postpartum swelling.',
      'Warming ingredients restore digestive fire weakened during labor and recovery.',
      'Healthy fats from ghee or sesame oil support hormonal synthesis.',
      'Hydrating broth base replenishes fluids critical for breastfeeding mothers.',
      'Natural iron from plant-based ingredients aids recovery from postpartum blood loss.',
    ],
    recoveryNote: `Postpartum nutrition is one of the most impactful levers a mother can pull in her healing journey. This recipe is designed to be both nourishing and accessible — requiring minimal preparation effort during a period when a mother's time and energy are precious. The ingredients collectively support gut healing, reduce inflammation, promote milk production, and stabilize mood.`,
    safetyTips: [
      'Always consult your healthcare provider before making significant dietary changes postpartum.',
      'Introduce new foods gradually if you are recovering from a C-section or GI complications.',
      'Avoid highly processed additions — keep the recipe as whole-food as possible for maximum benefit.',
      'If you have food allergies or intolerances, substitute ingredients carefully and check with your dietitian.',
    ],
    additionalTips: `Prepare larger batches and freeze in portions for easy reheating throughout the week. Postpartum fatigue is real — having nourishing meals ready reduces decision fatigue during challenging moments. Share this recipe with your caregiver or support person so they can prepare it for you when needed.`,
  };
}

export default RecipeContent;
