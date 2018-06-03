const { stateIsUnlocked } = require('./state-locks');

const matchesCondition = (data, scure) => (condition) => {
  if (condition.indexOf(':') === -1) return true;
  const [operator, itemId] = condition.split(':', 2);
  const isNegated = operator.startsWith('!');
  if (operator === 'picked' || operator === '!picked') {
    const isPicked = scure.items.isPicked(itemId, data.picked);
    return (isNegated && !isPicked) || (!isNegated && isPicked);
  }
  if (operator === 'unlocked' || operator === '!unlocked') {
    const isFree = stateIsUnlocked(data, itemId);
    return (isNegated && !isFree) || (!isNegated && isFree);
  }
  return true;
};

exports.matchesCondition = matchesCondition;
