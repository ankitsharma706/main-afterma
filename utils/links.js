export const getExternalHref = (value) => {
  if (typeof value !== 'string') return null;

  const candidate = value.trim();
  const isDomain = /^[a-z\d][a-z\d.-]*\.[a-z]{2,}(?:\/[^\s]*)?$/i.test(candidate);
  if (!isDomain && !/^https:\/\//i.test(candidate)) return null;

  try {
    const url = new URL(isDomain ? `https://${candidate}` : candidate);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
};

export const getTelephoneHref = (value) => {
  if (typeof value !== 'string' || !/^[+\d\s().-]+$/.test(value.trim())) return null;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? `tel:${value.trim()}` : null;
};
