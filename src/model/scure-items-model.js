const { isEmptyArg } = require('../lib/common');
const { isTextEqual } = require('../scure-commons');
const { isSynonym } = require('../scure-commons');


class ScureItemsModel {
  constructor(items) {
    this.items = items;
  }

  getItem(id) {
    return this.items.find(i => i.id === id);
  }

  getItemByName(name) {
    if (isEmptyArg(name)) return null;
    return this.items.find(i => isTextEqual(i.name, name) || isSynonym(i.synonyms, name));
  }

  getItemByNameAndRoom(name, roomId) {
    if (isEmptyArg(name)) return null;
    return this.items.find(i =>
      (isTextEqual(i.name, name) || isSynonym(i.synonyms, name))
      && (i.location === roomId));
  }

  getBestItem(itemName, roomId) {
    const exactItemFromRoom = this.getItemByNameAndRoom(itemName, roomId);
    if (exactItemFromRoom) return exactItemFromRoom;
    return this.getItemByName(itemName);
  }

  isInInventory(itemId, inventory) {
    if (!inventory) return false;
    if (!this.getItem(itemId)) return false;
    if (typeof inventory.length !== 'number') return false;
    return inventory.indexOf(itemId) >= 0;
  }

  isPicked(itemId, picked) {
    if (!picked) return false;
    if (!this.getItem(itemId)) return false;
    if (typeof picked.length !== 'number') return false;
    return picked.indexOf(itemId) >= 0;
  }
}

exports.ScureItems = ScureItemsModel;
