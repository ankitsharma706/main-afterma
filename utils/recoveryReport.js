export const getActivitySummary = (activities, completedActivityIds) => {
  const activityList = Array.isArray(activities) ? activities : [];
  const completedIds = new Set(Array.isArray(completedActivityIds) ? completedActivityIds : []);
  const completed = activityList.filter((activity) => completedIds.has(activity?.id)).length;

  return {
    completed,
    total: activityList.length,
    percentage: activityList.length ? Math.round((completed / activityList.length) * 100) : null,
  };
};
