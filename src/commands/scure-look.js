const { isEmptyArg } = require('../lib/common');
const { responses } = require('./look/responses');

const ROOM_SYNS = ['habitación', 'habitacion', 'lugar', 'lugares', 'room', 'rooms', 'space', 'place'];

const isInInventory = (scure, item, data) => scure.items.isInInventory(item.id, data.inventory);
const isInLocation = (item, roomId) =>
  (item.location === null) || (roomId === item.location && item.location !== null);

const itemIsNotFound = (scure, data, roomId, item) =>
  !item || (!isInInventory(scure, item, data) && !isInLocation(item, roomId));

const currentRoom = data => data.roomId;

const isLookingTheRoom = itemName => (ROOM_SYNS.indexOf(itemName) >= 0);

const scureLook = (itemName, data, scure) => {
  const roomId = currentRoom(data);
  const item = scure.items.getBestItem(itemName, data, scure);
  if (isEmptyArg(itemName) || isLookingTheRoom(itemName)) {
    return responses.lookRoom(scure, data, roomId);
  }
  if (itemIsNotFound(scure, data, roomId, item)) {
    return responses.itemNotFound(scure);
  }
  return responses.itemDescription(scure, data, item);
};

exports.scureLook = scureLook;
