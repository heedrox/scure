const { isEmptyArg } = require('../lib/common');
const { responses } = require('./pickup/responses');
const { matchesCondition } = require('../lib/conditions-evaluator');

const addToInventory = (data, itemId) => {
  data.inventory = data.inventory || [];
  data.inventory.push(itemId);
  data.picked = data.picked || [];
  data.picked.push(itemId);
  return data;
};


const isNotPickableBecauseCondition = (item, data, scure) =>
  item.pickable.isPickingCondition && !matchesCondition(data, scure)(item.pickable.condition);

const isNotPickable = item =>
  !item.pickable.isPickingCondition && !item.pickable;

const scurePickup = (itemName, data, scure) => {
  const { roomId } = data;
  const item = scure.items.getItemByName(itemName);

  if (isEmptyArg(itemName)) {
    return responses.unknown(scure);
  } else if (!item) {
    return responses.notSeen(scure, itemName);
  } else if (roomId !== item.location) {
    return responses.notSeen(scure, item.name.toLowerCase());
  } else if (scure.items.isInInventory(item.id, data.inventory)) {
    return responses.alreadyInInventory(scure, item);
  } else if (isNotPickableBecauseCondition(item, data, scure)) {
    return responses.itemNotPickableBecauseCondition(scure, item);
  } else if (isNotPickable(item)) {
    return responses.itemNotPickable(scure, item);
  } if (scure.items.isPicked(item.id, data.picked)) {
    return responses.alreadyPicked(scure, item);
  }
  addToInventory(data, item.id);
  return responses.pickedUp(scure, data, item);
};

exports.scurePickup = scurePickup;
