const { stateUnlock, stateIsUnlocked, stateLock } = require('../../src/lib');

describe('scure locks are handled and the lib is exposed', () => {
  it('checks if unlocked', () => {
    const data = {};

    expect(stateIsUnlocked(data, 'aLock')).to.equal(false);
  });

  it('unlocks', () => {
    const data = {};

    stateUnlock(data, 'aLock');

    expect(stateIsUnlocked(data, 'aLock')).to.equal(true);
  });

  it('locks', () => {
    const data = {};
    stateUnlock(data, 'aLock');

    stateLock(data, 'aLock');

    expect(stateIsUnlocked(data, 'aLock')).to.equal(false);
  });

  it('locks when it was not locked before', () => {
    const data = {};

    stateLock(data, 'aLock');

    expect(stateIsUnlocked(data, 'aLock')).to.equal(false);
  });
});