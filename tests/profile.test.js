import test from 'node:test';
import assert from 'node:assert/strict';

import { getProfileInitials, loadProfile, normalizeProfile } from '../utils/profile.js';
import { isValidFutureDate } from '../utils/safety.js';

const createStorage = (entries = {}) => ({
  store: { ...entries },
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
});

test('normalizeProfile preserves nested defaults when saved data is partial', () => {
  const profile = normalizeProfile({
    name: 'Aditi Sharma',
    journeySettings: { language: 'hindi' },
    notifications: { moodCheckins: false },
    completedActivities: ['activity-1'],
  });

  assert.equal(profile.name, 'Aditi Sharma');
  assert.equal(profile.journeySettings.language, 'hindi');
  assert.deepEqual(profile.journeySettings.goals, ['improve strength', 'stabilize mood']);
  assert.equal(profile.notifications.moodCheckins, false);
  assert.equal(profile.notifications.exerciseReminders, true);
  assert.equal(profile.journeySettings.dailyCommitmentMinutes, 15);
  assert.deepEqual(profile.completedActivities, ['activity-1']);
  assert.equal(profile.caregiver.permissions.canViewMedicalHistory, false);
});

test('loadProfile ignores malformed localStorage payloads and returns fallback values', () => {
  const storage = createStorage({ afterma_profile_v4: '{bad json' });
  const profile = loadProfile(storage);

  assert.equal(profile.name, 'Guest');
  assert.deepEqual(profile.completedActivities, []);
  assert.equal(profile.journeySettings.pace, 'gentle');
});

test('getProfileInitials returns safe initials for empty or multi-word names', () => {
  assert.equal(getProfileInitials('Aditi Sharma'), 'AS');
  assert.equal(getProfileInitials('  '), 'G');
  assert.equal(getProfileInitials('M'), 'M');
});

test('isValidFutureDate rejects malformed, past, and impossible dates', () => {
  const now = new Date(2026, 10, 20, 12);
  assert.equal(isValidFutureDate('2026-11-21', now), true);
  assert.equal(isValidFutureDate('2026-11-20', now), false);
  assert.equal(isValidFutureDate('2026-02-30', now), false);
  assert.equal(isValidFutureDate('11/21/2026', now), false);
  assert.equal(isValidFutureDate('', now), false);
});
