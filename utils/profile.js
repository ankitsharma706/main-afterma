export const DEFAULT_PROFILE = {
  name: 'Guest',
  age: 28,
  deliveryDate: new Date().toISOString(),
  deliveryType: 'normal',
  maternityStage: 'Postpartum',
  authenticated: false,
  role: 'mother',
  accent: 'PINK',
  incognito: false,
  medicalHistory: '',
  emergencyContact: '',
  membershipPlan: 'free',
  currentPhase: 'Month 1',
  completedActivities: [],
  streakCount: 0,
  streakProtectionActive: false,
  lastLoginDate: new Date().toISOString().split('T')[0],
  badges: [],
  caregiver: {
    name: '',
    relationship: '',
    contact: '',
    permissions: {
      canViewMood: true,
      canViewPhysical: true,
      canViewMedicalHistory: false,
      canViewAppointments: true,
    },
  },
  journeySettings: {
    pace: 'gentle',
    preferredTime: 'morning',
    goals: ['improve strength', 'stabilize mood'],
    dailyCommitmentMinutes: 15,
    isPaused: false,
    language: 'english',
  },
  notifications: {
    exerciseReminders: true,
    hydrationAlerts: true,
    moodCheckins: true,
    careConnectUpdates: true,
    sosConfirmations: true,
  },
  periodLogs: [],
  wellnessCheckIns: [],
};

const readStoredValue = (storage, key) => {
  if (!storage) return null;

  try {
    const rawValue = storage.getItem(key);
    if (!rawValue) return null;
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
};

export const normalizeProfile = (profile = {}) => {
  const safeProfile = profile && typeof profile === 'object' ? profile : {};

  const caregiver = {
    ...DEFAULT_PROFILE.caregiver,
    ...(safeProfile.caregiver || {}),
    permissions: {
      ...DEFAULT_PROFILE.caregiver.permissions,
      ...((safeProfile.caregiver && safeProfile.caregiver.permissions) || {}),
    },
  };

  const journeySettings = {
    ...DEFAULT_PROFILE.journeySettings,
    ...(safeProfile.journeySettings || {}),
    dailyCommitmentMinutes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].includes(
      Number(safeProfile.journeySettings?.dailyCommitmentMinutes)
    )
      ? Number(safeProfile.journeySettings.dailyCommitmentMinutes)
      : DEFAULT_PROFILE.journeySettings.dailyCommitmentMinutes,
    goals: Array.isArray(safeProfile.journeySettings?.goals)
      ? safeProfile.journeySettings.goals
      : DEFAULT_PROFILE.journeySettings.goals,
  };

  const notifications = {
    ...DEFAULT_PROFILE.notifications,
    ...(safeProfile.notifications || {}),
  };

  return {
    ...DEFAULT_PROFILE,
    ...safeProfile,
    name: typeof safeProfile.name === 'string' && safeProfile.name.trim() ? safeProfile.name : DEFAULT_PROFILE.name,
    membershipPlan: safeProfile.membershipPlan || DEFAULT_PROFILE.membershipPlan,
    maternityStage: safeProfile.maternityStage || DEFAULT_PROFILE.maternityStage,
    deliveryType: safeProfile.deliveryType || DEFAULT_PROFILE.deliveryType,
    currentPhase: safeProfile.currentPhase || DEFAULT_PROFILE.currentPhase,
    authenticated: Boolean(safeProfile.authenticated),
    incognito: Boolean(safeProfile.incognito),
    completedActivities: Array.isArray(safeProfile.completedActivities) ? safeProfile.completedActivities : DEFAULT_PROFILE.completedActivities,
    badges: Array.isArray(safeProfile.badges) ? safeProfile.badges : DEFAULT_PROFILE.badges,
    periodLogs: Array.isArray(safeProfile.periodLogs) ? safeProfile.periodLogs : DEFAULT_PROFILE.periodLogs,
    wellnessCheckIns: Array.isArray(safeProfile.wellnessCheckIns)
      ? safeProfile.wellnessCheckIns
      : DEFAULT_PROFILE.wellnessCheckIns,
    caregiver,
    journeySettings,
    notifications,
    deliveryDate:
      typeof safeProfile.deliveryDate === 'string' && safeProfile.deliveryDate
        ? safeProfile.deliveryDate
        : DEFAULT_PROFILE.deliveryDate,
    lastLoginDate:
      typeof safeProfile.lastLoginDate === 'string' && safeProfile.lastLoginDate
        ? safeProfile.lastLoginDate
        : DEFAULT_PROFILE.lastLoginDate,
  };
};

export const loadProfile = (storage = (typeof window !== 'undefined' ? window.localStorage : undefined)) => {
  const storedProfile = readStoredValue(storage, 'afterma_profile_v4');
  return { ...normalizeProfile(storedProfile), authenticated: false };
};

export const getProfileInitials = (name) => {
  const trimmed = typeof name === 'string' ? name.trim() : '';

  if (!trimmed) return 'G';

  return trimmed
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'G';
};
