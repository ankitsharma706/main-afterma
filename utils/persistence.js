const getStorage = (storage) => {
  if (storage) return storage;
  return typeof window === 'undefined' ? null : window.localStorage;
};

export const readStoredValue = (key, fallback, storage) => {
  const target = getStorage(storage);
  if (!target) return fallback;

  try {
    const rawValue = target.getItem(key);
    return rawValue === null ? fallback : JSON.parse(rawValue);
  } catch {
    return fallback;
  }
};

export const readStoredArray = (key, storage) => {
  const value = readStoredValue(key, [], storage);
  return Array.isArray(value) ? value : [];
};

export const writeStoredValue = (key, value, storage) => {
  const target = getStorage(storage);
  if (!target) return false;

  try {
    target.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeStoredValue = (key, storage) => {
  const target = getStorage(storage);
  if (!target) return;

  try {
    target.removeItem(key);
  } catch {
    // Storage can be unavailable in private browsing or under browser policy.
  }
};

export const sumCartQuantity = (cart) =>
  Array.isArray(cart)
    ? cart.reduce((total, item) => total + (Number.isFinite(item?.quantity) ? item.quantity : 0), 0)
    : 0;

export const calculateCartSummary = (cart, expressDelivery = false) => {
  const subtotal = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (Number(item?.price) || 0) * (Number(item?.quantity) || 0), 0)
    : 0;
  const gst = Math.round(subtotal * 0.18);
  const deliveryCharge = expressDelivery ? 49 : 0;

  return {
    subtotal,
    gst,
    deliveryCharge,
    expressDelivery: Boolean(expressDelivery),
    total: subtotal + gst + deliveryCharge,
  };
};

export const shouldCreateNotification = (profile, preference) =>
  !preference || profile?.notifications?.[preference] !== false;
