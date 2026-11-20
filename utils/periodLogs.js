export const upsertPeriodLog = (logs, entry) => {
  const entries = Array.isArray(logs) ? logs : [];
  const index = entries.findIndex((log) => log?.id === entry.id);

  if (index === -1) return [entry, ...entries];

  return entries.map((log, currentIndex) => currentIndex === index ? entry : log);
};

export const removePeriodLog = (logs, id) =>
  (Array.isArray(logs) ? logs : []).filter((log) => log?.id !== id);
