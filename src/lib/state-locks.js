const stateUnlock = (data, lock) => {
  if (!data.unlocked) data.unlocked = [];
  if (data.unlocked.indexOf(lock) === -1) {
    data.unlocked.push(lock);
  }
};

const stateLock = (data, lock) => {
  if (!data.unlocked) data.unlocked = [];
  data.unlocked = data.unlocked.filter(l => l !== lock);
};

const stateIsUnlocked = (data, lock) =>
  (typeof data.unlocked !== 'undefined') && (data.unlocked.indexOf(lock) >= 0);

exports.stateUnlock = stateUnlock;
exports.stateLock = stateLock;
exports.stateIsUnlocked = stateIsUnlocked;
