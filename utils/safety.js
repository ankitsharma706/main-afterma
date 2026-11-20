export const isValidFutureDate = (value, now = new Date()) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const candidate = new Date(year, month - 1, day);
  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return false;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return candidate > today;
};

export const isValidTime = (value) => {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return false;
  }

  return true;
};
