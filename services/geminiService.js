/**
 * Afterma AI Service
 * Routes all AI calls to the deployed chatbot backend:
 *   https://aichatbot-0w82.onrender.com/api/ai
 *
 * Falls back gracefully if the service is unreachable.
 */

import { buildUserContext, chatbotAPI } from './api.js';

/**
 * Primary AI triage function — used by MentalWellness component
 * @param {string[]} symptoms  - array of symptom strings from user input
 * @param {object}  profile    - user profile object (for context)
 * @returns {string}           - formatted response text for the chat UI
 */
export const getTriageAnalysis = async (symptoms, profile) => {
  const question = symptoms.join('. ');
  const userContext = buildUserContext(profile);

  try {
    const response = await chatbotAPI.ask(question, userContext);

    // Build a rich formatted message from the structured response
    let text = response.message || '';

    if (response.bullets?.length) {
      text += '\n\n' + response.bullets.map(b => `• ${b}`).join('\n');
    }

    if (response.warnings?.length) {
      text += '\n\n⚠️ ' + response.warnings.join('\n⚠️ ');
    }

    // Surface triage level clearly
    const triageLabel = {
      mild: '🟢 Mild — self-care is sufficient.',
      moderate: '🟡 Moderate — please consult a doctor soon.',
      emergency: '🔴 Emergency — seek immediate medical help or call 112.',
    };
    if (response.triage && triageLabel[response.triage]) {
      text = `${triageLabel[response.triage]}\n\n${text}`;
    }

    return text;
  } catch (error) {
    console.error('[AfterMa AI] Triage request failed:', error);
    return 'I am here to support you. I had trouble connecting to the AI service right now. If you are experiencing an emergency, please call 112 immediately. Otherwise, please try again in a moment.';
  }
};

/**
 * Full structured AI response — used when you need the complete schema
 * (triage level, bullets, warnings, quick_replies, ui_flags)
 * @param {string} question
 * @param {object} profile
 * @returns {{ triage, message, bullets, warnings, quick_replies, ui_flags }}
 */
export const getStructuredAIResponse = async (question, profile) => {
  const userContext = buildUserContext(profile);
  try {
    return await chatbotAPI.ask(question, userContext);
  } catch (error) {
    console.error('[AfterMa AI] Structured request failed:', error);
    return {
      triage: 'mild',
      message: 'I had trouble connecting to the AI service. Please try again.',
      bullets: [],
      warnings: ['If this is urgent, please contact your doctor or call 112.'],
      quick_replies: ['Try again', 'What are emergency signs to watch for?'],
      ui_flags: { show_emergency_banner: false, highlight: false },
    };
  }
};

/**
 * Daily inspiration — short motivational message
 * @param {number} mood  - 1-10 mood score
 * @returns {string}
 */
export const getDailyInspiration = async (mood) => {
  try {
    const question = `Give me a warm, 2-sentence daily inspiration for a new mother feeling a mood of ${mood}/10.`;
    const response = await chatbotAPI.ask(question, {});
    return response.message || 'You are doing an amazing job. Take it one breath at a time.';
  } catch {
    return 'You are doing an amazing job. Take it one breath at a time.';
  }
};
