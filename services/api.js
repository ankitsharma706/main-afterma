/**
 * AfterMa API Service Layer
 * Connects AfterMaV2 frontend to:
 *   Backend:  https://aftermabk.onrender.com
 *   AI Chat:  https://aichatbot-0w82.onrender.com
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://aftermabk.onrender.com';
const CHAT_BASE = import.meta.env.VITE_CHATBOT_URL || 'https://aichatbot-0w82.onrender.com';

// ─── Token Helpers ────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('afterma_token');
const setToken = (t) => localStorage.setItem('afterma_token', t);
const setRefreshToken = (t) => localStorage.setItem('afterma_refresh_token', t);
const removeToken = () => {
  localStorage.removeItem('afterma_token');
  localStorage.removeItem('afterma_refresh_token');
};

// ─── Save tokens from backend response ───────────────────────────────────────
// Backend wraps everything in: { status, data: { token, refreshToken, user } }
const saveTokens = (res) => {
  const token = res?.data?.token || res?.token;
  const refresh = res?.data?.refreshToken || res?.refreshToken;
  if (token) setToken(token);
  if (refresh) setRefreshToken(refresh);
  return res?.data?.user || res?.user || null;
};

// ─── Base Fetch ───────────────────────────────────────────────────────────────
const apiFetch = async (url, options = {}) => {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Backend error format: { status: 'error', message: '...' }
    const msg = data?.message || data?.error || `Request failed (${res.status})`;
    throw { status: res.status, message: msg, data };
  }
  return data;
};

// ═════════════════════════════════════════════════════════════════════════════
// 🔐 AUTH
// POST   /api/auth/register
// POST   /api/auth/login
// POST   /api/auth/refresh
// POST   /api/auth/send-otp
// POST   /api/auth/verify-otp
// GET    /api/auth/me          (protected)
// PATCH  /api/auth/change-password (protected)
// ═════════════════════════════════════════════════════════════════════════════
export const authAPI = {
  /**
   * Register a new user
   * Returns the user object after saving tokens
   * @param {{ email, password, confirmPassword, full_name, phone? }} body
   */
  register: async (body) => {
    const data = await apiFetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return saveTokens(data);
  },

  /**
   * Login and persist JWT token
   * Returns the user object after saving tokens
   * @param {{ email, password }} body
   */
  login: async (body) => {
    const data = await apiFetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return saveTokens(data); // extracts data.token and data.user
  },

  /**
   * Google Sign-In — send the Google id_token to the backend
   * @param {string} idToken  — from Google Identity Services
   */
  loginWithGoogle: async (idToken) => {
    const data = await apiFetch(`${API_BASE}/api/auth/google`, {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
    return saveTokens(data);
  },

  /** Refresh the JWT */
  refreshToken: async () => {
    const storedRefresh = localStorage.getItem('afterma_refresh_token');
    const data = await apiFetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken: storedRefresh }),
    });
    return saveTokens(data);
  },

  /** Send OTP to phone (Twilio) */
  sendOtp: (body) =>
    apiFetch(`${API_BASE}/api/auth/send-otp`, { method: 'POST', body: JSON.stringify(body) }),

  /** Verify OTP — returns user after saving tokens */
  verifyOtp: async (body) => {
    const data = await apiFetch(`${API_BASE}/api/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return saveTokens(data);
  },

  /** Get currently logged-in user — returns user from data.user */
  getMe: async () => {
    const data = await apiFetch(`${API_BASE}/api/auth/me`);
    return data?.data?.user || data?.user || data;
  },

  /** Change password */
  changePassword: (body) =>
    apiFetch(`${API_BASE}/api/auth/change-password`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /** Logout (clear local tokens) */
  logout: () => removeToken(),

  /** Check if logged in */
  isLoggedIn: () => !!getToken(),
};

// ═════════════════════════════════════════════════════════════════════════════
// 👤 USERS
// GET    /api/users/:userId
// PATCH  /api/users/:userId
// DELETE /api/users/:userId
// GET    /api/users/me/calendar
// POST   /api/users/me/calendar
// DELETE /api/users/me/calendar/:eventId
// ═════════════════════════════════════════════════════════════════════════════
export const usersAPI = {
  /** Get user by ID */
  getById: (userId) => apiFetch(`${API_BASE}/api/users/${userId}`),

  /**
   * Update user profile
   * @param {string} userId
   * @param {{ email?, full_name?, weight_kg?, cycle_length_days?, period_duration_days? }} body
   */
  update: (userId, body) =>
    apiFetch(`${API_BASE}/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /** Delete user */
  delete: (userId) =>
    apiFetch(`${API_BASE}/api/users/${userId}`, { method: 'DELETE' }),

  // ── Cycle Calendar ─────────────────────────────────────────────────────────
  /** Get my cycle calendar events */
  getCalendar: () => apiFetch(`${API_BASE}/api/users/me/calendar`),

  /**
   * Log a calendar event
   * @param {{ event_date, event_type, notes? }} body
   * event_type: 'period_start'|'period_end'|'ovulation'|'fertile_window'|
   *             'doctor_appointment'|'symptom_peak'|'health_milestone'|
   *             'medication_reminder'|'custom'
   */
  logCalendarEvent: (body) =>
    apiFetch(`${API_BASE}/api/users/me/calendar`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Delete a calendar event */
  deleteCalendarEvent: (eventId) =>
    apiFetch(`${API_BASE}/api/users/me/calendar/${eventId}`, { method: 'DELETE' }),
};

// ═════════════════════════════════════════════════════════════════════════════
// 📋 DAILY LOGS  (Health Log modal → backend)
// POST   /api/logs
// GET    /api/logs
// GET    /api/logs/:logId
// PATCH  /api/logs/:logId
// DELETE /api/logs/:logId
// GET    /api/logs/summaries/all
// GET    /api/logs/summaries/latest
// ═════════════════════════════════════════════════════════════════════════════
export const logsAPI = {
  /**
   * Create a daily health log
   * @param {{ sleep_hours, water_liters, pain_intensity, cramps_severity,
   *           fatigue_score, energy_level, log_date? }} body
   */
  create: (body) =>
    apiFetch(`${API_BASE}/api/logs`, { method: 'POST', body: JSON.stringify(body) }),

  /** Get all my logs */
  getAll: () => apiFetch(`${API_BASE}/api/logs`),

  /** Get single log by ID */
  getById: (logId) => apiFetch(`${API_BASE}/api/logs/${logId}`),

  /** Update a log */
  update: (logId, body) =>
    apiFetch(`${API_BASE}/api/logs/${logId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /** Delete a log */
  delete: (logId) =>
    apiFetch(`${API_BASE}/api/logs/${logId}`, { method: 'DELETE' }),

  /** Get all AI health summaries */
  getAllSummaries: () => apiFetch(`${API_BASE}/api/logs/summaries/all`),

  /** Get latest AI health summary */
  getLatestSummary: () => apiFetch(`${API_BASE}/api/logs/summaries/latest`),
};

// ═════════════════════════════════════════════════════════════════════════════
// 👩‍⚕️ DOCTORS  (Care Connect → Book Session)
// GET    /api/doctors          (public)
// GET    /api/doctors/:doctorId (public)
// ═════════════════════════════════════════════════════════════════════════════
export const doctorsAPI = {
  /** Get all doctors (public — no auth needed) */
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`${API_BASE}/api/doctors${q ? `?${q}` : ''}`);
  },

  /** Get doctor by ID */
  getById: (doctorId) => apiFetch(`${API_BASE}/api/doctors/${doctorId}`),
};

// ═════════════════════════════════════════════════════════════════════════════
// 🤝 COMMUNITIES  (Sisters Circles)
// GET    /api/communities       (public)
// GET    /api/communities/:id   (public)
// POST   /api/communities       (authenticated)
// POST   /api/communities/:id/join
// DELETE /api/communities/:id/leave
// ═════════════════════════════════════════════════════════════════════════════
export const communitiesAPI = {
  /** Get all communities */
  getAll: () => apiFetch(`${API_BASE}/api/communities`),

  /** Get single community */
  getById: (communityId) => apiFetch(`${API_BASE}/api/communities/${communityId}`),

  /**
   * Create a community
   * @param {{ title, description?, category? }} body
   * category: 'Postpartum'|'Period Health'|'Mental Wellness'|'Nutrition'|
   *           'Exercise'|'General'|'Support'
   */
  create: (body) =>
    apiFetch(`${API_BASE}/api/communities`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Join a community */
  join: (communityId) =>
    apiFetch(`${API_BASE}/api/communities/${communityId}/join`, { method: 'POST' }),

  /** Leave a community */
  leave: (communityId) =>
    apiFetch(`${API_BASE}/api/communities/${communityId}/leave`, { method: 'DELETE' }),
};

// ═════════════════════════════════════════════════════════════════════════════
// 🏦 INSURANCE PLANS  (Care Connect → Insurance tab)
// GET    /api/insurance         (public)
// GET    /api/insurance/:planId (public)
// ═════════════════════════════════════════════════════════════════════════════
export const insuranceAPI = {
  /** Get all insurance plans */
  getAll: () => apiFetch(`${API_BASE}/api/insurance`),

  /** Get single plan */
  getById: (planId) => apiFetch(`${API_BASE}/api/insurance/${planId}`),
};

// ═════════════════════════════════════════════════════════════════════════════
// 🌱 NGOs  (Care Connect → NGO Support tab)
// GET    /api/ngos              (public)
// GET    /api/ngos/:ngoId       (public)
// ═════════════════════════════════════════════════════════════════════════════
export const ngoAPI = {
  /** Get all NGOs */
  getAll: () => apiFetch(`${API_BASE}/api/ngos`),

  /** Get single NGO */
  getById: (ngoId) => apiFetch(`${API_BASE}/api/ngos/${ngoId}`),
};

// ═════════════════════════════════════════════════════════════════════════════
// 📈 PROGRESS  (Care Journey)
// POST   /api/progress
// GET    /api/progress/:userId
// ═════════════════════════════════════════════════════════════════════════════
export const progressAPI = {
  /** Add a progress entry */
  add: (body) =>
    apiFetch(`${API_BASE}/api/progress`, { method: 'POST', body: JSON.stringify(body) }),

  /** Get progress for a user */
  getByUser: (userId) => apiFetch(`${API_BASE}/api/progress/${userId}`),
};

// ═════════════════════════════════════════════════════════════════════════════
// 🤖 AI CHATBOT  (Mental Wellness → AI Triage)
// POST   /api/ai   { question, user_context? }
//
// Response schema:
// {
//   triage:       "mild" | "moderate" | "emergency"
//   message:      string
//   bullets:      string[]
//   warnings:     string[]
//   quick_replies: string[]
//   ui_flags: { show_emergency_banner: bool, highlight: bool }
// }
// ═════════════════════════════════════════════════════════════════════════════
export const chatbotAPI = {
  /**
   * Ask the AfterMa AI a question
   * @param {string} question
   * @param {{ condition?, days_after_delivery?, location? }} userContext
   */
  ask: (question, userContext = {}) =>
    apiFetch(`${CHAT_BASE}/api/ai`, {
      method: 'POST',
      body: JSON.stringify({ question, user_context: userContext }),
    }),
};

// ─── Convenience: build user_context from profile ────────────────────────────
export const buildUserContext = (profile) => ({
  condition: profile.deliveryType || 'normal',
  days_after_delivery: (() => {
    if (!profile.deliveryDate) return 0;
    const diff = Date.now() - new Date(profile.deliveryDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  })(),
  location: 'India',
  maternity_stage: profile.maternityStage || 'Postpartum',
  language: profile.journeySettings?.language || 'english',
});
