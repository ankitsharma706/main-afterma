export const getGhostSafeProfile = (profile) => {
  if (!profile?.incognito) return profile;

  return {
    ...profile,
    completedActivities: [],
    periodLogs: [],
    wellnessCheckIns: [],
    journalEntries: [],
  };
};

export const getGhostSafeLogs = (logs, profile) =>
  profile?.incognito ? [] : (Array.isArray(logs) ? logs : []);
