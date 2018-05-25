const { aResponse } = require('../scure-response');
const { joinMultipleStrings } = require('../scure-commons');

const scureInventory = (data, scure) => {
  if (!data.inventory) {
    return aResponse(scure.sentences.get('inventory-nothing'));
  }
  const itemIds = data.inventory.slice();
  const itemNames = itemIds.map(id => scure.items.getItem(id).name);
  const items = joinMultipleStrings(itemNames, data.language);
  const inventoryExplain = scure.sentences.get('inventory', { items });
  return aResponse(inventoryExplain);
};

exports.scureInventory = scureInventory;
