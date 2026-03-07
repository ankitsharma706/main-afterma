/**
 * AfterMa API Service Layer v3.0
 * ─────────────────────────────────
 * Clean organized API service for all backend endpoints.
 * Base URL: https://aftermabk.onrender.com (or localhost:5000 in dev)
 *
 * Exports:
 *   authAPI, userAPI, doctorAPI, sessionAPI,
 *   lactationAPI, dailyLogAPI, periodAPI,
 *   communityAPI, ngoAPI, medicineAPI, insuranceAPI
 */

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://aftermabk.onrender.com';

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('afterma_token');
export const setToken = (t) => t && localStorage.setItem('afterma_token', t);
export const removeToken = () => {
  localStorage.removeItem('afterma_token');
  localStorage.removeItem('afterma_user_id');
};

export const getUserId = () => localStorage.getItem('afterma_user_id');
export const setUserId = (id) => id && localStorage.setItem('afterma_user_id', id);

const headers = (auth = false, extra = {}) => ({
  'Content-Type': 'application/json',
  ...(auth ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const request = async (method, path, body, auth = false) => {
  const res = await fetch(`${BASE}${path}`, {
    method: method.toUpperCase(),
    headers: headers(auth),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);

  // if (res.status === 401) {
  //   removeToken();
  //   window.location.href = "/login";
  // }
  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
};

const get = (path, auth = false) => request('GET', path, null, auth);
const post = (path, body, auth = false) => request('POST', path, body, auth);
const patch = (path, body, auth = false) => request('PATCH', path, body, auth);
const del = (path, auth = false) => request('DELETE', path, null, auth);

// ─── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: async (data) => {
    let res;
    if (data.role === 'doctor') {
      const docData = {
        name: data.full_name || 'Dr. ' + (data.email.split('@')[0]),
        email: data.email,
        password: data.password,
        specialization: 'General',
        phone: data.phone || ''
      };
      res = await post('/api/auth/doctor/register', docData);
    } else {
      res = await post('/api/auth/register', data);
    }

    if (res.data?.token) setToken(res.data.token);
    const id = res.data?.user?._id || res.data?.doctor?._id;
    if (id) setUserId(id);
    return res.data?.user || res.data?.doctor || res;
  },

  /**
   * Login with email + password.
   * @param {{ email, password, role }} data
   */
  login: async (data) => {
    let res;
    if (data.role === 'doctor') {
      res = await post('/api/auth/doctor/login', { email: data.email, password: data.password });
    } else {
      res = await post('/api/auth/login', { email: data.email, password: data.password });
    }

    if (res.data?.token) setToken(res.data.token);
    const id = res.data?.user?._id || res.data?.doctor?._id;
    if (id) setUserId(id);
    return res.data?.user || res.data?.doctor || res;
  },

  /** Get currently authenticated user. */
  me: async () => {
    const res = await get('/api/auth/me', true);
    return res.data?.user || res.data?.doctor || res;
  },

  /**
   * Sign in with Google ID token (from Google GSI).
   * Sends the credential token to the backend for verification.
   * @param {string} googleCredential — JWT credential from Google GSI callback
   */
  loginWithGoogle: async (googleCredential) => {
    try {
      const res = await post('/api/auth/google', { credential: googleCredential });
      if (res.data?.token) setToken(res.data.token);
      if (res.data?.user?._id) setUserId(res.data.user._id);
      return res.data?.user || null;
    } catch (err) {
      console.warn('[authAPI.loginWithGoogle] Backend Google auth failed:', err?.message);
      throw new Error(err?.message || 'Google sign-in failed. Please try again.');
    }
  },

  logout: () => removeToken(),
};

// ─── User API ─────────────────────────────────────────────────────────────────
export const userAPI = {
  /** Get full profile of authenticated user. */
  getMe: () => get('/api/users/me', true),

  /**
   * Update authenticated user's profile.
   * @param {Object} data — Only the fields to change (no password)
   */
  updateMe: (data) => patch('/api/users/me', data, true),
};

// ─── Doctor API ───────────────────────────────────────────────────────────────
export const doctorAPI = {
  /** Get all active doctors. Optionally filter by specialization or location. */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/api/doctors${qs ? '?' + qs : ''}`);
  },

  /** Get a single doctor by MongoDB _id. */
  getById: (id) => get(`/api/doctors/${id}`),
};

// ─── Session API ──────────────────────────────────────────────────────────────
export const sessionAPI = {
  /**
   * Book a session with a doctor.
   * @param {{ doctor_id, session_date, session_time, session_type?, session_fee?, notes? }} data
   */
  book: (data) => post('/api/sessions', data, true),

  /** Get all sessions for the authenticated user. */
  getMySessions: () => get('/api/sessions/me', true),

  /**
   * Cancel a session.
   * @param {string} sessionId
   * @param {string} reason
   */
  cancel: (sessionId, reason = '') => patch(`/api/sessions/${sessionId}/cancel`, { reason }, true),
};

// ─── Lactation API ────────────────────────────────────────────────────────────
export const lactationAPI = {
  /**
   * Create a lactation log entry.
   * @param {{ feeding_type, side?, milk_quantity_ml?, duration_minutes?, baby_response?, notes?, timestamp? }} data
   */
  create: (data) => post('/api/lactation', data, true),

  /** Get all lactation logs for the authenticated user. */
  getMyLogs: () => get('/api/lactation/me', true),

  /** Delete a lactation log by id. */
  delete: (id) => del(`/api/lactation/${id}`, true),
};

// ─── Daily Log API ────────────────────────────────────────────────────────────
export const dailyLogAPI = {
  /**
   * Create or update today's daily log (upsert by date).
   * @param {{ date, mood_score?, pain_level?, sleep_hours?, water_cups?, energy_level?, activity_level?, symptoms?, notes? }} data
   */
  create: (data) => post('/api/logs', data, true),

  /** Get recent daily logs for the authenticated user. */
  getMyLogs: (limit = 30) => get(`/api/logs/me?limit=${limit}`, true),
};

// ─── Period API ───────────────────────────────────────────────────────────────
export const periodAPI = {
  /**
   * Log a new period cycle.
   * @param {{ cycle_start, cycle_end?, flow_pattern?, daily_flow?, symptoms?, notes? }} data
   */
  create: (data) => post('/api/period', data, true),

  /** Get all period logs for the authenticated user. */
  getMyLogs: () => get('/api/period/me', true),

  /**
   * Update an existing period log.
   * @param {string} id
   * @param {Object} data
   */
  update: (id, data) => patch(`/api/period/${id}`, data, true),
};

// ─── Community API ────────────────────────────────────────────────────────────
export const communityAPI = {
  /** Get all active communities. */
  getAll: () => get('/api/communities'),

  /** Increment member count (join community). */
  join: (id) => patch(`/api/communities/${id}/join`, {}, true),

  /** Decrement member count (leave community). */
  leave: (id) => patch(`/api/communities/${id}/leave`, {}, true),
};

// ─── NGO API ──────────────────────────────────────────────────────────────────
export const ngoAPI = {
  /** Get all NGOs. */
  getAll: () => get('/api/ngos'),
};

// ─── Medicine API ─────────────────────────────────────────────────────────────
export const medicineAPI = {
  /** Get all medicines catalogue. */
  getAll: () => get('/api/medicines'),
};

// ─── Insurance API ────────────────────────────────────────────────────────────
export const insuranceAPI = {
  /** Get all insurance/scheme plans. */
  getAll: () => get('/api/insurance'),
};

// ─── Backward-compatible aliases ──────────────────────────────────────────────
// These match the old import names used throughout the existing components.

/** Alias for doctorAPI (used by CareConnect.jsx) */
export const doctorsAPI = doctorAPI;

/** Alias for communityAPI (used by CareConnect.jsx) */
export const communitiesAPI = communityAPI;

/** usersAPI — alias for userAPI + extra .update() method (used by Settings.jsx) */
export const usersAPI = {
  ...userAPI,
  /**
   * Update user profile. Accepts both frontend camelCase and backend snake_case fields.
   * userId param is ignored — identity comes from the JWT token.
   * @param {string} _userId  — ignored
   * @param {Object} data     — fields to update
   */
  update: (_userId, data) => {
    // Map common camelCase frontend keys → backend snake_case where needed
    const mapped = {
      ...(data.full_name && { full_name: data.full_name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.maternity_stage && { phase: data.maternity_stage }),
      ...(data.delivery_type && { delivery_type: data.delivery_type }),
      ...(data.symptoms && { symptoms: data.symptoms }),

      ...(data.language || data.reminder_time
        ? {
          preferences: {
            ...(data.language && { language: data.language }),
            ...(data.reminder_time && { reminder_time: data.reminder_time }),
          },
        }
        : {}),
    };
    // Pass any remaining fields through unchanged
    const merged = { ...data, ...mapped };
    // Remove fields the backend won't accept
    delete merged.maternity_stage;
    delete merged.cycle_length_days;
    delete merged.medical_history;
    delete merged.allergies;
    return patch('/api/users/me', merged, true);
  },

  /**
   * Get full user profile + health summary for the health report.
   * Falls back to just /api/users/me if no dedicated report endpoint exists.
   * @param {string} _userId — accepted but ignored; JWT identifies the user
   */
  getReportData: async (_userId) => {
    try {
      // Try a dedicated report endpoint first
      const user = await get('/api/users/me', true);
      const logs = await get('/api/logs/me?limit=7', true);
      const latestLog = logs?.data?.logs?.[0] || {};
      return {
        status: 'success',
        data: {
          user: user?.data?.user || {},
          summary: {
            mood_score: latestLog.mood_score ?? 5,
            energy_score: latestLog.energy_level ?? 5,
            pain_intensity: latestLog.pain_level ?? 2,
            sleep_hours: latestLog.sleep_hours ?? 6,
            water_intake: latestLog.water_cups ?? 5,
            cycle_day: null,
          },
        },
      };
    } catch {
      return { status: 'error', data: {} };
    }
  },
};

/** Alias for sessionAPI (used by ExpertDashboard.jsx) */
export const sessionsAPI = sessionAPI;

/**
 * Expert API — for doctor-facing dashboard views.
 * Maps to existing session + doctor endpoints.
 */
export const expertAPI = {
  /** Get sessions for the logged-in doctor. */
  getSessions: () => get('/api/sessions/me', true),
  /** Get doctor profile by id */
  getDoctor: (id) => get(`/api/doctors/${id}`),
  /** Get all doctors (for expert listings) */
  getDoctors: () => get('/api/doctors'),
};

/**
 * Alias for dailyLogAPI (used by HealthLogModal.jsx as logsAPI).
 */
export const logsAPI = dailyLogAPI;

/**
 * Helper to map frontend log form data to backend field names.
 * Used by HealthLogModal.jsx
 */
export const mapLogToBackend = (formData) => ({
  date: formData.date || new Date().toISOString().split('T')[0],
  mood_score: Number(formData.mood_score ?? formData.mood ?? 5),
  pain_level: Number(formData.pain_level ?? formData.pain ?? 0),
  sleep_hours: Number(formData.sleep_hours ?? formData.sleep ?? 7),
  water_cups: Number(formData.water_cups ?? formData.water ?? 6),
  energy_level: Number(formData.energy_level ?? formData.energy ?? 5),
  activity_level: formData.activity_level ?? formData.activity ?? 'none',
  symptoms: Array.isArray(formData.symptoms) ? formData.symptoms : [],
  notes: formData.notes ?? '',
});

// ─── Chatbot API ──────────────────────────────────────────────────────────────
const CHAT_BASE = import.meta.env.VITE_CHATBOT_URL || 'https://aichatbot-0w82.onrender.com';

export const chatbotAPI = {
  /**
   * Send a question to the AI chatbot.
   * @param {string} question
   * @param {Object} userContext — from buildUserContext()
   */
  ask: async (question, userContext = {}) => {
    const res = await fetch(`${CHAT_BASE}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userContext }),
    });
    if (!res.ok) throw new Error(`AI request failed: ${res.status}`); if (res.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return res.json();
  },
};

/**
 * Build a structured context object from user profile for the AI chatbot.
 * Used by geminiService.js
 * @param {Object} profile
 */
export const buildUserContext = (profile = {}) => ({
  phase: profile.phase || 'postpartum',
  dob: profile.dob || '',
  blood_group: profile.blood_group || '',
  delivery_type: profile.delivery_type || '',
  symptoms: profile.symptoms || [],
  weight_kg: profile.weight_kg || '',
  height_cm: profile.height_cm || '',
  haemoglobin: profile.haemoglobin || '',
  thyroid: profile.thyroid || '',
  vitamin_d3: profile.vitamin_d3 || '',
  glucose: profile.glucose || '',
  city: profile.city || '',
  language: profile.preferences?.language || 'English',
});

