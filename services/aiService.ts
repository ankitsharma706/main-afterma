
import { UserProfile } from "../types";

// Offline deterministic logic for triage analysis and daily inspiration.

const TRIAGE_RULES: Record<string, { assessment: string; action: string; selfCare: string }> = {
  "High Fever": {
    assessment: "A high fever in the postpartum period can indicate an infection such as mastitis, endometritis, or a urinary tract infection.",
    action: "Consult your doctor immediately or go to the ER if fever is very high (>100.4°F/38°C).",
    selfCare: "Stay hydrated, rest, and monitor your temperature closely."
  },
  "Heavy Bleeding": {
    assessment: "Heavy bleeding (more than one pad an hour) can be a sign of postpartum hemorrhage.",
    action: "This is a medical emergency. Go to the ER immediately.",
    selfCare: "Do not wait. Seek professional help now."
  },
  "Severe Breast Pain": {
    assessment: "Severe breast pain, especially with redness or warmth, may indicate mastitis.",
    action: "Contact your healthcare provider for potential antibiotic treatment.",
    selfCare: "Apply warm compresses before feeding and cold compresses after. Continue to breastfeed or pump to drain the breast."
  },
  "Extreme Sadness": {
    assessment: "Extreme sadness, anxiety, or hopelessness may be signs of Postpartum Depression (PPD).",
    action: "Please reach out to a healthcare professional or a mental health support line.",
    selfCare: "You are not alone. Connect with a trusted friend or family member."
  },
  "Leg Swelling": {
    assessment: "Swelling in one leg, often accompanied by pain or redness, could suggest a Deep Vein Thrombosis (DVT).",
    action: "Seek immediate medical attention to rule out a blood clot.",
    selfCare: "Elevate your leg and avoid massaging the area."
  },
  "Vision Blurriness": {
    assessment: "Blurred vision can be a symptom of Preeclampsia, a serious blood pressure condition.",
    action: "Seek substantial medical attention immediately. Go to the ER.",
    selfCare: "Monitor your blood pressure if you have a home monitor."
  },
  "Severe Nausea": {
    assessment: "Severe nausea and vomiting can lead to dehydration (Hyperemesis Gravidarum).",
    action: "Consult your OBGYN for management strategies.",
    selfCare: "Eat small, frequent meals and stay hydrated with sips of water or electrolyte drinks."
  },
  "Early Contractions": {
    assessment: "Contractions before 37 weeks could signal preterm labor.",
    action: "Contact your maternity unit or go to the hospital immediately.",
    selfCare: "Lie down on your left side and drink water while waiting for advice."
  },
  "Headache": {
    assessment: "A severe or persistent headache that doesn't go away with medication can be a sign of Preeclampsia.",
    action: "Contact your healthcare provider immediately.",
    selfCare: "Rest in a dark, quiet room and avoid screens."
  },
  "Reduced Movement": {
    assessment: "A significant decrease in fetal movement needs to be checked.",
    action: "Contact your maternity unit immediately for monitoring.",
    selfCare: "Lie on your left side and count kicks. If unsure, go to the hospital."
  },
  "Spotting": {
    assessment: "Spotting can be normal but should always be checked to rule out complications.",
    action: "Inform your healthcare provider.",
    selfCare: "Rest and avoid strenuous activity."
  },
  "Dizziness": {
    assessment: "Dizziness can be caused by anemia, dehydration, or blood pressure changes.",
    action: "Sit or lie down immediately. Discuss with your doctor at your next visit or sooner if severe.",
    selfCare: "Drink water and rise slowly from sitting positions."
  }
};

const INSPIRATION_QUOTES = [
  "You are doing an amazing job. Take it one breath at a time.",
  "Motherhood is a journey, not a race. Be gentle with yourself.",
  "Your baby loves you exactly as you are.",
  "Strength grows in the moments when you think you can't go on but you keep going.",
  "Every day is a new beginning. You've got this.",
  "Self-care is not selfish; it is essential.",
  "Trust your instincts. You know your baby best.",
  "It's okay to ask for help. It takes a village.",
  "You are capable, you are strong, you are enough.",
  "This too shall pass. Embrace the precious moments."
];

const INSPIRATION_BY_MOOD: Record<number, string[]> = {
  1: ["It's okay to not be okay. Breathe.", "This hard moment will pass.", "You are stronger than you know."],
  2: ["Be gentle with yourself today.", "One step at a time is enough.", "Sending you strength and peace."],
  3: ["Your best is always enough.", "Take a moment for yourself.", "You are doing a great job."],
  4: ["Self-care is important. Rest if you can.", "You are supported.", "Trust the process."],
  5: ["Find joy in the small things.", "You are capable of amazing things.", "Balance is key."],
  6: ["You are glowing today!", "Keep up the good work.", "Positivity is a superpower."],
  7: ["Radiate love and light.", "You are thriving!", "Enjoy this beautiful day."],
  8: ["Your energy is contagious.", "Great job, mama!", "Keep shining."],
  9: ["Wonderful! Share your joy.", "You are on fire!", "Amazing work."],
  10: ["Perfect harmony. enjoy!", "Top of the world!", "You are a rockstar!"]
};


export const getTriageAnalysis = async (symptoms: string[], profile: UserProfile) => {
  // Mock delay to simulate "analysis"
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (symptoms.length === 0) return "Please select symptoms to analyze.";

  let responseText = `Based on your reported symptoms for a ${profile.maternityStage} profile:\n\n`;

  symptoms.forEach(symptom => {
    const rule = TRIAGE_RULES[symptom];
    if (rule) {
      responseText += `**${symptom}**:\n`;
      responseText += `1. **Assessment**: ${rule.assessment}\n`;
      responseText += `2. **Action**: ${rule.action}\n`;
      responseText += `3. **Self-care**: ${rule.selfCare}\n\n`;
    } else {
      responseText += `**${symptom}**:\n`;
      responseText += `1. **Assessment**: Please monitor this symptom carefully.\n`;
      responseText += `2. **Action**: Consult your healthcare provider if it persists.\n\n`;
    }
  });

  responseText += "DISCLAIMER: This is an automated assessment based on general guidelines. It is not a substitute for professional medical advice. Always contact your doctor for concerns.";

  return responseText;
};

export const getDailyInspiration = async (mood: number) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const moodLevel = Math.max(1, Math.min(10, Math.round(mood))); // Ensure 1-10
  const quotes = INSPIRATION_BY_MOOD[moodLevel] || INSPIRATION_QUOTES;

  // Return random quote from the appropriate list
  return quotes[Math.floor(Math.random() * quotes.length)];
};
