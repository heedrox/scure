const { buildUsageIndex } = require('../scure-commons');

const increaseUsageIndex = (index, usages) => {
  if (JSON.stringify(usages) === '[]') usages = {};
  if (typeof usages !== 'object') usages = {};
  if (!usages) usages = {};
  usages[index] = (usages[index] + 1) || 1;
  return usages;
};

class ScureUsagesModel {
  constructor(usages) {
    this.usages = usages;
  }

  getByItemId(itemId) {
    return this.usages.find(i => i.items === itemId);
  }

  getByItemIds(itemId1, itemId2) {
    const containsBoth = i => (i.items.indexOf(itemId1) >= 0 && i.items.indexOf(itemId2) >= 0);
    return this.usages.find(containsBoth);
  }

  isUsed(itemId, usages) {
    if (!usages) return false;
    if (!this.getByItemId(itemId)) return false;
    if (!usages[itemId]) return false;
    return usages[itemId] >= 1;
  }

  isUsedCombination(itemId1, itemId2, usages) {
    if (!usages) return false;
    if (!this.getByItemIds(itemId1, itemId2)) return false;
    const usageIndex = buildUsageIndex(itemId1, itemId2);
    return usages[usageIndex] >= 1;
  }

  increaseUsage(item, usages) {
    if (!this.getByItemId(item.id)) return false;
    return increaseUsageIndex(item.id, usages);
  }

  increaseUsageForTwo(item1, item2, usages) {
    if (!this.getByItemIds(item1.id, item2.id)) return false;
    const usageIndex = buildUsageIndex(item1.id, item2.id);
    return increaseUsageIndex(usageIndex, usages);
  }
}

exports.ScureUsages = ScureUsagesModel;
