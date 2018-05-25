const { addItemIdTo } = require('../scure-commons');
const { stateUnlock } = require('./state-locks');

const unlockIfUnlockingAction = (response, data) => {
  if (response.isUnlockingAction) {
    stateUnlock(data, response.lock);
  }
  return data;
};

const pickIfPickingAction = (response, data) => {
  if (response.isPickingAction) {
    addItemIdTo(response.itemId, data, 'picked');
    addItemIdTo(response.itemId, data, 'inventory');
  }
  return data;
};

const setContextIfExpectingAction = (response, data) => {
  if (response.isExpectingAnswerAction) {
    data.lastContext = 'expecting-answer';
    data.question = response.question;
  }
  return data;
};

const resolveActions = (response, data) => {
  data = unlockIfUnlockingAction(response, data);
  data = pickIfPickingAction(response, data);
  data = setContextIfExpectingAction(response, data);
  return data;
};

exports.resolveActions = resolveActions;
