const stateUnlock = (data, lock) => {
  if (!data.unlocked) data.unlocked = [];
  if (data.unlocked.indexOf(lock) === -1) {
    data.unlocked.push(lock);
  }
};

const stateIsUnlocked = (data, lock) =>
  (typeof data.unlocked !== 'undefined') && (data.unlocked.indexOf(lock) >= 0);

exports.stateUnlock = stateUnlock;
exports.stateIsUnlocked = stateIsUnlocked;
