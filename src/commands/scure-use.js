const { isEmptyArg } = require('../lib/common');
const { aResponse } = require('../scure-response');
const { buildUsageIndex, getDescription, getConsumesObjects, addItemIdTo } = require('../scure-commons');
const { resolveActions } = require('../lib/process-actions');
const { handlePluginExtensions } = require('../lib/plugin-executor');

const getUsedTimes = (item, usages) =>
  (usages && usages[item.id]) || 0;
const getUsedTimesForTwo = (item1, item2, usages) =>
  (usages && usages[buildUsageIndex(item1.id, item2.id)]) || 0;
const currentResponse = (item, usage, usages) =>
  usage.response[getUsedTimes(item, usages) % usage.response.length];
const currentResponseForTwo = (item1, item2, usage, usages) =>
  usage.response[getUsedTimesForTwo(item1, item2, usages) % usage.response.length];

const isAction = response =>
  response.isUnlockingAction || response.isPickingAction || response.isExpectingAnswerAction;

const getSentenceFor = (data, scure) => response =>
  handlePluginExtensions(isAction(response) ? response.response : response, data, scure);


const disposeIfItemInInventory = (itemId, data, scure) => {
  const newData = data;
  const isInInventory = scure.items.isInInventory(itemId, data.inventory);
  if (isInInventory) {
    newData.inventory.splice(newData.inventory.indexOf(itemId), 1);
  }
  return newData;
};


const markAsPickedIfPickableObjectButUsed = (item, data) => {
  const newData = data;
  if (item.pickable) {
    addItemIdTo(item.id, data, 'picked');
  }
  return newData;
};

const validateUsability = (itemNames, data, scure) => {
  if (itemNames && itemNames.length === 0) {
    return scure.sentences.get('use-noarg');
  }
  for (let idx = 0; idx < itemNames.length; idx += 1) {
    const itemName = itemNames[idx];
    if (isEmptyArg(itemName)) {
      return scure.sentences.get('use-noarg');
    }
    const item = scure.items.getBestItem(itemName, data);
    if (!item) {
      return scure.sentences.get('use-cant', { item: itemName });
    }
    const isInInventory = scure.items.isInInventory(item.id, data.inventory);
    const inLocation = ((item.location === data.roomId) &&
      (item.location !== null)) || (item.location === null);
    if (!isInInventory && !inLocation) {
      return scure.sentences.get('use-cant', { item: itemName });
    }
  }
  return null;
};

const shouldDisposeItem = (usage, rawResponse, data, scure) => {
  if (!rawResponse.isConditional) return usage.onlyOnce;
  return getConsumesObjects(rawResponse.conditions, data, scure);
};

const processItemAfterUsage = (item, usage, rawResponse, response, data, scure) => {
  data = markAsPickedIfPickableObjectButUsed(item, data);
  if (shouldDisposeItem(usage, rawResponse, data, scure)) {
    data = disposeIfItemInInventory(item.id, data, scure);
  }
  return data;
};

const processIfConditionalResponse = (response, data, scure) => {
  if (response.isConditional) {
    return getDescription(response.conditions, data, scure);
  }
  return response;
};

const scureUseOneItem = (itemName, data, scure) => {
  const item = scure.items.getBestItem(itemName, data);
  const usage = scure.usages.getByItemId(item.id);
  if (!usage) {
    return aResponse(scure.sentences.get('use-cant', { item: itemName }));
  }
  if (usage.onlyOnce && scure.usages.isUsed(item.id, data.usages)) {
    return aResponse(scure.sentences.get('use-onlyonce'));
  }
  const rawResponse = currentResponse(item, usage, data.usages);
  const response = processIfConditionalResponse(rawResponse, data, scure);
  data = resolveActions(response, data);
  data = processItemAfterUsage(item, usage, rawResponse, response, data, scure);
  data.usages = scure.usages.increaseUsage(item, data.usages);
  const getSentence = getSentenceFor(data, scure);
  return aResponse(getSentence(response), data);
};

const scureUseTwoItems = (itemName1, itemName2, data, scure) => {
  const item1 = scure.items.getBestItem(itemName1, data);
  const item2 = scure.items.getBestItem(itemName2, data);
  if (!item1 || !item2) {
    return aResponse(scure.sentences.get('use-canttwo', { item1: itemName1, item2: itemName2 }));
  }
  const usage = scure.usages.getByItemIds(item1.id, item2.id);
  if (!usage) {
    return aResponse(scure.sentences.get('use-canttwo', { item1: itemName1, item2: itemName2 }));
  }
  const haveBeenUsedTogether = scure.usages.isUsedCombination(item1.id, item2.id, data.usages);
  if (usage.onlyOnce && haveBeenUsedTogether) {
    return aResponse(scure.sentences.get('use-onlyonce-two'));
  }
  const rawResponse = currentResponseForTwo(item1, item2, usage, data.usages);
  const response = processIfConditionalResponse(rawResponse, data, scure);
  data = resolveActions(response, data);
  data = processItemAfterUsage(item1, usage, rawResponse, response, data, scure);
  data = processItemAfterUsage(item2, usage, rawResponse, response, data, scure);
  data.usages = scure.usages.increaseUsageForTwo(item1, item2, data.usages);
  const getSentence = getSentenceFor(data, scure);
  return aResponse(getSentence(response), data);
};

const scureUse = (itemNames, data, scure) => {
  const invalidationSentence = validateUsability(itemNames, data, scure);
  if (invalidationSentence) {
    return aResponse(invalidationSentence, data);
  }
  return (itemNames.length === 1) ?
    scureUseOneItem(itemNames[0], data, scure) :
    scureUseTwoItems(itemNames[0], itemNames[1], data, scure);
};

exports.scureUse = scureUse;
