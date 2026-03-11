/**
 * Afterma AI Service (Local Mode)
 * No external AI calls — all responses generated locally
 */

import { chatbotAPI, buildUserContext } from './api.js';

/**
 * Primary triage analysis
 */
export const getTriageAnalysis = async (symptoms, profile) => {

  const userContext = buildUserContext(profile);
  const text = symptoms.join(' ').toLowerCase();

  let triage = "mild";
  let message = "";
  let bullets = [];
  let warnings = [];

  // Emergency keywords
  if (
    text.includes("bleeding") ||
    text.includes("severe pain") ||
    text.includes("unconscious") ||
    text.includes("chest pain")
  ) {
    triage = "emergency";
    message = "Your symptoms may require urgent medical attention.";

    bullets = [
      "Seek immediate medical help.",
      "Call emergency services (112).",
      "Do not delay professional care."
    ];

    warnings = ["Possible emergency condition."];
  }

  // Moderate symptoms
  else if (
    text.includes("fever") ||
    text.includes("infection") ||
    text.includes("persistent pain") ||
    text.includes("swelling")
  ) {
    triage = "moderate";

    message = "Your symptoms may require medical consultation.";

    bullets = [
      "Monitor your symptoms carefully.",
      "Schedule a doctor's appointment.",
      "Stay hydrated and rest."
    ];
  }

  // Default mild
  else {
    triage = "mild";

    message = "Your symptoms appear mild based on the information provided.";

    bullets = [
      "Rest and monitor your condition.",
      "Maintain hydration and balanced nutrition.",
      "Seek medical advice if symptoms worsen."
    ];
  }

  const triageLabel = {
    mild: "🟢 Mild — self-care may be sufficient.",
    moderate: "🟡 Moderate — consult a doctor soon.",
    emergency: "🔴 Emergency — seek immediate medical help."
  };

  let output = `${triageLabel[triage]}\n\n${message}`;

  if (bullets.length) {
    output += "\n\n" + bullets.map(b => `• ${b}`).join("\n");
  }

  if (warnings.length) {
    output += "\n\n⚠️ " + warnings.join("\n⚠️ ");
  }

  return output;
};

/**
 * Structured response version
 */
export const getStructuredAIResponse = async (question, profile) => {
  try {
    const userContext = buildUserContext(profile);
    const response = await chatbotAPI.ask(question, userContext);

    const resData = response?.data || response;
    return {
      triage: resData.triage || "mild",
      message: resData.message || resData.content || resData.response || "I am here to support you.",
      bullets: resData.bullets || [],
      warnings: resData.warnings || [],
      quick_replies: resData.quick_replies || resData.quickReplies || [
        "What symptoms should I watch for?",
        "When should I see a doctor?",
        "Give me self-care tips"
      ],
      ui_flags: resData.ui_flags || resData.uiFlags || {
        show_emergency_banner: resData.triage === "emergency",
        highlight: resData.triage === "emergency"
      }
    };
  } catch (error) {
    console.warn("AI Backend failed, falling back to local logic:", error);
    const text = question.toLowerCase();

    let triage = "mild";
    let message = "";
    let bullets = [];
    let warnings = [];

    if (text.includes("bleeding") || text.includes("unconscious")) {
      triage = "emergency";
      message = "These symptoms may indicate a serious condition.";
      bullets = [
        "Seek emergency medical help immediately.",
        "Call emergency number 112.",
        "Do not wait for symptoms to improve."
      ];
      warnings = ["Potential medical emergency."];
    } else if (text.includes("pain") || text.includes("fever")) {
      triage = "moderate";
      message = "Your symptoms may require medical evaluation.";
      bullets = [
        "Monitor your symptoms carefully.",
        "Consider contacting your doctor.",
        "Rest and stay hydrated."
      ];
    } else {
      triage = "mild";
      message = "Your symptoms appear mild based on the information provided.";
      bullets = [
        "Rest and monitor symptoms.",
        "Maintain healthy diet and hydration."
      ];
    }

    return {
      triage,
      message,
      bullets,
      warnings,
      quick_replies: [
        "What symptoms should I watch for?",
        "When should I see a doctor?",
        "Give me self-care tips"
      ],
      ui_flags: {
        show_emergency_banner: triage === "emergency",
        highlight: triage === "emergency"
      }
    };
  }
};

/**
 * Daily inspiration (local messages)
 */
export const getDailyInspiration = (mood) => {

  const inspiration = {
    low: [
      "Even difficult days pass. Be gentle with yourself.",
      "You are stronger than you feel today.",
      "Every small step forward is progress."
    ],

    medium: [
      "You are doing a wonderful job — keep going.",
      "Your strength is shaping a beautiful future.",
      "Take a deep breath and appreciate how far you’ve come."
    ],

    high: [
      "Your positivity brings light to those around you.",
      "Celebrate today's small victories.",
      "You are doing amazing things."
    ]
  };

  let group;

  if (mood <= 3) group = inspiration.low;
  else if (mood <= 7) group = inspiration.medium;
  else group = inspiration.high;

  const randomIndex = Math.floor(Math.random() * group.length);

  return group[randomIndex];
};