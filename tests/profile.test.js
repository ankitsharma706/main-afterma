import test from 'node:test';
import assert from 'node:assert/strict';

import { getProfileInitials, loadProfile, normalizeProfile } from '../utils/profile.js';
import { isValidFutureDate, isValidTime } from '../utils/safety.js';
import { getActivitySummary } from '../utils/recoveryReport.js';
import { removePeriodLog, upsertPeriodLog } from '../utils/periodLogs.js';
import { getGhostSafeLogs, getGhostSafeProfile } from '../utils/ghostMode.js';
import { getExternalHref, getTelephoneHref } from '../utils/links.js';

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

test('rescheduling accepts only valid 24-hour times', () => {
  assert.equal(isValidTime('09:30'), true);
  assert.equal(isValidTime('23:59'), true);
  assert.equal(isValidTime('24:00'), false);
  assert.equal(isValidTime('9:30'), false);
  assert.equal(isValidTime('tomorrow'), false);
});

test('recovery report activity summary is derived from configured completed activities', () => {
  assert.deepEqual(
    getActivitySummary([{ id: 'one' }, { id: 'two' }], ['one', 'unknown']),
    { completed: 1, total: 2, percentage: 50 },
  );
  assert.deepEqual(getActivitySummary([], ['one']), { completed: 0, total: 0, percentage: null });
});

test('period observations can be created, corrected, and deleted without losing other entries', () => {
  const existing = [{ id: 'one', notes: 'old' }, { id: 'two', notes: 'keep' }];
  const corrected = upsertPeriodLog(existing, { id: 'one', notes: 'updated' });

  assert.deepEqual(corrected, [{ id: 'one', notes: 'updated' }, { id: 'two', notes: 'keep' }]);
  assert.deepEqual(upsertPeriodLog(corrected, { id: 'three' }), [
    { id: 'three' },
    { id: 'one', notes: 'updated' },
    { id: 'two', notes: 'keep' },
  ]);
  assert.deepEqual(removePeriodLog(corrected, 'one'), [{ id: 'two', notes: 'keep' }]);
});

test('ghost mode hides saved activity across in-app views without mutating stored profile data', () => {
  const profile = {
    incognito: true,
    completedActivities: ['activity-1'],
    periodLogs: [{ id: 'period-1' }],
    wellnessCheckIns: [{ id: 'checkin-1' }],
    journalEntries: [{ id: 'journal-1' }],
  };

  assert.deepEqual(getGhostSafeProfile(profile), {
    ...profile,
    completedActivities: [],
    periodLogs: [],
    wellnessCheckIns: [],
    journalEntries: [],
  });
  assert.deepEqual(getGhostSafeLogs([{ id: 'log-1' }], profile), []);
  assert.equal(profile.periodLogs.length, 1);
  assert.deepEqual(getGhostSafeProfile({ incognito: false, journalEntries: [{ id: 'saved' }] }).journalEntries, [{ id: 'saved' }]);
});

test('support links accept HTTPS destinations and valid phone contacts only', () => {
  assert.equal(getExternalHref('sangath.in'), 'https://sangath.in/');
  assert.equal(getExternalHref('https://example.org/help'), 'https://example.org/help');
  assert.equal(getExternalHref('javascript:alert(1)'), null);
  assert.equal(getExternalHref('#'), null);
  assert.equal(getTelephoneHref('080-2555-5555'), 'tel:080-2555-5555');
  assert.equal(getTelephoneHref('Verified'), null);
});
