import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateCartSummary,
  readStoredArray,
  readStoredValue,
  shouldCreateNotification,
  sumCartQuantity,
  writeStoredValue,
} from '../utils/persistence.js';

const createStorage = (entries = {}) => ({
  store: { ...entries },
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
});

test('stored app state safely loads arrays and falls back on malformed values', () => {
  const storage = createStorage({
    cart: JSON.stringify([{ id: 'item-1', quantity: 2 }]),
    invalid: '{broken',
    object: JSON.stringify({ items: [] }),
  });

  assert.deepEqual(readStoredArray('cart', storage), [{ id: 'item-1', quantity: 2 }]);
  assert.deepEqual(readStoredArray('invalid', storage), []);
  assert.deepEqual(readStoredArray('object', storage), []);
  assert.equal(readStoredValue('missing', false, storage), false);
});

test('cart quantity and checkout totals include every unit and express delivery', () => {
  const cart = [
    { id: 'item-1', price: 100, quantity: 3 },
    { id: 'item-2', price: 50, quantity: 1 },
  ];

  assert.equal(sumCartQuantity(cart), 4);
  assert.deepEqual(calculateCartSummary(cart, true), {
    subtotal: 350,
    gst: 63,
    deliveryCharge: 49,
    expressDelivery: true,
    total: 462,
  });
  assert.equal(calculateCartSummary(cart, false).total, 413);
});

test('cart and appointment state can be saved across app sessions', () => {
  const storage = createStorage();
  const appointments = [{ id: 'appointment-1', status: 'Upcoming' }];

  assert.equal(writeStoredValue('appointments', appointments, storage), true);
  assert.deepEqual(readStoredArray('appointments', storage), appointments);
});

test('notification preferences suppress only their matching notification category', () => {
  const profile = { notifications: { careConnectUpdates: false, moodCheckins: true } };

  assert.equal(shouldCreateNotification(profile, 'careConnectUpdates'), false);
  assert.equal(shouldCreateNotification(profile, 'moodCheckins'), true);
  assert.equal(shouldCreateNotification(profile, undefined), true);
});
