import assert from 'node:assert/strict';
import { isPrivateOrLoopbackIp, verifyUrlSafe } from '../src/utils/ssrfValidator.js';
import { calculateTimezoneAwareStreak } from '../src/utils/streakCalculator.js';

const runTests = async () => {
  let passedCount = 0;

  assert.equal(isPrivateOrLoopbackIp('127.0.0.1'), true, 'Should detect 127.0.0.1 as private');
  assert.equal(isPrivateOrLoopbackIp('localhost'), true, 'Should detect localhost as private');
  assert.equal(isPrivateOrLoopbackIp('192.168.1.1'), true, 'Should detect 192.168.x as private');
  assert.equal(isPrivateOrLoopbackIp('10.0.0.5'), true, 'Should detect 10.x as private');
  assert.equal(isPrivateOrLoopbackIp('8.8.8.8'), false, 'Should allow public IP 8.8.8.8');
  passedCount++;

  const ssrfResult = await verifyUrlSafe('http://127.0.0.1:5000/api/health');
  assert.equal(ssrfResult.isValid, false, 'Localhost request must be rejected');
  assert.match(ssrfResult.error || '', /SSRF Protection/, 'Error should mention SSRF');
  passedCount++;

  const validResult = await verifyUrlSafe('https://github.com');
  assert.equal(validResult.isValid, true, 'Public github URL should be valid');
  assert.equal(validResult.httpStatus, 200, 'HTTP status should be 200');
  passedCount++;

  const emptyStreak = calculateTimezoneAwareStreak([], 'Asia/Jakarta', 2);
  assert.equal(emptyStreak.streakDays, 0);
  assert.equal(emptyStreak.streakFreezeLeft, 2);
  passedCount++;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const activeStreak = calculateTimezoneAwareStreak([today, yesterday, twoDaysAgo], 'Asia/Jakarta', 2);
  assert.ok(activeStreak.streakDays >= 3, 'Streak should be at least 3 days');
  assert.equal(activeStreak.totalActiveDays, 3);
  passedCount++;

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);
  const freezeStreak = calculateTimezoneAwareStreak([today, threeDaysAgo], 'Asia/Jakarta', 2);
  assert.ok(freezeStreak.streakFreezeLeft < 2, 'Freeze count should be consumed when gap exists');
  passedCount++;

  console.log(`\n✅ All ${passedCount} unit test suites passed successfully!`);
};

runTests().catch((err) => {
  console.error('❌ Unit test suite failed:', err);
  process.exit(1);
});
